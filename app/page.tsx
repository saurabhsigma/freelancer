import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Globe, Shield, Zap } from "lucide-react";
import { NavActions } from "@/components/nav-actions";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-rose-500/30">

      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Freelancer.
          </Link>
          <NavActions user={session?.user} />

        </div>
      </header>

      <main className="flex-1 pt-32 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto max-w-6xl px-6 mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 border border-blue-100 dark:border-blue-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            v2.0 Now Available
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-500 bg-clip-text text-transparent pb-2">
            Manage your freelance business <br className="hidden md:block" /> with confidence.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            All-in-one platform to manage clients, projects, invoices, and your public portfolio.
            Built for modern freelancers who want to look professional.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 rounded-full text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow">
                Start for free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {/* Using /signup as demo for now, or could link to a public profile if one exists. */}
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-12 px-8 rounded-full text-lg">
                View Demo
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto max-w-6xl px-6 mb-24">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Public Portfolio</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Showcase your work with a stunning, SEO-optimized public profile.
                Customizable themes and project galleries included.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Project Management</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Track milestones, deliverables, and deadlines.
                Keep your clients updated with real-time progress tracking.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Invoicing</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Create professional invoices and get paid faster.
                Integrated with Stripe for secure, global payments.
              </p>
            </div>
          </div>
        </section>

        {/* Social Proof / Footer CTA */}
        <section className="container mx-auto max-w-4xl px-6 text-center border-t border-slate-200 dark:border-slate-800 pt-24">
          <h2 className="text-3xl font-bold mb-6">Ready to upgrade your workflow?</h2>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10 text-slate-500 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" /> Free Tier Available
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" /> No Credit Card Required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" /> Open Source
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Freelancer SaaS. All rights reserved.
          </p>
        </section>
      </main>
    </div>
  );
}

