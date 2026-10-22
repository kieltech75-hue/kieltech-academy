import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Loader2, RefreshCw, Shield, ShieldCheck, UserRoundX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../lib/api';

type ManagedRole = 'student' | 'faculty' | 'admin' | 'owner';

interface ManagedUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: ManagedRole;
}

interface UsersResponse {
  users?: ManagedUser[];
  nextPageToken?: string | null;
  error?: string;
}

async function ownerRequest<T>(idToken: string, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      ...init?.headers,
    },
  });
  const result = response.headers.get('content-type')?.includes('application/json')
    ? await response.json() as T & { error?: string }
    : null;
  if (!response.ok) {
    throw new Error(result?.error || 'Owner management is unavailable. Deploy the Node backend and try again.');
  }
  if (!result) throw new Error('The owner-management service returned an invalid response.');
  return result;
}

export const OwnerManagementView: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [pageTokens, setPageTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyUid, setBusyUid] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async (pageToken?: string) => {
    if (!user) {
      setError('Sign in with the owner account to manage administrators.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      const query = pageToken ? `?pageToken=${encodeURIComponent(pageToken)}` : '';
      const response = await ownerRequest<UsersResponse>(token, `/api/owner/users${query}`);
      setUsers(response.users || []);
      setNextPageToken(response.nextPageToken || null);
    } catch (loadError) {
      console.error('Could not load owner-managed users:', loadError);
      setError(loadError instanceof Error ? loadError.message : 'Users could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const changeRole = async (account: ManagedUser, role: 'admin' | 'student') => {
    const action = role === 'admin' ? 'grant administrator access to' : 'remove administrator access from';
    if (!window.confirm(`Are you sure you want to ${action} ${account.email || account.uid}?`)) return;
    if (!user) return;

    setBusyUid(account.uid);
    setError(null);
    try {
      const token = await user.getIdToken();
      await ownerRequest<{ uid: string; role: ManagedRole }>(
        token,
        `/api/owner/users/${encodeURIComponent(account.uid)}/role`,
        {
          method: 'PUT',
          body: JSON.stringify({ role }),
        },
      );
      setUsers((current) => current.map((entry) => (
        entry.uid === account.uid ? { ...entry, role } : entry
      )));
    } catch (changeError) {
      console.error(`Could not change administrator access for ${account.uid}:`, changeError);
      setError(changeError instanceof Error ? changeError.message : 'The role change could not be saved.');
    } finally {
      setBusyUid(null);
    }
  };

  const filteredUsers = users.filter((account) => (
    `${account.displayName} ${account.email} ${account.uid}`.toLocaleLowerCase()
      .includes(search.trim().toLocaleLowerCase())
  ));
  const pageNumber = pageTokens.length + 1;

  return (
    <section className="mx-auto max-w-5xl space-y-6 pb-16">
      <header className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-900 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">CEO &amp; Founder controls</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Manage administrators</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Grant or remove administrator access for Google-linked accounts. Changes are written by
          the authenticated server to Firestore; browser clients cannot edit role records.
        </p>
        <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-amber-200/80">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <span>CEO &amp; Founder roles are never editable here. Your own account cannot be demoted from this page.</span>
        </p>
      </header>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-sm text-rose-200" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          aria-label="Search Google-linked users"
          className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, email, or Firebase UID"
          value={search}
        />
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800 disabled:opacity-50"
          disabled={loading}
          onClick={() => void loadUsers(pageTokens[pageTokens.length - 1])}
          type="button"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading Google-linked users…
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-400">
            {users.length ? 'No accounts match your search.' : 'No Google-linked accounts were found on this page.'}
          </p>
        ) : (
          <ul className="divide-y divide-slate-800">
            {filteredUsers.map((account) => {
              const isOwner = account.role === 'owner';
              const isAdmin = account.role === 'admin';
              const isFaculty = account.role === 'faculty';
              const isSelf = account.uid === user?.uid;
              const busy = busyUid === account.uid;
              return (
                <li key={account.uid} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    {account.photoURL ? (
                      <img alt="" className="h-10 w-10 rounded-xl object-cover" src={account.photoURL} />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
                        <Shield className="h-5 w-5" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {account.displayName || 'Google account'}{isSelf ? ' (you)' : ''}
                      </p>
                      <p className="truncate text-xs text-slate-400">{account.email || account.uid}</p>
                      <p className="mt-1 font-mono text-[10px] text-slate-500">UID: {account.uid}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      isOwner
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                        : isAdmin
                          ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                          : 'border-slate-700 bg-slate-950 text-slate-400'
                    }`}>
                      {isOwner ? 'CEO & Founder' : account.role}
                    </span>
                    {isOwner || isSelf ? (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <ShieldCheck className="h-4 w-4" /> Protected
                      </span>
                    ) : isFaculty ? (
                      <span className="text-xs text-slate-500">Faculty role unchanged</span>
                    ) : isAdmin ? (
                      <button
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/10 disabled:opacity-50"
                        disabled={busy}
                        onClick={() => void changeRole(account, 'student')}
                        type="button"
                      >
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserRoundX className="h-3.5 w-3.5" />}
                        Revoke admin
                      </button>
                    ) : (
                      <button
                        className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 px-3 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/10 disabled:opacity-50"
                        disabled={busy}
                        onClick={() => void changeRole(account, 'admin')}
                        type="button"
                      >
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                        Make admin
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <nav aria-label="User pages" className="flex items-center justify-between">
        <button
          className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 disabled:opacity-40"
          disabled={pageTokens.length === 0 || loading}
          onClick={() => {
            const previous = pageTokens.slice(0, -1);
            setPageTokens(previous);
            void loadUsers(previous[previous.length - 1]);
          }}
          type="button"
        >
          Previous
        </button>
        <span className="text-xs text-slate-500">Page {pageNumber}</span>
        <button
          className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 disabled:opacity-40"
          disabled={!nextPageToken || loading}
          onClick={() => {
            if (!nextPageToken) return;
            setPageTokens((current) => [...current, nextPageToken]);
            void loadUsers(nextPageToken);
          }}
          type="button"
        >
          Next
        </button>
      </nav>
    </section>
  );
};
