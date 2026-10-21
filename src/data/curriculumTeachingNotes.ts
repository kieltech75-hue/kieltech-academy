import { CourseStage } from '../types/curriculum';

const teachingNotes: Record<string, Record<number, string[]>> = {
  python: {
    1: [
      'A Python name is a binding in a namespace, not a box that contains the value. Assignment makes the name refer to a Python object; rebinding changes that association, while aliases can refer to the same mutable object.',
      'Python determines an object’s type at runtime, and a name can later refer to a different type. Conditions use truth-value testing: None, False, numeric zero, and empty built-in containers are false; most other objects are true.',
      'Use enumerate(items) when an index and value are both needed, zip(a, b) to pair iterables, and range for numeric sequences. Iteration avoids manual index bookkeeping; zip stops at the shortest iterable unless strict mode is requested.',
      'A function creates a local scope; Python resolves names through Local, Enclosing, Global, then Built-in scopes (LEGB). Default expressions run once when the function is defined, so use None and create a fresh list or dictionary inside the function.',
    ],
    2: [
      'A list stores references in a contiguous resizable array. Appending is usually constant time, but occasional capacity growth copies references; slicing creates a new list and therefore copies references rather than recursively copying contained objects.',
      'Dictionary keys must be hashable and keep a stable hash/equality relationship while stored. Lookup is average O(1), not guaranteed; collisions are resolved internally, and mutable containers such as lists cannot be keys.',
      'Sets contain unique hashable values. Union combines membership, intersection keeps shared members, and symmetric difference keeps values found in exactly one set; these operations are useful for deduplication and comparing collections.',
      'The with statement asks a context manager to acquire a resource and then release or clean it up on exit, even when the body raises. Files use this protocol to ensure descriptors are closed reliably.',
    ],
    3: [
      'Classes are objects created by the metaclass type; calling a class constructs an instance. This makes class creation and behavior customizable, while ordinary class definitions are the common, readable way to define new types.',
      'Instance attributes belong to one object; class attributes are shared through the class unless an instance shadows them. Properties expose methods through attribute syntax and can validate or compute values without changing the public interface.',
      'Special methods let user-defined objects participate in built-in protocols: __len__ supports len(), __getitem__ supports indexing, and __add__ supports +. Implement only coherent behaviors so familiar syntax has predictable meaning.',
      'Python searches base classes using C3 method resolution order, which creates a consistent linear order even with multiple inheritance. Cooperative super() calls follow that order; each implementation should call super() once with compatible arguments.',
    ],
    4: [
      'A closure is a function together with references to names in its enclosing lexical scope. Decorators are callables that wrap another callable; parameterized decorators add an outer factory, and functools.wraps preserves the wrapped function’s metadata.',
      'An asyncio event loop schedules coroutines cooperatively. At await points a task can yield while I/O is pending, allowing other tasks to run; blocking CPU work or synchronous I/O still blocks that loop.',
      'CPython primarily reclaims objects when their reference count reaches zero. Reference cycles can keep counts nonzero, so a cyclic garbage collector supplements reference counting; this is an implementation detail, not a language-wide guarantee.',
      'FastAPI maps HTTP routes to Python callables and uses Pydantic models to parse and validate request data. Validation failures become client errors, while explicit response models document and constrain returned data.',
    ],
  },
  nodejs: {
    1: [
      'V8 parses JavaScript, interprets bytecode with Ignition, and may optimize hot code with TurboFan. Optimization depends on observed types and can be discarded when assumptions change; garbage collection reclaims unreachable heap objects.',
      'Node’s event loop coordinates timers and operating-system I/O through libuv. Poll handles I/O events, Check runs setImmediate callbacks, and timer timing is approximate; do not rely on one universal callback ordering across all contexts.',
      'After the current JavaScript stack completes, Node drains process.nextTick callbacks before Promise jobs, then proceeds through event-loop work. Recursively filling the nextTick queue can starve I/O, so reserve it for small immediate follow-up work.',
      'JavaScript callbacks run on the main event-loop thread; selected filesystem, crypto, and DNS tasks use libuv’s worker pool. CPU-heavy JavaScript still blocks the loop unless moved to worker threads or separate processes.',
    ],
    2: [
      'A Buffer represents bytes in raw memory rather than ordinary V8-managed string storage. Allocate safely (for example, Buffer.alloc) and validate lengths and encodings when handling untrusted binary input.',
      'Readable streams produce chunks and writable streams consume them. Processing chunks incrementally limits peak memory, making streams suitable for large files and network transfers that should not be buffered all at once.',
      'When write() returns false, the writable side is saturated; producers should wait for drain or use pipeline rather than continuing to write. This backpressure keeps a fast source from overwhelming a slower destination.',
      'pipeline connects streams while propagating errors and tearing down the chain when a failure occurs. The promise-based variant integrates with async functions; handle rejection so failed transfers are reported rather than silently abandoned.',
    ],
    3: [
      'Express middleware runs in registration order. Calling next() continues the chain; next(error) transfers control to error middleware, whose signature has four parameters. A route that neither responds nor advances leaves the request hanging.',
      'A JWT is a signed token, not encrypted by default. The server verifies its signature and claims on every protected request; use short lifetimes, safe key rotation, and never trust decoded claims before verification.',
      'A PostgreSQL pool reuses a bounded set of database connections instead of opening one for every request. Release checked-out clients in finally blocks, and size the pool with the database’s total connection limit in mind.',
      'Helmet sets defensive HTTP headers; CORS controls which browser origins may read responses and is not authentication. Rate limiting bounds request volume, while Redis can coordinate counters across multiple server instances.',
    ],
    4: [
      'The cluster module runs multiple Node processes that can serve requests, with a primary process coordinating workers. Processes do not share ordinary memory, so communicate through messages or an external store and handle worker restarts.',
      'Worker threads execute JavaScript on separate threads and can exchange messages or share SharedArrayBuffer memory. Shared data requires synchronization with Atomics; use workers for CPU-bound tasks, not ordinary asynchronous I/O.',
      'A heap snapshot records reachable objects at a moment in time. Compare snapshots under repeatable load and inspect retaining paths to find references that keep objects alive; a detached DOM diagnosis applies only where a DOM exists.',
      'Rolling reloads start healthy replacements before retiring old workers, avoiding a full service outage. Health checks should verify readiness, and graceful shutdown must stop accepting new work while existing requests finish.',
    ],
  },
  golang: {
    1: [
      'Go checks types at compile time and does not implicitly convert between distinct numeric types. Every type has a zero value, so declarations are usable without constructors when that zero value represents valid state.',
      'The address operator & obtains a value’s address and * dereferences a pointer. Go pointers allow indirection but prohibit pointer arithmetic, which helps retain low-level access without permitting arbitrary address manipulation.',
      'The compiler’s escape analysis decides whether values can remain on a goroutine stack or must live on the heap. A value escaping its function is not automatically a bug; inspect compiler diagnostics and profile before optimizing.',
      'A slice is a descriptor over an array: pointer, length, and capacity. Copies of a slice share the backing array until append exceeds capacity; reslicing changes the view, not the underlying array contents.',
      'Struct fields follow alignment rules, so field order can affect padding and memory size. Struct tags provide metadata used by packages such as encoding/json; tags do not change a field’s Go type or visibility.',
    ],
    2: [
      'A type satisfies an interface when it has the required methods; there is no implements declaration. Small consumer-defined interfaces make code easier to test and let unrelated concrete types work with the same abstraction.',
      'An interface value conceptually carries a dynamic type and a dynamic value. The exact runtime representation is an implementation detail; the key programming consequence is that interface values can hold different concrete types.',
      'An interface is nil only when both its dynamic type and value are absent. A typed nil pointer assigned to an interface gives it a dynamic type, so comparing that interface to nil returns false.',
      'Errors are ordinary values returned by functions. Wrap context with %w and inspect chains with errors.Is or errors.As; avoid comparing error strings, which are not a stable programmatic contract.',
      'A package defines a namespace and is organized within a Go module. Identifiers beginning with an uppercase letter are exported; lowercase names remain package-private, which helps keep APIs intentional.',
    ],
    3: [
      'A goroutine is a lightweight execution task scheduled by the Go runtime onto operating-system threads. The runtime multiplexes many goroutines, but shared-memory access still needs synchronization to avoid races.',
      'CSP favors passing work or data through channels instead of coordinating shared mutable state. This is a design guideline, not a ban on shared memory; mutexes remain appropriate when they make ownership clearer.',
      'An unbuffered channel send and receive synchronize directly. A buffered channel can hold a bounded number of values before senders block, so capacity changes when producers experience backpressure.',
      'select waits for one ready channel operation; if several are ready, selection is pseudo-random. A default branch makes it non-blocking, and a timer channel can bound how long an operation waits.',
      'A context carries cancellation, deadlines, and request-scoped values through a call tree. Pass it explicitly as the first parameter, propagate it to downstream work, and do not use it as a general optional-argument bag.',
    ],
    4: [
      'Configure server read, write, and idle timeouts to bound how long clients can hold connections or responses open. Timeouts protect resources, but choose values that still accommodate legitimate slow clients and workloads.',
      'json.Decoder reads a stream incrementally, while json.Unmarshal requires the complete byte slice in memory. Decoding large input can reduce peak memory; validate decoded fields and handle malformed or trailing data.',
      'The Go race detector instruments concurrent memory accesses and reports conflicting unsynchronized operations in executed code paths. Run representative tests with -race; passing it does not prove all schedules are race-free.',
      'pprof samples CPU or records allocation and heap information for analysis. Capture profiles under representative workloads, compare before and after changes, and optimize measured bottlenecks rather than guessing.',
      'A multi-stage Docker build compiles in a toolchain image and copies only the executable into a smaller runtime image. scratch has no shell or certificates, so include required CA roots and configure the process deliberately.',
    ],
  },
  java: {
    1: [
      'Each Java thread has stack frames for calls and local variables; objects are generally allocated on the heap. A reference held in a frame points to an object, and the garbage collector reclaims unreachable objects.',
      'Generational collectors exploit the observation that many objects die young. Eden allocations may be copied to survivor regions and longer-lived objects promoted, but exact regions and policies depend on the selected collector.',
      'Encapsulation hides representation behind a public contract. Access modifiers control visibility, records provide concise data carriers with final component fields, and interfaces or abstract classes express different forms of shared behavior.',
      'Java generics are checked by the compiler but mostly erased at runtime. Thus List<String> and List<Integer> share the same runtime class; use bounded type parameters and avoid assuming parameterized types are reified.',
    ],
    2: [
      'ArrayList stores elements in a resizable array. Appending is amortized constant time, but growth reallocates and copies references; reserve capacity when a reliable size estimate is available.',
      'HashMap uses hash codes to select buckets and equals() to distinguish keys. Collisions share buckets, and heavily collided buckets may treeify under implementation-specific conditions; iteration order is not guaranteed.',
      'Equal objects must return equal hash codes. If a key’s equality-relevant fields change after insertion, a map may no longer find it; use immutable keys and implement equals/hashCode as a consistent pair.',
      'Stream intermediate operations build a pipeline and are typically lazy until a terminal operation runs it. Use map for transformation, filter for selection, and collect or reduce to produce a result.',
    ],
    3: [
      'Virtual threads are lightweight JVM-managed threads that can unmount from carrier threads while blocked in supported operations. They simplify thread-per-task code but do not make CPU-bound work faster or remove external resource limits.',
      'The Java Memory Model defines when writes by one thread become visible to another. A happens-before relationship can be established through synchronization, volatile access, thread start/join, and other specified mechanisms.',
      'synchronized and ReentrantLock provide mutual exclusion; atomics support specific lock-free operations. Choose based on the invariant being protected, keep critical sections small, and release explicit locks in finally blocks.',
      'ConcurrentHashMap supports concurrent access without requiring callers to lock the entire map. It does not make mutable values stored inside it thread-safe; coordinate changes to those values separately.',
    ],
    4: [
      'Spring’s application context creates and wires beans, whose scope determines how instances are managed. Constructor injection makes required dependencies explicit and simplifies unit testing compared with field injection.',
      'Spring AOP commonly applies cross-cutting behavior through proxies around method calls. Transaction and security advice therefore depends on calls reaching the proxy; self-invocation within the same object may bypass that advice.',
      'JPA entities move through transient, managed, detached, and removed states. A persistence context tracks managed changes; the first-level cache belongs to that context, while an optional second-level cache is shared more broadly.',
      'A transaction groups database operations into a commit or rollback boundary. REQUIRED joins an existing transaction or starts one; REQUIRES_NEW suspends it and opens another. Configure rollback rules for checked exceptions when needed.',
    ],
  },
  rust: {
    1: [
      'Every Rust value has one owner, and ownership moves when a non-Copy value is assigned or passed. When the owner leaves scope, its value is dropped, giving deterministic cleanup without a tracing garbage collector.',
      'Copy types duplicate their bits on assignment; move-only values transfer ownership instead. String is not Copy because duplicating its pointer alone would create unsafe shared ownership of its heap buffer.',
      'The borrow checker permits many shared references or one exclusive mutable reference at a time, while the value remains alive. This rule prevents data races and invalid references during mutation.',
      'Generics, iterators, and abstractions are generally resolved at compile time through monomorphization and optimization. “Zero cost” means the abstraction need not add overhead, not that every operation is free.',
    ],
    2: [
      'An enum is a sum type: a value is exactly one named variant, and each variant may carry different data. This models alternatives explicitly instead of combining unrelated fields with sentinel values.',
      'match requires handling every possible enum variant, so adding a variant reveals incomplete logic at compile time. if let is concise when only one pattern matters and other cases can be ignored intentionally.',
      'Option<T> represents a present value or absence; Result<T, E> represents success or failure. Callers must handle these possibilities, making invalid absence and error paths visible in the type signature.',
      'The ? operator returns the success value or exits the current function with a compatible error converted through From. It propagates failure; it does not handle, log, or recover from it.',
      'A trait describes behavior through required methods and optional defaults. Implementing a trait for a type enables generic bounds and shared APIs; coherence rules limit conflicting implementations.',
    ],
    3: [
      'A lifetime annotation describes how reference lifetimes relate; it does not extend the referenced data’s lifetime. The compiler checks that references returned or stored cannot outlive the values they borrow.',
      'Lifetime elision applies a small set of inference rules to common function signatures, such as assigning an output lifetime to a single input reference. Explicit annotations are needed when relationships are ambiguous.',
      'Box<T> owns a value allocated on the heap and is useful for recursive types whose size cannot be known inline. It still has one owner and frees the allocation when dropped.',
      'Arc<T> shares ownership across threads with atomic reference counting. Mutex<T> provides exclusive synchronized access to the protected value; locking can block or deadlock, so keep guards short.',
      'Send means ownership can be transferred across thread boundaries; Sync means shared references can be used across threads safely. The compiler derives these auto traits from the contained types and rejects unsafe combinations.',
    ],
    4: [
      'A Future describes work that may complete later and is lazy until polled. poll returns Ready with a result or Pending and arranges for the task’s waker to be notified when progress may be possible.',
      'Tokio supplies an executor to poll tasks and a reactor to observe I/O readiness and timers. Its work-stealing scheduler balances runnable tasks; blocking a runtime worker can reduce responsiveness.',
      'Async channels transfer messages between tasks without blocking an operating-system thread. Bounded mpsc channels apply backpressure, while broadcast channels deliver each message to multiple active receivers subject to capacity.',
      'Axum builds handlers from typed extractors that parse request parts and bodies. Tower layers provide reusable middleware; return explicit status and error responses, and validate inputs at the service boundary.',
    ],
  },
  javascript: {
    1: [
      'Before executing a function, the engine creates an execution context with lexical bindings; then it evaluates statements on the call stack. Function calls add frames, and returning removes them.',
      'var bindings are initialized to undefined during setup, while let and const bindings cannot be accessed before initialization (the temporal dead zone). Declare variables before use to avoid order-dependent runtime errors.',
      'Primitives are copied as values; objects are accessed through references. A shallow copy duplicates only the outer container, so nested objects remain shared; structuredClone can deep-copy supported values.',
      'A lexical environment stores bindings and points to its parent environment. Identifier lookup walks outward through this chain; lexical scope is determined by where code is written, not where a function is called.',
    ],
    2: [
      'Objects delegate property lookup through their prototype chain until a property is found or the chain ends at null. Prefer Object.getPrototypeOf for inspection; __proto__ is a legacy accessor.',
      'Constructor functions and class syntax establish prototype-based delegation. Methods placed on a prototype are shared by instances, while fields assigned during construction usually belong to each instance.',
      'A closure retains access to the lexical bindings surrounding its creation, even after the outer function returns. This enables private state, but long-lived closures can also keep referenced objects in memory.',
      'For a regular function, this depends on how it is called: as a method it is the receiver; call/apply/bind set it explicitly. Arrow functions capture this lexically and cannot be rebound.',
    ],
    3: [
      'The browser runs JavaScript tasks when the call stack is available, then performs rendering opportunities and schedules further work. Network and timer APIs are handled by browser services outside the JavaScript stack.',
      'After a task, the event loop drains queued microtasks such as Promise callbacks before starting another task such as a timer callback. An endless microtask chain can delay rendering and other tasks.',
      'A Promise settles once: it moves from pending to fulfilled or rejected and cannot change state again. then chains transform results, while catch handles rejection; return or await chained work to preserve error flow.',
      'An async function always returns a Promise. await pauses that function’s continuation, not the whole thread, and resumes it through Promise scheduling; use try/catch or rejection handling for failures.',
    ],
    4: [
      'The browser parses HTML and CSS into DOM and CSSOM trees, builds a render tree, then lays out, paints, and composites pixels. Geometry changes often require layout; transform and opacity can often be composited more cheaply.',
      'Events can travel from ancestors toward the target (capture), reach the target, then bubble back up. Listeners can choose a phase, and stopPropagation should be used sparingly because it can break other handlers.',
      'Event delegation puts a listener on a stable ancestor and inspects event.target or closest() to identify the acted-on child. It works for later-added children and reduces listener setup, but check the matched target.',
      'LCP measures when the main visible content appears; INP measures interaction responsiveness; CLS measures unexpected visual movement. Improve each by measuring real pages and fixing its specific bottleneck.',
    ],
  },
  typescript: {
    1: [
      'TypeScript checks whether a value has the required structure, not whether it explicitly declares a particular interface. Extra properties may be allowed in assignments, while fresh object literals also receive excess-property checks.',
      'Primitive types describe values; object types describe properties and their types. With strict null checking, null and undefined are distinct and must be handled rather than silently accepted as ordinary values.',
      'A union means a value may be one of several alternatives; an intersection combines requirements from multiple types. Narrow unions with checks before using members that are not shared by every variant.',
      'A literal type preserves an exact value such as "open" rather than widening it to string. `as const` keeps object properties readonly and arrays as readonly tuples, enabling precise discriminants.',
      'Widening generalizes a literal when a mutable variable could change. Narrowing uses checks such as typeof, equality, or an `in` guard to refine the possible type within a control-flow branch.',
    ],
    2: [
      'A generic parameter lets one implementation relate input and output types without committing to one concrete type. Inference often chooses the argument type; explicit parameters clarify cases where inference is insufficient.',
      'A constraint such as T extends Record<string, unknown> limits which types are accepted while keeping T specific. A constraint grants only the operations promised by that bound, not arbitrary properties.',
      'keyof T produces the valid property-key union of T; T[K] retrieves the type at key K. Constrain K to keyof T so the compiler can verify the indexed property exists.',
      'A discriminated union gives each alternative a shared literal tag, allowing checks on that tag to narrow the remaining fields safely. It models states that have different data and valid operations.',
      'After all union variants are handled, the remaining value should be never. Assigning it to a never variable makes the compiler flag a newly added variant that lacks a case.',
    ],
    3: [
      'A conditional type chooses an output type based on assignability, following `T extends U ? X : Y`. It lets reusable types express relationships that ordinary unions or interfaces cannot capture.',
      'A conditional type with a naked type parameter distributes over union members. Wrapping the parameter in a tuple, as `[T] extends [U]`, tests the union as a whole instead.',
      'infer introduces a type variable inside a conditional pattern, such as extracting a function’s return type or a Promise’s payload. It captures structure; it does not run code.',
      'A mapped type iterates over keys to transform property types or modifiers. Optional and readonly modifiers can be added or removed, making utilities such as Partial and Readonly possible.',
      'Key remapping with `as` changes or filters mapped keys, and template literal types compose string literals. Together they can derive event names or accessor APIs from a source type.',
    ],
    4: [
      'strictNullChecks forces explicit handling of null and undefined; noImplicitAny rejects untyped implicit any; noUncheckedIndexedAccess adds undefined to uncertain indexed reads. exactOptionalPropertyTypes distinguishes omission from an explicitly undefined property.',
      'A branded type intersects a primitive with a unique-symbol marker so otherwise similar IDs are not interchangeable. The brand is compile-time only, so validate external values before assigning the trusted type.',
      'A declaration file describes the types of JavaScript code without implementing it. Ambient declarations add compile-time knowledge only; they do not create runtime exports or polyfill missing functionality.',
      'Project references split a TypeScript repository into dependent build units. Composite projects emit build metadata that supports incremental compilation, but referenced packages still need clear public type boundaries.',
    ],
  },
  react: {
    1: [
      'A declarative component describes UI as a function of props and state. When inputs change, React renders the description again and reconciles it with the previous tree; keep render logic free of side effects.',
      'JSX is syntax transformed by the compiler into calls to React’s JSX runtime. It does not run as HTML in the browser; expressions become element descriptions that React later renders.',
      'Props flow from parent to child and should be treated as read-only. To change shared data, the owner updates state and passes new values or callbacks downward.',
      'React matches children using element types and keys during reconciliation. Stable unique keys preserve item identity when lists change; array indexes can associate state with the wrong item after reordering.',
    ],
    2: [
      'Fiber represents units of React work and allows rendering to be scheduled and interrupted. It is an implementation architecture; application code should rely on documented scheduling APIs, not internal node structure.',
      'Rendering calculates the next UI and should remain pure; the commit phase applies changes to the DOM. Effects run outside render, so do not mutate external systems while React is calculating output.',
      'Hooks must run in the same order on every render because React associates state with call position. Call hooks at the top level of components or custom hooks, never inside conditions or loops.',
      'An effect callback closes over values from the render that created it. Declare dependencies so React re-runs the effect when captured values change; cleanup should undo subscriptions or cancel obsolete work.',
    ],
    3: [
      'useReducer centralizes state transitions in a reducer that receives current state and an action. It is useful when updates are related or transition rules need to be explicit and testable.',
      'React.memo compares props, while useMemo and useCallback can preserve values or function references between renders. They only help when referential stability avoids measured work; they are not correctness tools.',
      'A context consumer re-renders when its provider value changes. Splitting frequently changing state from stable actions can reduce unnecessary updates, though component boundaries and profiling should guide optimization.',
      'Compound components coordinate related controls through shared context, allowing expressive composition. Keep the context contract clear and define behavior when a child is rendered outside its expected provider.',
    ],
    4: [
      'Concurrent rendering lets React pause and restart render work before committing it. A render that is interrupted must be safe to run again, which is why render functions and reducers must be pure.',
      'useTransition marks non-urgent state updates so urgent interactions can be handled first; useDeferredValue lets a derived view lag behind a rapidly changing input. Neither makes the underlying computation faster.',
      'Server Components render on the server and can access server-only resources without shipping their implementation to the browser. Client Components provide interactivity and need a client boundary; framework support determines the exact setup.',
      'Streaming SSR sends rendered content in chunks and Suspense can provide fallbacks while parts are prepared. Hydration attaches client behavior to server markup, so generated HTML must match the initial client render.',
      'The React Profiler records render and commit work to help locate costly updates. Profile representative interactions, identify avoidable work, then compare measurements after changing component structure or memoization.',
    ],
  },
  vue: {
    1: [
      'Vue wraps reactive objects in Proxies that intercept property reads and writes. Proxying enables dependency tracking for object properties, but raw and proxied references are distinct and should not be mixed casually.',
      'When an effect reads a reactive property, Vue records that dependency; a later write schedules dependent effects to run again. Only tracked reactive reads participate, so destructuring can disconnect primitive values.',
      'ref wraps a value and exposes it through .value in JavaScript; reactive proxies an object. Templates unwrap refs in common contexts, but JavaScript code should use the appropriate .value access.',
      'v-bind connects an attribute to an expression, v-on handles events, and v-model coordinates input and state. v-if creates or removes content; v-show toggles visibility while keeping the element mounted.',
    ],
    2: [
      'computed creates a cached derived value that recalculates when a reactive dependency changes. It is lazy until read and should remain side-effect free; use a watcher for side effects.',
      'watch observes explicitly selected sources and provides old and new values; watchEffect tracks reactive values read during its execution. Cleanup cancels obsolete asynchronous work before reruns or teardown.',
      'Lifecycle hooks run at defined points as a component is created, mounted, updated, and unmounted. Access the DOM after mount, and remove timers, listeners, or subscriptions during unmount.',
      'Props pass data down and should be treated as read-only; emits report events upward. Typed props and event declarations make a component’s public contract visible to both callers and tooling.',
    ],
    3: [
      'A composable is a function that uses Vue’s Composition API to package reusable stateful logic. Call it within a valid setup context and return only the state and operations callers need.',
      'provide/inject shares dependencies with descendants without forwarding props through every intermediate component. Use typed injection keys and sensible handling for a missing provider.',
      'A Pinia store centralizes state, getters, and actions. Components can share it across a tree; keep mutations intentional and place asynchronous workflows in actions with explicit error handling.',
      '$subscribe observes store state changes and $onAction observes action calls. Unsubscribe when listeners are no longer needed; hot-module replacement preserves development state but is not production persistence.',
    ],
    4: [
      'Vue Router guards can inspect navigation and cancel, redirect, or allow it. Route metadata can describe access requirements, but authorization must also be enforced by the server protecting sensitive data.',
      'The template compiler identifies dynamic nodes and emits patch flags so runtime updates can focus on changing parts. Static hoisting reuses unchanged structures; this is an optimization, not a reason to obscure templates.',
      'Teleport renders a component’s DOM elsewhere, often under document.body, while retaining its Vue component ownership. This is useful for dialogs, but focus handling and cleanup remain application responsibilities.',
      'Async components load code on demand and Suspense coordinates fallback UI while async dependencies resolve. Split at meaningful boundaries and provide useful loading and error states for network failure.',
    ],
  },
  'html-css': {
    1: [
      'Semantic elements describe a document’s purpose, helping browsers expose a meaningful accessibility tree and allowing maintainers to understand structure. Choose elements for meaning, not their default appearance.',
      'Landmarks identify major regions such as navigation, main content, and complementary information. Assistive technology can use them to jump through a page; avoid redundant or unlabeled landmark regions.',
      'Headings communicate a nested outline. Use heading levels to reflect section hierarchy rather than selecting them for visual size; CSS controls appearance independently of semantic level.',
      'HTML parsing can be delayed by blocking resources. defer scripts execute after parsing in document order; async scripts execute when downloaded and may run in any order. Stylesheets can block rendering while they load.',
    ],
    2: [
      'Prefer native semantic HTML because built-in controls already provide expected keyboard behavior and accessibility semantics. ARIA should fill a genuine semantic gap, not replace a working button or label.',
      'ARIA states describe the current state and relationships of custom controls. Keep values synchronized with actual behavior: for example, aria-expanded must reflect whether the controlled region is open.',
      'Live regions announce dynamic content changes to assistive technology. Use polite for non-urgent updates and assertive sparingly for urgent messages; avoid repeatedly announcing large or rapidly changing regions.',
      'Keyboard users need a visible focus indicator and a logical tab order. Dialogs should move focus inside when opened, contain focus while modal, and restore focus to the invoking control when closed.',
    ],
    3: [
      'Grid defines rows and columns for two-dimensional layouts; explicit tracks are authored, while implicit tracks are created for extra content. fr distributes available space, and minmax bounds track sizing.',
      'auto-fit and minmax let grid columns adapt to available space without a breakpoint for every width. Choose a meaningful minimum and test narrow containers so content does not become unreadable.',
      'Subgrid lets nested items participate in parent grid tracks, aligning repeated content across cards. It is useful for shared row alignment but requires a supporting browser and a sensible non-subgrid fallback where needed.',
      'clamp(min, preferred, max) makes sizes fluid within bounds. Combining a viewport-based preferred value with minimum and maximum limits avoids abrupt scaling and protects readability on small or large screens.',
    ],
    4: [
      'Design tokens separate raw values from semantic roles and component-specific choices. CSS custom properties can encode those layers, making themes and consistent updates possible without editing every component.',
      'Container queries style a component according to its containing block rather than the viewport. Declare a containment context on the parent, then test the component in each actual embedding size.',
      'Tailwind utility classes compose styles directly in markup and its build process emits used utilities. Extend theme tokens centrally and keep repeated combinations understandable through component boundaries.',
      'Transform and opacity animations can often be composited without repeated layout or paint, but not every animation is free. Profile rendering, avoid unnecessary layers, and respect reduced-motion preferences.',
    ],
  },
};

export function getCoreConceptTeachingNotes(courseId: string, stage: CourseStage): string[] {
  const notes = teachingNotes[courseId]?.[stage.id];
  if (!notes || notes.length !== stage.coreConcepts.length) {
    throw new Error(
      `Teaching notes for ${courseId} stage ${stage.id} must match its ${stage.coreConcepts.length} core concepts.`
    );
  }
  return notes;
}
