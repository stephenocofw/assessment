import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useIncidents } from '../../context/IncidentContext';
import { useMemo } from 'react';

export function KeyMetricCharts() {
    const { incidents } = useIncidents();

    const chartData = useMemo(() => {
        // 1. Initialize last 6 months buckets
        const today = new Date();
        const months: Record<string, { name: string; Medical: number; SIF: number; sortDate: Date }> = {};

        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = d.toLocaleString('default', { month: 'short' });
            months[key] = {
                name: key,
                Medical: 0,
                SIF: 0,
                sortDate: d
            };
        }

        // 2. Aggregate Data
        incidents.forEach(inc => {
            if (!inc.date) return;
            const incDate = new Date(inc.date);
            const monthKey = incDate.toLocaleString('default', { month: 'short' });

            if (months[monthKey]) {
                // Medical Treatment Count
                if (inc.medicalTreatment || inc.recordableType === 'Medical Treatment') {
                    months[monthKey].Medical += 1;
                }

                // SIF Incidents (Anything not Minor)
                if (inc.potentialSIF || (inc.severity && inc.severity !== 'Minor')) {
                    months[monthKey].SIF += 1;
                }
            }
        });

        return Object.values(months).sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
    }, [incidents]);

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* Medical Treatment Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        Medical Treatment Incidents (MTI)
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Bar dataKey="Medical" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* SIF Incidents Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        SIF Incidents
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Bar dataKey="SIF" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
