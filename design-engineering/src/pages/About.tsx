import { Link } from 'react-router-dom'
import GoogleRating from '../components/GoogleRating'
import BrandLogo from '../components/BrandLogo'

const partners = ['Bambu Lab', 'Creality', 'Elegoo', 'Anycubic', 'Phrozen']

const values = [
  {
    title: 'Innovation',
    description: 'We stay at the cutting edge of 3D printing technology to deliver the best results.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
  },
  {
    title: 'Quality',
    description: 'Every project meets stringent quality standards with ISO-certified processes.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
  },
  {
    title: 'Reliability',
    description: 'On-time delivery and consistent results you can count on, project after project.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
  },
  {
    title: 'Partnership',
    description: 'We work alongside you as a trusted partner, not just a service provider.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    ),
  },
]

export default function About() {
  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-slate-50 to-primary-50/30 py-12">
        <div className="container-x">
          <h1 className="font-display text-4xl font-extrabold text-slate-900 mb-2">About Infinyt 3D</h1>
          <p className="text-slate-600 max-w-2xl">
            Your trusted partner in additive manufacturing and 3D printing solutions.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Infinyt 3D Workshop"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">
                Who We Are
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Infinyt 3D Pvt. Ltd. is a leading provider of 3D printing, design, and manufacturing solutions. We specialize in delivering high-quality additive manufacturing services to businesses across industries.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                From rapid prototyping to production runs, our team of experts uses state-of-the-art equipment and premium materials to bring your ideas to life. We are authorized partners of the world's leading 3D printing brands.
              </p>
              <div className="flex items-center gap-6">
                <GoogleRating size="md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-slate-50">
        <div className="container-x">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">Our Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="card p-7 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-5">
                  {value.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16">
        <div className="container-x">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">Our Partners</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We are proud to be authorized partners of these leading 3D printing brands.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {partners.map((brand) => (
              <BrandLogo key={brand} brand={brand} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-900">
        <div className="container-x text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Let's Build Something Together
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Whether you need a single prototype or a production run, we're here to help.
          </p>
          <Link to="/contact" className="btn-primary">Get in Touch</Link>
        </div>
      </section>
    </div>
  )
}
