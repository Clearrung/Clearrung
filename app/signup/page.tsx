'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-ink-950 text-brass-200 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-xl text-brass-50 mb-8 block">Clearrung</Link>
        <h1 className="font-display text-2xl text-brass-50 mb-6">Clear your first rung</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5 text-brass-200/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ink-900 border border-brass-500/30 rounded-sm px-3 py-2 focus-ring outline-none text-brass-50"
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5 text-brass-200/80">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ink-900 border border-brass-500/30 rounded-sm px-3 py-2 focus-ring outline-none text-brass-50"
            />
          </div>
          {error && <p className="text-clay-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brass-500 text-ink-950 py-2.5 rounded-sm font-medium hover:bg-brass-400 focus-ring disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="text-sm text-brass-200/60 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brass-50 underline">Log in</Link>
        </p>
      </div>
    </main>
  )
}
