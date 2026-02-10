import { useMemo, useState } from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { FORGE_WORKS_FACTORS } from '../../data/mockData';
import { AlertCircle, CheckCircle2, Factory } from 'lucide-react';

export function TrendsPage() {
    const { investigations, incidents } = useIncidents();
    const [timeRange, setTimeRange] = useState<'30' | '90' | '180'>('90');

    // Filter data based on time range
    const filteredData = useMemo(() => {
        const now = new Date();
        const cutoff = new Date();
        cutoff.setDate(now.getDate() - parseInt(timeRange));

        const filteredIncidents = incidents.filter(inc => new Date(inc.date) >= cutoff);
        const filteredIncidentIds = new Set(filteredIncidents.map(inc => inc.id));
        const filteredInvestigations = investigations.filter(inv => filteredIncidentIds.has(inv.incidentId));

        return { filteredIncidents, filteredInvestigations };
    }, [incidents, investigations, timeRange]);

    // Calculate factor frequencies
    const factorStats = useMemo(() => {
        const stats: Record<string, { count: number, positive: number, negative: number, factor: typeof FORGE_WORKS_FACTORS[0] }> = {};

        // Initialize
        FORGE_WORKS_FACTORS.forEach(f => {
            stats[f.id] = { count: 0, positive: 0, negative: 0, factor: f };
        });

        // Count occurrences
        filteredData.filteredInvestigations.forEach(inv => {
            inv.assessments.forEach(a => {
                if (stats[a.factorId]) {
                    stats[a.factorId].count++;
                    if (a.contribution === 'Recovery') {
                        stats[a.factorId].positive++;
                    } else if (a.contribution === 'Yes') {
                        stats[a.factorId].negative++;
                    }
                }
            });
        });

        return Object.values(stats).sort((a, b) => b.count - a.count);
    }, [filteredData.filteredInvestigations]);

    // Calculate "Hot Spots" (Most frequent negative factors)
    const hotSpots = useMemo(() => {
        return factorStats
            .sort((a, b) => b.negative - a.negative)
            .slice(0, 5)
            .filter(a => a.negative > 0);
    }, [factorStats]);

    // Calculate "System Strengths" (Most frequent positive factors)
    const strengths = useMemo(() => {
        return factorStats
            .sort((a, b) => b.positive - a.positive)
            .slice(0, 3)
            .filter(a => a.positive > 0);
    }, [factorStats]);

    const getColorForCapacity = () => {
        return 'text-muted-foreground bg-muted border-transparent';
    };

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Systemic Trends</h1>
                    <p className="text-muted-foreground mt-1">
                        Analyzing {filteredData.filteredInvestigations.length} investigations from {filteredData.filteredIncidents.length} incidents.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-card border rounded-lg p-1">
                    <button
                        onClick={() => setTimeRange('30')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${timeRange === '30' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
                    >
                        30 Days
                    </button>
                    <button
                        onClick={() => setTimeRange('90')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${timeRange === '90' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
                    >
                        90 Days
                    </button>
                    <button
                        onClick={() => setTimeRange('180')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${timeRange === '180' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}
                    >
                        6 Months
                    </button>
                </div>
            </div>

            {/* Opportunities / Insights Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Top Opportunity */}
                <Card className="border-l-4 border-l-destructive shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 text-destructive font-medium">
                            <AlertCircle className="w-4 h-4" />
                            <span>Systemic Risk Focus</span>
                        </div>
                        <CardTitle className="text-lg">
                            {hotSpots[0]?.factor.name || "Insufficient Data"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent onClick={() => (window.alert(`Focusing on ${hotSpots[0]?.factor.name}`))} className='cursor-pointer'>
                        <p className="text-sm text-muted-foreground mb-4">
                            Appears in <span className="font-bold text-foreground">{hotSpots[0] ? Math.round((hotSpots[0].negative / filteredData.filteredInvestigations.length) * 100) : 0}%</span> of recent investigations as a contributing factor.
                        </p>
                        <div className={`text-xs px-2 py-1 rounded inline-block font-medium border ${getColorForCapacity()}`}>
                            {hotSpots[0]?.factor.capacity || "N/A"}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Strength */}
                <Card className="border-l-4 border-l-green-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>System Strength</span>
                        </div>
                        <CardTitle className="text-lg">
                            {strengths[0]?.factor.name || "Insufficient Data"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Identified as a reliable recovery mechanism in <span className="font-bold text-foreground">{strengths[0] ? Math.round((strengths[0].positive / filteredData.filteredInvestigations.length) * 100) : 0}%</span> of investigations.
                        </p>
                        <div className={`text-xs px-2 py-1 rounded inline-block font-medium border ${getColorForCapacity()}`}>
                            {strengths[0]?.factor.capacity || "N/A"}
                        </div>
                    </CardContent>
                </Card>

                {/* Worksite Focus */}
                <Card className="border-l-4 border-l-primary shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 text-primary font-medium">
                            <Factory className="w-4 h-4" />
                            <span>Worksite Watch</span>
                        </div>
                        <CardTitle className="text-lg">Pit A</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Highest frequency of incident reports in the selected period.
                        </p>
                        <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded inline-block font-medium">
                            Needs Monitoring
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Heatmap / Matrix Section */}
            <div className="w-full">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Factor Contribution Heatmap</CardTitle>
                        <CardDescription>Frequency of systemic factors identified in investigations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Guide */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    GUIDE
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {factorStats.filter(s => s.factor.capacity === 'Guide').map(stat => (
                                        <FactorBar key={stat.factor.id} label={stat.factor.name} positive={stat.positive} negative={stat.negative} total={filteredData.filteredInvestigations.length} />
                                    ))}
                                </div>
                            </div>

                            {/* Enable */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    ENABLE
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {factorStats.filter(s => s.factor.capacity === 'Enable').map(stat => (
                                        <FactorBar key={stat.factor.id} label={stat.factor.name} positive={stat.positive} negative={stat.negative} total={filteredData.filteredInvestigations.length} />
                                    ))}
                                </div>
                            </div>

                            {/* Execute */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    EXECUTE
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {factorStats.filter(s => s.factor.capacity === 'Execute').map(stat => (
                                        <FactorBar key={stat.factor.id} label={stat.factor.name} positive={stat.positive} negative={stat.negative} total={filteredData.filteredInvestigations.length} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Sub-component for Factor Bars
function FactorBar({ label, positive, negative, total }: { label: string, positive: number, negative: number, total: number }) {
    const posPercent = total > 0 ? (positive / total) * 100 : 0;
    const negPercent = total > 0 ? (negative / total) * 100 : 0;

    // Check if there's any data for this factor
    const hasData = positive > 0 || negative > 0;

    return (
        <div className="group">
            <div className="flex justify-between text-xs mb-1">
                <span className={`font-medium ${hasData ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {label}
                </span>
                <span className="text-muted-foreground text-[10px]">
                    {hasData ? (
                        <span className="flex gap-2">
                            {negative > 0 && <span className="text-destructive font-medium">{negative} Contrib.</span>}
                            {positive > 0 && <span className="text-green-600 font-medium">{positive} Recovery</span>}
                        </span>
                    ) : '0'}
                </span>
            </div>

            <div className="flex h-2 w-full bg-muted/40 rounded-full overflow-hidden relative">
                {/* Contributing (Negative) Bar - Red, from left */}
                {negative > 0 && (
                    <div
                        className="h-full bg-destructive/80 hover:bg-destructive transition-all duration-500"
                        style={{ width: `${negPercent}%` }}
                        title={`${negative} Contributing Factors`}
                    />
                )}

                {/* Spacer if needed, or just let them stack? 
                    If we want them to meet in the middle or stack left-to-right?
                    Stacked left-to-right is easiest for now.
                */}

                {/* Recovery (Positive) Bar - Green */}
                {positive > 0 && (
                    <div
                        className="h-full bg-green-500/80 hover:bg-green-500 transition-all duration-500"
                        style={{ width: `${posPercent}%` }}
                        title={`${positive} Recovery Factors`}
                    />
                )}
            </div>
        </div>
    );
}
