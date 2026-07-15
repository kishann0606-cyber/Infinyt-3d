import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Briefcase, Upload, CheckCircle, Send, X, FileText,
  MapPin, Clock, Users, Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sendEnquiryEmail } from '../lib/sendEnquiryEmail';

const careerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  position: z.string().min(1, 'Please select a position'),
  message: z.string().optional(),
});

type CareerFormData = z.infer<typeof careerSchema>;

const openings = [
  { title: '3D Printing Technician', type: 'Full-time', location: 'Verna, Goa' },
  { title: 'CAD Design Engineer', type: 'Full-time', location: 'Verna, Goa' },
  { title: 'Sales & Business Development', type: 'Full-time', location: 'Verna, Goa' },
  { title: 'Operations & Logistics', type: 'Full-time', location: 'Verna, Goa' },
  { title: 'Internship - Engineering', type: 'Internship', location: 'Verna, Goa' },
  { title: 'Other / Open Application', type: 'Any', location: 'Verna, Goa' },
];

const perks = [
  { icon: Zap, label: 'Cutting-edge tech', desc: 'Work with the latest 3D printers and scanners' },
  { icon: Users, label: 'Great team', desc: 'A passionate, collaborative environment' },
  { icon: Clock, label: 'Flexible hours', desc: 'Work-life balance matters to us' },
  { icon: MapPin, label: 'Beautiful Goa', desc: 'Located in the heart of South Goa' },
];

export function CareersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CareerFormData>({ resolver: zodResolver(careerSchema) });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCvFile(file);
  };

  const onSubmit = async (data: CareerFormData) => {
    try {
      setUploading(true);
      let cvUrl: string | null = null;
      let cvFilename: string | null = null;

      if (cvFile) {
        const ext = cvFile.name.split('.').pop();
        const path = `${Date.now()}_${data.name.replace(/\s+/g, '_')}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('career-cvs')
          .upload(path, cvFile, { cacheControl: '3600', upsert: false });

        if (!uploadError) {
          cvUrl = path;
          cvFilename = cvFile.name;
        }
      }

      const { error } = await supabase.from('career_applications').insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        message: data.message || null,
        resume_url: cvUrl,
        status: 'new',
      });

      if (error) throw error;

      // Fire-and-forget email notification
      sendEnquiryEmail({
        enquiryType: 'Career Application',
        name: data.name, email: data.email,
        phone: data.phone,
        service: data.position,
        message: data.message || 'No cover letter provided',
        fileLinks: cvUrl ? [cvUrl] : undefined,
      });

      setSubmitted(true);
      reset();
      setCvFile(null);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white">
        <div className="container-custom py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 bg-accent-500/20 border border-accent-500/30 text-accent-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Briefcase className="w-4 h-4" />
              We're hiring
            </span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Build the Future of Manufacturing
            </h1>
            <p className="text-lg text-navy-300 max-w-2xl">
              Join Infinyt3D — Goa's leading 3D printing company. We're looking for passionate people to help us transform ideas into reality.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-5 gap-12">

          {/* Left: Openings + Perks */}
          <div className="lg:col-span-2 space-y-10">
            {/* Current Openings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-5">Current Openings</h2>
              <div className="space-y-3">
                {openings.map((opening) => (
                  <div
                    key={opening.title}
                    className="flex items-start justify-between p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700"
                  >
                    <div>
                      <p className="font-medium text-navy-900 dark:text-white text-sm">{opening.title}</p>
                      <p className="text-xs text-navy-500 dark:text-navy-400 mt-0.5">{opening.location}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ml-3 ${
                      opening.type === 'Internship'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                        : opening.type === 'Any'
                        ? 'bg-navy-100 text-navy-600 dark:bg-navy-700 dark:text-navy-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                    }`}>
                      {opening.type}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Perks */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-5">Why Work With Us</h2>
              <div className="grid grid-cols-2 gap-3">
                {perks.map((perk) => (
                  <div
                    key={perk.label}
                    className="p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700"
                  >
                    <perk.icon className="w-5 h-5 text-accent-500 mb-2" />
                    <p className="font-medium text-navy-900 dark:text-white text-sm">{perk.label}</p>
                    <p className="text-xs text-navy-500 dark:text-navy-400 mt-0.5">{perk.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Application Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 lg:p-8 border border-navy-100 dark:border-navy-700">
              {submitted ? (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center mx-auto mb-5"
                  >
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">Application Received!</h3>
                  <p className="text-navy-500 dark:text-navy-400 max-w-sm mx-auto">
                    Thank you for your interest in joining Infinyt3D. We'll review your application and get back to you soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary mt-6"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-accent-500" />
                    Apply Now
                  </h2>
                  <p className="text-sm text-navy-500 dark:text-navy-400 mb-6">
                    Fill in your details and upload your CV. We'll be in touch.
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 dark:text-navy-200 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          {...register('name')}
                          className="input-field"
                          placeholder="John Doe"
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 dark:text-navy-200 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          {...register('email')}
                          className="input-field"
                          placeholder="john@example.com"
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 dark:text-navy-200 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          {...register('phone')}
                          className="input-field"
                          placeholder="+91 98765 43210"
                        />
                        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 dark:text-navy-200 mb-2">
                          Position Applying For *
                        </label>
                        <select {...register('position')} className="input-field">
                          <option value="">Select a role</option>
                          {openings.map((o) => (
                            <option key={o.title} value={o.title}>{o.title}</option>
                          ))}
                        </select>
                        {errors.position && <p className="text-sm text-red-500 mt-1">{errors.position.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 dark:text-navy-200 mb-2">
                        Cover Letter / Message
                      </label>
                      <textarea
                        {...register('message')}
                        rows={4}
                        className="input-field resize-none"
                        placeholder="Tell us about yourself, your experience, and why you'd like to join Infinyt3D..."
                      />
                    </div>

                    {/* CV Upload */}
                    <div>
                      <label className="block text-sm font-medium text-navy-700 dark:text-navy-200 mb-2">
                        Upload CV / Resume *
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {cvFile ? (
                        <div className="flex items-center gap-3 p-4 rounded-xl border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/5">
                          <FileText className="w-8 h-8 text-green-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-navy-900 dark:text-white truncate">{cvFile.name}</p>
                            <p className="text-xs text-navy-500 dark:text-navy-400">
                              {(cvFile.size / 1024).toFixed(0)} KB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCvFile(null)}
                            className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 text-navy-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-navy-200 dark:border-navy-600 rounded-xl p-6 text-center hover:border-accent-500 dark:hover:border-accent-500 transition-colors group"
                        >
                          <Upload className="w-8 h-8 text-navy-400 group-hover:text-accent-500 mx-auto mb-2 transition-colors" />
                          <p className="text-sm font-medium text-navy-600 dark:text-navy-300 group-hover:text-accent-500 transition-colors">
                            Click to upload your CV
                          </p>
                          <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">
                            PDF, DOC, DOCX (max 5MB)
                          </p>
                        </button>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting || uploading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-accent w-full"
                    >
                      {isSubmitting || uploading ? (
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Application
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
