import { useState } from 'react'
import { submitContactMessage } from '../lib/queries'
import GoogleRating from '../components/GoogleRating'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')
    try {
      await submitContactMessage(form)
      setStatus('success')
      setForm({ name: '', email: '', phone: '', company: '', service: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
    }
  }

  const contactInfo = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      ),
      label: 'Email',
      value: 'info@infinyt3d.com',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
      ),
      label: 'Phone',
      value: '+91 99999 99999',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      ),
      label: 'Location',
      value: 'India',
    },
  ]

  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-slate-50 to-primary-50/30 py-12">
        <div className="container-x">
          <h1 className="font-display text-4xl font-extrabold text-slate-900 mb-2">Get in Touch</h1>
          <p className="text-slate-600 max-w-2xl">
            Have a project in mind? Send us a message and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact info */}
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.label} className="card p-6 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase mb-1">{info.label}</p>
                    <p className="text-slate-900 font-semibold">{info.value}</p>
                  </div>
                </div>
              ))}
              <div className="card p-6">
                <p className="text-xs text-slate-400 font-semibold uppercase mb-3">Customer Rating</p>
                <GoogleRating size="md" />
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="card p-8">
                {status === 'success' ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Message Sent!</h2>
                    <p className="text-slate-600 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="btn-outline"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                          Name <span className="text-error-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={form.name}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                          Email <span className="text-error-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="+91 99999 99999"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company</label>
                        <input
                          type="text"
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Company name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service of Interest</label>
                      <select
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        className="input-field cursor-pointer"
                      >
                        <option value="">Select a service</option>
                        <option value="3D Printing">3D Printing</option>
                        <option value="Product Design">Product Design</option>
                        <option value="Rapid Prototyping">Rapid Prototyping</option>
                        <option value="3D Scanning">3D Scanning</option>
                        <option value="Filaments & Materials">Filaments & Materials</option>
                        <option value="Training & Support">Training & Support</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Message <span className="text-error-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        className="input-field resize-none"
                        placeholder="Tell us about your project..."
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
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
