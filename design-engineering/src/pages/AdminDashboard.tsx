import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, type ContactMessage, type PrototypeRequest, type Product } from '../lib/supabase'

type Tab = 'overview' | 'messages' | 'inquiries' | 'products'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [inquiries, setInquiries] = useState<PrototypeRequest[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const navigate = useNavigate()

  const checkAuth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/admin/login')
        return
      }

      const { data: admin, error } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (error || !admin) {
        await supabase.auth.signOut()
        navigate('/admin/login')
        return
      }

      setAuthed(true)
      setLoading(false)
    } catch {
      navigate('/admin/login')
    }
  }, [navigate])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const loadData = useCallback(async () => {
    if (!authed) return
    try {
      const [msgRes, inqRes, prodRes] = await Promise.all([
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('prototype_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
      ])

      if (msgRes.error) throw msgRes.error
      if (inqRes.error) throw inqRes.error
      if (prodRes.error) throw prodRes.error

      setMessages(msgRes.data ?? [])
      setInquiries(inqRes.data ?? [])
      setProducts(prodRes.data ?? [])
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    }
  }, [authed])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const updateMessageStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id)
    if (error) {
      console.error('Failed to update status:', error)
      return
    }
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)))
  }

  const updateInquiryStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('prototype_requests').update({ status }).eq('id', id)
    if (error) {
      console.error('Failed to update status:', error)
      return
    }
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <svg className="animate-spin w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (!authed) return null

  const newMessages = messages.filter((m) => m.status === 'new').length
  const newInquiries = inquiries.filter((i) => i.status === 'pending').length

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50">
      <div className="container-x py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Manage inquiries, messages, and products</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="btn-outline text-sm py-2 px-4">View Site</Link>
            <button onClick={handleSignOut} className="btn-primary text-sm py-2 px-4 bg-error-600 hover:bg-error-700">
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Messages" value={messages.length} accent="primary" />
          <StatCard label="New Messages" value={newMessages} accent="warning" />
          <StatCard label="Prototype Requests" value={inquiries.length} accent="accent" />
          <StatCard label="Products" value={products.length} accent="success" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {([
            { key: 'overview', label: 'Overview' },
            { key: 'messages', label: `Messages${newMessages > 0 ? ` (${newMessages})` : ''}` },
            { key: 'inquiries', label: `Inquiries${newInquiries > 0 ? ` (${newInquiries})` : ''}` },
            { key: 'products', label: `Products (${products.length})` },
          ] as { key: Tab; label: string }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-4">Recent Messages</h2>
              {messages.length === 0 ? (
                <p className="text-slate-400 text-sm">No messages yet.</p>
              ) : (
                <div className="space-y-3">
                  {messages.slice(0, 5).map((msg) => (
                    <div key={msg.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-slate-900">{msg.name}</p>
                        <p className="text-sm text-slate-500">{msg.email} - {msg.service || 'General'}</p>
                      </div>
                      <StatusBadge status={msg.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-4">Recent Inquiries</h2>
              {inquiries.length === 0 ? (
                <p className="text-slate-400 text-sm">No prototype requests yet.</p>
              ) : (
                <div className="space-y-3">
                  {inquiries.slice(0, 5).map((inq) => (
                    <div key={inq.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-slate-900">{inq.name}</p>
                        <p className="text-sm text-slate-500">{inq.email}</p>
                      </div>
                      <StatusBadge status={inq.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-slate-400">No messages received yet.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="card p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{msg.name}</h3>
                      <p className="text-sm text-slate-500">{msg.email}{msg.phone && ` - ${msg.phone}`}</p>
                      {msg.company && <p className="text-sm text-slate-400">{msg.company}</p>}
                    </div>
                    <StatusBadge status={msg.status} />
                  </div>
                  {msg.service && (
                    <p className="text-xs text-primary-600 font-semibold mb-2">Service: {msg.service}</p>
                  )}
                  <p className="text-slate-600 text-sm bg-slate-50 rounded-xl p-3">{msg.message}</p>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-slate-400">{new Date(msg.created_at).toLocaleString()}</p>
                    <select
                      value={msg.status}
                      onChange={(e) => updateMessageStatus(msg.id, e.target.value)}
                      className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:border-primary-500"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="responded">Responded</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-slate-400">No prototype requests yet.</p>
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="card p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{inq.name}</h3>
                      <p className="text-sm text-slate-500">{inq.email}{inq.phone && ` - ${inq.phone}`}</p>
                      {inq.company && <p className="text-sm text-slate-400">{inq.company}</p>}
                    </div>
                    <StatusBadge status={inq.status} />
                  </div>
                  <p className="text-slate-600 text-sm bg-slate-50 rounded-xl p-3">{inq.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-slate-400">{new Date(inq.created_at).toLocaleString()}</p>
                    <select
                      value={inq.status}
                      onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                      className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:border-primary-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_review">In Review</option>
                      <option value="quoted">Quoted</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Featured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">{p.name}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">{p.brand}</td>
                    <td className="px-6 py-3 text-sm text-slate-600 capitalize">{p.product_type}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.in_stock ? 'bg-success-100 text-success-700' : 'bg-slate-100 text-slate-500'}`}>
                        {p.in_stock ? 'In Stock' : 'Out'}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {p.featured && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary-100 text-primary-700">Yes</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  const colors: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-700',
    warning: 'bg-warning-50 text-warning-600',
    accent: 'bg-accent-50 text-accent-700',
    success: 'bg-success-50 text-success-700',
  }
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold text-slate-400 uppercase mb-1">{label}</p>
      <p className={`font-display text-3xl font-extrabold ${colors[accent]?.split(' ')[1] || 'text-slate-900'}`}>{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: 'bg-primary-100 text-primary-700',
    pending: 'bg-warning-100 text-warning-600',
    read: 'bg-slate-100 text-slate-600',
    responded: 'bg-success-100 text-success-700',
    closed: 'bg-slate-100 text-slate-500',
    in_review: 'bg-accent-100 text-accent-700',
    quoted: 'bg-primary-100 text-primary-700',
    completed: 'bg-success-100 text-success-700',
    rejected: 'bg-error-100 text-error-700',
  }
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
      {label}
    </span>
  )
}
