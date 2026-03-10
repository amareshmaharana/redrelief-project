import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, Lock, Eye, Database, UserCheck, Globe, Mail } from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      'Personal identification information (name, email, phone number, date of birth)',
      'Health and medical information relevant to blood donation eligibility',
      'Blood type, donation history, and related medical records',
      'Location data when you use our camp finder or location-based services',
      'Device information and usage data for improving our services',
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: [
      'To process and manage blood donation registrations',
      'To match donors with recipients based on blood type compatibility',
      'To send notifications about blood camps, urgent requests, and donation reminders',
      'To maintain accurate medical records and ensure donation safety',
      'To improve our platform and develop new features',
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      'All data is encrypted in transit using TLS 1.3 and at rest using AES-256',
      'Access to personal health information is restricted to authorized personnel only',
      'Regular security audits and penetration testing are conducted',
      'We comply with healthcare data protection regulations including HIPAA standards',
      'Multi-factor authentication is enforced for all administrative access',
    ],
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: [
      'Right to access and download your personal data at any time',
      'Right to correct inaccurate or incomplete information',
      'Right to request deletion of your account and associated data',
      'Right to opt-out of non-essential communications',
      'Right to data portability in a machine-readable format',
    ],
  },
  {
    icon: Globe,
    title: 'Third-Party Sharing',
    content: [
      'We do not sell your personal information to third parties',
      'Data may be shared with partner hospitals solely for donation processing',
      'Anonymous, aggregated data may be used for public health research',
      'Law enforcement requests are handled in accordance with applicable laws',
      'Third-party service providers are bound by strict confidentiality agreements',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90 pt-32 pb-16 sm:pt-36 sm:pb-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30 mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <p className="mt-3 text-sm text-white/40">Last updated: March 8, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="group rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <section.icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="rounded-2xl bg-accent/50 border border-border p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Questions about your privacy?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Contact our Data Protection Officer at <span className="text-primary font-medium">privacy@bdms.org</span> or call our helpline at <span className="text-primary font-medium">1800-XXX-XXXX</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
