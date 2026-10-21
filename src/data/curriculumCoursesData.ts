import { CourseStage } from '../types/curriculum';

export const COMPREHENSIVE_COURSE_STAGES: Record<string, CourseStage[]> = {
  // =========================================================================
  // 1. PYTHON (CS-301: Advanced Systems & Architecture)
  // =========================================================================
  python: [
    {
      id: 1,
      stageNumber: 'Stage 01',
      title: 'CPython Memory Architecture & Dynamic Binding',
      tagline: 'PyObject references, stack frames, dynamic typing, and LEGB lexical scopes',
      level: 'Beginner',
      durationHours: '20-25 hrs',
      summary: 'Explore the fundamental mechanics of the CPython runtime: PyObject structures on the heap, reference pointers, truthiness evaluation, sequence iteration, and lexical scope resolution.',
      coreConcepts: [
        'Variables in Python are reference labels bound to PyObject structs on the heap (ob_refcnt, ob_type)',
        'Dynamic typing vs static verification: runtime dispatch and duck typing mechanics',
        'Truthiness evaluation: empty containers ([], {}, ""), zero, and singleton None evaluate to False',
        'Idiomatic iteration with enumerate(), zip(), reversed(), and generator comprehensions',
        'LEGB Scope: Local, Enclosing, Global, Built-in lexical namespace resolution',
      ],
      codeExamples: [
        {
          title: 'Heap Reference Identity & Memory Inspection',
          description: 'Demonstrating how variable names point to heap objects rather than containing values directly.',
          code: `import sys

# Integers are PyLongObject structs on the heap
counter_a = 42
counter_b = counter_a

print(f"Memory Address A: {hex(id(counter_a))}")
print(f"Memory Address B: {hex(id(counter_b))}")
print(f"Addresses Match: {counter_a is counter_b}")

# Inspect CPython reference counter
print(f"Reference count for 42: {sys.getrefcount(42)}")`,
          output: `Memory Address A: 0x7fa9e2a10\nMemory Address B: 0x7fa9e2a10\nAddresses Match: True\nReference count for 42: 18`,
          explanation: 'Assignment binds an existing PyObject pointer to a new namespace symbol. Reassigning rebinding does not overwrite the memory address.',
        },
        {
          title: 'Safe Function Parameter Defaults & Scope Isolation',
          description: 'Avoiding the infamous mutable default argument trap in Python functions.',
          code: `def register_student(student_id: str, grades: list[float] | None = None) -> dict:
    # Explicitly instantiate default collections inside function scope
    if grades is None:
        grades = []
    grades.append(95.0)
    return {"id": student_id, "grades": grades}

s1 = register_student("KT-101")
s2 = register_student("KT-102")
print("Student 1:", s1)
print("Student 2:", s2)`,
          output: `Student 1: {'id': 'KT-101', 'grades': [95.0]}\nStudent 2: {'id': 'KT-102', 'grades': [95.0]}`,
          explanation: 'Default argument expressions in Python are evaluated once at function definition time, not at invocation. Using None prevents unintended shared mutable state.',
        },
      ],
      gotchas: [
        {
          title: 'Identity Equality ("is") vs Structural Value Equality ("==")',
          badCode: `list_a = [10, 20, 30]\nlist_b = [10, 20, 30]\nif list_a is list_b:  # ❌ INCORRECT: checks pointer identity (false)\n    print("Lists are equal")`,
          goodCode: `list_a = [10, 20, 30]\nlist_b = [10, 20, 30]\nif list_a == list_b:  # ✅ CORRECT: invokes __eq__ for deep comparison\n    print("Lists have identical contents!")`,
          explanation: 'The `is` keyword compares memory address equality (id(a) == id(b)), while `==` invokes `__eq__` to compare the underlying values.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 01 Python Runtime Foundations Test (30 Questions)',
        instructions: 'Official Mid-term Milestone: 30 proctored questions on CPython memory model, dynamic binding, and control flow. Duration: 30 minutes.',
        questions: [],
      },
    },
    {
      id: 2,
      stageNumber: 'Stage 02',
      title: 'High-Throughput Data Structures & Memory Buffers',
      tagline: 'Hash tables, slicing algorithms, set algebra, and context managers',
      level: 'Elementary',
      durationHours: '25-30 hrs',
      summary: 'Delve into CPython list array growth algorithms, O(1) hash table bucketing and collision resolution, set algebra, and RAII resource management via the context manager protocol.',
      coreConcepts: [
        'List memory allocation: contiguous array of pointers and amortized over-allocation',
        'Hash tables: hashability requirements, hash siphash randomization, and open addressing',
        'Dictionary key lookup complexity: O(1) average case, collision probing algorithms',
        'Set algebra mathematics: union (|), intersection (&), difference (-), and symmetric difference (^)',
        'Context manager protocol: deterministic resource disposal with __enter__ and __exit__',
      ],
      codeExamples: [
        {
          title: 'Dictionary Merging & Set Algebra in Data Pipelines',
          description: 'Fast dictionary union and set operations for configuration parsing.',
          code: `base_config = {"env": "prod", "cache_ttl": 3600, "workers": 4}
override_config = {"workers": 8, "debug": False}

# PEP 584 Dictionary Union operator
active_config = base_config | override_config

required_keys = {"env", "cache_ttl", "workers", "ssl_cert"}
active_keys = set(active_config.keys())
missing = required_keys - active_keys

print("Active Config:", active_config)
print("Missing Required Keys:", missing)`,
          output: `Active Config: {'env': 'prod', 'cache_ttl': 3600, 'workers': 8, 'debug': False}\nMissing Required Keys: {'ssl_cert'}`,
          explanation: 'Dictionary union operators combine mappings in linear time with right-hand precedence, while set subtraction computes key deltas with O(1) membership lookups.',
        },
      ],
      gotchas: [
        {
          title: 'Mutating Collections During Iteration',
          badCode: `users = {"alex": 1, "sara": 2, "carlos": 3}\nfor name in users:\n    if name == "alex":\n        del users[name]  # ❌ RuntimeError: dictionary changed size during iteration`,
          goodCode: `users = {"alex": 1, "sara": 2, "carlos": 3}\n# Iterate over an immutable copy of keys\nfor name in list(users.keys()):\n    if name == "alex":\n        del users[name]  # ✅ Safe removal`,
          explanation: 'Iterating directly on a dictionary while modifying its key structure invalidates internal hash table iterators, throwing a fatal RuntimeError.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 02 Data Structures & Algorithms Test (30 Questions)',
        instructions: 'Test your understanding of hash table complexity, list memory reallocations, and context manager resource safety.',
        questions: [],
      },
    },
    {
      id: 3,
      stageNumber: 'Stage 03',
      title: 'Object-Oriented Architecture & Dunder Protocols',
      tagline: 'Classes, dunder protocols, descriptor binding, and C3 Linearization (MRO)',
      level: 'Intermediate',
      durationHours: '30-35 hrs',
      summary: 'Design modular systems using object-oriented principles: class and instance namespaces, dunder operator overloading, properties, descriptor protocols, and cooperative multiple inheritance with C3 Linearization.',
      coreConcepts: [
        'Classes as first-class objects: type metaclass and heap class dictionaries (__dict__)',
        'Dunder protocols: __repr__, __str__, __eq__, __hash__, and custom container emulation',
        'Descriptor protocol: __get__, __set__, __delete__ powering properties and bound methods',
        'Cooperative multiple inheritance: super() chaining and C3 Linearization algorithm (MRO)',
      ],
      codeExamples: [
        {
          title: 'Custom Metric Vector with Operator Overloading',
          description: 'Constructing a mathematical vector with dunder methods and value immutability.',
          code: `class Vector2D:
    __slots__ = ('_x', '_y')  # Optimize memory footprint by bypassing __dict__

    def __init__(self, x: float, y: float):
        self._x = float(x)
        self._y = float(y)

    @property
    def x(self) -> float:
        return self._x

    @property
    def y(self) -> float:
        return self._y

    def __add__(self, other: 'Vector2D') -> 'Vector2D':
        if not isinstance(other, Vector2D):
            return NotImplemented
        return Vector2D(self._x + other._x, self._y + other._y)

    def __repr__(self) -> str:
        return f"Vector2D({self._x}, {self._y})"

v1 = Vector2D(3.0, 4.0)
v2 = Vector2D(1.0, 2.0)
print("Vector Sum:", v1 + v2)`,
          output: `Vector Sum: Vector2D(4.0, 6.0)`,
          explanation: '__slots__ eliminates the default per-instance __dict__ dictionary, reducing memory overhead by up to 60% for high-frequency objects.',
        },
      ],
      gotchas: [
        {
          title: 'Accidental Class Attribute Mutation',
          badCode: `class StudentRegistry:\n    enrolled = [] # ❌ Shared across ALL instances\n\ns1 = StudentRegistry()\ns1.enrolled.append("Kiel")\ns2 = StudentRegistry()\nprint(s2.enrolled) # Contains "Kiel"!`,
          goodCode: `class StudentRegistry:\n    def __init__(self):\n        self.enrolled = [] # ✅ Isolated to individual instance\n\ns1 = StudentRegistry()\ns1.enrolled.append("Kiel")\ns2 = StudentRegistry()\nprint(s2.enrolled) # []`,
          explanation: 'Attributes defined at the class block level exist on the class object and are shared by all instances unless overridden.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 03 OOP & Dunder Protocols Test (30 Questions)',
        instructions: 'Comprehensive 30-Question Assessment on object-oriented architecture, C3 linearization, descriptors, and magic methods.',
        questions: [],
      },
    },
    {
      id: 4,
      stageNumber: 'Stage 04',
      title: 'Asyncio, CPython Internals & Production APIs',
      tagline: 'Event loops, coroutines, GIL synchronization, and resilient microservices',
      level: 'Advanced',
      durationHours: '35-45 hrs',
      summary: 'Master asynchronous systems engineering: cooperative multitasking with asyncio, non-blocking socket multiplexing, understanding the Global Interpreter Lock (GIL), and production API resilience with FastAPI.',
      coreConcepts: [
        'Asynchronous I/O multiplexing: epoll/kqueue underlying the asyncio single-threaded event loop',
        'Coroutines, Tasks, and Futures: cooperative yield points with async and await',
        'Global Interpreter Lock (GIL): implications on CPU-bound vs I/O-bound concurrency',
        'High-throughput backend service design: connection pooling, graceful shutdown, and structured logging',
      ],
      codeExamples: [
        {
          title: 'Concurrent Microservice Aggregation with asyncio.gather',
          description: 'Executing multiple asynchronous network calls concurrently with error resilience.',
          code: `import asyncio

async def fetch_service(name: str, delay: float) -> dict:
    print(f"Dispatching query to {name}...")
    await asyncio.sleep(delay)
    return {"service": name, "status": "200 OK"}

async def main():
    start = asyncio.get_event_loop().time()
    results = await asyncio.gather(
        fetch_service("AuthMicroservice", 0.05),
        fetch_service("BillingMicroservice", 0.08),
        fetch_service("TelemetryMicroservice", 0.03),
    )
    elapsed = asyncio.get_event_loop().time() - start
    print(f"Aggregated {len(results)} services in {elapsed:.3f}s")
    for res in results:
        print(" -", res)

asyncio.run(main())`,
          output: `Dispatching query to AuthMicroservice...\nDispatching query to BillingMicroservice...\nDispatching query to TelemetryMicroservice...\nAggregated 3 services in 0.081s\n - {'service': 'AuthMicroservice', 'status': '200 OK'}\n - {'service': 'BillingMicroservice', 'status': '200 OK'}\n - {'service': 'TelemetryMicroservice', 'status': '200 OK'}`,
          explanation: 'asyncio.gather executes independent coroutines concurrently on a single OS thread via cooperative I/O multiplexing, completing in max(delays) rather than sum(delays).',
        },
      ],
      gotchas: [
        {
          title: 'Invoking Blocking Synchronous Calls in an Async Event Loop',
          badCode: `import time\nasync def handle_request():\n    time.sleep(2) # ❌ Freezes the ENTIRE event loop for all users!`,
          goodCode: `import asyncio\nasync def handle_request():\n    await asyncio.sleep(2) # ✅ Yields execution to other concurrent coroutines`,
          explanation: 'Because Python asyncio runs cooperatively on a single thread, any synchronous blocking call completely freezes event processing for every active socket connection.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 04 Asynchronous Systems & Internals Test (30 Questions)',
        instructions: 'Test your mastery of coroutine scheduling, non-blocking I/O multiplexing, GIL constraints, and microservices architecture.',
        questions: [],
      },
    },
  ],

  // =========================================================================
  // 2. GO / GOLANG (CS-401: Distributed Systems & Cloud Infrastructure)
  // =========================================================================
  golang: [
    {
      id: 1,
      stageNumber: 'Stage 01',
      title: 'Go Type System, Memory Layout & Pointers',
      tagline: 'Stack vs heap, escape analysis, slice headers, and struct tags',
      level: 'Beginner',
      durationHours: '20-25 hrs',
      summary: 'Master the fundamental mechanics of Go: value vs reference semantics, stack vs heap allocation, escape analysis by the 6g compiler, slice header data structures, and struct memory layout.',
      coreConcepts: [
        'Static typing, zero values, and explicit type conversion (no implicit coercion)',
        'Pointer mechanics: referencing (&) and dereferencing (*), no pointer arithmetic',
        'Stack allocation vs Heap allocation: how the Go compiler performs escape analysis',
        'Slice 3-word header layout: pointer to backing array, length (len), and capacity (cap)',
        'Structs: memory alignment, padding bytes, and struct tags for serialization',
      ],
      codeExamples: [
        {
          title: 'Slice Backing Array Reallocation & Pointer Mutability',
          description: 'Demonstrating how slice capacity growth reallocates backing arrays.',
          code: `package main
import "fmt"

func inspectSlice(name string, s []int) {
    fmt.Printf("%s: len=%d, cap=%d, address=%p\\n", name, len(s), cap(s), s)
}

func main() {
    // Initial slice with length 2 and capacity 2
    data := make([]int, 2, 2)
    data[0] = 10; data[1] = 20
    inspectSlice("Initial", data)

    // Append exceeds capacity, forcing allocation of a new backing array
    data = append(data, 30)
    inspectSlice("Post-Append", data)
}`,
          output: `Initial: len=2, cap=2, address=0xc000014090\nPost-Append: len=3, cap=4, address=0xc0000160e0`,
          explanation: 'When append exceeds slice capacity, Go allocates a new contiguous backing array with doubled capacity and copies elements over, changing the slice pointer.',
        },
      ],
      gotchas: [
        {
          title: 'Capturing Loop Variable Pointers in Goroutines / Closures',
          badCode: `values := []string{"a", "b", "c"}\nfor _, v := range values {\n    go func() {\n        fmt.Println(v) // ❌ In older Go, prints "c", "c", "c" (shared memory address)\n    }()\n}`,
          goodCode: `values := []string{"a", "b", "c"}\nfor _, v := range values {\n    go func(val string) {\n        fmt.Println(val) // ✅ Passed by value as function parameter\n    }(v)\n}`,
          explanation: 'Before Go 1.22, loop iteration variables were reused across iterations, meaning goroutines referencing the variable pointer captured the final value.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 01 Go Memory & Type Foundations Test (30 Questions)',
        instructions: 'Official Mid-term Milestone: 30 proctored questions on Go static typing, pointers, slice internals, and escape analysis.',
        questions: [],
      },
    },
    {
      id: 2,
      stageNumber: 'Stage 02',
      title: 'Structural Interfaces & Idiomatic Error Handling',
      tagline: 'Implicit interface satisfaction, itable dispatch, errors-as-values, and modules',
      level: 'Elementary',
      durationHours: '25-30 hrs',
      summary: 'Explore Go’s structural subtyping: implicit interface satisfaction, the internal 2-word interface structure (type descriptor + value pointer), errors as values, sentinel errors, and errors.Is / As wrapping.',
      coreConcepts: [
        'Structural typing: types satisfy interfaces implicitly without implements keyword',
        'Interface internal 2-word representation: itable (interface table) + data pointer',
        'The nil interface trap: an interface containing a typed nil pointer is NOT nil',
        'Errors as values: sentinel errors (ErrNotFound), custom error structs, and errors.Is/As',
        'Package boundaries: exported vs unexported symbols and Go module architecture',
      ],
      codeExamples: [
        {
          title: 'Custom Error Wrapping & Domain Interface Dispatch',
          description: 'Constructing domain error chains with %w and verifying with errors.Is.',
          code: `package main
import (
    "errors"
    "fmt"
)

var ErrDatabaseConnection = errors.New("db: connection timeout")

type QueryError struct {
    Query string
    Err   error
}

func (e *QueryError) Error() string {
    return fmt.Sprintf("failed executing query '%s': %v", e.Query, e.Err)
}

func (e *QueryError) Unwrap() error {
    return e.Err
}

func main() {
    underlying := fmt.Errorf("network down: %w", ErrDatabaseConnection)
    queryErr := &QueryError{Query: "SELECT * FROM users", Err: underlying}

    fmt.Println("Error message:", queryErr)
    fmt.Println("Matches ErrDatabaseConnection?", errors.Is(queryErr, ErrDatabaseConnection))
}`,
          output: `Error message: failed executing query 'SELECT * FROM users': network down: db: connection timeout\nMatches ErrDatabaseConnection? true`,
          explanation: 'Implementing the Unwrap() method enables Go standard library errors.Is and errors.As to traverse the wrapped error chain recursively.',
        },
      ],
      gotchas: [
        {
          title: 'The Typed Nil Interface Pitfall',
          badCode: `type CustomErr struct{}\nfunc (c *CustomErr) Error() string { return "error" }\nfunc getErr() error {\n    var p *CustomErr = nil\n    return p // ❌ Returns interface with non-nil type info!\n}\nif getErr() != nil { fmt.Println("Failed!") } // Evaluates to TRUE!`,
          goodCode: `func getErr() error {\n    var p *CustomErr = nil\n    if p == nil {\n        return nil // ✅ Return literal nil to preserve empty interface\n    }\n    return p\n}`,
          explanation: 'An interface in Go is only nil if BOTH its type descriptor and value pointer are nil. Returning a typed nil pointer produces a non-nil interface.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 02 Go Interfaces & Error Architecture Test (30 Questions)',
        instructions: 'Test your understanding of structural interfaces, itable dispatch, error wrapping, and package design.',
        questions: [],
      },
    },
    {
      id: 3,
      stageNumber: 'Stage 03',
      title: 'Goroutines, CSP Channels & Concurrency Primitives',
      tagline: 'M:N scheduler (GMP), unbuffered/buffered channels, select, mutexes, and context',
      level: 'Intermediate',
      durationHours: '30-35 hrs',
      summary: 'Master Go concurrency: the GMP runtime scheduler, Communicating Sequential Processes (CSP), buffered vs unbuffered channels, select multiplexing, sync primitives (Mutex, RWMutex, WaitGroup), and Context cancellation trees.',
      coreConcepts: [
        'The Go M:N Scheduler: Goroutines (G), OS Threads (M), and Logical Processors (P)',
        'Communicating Sequential Processes: "Do not communicate by sharing memory; share memory by communicating"',
        'Channel mechanics: unbuffered synchronous handoffs vs buffered asynchronous queues',
        'Select multiplexing with timeouts and non-blocking default branches',
        'Context package: deadline propagation, graceful cancellation, and request-scoped values',
      ],
      codeExamples: [
        {
          title: 'Worker Pool with CSP Channels & Context Cancellation',
          description: 'A robust concurrent task processing pipeline with graceful shutdown.',
          code: `package main
import (
    "context"
    "fmt"
    "sync"
    "time"
)

func worker(ctx context.Context, id int, jobs <-chan int, wg *sync.WaitGroup) {
    defer wg.Done()
    for {
        select {
        case <-ctx.Done():
            fmt.Printf("Worker %d exiting due to cancellation\\n", id)
            return
        case job, ok := <-jobs:
            if !ok { return }
            fmt.Printf("Worker %d completed job %d\\n", id, job)
        }
    }
}

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
    defer cancel()

    jobs := make(chan int, 5)
    var wg sync.WaitGroup

    for w := 1; w <= 2; w++ {
        wg.Add(1)
        go worker(ctx, w, jobs, &wg)
    }

    for j := 1; j <= 4; j++ { jobs <- j }
    close(jobs)
    wg.Wait()
}`,
          output: `Worker 1 completed job 1\nWorker 2 completed job 2\nWorker 1 completed job 3\nWorker 2 completed job 4`,
          explanation: 'Channels coordinate work queues while sync.WaitGroup guarantees all background goroutines finish cleanly before main process exit.',
        },
      ],
      gotchas: [
        {
          title: 'Deadlock on Unbuffered Channels',
          badCode: `ch := make(chan int) // Unbuffered\nch <- 42             // ❌ Deadlock! Sender blocks waiting for receiver on same goroutine\nval := <-ch`,
          goodCode: `ch := make(chan int, 1) // ✅ Buffered channel allows single item without waiting\nch <- 42\nval := <-ch\nfmt.Println(val)`,
          explanation: 'Writing to an unbuffered channel blocks the calling goroutine until another goroutine reads from it. Writing and reading on the same thread causes instant deadlock.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 03 Go Concurrency & Synchronization Test (30 Questions)',
        instructions: 'Comprehensive 30-Question Assessment on Goroutines, channels, deadlock detection, and context trees.',
        questions: [],
      },
    },
    {
      id: 4,
      stageNumber: 'Stage 04',
      title: 'High-Throughput Microservices, Profiling & Docker',
      tagline: 'net/http routing, JSON streaming, pprof CPU/memory profiling, and multi-stage builds',
      level: 'Advanced',
      durationHours: '35-45 hrs',
      summary: 'Engineer production-grade Go services: high-concurrency HTTP multiplexers with Go 1.22 routing, streaming JSON encoders, detecting data races with -race, performance profiling with pprof, and minimal scratch Docker containers.',
      coreConcepts: [
        'Production net/http: Server timeouts (ReadTimeout, WriteTimeout, IdleTimeout) to prevent Slowloris attacks',
        'High-performance JSON serialization: json.Decoder streaming vs json.Unmarshal buffering',
        'Runtime race detector: compiling with -race to identify unsynchronized shared memory access',
        'Performance profiling with runtime/pprof: analyzing CPU flame graphs and heap allocations',
        'Minimal multi-stage Docker builds: compiling static CGO_ENABLED=0 binaries deployed onto scratch images',
      ],
      codeExamples: [
        {
          title: 'Production HTTP Microservice with Method-Based Routing',
          description: 'Modern Go 1.22 enhanced HTTP routing with middleware chaining and health checks.',
          code: `package main
import (
    "encoding/json"
    "fmt"
    "net/http"
    "time"
)

type HealthResponse struct {
    Status    string    \`json:"status"\`
    Timestamp time.Time \`json:"timestamp"\`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    resp := HealthResponse{Status: "healthy", Timestamp: time.Now()}
    json.NewEncoder(w).Encode(resp)
}

func main() {
    mux := http.NewServeMux()
    // Go 1.22 method-specific pattern matching
    mux.HandleFunc("GET /api/v1/health", healthHandler)

    server := &http.Server{
        Addr:         ":8080",
        Handler:      mux,
        ReadTimeout:  5 * time.Second,
        WriteTimeout: 10 * time.Second,
        IdleTimeout:  120 * time.Second,
    }
    fmt.Println("Server listening on :8080 with strict timeouts")
    _ = server
}`,
          output: `Server listening on :8080 with strict timeouts`,
          explanation: 'Configuring explicit ReadTimeout and WriteTimeout prevents resource starvation from hung client connections in high-throughput cloud environments.',
        },
      ],
      gotchas: [
        {
          title: 'Neglecting to Close HTTP Response Body',
          badCode: `resp, err := http.Get("https://api.kieltech.edu/status")\nif err != nil { return }\n// ❌ Forgot resp.Body.Close() -> Leaks TCP socket connection!`,
          goodCode: `resp, err := http.Get("https://api.kieltech.edu/status")\nif err != nil { return }\ndefer resp.Body.Close() // ✅ Guarantees socket reuse in HTTP connection pool`,
          explanation: 'Failing to close resp.Body exhausts OS file descriptors and prevents Go’s default HTTP transport from reusing underlying TCP connections.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 04 Go Systems Production Mastery Test (30 Questions)',
        instructions: 'Test your mastery of microservices architecture, socket timeouts, pprof profiling, and multi-arch deployments.',
        questions: [],
      },
    },
  ],

  // =========================================================================
  // 3. RUST (CS-415: Systems Programming & Memory Safety)
  // =========================================================================
  rust: [
    {
      id: 1,
      stageNumber: 'Stage 01',
      title: 'Affine Type System, Ownership & Borrowing',
      tagline: 'Move semantics, stack vs heap, mutable/immutable borrows, and RAII',
      level: 'Beginner',
      durationHours: '25-30 hrs',
      summary: 'Delve into Rust’s revolutionary memory safety model without garbage collection: affine move semantics, ownership transfer, stack vs heap allocation, and the fundamental borrow checker rule (aliasing XOR mutability).',
      coreConcepts: [
        'The Three Ownership Rules: each value has an owner, only one owner at a time, owner drops memory on scope exit',
        'Move semantics vs Copy trait: primitive types copy automatically; heap types move ownership',
        'Borrowing discipline: unlimited immutable references (&T) OR exactly one mutable reference (&mut T)',
        'Zero-cost abstractions: compile-time memory guarantees with zero runtime overhead',
      ],
      codeExamples: [
        {
          title: 'Ownership Transfer & Slice Borrowing',
          description: 'Tracking how values move across functions and referencing without copying.',
          code: `fn calculate_length(s: &String) -> usize {
    s.len() // Borrowed reference; s is NOT dropped when function returns
}

fn main() {
    let mut greeting = String::from("KielTech Academy");
    
    // Pass immutable borrow to function
    let len = calculate_length(&greeting);
    println!("Length of '{}': {}", greeting, len);

    // Mutable borrow modifies buffer in place
    greeting.push_str(" Systems Engineering");
    println!("Updated: {}", greeting);
}`,
          output: `Length of 'KielTech Academy': 16\nUpdated: KielTech Academy Systems Engineering`,
          explanation: 'Borrowing with &String passes an address pointer without transferring ownership, leaving greeting valid in the caller frame.',
        },
      ],
      gotchas: [
        {
          title: 'Simultaneous Mutable and Immutable Borrows',
          badCode: `let mut data = vec![1, 2, 3];\nlet first = &data[0]; // Immutable borrow\ndata.push(4);         // ❌ Mutable borrow! Compile error: cannot borrow data as mutable\nprintln!("First: {}", first);`,
          goodCode: `let mut data = vec![1, 2, 3];\nlet first = data[0];  // Copy integer value\ndata.push(4);         // ✅ Allowed because no reference is active\nprintln!("First: {}", first);`,
          explanation: 'Pushing to a vector may reallocate its backing array on the heap, which would invalidate existing pointers. The borrow checker statically prevents this dangling pointer bug.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 01 Rust Ownership & Memory Foundations Test (30 Questions)',
        instructions: 'Official Mid-term Milestone: 30 proctored questions on move semantics, borrow checker rules, and RAII drops.',
        questions: [],
      },
    },
    {
      id: 2,
      stageNumber: 'Stage 02',
      title: 'Algebraic Data Types, Pattern Matching & Traits',
      tagline: 'Option, Result, exhaustive match, ? operator, and trait bounds',
      level: 'Elementary',
      durationHours: '25-30 hrs',
      summary: 'Harness algebraic data types: Enums with associated values, Option<T> for null safety, Result<T, E> for error handling, the ? operator for error propagation, and Traits for shared behavior and polymorphism.',
      coreConcepts: [
        'Enums as Sum Types: carrying heterogeneous data payloads in variant structures',
        'Exhaustive pattern matching: match statements and if let syntax sugar',
        'Result<T, E> and Option<T>: eliminating null pointer exceptions statically',
        'The question mark (?) operator for clean, idiomatic error propagation',
        'Traits: defining shared interfaces and implementing them on custom types',
      ],
      codeExamples: [
        {
          title: 'Robust Error Propagation with Result and Traits',
          description: 'Composing operations with the ? operator and custom error types.',
          code: `#[derive(Debug)]
enum MathError {
    DivisionByZero,
    NegativeSquareRoot,
}

fn safe_divide(numerator: f64, denominator: f64) -> Result<f64, MathError> {
    if denominator == 0.0 {
        Err(MathError::DivisionByZero)
    } else {
        Ok(numerator / denominator)
    }
}

fn calculate_metrics() -> Result<f64, MathError> {
    let result = safe_divide(100.0, 4.0)?;
    Ok(result * 1.5)
}

fn main() {
    match calculate_metrics() {
        Ok(val) => println!("Calculated: {:.2}", val),
        Err(e) => println!("Calculation failed: {:?}", e),
    }
}`,
          output: `Calculated: 37.50`,
          explanation: 'The ? operator unwraps Ok(val) or returns early with Err(e), enforcing clean and explicit error handling without exceptions.',
        },
      ],
      gotchas: [
        {
          title: 'Unchecked .unwrap() in Production Code',
          badCode: `let config: Option<String> = None;\nlet val = config.unwrap(); // ❌ Panics and crashes the entire thread if None!`,
          goodCode: `let config: Option<String> = None;\nlet val = config.unwrap_or_else(|| String::from("default_config")); // ✅ Safe fallback`,
          explanation: 'Calling .unwrap() converts a None or Err into an immediate runtime panic. Production systems should use unwrap_or, expect, or pattern matching.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 02 Rust Enums, Traits & Error Handling Test (30 Questions)',
        instructions: 'Test your understanding of pattern matching, trait bounds, and Result error propagation.',
        questions: [],
      },
    },
    {
      id: 3,
      stageNumber: 'Stage 03',
      title: 'Explicit Lifetimes & Smart Pointer Architecture',
      tagline: "Generic lifetimes ('a), Box, Rc, Arc, RefCell, and Send/Sync concurrency",
      level: 'Intermediate',
      durationHours: '30-40 hrs',
      summary: 'Master advanced Rust memory structures: generic lifetime annotations (\'a), lifetime elision rules, smart pointers for heap allocation (Box<T>), reference counting (Rc<T> / Arc<T>), interior mutability (RefCell<T>), and Send/Sync traits.',
      coreConcepts: [
        'Generic lifetime annotations (\'a): informing the borrow checker of reference duration relationships',
        'Lifetime elision rules: when the compiler infers lifetimes automatically',
        'Box<T>: heap allocation with single-owner semantics and recursive types',
        'Arc<T> and Mutex<T>: atomic reference counting and thread-safe shared mutable state',
        'Send and Sync marker traits: defining which types can cross thread boundaries safely',
      ],
      codeExamples: [
        {
          title: 'Thread-Safe Shared State with Arc<Mutex<T>>',
          description: 'Safely sharing and mutating data across operating system threads.',
          code: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // Atomic reference counted mutex on the heap
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..5 {
        let counter_clone = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter_clone.lock().unwrap();
            *num += 1; // Safely mutate protected data
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Final Counter Result: {}", *counter.lock().unwrap());
}`,
          output: `Final Counter Result: 5`,
          explanation: 'Arc enables multiple thread ownership, while Mutex enforces exclusive access, preventing data races at compile time via Send and Sync traits.',
        },
      ],
      gotchas: [
        {
          title: 'Reference Cycles Causing Memory Leaks with Rc/Arc',
          badCode: `// Node A points to Node B with Rc, and Node B points to Node A with Rc -> Memory cycle!`,
          goodCode: `// Use Weak<T> (non-owning reference) for parent or back-pointers to break cycles`,
          explanation: 'Circular references with strong Rc/Arc pointers never reach zero reference count, causing memory leaks. Use std::rc::Weak to break cycles.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 03 Rust Lifetimes & Smart Pointers Test (30 Questions)',
        instructions: 'Comprehensive 30-Question Assessment on generic lifetimes, smart pointer memory layouts, and thread safety.',
        questions: [],
      },
    },
    {
      id: 4,
      stageNumber: 'Stage 04',
      title: 'Async Rust with Tokio & High-Throughput Axum APIs',
      tagline: 'Future trait, Tokio multi-threaded runtime, Axum framework, and zero-cost APIs',
      level: 'Advanced',
      durationHours: '35-45 hrs',
      summary: 'Engineer high-throughput systems services in Rust: the Future trait and state machine compilation, the Tokio multi-threaded work-stealing runtime, non-blocking I/O with Tokio sockets, and building enterprise web services with Axum.',
      coreConcepts: [
        'The Future trait: lazy evaluation and cooperative poll(cx: &mut Context) mechanics',
        'Tokio runtime architecture: epoll reactor, timer wheels, and multi-threaded work-stealing scheduler',
        'Channels in async Rust: tokio::sync::mpsc and broadcast channels',
        'Axum web microservices: type-safe extractors, Tower middleware, and zero-allocation routing',
      ],
      codeExamples: [
        {
          title: 'Asynchronous HTTP Microservice Router with Axum & Tokio',
          description: 'Constructing a lightning-fast HTTP endpoint with type-safe extractors.',
          code: `// High-Performance Axum Web Service Architecture
// Cargo dependencies: axum = "0.7", tokio = { version = "1.0", features = ["full"] }

use std::time::Instant;

struct HealthPayload {
    service: &'static str,
    uptime_ms: u64,
}

async fn health_check() -> String {
    format!("{{\"service\":\"KielTech-Rust-Core\",\"status\":\"healthy\",\"threads\":4}}")
}

#[tokio::main]
async fn main() {
    let start = Instant::now();
    let response = health_check().await;
    println!("Executed async health check in {:?}: {}", start.elapsed(), response);
}`,
          output: `Executed async health check in 14.2µs: {"service":"KielTech-Rust-Core","status":"healthy","threads":4}`,
          explanation: 'Tokio futures compile down to zero-allocation finite state machines, executing asynchronous requests in sub-microsecond latency.',
        },
      ],
      gotchas: [
        {
          title: 'Holding a std::sync::Mutex across an .await point',
          badCode: `let guard = std_mutex.lock().unwrap();\nsomething_async().await; // ❌ Can cause deadlocks and starves Tokio scheduler thread!`,
          goodCode: `let guard = tokio_mutex.lock().await; // ✅ Use tokio::sync::Mutex across await points\nsomething_async().await;`,
          explanation: 'A std::sync::Mutex blocks the OS thread. If held across an .await point where the coroutine yields, the underlying worker thread cannot process other tasks.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 04 Async Rust & Systems Microservices Test (30 Questions)',
        instructions: 'Test your mastery of Tokio async runtimes, Future state machines, Axum web microservices, and SIMD optimizations.',
        questions: [],
      },
    },
  ],

  // =========================================================================
  // 4. TYPESCRIPT (CS-320: Advanced Type Systems & Formal Verification)
  // =========================================================================
  typescript: [
    {
      id: 1,
      stageNumber: 'Stage 01',
      title: 'Structural Subtyping & Type Inference Engine',
      tagline: 'Structural typing, primitive vs object types, unions, and intersections',
      level: 'Beginner',
      durationHours: '15-20 hrs',
      summary: 'Master the formal mechanics of TypeScript: structural typing (duck typing for shapes) vs nominal systems, type inference, literal types, union types, intersection types, and type widening.',
      coreConcepts: [
        'Structural typing (duck typing): assignability based on shape rather than declared class hierarchy',
        'Primitive types vs object types: string, number, boolean, symbol, bigint, null, undefined',
        'Union types (|) and intersection types (&): modeling composite domain constraints',
        'Literal types and const assertions (as const) for strict compile-time value tracking',
        'Type widening and narrowing: how control flow analysis refines types',
      ],
      codeExamples: [
        {
          title: 'Structural Compatibility & Const Assertions',
          description: 'Demonstrating structural subtyping and immutable tuple typing.',
          code: `interface AcademicUser {
  id: string;
  name: string;
}

function printStudent(user: AcademicUser) {
  console.log(\`Student: \${user.name} (\${user.id})\`);
}

// Extra properties are permitted in structural assignment
const studentData = {
  id: "KT-8841",
  name: "Marcus Vance",
  gpa: 3.95,
  major: "Computer Science"
};

printStudent(studentData); // ✅ Structurally valid!

// Immutable const assertion
const ROLES = ["Undergrad", "Candidate", "Alumni"] as const;
type Role = typeof ROLES[number]; // "Undergrad" | "Candidate" | "Alumni"`,
          output: `Student: Marcus Vance (KT-8841)`,
          explanation: 'TypeScript evaluates assignability structurally: if studentData contains all required properties of AcademicUser with compatible types, it satisfies the interface.',
        },
      ],
      gotchas: [
        {
          title: 'Excess Property Checks on Object Literals',
          badCode: `printStudent({ id: "KT-1", name: "Alex", gpa: 4.0 }); // ❌ Error: Object literal may only specify known properties`,
          goodCode: `const data = { id: "KT-1", name: "Alex", gpa: 4.0 };\nprintStudent(data); // ✅ Excess property checks are bypassed when passing intermediate variables`,
          explanation: 'TypeScript applies strict excess property checks exclusively to direct object literals to catch typos. Intermediate variables bypass this check.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 01 TypeScript Foundations & Structural Typing Test (30 Questions)',
        instructions: 'Official Mid-term Milestone: 30 questions on structural typing, type inference, union/intersection types, and const assertions.',
        questions: [],
      },
    },
    {
      id: 2,
      stageNumber: 'Stage 02',
      title: 'Generics, Constraints & Discriminated Unions',
      tagline: 'Generic functions, extends constraints, keyof, and tagged union state machines',
      level: 'Elementary',
      durationHours: '20-25 hrs',
      summary: 'Build scalable abstractions using Generics: type parameters, constraints with extends, keyof indexed queries, and exhaustive type narrowing with Discriminated Unions.',
      coreConcepts: [
        'Generics: parameterizing types across functions, interfaces, and classes',
        'Generic constraints: <T extends Record<string, unknown>> restricting type shapes',
        'The keyof operator and indexed access types: T[K] property extraction',
        'Discriminated Unions: tagged union patterns for representing algebraic state machines',
        'Exhaustiveness checking: using never in the default branch of switch statements',
      ],
      codeExamples: [
        {
          title: 'Discriminated Union State Machine with Exhaustiveness Checking',
          description: 'A compiler-enforced state machine pattern using the never type.',
          code: `type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function renderState<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case 'idle': return "Waiting to start...";
    case 'loading': return "Fetching payload...";
    case 'success': return \`Data received: \${JSON.stringify(state.data)}\`;
    case 'error': return \`Failure: \${state.error.message}\`;
    default: {
      // Exhaustiveness verification: catches unhandled variants at compile-time
      const _exhaustiveCheck: never = state;
      return _exhaustiveCheck;
    }
  }
}

console.log(renderState({ status: 'success', data: { score: 98 } }));`,
          output: `Data received: {"score":98}`,
          explanation: 'If a new variant is added to AsyncState, the TypeScript compiler will fail at _exhaustiveCheck, ensuring every branch is explicitly handled.',
        },
      ],
      gotchas: [
        {
          title: 'Using "any" instead of "unknown"',
          badCode: `function parse(input: any) {\n  input.toUpperCase(); // ❌ Compiles without errors, crashes at runtime if input is number!\n}`,
          goodCode: `function parse(input: unknown) {\n  if (typeof input === 'string') {\n    input.toUpperCase(); // ✅ Type narrowed safely\n  }\n}`,
          explanation: 'any disables the type checker entirely. unknown represents any value while forcing explicit runtime type checking before usage.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 02 TypeScript Generics & Discriminated Unions Test (30 Questions)',
        instructions: 'Test your understanding of generic constraints, keyof lookups, and exhaustive discriminated unions.',
        questions: [],
      },
    },
    {
      id: 3,
      stageNumber: 'Stage 03',
      title: 'Conditional Types, Infer & Mapped Transformations',
      tagline: 'T extends U ? X : Y, infer keyword, mapped types, and template literals',
      level: 'Intermediate',
      durationHours: '30-35 hrs',
      summary: 'Explore type-level meta-programming: conditional types, inferring types within conditions with infer, mapped types with key remapping, and template literal types for compile-time string manipulation.',
      coreConcepts: [
        'Conditional types: T extends U ? X : Y for programmatic type branches',
        'Distributive conditional types: how naked type parameters distribute across unions',
        'The infer keyword: extracting return types, promise payloads, and array elements',
        'Mapped types: [K in keyof T] transformation mechanics with modifiers (-readonly, ?)',
        'Key remapping via as and Template Literal Types: creating string patterns',
      ],
      codeExamples: [
        {
          title: 'Deep Readonly & Promise Unwrapping with Infer',
          description: 'Type-level utility types that recursively transform complex structures.',
          code: `// Recursively unpack Promise<Promise<T>> or standard values
type AwaitedRecursive<T> = T extends Promise<infer U> ? AwaitedRecursive<U> : T;

type EventNames = 'enroll' | 'graduate';
type Handlers = {
  [K in EventNames as \`on\${Capitalize<K>}\`]: (timestamp: number) => void;
};

// Handlers type is: { onEnroll: (timestamp: number) => void; onGraduate: (timestamp: number) => void }
const dispatcher: Handlers = {
  onEnroll: (ts) => console.log("Enrolled at:", ts),
  onGraduate: (ts) => console.log("Graduated at:", ts),
};

dispatcher.onGraduate(Date.now());`,
          output: `Graduated at: 1791198000000`,
          explanation: 'Template literal types paired with Capitalize<K> enable dynamic key remapping in mapped types, generating type-safe event handler interfaces.',
        },
      ],
      gotchas: [
        {
          title: 'Unintended Union Distribution in Conditional Types',
          badCode: `type IsArray<T> = T extends any[] ? true : false;\ntype Test = IsArray<string | number[]>; // Resolves to boolean (true | false)!`,
          goodCode: `type IsArray<T> = [T] extends [any[]] ? true : false; // ✅ Wrap in tuples to prevent distribution\ntype Test = IsArray<string | number[]>; // Resolves strictly to false`,
          explanation: 'Naked type parameters in conditional types distribute across unions. Wrapping the parameter in a tuple [T] disables distribution.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 03 TypeScript Conditional & Mapped Types Test (30 Questions)',
        instructions: 'Comprehensive 30-Question Assessment on conditional types, infer type extraction, and template literal types.',
        questions: [],
      },
    },
    {
      id: 4,
      stageNumber: 'Stage 04',
      title: 'Compiler Architecture, Declaration Files & Monorepos',
      tagline: 'tsconfig flags, AST declarations (.d.ts), branded nominal types, and Project References',
      level: 'Advanced',
      durationHours: '35-45 hrs',
      summary: 'Master enterprise TypeScript engineering: strict compiler configuration (strictNullChecks, noUncheckedIndexedAccess), writing custom .d.ts ambient declaration files, branded types for nominal safety, and monorepos with Project References.',
      coreConcepts: [
        'Strict compiler flags: strictNullChecks, noImplicitAny, noUncheckedIndexedAccess, exactOptionalPropertyTypes',
        'Branded / Nominal types: simulating nominal typing in a structural system using unique symbols',
        'Declaration files (.d.ts) and ambient namespaces: declaring types for third-party libraries',
        'TypeScript Project References (composite: true) and incremental build caching',
      ],
      codeExamples: [
        {
          title: 'Branded Nominal Types for Domain Security',
          description: 'Preventing accidental mixing of primitive IDs (e.g. StudentId vs CourseId).',
          code: `// Brand symbol helper
declare const Brand: unique symbol;
type Brand<T, B> = T & { readonly [Brand]: B };

type StudentId = Brand<string, 'StudentId'>;
type CourseId = Brand<string, 'CourseId'>;

function createStudentId(id: string): StudentId {
  return id as StudentId;
}

function createCourseId(id: string): CourseId {
  return id as CourseId;
}

function enroll(student: StudentId, course: CourseId) {
  console.log(\`Enrolled student \${student} in course \${course}\`);
}

const sId = createStudentId("KT-991");
const cId = createCourseId("CS-320");

enroll(sId, cId); // ✅ Type-safe!
// enroll(cId, sId); // ❌ Compile error: Argument of type 'CourseId' is not assignable to 'StudentId'`,
          output: `Enrolled student KT-991 in course CS-320`,
          explanation: 'Branded types attach phantom compile-time metadata to primitives, preventing catastrophic domain bugs like passing an account ID into a user ID slot.',
        },
      ],
      gotchas: [
        {
          title: 'Relying on Non-Null Assertion Operator (!)',
          badCode: `const user = fetchUser();\nuser!.profile.email; // ❌ Bypasses compiler safety; throws TypeError at runtime if user is null!`,
          goodCode: `const user = fetchUser();\nif (user?.profile?.email) {\n  console.log(user.profile.email); // ✅ Safe optional chaining & narrowing\n}`,
          explanation: 'The non-null assertion operator (!) tells the compiler to assume a value is never null, eliminating safety checks and leading to production crashes.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 04 TypeScript Compiler Architecture & Enterprise Patterns Test (30 Questions)',
        instructions: 'Test your mastery of branded types, declaration files, tsconfig optimization, and monorepo architectures.',
        questions: [],
      },
    },
  ],

  // =========================================================================
  // 5. REACT.JS (CS-330: Frontend Architecture & Concurrent Scheduling)
  // =========================================================================
  react: [
    {
      id: 1,
      stageNumber: 'Stage 01',
      title: 'Declarative Component Architecture & Virtual DOM',
      tagline: 'JSX compilation, unidirectional data flow, pure components, and reconciliation',
      level: 'Beginner',
      durationHours: '15-20 hrs',
      summary: 'Understand the foundations of React: JSX transpilation into React.createElement, the component tree, props immutability, pure functional components, and the Virtual DOM diffing heuristics.',
      coreConcepts: [
        'Declarative UI: modeling view as a pure projection of state f(state) = UI',
        'JSX compilation: React.createElement and the modern JSX automatic runtime (react/jsx-runtime)',
        'Props immutability and unidirectional data flow down the component hierarchy',
        'Virtual DOM diffing heuristics: key identity, element type comparisons, and O(N) tree traversal',
      ],
      codeExamples: [
        {
          title: 'Pure Functional Component with Strict Props Contract',
          description: 'Constructing deterministic components with clean prop interfaces.',
          code: `interface StageBadgeProps {
  stageNumber: number;
  title: string;
  isCompleted: boolean;
}

function StageBadge({ stageNumber, title, isCompleted }: StageBadgeProps) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
      <span className="font-mono text-xs text-amber-400 font-bold">Stage 0{stageNumber}:</span>
      <span className="text-white font-medium">{title}</span>
      <span className={\`ml-auto text-xs px-2 py-0.5 rounded font-mono \${
        isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
      }\`}>
        {isCompleted ? 'CLEARED' : 'PENDING'}
      </span>
    </div>
  );
}`,
          output: `Component rendered with deterministic styling based on props`,
          explanation: 'Pure components produce identical DOM elements for identical prop inputs without side effects, enabling reliable memoization.',
        },
      ],
      gotchas: [
        {
          title: 'Using Array Indices as React List Keys',
          badCode: `items.map((item, index) => <TodoItem key={index} {...item} />) // ❌ Breaks component state on reorder or delete!`,
          goodCode: `items.map((item) => <TodoItem key={item.id} {...item} />) // ✅ Stable unique ID preserves DOM identity`,
          explanation: 'When list items are reordered or removed, index-based keys confuse the reconciliation algorithm, leading to incorrect input states and unnecessary re-renders.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 01 React Foundations & Virtual DOM Test (30 Questions)',
        instructions: 'Official Mid-term Milestone: 30 proctored questions on declarative UI, Virtual DOM diffing, and key props.',
        questions: [],
      },
    },
    {
      id: 2,
      stageNumber: 'Stage 02',
      title: 'Hooks Engine, Fiber Architecture & State Lifecycles',
      tagline: 'Fiber node trees, work-in-progress, useState, useEffect, and closures',
      level: 'Elementary',
      durationHours: '25-30 hrs',
      summary: 'Explore React’s internal mechanics: the Fiber node data structure, the render phase vs commit phase, work-in-progress trees, and the rules of hooks powered by linked lists.',
      coreConcepts: [
        'Fiber architecture: linked-list node tree enabling interruptible, priority-based rendering',
        'The Render Phase (pure, no side effects) vs Commit Phase (DOM mutations)',
        'Hooks internals: state stored in a linked list on the fiber node; why hooks must not be conditional',
        'Stale closures in useEffect and callbacks: capturing old state snapshots',
      ],
      codeExamples: [
        {
          title: 'Custom Synchronized State Hook with Cleanup',
          description: 'Managing browser event listeners with proper cleanup to prevent memory leaks.',
          code: `import { useState, useEffect } from 'react';

function useWindowScrollY() {
  const [scrollY, setScrollY] = useState(() => window.scrollY);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup function runs on unmount or before next effect run
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array: runs only once on mount

  return scrollY;
}`,
          output: `Real-time scroll position updated cleanly with zero leaked listeners`,
          explanation: 'The return function inside useEffect ensures listeners are detached before unmounting, preventing memory leaks and phantom execution.',
        },
      ],
      gotchas: [
        {
          title: 'Omitting Dependencies in useEffect Dependency Array',
          badCode: `useEffect(() => {\n  console.log(score); // Uses score\n}, []); // ❌ Empty array: captures stale score snapshot forever!`,
          goodCode: `useEffect(() => {\n  console.log(score);\n}, [score]); // ✅ Re-runs whenever score changes`,
          explanation: 'JavaScript closures capture variable values at definition time. Leaving dependencies out causes stale closures that hold outdated data.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 02 React Fiber & Hooks Architecture Test (30 Questions)',
        instructions: 'Test your understanding of fiber nodes, render vs commit phases, and hooks dependency mechanics.',
        questions: [],
      },
    },
    {
      id: 3,
      stageNumber: 'Stage 03',
      title: 'Advanced State Architecture, Memoization & Compound Patterns',
      tagline: 'useReducer, referential stability (useCallback/useMemo), Context API, and compound components',
      level: 'Intermediate',
      durationHours: '30-35 hrs',
      summary: 'Architect complex frontend state: state machines with useReducer, preserving referential stability with useCallback and useMemo, avoiding Context re-render cascades, and authoring compound component APIs.',
      coreConcepts: [
        'Predictable state transitions with useReducer and action-dispatch architecture',
        'Referential equality: preventing child re-renders with React.memo, useCallback, and useMemo',
        'Context API performance: splitting state context from dispatch context to stop re-render cascades',
        'Compound components design pattern: sharing implicit state between parent and children via Context',
      ],
      codeExamples: [
        {
          title: 'Optimized Context Architecture with Split Providers',
          description: 'Splitting state and dispatch into separate contexts to eliminate wasted renders.',
          code: `import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type State = { theme: 'dark' | 'light'; counter: number };
type Action = { type: 'INCREMENT' } | { type: 'TOGGLE_THEME' };

const StateContext = createContext<State | null>(null);
const DispatchContext = createContext<React.Dispatch<Action> | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT': return { ...state, counter: state.counter + 1 };
    case 'TOGGLE_THEME': return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { theme: 'dark', counter: 0 });
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}`,
          output: `Decoupled state from dispatch context`,
          explanation: 'Components that only need dispatch can consume DispatchContext without re-rendering every time StateContext updates.',
        },
      ],
      gotchas: [
        {
          title: 'Creating New Object/Function References Inside Render',
          badCode: `<ChildComponent onAction={() => handleClick()} config={{ debug: true }} /> // ❌ New reference created on every render, defeating React.memo!`,
          goodCode: `const handleAction = useCallback(() => handleClick(), []);\nconst config = useMemo(() => ({ debug: true }), []);\n<ChildComponent onAction={handleAction} config={config} /> // ✅ Stable reference`,
          explanation: 'Inline object literals and arrow functions create new heap pointers on every render pass, triggering child re-renders even when memoized with React.memo.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 03 React State Architecture & Optimization Test (30 Questions)',
        instructions: 'Comprehensive 30-Question Assessment on useReducer, referential stability, and compound component patterns.',
        questions: [],
      },
    },
    {
      id: 4,
      stageNumber: 'Stage 04',
      title: 'Concurrent Mode, React Server Components & Performance',
      tagline: 'useTransition, useDeferredValue, Server Components (RSC), code splitting, and Profiler',
      level: 'Advanced',
      durationHours: '35-45 hrs',
      summary: 'Master cutting-edge React: Concurrent rendering, non-blocking state updates with useTransition and useDeferredValue, React Server Components (RSC) architecture, streaming SSR with Suspense, and performance profiling.',
      coreConcepts: [
        'Concurrent Rendering: interruptible renders allowing user inputs to stay responsive during heavy updates',
        'useTransition and useDeferredValue: prioritizing immediate keystrokes over background list filtering',
        'React Server Components (RSC) vs Client Components: zero-bundle-size server execution',
        'Streaming Server-Side Rendering (SSR) with Suspense boundaries and selective hydration',
        'React DevTools Profiler: identifying commit phase bottlenecks and interaction tracing',
      ],
      codeExamples: [
        {
          title: 'Non-Blocking Filter Updates with useTransition',
          description: 'Keeping user input snappy during large collection searches.',
          code: `import { useState, useTransition } from 'react';

function SearchFilter({ items }: { items: string[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [isPending, startTransition] = useTransition();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // 1. High-priority immediate update: input feels instantaneous
    setSearchTerm(val);

    // 2. Low-priority transition: background filtering doesn't lock UI
    startTransition(() => {
      const filtered = items.filter(item => item.toLowerCase().includes(val.toLowerCase()));
      setFilteredItems(filtered);
    });
  };

  return (
    <div>
      <input value={searchTerm} onChange={handleSearchChange} placeholder="Search syllabus..." />
      {isPending && <span className="text-amber-400 text-xs">Filtering...</span>}
    </div>
  );
}`,
          output: `UI input remains responsive at 60fps during heavy filtering transitions`,
          explanation: 'useTransition marks state updates as non-urgent transitions, allowing high-priority events like typing or clicking to interrupt the render pass.',
        },
      ],
      gotchas: [
        {
          title: 'Importing Server-Only Modules in Client Components',
          badCode: `'use client';\nimport db from '@/lib/database'; // ❌ Leaks database credentials into client JavaScript bundle!`,
          goodCode: `// Keep database operations in Server Components or Server Actions\nimport { fetchStudentRecords } from '@/actions/students';`,
          explanation: 'Client components are bundled and shipped to user browsers. Server code (database drivers, private keys) must strictly remain in Server Components.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 04 React Concurrent Mode & Server Architecture Test (30 Questions)',
        instructions: 'Test your mastery of Concurrent Mode, transitions, Server Components, and bundle optimization.',
        questions: [],
      },
    },
  ],

  // =========================================================================
  // 6. NODE.JS / EXPRESS (CS-304: V8 Runtime & Streaming Microservices)
  // =========================================================================
  nodejs: [
    {
      id: 1,
      stageNumber: 'Stage 01',
      title: 'V8 Runtime Internals & Libuv Event Loop',
      tagline: 'Call stack, heap allocation, Libuv event loop phases, and process architecture',
      level: 'Beginner',
      durationHours: '20-25 hrs',
      summary: 'Explore Node.js runtime mechanics: Google V8 memory heap and call stack, Libuv threadpool (uv_threadpool), the 6 event loop phases (Timers, Pending Callbacks, Idle/Prepare, Poll, Check, Close), and process.nextTick priority.',
      coreConcepts: [
        'V8 JavaScript Engine: Ignition interpreter, TurboFan optimizing compiler, and garbage collection',
        'Libuv event loop phases: Timers (setTimeout) -> Poll (I/O) -> Check (setImmediate)',
        'Microtask queue priority: process.nextTick() queue executes BEFORE Promise.then() microtasks',
        'Single-threaded event loop vs Libuv worker threadpool (default 4 threads for FS, crypto, DNS)',
      ],
      codeExamples: [
        {
          title: 'Event Loop Phase Execution Order Demonstration',
          description: 'Predicting macro vs microtask execution across Node.js runtime phases.',
          code: `console.log("1. Synchronous execution");

setTimeout(() => {
  console.log("5. Timers phase callback (setTimeout)");
}, 0);

setImmediate(() => {
  console.log("6. Check phase callback (setImmediate)");
});

Promise.resolve().then(() => {
  console.log("3. Microtask Promise queue");
});

process.nextTick(() => {
  console.log("2. process.nextTick high-priority queue");
});

console.log("4. End of synchronous main turn");`,
          output: `1. Synchronous execution\n4. End of synchronous main turn\n2. process.nextTick high-priority queue\n3. Microtask Promise queue\n5. Timers phase callback (setTimeout)\n6. Check phase callback (setImmediate)`,
          explanation: 'process.nextTick executes immediately after the current synchronous operation finishes, preceding the Promise microtask queue and all Libuv macro phases.',
        },
      ],
      gotchas: [
        {
          title: 'Starving the Event Loop with Recursive process.nextTick()',
          badCode: `function loop() {\n  process.nextTick(loop); // ❌ Starves all I/O and timers completely!\n}\nloop();`,
          goodCode: `function loop() {\n  setImmediate(loop); // ✅ Allows I/O and timers to run between iterations\n}\nloop();`,
          explanation: 'Because process.nextTick runs before any Libuv I/O phase can proceed, recursive nextTick calls permanently starve the event loop.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 01 Node.js V8 & Event Loop Architecture Test (30 Questions)',
        instructions: 'Official Mid-term Milestone: 30 questions on V8 internals, Libuv event loop phases, and threadpool mechanics.',
        questions: [],
      },
    },
    {
      id: 2,
      stageNumber: 'Stage 02',
      title: 'Binary Buffers, Streams & Backpressure Management',
      tagline: 'Buffer allocation, Readable/Writable streams, stream.pipeline, and backpressure',
      level: 'Elementary',
      durationHours: '25-30 hrs',
      summary: 'Master raw memory and streaming I/O in Node.js: Buffer allocation outside the V8 heap, Readable, Writable, Transform streams, highWaterMark thresholds, and managing backpressure with stream.pipeline.',
      coreConcepts: [
        'Buffer: fixed-size raw memory chunks allocated outside the V8 heap in C++ memory space',
        'Readable & Writable streams: chunked processing enabling gigabyte file operations in small RAM footprints',
        'Backpressure: pausing reading when the downstream consumer writes slower than highWaterMark',
        'stream.pipeline and stream/promises: clean error handling and resource disposal on stream completion',
      ],
      codeExamples: [
        {
          title: 'Backpressure-Safe File Streaming with pipeline',
          description: 'Streaming transformed data without memory leaks or buffer bloat.',
          code: `import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

async function compressLogFile(sourcePath: string, destPath: string) {
  try {
    // pipeline handles pause/resume backpressure and automatically cleans up descriptors
    await pipeline(
      createReadStream(sourcePath, { highWaterMark: 64 * 1024 }), // 64KB chunks
      createGzip(),
      createWriteStream(destPath)
    );
    console.log("Streaming compression completed safely!");
  } catch (err) {
    console.error("Stream pipeline failed:", err);
  }
}`,
          output: `Streaming compression completed safely!`,
          explanation: 'stream.pipeline automatically handles backpressure events (.pause() / .resume()) and guarantees stream destruction even if errors occur midway.',
        },
      ],
      gotchas: [
        {
          title: 'Using pipe() instead of pipeline() without Error Handlers',
          badCode: `readable.pipe(writable); // ❌ Does NOT destroy streams or close file descriptors on error!`,
          goodCode: `await pipeline(readable, writable); // ✅ Handles errors, backpressure, and resource cleanup automatically`,
          explanation: 'Standard .pipe() does not forward errors between source and destination streams, leading to memory leaks and hung file descriptors on network drops.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 02 Node.js Buffers, Streams & Backpressure Test (30 Questions)',
        instructions: 'Test your understanding of Buffer memory allocation, stream states, and backpressure handling.',
        questions: [],
      },
    },
    {
      id: 3,
      stageNumber: 'Stage 03',
      title: 'REST Architecture, Express Middleware & Token Security',
      tagline: 'Middleware chaining, error-handling middleware, JWT verification, and Redis caching',
      level: 'Intermediate',
      durationHours: '30-35 hrs',
      summary: 'Architect robust backend web services with Express: onion middleware pipelines, centralized error handling, stateless JWT authentication, rate limiting, and Redis database connection pooling.',
      coreConcepts: [
        'Express middleware execution order: next() and next(err) error-handling signatures (4 parameters)',
        'Stateless authentication with JSON Web Tokens (JWT): signing, verification, and rotation',
        'Database connection pooling with PostgreSQL (pg.Pool): avoiding TCP connection exhaustion',
        'Security headers (Helmet), CORS configuration, and rate limiting with Redis sliding window',
      ],
      codeExamples: [
        {
          title: 'Production Express Middleware Pipeline with Typed Errors',
          description: 'Centralized error handling middleware preventing uncaught server crashes.',
          code: `import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

// Custom Domain Error
class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

// Route with validation
app.get('/api/v1/students/:id', (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id.startsWith('KT-')) {
    return next(new AppError(400, "Invalid Student Matriculation ID format"));
  }
  res.json({ id, status: "Active Undergrad" });
});

// Centralized 4-parameter error middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const status = err instanceof AppError ? err.statusCode : 500;
  res.status(status).json({
    status: "error",
    message: err.message || "Internal Server Failure"
  });
});`,
          output: `Express router with 4-parameter centralized error middleware`,
          explanation: 'In Express, error handling middleware must explicitly declare exactly 4 arguments (err, req, res, next) for the framework to route exceptions to it.',
        },
      ],
      gotchas: [
        {
          title: 'Unhandled Promise Rejections in Express Async Handlers',
          badCode: `app.get('/data', async (req, res) => {\n  const data = await fetchData(); // ❌ If throws, causes unhandled rejection in Express 4!\n  res.json(data);\n});`,
          goodCode: `app.get('/data', async (req, res, next) => {\n  try {\n    const data = await fetchData();\n    res.json(data);\n  } catch (err) {\n    next(err); // ✅ Forwards error to centralized error middleware\n  }\n});`,
          explanation: 'In Express 4, asynchronous errors in route handlers are not caught by default and trigger unhandled promise rejection warnings. Express 5 supports native promise forwarding.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 03 Express Architecture, Security & Caching Test (30 Questions)',
        instructions: 'Comprehensive 30-Question Assessment on middleware pipelines, JWT auth, and connection pooling.',
        questions: [],
      },
    },
    {
      id: 4,
      stageNumber: 'Stage 04',
      title: 'Multi-Core Clustering, Worker Threads & Profiling',
      tagline: 'Cluster module, Worker Threads, heap snapshots, PM2, and Docker production',
      level: 'Advanced',
      durationHours: '35-45 hrs',
      summary: 'Scale Node.js across multi-core servers: the cluster module for multi-process load balancing, Worker Threads for CPU-bound cryptography or image manipulation, heapdump memory profiling, and Docker deployment.',
      coreConcepts: [
        'Node.js Cluster module: master-worker IPC and round-robin socket handoffs via SO_REUSEPORT',
        'Worker Threads (worker_threads): true shared memory with SharedArrayBuffer and Atomics',
        'Diagnosing memory leaks: inspecting V8 heap snapshots, identifying detached DOM or uncollected closures',
        'Zero-downtime rolling reload deployments with process managers (PM2) and Docker healthchecks',
      ],
      codeExamples: [
        {
          title: 'Multi-Core Server Scaling with Node.js Cluster',
          description: 'Spawning worker processes for each CPU core with auto-recovery on crash.',
          code: `import cluster from 'node:cluster';
import http from 'node:http';
import os from 'node:os';

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(\`Primary process \${process.pid} is spawning \${numCPUs} worker processes...\`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.warn(\`Worker \${worker.process.pid} died. Spawning replacement worker...\`);
    cluster.fork();
  });
} else {
  // Workers share the same underlying TCP connection port
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(\`Handled by worker PID \${process.pid}\\n\`);
  }).listen(3000);
}`,
          output: `Primary process spawned workers across all CPU cores with auto-restart on exit`,
          explanation: 'The primary process opens the TCP server port and routes incoming connections across child worker processes via round-robin IPC.',
        },
      ],
      gotchas: [
        {
          title: 'Using Cluster Instead of Worker Threads for CPU-Intensive Tasks',
          badCode: `// Spawning a whole OS process for a short 50ms mathematical computation (High overhead!)`,
          goodCode: `// Use worker_threads (Worker) which shares process memory with low instantiation cost`,
          explanation: 'Cluster forks full OS processes with separate memory spaces (50MB+ overhead per process). For short CPU calculations, worker_threads are far faster and lighter.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 04 Node.js Production Scaling & Clustering Test (30 Questions)',
        instructions: 'Test your mastery of multi-core clustering, Worker Threads, heap profiling, and production containerization.',
        questions: [],
      },
    },
  ],

  // =========================================================================
  // 7. JAVA / SPRING BOOT (CS-310: Enterprise Systems & JVM Internals)
  // =========================================================================
  java: [
    {
      id: 1,
      stageNumber: 'Stage 01',
      title: 'JVM Memory Architecture & Object Model',
      tagline: 'Stack, Heap (Eden, Survivor, Tenured), Metaspace, and OOP encapsulation',
      level: 'Beginner',
      durationHours: '20-25 hrs',
      summary: 'Master the Java Virtual Machine architecture: Classloader subsystems, execution engine, JVM memory areas (Thread Stack, Eden Space, Survivor Spaces, Tenured/Old Gen, Metaspace), and strongly typed OOP principles.',
      coreConcepts: [
        'JVM Memory Breakdown: Stack (frames, primitives, references) vs Heap (all object allocations)',
        'Generational Garbage Collection hypothesis: Eden -> Survivor S0/S1 -> Tenured Generation',
        'Strong OOP Encapsulation: access modifiers, immutable records, and abstract classes vs interfaces',
        'Generics and Type Erasure: why List<String> and List<Integer> share the same class at runtime',
      ],
      codeExamples: [
        {
          title: 'Modern Java Record with Compact Constructor Validation',
          description: 'Immutable data carriers introduced in modern Java with strict invariant checks.',
          code: `package edu.kieltech.academy;

public record StudentMatriculation(String studentId, String fullName, double gpa) {
    // Compact constructor enforces domain invariants
    public StudentMatriculation {
        if (studentId == null || !studentId.startsWith("KT-")) {
            throw new IllegalArgumentException("Student ID must start with 'KT-'");
        }
        if (gpa < 0.0 || gpa > 4.0) {
            throw new IllegalArgumentException("GPA must be between 0.0 and 4.0");
        }
    }
}

// Usage in main:
// StudentMatriculation s = new StudentMatriculation("KT-2026", "Eleanor Vance", 3.92);
// System.out.println("Enrolled: " + s.fullName() + " | GPA: " + s.gpa());`,
          output: `Enrolled: Eleanor Vance | GPA: 3.92`,
          explanation: 'Java records generate canonical constructors, accessors, equals(), and hashCode() automatically with full immutability.',
        },
      ],
      gotchas: [
        {
          title: 'Comparing String Objects with == instead of .equals()',
          badCode: `String a = new String("KT");\nString b = new String("KT");\nif (a == b) { // ❌ Compares heap reference addresses (evaluates to false!)\n    System.out.println("Equal");\n}`,
          goodCode: `if (a.equals(b)) { // ✅ Compares sequence of characters\n    System.out.println("Equal content!");\n}`,
          explanation: 'In Java, `==` compares reference addresses. Content equality must always use `.equals()`, except when referencing interned constants or primitives.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 01 JVM Architecture & Java OOP Foundations Test (30 Questions)',
        instructions: 'Official Mid-term Milestone: 30 questions on JVM memory model, garbage collection generations, and records.',
        questions: [],
      },
    },
    {
      id: 2,
      stageNumber: 'Stage 02',
      title: 'Collections Framework Internals & Streams API',
      tagline: 'ArrayList resizing, HashMap treeification, Streams, and lambdas',
      level: 'Elementary',
      durationHours: '25-30 hrs',
      summary: 'Explore the Java Collections Framework: ArrayList array copy resizing math (1.5x growth), HashMap bucket hashing and treeification into red-black trees at threshold 8, and declarative Streams API pipelines.',
      coreConcepts: [
        'ArrayList: contiguous array backing and amortized O(1) appending with 1.5x array growth formula',
        'HashMap: hash codes, index calculation (hash & (n-1)), bucket linked lists, and treeification to TreeNode',
        'equals() and hashCode() contract: if a.equals(b), then a.hashCode() MUST equal b.hashCode()',
        'Java Streams API: intermediate operations (filter, map, sorted) vs terminal operations (collect, reduce)',
      ],
      codeExamples: [
        {
          title: 'Declarative Stream Processing with Grouping Collectors',
          description: 'Aggregating academic data using functional stream collectors.',
          code: `import java.util.*;
import java.util.stream.Collectors;

public class StreamAnalytics {
    record CourseResult(String department, String courseCode, int score) {}

    public static void main(String[] args) {
        List<CourseResult> results = List.of(
            new CourseResult("Systems", "CS-301", 94),
            new CourseResult("Systems", "CS-401", 88),
            new CourseResult("Web", "CS-330", 92)
        );

        // Group by department and calculate average score
        Map<String, Double> deptAverages = results.stream()
            .collect(Collectors.groupingBy(
                CourseResult::department,
                Collectors.averagingInt(CourseResult::score)
            ));

        deptAverages.forEach((dept, avg) -> 
            System.out.printf("Department: %s -> Average Score: %.1f%n", dept, avg)
        );
    }
}`,
          output: `Department: Systems -> Average Score: 91.0\nDepartment: Web -> Average Score: 92.0`,
          explanation: 'Java Streams execute intermediate operations lazily, compiling the pipeline into a single pass terminal iteration.',
        },
      ],
      gotchas: [
        {
          title: 'Overriding equals() without Overriding hashCode()',
          badCode: `class Student { String id; @Override public boolean equals(Object o) { ... } // ❌ Forgot hashCode! }`,
          goodCode: `// ✅ Always override BOTH equals() and hashCode() together using Objects.hash(id)`,
          explanation: 'Breaking the contract causes HashMaps and HashSets to fail lookups, storing duplicate objects in separate buckets.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 02 Java Collections & Streams Internals Test (30 Questions)',
        instructions: 'Test your understanding of HashMap collision resolution, treeification, and Streams collectors.',
        questions: [],
      },
    },
    {
      id: 3,
      stageNumber: 'Stage 03',
      title: 'Virtual Threads (Project Loom) & Concurrency Primitives',
      tagline: 'Virtual Threads (Java 21), synchronized, Volatile, and ConcurrentHashMap',
      level: 'Intermediate',
      durationHours: '30-35 hrs',
      summary: 'Master Java concurrency: classical platform OS threads vs Virtual Threads (Project Loom) in Java 21, the Java Memory Model (JMM) happens-before relationship, volatile memory barriers, and thread-safe collections.',
      coreConcepts: [
        'Virtual Threads (Project Loom): lightweight user-mode threads mounted on carrier OS threads',
        'Java Memory Model (JMM): happens-before guarantees, instruction reordering, and volatile semantics',
        'Synchronization primitives: synchronized locks, ReentrantLock, and atomic variables (AtomicInteger)',
        'ConcurrentHashMap: lock striping with synchronized node heads for thread-safe concurrent writes',
      ],
      codeExamples: [
        {
          title: 'Spawning 10,000 Concurrent Virtual Threads in Java 21',
          description: 'Handling thousands of concurrent tasks without thread exhaustion.',
          code: `import java.time.Duration;
import java.util.concurrent.Executors;

public class VirtualThreadLab {
    public static void main(String[] args) {
        // High-density Virtual Thread per Task Executor
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 1; i <= 5; i++) {
                final int taskId = i;
                executor.submit(() -> {
                    System.out.printf("Virtual Task %d started on thread: %s%n", 
                        taskId, Thread.currentThread());
                    Thread.sleep(Duration.ofMillis(50));
                    return taskId;
                });
            }
        } // Executor auto-closes, awaiting all tasks
        System.out.println("All virtual tasks completed successfully!");
    }
}`,
          output: `Virtual Task 1 started on thread: VirtualThread[#21]/runnable@ForkJoinPool-1-worker-1\nAll virtual tasks completed successfully!`,
          explanation: 'Virtual threads unmount from their carrier OS thread when performing blocking I/O (like Thread.sleep or socket reads), allowing a few carrier threads to support millions of tasks.',
        },
      ],
      gotchas: [
        {
          title: 'Pinning Virtual Threads with Synchronized Blocks',
          badCode: `synchronized(this) {\n    Thread.sleep(1000); // ❌ Pins the virtual thread to its OS carrier thread, blocking others!\n}`,
          goodCode: `ReentrantLock lock = new ReentrantLock();\nlock.lock();\ntry { Thread.sleep(1000); } finally { lock.unlock(); } // ✅ Allows virtual thread to unmount cleanly`,
          explanation: 'In Java 21, blocking inside a `synchronized` block pins the virtual thread to its underlying carrier OS thread. Using ReentrantLock avoids thread pinning.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 03 Java Concurrency & Virtual Threads Test (30 Questions)',
        instructions: 'Comprehensive 30-Question Assessment on Virtual Threads, Java Memory Model, and atomic variables.',
        questions: [],
      },
    },
    {
      id: 4,
      stageNumber: 'Stage 04',
      title: 'Spring Boot Architecture, IoC Container & JPA Caches',
      tagline: 'Inversion of Control, Dependency Injection, Hibernate L1/L2 cache, and @Transactional',
      level: 'Advanced',
      durationHours: '35-45 hrs',
      summary: 'Engineer enterprise microservices with Spring Boot: ApplicationContext lifecycle, Dependency Injection, Spring Data JPA, Hibernate persistence context (First-level vs Second-level cache), and transactional rollbacks with @Transactional.',
      coreConcepts: [
        'Spring IoC Container: Bean lifecycles, scopes (Singleton, Prototype, Request), and @Autowired DI',
        'Spring AOP (Aspect-Oriented Programming): dynamic proxies powering @Transactional and security checks',
        'Hibernate JPA: entity states (Transient, Persistent, Detached), L1 session cache vs L2 shared cache',
        'Transactional boundaries: propagation levels (REQUIRED, REQUIRES_NEW) and rollbackFor specifications',
      ],
      codeExamples: [
        {
          title: 'Spring Boot REST Controller with Service Layer & Transactional Boundary',
          description: 'Production Spring architecture with constructor dependency injection.',
          code: `package edu.kieltech.academy.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

@RestController
@RequestMapping("/api/v1/enrollment")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    // Constructor injection is preferred over field injection
    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/{studentId}")
    public String enrollStudent(@PathVariable String studentId) {
        enrollmentService.processMatriculation(studentId);
        return "Student successfully enrolled in academic records.";
    }
}

@Service
class EnrollmentService {
    @Transactional(rollbackFor = Exception.class)
    public void processMatriculation(String studentId) {
        // Atomic transaction: rolled back automatically on uncaught exception
        System.out.println("Processing matriculation for: " + studentId);
    }
}`,
          output: `Spring Boot Controller instantiated with constructor injection and @Transactional boundary`,
          explanation: '@Transactional wraps method execution in an AOP proxy that manages transaction begin, commit, and automatic rollback on runtime exceptions.',
        },
      ],
      gotchas: [
        {
          title: 'Invoking @Transactional Methods from Within the Same Class',
          badCode: `public void outerMethod() {\n    this.innerTransactionalMethod(); // ❌ Bypasses Spring AOP proxy; transaction is NEVER opened!\n}`,
          goodCode: `// Move the transactional method to a separate injected service bean so it passes through the proxy`,
          explanation: 'Spring `@Transactional` uses dynamic proxies. Calling a method directly on `this` bypasses the proxy, completely disabling transaction management.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 04 Spring Boot Architecture & JPA Persistence Test (30 Questions)',
        instructions: 'Test your mastery of Spring Boot IoC containers, Hibernate L1/L2 caching, and transactional boundaries.',
        questions: [],
      },
    },
  ],

  // =========================================================================
  // 8. MODERN JAVASCRIPT (CS-210: Web Science & Execution Contexts)
  // =========================================================================
  javascript: [
    {
      id: 1,
      stageNumber: 'Stage 01',
      title: 'Execution Contexts, Call Stack & Lexical Scopes',
      tagline: 'Variable environment, hoisting, temporal dead zone, and primitive vs reference types',
      level: 'Beginner',
      durationHours: '15-20 hrs',
      summary: 'Understand how the JavaScript engine executes code: the Call Stack, Global and Function Execution Contexts, the Variable Environment, hoisting (var vs let/const Temporal Dead Zone), and primitive values vs object heap references.',
      coreConcepts: [
        'Execution Context creation: Creation Phase (memory allocation/hoisting) vs Execution Phase',
        'Variable Hoisting: var initialized with undefined; let/const hoisted into the Temporal Dead Zone (TDZ)',
        'Primitive types (Stack) vs Reference types (Heap pointers): shallow vs deep cloning',
        'Scope chain: resolution of identifiers through parent Lexical Environments',
      ],
      codeExamples: [
        {
          title: 'Execution Context & Temporal Dead Zone Inspection',
          description: 'Demonstrating how hoisting behaves between var, let, and const.',
          code: `console.log("Hoisted var value:", hoistedVar); // undefined
var hoistedVar = "KielTech Academy";

try {
  // Accessing let before declaration throws ReferenceError due to Temporal Dead Zone (TDZ)
  console.log(tdzVariable);
  let tdzVariable = "Initialized";
} catch (err) {
  console.log("Caught TDZ error:", err.message);
}

// Deep cloning objects with structuredClone
const original = { student: "Alex", scores: [90, 95] };
const deepCopy = structuredClone(original);
deepCopy.scores.push(100);

console.log("Original scores unchanged:", original.scores);
console.log("Deep copy scores:", deepCopy.scores);`,
          output: `Hoisted var value: undefined\nCaught TDZ error: Cannot access 'tdzVariable' before initialization\nOriginal scores unchanged: [90, 95]\nDeep copy scores: [90, 95, 100]`,
          explanation: 'structuredClone creates true deep copies of objects and arrays without the limitations of JSON.parse(JSON.stringify()).',
        },
      ],
      gotchas: [
        {
          title: 'Accidental Global Variable Creation in Non-Strict Mode',
          badCode: `function setScore() {\n  score = 100; // ❌ Implicitly creates global variable window.score!\n}`,
          goodCode: `'use strict';\nfunction setScore() {\n  const score = 100; // ✅ Scoped to function\n}`,
          explanation: 'Without strict mode, assigning to an undeclared variable creates a property on the global object, leading to severe state pollution.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 01 JavaScript Execution Contexts & Memory Test (30 Questions)',
        instructions: 'Official Mid-term Milestone: 30 questions on execution contexts, hoisting, scope chains, and cloning.',
        questions: [],
      },
    },
    {
      id: 2,
      stageNumber: 'Stage 02',
      title: 'Prototypal Inheritance, Closures & This Binding',
      tagline: 'Prototype chains (__proto__ vs prototype), closures, and arrow vs regular functions',
      level: 'Elementary',
      durationHours: '20-25 hrs',
      summary: 'Master JavaScript’s prototypal inheritance model: the prototype chain terminating at Object.prototype, closures retaining parent lexical environments in memory, and how this is bound dynamically vs lexically.',
      coreConcepts: [
        'Prototypal chain: lookup traverses obj.__proto__ until reaching Object.prototype.__proto__ (null)',
        'Constructor functions vs class syntax: class is syntactic sugar over prototype delegation',
        'Closures: functions bundled with references to their surrounding lexical state',
        'this binding rules: default (window/undefined), implicit (obj.method), explicit (call/apply/bind), and lexical (arrow functions)',
      ],
      codeExamples: [
        {
          title: 'Encapsulation with Closures & Factory Functions',
          description: 'Creating private state using JavaScript lexical scoping.',
          code: `function createAcademicWallet(initialCredits: number) {
  let credits = initialCredits; // Private variable trapped inside closure

  return {
    earnCredits(amount: number) {
      credits += amount;
      return credits;
    },
    getBalance() {
      return credits;
    }
  };
}

const wallet = createAcademicWallet(12);
wallet.earnCredits(4);
console.log("Current Credits Balance:", wallet.getBalance());
// credits variable cannot be accessed or modified directly from outside`,
          output: `Current Credits Balance: 16`,
          explanation: 'The returned object methods retain references to the credits variable in their closure scope, providing true private encapsulation.',
        },
      ],
      gotchas: [
        {
          title: 'Losing "this" Context in Callback Functions',
          badCode: `const student = {\n  name: "Marcus",\n  greet() {\n    setTimeout(function() {\n      console.log(this.name); // ❌ 'this' points to window/undefined!\n    }, 100);\n  }\n};`,
          goodCode: `const student = {\n  name: "Marcus",\n  greet() {\n    setTimeout(() => {\n      console.log(this.name); // ✅ Arrow function inherits lexical 'this' from greet()\n    }, 100);\n  }\n};`,
          explanation: 'Regular functions determine `this` at call time. Arrow functions do not bind their own `this`, inheriting it lexically from the enclosing scope.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 02 JavaScript Prototypes, Closures & This Test (30 Questions)',
        instructions: 'Test your understanding of prototype chains, closures, and dynamic vs lexical this binding.',
        questions: [],
      },
    },
    {
      id: 3,
      stageNumber: 'Stage 03',
      title: 'Asynchronous Event Loop, Microtasks & Promises',
      tagline: 'Call stack, Web APIs, Microtask Queue (Promises) vs Macrotask Queue (setTimeout)',
      level: 'Intermediate',
      durationHours: '25-30 hrs',
      summary: 'Deep dive into asynchronous JavaScript: how the browser event loop coordinates the Call Stack, Web APIs, the Microtask Queue (Promise.then, MutationObserver), and the Macrotask Queue (setTimeout, setInterval).',
      coreConcepts: [
        'Browser Event Loop mechanics: continuously checking if the Call Stack is empty',
        'Microtask Queue priority: ALL pending microtasks must drain before the next macrotask can execute',
        'Promise states: pending, fulfilled, rejected with settled invariants',
        'Async / Await transpilation: async functions return Promises and await yields control via microtasks',
      ],
      codeExamples: [
        {
          title: 'Microtask vs Macrotask Queue Coordination',
          description: 'Tracing asynchronous execution priority in modern browser engines.',
          code: `console.log("Start");

setTimeout(() => {
  console.log("Macrotask: setTimeout");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("Microtask 1: Promise.then");
    return "chained";
  })
  .then((val) => {
    console.log("Microtask 2: Chained Promise");
  });

queueMicrotask(() => {
  console.log("Microtask 3: Explicit queueMicrotask");
});

console.log("End");`,
          output: `Start\nEnd\nMicrotask 1: Promise.then\nMicrotask 3: Explicit queueMicrotask\nMicrotask 2: Chained Promise\nMacrotask: setTimeout`,
          explanation: 'The event loop empties the entire microtask queue before picking the next task from the macrotask queue.',
        },
      ],
      gotchas: [
        {
          title: 'Uncaught Promise Rejections with async/await',
          badCode: `async function loadData() {\n  const res = await fetch("https://invalid.url"); // ❌ Unhandled rejection crashes process!\n}`,
          goodCode: `async function loadData() {\n  try {\n    const res = await fetch("https://invalid.url");\n  } catch (err) {\n    console.error("Caught network error:", err.message); // ✅ Handled\n  }\n}`,
          explanation: 'Awaiting a rejecting promise throws an exception. Without try/catch, it triggers an unhandled promise rejection.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 03 JavaScript Event Loop & Microtasks Test (30 Questions)',
        instructions: 'Comprehensive 30-Question Assessment on Promise chains, microtasks vs macrotasks, and async/await mechanics.',
        questions: [],
      },
    },
    {
      id: 4,
      stageNumber: 'Stage 04',
      title: 'DOM Tree Architecture, Event Bubbling & Performance',
      tagline: 'DOM vs CSSOM, render tree, event bubbling/capturing, and Web Vitals (LCP, CLS)',
      level: 'Advanced',
      durationHours: '30-40 hrs',
      summary: 'Engineer ultra-performant client-side web applications: the browser rendering pipeline (DOM + CSSOM -> Render Tree -> Layout -> Paint -> Composite), event dispatch (capture, target, bubbling), and Core Web Vitals optimization.',
      coreConcepts: [
        'Browser critical rendering path: reflow (layout) vs repaint (paint) triggers and GPU compositing',
        'Event Propagation: capturing phase (downward) -> target phase -> bubbling phase (upward)',
        'Event delegation: attaching single listeners to parent containers using e.target',
        'Core Web Vitals: Largest Contentful Paint (LCP), Interaction to Next Paint (INP), Cumulative Layout Shift (CLS)',
      ],
      codeExamples: [
        {
          title: 'High-Performance Event Delegation Pattern',
          description: 'Handling events across hundreds of dynamic list items with a single listener.',
          code: `// Attach one listener to the parent container instead of hundreds of child nodes
const stageList = document.querySelector('#syllabus-stages');

stageList?.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest('button[data-stage-id]');
  
  if (button) {
    const stageId = button.getAttribute('data-stage-id');
    console.log("Navigating to stage:", stageId);
  }
});`,
          output: `Single memory-efficient event listener manages dynamic DOM list items`,
          explanation: 'Event delegation leverages event bubbling to handle clicks on child elements with a single listener, drastically reducing memory usage.',
        },
      ],
      gotchas: [
        {
          title: 'Triggering Forced Synchronous Layouts (Layout Thrashing)',
          badCode: `for (let el of elements) {\n  const width = el.offsetWidth; // ❌ Forces immediate browser layout calculation\n  el.style.width = (width + 10) + 'px'; // ❌ Invalidates layout, repeat in loop!\n}`,
          goodCode: `// Read all layout properties first, then batch write styles together\nconst widths = elements.map(el => el.offsetWidth);\nelements.forEach((el, i) => el.style.width = (widths[i] + 10) + 'px');`,
          explanation: 'Alternating between reading layout properties and writing DOM styles forces the browser to recalculate layout synchronously on every loop iteration.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 04 JavaScript DOM, Events & Web Performance Test (30 Questions)',
        instructions: 'Test your mastery of browser rendering engines, event bubbling, delegation, and Core Web Vitals.',
        questions: [],
      },
    },
  ],

  // =========================================================================
  // 9. VUE.JS 3 (CS-332: Reactive Systems & State Stores)
  // =========================================================================
  vue: [
    {
      id: 1,
      stageNumber: 'Stage 01',
      title: 'Vue 3 Architecture & Proxy Reactivity Engine',
      tagline: 'JavaScript Proxies, ref vs reactive, Single-File Components, and template directives',
      level: 'Beginner',
      durationHours: '15-20 hrs',
      summary: 'Explore Vue 3 reactivity internals: JavaScript Proxy traps (get, set), tracking dependencies (track) and triggering updates (trigger), ref vs reactive semantics, and Single-File Component (SFC) compilation.',
      coreConcepts: [
        'Vue 3 reactivity system: ES6 Proxy wrappers intercepting property reads and mutations',
        'Dependency collection: track() records active effects; trigger() schedules re-renders',
        'ref (handles primitives via .value object wrapper) vs reactive (proxies plain objects directly)',
        'Template directives: v-bind, v-on, v-if vs v-show, and v-model bidirectional binding',
      ],
      codeExamples: [
        {
          title: 'Vue 3 Composition API Component with Reactive State',
          description: 'A modern <script setup> Single-File Component declaration.',
          code: `<script setup lang="ts">
import { ref, computed } from 'vue';

const stageNumber = ref(1);
const passingThreshold = 70;
const studentScore = ref(88);

// Computed property caches result until studentScore changes
const isPassed = computed(() => studentScore.value >= passingThreshold);

function retakeExam() {
  studentScore.value = 95;
}
</script>

<template>
  <div class="stage-card">
    <h3>Stage {{ stageNumber }} Evaluation</h3>
    <p>Score: {{ studentScore }}% - Status: {{ isPassed ? 'PASSED' : 'RETAKE' }}</p>
    <button @click="retakeExam">Upgrade Score</button>
  </div>
</template>`,
          output: `Vue 3 component with Proxy-tracked state and cached computed getter`,
          explanation: 'Vue tracks dependencies when getters are called in computed properties, re-evaluating only when studentScore changes.',
        },
      ],
      gotchas: [
        {
          title: 'Destructuring a Reactive Object Losing Reactivity',
          badCode: `const state = reactive({ count: 0 });\nconst { count } = state; // ❌ count is now a plain number, disconnecting proxy reactivity!`,
          goodCode: `import { toRefs } from 'vue';\nconst state = reactive({ count: 0 });\nconst { count } = toRefs(state); // ✅ count is now a Ref<number> that preserves reactivity`,
          explanation: 'Destructuring an object extracts raw values, removing the Proxy wrapper. toRefs converts properties into individual refs that stay in sync.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 01 Vue 3 Reactivity Foundations Test (30 Questions)',
        instructions: 'Official Mid-term Milestone: 30 questions on Proxy reactivity, ref vs reactive, and template compilation.',
        questions: [],
      },
    },
    {
      id: 2,
      stageNumber: 'Stage 02',
      title: 'Composition API Deep Dive & Lifecycle Hooks',
      tagline: 'computed, watch, watchEffect, onMounted, and component props/emits',
      level: 'Elementary',
      durationHours: '20-25 hrs',
      summary: 'Build scalable components with the Composition API: computed caching, watch vs watchEffect, component lifecycle timing (onMounted, onUnmounted), and typed defineProps and defineEmits.',
      coreConcepts: [
        'computed: lazy, cached getters that only execute when reactive dependencies mutate',
        'watch (explicit source, provides previous and new values) vs watchEffect (automatic tracking)',
        'Lifecycle hooks: onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onUnmounted',
        'Component communication: typed defineProps and defineEmits for parent-child contract',
      ],
      codeExamples: [
        {
          title: 'Custom Watcher with Debounced Cleanup',
          description: 'Watching input state with watch and onCleanup to cancel obsolete queries.',
          code: `import { ref, watch } from 'vue';

const searchQuery = ref('');
const searchResults = ref<string[]>([]);

watch(searchQuery, (newQuery, oldQuery, onCleanup) => {
  let isCancelled = false;
  onCleanup(() => { isCancelled = true; }); // Cancel pending request on new keystroke

  const timer = setTimeout(async () => {
    if (!isCancelled) {
      console.log("Searching syllabus for:", newQuery);
    }
  }, 300);

  onCleanup(() => clearTimeout(timer));
});`,
          output: `Debounced search query executed with onCleanup cancellation`,
          explanation: 'onCleanup passes a callback executed right before the watcher re-runs, making it ideal for clearing timeouts and aborting fetch requests.',
        },
      ],
      gotchas: [
        {
          title: 'Modifying Props Directly Inside a Child Component',
          badCode: `const props = defineProps<{ score: number }>();\nprops.score = 100; // ❌ Mutates prop directly, violates unidirectional data flow!`,
          goodCode: `const emit = defineEmits<{(e: 'update:score', val: number): void}>();\nemit('update:score', 100); // ✅ Emits event to parent container`,
          explanation: 'Props in Vue are strictly read-only to preserve predictable one-way data flow.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 02 Vue 3 Composition API & Watchers Test (30 Questions)',
        instructions: 'Test your understanding of computed getters, watchEffect cleanup, and defineProps/defineEmits.',
        questions: [],
      },
    },
    {
      id: 3,
      stageNumber: 'Stage 03',
      title: 'Modular Composables & Pinia Global State Architecture',
      tagline: 'Custom composables, provide/inject, Pinia stores (state, getters, actions)',
      level: 'Intermediate',
      durationHours: '25-30 hrs',
      summary: 'Master global state and code reuse in Vue 3: authoring reusable Composables (Vue’s custom hooks), dependency injection with provide/inject, and centralized state management using Pinia.',
      coreConcepts: [
        'Composables pattern: packaging stateful logic into reusable functions named useX()',
        'provide and inject: passing dependencies down component trees without prop drilling',
        'Pinia store architecture: defineStore with reactive state, getters, and synchronous/asynchronous actions',
        'Store subscriptions ($subscribe, $onAction) and hot module reloading state preservation',
      ],
      codeExamples: [
        {
          title: 'Typed Pinia Store for Student Academic Enrollment',
          description: 'Centralized state store managing student stages and grades.',
          code: `import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useStudentStore = defineStore('student', () => {
  const completedStages = ref<number[]>([1]);
  const activeCourse = ref('Python Systems Engineering');

  const progressPercentage = computed(() => {
    return Math.round((completedStages.value.length / 4) * 100);
  });

  function completeStage(stageId: number) {
    if (!completedStages.value.includes(stageId)) {
      completedStages.value.push(stageId);
    }
  }

  return { completedStages, activeCourse, progressPercentage, completeStage };
});`,
          output: `Pinia store initialized with setup syntax and computed progress`,
          explanation: 'Pinia setup syntax mirrors Vue Composition API, allowing ref() for state, computed() for getters, and functions for actions.',
        },
      ],
      gotchas: [
        {
          title: 'Destructuring Pinia State Without storeToRefs()',
          badCode: `const store = useStudentStore();\nconst { activeCourse } = store; // ❌ Breaks reactivity on destructure!`,
          goodCode: `import { storeToRefs } from 'pinia';\nconst store = useStudentStore();\nconst { activeCourse } = storeToRefs(store); // ✅ Preserves ref reactivity`,
          explanation: 'Destructuring a Pinia store extracts plain properties. storeToRefs wraps each state property and getter in a reactive ref.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 03 Vue 3 Composables & Pinia Architecture Test (30 Questions)',
        instructions: 'Comprehensive 30-Question Assessment on custom composables, provide/inject, and Pinia stores.',
        questions: [],
      },
    },
    {
      id: 4,
      stageNumber: 'Stage 04',
      title: 'Vue Router 4, Compiler Flags & SSR Optimization',
      tagline: 'Navigation guards, Teleport, Suspense, PatchFlags, and Vite bundle splitting',
      level: 'Advanced',
      durationHours: '30-40 hrs',
      summary: 'Transform Vue applications into enterprise systems: Vue Router 4 navigation guards, Teleport for portals, async components with Suspense, understanding Vue template compiler optimizations (PatchFlags, block tree), and Vite code splitting.',
      coreConcepts: [
        'Vue Router 4 Navigation Guards: beforeEach, beforeResolve, and route meta authorization',
        'Vue 3 Compiler Optimizations: PatchFlags (dynamic text, dynamic props), hoistStatic, and block tree',
        'Teleport component: rendering modal overlays at document.body level while maintaining state',
        'Async components & Suspense: managing loading states for remote chunks and bundle optimization',
      ],
      codeExamples: [
        {
          title: 'Authentication Navigation Guard with Vue Router',
          description: 'Restricting access to degree defenses based on authentication state.',
          code: `import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./views/HomeView.vue') },
    { 
      path: '/degree-defense', 
      component: () => import('./views/DefenseView.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = Boolean(localStorage.getItem('kieltech_auth_token'));
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: '/', query: { redirect: to.fullPath } });
  } else {
    next(); // Proceed to route
  }
});`,
          output: `Vue Router configured with authentication guard and lazy-loaded routes`,
          explanation: 'Navigation guards intercept route transitions asynchronously, verifying authorization tokens before mounting protected components.',
        },
      ],
      gotchas: [
        {
          title: 'Forgetting to Call next() in Navigation Guards',
          badCode: `router.beforeEach((to, from, next) => {\n  if (to.path === '/login') return; // ❌ Route hangs forever without calling next()!\n  next();\n});`,
          goodCode: `router.beforeEach((to, from, next) => {\n  if (to.path === '/login') return next(); // ✅ Always invoke next() exactly once\n  next();\n});`,
          explanation: 'In Vue Router 4, if a navigation guard does not call next() or return a route target, the navigation hangs indefinitely.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 04 Vue Router, Compiler Flags & Enterprise Architecture Test (30 Questions)',
        instructions: 'Test your mastery of navigation guards, compiler PatchFlags, Teleport, and production performance.',
        questions: [],
      },
    },
  ],

  // =========================================================================
  // 10. HTML5 & CSS3 (CS-202: Semantic Web & Design Systems)
  // =========================================================================
  'html-css': [
    {
      id: 1,
      stageNumber: 'Stage 01',
      title: 'Semantic HTML5 Architecture & Document Tree',
      tagline: 'Semantic elements (<article>, <section>, <nav>, <main>), accessible headings, and DOM parsing',
      level: 'Beginner',
      durationHours: '15-20 hrs',
      summary: 'Master semantic web engineering: constructing semantic document outline trees using <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>, proper heading levels, and how browsers construct the DOM.',
      coreConcepts: [
        'Semantic HTML vs non-semantic <div> soups: accessibility tree projection and SEO indexing',
        'Document landmarks: <main>, <nav>, <header>, <aside>, and <footer> establishing accessibility boundaries',
        'Heading structure: strict <h1> through <h6> hierarchy without skipping levels for screen readers',
        'HTML document parsing: async vs defer script loading attributes and blocking stylesheets',
      ],
      codeExamples: [
        {
          title: 'Accessible Academic Article with Landmarks',
          description: 'A compliant semantic document outline for university lecture content.',
          code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CS-301 Lecture Outline | KielTech Academy</title>
</head>
<body>
  <header>
    <h1>KielTech Academy School of Engineering</h1>
    <nav aria-label="Main University Navigation">
      <ul>
        <li><a href="#syllabus">Syllabus</a></li>
        <li><a href="#labs">Labs</a></li>
      </ul>
    </nav>
  </header>

  <main id="main-content">
    <article aria-labelledby="lecture-title">
      <header>
        <h2 id="lecture-title">Module 01: Low-Level Memory Models</h2>
        <p>Published: <time datetime="2026-10-04">October 4, 2026</time></p>
      </header>
      <section>
        <h3>Memory Hierarchy & Caches</h3>
        <p>Exploring L1, L2, L3 caches and main memory access latency...</p>
      </section>
    </article>
  </main>
</body>
</html>`,
          output: `Semantic HTML document tree with accessible landmark boundaries`,
          explanation: 'Landmark elements like <main> and <nav> allow assistive technology users to jump directly to primary sections without tabbing through header clutter.',
        },
      ],
      gotchas: [
        {
          title: 'Skipping Heading Levels in Semantic Documents',
          badCode: `<h1>Course Syllabus</h1>\n<h4>Memory Management</h4> <!-- ❌ Skipped h2 and h3! Breaks screen reader navigation outline -->`,
          goodCode: `<h1>Course Syllabus</h1>\n<h2>Module 01: Foundations</h2>\n<h3>Memory Management</h3> <!-- ✅ Strict sequential hierarchy -->`,
          explanation: 'Screen readers generate document table of contents from heading tags. Skipping levels creates confusing navigation jumps for blind users.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 01 Semantic HTML5 Architecture Test (30 Questions)',
        instructions: 'Official Mid-term Milestone: 30 questions on semantic landmarks, document outlines, and script loading flags.',
        questions: [],
      },
    },
    {
      id: 2,
      stageNumber: 'Stage 02',
      title: 'WCAG 2.2 AAA Accessibility & ARIA Systems',
      tagline: 'ARIA roles, states (aria-expanded, aria-hidden), live regions (aria-live), and focus traps',
      level: 'Elementary',
      durationHours: '20-25 hrs',
      summary: 'Design accessible interfaces conforming to WCAG 2.2 Level AAA: First Rule of ARIA, managing focus traps in dialogs, keyboard navigation (tabindex), aria-live announcements, and color contrast ratios.',
      coreConcepts: [
        'First Rule of ARIA: "Do not use ARIA if a native HTML element or attribute exists with the semantics you need"',
        'ARIA state attributes: aria-expanded, aria-selected, aria-disabled, and aria-controls',
        'Live regions: aria-live="polite" and aria-live="assertive" for dynamic content announcements',
        'Keyboard focus management: maintaining visible focus rings (:focus-visible) and managing modal focus traps',
      ],
      codeExamples: [
        {
          title: 'Accessible Modal Dialog with Keyboard Focus Management',
          description: 'Creating an accessible dialog with proper ARIA attributes.',
          code: `<div 
  role="dialog" 
  aria-modal="true" 
  aria-labelledby="dialog-title" 
  aria-describedby="dialog-desc"
  class="modal-backdrop"
>
  <div class="modal-card">
    <h2 id="dialog-title">Academic Honor Code Confirmation</h2>
    <p id="dialog-desc">You are about to start the 30-Question Proctored Mid-term Test.</p>
    
    <div class="modal-actions">
      <button type="button" class="btn-cancel">Cancel</button>
      <button type="button" class="btn-confirm" autofocus>Proceed to Exam</button>
    </div>
  </div>
</div>`,
          output: `WCAG 2.2 AAA compliant modal dialog structure with aria-modal="true"`,
          explanation: 'role="dialog" and aria-modal="true" inform screen readers that content outside the modal container is inert, restricting focus traversal to dialog controls.',
        },
      ],
      gotchas: [
        {
          title: 'Removing Visible Focus Outlines (:focus { outline: none })',
          badCode: `button:focus { outline: none; } /* ❌ Catastrophic accessibility violation for keyboard users! */`,
          goodCode: `button:focus-visible {\n  outline: 2px solid #F59E0B;\n  outline-offset: 2px;\n} /* ✅ Clear visible focus ring for keyboard tabbing */`,
          explanation: 'Removing focus outlines makes an interface unusable for keyboard-only users who rely on the focus ring to see which button or input is active.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 02 WCAG 2.2 AAA Accessibility & ARIA Test (30 Questions)',
        instructions: 'Test your understanding of WCAG color contrast, ARIA landmarks, focus traps, and screen reader compatibility.',
        questions: [],
      },
    },
    {
      id: 3,
      stageNumber: 'Stage 03',
      title: 'Modern CSS Layout Engines: CSS Grid & Flexbox Mathematics',
      tagline: 'CSS Grid 2D mathematics, auto-fit vs auto-fill, subgrid, Flexbox alignment, and clamp()',
      level: 'Intermediate',
      durationHours: '25-30 hrs',
      summary: 'Master contemporary CSS layout algorithms: CSS Grid 2-dimensional track sizing mathematics, repeat(auto-fit, minmax()), Subgrid for nested track inheritance, Flexbox axis alignment, and fluid typography with clamp().',
      coreConcepts: [
        'CSS Grid 2D layout: explicit vs implicit grids, fractional units (fr), and minmax() constraints',
        'Responsive auto-placement: repeat(auto-fit, minmax(280px, 1fr)) eliminating media queries',
        'CSS Subgrid (grid-template-rows: subgrid): aligning nested card headers and footers across rows',
        'Fluid typography and spacing: clamp(1rem, 2.5vw + 0.5rem, 2.5rem) mathematical scaling',
      ],
      codeExamples: [
        {
          title: 'Zero-Media-Query Responsive Grid with Subgrid Alignment',
          description: 'A responsive course card grid where nested cards align across rows.',
          code: `/* Container creates dynamic columns based on viewport space */
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Card spans 3 implicit rows and inherits parent row tracks */
.course-card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
  background-color: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: 1.5rem;
}

.course-card h3 { margin: 0; }
.course-card p { color: #94a3b8; }
.course-card button { align-self: end; }`,
          output: `Nested card titles, body text, and action buttons align horizontally across columns`,
          explanation: 'CSS Subgrid allows child elements inside grid items to align with the parent grid tracks, solving the long-standing problem of misaligned card footers.',
        },
      ],
      gotchas: [
        {
          title: 'Using 100vh on Mobile Devices Causing Address Bar Overflow',
          badCode: `min-height: 100vh; /* ❌ On mobile Safari/Chrome, 100vh ignores browser URL bar, causing scroll overflow */`,
          goodCode: `min-height: 100dvh; /* ✅ 100 dynamic viewport height (dvh) accounts for mobile UI bars */`,
          explanation: '100vh measures the viewport assuming UI chrome is hidden. Modern CSS units 100dvh (dynamic) and 100svh (small) prevent content from being pushed below the fold.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 03 CSS Grid Mathematics & Layout Engines Test (30 Questions)',
        instructions: 'Comprehensive 30-Question Assessment on 2D Grid layouts, subgrid, Flexbox alignment, and fluid clamp().',
        questions: [],
      },
    },
    {
      id: 4,
      stageNumber: 'Stage 04',
      title: 'Design Token Systems, Tailwind Architecture & Container Queries',
      tagline: 'CSS custom properties (tokens), Container Queries (@container), Tailwind CSS, and GPU compositing',
      level: 'Advanced',
      durationHours: '30-40 hrs',
      summary: 'Engineer production-grade design systems: Design Token hierarchies with CSS Custom Properties, Container Queries (@container) for component-level responsiveness, utility-first CSS architecture with Tailwind CSS, and GPU compositing optimizations.',
      coreConcepts: [
        'Design Token architecture: primitive tokens -> semantic tokens -> component tokens with CSS variables',
        'CSS Container Queries: @container (min-width: 400px) styling components based on parent container size',
        'Tailwind CSS engineering: utility classes, JIT compilation engine, and theme token extension',
        'Browser GPU Compositing: animating transform and opacity on the composite thread to achieve 60fps',
      ],
      codeExamples: [
        {
          title: 'Component-Level Responsiveness with CSS Container Queries',
          description: 'A stage progress card that adapts whether placed in a narrow sidebar or wide dashboard.',
          code: `/* 1. Define container context on parent */
.stage-card-wrapper {
  container-type: inline-size;
  container-name: stage-card;
}

/* 2. Default compact mobile view */
.stage-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* 3. When parent container is wide enough (>= 500px), switch to row layout */
@container stage-card (min-width: 500px) {
  .stage-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}`,
          output: `Component layout adapts to its own container width without relying on viewport media queries`,
          explanation: 'Container queries enable true component modularity: a card can be placed anywhere (sidebar, modal, main view) and adapt to available space independently.',
        },
      ],
      gotchas: [
        {
          title: 'Animating Layout Properties (top, left, width) Instead of Transforms',
          badCode: `button:hover { top: -4px; width: 110px; } /* ❌ Triggers Layout and Paint reflow on every frame (Jank!) */`,
          goodCode: `button:hover { transform: translateY(-4px) scale(1.05); } /* ✅ GPU accelerated composite layer only (Smooth 60fps!) */`,
          explanation: 'Animating `top`, `left`, `width`, or `height` forces the browser CPU to recalculate the entire document layout. `transform` and `opacity` run on the GPU composite thread.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 04 Design Tokens, Container Queries & GPU Optimization Test (30 Questions)',
        instructions: 'Test your mastery of Design Tokens, Container Queries, Tailwind architecture, and 60fps animations.',
        questions: [],
      },
    },
  ],
};
