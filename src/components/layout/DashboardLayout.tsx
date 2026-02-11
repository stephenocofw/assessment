import { type ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Menu, Sun, Moon, Settings as SettingsIcon, TrendingUp, Stethoscope, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { useState, useEffect, useMemo } from 'react';
import { useIncidents } from '../../context/IncidentContext';

export function DashboardLayout({ children }: { children: ReactNode }) {
    // Theme state (lifted from App.tsx or managed here if specific to dashboard, 
    // but better to keep theme global. For now, we'll duplicate the toggle logic 
    // or assume it's passed down. To keep it simple for this refactor, 
    // I'll re-implement the local state here or we can move ThemeProvider later.
    // simpler: Let's assume App.tsx handles the class toggle on body/html, 
    // and we just need a button to trigger it. 
    // Actually, let's keep the state in App.tsx and pass it down via Context or 
    // just re-implement standard localStorage logic here for the UI toggle state.

    // REFACTOR DECISION: To avoid prop drilling from App.tsx (which will become just a router),
    // let's keep the theme logic in App.tsx but maybe expose a context? 
    // OR just duplicate the simple localStorage read for the UI state for now.

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark';
    });

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        const root = window.document.documentElement;
        if (newMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // Ensure theme is applied on mount
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) root.classList.add('dark');
        else root.classList.remove('dark');
    }, [isDarkMode]);

    const { incidents } = useIncidents();

    const pendingTriageCount = useMemo(() => {
        return incidents.filter(i =>
            (i.medicalTreatment || i.potentialSIF) &&
            i.status === 'Open'
        ).length;
    }, [incidents]);

    const activeAssessmentCount = useMemo(() => {
        return incidents.filter(i => i.status === 'Investigating').length;
    }, [incidents]);

    return (
        <div className="min-h-screen bg-background text-foreground flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border/40 bg-[#F9FAFB] p-4 hidden md:flex flex-col justify-between">
                <div>
                    {/* Logo Area */}
                    <div className="mb-6 px-2">
                        <Link to="/" className="block">
                            <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                                Hiviz.
                            </h1>
                        </Link>
                    </div>

                    {/* Team Workspace Card */}
                    <div className="mb-6 mx-2 p-3 bg-white border border-border/50 rounded-xl flex items-center gap-3 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                            <Users size={16} />
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground font-medium">Team</div>
                            <div className="text-sm font-semibold text-foreground">Forge Works</div>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <NavLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                        <NavLink to="/triage" icon={<Stethoscope size={20} />} label="Triage" count={pendingTriageCount} />
                        <NavLink to="/assessments" icon={<ClipboardList size={20} />} label="Assessments" count={activeAssessmentCount} />
                        <NavLink to="/trends" icon={<TrendingUp size={20} />} label="Trends" />
                        <NavLink to="/settings" icon={<SettingsIcon size={20} />} label="Settings" />
                    </nav>
                </div>

                {/* Theme Toggle & User */}
                <div className="px-2 pb-4 space-y-4">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                            SO
                        </div>
                        <div className="text-sm font-medium">Stephen O.</div>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-md hover:bg-black/5 text-muted-foreground transition-all duration-200"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="text-sm font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-white">
                <header className="md:hidden border-b border-border p-4 flex items-center justify-between bg-card">
                    <h1 className="text-xl font-black">Hiviz.</h1>
                    <div className="flex gap-4 items-center">
                        <button onClick={toggleTheme}>
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button><Menu size={24} /></button>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavLink({ to, icon, label, count }: { to: string; icon: React.ReactNode; label: string; count?: number }) {
    const location = useLocation();
    const isActive = to === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(to);

    return (
        <Link
            to={to}
            className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mx-2",
                isActive
                    ? "bg-brand-yellow text-black font-bold shadow-sm"
                    : "text-gray-600 hover:bg-black/5 hover:text-black font-medium"
            )}
        >
            {icon}
            <span className="text-sm flex-1">{label}</span>
            {count !== undefined && count > 0 && (
                <span className={clsx(
                    "text-xs font-bold px-2 py-0.5 rounded-md",
                    isActive ? "bg-black/10 text-black" : "bg-blue-100 text-blue-700"
                )}>
                    {count}
                </span>
            )}
        </Link>
    );
}
