import { type ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Menu, Sun, Moon, Settings as SettingsIcon, TrendingUp, Stethoscope } from 'lucide-react';
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
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card p-4 hidden md:flex flex-col justify-between">
                <div>
                    <div className="mb-8 px-2">
                        <Link to="/" className="block">
                            <h1 className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">FW</span>
                                Forge Works
                            </h1>
                            <p className="text-xs text-muted-foreground mt-1 ml-10">Systemic Safety</p>
                        </Link>
                    </div>

                    <nav className="space-y-1">
                        <NavLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                        {/* <NavLink to="/report" icon={<FilePlus size={20} />} label="New Report" /> */}
                        <NavLink to="/triage" icon={<Stethoscope size={20} />} label="Triage" count={pendingTriageCount} />
                        <NavLink to="/assessments" icon={<ClipboardList size={20} />} label="Assessments" count={activeAssessmentCount} />
                        <NavLink to="/trends" icon={<TrendingUp size={20} />} label="Trends" />
                        <NavLink to="/settings" icon={<SettingsIcon size={20} />} label="Settings" />
                    </nav>
                </div>

                {/* Theme Toggle in Sidebar */}
                <div className="px-2 pb-4">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-all duration-200"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="text-sm font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-muted/10">
                <header className="md:hidden border-b border-border p-4 flex items-center justify-between bg-card">
                    <h1 className="text-lg font-bold">Forge Works</h1>
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
    // Active if exact match OR if it's a nested route (e.g. /assessments/123 matches /assessments)
    // Exception: Dashboard (/) should only match exactly /
    const isActive = to === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(to);

    return (
        <Link
            to={to}
            className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
                isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            )}
        >
            {icon}
            <span className="text-sm font-medium flex-1">{label}</span>
            {count !== undefined && count > 0 && (
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                    {count}
                </span>
            )}
        </Link>
    );
}
