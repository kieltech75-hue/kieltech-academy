import { LanguageCourse, CourseStage, GraduationExam, ExamQuestion } from '../types/curriculum';
import { generateGraduationAssessment, generateStageAssessment } from './curriculumAssessment';
import { COMPREHENSIVE_COURSE_STAGES } from './curriculumCoursesData';

export const COURSES: LanguageCourse[] = [
  // Backend Languages
  {
    id: 'python',
    name: 'Python',
    courseCode: 'CS-301',
    department: 'Department of Computer Science & Systems',
    credits: 4,
    prerequisites: ['CS-101 Principles of Computation', 'CS-201 Discrete Structures'],
    syllabusId: 'SYL-CS301-2026',
    category: 'backend',
    iconName: 'Code2',
    badge: 'Core Major',
    color: '#F59E0B',
    accentBg: 'rgba(245, 158, 11, 0.1)',
    description: 'Advanced Python engineering: low-level CPython memory model, asynchronous I/O multiplexing, and microservices architecture.',
    learningOutcomes: ['CPython PyObject memory & reference counter', 'Object-oriented dunder protocols & MRO', 'Asynchronous event loop & non-blocking sockets', 'Production service deployment & testing suites'],
    totalStages: 4,
  },
  {
    id: 'nodejs',
    name: 'Node.js / Express',
    courseCode: 'CS-304',
    department: 'Department of Software Engineering',
    credits: 4,
    prerequisites: ['CS-202 Web Architecture & Protocols'],
    syllabusId: 'SYL-CS304-2026',
    category: 'backend',
    iconName: 'Server',
    badge: 'Core Major',
    color: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.1)',
    description: 'V8 runtime internals, Libuv threadpools, event-driven streaming buffers, and distributed REST microservices.',
    learningOutcomes: ['Non-blocking event loop priority queues', 'High-throughput streams & backpressure', 'Stateless JWT authentication & API gateways', 'Multi-core cluster scaling & containerization'],
    totalStages: 4,
  },
  {
    id: 'golang',
    name: 'Go (Golang)',
    courseCode: 'CS-401',
    department: 'Distributed Systems & Cloud Infrastructure',
    credits: 4,
    prerequisites: ['CS-301 Operating Systems & Concurrency'],
    syllabusId: 'SYL-CS401-2026',
    category: 'backend',
    iconName: 'Cpu',
    badge: 'Advanced Systems',
    color: '#06B6D4',
    accentBg: 'rgba(6, 182, 212, 0.1)',
    description: 'Cloud infrastructure engineering: Goroutines, CSP channels, fast HTTP multiplexers, and static compiled binaries.',
    learningOutcomes: ['Strong static typing & structural interfaces', 'Goroutine concurrency & CSP sync channels', 'High-concurrency cloud microservices', 'Dockerized multi-arch production binaries'],
    totalStages: 4,
  },
  {
    id: 'java',
    name: 'Java / Spring Boot',
    courseCode: 'CS-310',
    department: 'Enterprise Software & Systems Architecture',
    credits: 4,
    prerequisites: ['CS-205 Object-Oriented Analysis & Design'],
    syllabusId: 'SYL-CS310-2026',
    category: 'backend',
    iconName: 'Layers',
    badge: 'Enterprise Systems',
    color: '#EF4444',
    accentBg: 'rgba(239, 68, 68, 0.1)',
    description: 'Enterprise distributed software: JVM memory architecture, garbage collector tuning, Spring Boot DI, and Hibernate persistence.',
    learningOutcomes: ['JVM memory regions & GC optimization', 'Inversion of Control & Spring Dependency Injection', 'Hibernate JPA transactional persistence', 'Enterprise security & microservice resilience'],
    totalStages: 4,
  },
  {
    id: 'rust',
    name: 'Rust Systems & Backend',
    courseCode: 'CS-415',
    department: 'Systems Programming & Cyber-Security',
    credits: 4,
    prerequisites: ['CS-305 Computer Systems & Memory Models'],
    syllabusId: 'SYL-CS415-2026',
    category: 'backend',
    iconName: 'Shield',
    badge: 'Systems Honors',
    color: '#F97316',
    accentBg: 'rgba(249, 115, 22, 0.1)',
    description: 'Memory safety without garbage collection: ownership, borrowing, lifetime analysis, and zero-cost high-throughput microservices.',
    learningOutcomes: ['Ownership, borrow checker & explicit lifetimes', 'Zero-cost abstractions & fearless concurrency', 'Axum & Tokio asynchronous runtimes', 'Production-hardened systems programming'],
    totalStages: 4,
  },

  // Frontend Languages & Frameworks
  {
    id: 'javascript',
    name: 'Modern JavaScript (ES6+)',
    courseCode: 'CS-210',
    department: 'Department of Web Science & Human-Computer Interaction',
    credits: 3,
    prerequisites: ['CS-101 Principles of Computation'],
    syllabusId: 'SYL-CS210-2026',
    category: 'frontend',
    iconName: 'Sparkles',
    badge: 'Foundational',
    color: '#EAB308',
    accentBg: 'rgba(234, 179, 8, 0.1)',
    description: 'Web runtime engine fundamentals: Execution contexts, lexical scoping, prototypal inheritance, and asynchronous promises.',
    learningOutcomes: ['Call stack execution & scope chains', 'DOM tree manipulation & event bubbling', 'Microtasks & Promise asynchronous control flow', 'ES Modules & client-side build pipelines'],
    totalStages: 4,
  },
  {
    id: 'typescript',
    name: 'TypeScript & Type Systems',
    courseCode: 'CS-320',
    department: 'Department of Software Engineering',
    credits: 4,
    prerequisites: ['CS-210 Modern JavaScript'],
    syllabusId: 'SYL-CS320-2026',
    category: 'frontend',
    iconName: 'FileCode2',
    badge: 'Core Major',
    color: '#3B82F6',
    accentBg: 'rgba(59, 130, 246, 0.1)',
    description: 'Formal type theory: Structural subtyping, conditional types, mapped types, generics, and large-scale refactoring safety.',
    learningOutcomes: ['Strict compiler flags & static verification', 'Advanced generics & conditional type inference', 'Utility types & template literal types', 'Large enterprise codebase maintainability'],
    totalStages: 4,
  },
  {
    id: 'react',
    name: 'React.js Architecture',
    courseCode: 'CS-330',
    department: 'Department of Web Science & Human-Computer Interaction',
    credits: 4,
    prerequisites: ['CS-210 Modern JavaScript', 'CS-320 TypeScript'],
    syllabusId: 'SYL-CS330-2026',
    category: 'frontend',
    iconName: 'Atom',
    badge: 'Core Major',
    color: '#60A5FA',
    accentBg: 'rgba(96, 165, 250, 0.1)',
    description: 'Declarative component design, fiber reconciliation, concurrent scheduling primitives, and custom hooks architecture.',
    learningOutcomes: ['Virtual DOM reconciliation & fiber lifecycles', 'Hooks primitives & referential memoization', 'Context API & compound component architecture', 'Production bundle splitting & profiling'],
    totalStages: 4,
  },
  {
    id: 'vue',
    name: 'Vue.js 3 & State Systems',
    courseCode: 'CS-332',
    department: 'Department of Web Science & Human-Computer Interaction',
    credits: 3,
    prerequisites: ['CS-210 Modern JavaScript'],
    syllabusId: 'SYL-CS332-2026',
    category: 'frontend',
    iconName: 'Layout',
    badge: 'Elective',
    color: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.1)',
    description: 'Modern reactive programming: Proxy-based change detection, Composition API, Pinia global state, and Single-File Components.',
    learningOutcomes: ['Reactivity engine with reactive and ref proxies', 'Single-File Component compilation pipelines', 'Pinia state architecture & store subscriptions', 'Vue Router navigation guards & meta tags'],
    totalStages: 4,
  },
  {
    id: 'html-css',
    name: 'HTML5 Semantic Web & Design Systems',
    courseCode: 'CS-202',
    department: 'Department of Web Science & Human-Computer Interaction',
    credits: 3,
    prerequisites: ['CS-101 Principles of Computation'],
    syllabusId: 'SYL-CS202-2026',
    category: 'frontend',
    iconName: 'Palette',
    badge: 'Foundational',
    color: '#A855F7',
    accentBg: 'rgba(168, 85, 247, 0.1)',
    description: 'Semantic markup, WCAG 2.2 accessibility, responsive CSS Grid layout algorithms, and utility-first Tailwind design systems.',
    learningOutcomes: ['Semantic HTML & WCAG AAA accessibility', 'Complex responsive CSS Grid & Flexbox mathematics', 'Tailwind CSS utility tokens & design systems', 'Fluid responsive typography & performant animations'],
    totalStages: 4,
  },
];

export const COURSE_STAGES_MAP: Record<string, CourseStage[]> = {
  ...COMPREHENSIVE_COURSE_STAGES,
  python: [
    {
      id: 1,
      stageNumber: 'Stage 01',
      title: 'Foundations & Dynamic Memory',
      tagline: 'Memory pointers, types, truthiness, and functions',
      level: 'Beginner',
      durationHours: '15-20 hrs',
      summary: 'Learn the architectural foundations of Python: names bound to heap objects, truthiness evaluation, conditionals, loops with enumerate/zip, and lexical scope.',
      coreConcepts: [
        'Python variables are memory labels bound to PyObject structs on the heap',
        'Dynamic typing vs static typing and truthiness of empty containers',
        'Iterating idiomatically using enumerate(), zip(), and range()',
        'Functions, default arguments gotchas, and LEGB variable scope',
      ],
      codeExamples: [
        {
          title: 'Memory Label Binding & Type Inspection',
          description: 'Demonstrating how variables are references rather than boxed values.',
          code: `item = "KielTech"
print("Type of item:", type(item).__name__)
print("Memory ID:", id(item))

# Rebinding item to an integer
item = 2026
print("Rebound type:", type(item).__name__)
print("New Memory ID:", id(item))`,
          output: `Type of item: str\nMemory ID: 140482910\nRebound type: int\nNew Memory ID: 140483420`,
          explanation: 'In Python, reassigning a variable does not overwrite memory; it rebinds the label to a new PyObject in heap memory.',
        },
        {
          title: 'Safe Function Parameter Defaults',
          description: 'Never use mutable defaults (lists/dicts) in Python function definitions.',
          code: `def add_student(name: str, cohort: list | None = None) -> list:
    if cohort is None:
        cohort = []
    cohort.append(name)
    return cohort

print(add_student("Alex"))
print(add_student("Sara"))`,
          output: `['Alex']\n['Sara']`,
          explanation: 'Default arguments are evaluated once at function definition time. Using None prevents unintended shared state across calls.',
        },
      ],
      gotchas: [
        {
          title: 'Testing Identity (is) vs Equality (==)',
          badCode: `a = [1, 2, 3]\nb = [1, 2, 3]\nif a is b:  # ❌ Incorrect for value equality\n    print("Equal")`,
          goodCode: `a = [1, 2, 3]\nb = [1, 2, 3]\nif a == b:  # ✅ Compares contents using __eq__\n    print("Equal contents!")`,
          explanation: 'is checks memory address identity (id(a) == id(b)), whereas == checks values.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 01 Knowledge & Logic Test (30 Questions)',
        instructions: 'Official Mid-Stage Milestone: Exactly 30 questions testing fundamental syntax, types, and logic. Duration: 30 Minutes. Passing score: 70%.',
        questions: [
          {
            id: 'py1-q1',
            type: 'multiple_choice',
            topicTag: 'Variables & Truthiness Evaluation',
            question: 'What is the output of bool([]) and bool([0]) in Python?',
            options: [
              { text: 'True, True', explanation: 'Both evaluated as true' },
              { text: 'False, True', explanation: 'An empty list is falsy; a list with element 0 is non-empty and thus truthy.' },
              { text: 'False, False', explanation: 'Incorrect evaluation of non-empty collection' },
              { text: 'Error', explanation: 'Syntax error' },
            ],
            correctIndex: 1,
          },
          {
            id: 'py1-q2',
            type: 'multiple_choice',
            topicTag: 'LEGB Variable Scope & Resolution',
            question: 'In Python, where are local variables looked up first according to LEGB rule?',
            options: [
              { text: 'Global scope', explanation: 'Global is checked after Local and Enclosing' },
              { text: 'Local scope', explanation: 'L (Local) is the immediate innermost scope.' },
              { text: 'Built-in scope', explanation: 'Built-ins are checked last.' },
              { text: 'Enclosing scope', explanation: 'Enclosing is checked second.' },
            ],
            correctIndex: 1,
          },
          {
            id: 'py1-q3',
            type: 'multiple_choice',
            topicTag: 'Mutable Parameter Defaults',
            question: 'Why should you NOT use a mutable object (e.g. def fn(x=[])) as a default parameter value in Python?',
            options: [
              { text: 'It triggers a syntax compile error in Python 3.12', explanation: 'Python allows it syntactically' },
              { text: 'The default argument is evaluated once when the function is defined, sharing the same object across calls', explanation: 'Default parameters are created at function definition time in CPython.' },
              { text: 'It creates an infinite loop', explanation: 'No loop is created' },
              { text: 'It converts the list to a tuple automatically', explanation: 'No automatic conversion occurs' },
            ],
            correctIndex: 1,
          },
          {
            id: 'py1-q4',
            type: 'coding',
            topicTag: 'List Comprehensions & Loops',
            question: 'Write a Python expression to produce a list of squared numbers for numbers from 1 to 5 inclusive using a list comprehension.',
            starterCode: `# Return a list of squares for 1 to 5\ndef get_squares():\n    return [x**2 for x in range(1, 6)]\n\nprint(get_squares())`,
            options: [
              { text: '[x**2 for x in range(1, 6)]', explanation: 'Correct list comprehension syntax.' },
              { text: 'range(1, 5).square()', explanation: 'Invalid syntax' },
              { text: '[x*2 for x in range(5)]', explanation: 'Does not square numbers' },
              { text: 'list.map(range(1, 6))', explanation: 'Not valid Python' },
            ],
            correctIndex: 0,
            hint: 'Use [x**2 for x in range(1, 6)]',
          },
        ],
      },
    },
    {
      id: 2,
      stageNumber: 'Stage 02',
      title: 'Data Structures & Idiomatic Python',
      tagline: 'Slicing, Hash Tables, Sets, Context Managers',
      level: 'Elementary',
      durationHours: '20-25 hrs',
      summary: 'Master list memory buffers, slicing stepping [::-1], dictionary hash lookups O(1), set algebra, and safe resource streaming with context managers.',
      coreConcepts: [
        'List memory allocation and amortized over-allocation mechanics',
        'Hash tables: hashability, key immutability, and O(1) lookups',
        'Set algebra (union, intersection, symmetric difference)',
        'Context managers with the with statement (__enter__ / __exit__)',
      ],
      codeExamples: [
        {
          title: 'Dictionary Hash Lookups & Merging',
          description: 'Modern dictionary unpacking and comprehension.',
          code: `config_defaults = {"timeout": 30, "retries": 3, "debug": False}
user_overrides = {"debug": True, "api_key": "kiel_live_secret"}

# PEP 584 dictionary union operator
final_config = config_defaults | user_overrides
print("Active Config:", final_config)`,
          output: `Active Config: {'timeout': 30, 'retries': 3, 'debug': True, 'api_key': 'kiel_live_secret'}`,
          explanation: 'The | operator merges mappings, letting subsequent mappings override earlier keys.',
        },
      ],
      gotchas: [
        {
          title: 'Modifying a Dictionary while Iterating Over It',
          badCode: `data = {"a": 1, "b": 2}\nfor k in data:\n    if k == "a":\n        del data[k]  # ❌ RuntimeError: dictionary changed size during iteration`,
          goodCode: `data = {"a": 1, "b": 2}\nfor k in list(data.keys()):\n    if k == "a":\n        del data[k]  # ✅ Safe with copy of keys`,
          explanation: 'Iterating directly on a mutable collection while deleting keys invalidates internal hash iterators.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 02 Data Structures Test',
        instructions: 'Test your understanding of Python data structures, hash complexity, and context managers.',
        questions: [
          {
            id: 'py2-q1',
            type: 'multiple_choice',
            topicTag: 'Hash Tables & Time Complexity',
            question: 'What is the average time complexity for checking membership (`item in collection`) in a Python set?',
            options: [
              { text: 'O(N)', explanation: 'O(N) is for lists' },
              { text: 'O(1)', explanation: 'Sets use hash tables offering O(1) average lookup time.' },
              { text: 'O(log N)', explanation: 'O(log N) is for balanced binary trees' },
              { text: 'O(N^2)', explanation: 'Quadratic is incorrect' },
            ],
            correctIndex: 1,
          },
          {
            id: 'py2-q2',
            type: 'multiple_choice',
            topicTag: 'Context Managers & Resource Lifecycle',
            question: 'Which method pair must an object implement to work with Python’s `with` statement?',
            options: [
              { text: '__open__ and __close__', explanation: 'Incorrect method names' },
              { text: '__enter__ and __exit__', explanation: 'The context manager protocol uses __enter__ and __exit__.' },
              { text: '__start__ and __stop__', explanation: 'Incorrect names' },
              { text: '__init__ and __del__', explanation: 'These manage lifecycle, not context' },
            ],
            correctIndex: 1,
          },
        ],
      },
    },
    {
      id: 3,
      stageNumber: 'Stage 03',
      title: 'Object-Oriented & Dunder Protocols',
      tagline: 'Classes, Dunder methods, and MRO architecture',
      level: 'Intermediate',
      durationHours: '25-30 hrs',
      summary: 'Learn object-oriented design in Python: self parameter, class vs instance state, dunder magic methods (__repr__, __getitem__, __len__), and C3 linearization (MRO).',
      coreConcepts: [
        'Classes are objects in memory: type() as metaclass',
        'Instance attributes vs class attributes and property decorators',
        'Dunder protocols: emulating sequences, numbers, and callables',
        'Method Resolution Order (MRO) and cooperative super() calls',
      ],
      codeExamples: [
        {
          title: 'Custom Vector Class with Dunder Operators',
          description: 'Implementing __add__ and __repr__ for clean OOP interfaces.',
          code: `class Vector:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __add__(self, other: 'Vector') -> 'Vector':
        return Vector(self.x + other.x, self.y + other.y)

    def __repr__(self) -> str:
        return f"Vector({self.x}, {self.y})"

v1 = Vector(2, 4)
v2 = Vector(3, 1)
print("Result of v1 + v2:", v1 + v2)`,
          output: `Result of v1 + v2: Vector(5.0, 5.0)`,
          explanation: 'Dunder methods hook directly into Python operators, creating natural domain-specific APIs.',
        },
      ],
      gotchas: [
        {
          title: 'Accidental Class State Mutation',
          badCode: `class Student:\n    courses = [] # ❌ Shared among ALL instances!`,
          goodCode: `class Student:\n    def __init__(self):\n        self.courses = [] # ✅ Isolated to each instance`,
          explanation: 'Attributes defined at class level are shared across all instances.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 03 OOP & Architecture Test',
        instructions: 'Verify your mastery of object orientation, magic methods, and inheritance.',
        questions: [
          {
            id: 'py3-q1',
            type: 'multiple_choice',
            topicTag: 'OOP Dunder Methods & Protocols',
            question: 'Which dunder method should return an unambiguous representation of an object suitable for debugging?',
            options: [
              { text: '__str__', explanation: '__str__ is for human-friendly end-user display' },
              { text: '__repr__', explanation: '__repr__ is meant to be unambiguous and aid developers/debuggers.' },
              { text: '__format__', explanation: 'Format specifier only' },
              { text: '__print__', explanation: 'Not a real dunder method' },
            ],
            correctIndex: 1,
          },
        ],
      },
    },
    {
      id: 4,
      stageNumber: 'Stage 04',
      title: 'Asyncio, CPython Internals & APIs',
      tagline: 'Decorators, Coroutines, GIL, and FastAPI architecture',
      level: 'Advanced',
      durationHours: '30-40 hrs',
      summary: 'Explore metaprogramming with decorators and @functools.wraps, asynchronous event loops with asyncio, CPython reference counting, and production APIs.',
      coreConcepts: [
        'Lexical closures and decorators with parameters',
        'Asynchronous I/O multiplexing, async / await, and event loops',
        'CPython PyObject reference counting and cyclic garbage collection',
        'Building scalable backend REST services with FastAPI and Pydantic',
      ],
      codeExamples: [
        {
          title: 'Asynchronous Concurrency with asyncio.gather',
          description: 'Executing multiple I/O bound tasks concurrently without threads.',
          code: `import asyncio

async def fetch_service_data(service_id: int):
    print(f"Starting service {service_id}")
    await asyncio.sleep(0.1)
    return f"Service {service_id} response"

async def main():
    results = await asyncio.gather(
        fetch_service_data(1),
        fetch_service_data(2),
        fetch_service_data(3)
    )
    print("All tasks finished:", results)

asyncio.run(main())`,
          output: `Starting service 1\nStarting service 2\nStarting service 3\nAll tasks finished: ['Service 1 response', 'Service 2 response', 'Service 3 response']`,
          explanation: 'asyncio uses a single-threaded cooperative event loop to handle thousands of concurrent I/O operations.',
        },
      ],
      gotchas: [
        {
          title: 'Calling Blocking Code inside Async Functions',
          badCode: `async def handle():\n    time.sleep(5) # ❌ Blocks the entire event loop!`,
          goodCode: `async def handle():\n    await asyncio.sleep(5) # ✅ Yields execution to event loop`,
          explanation: 'Synchronous blocking calls like time.sleep() freeze the event loop for all concurrent requests.',
        },
      ],
      midStageTest: {
        testTitle: 'Stage 04 Asynchronous & Backend Test',
        instructions: 'Test your mastery of coroutines, closures, and concurrency.',
        questions: [
          {
            id: 'py4-q1',
            type: 'multiple_choice',
            topicTag: 'Decorators & Asynchronous Concurrency',
            question: 'What is the purpose of @functools.wraps when authoring custom Python decorators?',
            options: [
              { text: 'It compiles the function to C machine code', explanation: 'Python remains interpreted/bytecode' },
              { text: 'It preserves the original function’s __name__, __doc__, and metadata', explanation: 'functools.wraps copies the original function signature and introspection metadata.' },
              { text: 'It makes the decorated function asynchronous', explanation: 'It does not alter synchronous behavior' },
              { text: 'It automatically catches all exceptions', explanation: 'It does not catch exceptions unless programmed to' },
            ],
            correctIndex: 1,
          },
        ],
      },
    },
  ],
};

// Fallback stage generator
export function getStagesForCourse(courseId: string): CourseStage[] {
  const course = COURSES.find((c) => c.id === courseId);
  const langName = course?.name || 'Programming Language';
  const isBackend = course?.category === 'backend';

  const baseStages: CourseStage[] = COURSE_STAGES_MAP[courseId] ? COURSE_STAGES_MAP[courseId] : [
    {
      id: 1,
      stageNumber: 'Stage 01',
      title: `${langName} Core Syntax & Grammar`,
      tagline: 'Variables, types, control flow, and execution fundamentals',
      level: 'Beginner',
      durationHours: '15-20 hrs',
      summary: `Master the syntactic grammar of ${langName}: primitive types, flow control, functions, and the core runtime model.`,
      coreConcepts: [
        `Syntax primitives and memory allocation patterns in ${langName}`,
        'Control structures: branching, loops, pattern matching, and iterations',
        'Function declarations, parameter modes, and return semantics',
        'Runtime environments and code compiling/transpilation phases',
      ],
      codeExamples: [
        {
          title: `Hello World & Syntax Basics in ${langName}`,
          description: `Idiomatic first program in ${langName}.`,
          code: `// ${langName} Example\nfunction main() {\n  console.log("Welcome to ${langName} at KielTech Academy!");\n}\nmain();`,
          output: `Welcome to ${langName} at KielTech Academy!`,
          explanation: `Every robust program in ${langName} starts with understanding structured entry points and clean variable lifecycles.`,
        },
      ],
      gotchas: [
        {
          title: 'Variable Shadowing and Type Coercion Trap',
          badCode: `// Untyped or accidental shadow assignment`,
          goodCode: `// Explicit variable scope declaration`,
          explanation: 'Always maintain strict lexical scope discipline and explicit conversions.',
        },
      ],
      midStageTest: {
        testTitle: `Stage 01 ${langName} Fundamentals Test (30 Questions)`,
        instructions: `Comprehensive 30-Question Assessment: Answer all questions to demonstrate rigorous understanding of ${langName} foundations. Passing score is 70%.`,
        questions: [],
      },
    },
    {
      id: 2,
      stageNumber: 'Stage 02',
      title: `${langName} Data Structures & Modularity`,
      tagline: 'Collections, memory layout, and modular organization',
      level: 'Elementary',
      durationHours: '20-25 hrs',
      summary: `Harness collections (arrays, maps, sets), custom types, modular exports/imports, and idiomatic error handling in ${langName}.`,
      coreConcepts: [
        'Composite data structures: lists, hash maps, sets, and records',
        'Idiomatic error handling patterns (Result types, try/catch, or errors-as-values)',
        'Modular packaging and code splitting across separate files',
      ],
      codeExamples: [
        {
          title: `Data Structures & Processing in ${langName}`,
          description: `Processing lists and mapping data.`,
          code: `const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconsole.log("Processed:", doubled);`,
          output: `Processed: [2, 4, 6, 8, 10]`,
          explanation: `Functional array transformations allow clean declarative data processing.`,
        },
      ],
      gotchas: [
        {
          title: 'Ignoring Error Returns',
          badCode: `// Unhandled potential failure call`,
          goodCode: `// Robust try/catch or explicit error handling verification`,
          explanation: 'Unchecked errors bubble up into fatal process termination or unhandled rejections.',
        },
      ],
      midStageTest: {
        testTitle: `Stage 02 ${langName} Structures Test (30 Questions)`,
        instructions: `Comprehensive 30-Question Assessment: Test your mastery of data structures, algorithm complexity, and modular architecture.`,
        questions: [],
      },
    },
    {
      id: 3,
      stageNumber: 'Stage 03',
      title: `${langName} Design Patterns & Concurrency`,
      tagline: 'Asynchronous flows, threading or event loops, and interfaces',
      level: 'Intermediate',
      durationHours: '25-30 hrs',
      summary: `Design robust systems in ${langName}: object/interface abstraction, concurrency models (async/await, threads, or channels), and design patterns.`,
      coreConcepts: [
        'Abstraction via interfaces, polymorphism, or prototypes',
        'Concurrency vs parallelism: async/await, worker pools, or CSP channels',
        'Creational and structural software engineering design patterns',
      ],
      codeExamples: [
        {
          title: `Asynchronous Task Execution in ${langName}`,
          description: `Handling non-blocking execution safely.`,
          code: `async function fetchData() {\n  const result = await Promise.resolve("Success payload");\n  console.log(result);\n}\nfetchData();`,
          output: `Success payload`,
          explanation: `Asynchronous primitives prevent thread lockups during external network or database calls.`,
        },
      ],
      gotchas: [
        {
          title: 'Race Conditions and Deadlocks',
          badCode: `// Shared state mutated concurrently without synchronization`,
          goodCode: `// Isolated channels, mutex guards, or immutable event passing`,
          explanation: 'Unsynchronized shared state mutation causes nondeterministic race bugs.',
        },
      ],
      midStageTest: {
        testTitle: `Stage 03 ${langName} Concurrency Test (30 Questions)`,
        instructions: `Comprehensive 30-Question Assessment: Demonstrate your knowledge of async flows, synchronization, and design patterns.`,
        questions: [],
      },
    },
    {
      id: 4,
      stageNumber: 'Stage 04',
      title: `${langName} Production Mastery & Scaling`,
      tagline: 'Security, testing, profiling, and production deployment',
      level: 'Advanced',
      durationHours: '30-40 hrs',
      summary: `Transform code into enterprise-ready assets: comprehensive unit/integration testing suites, security audits, memory profiling, and CI/CD pipelines.`,
      coreConcepts: [
        'Automated test suites (unit, integration, regression)',
        'Security hardening: input validation, authentication, and secret management',
        'Profiling memory footprints, CPU spikes, and memory leak diagnosis',
        'CI/CD containerization and high-availability deployment',
      ],
      codeExamples: [
        {
          title: `Automated Test Assertion in ${langName}`,
          description: `Writing reliable test specs with assertions.`,
          code: `function testCalculator() {\n  const add = (a: number, b: number) => a + b;\n  console.assert(add(2, 3) === 5, "Test Failed: 2 + 3 should be 5");\n  console.log("All unit tests passed!");\n}\ntestCalculator();`,
          output: `All unit tests passed!`,
          explanation: `Unit test assertions ensure code regression safety before production deploy.`,
        },
      ],
      gotchas: [
        {
          title: 'Hardcoding Secret Keys in Source Code',
          badCode: `const API_KEY = "kiel_live_secret_123"; // ❌ Security hazard!`,
          goodCode: `const API_KEY = process.env.API_KEY; // ✅ Environment variables / Vault`,
          explanation: 'Never commit secrets into source control.',
        },
      ],
      midStageTest: {
        testTitle: `Stage 04 ${langName} Production Test (30 Questions)`,
        instructions: `Comprehensive 30-Question Assessment: Demonstrate your production engineering, security hardening, and testing best practices.`,
        questions: [],
      },
    },
  ];

  return baseStages.map((stage) => {
    return {
      ...stage,
      midStageTest: {
        testTitle: `${stage.stageNumber} ${stage.title} Mid-Stage Test (30 Questions)`,
        instructions: `This 30-question assessment checks the concepts, lesson examples, and common mistakes covered in this stage. Duration: 30 minutes. Passing threshold: 70%.`,
        questions: generateStageAssessment(courseId, stage),
      },
    };
  });
}

export function getGraduationExamForCourse(courseId: string): GraduationExam {
  const course = COURSES.find((c) => c.id === courseId) || COURSES[0];
  const questions = generateGraduationAssessment(course.id, getStagesForCourse(course.id));

  return {
    title: `${course.courseCode}: ${course.name} Comprehensive Degree Examination (60 Questions)`,
    courseName: course.name,
    courseCode: course.courseCode || 'CS-301',
    passingScore: 70,
    instructions: `This 60-question exam reviews the concepts, examples, and common mistakes taught across all four stages of ${course.name}. All questions are multiple choice and refer to material from this course. Duration: 60 minutes. Passing threshold: 70%.`,
    questions,
  };
}
