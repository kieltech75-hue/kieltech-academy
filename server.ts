import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '16kb' }));

const emailActionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many email requests. Please try again later.' },
});

const emailActionResponse = 'If the account is eligible, an email with the requested link will be sent.';
const ownerActionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many owner-management requests. Please try again later.' },
});

function getFirebaseAdminAuth() {
  if (getApps().length === 0) {
    initializeApp({
      credential: applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID || 'kieltech',
    });
  }
  return getAuth();
}

function getFirebaseAdminFirestore() {
  getFirebaseAdminAuth();
  return getFirestore();
}

type AccountRole = 'student' | 'faculty' | 'admin' | 'owner';

function normalizeRole(role: unknown): AccountRole {
  if (role === 'CEO & Founder') return 'owner';
  return role === 'admin' || role === 'faculty' ? role : 'student';
}

function normalizeLegacyRole(role: unknown): AccountRole {
  return role === 'admin' || role === 'faculty' ? role : 'student';
}

async function getAccountRole(uid: string): Promise<AccountRole> {
  const db = getFirebaseAdminFirestore();
  const roleSnapshot = await db.collection('user_roles').doc(uid).get();
  if (roleSnapshot.exists) return normalizeRole(roleSnapshot.data()?.role);

  const legacyProfile = await db.collection('users').doc(uid).get();
  return normalizeLegacyRole(legacyProfile.data()?.role);
}

async function verifyBearerToken(authorization: string | undefined) {
  if (!authorization?.startsWith('Bearer ')) return null;
  return getFirebaseAdminAuth().verifyIdToken(authorization.slice(7), true);
}

function isInvalidAuthToken(error: unknown): boolean {
  const code = (error as { code?: unknown })?.code;
  return typeof code === 'string' && [
    'auth/argument-error',
    'auth/id-token-expired',
    'auth/id-token-revoked',
    'auth/invalid-id-token',
    'auth/user-disabled',
    'auth/user-not-found',
  ].includes(code);
}

async function getOwnerRequest(req: express.Request) {
  const decoded = await verifyBearerToken(req.get('authorization'));
  if (!decoded) return null;

  const authAdmin = getFirebaseAdminAuth();
  const account = await authAdmin.getUser(decoded.uid);
  if (!account.providerData.some((provider) => provider.providerId === 'google.com')) return null;
  if (await getAccountRole(decoded.uid) !== 'owner') return null;
  return { uid: decoded.uid, authAdmin, db: getFirebaseAdminFirestore() };
}

async function getDocumentsInBatches(
  db: FirebaseFirestore.Firestore,
  references: FirebaseFirestore.DocumentReference[],
): Promise<FirebaseFirestore.DocumentSnapshot[]> {
  const snapshots: FirebaseFirestore.DocumentSnapshot[] = [];
  for (let start = 0; start < references.length; start += 500) {
    snapshots.push(...await db.getAll(...references.slice(start, start + 500)));
  }
  return snapshots;
}

app.get('/api/account/role', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    const decoded = await verifyBearerToken(req.get('authorization'));
    if (!decoded) {
      res.status(401).json({ error: 'Sign in to load your account role.' });
      return;
    }
    res.json({ role: await getAccountRole(decoded.uid) });
  } catch (error) {
    if (isInvalidAuthToken(error)) {
      res.status(401).json({ error: 'Your sign-in has expired. Sign in again to load your account role.' });
      return;
    }
    console.error('Could not load the signed-in account role:', error);
    res.status(500).json({ error: 'The account role could not be loaded.' });
  }
});

app.get('/api/owner/users', ownerActionRateLimit, async (req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    const owner = await getOwnerRequest(req);
    if (!owner) {
      res.status(403).json({ error: 'Only the Google-linked owner account can manage administrators.' });
      return;
    }

    const pageToken = typeof req.query.pageToken === 'string' ? req.query.pageToken : undefined;
    const authPage = await owner.authAdmin.listUsers(1000, pageToken);
    const googleUsers = authPage.users.filter((account) => (
      account.providerData.some((provider) => provider.providerId === 'google.com')
    ));
    const roleSnapshots = await getDocumentsInBatches(
      owner.db,
      googleUsers.map((account) => owner.db.collection('user_roles').doc(account.uid)),
    );
    const missingRoleUsers = googleUsers.filter((_, index) => !roleSnapshots[index].exists);
    const legacyProfiles = await getDocumentsInBatches(
      owner.db,
      missingRoleUsers.map((account) => owner.db.collection('users').doc(account.uid)),
    );
    const legacyRoles = new Map(missingRoleUsers.map((account, index) => [
      account.uid,
      normalizeLegacyRole(legacyProfiles[index].data()?.role),
    ]));

    res.json({
      users: googleUsers.map((account, index) => ({
        uid: account.uid,
        email: account.email || '',
        displayName: account.displayName || '',
        photoURL: account.photoURL || '',
        role: roleSnapshots[index].exists
          ? normalizeRole(roleSnapshots[index].data()?.role)
          : legacyRoles.get(account.uid) || 'student',
      })),
      nextPageToken: authPage.pageToken || null,
    });
  } catch (error) {
    if (isInvalidAuthToken(error)) {
      res.status(401).json({ error: 'Your sign-in has expired. Sign in again to manage administrators.' });
      return;
    }
    console.error('Could not load owner user-management records:', error);
    res.status(500).json({ error: 'Users could not be loaded.' });
  }
});

app.put('/api/owner/users/:uid/role', ownerActionRateLimit, async (req, res) => {
  try {
    const owner = await getOwnerRequest(req);
    if (!owner) {
      res.status(403).json({ error: 'Only the Google-linked owner account can manage administrators.' });
      return;
    }

    const targetUid = req.params.uid;
    const requestedRole = req.body?.role;
    if (!targetUid || targetUid === owner.uid) {
      res.status(400).json({ error: 'You cannot change your own owner account role.' });
      return;
    }
    if (requestedRole !== 'admin' && requestedRole !== 'student') {
      res.status(400).json({ error: 'Roles can only be changed to admin or student.' });
      return;
    }

    let targetAccount;
    try {
      targetAccount = await owner.authAdmin.getUser(targetUid);
    } catch (error) {
      if (isInvalidAuthToken(error)) {
        res.status(401).json({ error: 'Your sign-in has expired. Sign in again to manage administrators.' });
        return;
      }
      if ((error as { code?: string }).code === 'auth/user-not-found') {
        res.status(404).json({ error: 'The account could not be found.' });
        return;
      }
      throw error;
    }
    if (!targetAccount.providerData.some((provider) => provider.providerId === 'google.com')) {
      res.status(400).json({ error: 'Only accounts linked to Google can be made administrators.' });
      return;
    }

    const roleRef = owner.db.collection('user_roles').doc(targetUid);
    await owner.db.runTransaction(async (transaction) => {
      const currentRole = await transaction.get(roleRef);
      if (currentRole.data()?.role === 'CEO & Founder' || currentRole.data()?.role === 'owner') {
        throw new Error('Owner roles cannot be changed from this page.');
      }
      transaction.set(roleRef, {
        role: requestedRole,
        updatedAt: new Date().toISOString(),
        updatedBy: owner.uid,
      });
    });
    res.json({ uid: targetUid, role: requestedRole });
  } catch (error) {
    if (error instanceof Error && error.message === 'Owner roles cannot be changed from this page.') {
      res.status(403).json({ error: error.message });
      return;
    }
    console.error('Could not update administrator role:', error);
    res.status(500).json({ error: 'The role change could not be saved.' });
  }
});

function getMailer() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass || !from || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('SMTP settings are incomplete or invalid.');
  }

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure,
      requireTLS: !secure,
      auth: { user, pass },
    }),
    from: {
      name: process.env.SMTP_FROM_NAME || 'KielTech Academy',
      address: from,
    },
  };
}

async function sendAuthEmail(
  to: string,
  subject: string,
  actionLabel: string,
  link: string,
  mailer: ReturnType<typeof getMailer> = getMailer(),
) {
  await mailer.transporter.sendMail({
    from: mailer.from,
    to,
    subject,
    text: `${actionLabel}\n\nOpen this link to continue:\n${link}\n\nIf you did not request this email, you can ignore it.`,
    html: `<p>${actionLabel}</p><p><a href="${link}">${actionLabel}</a></p><p>If you did not request this email, you can ignore it.</p>`,
  });
}

app.post('/api/auth/email-action', emailActionRateLimit, async (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    res.status(400).json({ error: 'A valid email action is required.' });
    return;
  }

  const { action, email } = req.body as { action?: unknown; email?: unknown };
  const normalizedEmail = typeof email === 'string' ? email.trim() : '';
  if (action !== 'password-reset' && action !== 'verify-email') {
    res.status(400).json({ error: 'A valid email action is required.' });
    return;
  }

  if (action === 'password-reset'
    && (normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))) {
    res.status(400).json({ error: 'Enter a valid email address.' });
    return;
  }

  try {
    const mailer = getMailer();
    const authAdmin = getFirebaseAdminAuth();
    const continueUrl = process.env.AUTH_CONTINUE_URL;
    const actionCodeSettings = continueUrl ? { url: continueUrl } : undefined;

    if (action === 'password-reset') {
      try {
        const resetLink = await authAdmin.generatePasswordResetLink(normalizedEmail, actionCodeSettings);
        await sendAuthEmail(
          normalizedEmail,
          'Reset your KielTech Academy password',
          'Reset your password',
          resetLink,
          mailer,
        );
      } catch (error) {
        if ((error as { code?: string }).code === 'auth/user-not-found') {
          res.status(202).json({ message: emailActionResponse });
          return;
        }
        throw error;
      }
      res.status(202).json({ message: emailActionResponse });
      return;
    }

    const authorization = req.get('authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!token) {
      res.status(401).json({ error: 'Sign in to request an account verification email.' });
      return;
    }

    const decodedToken = await authAdmin.verifyIdToken(token, true);
    const account = await authAdmin.getUser(decodedToken.uid);
    if (!account.email || account.emailVerified) {
      res.status(200).json({ message: 'This account is already verified.' });
      return;
    }

    const verificationLink = await authAdmin.generateEmailVerificationLink(account.email, actionCodeSettings);
    await sendAuthEmail(
      account.email,
      'Verify your KielTech Academy email',
      'Verify your email address',
      verificationLink,
      mailer,
    );
    res.status(202).json({ message: 'Verification email sent.' });
  } catch (error) {
    console.error('Could not process the requested authentication email.');
    console.error(error);
    res.status(500).json({ error: 'The email could not be sent. Check the server SMTP and Firebase Admin configuration.' });
  }
});

app.all('/api/ai/*', (_req, res) => {
  res.status(410).json({ error: 'AI features are disabled.' });
});

const isDevelopment = process.argv.includes('--dev');
const serverDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = isDevelopment ? serverDirectory : resolve(serverDirectory, '..');

async function startServer() {
  if (isDevelopment) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDirectory = resolve(projectRoot, 'dist');
    app.use(express.static(distDirectory));
    app.get('*', (_req, res) => {
      res.sendFile(resolve(distDirectory, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`KielTech Academy server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error('Failed to start KielTech Academy server:', error);
  process.exitCode = 1;
});
