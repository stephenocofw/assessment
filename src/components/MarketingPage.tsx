import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, ShieldCheck, TrendingUp, BarChart3, Users, History, Clock, LineChart, Settings2 } from 'lucide-react';

export function MarketingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Navigation */}
            <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">FW</span>
                        Forge Works
                    </div>
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
                        <a href="#features" className="hover:text-foreground transition-colors">How it Works</a>
                        <a href="#toolkit" className="hover:text-foreground transition-colors">Toolkit</a>
                        <a href="#benefits" className="hover:text-foreground transition-colors">Benefits</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link to="/">
                            <Button>Launch Demo <ArrowRight className="ml-2 w-4 h-4" /></Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 md:py-32 px-6 text-center space-y-8 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        New Systemic Intelligence Engine
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Beyond Root Cause.<br />
                        <span className="text-primary">Systemic Understanding.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Move from blaming individuals to understanding the conditions that create risk.
                        Forge Works helps you identify, enable, and execute safe work by analyzing systemic factors.
                    </p>
                    <div className="flex justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                        <Link to="/">
                            <Button size="lg" className="h-12 px-8 text-lg">
                                Start Assessment Demo
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                            Read the Whitepaper
                        </Button>
                    </div>
                </section>

                {/* Features / Framework Section */}
                <section id="features" className="py-20 bg-muted/30">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl font-bold tracking-tight">The G.E.E. Framework</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Safety is an emergent property of a complex system. We break it down into three manageable layers of influence.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Guide */}
                            <div className="bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">Guide</h3>
                                <p className="text-muted-foreground mb-4">
                                    Strategic direction, leadership behaviors, and risk management frameworks that set the tone.
                                </p>
                                <ul className="space-y-2 text-sm text-foreground/80">
                                    <li className="flex gap-2"><span className="text-blue-500">•</span> Leadership Priorities</li>
                                    <li className="flex gap-2"><span className="text-blue-500">•</span> Strategic Goals</li>
                                    <li className="flex gap-2"><span className="text-blue-500">•</span> Risk Anticipation</li>
                                </ul>
                            </div>

                            {/* Enable */}
                            <div className="bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-amber-600 dark:text-amber-400">Enable</h3>
                                <p className="text-muted-foreground mb-4">
                                    The "messy middle" where resources, systems, and constraints meet operational reality.
                                </p>
                                <ul className="space-y-2 text-sm text-foreground/80">
                                    <li className="flex gap-2"><span className="text-amber-500">•</span> Resources & Budget</li>
                                    <li className="flex gap-2"><span className="text-amber-500">•</span> Operational Management</li>
                                    <li className="flex gap-2"><span className="text-amber-500">•</span> Goal Conflicts</li>
                                </ul>
                            </div>

                            {/* Execute */}
                            <div className="bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-6">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">Execute</h3>
                                <p className="text-muted-foreground mb-4">
                                    Work as done. The sharp end where people adapt and make decisions in real-time.
                                </p>
                                <ul className="space-y-2 text-sm text-foreground/80">
                                    <li className="flex gap-2"><span className="text-green-500">•</span> Frontline Decision Making</li>
                                    <li className="flex gap-2"><span className="text-green-500">•</span> Communication</li>
                                    <li className="flex gap-2"><span className="text-green-500">•</span> Adaptability</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Powerful Capabilities Section */}
                <section id="toolkit" className="py-20 px-6 bg-background">
                    <div className="max-w-7xl mx-auto space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-bold tracking-tight">Complete Investigation Toolkit</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Everything you need to move from "who is to blame" to "what needs to change".
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Feature 1: Timeline */}
                            <div className="group relative overflow-hidden rounded-2xl border bg-muted/20 p-8 transition-all hover:bg-muted/40 hover:shadow-lg">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Clock className="w-24 h-24" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <History className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold">Timeline Reconstruction</h3>
                                    <p className="text-muted-foreground">
                                        Visual drag-and-drop timeline builder. Map events directly to systemic factors using our guided side-panel helper.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2: Trends */}
                            <div className="group relative overflow-hidden rounded-2xl border bg-muted/20 p-8 transition-all hover:bg-muted/40 hover:shadow-lg">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <LineChart className="w-24 h-24" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold">Systemic Trends</h3>
                                    <p className="text-muted-foreground">
                                        Track Medical Treatment and SIF Potential incidents. Aggregate data to find recurring latent conditions across your entire sites and fleet.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3: Smart Triage */}
                            <div className="group relative overflow-hidden rounded-2xl border bg-muted/20 p-8 transition-all hover:bg-muted/40 hover:shadow-lg">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <ShieldCheck className="w-24 h-24" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold">Smart Triage & Classification</h3>
                                    <p className="text-muted-foreground">
                                        Standardize notification and reporting. Clearly classify Severity, Medical Treatment, and Recordable Outcomes immediately.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 4: Executive Reporting */}
                            <div className="group relative overflow-hidden rounded-2xl border bg-muted/20 p-8 transition-all hover:bg-muted/40 hover:shadow-lg">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Settings2 className="w-24 h-24" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <Settings2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold">Executive Reporting</h3>
                                    <p className="text-muted-foreground">
                                        One-click, print-ready systemic investigation summaries. Generate beautiful reports that focus on organizational learning.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section id="benefits" className="py-20 px-6">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight mb-4">Why Forge Works?</h2>
                                <p className="text-muted-foreground text-lg">
                                    Traditional safety reporting stops at "human error" or "procedure violation".
                                    Forge Works digs deeper to find the systemic leverage points.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <BarChart3 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Data-Driven Insights</h4>
                                        <p className="text-muted-foreground">Visualize which systemic factors are contributing to success (recovery) or failure (incidents).</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Proactive Improvement</h4>
                                        <p className="text-muted-foreground">Identify latent conditions before they result in a serious incident.</p>
                                    </div>
                                </div>
                            </div>

                            <Link to="/">
                                <Button size="lg">See the Dashboard</Button>
                            </Link>
                        </div>

                        {/* Abstract Visual/Screenshot Placeholder */}
                        <div className="relative rounded-2xl overflow-hidden border shadow-2xl bg-muted aspect-video flex items-center justify-center group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50" />
                            <div className="p-8 text-center space-y-2 z-10">
                                <div className="text-4xl">📊</div>
                                <div className="font-medium text-muted-foreground">Interactive Dashboard Preview</div>
                                <p className="text-xs text-muted-foreground/70">Click 'Launch Demo' to explore</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-border py-12 bg-muted/20">
                <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground text-sm">
                    <p>&copy; {new Date().getFullYear()} Forge Works. Built for Systemic Safety.</p>
                </div>
            </footer>
        </div>
    );
}
