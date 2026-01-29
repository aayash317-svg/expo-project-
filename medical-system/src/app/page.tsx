import Link from "next/link";
import { ArrowRight, Shield, Stethoscope, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">HealthOne</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#security" className="hover:text-foreground transition-colors">Security</Link>
          <Link href="#about" className="hover:text-foreground transition-colors">About</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login/patient" className="text-sm font-medium hover:text-primary transition-colors">
            Login
          </Link>
          <Link href="/signup/patient" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-primary/20">
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />

          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              One Identity. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Complete Health History.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A secure, unified platform connecting patients, hospitals, and insurers.
              Access your medical life anytime, anywhere with verifiable cryptographic security.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/signup/patient" className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:translate-y-0.5 hover:shadow-xl transition-all flex items-center justify-center gap-2">
                Register as Patient <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex gap-2">
                <Link href="/login/hospital" className="w-full sm:w-auto px-6 py-3 bg-secondary text-secondary-foreground border border-border rounded-full font-semibold text-lg hover:bg-secondary/80 transition-all flex items-center justify-center gap-2">
                  Hospitals
                </Link>
                <Link href="/login/insurance" className="w-full sm:w-auto px-6 py-3 bg-secondary text-secondary-foreground border border-border rounded-full font-semibold text-lg hover:bg-secondary/80 transition-all flex items-center justify-center gap-2">
                  Insurers
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Portals Grid */}
        <section className="px-6 py-20 bg-muted/50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <PortalCard
              title="Hospital Portal"
              description="Secure access for medical professionals to view history and update records."
              icon={<Stethoscope className="h-6 w-6" />}
              href="/login/hospital"
              signupHref="/signup/hospital"
              color="text-emerald-500"
            />
            <PortalCard
              title="Insurance Portal"
              description="Real-time policy management, claims processing, and coverage verification."
              icon={<FileText className="h-6 w-6" />}
              href="/login/insurance"
              signupHref="/signup/insurance"
              color="text-blue-500"
            />
            <PortalCard
              title="Patient Portal"
              description="Your complete health timeline. Manage consents and view records securely."
              icon={<Shield className="h-6 w-6" />}
              href="/login/patient"
              signupHref="/signup/patient"
              color="text-indigo-500"
            />
          </div>
        </section>
      </main>

      <footer className="px-6 py-8 border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; 2026 HealthOne Systems. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Compliance</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PortalCard({ title, description, icon, href, signupHref, color }: { title: string, description: string, icon: React.ReactNode, href: string, signupHref: string, color: string }) {
  return (
    <div className="group relative bg-card hover:bg-accent/50 p-6 rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-lg flex flex-col">
      <div className={`h-12 w-12 rounded-xl bg-background border border-border flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground mb-4 flex-1">{description}</p>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <Link href={href} className="text-sm font-medium text-center py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
          Login
        </Link>
        <Link href={signupHref} className="text-sm font-medium text-center py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
          Register
        </Link>
      </div>
    </div>
  )
}
