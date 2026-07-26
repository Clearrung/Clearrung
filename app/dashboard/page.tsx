'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { simulate, Debt } from '@/lib/payoff'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function Dashboard() {
  const supabase = createClient()
  const router = useRouter()

  const [userEmail, setUserEmail] = useState('')
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)
  const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('snowball')
  const [extra, setExtra] = useState(100)

  const [form, setForm] = useState({ name: '', balance: '', rate: '', min_payment: '' })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserEmail(user.email ?? '')

      const { data } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      setDebts((data as Debt[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function addDebt(e: React.FormEvent) {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('debts')
      .insert({
        user_id: user.id,
        name: form.name,
        balance: parseFloat(form.balance),
        rate: parseFloat(form.rate) / 100,
        min_payment: parseFloat(form.min_payment),
      })
      .select()
      .single()

    if (!error && data) {
      setDebts([...debts, data as Debt])
      setForm({ name: '', balance: '', rate: '', min_payment: '' })
      setShowForm(false)
    }
  }

  async function removeDebt(id: string) {
    await supabase.from('debts').delete().eq('id', id)
    setDebts(debts.filter((d) => d.id !== id))
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-ink-950 flex items-center justify-center">
        <p className="text-brass-200/60 text-sm">Loading…</p>
      </main>
    )
  }

  const result = debts.length > 0 ? simulate(debts, strategy, extra) : null

  return (
    <main className="min-h-screen bg-ink-950 text-brass-200">
      <nav className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="font-display text-xl text-brass-50">Clearrung</span>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-brass-200/50">{userEmail}</span>
          <button onClick={signOut} className="hover:text-brass-50 focus-ring">
            Sign out
          </button>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-brass-50">Your debts</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-brass-500 text-ink-950 px-4 py-2 rounded-sm font-medium hover:bg-brass-400 focus-ring text-sm"
          >
            {showForm ? 'Cancel' : '+ Add debt'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={addDebt} className="border border-brass-500/20 rounded-sm p-6 mb-8 bg-ink-900 grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs mb-1.5 text-brass-200/70">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Credit card"
                className="w-full bg-ink-800 border border-brass-500/30 rounded-sm px-3 py-2 text-sm focus-ring outline-none text-brass-50"
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5 text-brass-200/70">Balance ($)</label>
              <input
                required
                type="number"
                step="0.01"
                value={form.balance}
                onChange={(e) => setForm({ ...form, balance: e.target.value })}
                placeholder="3200"
                className="w-full bg-ink-800 border border-brass-500/30 rounded-sm px-3 py-2 text-sm focus-ring outline-none text-brass-50"
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5 text-brass-200/70">Interest rate (%)</label>
              <input
                required
                type="number"
                step="0.01"
                value={form.rate}
                onChange={(e) => setForm({ ...form, rate: e.target.value })}
                placeholder="19.9"
                className="w-full bg-ink-800 border border-brass-500/30 rounded-sm px-3 py-2 text-sm focus-ring outline-none text-brass-50"
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5 text-brass-200/70">Min payment ($)</label>
              <input
                required
                type="number"
                step="0.01"
                value={form.min_payment}
                onChange={(e) => setForm({ ...form, min_payment: e.target.value })}
                placeholder="90"
                className="w-full bg-ink-800 border border-brass-500/30 rounded-sm px-3 py-2 text-sm focus-ring outline-none text-brass-50"
              />
            </div>
            <button
              type="submit"
              className="md:col-span-4 bg-sage-500 text-ink-950 py-2 rounded-sm font-medium hover:bg-sage-400 focus-ring text-sm"
            >
              Save debt
            </button>
          </form>
        )}

        {debts.length === 0 ? (
          <div className="border border-brass-500/20 rounded-sm p-12 text-center">
            <p className="text-brass-200/60">No debts yet. Add your first one to see your payoff timeline.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-10">
              {debts.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between border border-brass-500/20 rounded-sm px-4 py-3 bg-ink-900"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-brass-50 font-medium">{d.name}</span>
                    <span className="text-brass-200/50 text-sm font-mono">
                      ${d.balance.toLocaleString()} @ {(d.rate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <button
                    onClick={() => removeDebt(d.id)}
                    className="text-clay-400 text-sm hover:text-clay-500 focus-ring"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setStrategy('snowball')}
                className={`px-4 py-2 rounded-sm text-sm border focus-ring ${
                  strategy === 'snowball'
                    ? 'bg-brass-500 text-ink-950 border-brass-500'
                    : 'border-brass-500/30 text-brass-200'
                }`}
              >
                Snowball
              </button>
              <button
                onClick={() => setStrategy('avalanche')}
                className={`px-4 py-2 rounded-sm text-sm border focus-ring ${
                  strategy === 'avalanche'
                    ? 'bg-brass-500 text-ink-950 border-brass-500'
                    : 'border-brass-500/30 text-brass-200'
                }`}
              >
                Avalanche
              </button>
              <div className="flex-1" />
              <label className="text-sm text-brass-200/70">Extra monthly payment</label>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={extra}
                onChange={(e) => setExtra(parseInt(e.target.value))}
                className="w-40"
              />
              <span className="text-sm font-mono w-14">${extra}</span>
            </div>

            {result && (
              <>
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-ink-900 rounded-sm p-4">
                    <p className="text-xs text-brass-200/60 mb-1">Debt-free in</p>
                    <p className="font-display text-2xl text-brass-50">{result.months} mo</p>
                  </div>
                  <div className="bg-ink-900 rounded-sm p-4">
                    <p className="text-xs text-brass-200/60 mb-1">Total interest paid</p>
                    <p className="font-display text-2xl text-brass-50">
                      ${Math.round(result.totalInterest).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-ink-900 rounded-sm p-4">
                    <p className="text-xs text-brass-200/60 mb-1">Payoff order</p>
                    <p className="text-sm text-brass-50 leading-relaxed">{result.order.join(' → ')}</p>
                  </div>
                </div>

                <div className="h-72 bg-ink-900 rounded-sm p-4 border border-brass-500/10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.history.map((v, i) => ({ month: i, balance: Math.round(v) }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#22335A" />
                      <XAxis dataKey="month" stroke="#D9AC4F" tick={{ fontSize: 12 }} label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: '#D9AC4F', fontSize: 12 }} />
                      <YAxis stroke="#D9AC4F" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ background: '#101A2E', border: '1px solid #324875', fontSize: 12 }}
                        labelStyle={{ color: '#F0D89B' }}
                        formatter={(v: number) => [`$${v.toLocaleString()}`, 'Balance']}
                      />
                      <Line type="monotone" dataKey="balance" stroke="#5B8C6A" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </>
        )}
      </section>
    </main>
  )
}
