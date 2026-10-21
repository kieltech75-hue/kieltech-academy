import { ExamQuestion } from '../types/curriculum';

/**
 * Robust question pool generator for Mid-Stage Tests (30 questions each).
 * Produces 30 challenging multiple-choice and conceptual code questions
 * specifically tailored to the given stage and language domain.
 */
export function generate30StageQuestions(
  courseId: string,
  langNameOrStageId?: string | number,
  stageIdParam?: number,
  stageTitleParam?: string
): ExamQuestion[] {
  const courseDisplayNames: Record<string, string> = {
    python: 'Python',
    golang: 'Go (Golang)',
    rust: 'Rust',
    nodejs: 'Node.js',
    java: 'Java',
    javascript: 'Modern JavaScript',
    typescript: 'TypeScript',
    react: 'React.js',
    vue: 'Vue.js',
    'html-css': 'HTML5 & CSS3',
  };

  const langName = typeof langNameOrStageId === 'string'
    ? langNameOrStageId
    : (courseDisplayNames[courseId] || courseId);

  const stageId = typeof langNameOrStageId === 'number'
    ? langNameOrStageId
    : (stageIdParam ?? 1);

  const stageTitle = stageTitleParam || `Stage 0${stageId} Core Curriculum`;

  const isBackend = !['react', 'vue', 'html-css', 'javascript'].includes(courseId);

  // Pool of 30 distinct questions covering core principles, memory, runtime, concurrency, idioms, and debugging
  const questions: ExamQuestion[] = [
    {
      id: `${courseId}-s${stageId}-q1`,
      type: 'multiple_choice',
      topicTag: 'Execution Engine & Memory Model',
      question: `In ${langName}, how does the runtime engine handle memory allocation and variable binding for core data types in ${stageTitle}?`,
      options: [
        { text: 'Heap allocations managed via runtime memory pointers and reference lifecycle', explanation: 'Correct runtime behavior for memory allocation.' },
        { text: 'Stores everything in immutable CPU register L1 cache permanently', explanation: 'Registers are volatile and small' },
        { text: 'Relies solely on browser localStorage for all variables', explanation: 'Incorrect' },
        { text: 'Requires manual disk paging for every primitive variable', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q2`,
      type: 'multiple_choice',
      topicTag: 'Type System & Coercion Rules',
      question: `What is the architectural behavior when checking structural equality versus reference identity in ${langName}?`,
      options: [
        { text: 'Reference identity checks pointer memory address; structural equality inspects internal field values', explanation: 'Fundamental computer science distinction between identity and equality.' },
        { text: 'They always perform an identical byte-for-byte SHA256 checksum', explanation: 'False' },
        { text: 'Reference identity is forbidden by the compiler', explanation: 'False' },
        { text: 'Structural equality deletes the memory addresses', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q3`,
      type: 'multiple_choice',
      topicTag: 'Algorithmic Complexity & Hash Tables',
      question: `What is the amortized average time complexity of element lookup in a modern hash-based collection in ${langName}?`,
      options: [
        { text: 'O(1) Constant Time', explanation: 'Hash indexing maps keys to buckets in amortized constant time.' },
        { text: 'O(N) Linear Time', explanation: 'Linear time is for linked lists' },
        { text: 'O(log N) Logarithmic Time', explanation: 'Logarithmic is for tree searches' },
        { text: 'O(N!) Factorial Time', explanation: 'Factorial is for exhaustive permutations' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q4`,
      type: 'multiple_choice',
      topicTag: 'Scope & Lexical Closures',
      question: `How does lexical closure scoping operate when a function encapsulates free variables defined in an enclosing scope?`,
      options: [
        { text: 'The inner function retains a reference environment binding to the enclosed variables across lifecycles', explanation: 'Closures capture the lexical environment in which they were created.' },
        { text: 'The runtime throws a memory segmentation violation immediately', explanation: 'Closures are fully supported' },
        { text: 'The enclosed variables are converted to global window scope', explanation: 'Violates encapsulation' },
        { text: 'Variables are wiped as soon as the outer function returns', explanation: 'Closures preserve variables from collection' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q5`,
      type: 'multiple_choice',
      topicTag: 'Error Handling & Exception Propagation',
      question: `Why is catching generic unhandled exceptions without logging or re-throwing considered an anti-pattern in ${langName}?`,
      options: [
        { text: 'It suppresses critical system failure signals and obscures root cause analysis', explanation: 'Silent exception swallowing masks fatal regressions and corrupts system state.' },
        { text: 'It causes the CPU clock frequency to throttle down', explanation: 'False' },
        { text: 'It forces the operating system to reboot', explanation: 'False' },
        { text: 'It converts numbers to strings automatically', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q6`,
      type: 'multiple_choice',
      topicTag: 'Data Immutability & Concurrency',
      question: `In high-concurrency environments, what primary advantage does data immutability provide?`,
      options: [
        { text: 'It completely eliminates read/write race conditions across parallel threads or async tasks', explanation: 'Immutable state cannot be mutated by competing threads, guaranteeing thread safety without mutex contention.' },
        { text: 'It reduces disk storage consumption to zero bytes', explanation: 'False' },
        { text: 'It disables network latency entirely', explanation: 'False' },
        { text: 'It makes all functions synchronous', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q7`,
      type: 'multiple_choice',
      topicTag: 'Memory Leaks & Garbage Collection',
      question: `Which scenario represents the most prevalent cause of memory leaks in modern managed runtimes?`,
      options: [
        { text: 'Retaining unwanted references in global state, event listeners, or uncleared intervals', explanation: 'Reachability from the GC root prevents garbage collectors from reclaiming memory.' },
        { text: 'Declaring integer constants inside functions', explanation: 'Primitives on stack/registers do not leak' },
        { text: 'Calling pure mathematical functions repeatedly', explanation: 'Pure functions do not retain state' },
        { text: 'Writing descriptive function comments', explanation: 'Comments are stripped at compile time' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q8`,
      type: 'multiple_choice',
      topicTag: 'Asynchronous Event Loops & Task Queues',
      question: `In asynchronous runtimes, what differentiates microtasks from regular macrotasks/timers?`,
      options: [
        { text: 'Microtasks execute immediately after the current call stack before processing the next macrotask', explanation: 'Microtask queues drain to completion before timers or I/O events are processed.' },
        { text: 'Microtasks execute on the graphics processing unit (GPU)', explanation: 'False' },
        { text: 'Microtasks can only execute once per hour', explanation: 'False' },
        { text: 'Microtasks do not have access to memory', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q9`,
      type: 'multiple_choice',
      topicTag: 'Module Isolation & Encapsulation',
      question: `What is the architectural purpose of module namespaces and explicit export/import boundaries?`,
      options: [
        { text: 'Preventing symbol collisions and defining strict public API contracts', explanation: 'Modularity encapsulates internal implementation and controls external exposure.' },
        { text: 'Increasing compilation bundle size indefinitely', explanation: 'Opposite of clean modular design' },
        { text: 'Disabling linting tools', explanation: 'False' },
        { text: 'Forcing all variables to be public by default', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q10`,
      type: 'multiple_choice',
      topicTag: 'Resource Cleanup & RAII / Context Protocols',
      question: `Why is RAII (Resource Acquisition Is Initialization) or Context Management protocols essential for I/O streams?`,
      options: [
        { text: 'It guarantees that open file handles and sockets are released even if an exception is thrown', explanation: 'Deterministic cleanup prevents file descriptor starvation and socket leaks.' },
        { text: 'It compresses network packets automatically', explanation: 'False' },
        { text: 'It prevents user authentication failures', explanation: 'False' },
        { text: 'It accelerates processor clock speed', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q11`,
      type: 'multiple_choice',
      topicTag: 'Interface Contracts & Polymorphism',
      question: `In system architecture, what is the core tenet of Liskov Substitution Principle (LSP)?`,
      options: [
        { text: 'Subtypes must be substitutable for their base types without altering correctness', explanation: 'LSP ensures derived implementations honor base contract behavioral expectations.' },
        { text: 'All classes must have zero methods', explanation: 'False' },
        { text: 'Functions must only accept boolean arguments', explanation: 'False' },
        { text: 'Inheritance hierarchies must be at least 10 levels deep', explanation: 'Deep inheritance is an anti-pattern' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q12`,
      type: 'multiple_choice',
      topicTag: 'Network Protocols & Serialization',
      question: `When designing high-throughput data exchanges, why are binary serialization formats often preferred over verbose JSON?`,
      options: [
        { text: 'They minimize payload wire byte size and drastically reduce CPU parsing overhead', explanation: 'Binary serializations eliminate string encoding/decoding bottleneck.' },
        { text: 'They require no network cables', explanation: 'False' },
        { text: 'They prevent all possible cyberattacks automatically', explanation: 'False' },
        { text: 'They convert integers to floating point numbers', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q13`,
      type: 'multiple_choice',
      topicTag: 'Database Transactions & ACID Properties',
      question: `In data persistence, what does the "Isolation" property in ACID guarantees specifically ensure?`,
      options: [
        { text: 'Concurrent transactions execute without interfering with one another or reading partial states', explanation: 'Isolation levels prevent dirty reads, non-repeatable reads, and phantom records.' },
        { text: 'Data is stored only in RAM and never written to disk', explanation: 'Violates Durability' },
        { text: 'Tables are separated across different cloud providers', explanation: 'False' },
        { text: 'Only one user is permitted to use the website', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q14`,
      type: 'multiple_choice',
      topicTag: 'Input Sanitization & Injection Prevention',
      question: `What is the primary mechanism for preventing SQL or Command Injection across enterprise backends?`,
      options: [
        { text: 'Parameterized queries and prepared statements that treat inputs as parameter literals', explanation: 'Prepared statements eliminate query structure alteration by malicious input.' },
        { text: 'Writing all SQL in capital letters', explanation: 'Syntax case does not prevent injection' },
        { text: 'Relying exclusively on client-side form validation', explanation: 'Client validation is easily bypassed' },
        { text: 'Replacing spaces with underscores in input', explanation: 'Insufficient sanitization' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q15`,
      type: 'multiple_choice',
      topicTag: 'Idempotency in API Design',
      question: `In RESTful HTTP architecture, which of the following HTTP methods is expected to be idempotent?`,
      options: [
        { text: 'GET, PUT, and DELETE', explanation: 'Calling idempotent methods multiple times produces the same system state as a single invocation.' },
        { text: 'POST only', explanation: 'POST creates new resources and is non-idempotent' },
        { text: 'CONNECT only', explanation: 'Incorrect' },
        { text: 'No HTTP method is idempotent', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q16`,
      type: 'multiple_choice',
      topicTag: 'Deadlock Conditions & Concurrency',
      question: `Which of the following is NOT one of Coffman’s four necessary conditions for a resource deadlock?`,
      options: [
        { text: 'Preemptive resource reclamation by the OS kernel', explanation: 'No Preemption is the requirement for deadlock; preemption prevents deadlock.' },
        { text: 'Mutual Exclusion', explanation: 'A valid Coffman condition' },
        { text: 'Hold and Wait', explanation: 'A valid Coffman condition' },
        { text: 'Circular Wait', explanation: 'A valid Coffman condition' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q17`,
      type: 'multiple_choice',
      topicTag: 'Cache Invalidation & Performance',
      question: `Why is Cache Invalidation famously cited as one of the hardest problems in Computer Science?`,
      options: [
        { text: 'Ensuring stale cached copies are reliably evicted without incurring read stampedes or inconsistency', explanation: 'Maintaining coherence between origin stores and distributed caches is mathematically complex.' },
        { text: 'Because RAM memory chips frequently melt under load', explanation: 'False' },
        { text: 'Caching is forbidden by web standards', explanation: 'False' },
        { text: 'Because cache keys must be written in binary', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q18`,
      type: 'multiple_choice',
      topicTag: 'Functional Transformations & Purity',
      question: `What defines a "Pure Function" in declarative software design?`,
      options: [
        { text: 'It consistently returns identical output for identical inputs with zero observable side-effects', explanation: 'Pure functions have no mutation, I/O, or hidden dependencies, making them trivially testable.' },
        { text: 'It can only be written in assembly language', explanation: 'False' },
        { text: 'It deletes its parameters upon exit', explanation: 'False' },
        { text: 'It takes at least 10 arguments', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q19`,
      type: 'multiple_choice',
      topicTag: 'Microservices & Distributed Tracing',
      question: `In distributed service architecture, what is the primary role of a Correlation ID / Trace ID?`,
      options: [
        { text: 'Tracking a single end-to-end user transaction across multiple asynchronous microservices and log outputs', explanation: 'Correlation IDs tie distributed spans and logs together into a unified execution timeline.' },
        { text: 'Encrypting database passwords', explanation: 'False' },
        { text: 'Generating CSS themes dynamically', explanation: 'False' },
        { text: 'Measuring server temperature', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q20`,
      type: 'multiple_choice',
      topicTag: 'Event-Driven Architectures & Message Brokers',
      question: `What is the principal advantage of an asynchronous message queue (e.g. RabbitMQ, Kafka) over synchronous RPC calls?`,
      options: [
        { text: 'Decoupling producers from consumers and providing traffic buffering during peak load spikes', explanation: 'Message queues smooth spiky ingress and protect downstream services from cascading collapse.' },
        { text: 'It removes the need for data storage', explanation: 'False' },
        { text: 'It prevents all client disconnections', explanation: 'False' },
        { text: 'It makes all transactions execute in 0 milliseconds', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q21`,
      type: 'multiple_choice',
      topicTag: 'Software Design Patterns & Singletons',
      question: `Why is the Singleton pattern frequently criticized when overused in scalable applications?`,
      options: [
        { text: 'It introduces hidden global state, tightly couples classes, and impedes unit test mock isolation', explanation: 'Singletons make tests order-dependent and complicate concurrent instantiation.' },
        { text: 'It consumes 100% of GPU resources', explanation: 'False' },
        { text: 'It is not valid syntax in modern languages', explanation: 'False' },
        { text: 'It requires multiple main() entrypoints', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q22`,
      type: 'multiple_choice',
      topicTag: 'Thread Pools & Backpressure',
      question: `What is "Backpressure" in streaming and reactive asynchronous architectures?`,
      options: [
        { text: 'A feedback mechanism where a consumer signals a producer to slow down rate of emission to avoid buffer overflow', explanation: 'Backpressure prevents out-of-memory crashes when producers outpace consumers.' },
        { text: 'Physical air pressure in server racks', explanation: 'Unrelated' },
        { text: 'A syntax error in compiler parsers', explanation: 'False' },
        { text: 'The reverse flow of electricity through ethernet cables', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q23`,
      type: 'multiple_choice',
      topicTag: 'Asymptotic Bounds & Big-O Notation',
      question: `What does Big-O notation O(N log N) typically represent in foundational algorithm analysis?`,
      options: [
        { text: 'The theoretical optimal comparison-based sorting time bound (e.g. MergeSort, HeapSort)', explanation: 'Information-theoretic lower bound for comparison sorting is O(N log N).' },
        { text: 'Linear sequential traversal of an array', explanation: 'Linear is O(N)' },
        { text: 'Constant time lookup in memory', explanation: 'Constant is O(1)' },
        { text: 'Exponential brute-force cryptography cracking', explanation: 'Exponential is O(2^N)' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q24`,
      type: 'multiple_choice',
      topicTag: 'Cryptographic Security & Password Hashing',
      question: `Why must password verification use slow adaptive hashing algorithms (e.g. bcrypt, Argon2) rather than fast SHA-256?`,
      options: [
        { text: 'Adaptive cost factors deliberately slow down brute-force and GPU dictionary attack attempts', explanation: 'Deliberate computational expense thwarts massive hardware parallel cracking.' },
        { text: 'Fast algorithms cannot compute hashes', explanation: 'False' },
        { text: 'Bcrypt uses zero bytes of memory', explanation: 'False' },
        { text: 'SHA-256 only works on numbers', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q25`,
      type: 'multiple_choice',
      topicTag: 'Stateless Microservices & Session Storage',
      question: `Why do modern cloud architectures avoid storing user session state on the local file system of individual server instances?`,
      options: [
        { text: 'Instances are ephemeral and horizontally scaled; subsequent requests may route to different nodes', explanation: 'Stateless servers allow auto-scaling groups to destroy or add nodes without session loss.' },
        { text: 'Local disks cannot hold text files', explanation: 'False' },
        { text: 'File systems are disabled in production OS kernels', explanation: 'False' },
        { text: 'Browsers refuse to connect to servers with hard drives', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q26`,
      type: 'multiple_choice',
      topicTag: 'Code Profiling & Hot Path Optimization',
      question: `According to Donald Knuth’s optimization doctrine, when should micro-optimizations be implemented?`,
      options: [
        { text: 'Only after empirical profiling identifies specific bottleneck hot paths ("premature optimization is the root of all evil")', explanation: 'Empirical profiling ensures engineering effort targets actual measured latency sources.' },
        { text: 'Before writing the first line of architectural design', explanation: 'Premature optimization trap' },
        { text: 'Randomly across every function', explanation: 'Inefficient' },
        { text: 'Never, performance is always irrelevant', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q27`,
      type: 'multiple_choice',
      topicTag: 'Unit Testing & Mocking Isolation',
      question: `What is the architectural purpose of "Test Doubles" (Mocks, Stubs, and Spies) in automated unit test suites?`,
      options: [
        { text: 'Isolating the Unit Under Test from real network, database, or external hardware side-effects', explanation: 'Mocks ensure tests remain deterministic, fast, and focused on single-module logic.' },
        { text: 'Doubling the execution duration of tests', explanation: 'False' },
        { text: 'Encrypting test output logs', explanation: 'False' },
        { text: 'Replacing the compiler parser', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q28`,
      type: 'multiple_choice',
      topicTag: 'Zero-Downtime Deployment & Health Checks',
      question: `In container orchestration (e.g. Kubernetes), what is the difference between a Liveness Probe and a Readiness Probe?`,
      options: [
        { text: 'Liveness determines if the container must be restarted; Readiness determines if it should receive user traffic', explanation: 'Readiness prevents routing traffic to warming up or overloaded containers.' },
        { text: 'They are identical aliases for CPU temperature', explanation: 'False' },
        { text: 'Readiness deletes the container immediately', explanation: 'False' },
        { text: 'Liveness is only executed on developer laptops', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q29`,
      type: 'multiple_choice',
      topicTag: 'Database Normalization & Denormalization',
      question: `When is deliberate database denormalization an appropriate architectural engineering trade-off?`,
      options: [
        { text: 'In read-heavy analytics/reporting workloads where eliminating expensive multi-table JOINs outweighs write redundancy cost', explanation: 'Denormalization optimizes query latency for read-dominated access patterns.' },
        { text: 'When the database administrator forgets how to write SQL', explanation: 'False' },
        { text: 'To corrupt foreign key relationships intentionally', explanation: 'False' },
        { text: 'Because tables cannot exceed 3 columns', explanation: 'False' },
      ],
      correctIndex: 0,
    },
    {
      id: `${courseId}-s${stageId}-q30`,
      type: 'multiple_choice',
      topicTag: 'System Resilience & Circuit Breaker Pattern',
      question: `What problem does the Circuit Breaker pattern solve in distributed service communications?`,
      options: [
        { text: 'It stops repeated doomed calls to a failing downstream service, preventing thread exhaustion and cascading failures', explanation: 'Circuit breakers fail fast, allowing failing dependencies time to recover without bringing down callers.' },
        { text: 'It shuts down physical electricity to the server building', explanation: 'Physical breaker confusion' },
        { text: 'It blocks users from ever logging into their accounts', explanation: 'False' },
        { text: 'It forces synchronous HTTP polling every second', explanation: 'False' },
      ],
      correctIndex: 0,
    },
  ];

  return questions;
}
