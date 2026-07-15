import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, Upload, MessageSquare, CheckCircle, X, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { contactInfo } from '../../data/products';
import { sendEnquiryEmail } from '../../lib/sendEnquiryEmail';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const services = [
  { value: '3d-printing-services', label: '3D Printing Services' },
  { value: 'cad-design', label: 'CAD Design' },
  { value: 'rapid-prototyping', label: 'Rapid Prototyping' },
  { value: 'reverse-engineering', label: 'Reverse Engineering' },
  { value: 'product-design', label: 'Product Design' },
  { value: '3d-scanning-services', label: '3D Scanning' },
  { value: 'product-enquiry', label: 'Product Purchase Enquiry' },
  { value: 'other', label: 'Other' },
];

export function ContactSection() {
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const inquiryType = searchParams.get('type');
  const productName = searchParams.get('product');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  useEffect(() => {
    if (inquiryType === 'buy') setValue('service', 'product-enquiry');
    if (productName) setValue('message', `I am interested in purchasing: ${decodeURIComponent(productName)}`);
  }, [inquiryType, productName, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    try {
      // Upload attachments
      const fileLinks: string[] = [];
      for (const file of attachments) {
        const ext = file.name.split('.').pop() || 'bin';
        const path = `contact/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: uploaded } = await supabase.storage.from('site-media').upload(path, file);
        if (uploaded) {
          const { data: { publicUrl } } = supabase.storage.from('site-media').getPublicUrl(path);
          fileLinks.push(publicUrl);
        }
      }

      // Insert into DB
      const { error } = await supabase.from('contact_messages').insert({
        name: data.name,
        email: data.email,
        company: data.company || null,
        phone: data.phone || null,
        service: data.service,
        subject: data.service,
        message: data.message,
        status: 'new',
      });

      if (error) throw error;

      // Send email notification
      await sendEnquiryEmail({
        enquiryType: 'Contact Form',
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        service: data.service,
        message: data.message,
        fileLinks: fileLinks.length ? fileLinks : undefined,
      });

      reset();
      setAttachments([]);
      setSubmitted(true);
    } catch (err) {
      console.error('Contact form error:', err);
      alert('Failed to send message. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-padding bg-gradient-to-b from-navy-50 to-white dark:from-navy-900 dark:to-navy-950">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="badge badge-accent mb-4">Get in Touch</span>
          <h2 className="section-heading">Let's Build Something Together</h2>
          <p className="section-subheading mx-auto">
            Have a project in mind? Our team is ready to help you bring it to life.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Contact Info Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Info cards */}
            <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-navy-100 dark:border-navy-700 space-y-4">
              {[
                { icon: MapPin, label: 'Address', content: <p className="text-sm text-navy-500 dark:text-navy-400">{contactInfo.address}<br />{contactInfo.city}, {contactInfo.state} {contactInfo.zip}</p> },
                { icon: Phone, label: 'Phone', content: <a href={`tel:${contactInfo.phone}`} className="text-sm text-navy-500 dark:text-navy-400 hover:text-accent-500 transition-colors">{contactInfo.phone}</a> },
                { icon: Mail, label: 'Email', content: <a href={`mailto:${contactInfo.email}`} className="text-sm text-navy-500 dark:text-navy-400 hover:text-accent-500 transition-colors">{contactInfo.email}</a> },
                { icon: Clock, label: 'Business Hours', content: <div>{contactInfo.hours.map(h => <p key={h.day} className="text-sm text-navy-500 dark:text-navy-400">{h.day}: {h.hours}</p>)}</div> },
              ].map(({ icon: Icon, label, content }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-accent-100 dark:bg-accent-500/10 flex-shrink-0">
                    <Icon className="w-5 h-5 text-accent-500" />
                  </div>
                  <div><p className="font-medium text-navy-900 dark:text-white">{label}</p>{content}</div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden relative bg-navy-100 dark:bg-navy-700" style={{ height: '280px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3170.9516222012385!2d73.9463554740958!3d15.364516957920044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb9fd2f77e913%3A0x58cdf563c2748ba!2sInfinyt3D%20Pvt.%20Ltd.!5e1!3m2!1sen!2sin!4v1783352528509!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Infinyt 3D Pvt. Ltd. Location" className="absolute inset-0" />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 lg:p-8 border border-navy-100 dark:border-navy-700">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-navy-900 dark:text-white mb-2">Thank You!</h3>
                  <p className="text-navy-500 dark:text-navy-400">Your message has been sent. We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 btn-outline">Send Another Message</button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="font-semibold text-navy-900 dark:text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-accent-500" />
                      {inquiryType === 'buy' ? 'Product Purchase Enquiry' : 'Send us a Message'}
                    </h3>
                    {productName && <p className="text-sm text-navy-500 dark:text-navy-400 mt-1">Enquiring about: <span className="text-accent-500 font-medium">{decodeURIComponent(productName)}</span></p>}
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-1.5">Full Name *</label>
                        <input {...register('name')} placeholder="Your name"
                          className="w-full px-4 py-2.5 border border-navy-200 dark:border-navy-600 rounded-xl bg-white dark:bg-navy-900 text-navy-900 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-1.5">Email *</label>
                        <input {...register('email')} type="email" placeholder="you@company.com"
                          className="w-full px-4 py-2.5 border border-navy-200 dark:border-navy-600 rounded-xl bg-white dark:bg-navy-900 text-navy-900 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-1.5">Company</label>
                        <input {...register('company')} placeholder="Company (optional)"
                          className="w-full px-4 py-2.5 border border-navy-200 dark:border-navy-600 rounded-xl bg-white dark:bg-navy-900 text-navy-900 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-1.5">Phone</label>
                        <input {...register('phone')} placeholder="+91 99999 00000"
                          className="w-full px-4 py-2.5 border border-navy-200 dark:border-navy-600 rounded-xl bg-white dark:bg-navy-900 text-navy-900 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-1.5">Service *</label>
                      <select {...register('service')}
                        className="w-full px-4 py-2.5 border border-navy-200 dark:border-navy-600 rounded-xl bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500">
                        <option value="">Select a service…</option>
                        {services.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                      {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-1.5">Message *</label>
                      <textarea {...register('message')} rows={5} placeholder="Describe your project, requirements, or questions…"
                        className="w-full px-4 py-2.5 border border-navy-200 dark:border-navy-600 rounded-xl bg-white dark:bg-navy-900 text-navy-900 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 resize-none" />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                    </div>

                    {/* File attachments */}
                    <div>
                      <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-1.5">Attachments (optional)</label>
                      <div className="flex items-center gap-3 flex-wrap">
                        <button type="button" onClick={() => fileRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-navy-300 dark:border-navy-600 rounded-xl text-navy-500 hover:text-accent-500 hover:border-accent-500 transition-colors text-sm">
                          <Upload className="w-4 h-4" /> Attach Files
                        </button>
                        {attachments.map((f, i) => (
                          <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-100 dark:bg-navy-700 rounded-xl text-sm text-navy-700 dark:text-navy-300">
                            <FileText className="w-4 h-4 text-accent-500" />
                            {f.name}
                            <button type="button" onClick={() => setAttachments(a => a.filter((_, j) => j !== i))} className="text-navy-400 hover:text-red-500 ml-0.5">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input ref={fileRef} type="file" multiple className="hidden"
                        onChange={e => setAttachments(a => [...a, ...Array.from(e.target.files || [])])} />
                    </div>

                    <button type="submit" disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50">
                      {submitting ? (
                        <><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />Sending…</>
                      ) : (
                        <><Send className="w-5 h-5" />Send Message</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
