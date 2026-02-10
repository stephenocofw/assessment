import React from 'react';
import { useIncidents } from '../context/IncidentContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, AlertTriangle, FileBarChart2 } from 'lucide-react';
import { clsx } from 'clsx';
import { SystemHealthCharts } from './analytics/SystemHealthCharts';
import { KeyMetricCharts } from './analytics/KeyMetricCharts';

export function Dashboard() {
    const { incidents, investigations } = useIncidents();
    const navigate = useNavigate();

    const investigatingCount = incidents.filter(i => i.status === 'Investigating').length;

    // Calculate Monthly Total Incidents (All types)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyIncidentCount = incidents.filter(i => {
        const d = new Date(i.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">System Overview</h2>
                    <p className="text-muted-foreground">Monitor safety performance and systemic health.</p>
                </div>
                <Button onClick={() => navigate('/report')}>
                    <Plus className="mr-2 h-4 w-4" /> New Incident
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                <StatsCard
                    title="Open Investigations"
                    value={investigatingCount}
                    icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
                    description="Requires systemic assessment"
                />
                <StatsCard
                    title="Total Incidents (Month)"
                    value={monthlyIncidentCount}
                    icon={<FileBarChart2 className="h-4 w-4 text-emerald-500" />}
                    description="Included SIF & Minor"
                />
            </div>

            {/* Analytics Charts */}
            <div className="grid gap-4 md:grid-cols-1">
                <KeyMetricCharts />
                <SystemHealthCharts />
            </div>

            {/* Recent Incidents */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Recent Activity</h3>
                <div className="grid gap-4">
                    {incidents.slice(0, 5).map(incident => (
                        <Card key={incident.id} className="hover:bg-accent/5 transition-colors cursor-pointer" onClick={() => navigate(`/investigations/${incident.id}`)}>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className={clsx(
                                            "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                                            incident.status === 'Investigating'
                                                ? "bg-amber-50 text-amber-700 ring-amber-600/20"
                                                : "bg-green-50 text-green-700 ring-green-600/20"
                                        )}>
                                            {incident.status}
                                        </span>
                                        <span className="text-sm text-muted-foreground">{incident.date}</span>
                                    </div>
                                    <h4 className="font-semibold">{incident.title}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{incident.whatHappened}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Check if investigation exists */}
                                    {investigations.find(inv => inv.incidentId === incident.id) && (
                                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">Assessment Started</span>
                                    )}
                                    <Button variant="ghost" size="icon">
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, description }: { title: string, value: string | number, icon: React.ReactNode, description: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
            </CardContent>
        </Card>
    )
}
