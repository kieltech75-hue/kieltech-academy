import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Zap, FileCode, CheckCircle2 } from 'lucide-react';
import { executePython, initPyodide, ExecutionResult } from '../utils/pythonRunner';

interface PythonSandboxProps {
  initialCode?: string;
}

const TEMPLATES = [
  {
    name: '01. Variables & Dynamic Types',
    code: `# Stage 01: Core Syntax & Truthiness
item = "Python 3.12"
print(f"Variable item has value: {item} and type: {type(item).__name__}")

item = 42  # Rebinding
print(f"Rebound item to integer: {item}")

# Testing truthiness
empty_items = [[], {}, "", 0, None]
for elem in empty_items:
    print(f"Object {repr(elem)} evaluates to False:", not bool(elem))`,
  },
  {
    name: '02. Comprehensions & Slicing',
    code: `# Stage 02: List & Dict Comprehensions
words = ["python", "rust", "javascript", "go", "cplusplus"]

# Filter words longer than 3 chars and uppercase them
cleaned = [w.upper() for w in words if len(w) > 3]
print("Transformed words:", cleaned)

# Word length map via dictionary comprehension
lengths = {w: len(w) for w in words}
print("Length mappings:", lengths)

# Slice stepping
nums = list(range(10))
print("Reversed evens:", nums[::-2])`,
  },
  {
    name: '03. Dunder Magic Vector Class',
    code: `# Stage 03: Object-Oriented Dunder Methods
class Vector2D:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector2D(x={self.x}, y={self.y})"

    def __add__(self, other):
        return Vector2D(self.x + other.x, self.y + other.y)

    def __mul__(self, scalar):
        return Vector2D(self.x * scalar, self.y * scalar)

v1 = Vector2D(3, 4)
v2 = Vector2D(1, 2)
v3 = v1 + v2
print("Vector addition (v1 + v2):", v3)
print("Vector scaling (v1 * 3):", v1 * 3)`,
  },
  {
    name: '04. Production Timing Decorator',
    code: `# Stage 04: Closures & Decorators
import functools
import time

def timing_logger(threshold_ms: float = 0.0):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            result = func(*args, **kwargs)
            duration_ms = (time.perf_counter() - start) * 1000
            print(f"[BENCHMARK] {func.__name__} took {duration_ms:.3f}ms")
            return result
        return wrapper
    return decorator

@timing_logger(threshold_ms=0.1)
def compute_squares(limit: int):
    return sum(i * i for i in range(limit))

result = compute_squares(50000)
print("Calculation result:", result)`,
  },
  {
    name: '05. Lazy Prime Generator',
    code: `# Stage 04: Generators & State Suspension
def generate_primes():
    yield 2
    primes = [2]
    num = 3
    while True:
        is_p = True
        for p in primes:
            if p * p > num:
                break
            if num % p == 0:
                is_p = False
                break
        if is_p:
            primes.append(num)
            yield num
        num += 2

gen = generate_primes()
first_ten = [next(gen) for _ in range(10)]
print("First 10 primes generated lazily:", first_ten)`,
  },
];

export const PythonSandbox: React.FC<PythonSandboxProps> = ({ initialCode }) => {
  const [code, setCode] = useState<string>(initialCode || TEMPLATES[0].code);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [pyodideReady, setPyodideReady] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  useEffect(() => {
    // Attempt background initialization of Pyodide WebAssembly
    initPyodide().then((ready) => {
      setPyodideReady(ready);
    });
  }, []);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await executePython(code);
      setResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(TEMPLATES[0].code);
    setResult(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 font-mono uppercase tracking-wider">
            <Terminal className="h-4 w-4" />
            <span>Interactive Python REPL</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">In-Browser Code Runner</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Test concepts, verify output, and inspect execution performance with client-side WebAssembly.
          </p>
        </div>

        {/* Engine status indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span
              className={`h-2 w-2 rounded-full ${
                pyodideReady ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="font-mono text-[11px]">
              {pyodideReady ? 'Pyodide WASM Ready' : 'Fast Hybrid Engine'}
            </span>
          </div>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 rounded-lg bg-amber-400 hover:bg-amber-300 px-5 py-2 text-xs font-bold text-slate-950 transition-colors shadow-sm"
          >
            <Play className="h-3.5 w-3.5 fill-slate-950" />
            <span>{isRunning ? 'Running...' : 'Run Code (⌘+Enter)'}</span>
          </button>
        </div>
      </div>

      {/* Template Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <span className="text-slate-400 font-mono text-[11px] shrink-0">Stage Presets:</span>
        {TEMPLATES.map((tmpl, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCode(tmpl.code);
              setResult(null);
            }}
            className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 whitespace-nowrap transition-colors"
          >
            {tmpl.name}
          </button>
        ))}
      </div>

      {/* Editor & Terminal Console Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Code Editor */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 bg-slate-900/90">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">sandbox.py</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>

              <button
                onClick={handleReset}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                title="Reset code"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="relative flex-1">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleRun();
                }
              }}
              rows={18}
              className="w-full h-full bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-200 focus:outline-none resize-none selection:bg-amber-400/20 leading-relaxed"
              spellCheck={false}
              placeholder="# Write or paste Python code here..."
            />
          </div>
        </div>

        {/* Right Column: Terminal Output Screen */}
        <div className="lg:col-span-5 flex flex-col rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 bg-slate-900/90">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Terminal className="h-3.5 w-3.5 text-amber-400" />
              <span>Standard Output (stdout)</span>
            </div>

            {result && (
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span className="tabular-nums">{result.executionTimeMs}ms</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{result.engine}</span>
              </div>
            )}
          </div>

          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto max-h-[460px] bg-slate-950/90 text-slate-300 space-y-2">
            {!result ? (
              <div className="text-slate-500 italic py-8 text-center space-y-2">
                <div>Click "Run Code" or press ⌘+Enter to execute.</div>
                <div className="text-[11px] text-slate-600">Standard output and exceptions will appear here.</div>
              </div>
            ) : (
              <div>
                {result.error && (
                  <div className="rounded border border-rose-900/60 bg-rose-950/30 p-3 text-rose-300 whitespace-pre-wrap">
                    {result.error}
                  </div>
                )}
                {result.output && (
                  <div className="text-emerald-300/90 whitespace-pre-wrap leading-relaxed">
                    {result.output}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 px-4 py-2 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Encoding: UTF-8</span>
            <button
              onClick={() => setResult(null)}
              className="hover:text-slate-200 transition-colors"
            >
              Clear Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
