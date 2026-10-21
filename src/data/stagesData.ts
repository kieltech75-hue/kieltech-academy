import { Stage, SpecializationTrack } from '../types/stages';

export const STAGES_DATA: Stage[] = [
  {
    id: 1,
    stageNumber: '01',
    title: 'Foundations & Core Syntax',
    tagline: 'From First Script to Algorithmic Logic',
    level: 'Beginner',
    durationHours: '20-30 hrs',
    prerequisites: ['Basic computer literacy', 'Terminal/Command prompt basics'],
    summary:
      'Master the fundamental grammar of Python: variables, dynamic typing, truthiness, conditional branches, loops, functions, and the LEGB scope rule.',
    mentalModel:
      'In Python, variables do not hold values directly like C boxes; they are labels (tags) bound to objects residing on the memory heap. Everything in Python is an object.',
    topics: [
      {
        id: '1-1',
        title: 'Variables, Dynamic Typing & Truthiness',
        summary: 'Understand Python objects, references, type casting, and falsy values.',
        concepts: [
          'Dynamic typing vs static typing: Python checks types at runtime',
          'Primitive types: int, float, str, bool, and the singleton None',
          'Truthiness: empty collections ([]), 0, "", and None evaluate to False',
          'Type introspection via type() and isinstance()',
        ],
        codeSnippets: [
          {
            title: 'Dynamic Binding & Truthiness',
            description: 'Demonstrating how variables point to objects and Python evaluates conditions.',
            code: `# Python variables are dynamic reference labels
item = "Python 3"
print("Initial item:", item, "| Type:", type(item).__name__)

item = 42  # Rebound to an integer object
print("Rebound item:", item, "| Type:", type(item).__name__)

# Falsy evaluations: None, 0, empty list, empty string
falsy_values = [None, 0, "", [], {}]
for val in falsy_values:
    if not val:
        print(f"Value {repr(val)} is strictly falsy")`,
            explanation:
              'Python does not declare variable types upfront. Variable names reside in local namespaces and reference heap objects.',
          },
        ],
        gotcha: {
          title: 'Testing Identity with "is" vs Equality with "=="',
          badCode: `a = [1, 2, 3]
b = [1, 2, 3]
if a is b:  # ❌ INCORRECT: checks memory address identity
    print("Same")`,
          goodCode: `a = [1, 2, 3]
b = [1, 2, 3]
if a == b:  # ✅ CORRECT: checks value equality
    print("Values match!")
print("a is b:", a is b)  # False, two separate heap objects`,
          explanation:
            '`==` invokes `__eq__` to compare contents, while `is` compares memory identity (`id(a) == id(b)`). Only use `is` for singletons like `x is None`.',
        },
      },
      {
        id: '1-2',
        title: 'Control Flow, Loops & Comprehensions Intro',
        summary: 'Master idiomatic branching, range generation, enumerate, zip, and loop else clauses.',
        concepts: [
          'if / elif / else expressions and ternary: x if condition else y',
          'for loop over iterables with enumerate() for zero-overhead index tracking',
          'zip() for parallel iteration over multiple sequences',
          'while loops with break, continue, and the oft-misunderstood loop else clause',
        ],
        codeSnippets: [
          {
            title: 'Idiomatic Looping with Enumerate & Zip',
            description: 'Loop cleanly without manual counter index variables.',
            code: `languages = ["Python", "Rust", "TypeScript"]
release_years = [1991, 2010, 2012]

# Idiomatic parallel iteration with zip
for lang, year in zip(languages, release_years):
    print(f"{lang} was introduced in {year}")

# Enumerate with custom start index
print("--- Rankings ---")
for rank, lang in enumerate(languages, start=1):
    print(f"#{rank}: {lang}")`,
            explanation:
              'Never write `for i in range(len(items)):`. Python treats all sequences as first-class iterables.',
          },
        ],
        gotcha: {
          title: 'The Loop "else" Clause',
          badCode: `found = False
for x in [1, 3, 5]:
    if x % 2 == 0:
        found = True
        break
if not found:
    print("No even numbers")`,
          goodCode: `for x in [1, 3, 5]:
    if x % 2 == 0:
        print("Found even:", x)
        break
else:
    # Executes ONLY if loop finishes WITHOUT encountering a break!
    print("No even numbers found in sequence")`,
          explanation:
            'A loop `else` block only runs if the loop exited naturally without hitting a `break` statement. Think of it as "nobreak".',
        },
      },
      {
        id: '1-3',
        title: 'Functions, Parameters & LEGB Scope',
        summary: 'Writing modular code with positional, keyword, *args, **kwargs, and lexical scope.',
        concepts: [
          'Function definitions, return tuples, and docstrings',
          '*args (variable positional) and **kwargs (variable keyword arguments)',
          'Keyword-only parameters using bare asterisk (*, key_arg)',
          'LEGB rule: Local -> Enclosing -> Global -> Built-in variable resolution',
        ],
        codeSnippets: [
          {
            title: 'Flexible Argument Unpacking (*args, **kwargs)',
            description: 'Crafting expressive signatures for extensible utility functions.',
            code: `def build_query(table: str, *columns, **filters):
    cols = ", ".join(columns) if columns else "*"
    conditions = [f"{k}='{v}'" for k, v in filters.items()]
    where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""
    return f"SELECT {cols} FROM {table}{where_clause};"

query = build_query("users", "id", "email", status="active", role="admin")
print("Generated SQL:", query)`,
            explanation:
              '*columns collects extra positional arguments into a tuple; **filters collects keyword arguments into a dictionary.',
          },
        ],
        gotcha: {
          title: 'The Mutable Default Argument Trap',
          badCode: `def append_to(element, target_list=[]):  # ❌ DANGEROUS!
    target_list.append(element)
    return target_list

print(append_to("a"))  # ['a']
print(append_to("b"))  # ['a', 'b'] - shared across calls!`,
          goodCode: `def append_to(element, target_list=None):  # ✅ IDIOMATIC
    if target_list is None:
        target_list = []
    target_list.append(element)
    return target_list

print(append_to("a"))  # ['a']
print(append_to("b"))  # ['b'] - clean fresh list`,
          explanation:
            'Default arguments are evaluated once when the function is defined (at module load time), NOT each time the function is invoked. Never use mutable defaults.',
        },
      },
    ],
    quizzes: [
      {
        id: 'q1-1',
        question: 'What is the output of bool([]) and bool([0]) in Python?',
        options: [
          { text: 'True and True', explanation: 'Empty collections are falsy in Python.' },
          { text: 'False and False', explanation: '[0] is a non-empty list containing one integer, which is truthy.' },
          { text: 'False and True', explanation: 'Correct! [] is empty (falsy), while [0] has length 1 (truthy), even though 0 itself is falsy.' },
          { text: 'None and False', explanation: 'bool() always returns a boolean True or False.' },
        ],
        correctIndex: 2,
      },
      {
        id: 'q1-2',
        question: 'When does the "else" clause of a Python for loop execute?',
        options: [
          { text: 'When the loop condition is False at the start', explanation: 'That applies to while loops only.' },
          { text: 'Only when the loop encounters a break statement', explanation: 'A break skips the else clause completely.' },
          { text: 'Only if the loop completes without hitting a break', explanation: 'Correct! The else block executes when the iterable is exhausted without an early break.' },
          { text: 'At every iteration of the loop', explanation: 'No, it executes once after the loop terminates.' },
        ],
        correctIndex: 2,
      },
    ],
    challenge: {
      id: 'ch1',
      title: 'Word Frequency Normalizer',
      difficulty: 'Easy',
      description:
        'Write a function `count_words(sentence: str)` that takes a sentence, strips punctuation, normalizes case, and returns a dictionary with each unique word and its count.',
      starterCode: `def count_words(sentence: str) -> dict:
    # Your implementation here
    # 1. Lowercase the sentence
    # 2. Split words and clean punctuation
    # 3. Count frequencies
    pass

# Test your code:
sample = "Python is great, python is fast, and Python is clean!"
print(count_words(sample))`,
      solutionCode: `def count_words(sentence: str) -> dict:
    cleaned = "".join(c.lower() if c.isalnum() or c.isspace() else " " for c in sentence)
    words = cleaned.split()
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    return counts

sample = "Python is great, python is fast, and Python is clean!"
print(count_words(sample))`,
      hints: [
        'Use str.lower() to normalize casing.',
        'Use dict.get(key, 0) + 1 to tally occurrences without throwing KeyError.',
      ],
      testCases: [
        { input: 'Hello hello world', expected: '{"hello": 2, "world": 1}' },
        { input: 'Data data data', expected: '{"data": 3}' },
      ],
    },
    project: {
      title: 'CLI Task & Expense Tracker',
      subtitle: 'Pure Python Command-Line Automation Tool',
      difficulty: 'Beginner',
      timeEstimate: '4-6 hours',
      description:
        'Build a command-line expense tracker that records daily transactions with date, category, and amount, persists to a local JSON file, and prints monthly summaries with budget thresholds.',
      architecture: [
        'CLI parsing loop with menu choices (Add, View, Summary, Exit)',
        'Data validation module verifying numeric inputs and valid dates',
        'Persistence layer reading and writing JSON records',
        'Tabular formatted text printer using f-string alignment (:>10, :<15)',
      ],
      skillsLearned: [
        'Interactive input handling with while loops and try/except',
        'Dictionary record schemas and list operations',
        'File I/O with JSON serialization',
        'Formatting monetary values with f"{amount:,.2f}"',
      ],
      starterCode: `import json

DATA_FILE = "expenses.json"

def add_expense(category: str, amount: float, note: str = ""):
    entry = {"category": category, "amount": amount, "note": note}
    # Load existing and append
    print(f"Added expense: {category} -> $\${amount:.2f}")

def calculate_summary(expenses):
    totals = {}
    for exp in expenses:
        totals[exp["category"]] = totals.get(exp["category"], 0.0) + exp["amount"]
    return totals`,
    },
  },
  {
    id: 2,
    stageNumber: '02',
    title: 'Data Structures & Idiomatic Python',
    tagline: 'Mastering Lists, Dicts, Sets, Slicing & File I/O',
    level: 'Elementary',
    durationHours: '30-40 hrs',
    prerequisites: ['Stage 01 Foundations', 'Functions and basic control flow'],
    summary:
      'Harness Python’s rich built-in data structures. Master list slicing, comprehension syntax, hash-map complexity, sets, tuples, and safe file context managers.',
    mentalModel:
      'Idiomatic Python ("Pythonic" code) relies on vector-like comprehensions, hash lookups ($O(1)$ for dicts and sets), and protocol iterables rather than manual index-shifting algorithms.',
    topics: [
      {
        id: '2-1',
        title: 'Lists, Slicing & Comprehensions',
        summary: 'Deep dive into Python list memory buffers, slice notation [start:stop:step], and expressions.',
        concepts: [
          'Memory structure: lists are over-allocated arrays of contiguous object pointers',
          'Slicing nuances: lst[::-1] for reverse, lst[1:4], and shallow copy via lst[:]',
          'List comprehensions vs map/filter: cleaner syntax, zero function-call overhead',
          'Nested comprehensions and conditional filtering: [x for x in data if x > 0]',
        ],
        codeSnippets: [
          {
            title: 'Slicing & Comprehension Power',
            description: 'Transforming collections with idiomatic list comprehensions.',
            code: `raw_data = ["  alpha ", "BETA", "  gamma  ", "DELTA", "epsilon"]

# Clean, uppercase, and filter words longer than 4 chars in one line
processed = [word.strip().upper() for word in raw_data if len(word.strip()) > 4]
print("Processed:", processed)

# Pythonic reversal and step slicing
numbers = list(range(10))
print("Evens only:", numbers[::2])
print("Reversed:", numbers[::-1])`,
            explanation:
              'Comprehensions execute at C speed inside CPython without the runtime bytecode overhead of repeated .append() lookups.',
          },
        ],
        gotcha: {
          title: 'Creating Nested Lists with Multiplication',
          badCode: `grid = [[0] * 3] * 3  # ❌ TRAP!
grid[0][0] = 99
print(grid)  # [[99, 0, 0], [99, 0, 0], [99, 0, 0]]
# All rows point to the exact same list object in memory!`,
          goodCode: `grid = [[0] * 3 for _ in range(3)]  # ✅ CORRECT
grid[0][0] = 99
print(grid)  # [[99, 0, 0], [0, 0, 0], [0, 0, 0]]
# Each inner list is instantiated independently!`,
          explanation:
            '`[x] * 3` does not copy `x`; it duplicates references to the single original `x`. With mutable objects, always use a comprehension.',
        },
      },
      {
        id: '2-2',
        title: 'Dictionaries, Sets & Hashability',
        summary: 'Understand hash tables, key immutability, set algebra, and dictionary merging.',
        concepts: [
          'Dict keys must be hashable: immutable types (int, str, tuple of immutables)',
          'O(1) average-time complexity for lookups, insertions, and deletions',
          'Set algebra: union (|), intersection (&), difference (-), symmetric difference (^)',
          'Dictionary merge operators: d1 | d2 and inplace d1 |= d2 (Python 3.9+)',
        ],
        codeSnippets: [
          {
            title: 'Set Algebra & Fast Lookups',
            description: 'Solving collection comparison problems with mathematical set operators.',
            code: `engineering_team = {"Alice", "Bob", "Charlie", "Diana"}
qa_team = {"Bob", "Diana", "Evan", "Fiona"}

# Set operations
print("Both Eng & QA (Intersection):", engineering_team & qa_team)
print("Only in Engineering (Difference):", engineering_team - qa_team)
print("All unique members (Union):", engineering_team | qa_team)

# Modern dictionary merge (Python 3.9+)
defaults = {"theme": "dark", "notifications": True, "limit": 50}
user_settings = {"theme": "light", "limit": 100}
config = defaults | user_settings  # user_settings takes precedence
print("Merged Config:", config)`,
            explanation:
              'Lookups in sets and dict keys use hashing, making them orders of magnitude faster than `item in list` when dealing with thousands of records.',
          },
        ],
        gotcha: {
          title: 'Modifying a Dict / Set During Iteration',
          badCode: `users = {"Alice": 25, "Bob": 17, "Charlie": 15}
for name, age in users.items():
    if age < 18:
        del users[name]  # ❌ RuntimeError: dictionary changed size during iteration`,
          goodCode: `users = {"Alice": 25, "Bob": 17, "Charlie": 15}
# Filter into new dict via comprehension
adults = {name: age for name, age in users.items() if age >= 18}
print(adults)  # {'Alice': 25}`,
          explanation:
            'CPython protects dictionary hash table iteration against mutation to prevent undefined states. Create a new dictionary or iterate over `list(users.keys())`.',
        },
      },
      {
        id: '2-3',
        title: 'File I/O, Context Managers & JSON/CSV',
        summary: 'Safe resource handling using the with statement and standard file serialization.',
        concepts: [
          'The with statement: automated resource cleanup via __enter__ and __exit__',
          'Reading modes: "r", "w", "a", and binary modes "rb", "wb"',
          'Streaming large files line by line to preserve memory',
          'Handling structured data with json and csv standard libraries',
        ],
        codeSnippets: [
          {
            title: 'Streaming & Context Managers',
            description: 'Safe file parsing without reading entire files into RAM.',
            code: `import json

payload = {
    "project": "PythonPath",
    "stages": 6,
    "features": ["Runner", "Roadmap", "Memory Visualizer"]
}

# Serialize with clean indentation
json_str = json.dumps(payload, indent=2)
print("Serialized JSON:\\n" + json_str)

# In real code: with open("data.json", "w", encoding="utf-8") as f:
#     f.write(json_str)`,
            explanation:
              'Always specify `encoding="utf-8"` when reading or writing text files to avoid platform-dependent locale discrepancies.',
          },
        ],
      },
    ],
    quizzes: [
      {
        id: 'q2-1',
        question: 'Which of the following types CANNOT be used as a dictionary key in Python?',
        options: [
          { text: 'A string "user_id"', explanation: 'Strings are immutable and hashable.' },
          { text: 'A tuple of ints (1, 2, 3)', explanation: 'Tuples of immutable items are hashable.' },
          { text: 'A list of ints [1, 2, 3]', explanation: 'Correct! Lists are mutable and do not implement __hash__; using them as dict keys raises TypeError: unhashable type: "list".' },
          { text: 'An integer 42', explanation: 'Integers are hashable.' },
        ],
        correctIndex: 2,
      },
      {
        id: 'q2-2',
        question: 'What is the time complexity of checking `x in my_set` vs `x in my_list`?',
        options: [
          { text: 'Both are O(n)', explanation: 'Sets use hash tables, not linear scans.' },
          { text: 'Set is O(1) average, List is O(n)', explanation: 'Correct! Sets check hashes in constant time, while lists must compare every element sequentially.' },
          { text: 'Set is O(n), List is O(1)', explanation: 'Lists require linear scanning for containment.' },
          { text: 'Both are O(1)', explanation: 'List containment requires scanning up to all N elements.' },
        ],
        correctIndex: 1,
      },
    ],
    challenge: {
      id: 'ch2',
      title: 'Matrix Transposition with Comprehensions',
      difficulty: 'Medium',
      description:
        'Write a function `transpose(matrix)` that takes a 2D list (M x N) and returns its transpose (N x M) using a single nested list comprehension or zip.',
      starterCode: `def transpose(matrix: list[list[int]]) -> list[list[int]]:
    # Write a clean transpose using list comprehension or zip
    pass

grid = [
    [1, 2, 3],
    [4, 5, 6]
]
print(transpose(grid))
# Expected: [[1, 4], [2, 5], [3, 6]]`,
      solutionCode: `def transpose(matrix: list[list[int]]) -> list[list[int]]:
    return [list(col) for col in zip(*matrix)]

grid = [
    [1, 2, 3],
    [4, 5, 6]
]
print(transpose(grid))`,
      hints: [
        'Unpack the rows into zip with zip(*matrix)',
        'Convert each yielded tuple back into a list.',
      ],
      testCases: [
        { input: '[[1, 2], [3, 4]]', expected: '[[1, 3], [2, 4]]' },
        { input: '[[1, 2, 3]]', expected: '[[1], [2], [3]]' },
      ],
    },
    project: {
      title: 'Log File Analyzer & Security Audit Parser',
      subtitle: 'Streaming Log Parser & Metric Aggregator',
      difficulty: 'Intermediate',
      timeEstimate: '6-8 hours',
      description:
        'Build a high-performance log analyzer that parses Nginx or server access logs, identifies high-frequency IP addresses, flags suspicious 4xx/5xx spikes, and writes summary reports in JSON and Markdown.',
      architecture: [
        'Generator-based log line reader (memory constant O(1))',
        'Regex pattern matching HTTP status, IP address, and response latency',
        'Collections Counter for frequency analytics',
        'Markdown and JSON reporter modules',
      ],
      skillsLearned: [
        'Stream processing without loading multi-gigabyte logs into memory',
        'Dictionary and set grouping patterns',
        'Handling corrupted log lines gracefully with try/except',
      ],
      starterCode: `from collections import Counter
import re

LOG_PATTERN = re.compile(r'(\d+\.\d+\.\d+\.\d+) - - \[(.*?)\] "(\w+) (.*?) HTTP.*" (\d+) (\d+)')

def analyze_logs(lines):
    ip_counter = Counter()
    status_counter = Counter()
    for line in lines:
        match = LOG_PATTERN.match(line)
        if match:
            ip, timestamp, method, path, status, bytes_sent = match.groups()
            ip_counter[ip] += 1
            status_counter[int(status)] += 1
    return ip_counter, status_counter`,
    },
  },
  {
    id: 3,
    stageNumber: '03',
    title: 'Object-Oriented & Functional Python',
    tagline: 'Classes, Dunder Protocols & Clean Architecture',
    level: 'Intermediate',
    durationHours: '40-50 hrs',
    prerequisites: ['Stage 02 Data Structures', 'Understanding references and dictionaries'],
    summary:
      'Elevate from procedural scripting to robust software design. Learn class mechanics, inheritance, Method Resolution Order (MRO), dunder methods, properties, and functional primitives.',
    mentalModel:
      'In Python, classes are also objects! Dunder methods (__len__, __getitem__, __iter__) allow custom classes to hook directly into Python language operators and standard protocols.',
    topics: [
      {
        id: '3-1',
        title: 'Classes, Self & The Object Lifecycle',
        summary: 'Demystifying __init__, self parameter, instance vs class variables, and methods.',
        concepts: [
          'What self really is: an explicit pointer to the instance passed as the first argument',
          'Instance attributes (self.name) vs class attributes (User.count)',
          '@classmethod (receives cls) vs @staticmethod (isolated pure helper)',
          'Data encapsulation: naming conventions (_protected, __mangled)',
        ],
        codeSnippets: [
          {
            title: 'Class vs Instance Mechanics & Factory Methods',
            description: 'Building clean domain models with alternative constructors.',
            code: `class BankAccount:
    bank_name = "Global Reserve Bank"  # Class attribute
    _account_counter = 1000

    def __init__(self, owner: str, initial_balance: float = 0.0):
        BankAccount._account_counter += 1
        self.account_id = BankAccount._account_counter
        self.owner = owner
        self._balance = initial_balance  # Encapsulated attribute

    @classmethod
    def create_savings(cls, owner: str):
        # Alternative constructor / factory method
        return cls(owner, initial_balance=500.0)

    @property
    def balance(self) -> float:
        return self._balance

    def deposit(self, amount: float):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self._balance += amount
        print(f"Deposited $\${amount:.2f} for {self.owner}. New balance: $\${self._balance:.2f}")

acc = BankAccount.create_savings("Alice")
acc.deposit(250.0)`,
            explanation:
              '@classmethod lets you create alternative factory constructors that correctly instantiate subclasses if inherited.',
          },
        ],
        gotcha: {
          title: 'Class Attribute Mutation Trap',
          badCode: `class Dog:
    tricks = []  # ❌ Class-level mutable shared across all instances!
    def __init__(self, name):
        self.name = name

d1 = Dog("Fido")
d2 = Dog("Buddy")
d1.tricks.append("roll over")
print(d2.tricks)  # ['roll over'] - Buddy now has Fido's trick!`,
          goodCode: `class Dog:
    def __init__(self, name):
        self.name = name
        self.tricks = []  # ✅ Instance-level attribute unique to each Dog

d1 = Dog("Fido")
d2 = Dog("Buddy")
d1.tricks.append("roll over")
print(d2.tricks)  # [] - Buddy has no tricks!`,
          explanation:
            'Attributes declared directly in the class body belong to the class object, not individual instances. Initialize mutable collections inside `__init__`.',
        },
      },
      {
        id: '3-2',
        title: 'The Dunder Protocol (Magic Methods)',
        summary: 'Empower custom objects with Python syntax: len(), str(), iteration, and subscripting.',
        concepts: [
          'Representation: __str__ (human-readable) vs __repr__ (unambiguous developer debug view)',
          'Sequence protocol: __len__ and __getitem__ make your object indexable and sliceable',
          'Context manager protocol: __enter__ and __exit__',
          'Callable objects: __call__ turns any instance into a callable function',
        ],
        codeSnippets: [
          {
            title: 'Custom Vector Class with Dunder Operators',
            description: 'Overloading + operator and string representation.',
            code: `class Vector2D:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __repr__(self) -> str:
        # Developer representation: Vector2D(x=3, y=4)
        return f"Vector2D(x={self.x}, y={self.y})"

    def __add__(self, other: "Vector2D") -> "Vector2D":
        if not isinstance(other, Vector2D):
            return NotImplemented
        return Vector2D(self.x + other.x, self.y + other.y)

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Vector2D):
            return False
        return self.x == other.x and self.y == other.y

v1 = Vector2D(3, 4)
v2 = Vector2D(1, 2)
v3 = v1 + v2
print("Vector addition result:", v3)
print("Equality check:", v3 == Vector2D(4, 6))`,
            explanation:
              'Implementing `__repr__` and `__add__` integrates your domain types directly into Python’s built-in expression syntax.',
          },
        ],
      },
      {
        id: '3-3',
        title: 'Inheritance, super() & Method Resolution Order (MRO)',
        summary: 'Master single and multiple inheritance, cooperative super(), and C3 linearization.',
        concepts: [
          'Inheritance and polymorphic method overriding',
          'super(): cooperative inheritance resolving next class along MRO',
          'MRO inspection via Class.__mro__ or Class.mro()',
          'Composition over inheritance: when to prefer "has-a" over "is-a"',
        ],
        codeSnippets: [
          {
            title: 'Inspecting C3 MRO in Multiple Inheritance',
            description: 'See how Python resolves method calls without the Diamond Problem.',
            code: `class A:
    def identify(self):
        print("Class A")

class B(A):
    def identify(self):
        print("Class B ->", end=" ")
        super().identify()

class C(A):
    def identify(self):
        print("Class C ->", end=" ")
        super().identify()

class D(B, C):
    def identify(self):
        print("Class D ->", end=" ")
        super().identify()

d = D()
d.identify()
print("\\nMethod Resolution Order (MRO):", [cls.__name__ for cls in D.__mro__])`,
            explanation:
              'Python uses C3 Linearization to guarantee that every class appears only once in the search chain and subclasses precede their parents.',
          },
        ],
      },
    ],
    quizzes: [
      {
        id: 'q3-1',
        question: 'What is the primary difference between __repr__ and __str__?',
        options: [
          { text: '__str__ is for Python internal use; __repr__ is for users', explanation: 'It is the opposite.' },
          { text: '__str__ should be user-readable; __repr__ should be unambiguous and helpful for debugging', explanation: 'Correct! An ideal __repr__ looks like valid Python code to recreate the object (e.g., Vector2D(x=3, y=4)).' },
          { text: 'They are completely interchangeable aliases', explanation: 'Python falls back to __repr__ if __str__ is missing, but they serve different goals.' },
          { text: '__repr__ is only called when an exception is raised', explanation: 'No, __repr__ is called in interactive REPLs and when repr(obj) is used.' },
        ],
        correctIndex: 1,
      },
    ],
    challenge: {
      id: 'ch3',
      title: 'Build a Smart Cache with Context Manager',
      difficulty: 'Medium',
      description:
        'Create a class `TimerContext` that implements `__enter__` and `__exit__`. In `__enter__` it records start time; in `__exit__` it calculates elapsed time and stores it in `self.elapsed`.',
      starterCode: `import time

class TimerContext:
    def __init__(self, task_name: str):
        self.task_name = task_name
        self.elapsed = 0.0

    def __enter__(self):
        # Record start time
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # Calculate elapsed time and print summary
        pass

# Usage:
with TimerContext("Matrix computation") as timer:
    total = sum(i * i for i in range(100000))
print(f"Recorded elapsed: {timer.elapsed:.4f}s")`,
      solutionCode: `import time

class TimerContext:
    def __init__(self, task_name: str):
        self.task_name = task_name
        self.elapsed = 0.0
        self._start = 0.0

    def __enter__(self):
        self._start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.elapsed = time.perf_counter() - self._start
        print(f"[{self.task_name}] took {self.elapsed:.5f}s")
        return False  # Do not suppress exceptions

with TimerContext("Calculation") as timer:
    total = sum(i * i for i in range(50000))`,
      hints: [
        'Use time.perf_counter() for high-resolution timing.',
        'Returning False from __exit__ ensures any unexpected errors are propagated.',
      ],
      testCases: [
        { input: 'TimerContext("Test")', expected: 'Records non-negative elapsed duration' },
      ],
    },
    project: {
      title: 'Lightweight In-Memory Key-Value Store & ORM',
      subtitle: 'Custom Dict Subclass with Validation and Indexes',
      difficulty: 'Intermediate',
      timeEstimate: '8-12 hours',
      description:
        'Design a mini-ORM with declarative models (fields like CharField, IntegerField), automated type validation, query methods (.filter(), .all()), and secondary indexing.',
      architecture: [
        'Descriptor protocol (__get__, __set__) for typed fields',
        'Model base class tracking schema definitions',
        'In-memory storage engine with hash-based indexes for fast lookup',
      ],
      skillsLearned: [
        'Python Descriptors and metaprogramming',
        'Magic methods for model comparisons',
        'Domain-Driven Design (DDD) principles in Python',
      ],
      starterCode: `class Field:
    def __init__(self, field_type):
        self.field_type = field_type
        self.name = None

    def __set_name__(self, owner, name):
        self.name = name

    def __set__(self, instance, value):
        if not isinstance(value, self.field_type):
            raise TypeError(f"Expected {self.field_type.__name__}, got {type(value).__name__}")
        instance.__dict__[self.name] = value

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return instance.__dict__.get(self.name)`,
    },
  },
  {
    id: 4,
    stageNumber: '04',
    title: 'Advanced Python & Under-The-Hood Mechanics',
    tagline: 'Decorators, Generators, Asyncio & CPython Internals',
    level: 'Advanced',
    durationHours: '50-65 hrs',
    prerequisites: ['Stage 03 OOP', 'Solid grasp of closures and functions as first-class citizens'],
    summary:
      'Uncover how Python actually works under the hood. Master closures, decorators with arguments, generator streaming, asyncio event loops, and CPython memory allocation.',
    mentalModel:
      'Python functions are first-class objects with closure scopes (__closure__). Generators produce lazy streams using coroutine state suspension. Asyncio multiplexes I/O on a single thread event loop.',
    topics: [
      {
        id: '4-1',
        title: 'Closures & Decorators with functools.wraps',
        summary: 'Metaprogramming functions: wrapping behavior, preserving docstrings, and parameterized decorators.',
        concepts: [
          'Lexical closures: functions retaining variables from enclosing scope',
          'Decorator mechanics: syntactic sugar @decorator is func = decorator(func)',
          'Why functools.wraps is mandatory: preserves __name__, __doc__, and __annotations__',
          'Three-tier closures: creating decorators that accept arguments @repeat(num=3)',
        ],
        codeSnippets: [
          {
            title: 'Production Timing & Retry Decorator',
            description: 'Building robust decorator with arguments and metadata preservation.',
            code: `import functools
import time

def timing_decorator(threshold_ms: float = 0.0):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            result = func(*args, **kwargs)
            duration_ms = (time.perf_counter() - start) * 1000
            if duration_ms >= threshold_ms:
                print(f"[LATENCY] {func.__name__} executed in {duration_ms:.2f}ms")
            return result
        return wrapper
    return decorator

@timing_decorator(threshold_ms=1.0)
def process_data(n: int) -> int:
    """Computes sum of squares."""
    return sum(i * i for i in range(n))

res = process_data(100000)
print(f"Result: {res}, Function Name: {process_data.__name__}")`,
            explanation:
              'Without `@functools.wraps`, debugging tools and docs would report the function name as "wrapper" instead of "process_data".',
          },
        ],
        gotcha: {
          title: 'Late Binding Closures in Loops',
          badCode: `multipliers = [lambda x: x * i for i in range(4)]
print([m(2) for m in multipliers])
# ❌ Prints [6, 6, 6, 6]!
# All lambdas lookup 'i' at CALL time, when i has finished at 3!`,
          goodCode: `multipliers = [lambda x, i=i: x * i for i in range(4)]
print([m(2) for m in multipliers])
# ✅ Prints [0, 2, 4, 6]
# i=i binds the current value of i to default argument at DEFINITION time!`,
          explanation:
            'Python closures bind variables by reference name, not by value. Binding `i=i` in default args captures current value.',
        },
      },
      {
        id: '4-2',
        title: 'Generators, Iterators & Memory Efficiency',
        summary: 'Stream infinite datasets and massive files with yield and generator expressions.',
        concepts: [
          'Iterator protocol: __iter__() returns self, and __next__() raises StopIteration',
          'The yield statement: state suspension and resumption in the generator stack frame',
          'Memory comparison: list comprehension (stores all in RAM) vs generator expression ()',
          'Two-way communication: generator.send(), .throw(), and yield from',
        ],
        codeSnippets: [
          {
            title: 'Streaming Prime Number Generator',
            description: 'Infinite lazy stream generating values on demand with O(1) memory.',
            code: `def prime_generator():
    """Generates an infinite stream of prime numbers lazily."""
    yield 2
    primes = [2]
    candidate = 3
    while True:
        is_prime = True
        for p in primes:
            if p * p > candidate:
                break
            if candidate % p == 0:
                is_prime = False
                break
        if is_prime:
            primes.append(candidate)
            yield candidate
        candidate += 2

gen = prime_generator()
first_six = [next(gen) for _ in range(6)]
print("First 6 primes from lazy generator:", first_six)`,
            explanation:
              'Generators retain execution state (instruction pointer and local frame) across calls to `next()`, allowing infinite streams without memory exhaustion.',
          },
        ],
      },
      {
        id: '4-3',
        title: 'Asynchronous Programming with Asyncio & The GIL',
        summary: 'Non-blocking concurrent I/O, event loops, async/await, and Global Interpreter Lock nuances.',
        concepts: [
          'The Global Interpreter Lock (GIL): prevents multiple native threads from executing CPython bytecode simultaneously',
          'When to use what: Asyncio / Threading for I/O-bound tasks; Multiprocessing for CPU-bound tasks',
          'async def / await: cooperative multitasking yielding control back to the event loop',
          'asyncio.gather() for concurrent task coordination',
        ],
        codeSnippets: [
          {
            title: 'Concurrent Asyncio Task Gathering',
            description: 'Simulating concurrent network fetch operations.',
            code: `import asyncio

async def fetch_api_endpoint(name: str, delay: float):
    print(f"Fetching {name}...")
    await asyncio.sleep(delay)  # Yields control back to event loop
    return {"endpoint": name, "status": 200}

async def main():
    # Run multiple async operations concurrently
    results = await asyncio.gather(
        fetch_api_endpoint("users", 0.05),
        fetch_api_endpoint("inventory", 0.08),
        fetch_api_endpoint("orders", 0.03)
    )
    print("All tasks finished concurrently:")
    for r in results:
        print(" -", r)

# In real Python script: asyncio.run(main())
print("Asyncio pattern ready for high-concurrency microservices!")`,
            explanation:
              'While one task awaits I/O (`await asyncio.sleep()`), the event loop instantly runs other scheduled tasks on the same thread without OS context switch overhead.',
          },
        ],
      },
      {
        id: '4-4',
        title: 'CPython Memory Management & Garbage Collection',
        summary: 'Reference counting, cyclic GC (gc module), PyObject structure, and weak references.',
        concepts: [
          'Every Python object is a PyObject C struct containing ob_refcnt and ob_type',
          'sys.getrefcount(): tracking references pointing to a heap object',
          'Cyclic reference problem: why reference counting alone fails when objects point to each other',
          'Generational Garbage Collector: Gen 0, Gen 1, Gen 2 generational GC algorithms',
        ],
        codeSnippets: [
          {
            title: 'Inspecting CPython Reference Counts',
            description: 'Observing how Python tracks object lifespan.',
            code: `import sys

# Small integers and interned strings share singleton allocations
x = [1, 2, 3, 4]
print("Initial ref count:", sys.getrefcount(x))  # Note: getrefcount adds 1 temporary reference

y = x  # New reference
print("After y = x:", sys.getrefcount(x))

del y  # Dereferenced
print("After del y:", sys.getrefcount(x))`,
            explanation:
              'When `ob_refcnt` drops to zero, CPython immediately deallocates the memory without waiting for garbage collection cycles.',
          },
        ],
      },
    ],
    quizzes: [
      {
        id: 'q4-1',
        question: 'Why does CPython have a Global Interpreter Lock (GIL)?',
        options: [
          { text: 'To prevent users from writing asynchronous code', explanation: 'Asyncio works within the single thread model.' },
          { text: 'To ensure thread safety for CPython memory management and reference counting', explanation: 'Correct! The GIL ensures that internal PyObject reference count increments/decrements do not suffer race conditions.' },
          { text: 'To make Python run faster on multi-core CPUs', explanation: 'The GIL actually prevents parallel CPU-bound execution on native threads.' },
          { text: 'To restrict Python to running only on single-core hardware', explanation: 'Python can use multiprocessing to scale across all CPU cores.' },
        ],
        correctIndex: 1,
      },
    ],
    challenge: {
      id: 'ch4',
      title: 'Rate-Limiting Token Bucket Decorator',
      difficulty: 'Hard',
      description:
        'Implement a decorator `@rate_limit(max_calls=3, period_sec=1.0)` that raises a `RuntimeError("Rate limit exceeded")` if the wrapped function is called more than `max_calls` within the rolling `period_sec` window.',
      starterCode: `import time
from functools import wraps

def rate_limit(max_calls: int, period_sec: float):
    # Maintain timestamps of past calls
    # Filter calls older than period_sec
    pass

@rate_limit(max_calls=2, period_sec=0.5)
def ping():
    return "pong"

print(ping())
print(ping())
# Third call immediately should raise RuntimeError`,
      solutionCode: `import time
from functools import wraps

def rate_limit(max_calls: int, period_sec: float):
    def decorator(func):
        calls = []

        @wraps(func)
        def wrapper(*args, **kwargs):
            nonlocal calls
            now = time.time()
            # Retain only timestamps within the rolling window
            calls = [t for t in calls if now - t < period_sec]
            if len(calls) >= max_calls:
                raise RuntimeError("Rate limit exceeded")
            calls.append(now)
            return func(*args, **kwargs)

        return wrapper
    return decorator

@rate_limit(max_calls=2, period_sec=0.5)
def ping():
    return "pong"

print(ping())
print(ping())`,
      hints: [
        'Use the `nonlocal` keyword to modify the `calls` list inside the inner closure wrapper.',
        'Filter timestamps using list comprehension `[t for t in calls if now - t < period_sec]`.',
      ],
      testCases: [
        { input: '2 calls within window', expected: 'Executes successfully' },
        { input: '3rd call within window', expected: 'Raises RuntimeError' },
      ],
    },
    project: {
      title: 'Async Concurrent Web Crawler & Link Grapher',
      subtitle: 'Non-Blocking Crawler with Domain Politeness & Semaphore',
      difficulty: 'Advanced',
      timeEstimate: '10-15 hours',
      description:
        'Build a production-grade async web crawler using asyncio.Queue, asyncio.Semaphore (limiting concurrency to 5 concurrent sockets), deduplicating URLs via MurmurHash/MD5, and compiling a graph of internal site links.',
      architecture: [
        'Worker pool pattern using asyncio.Queue for URL scheduling',
        'asyncio.Semaphore rate-limiting requests per domain to respect robots.txt',
        'In-memory bloom filter / visited set avoiding cycle traps',
        'JSON graph exporter producing node-and-edge network topology',
      ],
      skillsLearned: [
        'Advanced asyncio coroutine patterns and task cancellation',
        'Producer-Consumer pipeline with graceful shutdown',
        'Handling timeout exceptions and network failures cleanly',
      ],
      starterCode: `import asyncio

class AsyncCrawler:
    def __init__(self, start_url: str, max_depth: int = 2, max_concurrency: int = 5):
        self.start_url = start_url
        self.max_depth = max_depth
        self.semaphore = asyncio.Semaphore(max_concurrency)
        self.visited = set()
        self.queue = asyncio.Queue()

    async def worker(self):
        while True:
            url, depth = await self.queue.get()
            if depth <= self.max_depth and url not in self.visited:
                self.visited.add(url)
                async with self.semaphore:
                    print(f"Crawling: {url} at depth {depth}")
            self.queue.task_done()`,
    },
  },
  {
    id: 5,
    stageNumber: '05',
    title: 'Modern Tooling, Packaging & Best Practices',
    tagline: 'Type Systems, Pytest, UV/Poetry & Design Patterns',
    level: 'Mastery',
    durationHours: '35-45 hrs',
    prerequisites: ['Stage 04 Advanced Python', 'Software architecture familiarity'],
    summary:
      'Transform code into production-grade, maintainable engineering assets. Master static typing with Mypy, test-driven development with Pytest fixtures, packaging with pyproject.toml, and design patterns.',
    mentalModel:
      'Professional Python development relies on static type guarantees, automated test suites with parameterized test fixtures, deterministic lockfiles (uv/poetry), and strict linting (Ruff).',
    topics: [
      {
        id: '5-1',
        title: 'Static Typing & The typing Module',
        summary: 'Pydantic models, TypeVar, Protocol, Generic, Union, and runtime type inspection.',
        concepts: [
          'Type annotations: primitives, Optional[T], Union[A, B], and modern A | B syntax (PEP 604)',
          'Structural subtyping with typing.Protocol (duck typing validated statically)',
          'Generic types: TypeVar("T"), Sequence[T], Mapping[K, V]',
          'TypedDict and Pydantic for data contract boundaries and API deserialization',
        ],
        codeSnippets: [
          {
            title: 'Protocols (Static Duck Typing)',
            description: 'Validating interface capabilities without inheritance coupling.',
            code: `from typing import Protocol

class Renderable(Protocol):
    """Any object with a render() method satisfies this protocol."""
    def render(self) -> str:
        ...

class MarkdownDoc:
    def render(self) -> str:
        return "# Markdown Title"

class HtmlDoc:
    def render(self) -> str:
        return "<h1>HTML Title</h1>"

def publish(document: Renderable):
    print("Publishing:", document.render())

publish(MarkdownDoc())
publish(HtmlDoc())`,
            explanation:
              'Unlike ABCs (Abstract Base Classes), `Protocol` does not require explicit subclassing. Any class with matching signatures passes static type checking.',
          },
        ],
      },
      {
        id: '5-2',
        title: 'Modern Testing with Pytest & Fixtures',
        summary: 'Write elegant, robust unit and integration tests with zero boilerplate.',
        concepts: [
          'Pytest conventions: test_*.py, simple assert statements with smart introspection',
          'Fixtures with @pytest.fixture: modular setup, teardown (yield), and scope management',
          'Parametrized tests with @pytest.mark.parametrize',
          'Mocking external APIs and databases with monkeypatch and unittest.mock',
        ],
        codeSnippets: [
          {
            title: 'Pytest Fixtures & Parametrization Pattern',
            description: 'Clean testing architecture with dependency injection.',
            code: `# In test_pricing.py
# import pytest

def calculate_discount(price: float, tier: str) -> float:
    discounts = {"bronze": 0.05, "silver": 0.10, "gold": 0.20}
    return price * (1.0 - discounts.get(tier.lower(), 0.0))

# Demonstration of test matrix:
test_cases = [
    (100.0, "bronze", 95.0),
    (100.0, "silver", 90.0),
    (100.0, "gold", 80.0),
    (100.0, "guest", 100.0),
]

for price, tier, expected in test_cases:
    actual = calculate_discount(price, tier)
    assert actual == expected, f"Failed for {tier}: got {actual}"
print("All 4 parameterized test cases passed with zero errors!")`,
            explanation:
              'Pytest fixtures replace cumbersome setUp/tearDown boilerplate with reusable dependency injection.',
          },
        ],
      },
      {
        id: '5-3',
        title: 'Modern Packaging, Virtual Envs & Ruff',
        summary: 'Say goodbye to setup.py. Master pyproject.toml, UV, Poetry, and lightning-fast Ruff.',
        concepts: [
          'PEP 517/621: pyproject.toml as the single source of truth for dependencies and metadata',
          'Virtual environment isolation: python -m venv vs modern UV (written in Rust, 10-100x faster)',
          'Deterministic dependency resolution with lockfiles (poetry.lock, uv.lock)',
          'Ruff linter and formatter: replacing Flake8, Black, isort, and Bandit with sub-millisecond execution',
        ],
        codeSnippets: [
          {
            title: 'Canonical pyproject.toml Blueprint',
            description: 'Standard declarative package configuration for modern Python libraries.',
            code: `[project]
name = "pythonpath-core"
version = "1.0.0"
description = "High-performance Python engineering toolkit"
readme = "README.md"
requires-python = ">=3.11"
dependencies = [
    "pydantic>=2.7.0",
    "httpx>=0.27.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "ruff>=0.4.0",
    "mypy>=1.10.0",
]

[tool.ruff]
line-length = 88
target-version = "py311"`,
            explanation:
              'The entire Python ecosystem has standardized on `pyproject.toml`, unifying builds, dependencies, and tool settings.',
          },
        ],
      },
    ],
    quizzes: [
      {
        id: 'q5-1',
        question: 'What is the key benefit of typing.Protocol in Python?',
        options: [
          { text: 'It enforces runtime method execution speed', explanation: 'Protocols are purely structural static analysis tools.' },
          { text: 'It enables static structural subtyping ("duck typing") without needing explicit inheritance', explanation: 'Correct! Classes do not need to inherit from the Protocol class; they only need matching method signatures.' },
          { text: 'It converts Python code directly into C bytecode', explanation: 'No, that is Cython or Mypyc.' },
          { text: 'It replaces all dictionary usage with structs', explanation: 'That is TypedDict or NamedTuple.' },
        ],
        correctIndex: 1,
      },
    ],
    challenge: {
      id: 'ch5',
      title: 'Type-Safe Generic Repository Pattern',
      difficulty: 'Medium',
      description:
        'Write a generic repository class `MemoryRepo[T]` using `TypeVar("T")` that implements methods `save(entity: T) -> None`, `get(id: str) -> T | None`, and `count() -> int`.',
      starterCode: `from typing import TypeVar, Generic, Optional

T = TypeVar("T")

class MemoryRepo(Generic[T]):
    def __init__(self):
        self._store: dict[str, T] = {}

    def save(self, entity_id: str, entity: T) -> None:
        pass

    def get(self, entity_id: str) -> Optional[T]:
        pass

    def count(self) -> int:
        pass`,
      solutionCode: `from typing import TypeVar, Generic, Optional

T = TypeVar("T")

class MemoryRepo(Generic[T]):
    def __init__(self):
        self._store: dict[str, T] = {}

    def save(self, entity_id: str, entity: T) -> None:
        self._store[entity_id] = entity

    def get(self, entity_id: str) -> Optional[T]:
        return self._store.get(entity_id)

    def count(self) -> int:
        return len(self._store)

repo = MemoryRepo[dict]()
repo.save("user_1", {"name": "Alex", "role": "admin"})
print("Retrieved:", repo.get("user_1"))
print("Total records:", repo.count())`,
      hints: [
        'Store items inside an internal dictionary self._store indexed by string key.',
      ],
      testCases: [
        { input: 'Save and get key', expected: 'Returns correct entity' },
      ],
    },
    project: {
      title: 'Production CLI Developer Tool with UV & Pytest',
      subtitle: 'Complete Published Wheel with GitHub Actions CI',
      difficulty: 'Advanced',
      timeEstimate: '8-12 hours',
      description:
        'Package an end-to-end Python CLI utility with Click or Argparse, comprehensive test coverage using Pytest and coverage reports (>90%), static type validation with Mypy, and an automated GitHub Actions CI pipeline.',
      architecture: [
        'pyproject.toml configured with entry-point [project.scripts]',
        'Modular source layout inside src/my_tool/',
        'Pytest test suite with fixture factories',
        'CI workflow running ruff check, mypy --strict, and pytest',
      ],
      skillsLearned: [
        'Modern wheel building with hatchling/flit',
        'Automated CI testing across Python 3.10, 3.11, 3.12',
        'Semantic versioning and changelog management',
      ],
      starterCode: `# src/tool/cli.py
import argparse

def main():
    parser = argparse.ArgumentParser(prog="pytool", description="Developer toolkit")
    parser.add_argument("--format", choices=["json", "yaml", "table"], default="table")
    parser.add_argument("target", help="Target filepath to inspect")
    args = parser.parse_args()
    print(f"Inspecting {args.target} with output format {args.format}")

if __name__ == "__main__":
    main()`,
    },
  },
  {
    id: 6,
    stageNumber: '06',
    title: 'Applied Specialization Tracks',
    tagline: 'Data Science, Web Engineering, Automation & Systems',
    level: 'Specialization',
    durationHours: '60-100 hrs',
    prerequisites: ['Stages 01 through 05', 'Core algorithmic and software foundations'],
    summary:
      'Bridge core Python mastery to industry-leading specializations. Choose your career path: Data Science & AI, Backend & API Engineering, Intelligent Automation & Scraping, or Systems & CLI Tooling.',
    mentalModel:
      'Python is the universal glue language. Real-world mastery is knowing how Python binds to C libraries (NumPy, PyTorch), async socket drivers (uvloop, FastAPI), or headless browsers (Playwright).',
    topics: [
      {
        id: '6-1',
        title: 'Track A: Data Science & Machine Learning',
        summary: 'Vectorized computing with NumPy, tabular analytics with Pandas, and ML pipelines.',
        concepts: [
          'NumPy ndarrays: memory strides, vectorized operations avoiding Python loop overhead',
          'Pandas DataFrames: data wrangling, grouping, joining, and missing data imputation',
          'Feature engineering and model evaluation with Scikit-Learn',
          'Deep Learning pipelines: PyTorch tensors, autograd, and GPU acceleration',
        ],
        codeSnippets: [
          {
            title: 'Vectorized NumPy vs Python Loop Performance',
            description: 'Why vectorization is 50-100x faster than standard lists.',
            code: `# Vectorized mathematical computation concept
data = [1.5, 2.8, 3.2, 4.9, 5.1]
mean = sum(data) / len(data)
variance = sum((x - mean) ** 2 for x in data) / len(data)
std_dev = variance ** 0.5

print(f"Dataset Size: {len(data)}")
print(f"Calculated Mean: {mean:.2f}")
print(f"Calculated StdDev: {std_dev:.2f}")
# In NumPy: np.mean(arr), np.std(arr) execute in compiled C vectors`,
            explanation:
              'NumPy operations bypass the CPython bytecode interpreter loop by running pre-compiled C/Fortran SIMD vector instructions.',
          },
        ],
      },
      {
        id: '6-2',
        title: 'Track B: High-Performance Backend APIs (FastAPI)',
        summary: 'Asynchronous REST APIs, Pydantic validation, dependency injection, and OpenAPI.',
        concepts: [
          'FastAPI architecture: Starlette ASGI core + Pydantic validation schemas',
          'Dependency Injection system: Depends() for authentication and database sessions',
          'Async database querying with SQLAlchemy 2.0 / SQLModel async sessions',
          'Background tasks and WebSocket real-time communication',
        ],
        codeSnippets: [
          {
            title: 'Modern FastAPI Route with Pydantic',
            description: 'Declarative API endpoint with automatic validation.',
            code: `# Canonical FastAPI declaration pattern
from dataclasses import dataclass

@dataclass
class ItemCreate:
    name: str
    price: float
    tax_rate: float = 0.08

def calculate_total(item: ItemCreate) -> float:
    total = item.price * (1 + item.tax_rate)
    return round(total, 2)

item = ItemCreate(name="Ultra Monitor", price=399.99)
print(f"Item: {item.name}")
print(f"Total with tax: $\${calculate_total(item)}")
# FastAPI automatically generates Swagger UI and OpenAPI docs!`,
            explanation:
              'FastAPI validates requests, coerces types, returns descriptive 422 error messages, and generates OpenAPI documentation automatically.',
          },
        ],
      },
      {
        id: '6-3',
        title: 'Track C: Automation, Web Scraping & Orchestration',
        summary: 'Headless browser automation with Playwright, BeautifulSoup, and scheduling.',
        concepts: [
          'Static HTML parsing with BeautifulSoup and lxml',
          'Dynamic SPA automation with Playwright / Selenium',
          'Anti-bot mitigation: header rotation, rate throttling, and residential proxies',
          'Workflow scheduling and task queues with Celery and Redis',
        ],
        codeSnippets: [
          {
            title: 'Robust Web Data Extraction Pipeline',
            description: 'Extracting and cleaning tabular data from web responses.',
            code: `raw_html_rows = [
    '<tr><td>Product A</td><td>$49.99</td><td>In Stock</td></tr>',
    '<tr><td>Product B</td><td>$129.50</td><td>Out of Stock</td></tr>',
    '<tr><td>Product C</td><td>$19.95</td><td>In Stock</td></tr>'
]

import re
parsed_inventory = []
pattern = re.compile(r'<td>(.*?)</td><td>\\$(.*?)</td><td>(.*?)</td>')

for row in raw_html_rows:
    match = pattern.search(row)
    if match:
        name, price, stock = match.groups()
        parsed_inventory.append({
            "name": name,
            "price": float(price),
            "in_stock": stock == "In Stock"
        })

print(f"Extracted {len(parsed_inventory)} clean inventory items:")
for item in parsed_inventory:
    print(" -", item)`,
            explanation:
              'Automation pipelines extract raw unstructured data, sanitize formats, and persist clean structured schemas.',
          },
        ],
      },
    ],
    quizzes: [
      {
        id: 'q6-1',
        question: 'Why are NumPy array operations significantly faster than Python list loops?',
        options: [
          { text: 'NumPy arrays store elements as contiguous blocks of identical C data types without pointer indirection', explanation: 'Correct! Memory locality and absence of Python object type checking allow CPU caching and SIMD vector instructions.' },
          { text: 'NumPy converts Python code into JavaScript', explanation: 'No, NumPy is written in C and Fortran.' },
          { text: 'NumPy disables the computer fan to run faster', explanation: 'Hardware cooling is unaffected.' },
          { text: 'Lists in Python are strictly stored on the hard drive', explanation: 'Both lists and NumPy arrays live in RAM.' },
        ],
        correctIndex: 0,
      },
    ],
    challenge: {
      id: 'ch6',
      title: 'Design an Async Pipeline Worker',
      difficulty: 'Hard',
      description:
        'Write an async worker function `process_batch(items: list[int], factor: int) -> list[int]` that multiplies each item concurrently and returns the sorted list.',
      starterCode: `import asyncio

async def process_batch(items: list[int], factor: int) -> list[int]:
    # Process items concurrently using asyncio
    pass

# Test code
async def run_test():
    res = await process_batch([3, 1, 4, 1, 5], 10)
    print("Processed:", res)

# asyncio.run(run_test())`,
      solutionCode: `import asyncio

async def _process_item(x: int, factor: int) -> int:
    await asyncio.sleep(0.01)
    return x * factor

async def process_batch(items: list[int], factor: int) -> list[int]:
    tasks = [_process_item(x, factor) for x in items]
    results = await asyncio.gather(*tasks)
    return sorted(results)

async def run_test():
    res = await process_batch([3, 1, 4, 1, 5], 10)
    print("Processed:", res)

# Simulated result output
print("Processed: [10, 10, 30, 40, 50]")`,
      hints: [
        'Use asyncio.gather(*tasks) to run concurrent sub-tasks.',
        'Sort the gathered results before returning.',
      ],
      testCases: [
        { input: '[3, 1, 2], factor 2', expected: '[2, 4, 6]' },
      ],
    },
    project: {
      title: 'Full-Stack Microservice with FastAPI & Async SQL',
      subtitle: 'Complete Cloud-Ready Production API Service',
      difficulty: 'Advanced',
      timeEstimate: '15-20 hours',
      description:
        'Build a production-ready microservice with FastAPI, SQLAlchemy 2.0 (asyncpg), Alembic migrations, JWT authentication, Docker containerization, and Prometheus observability metrics.',
      architecture: [
        'Layered Clean Architecture (Routers -> Services -> Repositories -> DB)',
        'Async database connection pool with health check endpoint',
        'OAuth2 Bearer password flow with hashed bcrypt passwords',
        'Docker multi-stage build producing lightweight Alpine image',
      ],
      skillsLearned: [
        'Enterprise backend architecture and domain separation',
        'Database connection pooling and migration management',
        'Production security hardening and environment configuration',
      ],
      starterCode: `# app/main.py
# from fastapi import FastAPI, Depends, HTTPException, status
# app = FastAPI(title="Production Service", version="1.0.0")

# @app.get("/health")
# async def health_check():
#     return {"status": "healthy", "database": "connected"}`,
    },
  },
];

export const SPECIALIZATION_TRACKS: SpecializationTrack[] = [
  {
    id: 'track-ai',
    title: 'Data Science & Machine Learning',
    role: 'ML Engineer / Data Scientist',
    description:
      'Harness Python to extract intelligence from data, train neural networks, and deploy machine learning models to production.',
    coreLibraries: ['NumPy', 'Pandas', 'Scikit-Learn', 'PyTorch', 'Polars', 'Matplotlib'],
    typicalTasks: [
      'Exploratory data analysis & feature engineering pipelines',
      'Training deep learning classification & NLP vision models',
      'Optimizing matrix operations and GPU tensor pipelines',
    ],
    roadmapStages: ['Stage 01: Foundations', 'Stage 02: Data Structures', 'Stage 04: Advanced Python (Memory/Generators)', 'Stage 06: ML Track'],
    exampleCode: `import numpy as np

# Fast vectorized matrix math in C
features = np.random.randn(1000, 10)
weights = np.random.randn(10, 1)
predictions = 1 / (1 + np.exp(-features @ weights))
print(f"Generated {len(predictions)} logistic predictions in <1ms")`,
    salaryRange: '$120,000 - $185,000 / yr',
  },
  {
    id: 'track-web',
    title: 'High-Scale Backend & API Engineering',
    role: 'Senior Backend Python Engineer',
    description:
      'Build ultra-fast, async-driven REST & GraphQL microservices handling tens of thousands of concurrent requests.',
    coreLibraries: ['FastAPI', 'Pydantic', 'SQLAlchemy 2.0', 'Redis', 'Alembic', 'Uvicorn'],
    typicalTasks: [
      'Architecting resilient distributed microservices',
      'Optimizing PostgreSQL queries and asynchronous connection pools',
      'Implementing rate limiters, caching layers, and OAuth2 security',
    ],
    roadmapStages: ['Stage 01: Foundations', 'Stage 03: OOP & Clean Code', 'Stage 04: Asyncio & GIL', 'Stage 05: Pytest & Packaging', 'Stage 06: FastAPI'],
    exampleCode: `from pydantic import BaseModel, Field

class UserSignup(BaseModel):
    email: str = Field(..., example="alex@example.com")
    age: int = Field(..., ge=18, le=120)

user = UserSignup(email="dev@pythonpath.org", age=24)
print("Validated User Contract:", user.model_dump())`,
    salaryRange: '$115,000 - $175,000 / yr',
  },
  {
    id: 'track-auto',
    title: 'Automation, Scraping & Workflow Ops',
    role: 'Automation Engineer / SDET',
    description:
      'Automate repetitive workflows, scrape dynamic single-page web applications, and orchestrate complex ETL pipelines.',
    coreLibraries: ['Playwright', 'BeautifulSoup4', 'Celery', 'HTTPX', 'Rich', 'Schedule'],
    typicalTasks: [
      'End-to-end browser automation bypassing bot detection',
      'Parsing irregular PDF and spreadsheet data streams into databases',
      'Scheduled automated alerts and cross-platform integrations',
    ],
    roadmapStages: ['Stage 01: Foundations', 'Stage 02: File I/O & Dicts', 'Stage 04: Generators & Async', 'Stage 06: Automation Track'],
    exampleCode: `import json

# Simulating workflow execution batch
tasks = ["Download CSV", "Clean Duplicates", "Export Parquet"]
for idx, task in enumerate(tasks, start=1):
    print(f"[{idx}/{len(tasks)}] Completed automation step: {task}")`,
    salaryRange: '$95,000 - $150,000 / yr',
  },
  {
    id: 'track-sys',
    title: 'Systems Tooling, CLI & DevOps Engineering',
    role: 'DevOps / Platform Engineer',
    description:
      'Build command-line interfaces, infrastructure orchestration tools, and low-level system diagnostic utilities.',
    coreLibraries: ['Click', 'Typer', 'Rich', 'Subprocess', 'Docker SDK', 'Paramiko'],
    typicalTasks: [
      'Creating CLI dev tools distributed across engineering teams',
      'Automating cloud infrastructure deployment and health monitors',
      'Interfacing with C libraries via ctypes and CFFI',
    ],
    roadmapStages: ['Stage 01: Foundations', 'Stage 03: OOP & Protocols', 'Stage 04: CPython Internals', 'Stage 05: Modern Packaging (UV/Wheel)'],
    exampleCode: `import sys

print(f"Python Runtime: {sys.version.split()[0]}")
print(f"Platform Architecture: {sys.platform}")
print("System diagnostic check: OK")`,
    salaryRange: '$120,000 - $180,000 / yr',
  },
];
