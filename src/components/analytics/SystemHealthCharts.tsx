import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useIncidents } from '../../context/IncidentContext';
import { FORGE_WORKS_FACTORS } from '../../data/mockData';

// Chart Colors
const COLORS = {
    Yes: '#EF4444', // Red for contribution to incident
    Recovery: '#10B981', // Green for recovery
    No: '#CBD5E1', // Slate for no contribution
};

export function SystemHealthCharts() {
    const { investigations } = useIncidents();

    // 1. Calculate Contribution vs Recovery per Capacity
    const capacityStats = ['Guide', 'Enable', 'Execute'].map(capacity => {
        const factorsInCapacity = FORGE_WORKS_FACTORS.filter(f => f.capacity === capacity).map(f => f.id);

        let contributed = 0;
        let recovery = 0;

        investigations.forEach(inv => {
            inv.assessments.forEach(a => {
                if (factorsInCapacity.includes(a.factorId)) {
                    if (a.contribution === 'Yes') contributed++;
                    if (a.contribution === 'Recovery') recovery++;
                }
            });
        });

        return {
            name: capacity,
            Incident: contributed,
            Recovery: recovery
        };
    });

    // 2. Identify Top Contributing Factors
    const factorCounts: Record<string, number> = {};
    investigations.forEach(inv => {
        inv.assessments.forEach(a => {
            if (a.contribution === 'Yes') {
                factorCounts[a.factorId] = (factorCounts[a.factorId] || 0) + 1;
            }
        });
    });

    const topFactors = Object.entries(factorCounts)
        .map(([id, count]) => ({
            name: FORGE_WORKS_FACTORS.find(f => f.id === id)?.name || id,
            count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return (
        <div className="grid gap-4 md:grid-cols-2">

            {/* Capacity Health Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>System Capacity Health</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={capacityStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Bar dataKey="Incident" name="Contributed to Incident" fill={COLORS.Yes} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Recovery" name="Contributed to Recovery" fill={COLORS.Recovery} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Top Systemic Factors Heatmap (Bar representation) */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Systemic Contributors</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    {topFactors.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topFactors} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="count" fill={COLORS.Yes} radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            No data available yet
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}
