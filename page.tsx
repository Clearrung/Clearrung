import Link from 'next/link'

const rungs = [
  { label: 'Store card', pct: 92 },
  { label: 'Credit card', pct: 68 },
  { label: 'Car loan', pct: 41 },
  { label: 'Personal loan', pct: 18 },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-ink-950 text-brass-200">
      <nav className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="font-display text-xl tracking-tight text-brass-50">Clearrung</span>
        <div className="flex gap-6 items-center text-sm">
          <Link href="/login" className="hover:text-brass-50 focus-ring">Log in</Link>
          <Link
            href="/signup"
            className="bg-brass-500 text-ink-950 px-4 py-2 rounded-sm font-medium hover:bg-brass-400 focus-ring"
          >
            Get started
          </Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-xs tracking-widest text-sage-400 mb-4">DEBT PAYOFF, PLANNED</p>
          <h1 className="font-display text-5xl leading-[1.1] text-brass-50 mb-6">
            Every rung has a name. Climb them in order.
          </h1>
          <p className="text-brass-200/80 text-lg leading-relaxed mb-8">
            Add what you owe. Clearrung shows you the exact month you'll be debt-free,
            and whether paying off the smallest balance first or the highest interest
            rate first gets you there sooner.
          </p>
          <div className="flex gap-4">
            <Link
              href="/signup"
              className="bg-brass-500 text-ink-950 px-6 py-3 rounded-sm font-medium hover:bg-brass-400 focus-ring"
            >
              Clear my first rung
            </Link>
            <Link
              href="/login"
              className="border border-brass-500/40 px-6 py-3 rounded-sm hover:border-brass-500 focus-ring"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="border border-brass-500/20 rounded-sm p-8 bg-ink-900">
            <p className="font-mono text-xs tracking-widest text-brass-500 mb-6">YOUR RUNGS</p>
            <div className="space-y-4">
              {rungs.map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-brass-100">{r.label}</span>
                    <span className="text-sage-400 font-mono text-xs">{r.pct}% paid</span>
                  </div>
                  <div className="h-2 bg-ink-800 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-sage-500"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">
        <div className="border-t border-brass-500/20 pt-6">
          <p className="font-mono text-xs text-sage-400 mb-2">01</p>
          <h3 className="font-display text-xl text-brass-50 mb-2">Add your debts</h3>
          <p className="text-brass-200/70 text-sm leading-relaxed">
            Balance, rate, minimum payment. Takes two minutes, no bank connection required.
          </p>
        </div>
        <div className="border-t border-brass-500/20 pt-6">
          <p className="font-mono text-xs text-sage-400 mb-2">02</p>
          <h3 className="font-display text-xl text-brass-50 mb-2">Compare strategies</h3>
          <p className="text-brass-200/70 text-sm leading-relaxed">
            Snowball for momentum, avalanche for savings. See both timelines side by side.
          </p>
        </div>
        <div className="border-t border-brass-500/20 pt-6">
          <p className="font-mono text-xs text-sage-400 mb-2">03</p>
          <h3 className="font-display text-xl text-brass-50 mb-2">Track every month</h3>
          <p className="text-brass-200/70 text-sm leading-relaxed">
            Log payments as you make them and watch your debt-free date get closer.
          </p>
        </div>
      </section>
    </main>
  )
}
