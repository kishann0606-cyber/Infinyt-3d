import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin')
    })
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      const { data: adminCheck, error: adminError } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (adminError) throw adminError

      if (!adminCheck) {
        await supabase.auth.signOut()
        throw new Error('This account does not have admin access.')
      }

      navigate('/admin')
    } catch (err) {
      setStatus('error')
      if (err instanceof Error) {
        if (err.message.includes('Invalid login')) {
          setErrorMsg('Invalid email or password. Please try again.')
        } else {
          setErrorMsg(err.message)
        }
      } else {
        setErrorMsg('Login failed. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary-50/30 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="Infinyt 3D" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-extrabold text-slate-900">Admin Login</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to access the admin dashboard</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@infinyt3d.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            {status === 'error' && (
              <div className="bg-error-50 border border-error-100 text-error-700 rounded-xl p-4 text-sm">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">
            Back to website
          </Link>
        </div>
      </div>
    </div>
  )
}
