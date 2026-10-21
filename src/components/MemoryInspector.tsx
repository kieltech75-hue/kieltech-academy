import React, { useState } from 'react';
import { Play, RotateCcw, ArrowRight, ArrowLeft, Cpu, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';

interface MemoryStep {
  stepNumber: number;
  codeLine: string;
  explanation: string;
  variables: { name: string; targetId: string }[];
  heapObjects: {
    id: string;
    type: string;
    value: string;
    refCount: number;
    isMutable: boolean;
    highlight?: boolean;
  }[];
}

interface SimulationScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  steps: MemoryStep[];
}

const SCENARIOS: SimulationScenario[] = [
  {
    id: 'mutation',
    title: 'Shared Reference & In-Place Mutation',
    subtitle: 'Why a = [1, 2]; b = a; b.append(3) alters a',
    description:
      'In Python, assignment never copies an object. It only binds a variable name in the current namespace to an existing PyObject in the heap.',
    steps: [
      {
        stepNumber: 1,
        codeLine: 'a = [1, 2]',
        explanation: 'CPython allocates a PyListObject at memory address 0x101 with ref_count=1. The name "a" points to 0x101.',
        variables: [{ name: 'a', targetId: '0x101' }],
        heapObjects: [
          { id: '0x101', type: 'list', value: '[1, 2]', refCount: 1, isMutable: true, highlight: true },
        ],
      },
      {
        stepNumber: 2,
        codeLine: 'b = a',
        explanation: 'Variable "b" is assigned to "a". No new list is created! Both "a" and "b" reference 0x101. ref_count increases to 2.',
        variables: [
          { name: 'a', targetId: '0x101' },
          { name: 'b', targetId: '0x101' },
        ],
        heapObjects: [
          { id: '0x101', type: 'list', value: '[1, 2]', refCount: 2, isMutable: true, highlight: true },
        ],
      },
      {
        stepNumber: 3,
        codeLine: 'b.append(3)',
        explanation: 'b.append(3) mutates the list object at 0x101 in place. Since "a" also points to 0x101, printing "a" now evaluates to [1, 2, 3]!',
        variables: [
          { name: 'a', targetId: '0x101' },
          { name: 'b', targetId: '0x101' },
        ],
        heapObjects: [
          { id: '0x101', type: 'list', value: '[1, 2, 3]', refCount: 2, isMutable: true, highlight: true },
        ],
      },
    ],
  },
  {
    id: 'immutable',
    title: 'Immutable Rebinding vs Mutation',
    subtitle: 'Why x = 42; y = x; x = 43 leaves y unchanged',
    description:
      'Integers, strings, and tuples are immutable. You cannot mutate an integer in place; reassigning x re-points the label to a new PyObject.',
    steps: [
      {
        stepNumber: 1,
        codeLine: 'x = 42',
        explanation: 'Namespace label "x" references the PyLongObject 42 at 0x201.',
        variables: [{ name: 'x', targetId: '0x201' }],
        heapObjects: [
          { id: '0x201', type: 'int', value: '42', refCount: 1, isMutable: false },
        ],
      },
      {
        stepNumber: 2,
        codeLine: 'y = x',
        explanation: '"y" binds to the exact same integer object 0x201. ref_count becomes 2.',
        variables: [
          { name: 'x', targetId: '0x201' },
          { name: 'y', targetId: '0x201' },
        ],
        heapObjects: [
          { id: '0x201', type: 'int', value: '42', refCount: 2, isMutable: false },
        ],
      },
      {
        stepNumber: 3,
        codeLine: 'x = 43',
        explanation: 'Because integers are immutable, Python creates a new PyLongObject 43 at 0x202 and binds "x" to it. "y" continues to point safely to 0x201!',
        variables: [
          { name: 'x', targetId: '0x202' },
          { name: 'y', targetId: '0x201' },
        ],
        heapObjects: [
          { id: '0x201', type: 'int', value: '42', refCount: 1, isMutable: false },
          { id: '0x202', type: 'int', value: '43', refCount: 1, isMutable: false, highlight: true },
        ],
      },
    ],
  },
  {
    id: 'defaults',
    title: 'The Default Mutable Argument Trap',
    subtitle: 'Why def add(v, l=[]): shares list across function calls',
    description:
      'Default function parameter objects are evaluated and instantiated ONCE when the module loads, stored in func.__defaults__.',
    steps: [
      {
        stepNumber: 1,
        codeLine: 'def add(val, lst=[]): ...',
        explanation: 'At definition time, Python allocates a list at 0x301 and attaches it to add.__defaults__. It is shared forever across all invocations that omit the second argument.',
        variables: [{ name: 'add.__defaults__[0]', targetId: '0x301' }],
        heapObjects: [
          { id: '0x301', type: 'list (default)', value: '[]', refCount: 1, isMutable: true },
        ],
      },
      {
        stepNumber: 2,
        codeLine: 'add("apple")',
        explanation: 'Call 1 executes lst.append("apple"). The default object at 0x301 is mutated in place.',
        variables: [{ name: 'add.__defaults__[0]', targetId: '0x301' }],
        heapObjects: [
          { id: '0x301', type: 'list (default)', value: "['apple']", refCount: 1, isMutable: true, highlight: true },
        ],
      },
      {
        stepNumber: 3,
        codeLine: 'add("banana")',
        explanation: 'Call 2 omits the second argument again. It receives the same object 0x301, mutating it to ["apple", "banana"]! Fix: lst=None.',
        variables: [{ name: 'add.__defaults__[0]', targetId: '0x301' }],
        heapObjects: [
          { id: '0x301', type: 'list (default)', value: "['apple', 'banana']", refCount: 1, isMutable: true, highlight: true },
        ],
      },
    ],
  },
];

export const MemoryInspector: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIOS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];
  const step = scenario.steps[currentStepIndex];

  const handleSelectScenario = (id: string) => {
    setActiveScenarioId(id);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (currentStepIndex < scenario.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 font-mono uppercase tracking-wider">
          <Cpu className="h-4 w-4" />
          <span>CPython Runtime Diagnostics</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Python Memory & Reference Inspector
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Visualize how Python connects namespace variable names (pointers) to heap objects (`PyObject`).
          Understanding references is the single biggest leap between intermediate and advanced mastery.
        </p>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => handleSelectScenario(sc.id)}
            className={`px-4 py-2.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeScenarioId === sc.id
                ? 'border-amber-400 bg-slate-900 text-white shadow-sm'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {sc.title}
          </button>
        ))}
      </div>

      {/* Architectural Concept Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="lg:col-span-8 space-y-2">
          <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
            Active Scenario Analysis
          </span>
          <h3 className="text-xl font-bold text-white">{scenario.title}</h3>
          <p className="text-xs text-amber-300 font-medium italic">{scenario.subtitle}</p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
            {scenario.description}
          </p>
        </div>

        <div className="lg:col-span-4 flex items-center justify-end">
          <div className="relative rounded-lg border border-slate-800 overflow-hidden bg-slate-950 max-h-36 w-full">
            <img
              src="/src/assets/images/python_concept_architecture_1790543575779.jpg"
              alt="Python architecture memory diagram"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Stepped Simulation Canvas */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl space-y-0">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 px-6 py-3.5 bg-slate-900/80 gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold text-amber-400">
              STEP {step.stepNumber} OF {scenario.steps.length}
            </span>
            <div className="rounded bg-slate-950 px-3 py-1 font-mono text-xs text-emerald-300 border border-slate-800">
              {step.codeLine}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Reset simulation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepIndex === scenario.steps.length - 1}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-xs font-bold text-slate-950 transition-colors shadow-xs"
            >
              <span>Next Step</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Step Explanation Callout */}
        <div className="border-b border-slate-800/80 bg-slate-900/40 px-6 py-3 text-xs sm:text-sm text-slate-300">
          <span className="font-semibold text-amber-400">Under the Hood: </span>
          {step.explanation}
        </div>

        {/* Interactive Diagram Stage: Stack Namespaces -> Heap PyObjects */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Column A: Namespace / Stack Variables */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                <span>Namespace (Stack / Names)</span>
                <span>Pointer Address</span>
              </div>

              <div className="space-y-3">
                {step.variables.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-slate-900 font-mono text-xs shadow-sm hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-400" />
                      <span className="font-bold text-white text-sm">{v.name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <span>⟶</span>
                      <span className="text-amber-400 font-bold tabular-nums">{v.targetId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle: Visual Connector Indicator */}
            <div className="hidden md:flex md:col-span-1 items-center justify-center pt-10 text-slate-600 font-mono text-xl">
              ⟹
            </div>

            {/* Column B: Heap Allocations (PyObjects) */}
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                <span>Memory Heap (PyObject Structs)</span>
                <span>Type & Mutability</span>
              </div>

              <div className="space-y-3">
                {step.heapObjects.map((obj) => (
                  <div
                    key={obj.id}
                    className={`rounded-lg border p-4 font-mono text-xs transition-all shadow-md ${
                      obj.highlight
                        ? 'border-emerald-500/80 bg-slate-900/90 ring-1 ring-emerald-500/50'
                        : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">{obj.id}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400">ob_refcnt: {obj.refCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 font-semibold">{obj.type}</span>
                        <span className="text-slate-500">·</span>
                        <span
                          className={`font-semibold ${
                            obj.isMutable ? 'text-amber-400' : 'text-blue-400'
                          }`}
                        >
                          {obj.isMutable ? 'Mutable' : 'Immutable'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400 text-[11px]">Payload Value:</span>
                      <span className="font-bold text-sm text-emerald-300">{obj.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="border-t border-slate-800 px-6 py-3 bg-slate-900/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              <span>Namespace Symbol</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>Mutable Heap Object</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Target Mutation Active</span>
            </div>
          </div>
          <span>Garbage Collector Trigger: ob_refcnt == 0</span>
        </div>
      </div>
    </div>
  );
};
