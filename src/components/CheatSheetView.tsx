import React, { useState } from 'react';
import { Search, Copy, Check, BookOpen, Terminal } from 'lucide-react';

interface CheatItem {
  category: string;
  syntax: string;
  description: string;
  example: string;
}

const CHEAT_ITEMS: CheatItem[] = [
  {
    category: 'Comprehensions',
    syntax: '[expr for item in iterable if condition]',
    description: 'List comprehension with conditional filter',
    example: '[x * 2 for x in range(10) if x % 2 == 0]',
  },
  {
    category: 'Comprehensions',
    syntax: '{k: v for k, v in iterable}',
    description: 'Dictionary comprehension',
    example: '{w: len(w) for w in ["apple", "banana"]}',
  },
  {
    category: 'Comprehensions',
    syntax: '{expr for item in iterable}',
    description: 'Set comprehension (removes duplicates)',
    example: '{x.lower() for x in ["A", "b", "A"]}',
  },
  {
    category: 'Comprehensions',
    syntax: '(expr for item in iterable)',
    description: 'Generator expression (lazy, memory-constant O(1))',
    example: 'sum(x * x for x in range(1000000))',
  },
  {
    category: 'Slicing',
    syntax: 'sequence[start:stop:step]',
    description: 'General slice syntax',
    example: 'numbers[1:7:2]  # Elements from index 1 to 6 stepping by 2',
  },
  {
    category: 'Slicing',
    syntax: 'sequence[::-1]',
    description: 'Reverse sequence (creates shallow copy in reverse)',
    example: '"Python"[::-1]  # Output: "nohtyP"',
  },
  {
    category: 'Dunder Methods',
    syntax: '__repr__(self) -> str',
    description: 'Unambiguous developer string representation for debugging',
    example: 'def __repr__(self): return f"Point(x={self.x}, y={self.y})"',
  },
  {
    category: 'Dunder Methods',
    syntax: '__add__(self, other)',
    description: 'Overload the + operator',
    example: 'def __add__(self, other): return Vector(self.x + other.x)',
  },
  {
    category: 'Dunder Methods',
    syntax: '__getitem__(self, key)',
    description: 'Make class indexable via obj[key] or sliceable via obj[start:stop]',
    example: 'def __getitem__(self, idx): return self._items[idx]',
  },
  {
    category: 'Dunder Methods',
    syntax: '__enter__(self) & __exit__(self, ...)',
    description: 'Context manager protocol for with statement',
    example: 'with ManagedResource() as res: ...',
  },
  {
    category: 'f-Strings',
    syntax: 'f"{value:,.2f}"',
    description: 'Format float with comma thousand separator and 2 decimals',
    example: 'f"{1250000.456:,.2f}"  # Output: "1,250,000.46"',
  },
  {
    category: 'f-Strings',
    syntax: 'f"{value:>15}"',
    description: 'Right-align string within a 15-character column',
    example: 'f"{\'Total\':>15}"',
  },
  {
    category: 'Typing (PEP 604)',
    syntax: 'int | None',
    description: 'Union type syntax replacing Optional[int] (Python 3.10+)',
    example: 'def find_user(user_id: str) -> User | None: ...',
  },
  {
    category: 'Typing',
    syntax: 'class Flyable(Protocol): ...',
    description: 'Structural subtyping (static duck typing)',
    example: 'from typing import Protocol; class Worker(Protocol): def work(self): ...',
  },
  {
    category: 'Dict Operations',
    syntax: 'd1 | d2',
    description: 'Merge two dictionaries into a new dict (Python 3.9+)',
    example: 'merged = {"a": 1} | {"b": 2, "a": 99}',
  },
  {
    category: 'Dict Operations',
    syntax: 'd.get(key, default)',
    description: 'Lookup key safely without raising KeyError',
    example: 'counts[w] = counts.get(w, 0) + 1',
  },
];

export const CheatSheetView: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const categories = ['All', 'Comprehensions', 'Slicing', 'Dunder Methods', 'f-Strings', 'Typing', 'Dict Operations'];

  const filtered = CHEAT_ITEMS.filter((item) => {
    const matchesCat = selectedCat === 'All' || item.category.toLowerCase().includes(selectedCat.toLowerCase());
    const matchesQuery =
      item.syntax.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.example.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 font-mono uppercase tracking-wider">
          <BookOpen className="h-4 w-4" />
          <span>Quick Syntax Reference</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Python Idiomatic Cheat Sheet
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Fast reference guide covering essential Python syntax: comprehensions, slicing patterns,
          magic methods, f-string formatting specifiers, and static typing syntax.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search syntax, keyword, dunder method..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Category buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cheat items list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold text-amber-400">
                {item.category}
              </span>
              <button
                onClick={() => handleCopy(item.example, idx)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                title="Copy snippet"
              >
                {copiedIndex === idx ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            <div className="font-mono text-xs font-bold text-white bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800/80 overflow-x-auto">
              {item.syntax}
            </div>

            <p className="text-xs text-slate-300">{item.description}</p>

            <div className="pt-1 font-mono text-xs text-emerald-300/90 bg-slate-950/80 p-2.5 rounded border border-slate-800/60 overflow-x-auto">
              <pre className="whitespace-pre">{item.example}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
