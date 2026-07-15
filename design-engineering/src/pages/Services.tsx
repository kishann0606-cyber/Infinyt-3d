import { Link } from 'react-router-dom'

const services = [
  {
    title: '3D Printing Services',
    description: 'Industrial-grade FDM, SLA, and resin printing with exceptional precision and surface finish.',
    features: ['FDM & SLA printing', 'Multi-color capabilities', 'Production-grade materials', 'Layer resolution down to 0.08mm'],
    image: 'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Product Design & CAD',
    description: 'From concept sketches to production-ready CAD models, our design team brings your ideas to life.',
    features: ['3D CAD modeling', 'Design optimization', ' prototyping consultation', 'STL/OBJ file preparation'],
    image: 'https://images.pexels.com/photos/8566534/pexels-photo-8566534.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Rapid Prototyping',
    description: 'Fast turnaround prototyping to validate designs, test functionality, and iterate quickly.',
    features: ['24-48hr turnaround', 'Functional prototypes', 'Design validation', 'Material testing'],
    image: 'https://images.pexels.com/photos/8566530/pexels-photo-8566530.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: '3D Scanning & Reverse Engineering',
    description: 'Professional 3D scanning services for reverse engineering and quality inspection.',
    features: ['High-accuracy scanning', 'Reverse engineering', 'Quality inspection', 'CAD comparison'],
    image: 'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Filaments & Materials',
    description: 'Wide range of engineering-grade filaments and resins for every application.',
    features: ['PLA, ABS, PETG, TPU', 'Nylon & Carbon Fiber', 'Engineering resins', 'Custom material sourcing'],
    image: 'https://images.pexels.com/photos/8566534/pexels-photo-8566534.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Training & Support',
    description: 'Expert training, calibration, and ongoing maintenance for your 3D printing equipment.',
    features: ['Operator training', 'Machine calibration', 'Preventive maintenance', 'Technical consultation'],
    image: 'https://images.pexels.com/photos/8566530/pexels-photo-8566530.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
]

export default function Services() {
  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-slate-50 to-primary-50/30 py-12">
        <div className="container-x">
          <h1 className="font-display text-4xl font-extrabold text-slate-900 mb-2">Our Services</h1>
          <p className="text-slate-600 max-w-2xl">
            Complete 3D printing solutions from design to production. We help you at every stage of your manufacturing journey.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service.title} className="card overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-7">
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">{service.title}</h2>
                  <p className="text-slate-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                        <svg className="w-4 h-4 text-success-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-10 lg:p-14 text-center">
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-primary-100 max-w-2xl mx-auto mb-6">
              Tell us about your project and we'll craft a solution tailored to your exact requirements.
            </p>
            <Link to="/contact" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-primary-600 font-semibold transition-all hover:shadow-lg active:scale-95">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
