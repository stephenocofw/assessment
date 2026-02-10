import React, { useRef } from 'react';
import type { Incident, TimelineEvent, FactorAssessment } from '../../types';
import { FORGE_WORKS_FACTORS } from '../../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Printer, Maximize2, Minimize2, CheckCircle2, AlertTriangle, Info, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { EVENT_TYPES, formatTime, CONTRIBUTION_TYPES, SEVERITY_TYPES } from '../../data/constants';

interface InvestigationSummaryProps {
    incident: Incident;
    timelineEvents: TimelineEvent[];
    assessments: Record<string, FactorAssessment>;
}



export function InvestigationSummary({ incident, timelineEvents, assessments }: InvestigationSummaryProps) {
    const componentRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    const relevantFactors = Object.values(assessments).filter(
        (a) => a.relevance === 'Relevant'
    );

    const handlePrint = () => {
        window.print();
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            componentRef.current?.requestFullscreen().then(() => setIsFullscreen(true));
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false));
        }
    };

    // Group relevant factors
    const factorsByCapacity = {
        Guide: relevantFactors.filter(a => FORGE_WORKS_FACTORS.find(f => f.id === a.factorId)?.capacity === 'Guide'),
        Enable: relevantFactors.filter(a => FORGE_WORKS_FACTORS.find(f => f.id === a.factorId)?.capacity === 'Enable'),
        Execute: relevantFactors.filter(a => FORGE_WORKS_FACTORS.find(f => f.id === a.factorId)?.capacity === 'Execute'),
    };

    return (
        <div ref={componentRef} className={clsx("bg-background min-h-screen p-8 transition-all overflow-y-auto", isFullscreen ? "p-12 scale-100" : "")}>
            {/* Toolbar - Hidden in Print/Fullscreen */}
            <div className="print:hidden flex justify-end gap-2 mb-8">
                <Button variant="outline" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
                    {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </Button>
                <Button onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" /> Print Summary
                </Button>
            </div>

            <div className="max-w-4xl mx-auto space-y-12 print:space-y-8">
                {/* Header */}
                <div className="border-b pb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-primary">Systemic Assessment Report</h1>
                            <p className="text-muted-foreground mt-2 text-lg">{incident.title}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-muted-foreground">Reference ID</p>
                            <p className="font-mono text-lg">{incident.id}</p>
                            <p className="text-sm font-medium text-muted-foreground mt-2">Date of Incident</p>
                            <p>{incident.date}</p>
                        </div>
                    </div>
                </div>

                {/* Section 1: Context */}
                <section className="space-y-4 break-inside-avoid">
                    <h2 className="text-xl font-semibold border-l-4 border-primary pl-3">Incident Context</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <Card className="print:border-none print:shadow-none">
                                <CardHeader className="pb-2 print:p-0">
                                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Description</CardTitle>
                                </CardHeader>
                                <CardContent className="print:p-0">
                                    <p className="whitespace-pre-wrap">{incident.whatHappened}</p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-muted/30 p-4 rounded-lg print:bg-transparent print:p-0">
                                <p className="text-sm font-medium text-muted-foreground mb-1">Medical Treatment?</p>
                                <div className="flex items-center gap-2">
                                    {incident.medicalTreatment ? (
                                        <CheckCircle2 className="w-5 h-5 text-red-500" />
                                    ) : (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    )}
                                    <span className="font-medium">{incident.medicalTreatment ? "Required" : "Not Required"}</span>
                                </div>
                            </div>
                            <div className="bg-muted/30 p-4 rounded-lg print:bg-transparent print:p-0">
                                <p className="text-sm font-medium text-muted-foreground mb-1">Potential SIF?</p>
                                <div className="flex items-center gap-2 mb-2">
                                    {incident.potentialSIF ? (
                                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    ) : (
                                        <Info className="w-5 h-5 text-blue-500" />
                                    )}
                                    <span className="font-medium">{incident.potentialSIF ? "Yes" : "No"}</span>
                                </div>
                                {incident.potentialSIFWhy && (
                                    <p className="text-sm italic text-muted-foreground">"{incident.potentialSIFWhy}"</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Classification Summary */}
                    {(incident.recordableType || incident.severity) && (
                        <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
                            <div className="bg-muted/30 p-4 rounded-lg print:bg-transparent print:p-0 print:border print:border-slate-200">
                                <p className="text-sm font-medium text-muted-foreground mb-1">Recordable Outcome</p>
                                <div className="font-semibold text-lg">{incident.recordableType || "Not Classified"}</div>
                            </div>
                            <div className="bg-muted/30 p-4 rounded-lg print:bg-transparent print:p-0 print:border print:border-slate-200">
                                <p className="text-sm font-medium text-muted-foreground mb-1">Severity Rating</p>
                                {incident.severity ? (() => {
                                    const sev = SEVERITY_TYPES.find(s => s.value === incident.severity);
                                    return (
                                        <div className={clsx("inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border", sev?.color)}>
                                            {sev?.label || incident.severity}
                                        </div>
                                    );
                                })() : (
                                    <div className="text-muted-foreground italic">Not Rated</div>
                                )}
                            </div>
                        </div>
                    )}
                </section>

                {/* Section 2: Timeline */}
                <section className="space-y-4 break-inside-avoid">
                    <h2 className="text-xl font-semibold border-l-4 border-primary pl-3">Timeline of Events</h2>
                    <div className="relative pl-6 border-l-2 border-muted space-y-6">
                        {timelineEvents.map((event) => {
                            const eventType = EVENT_TYPES.find(t => t.type === event.type);
                            const Icon = eventType?.icon || Clock;

                            return (
                                <div key={event.id} className="relative">
                                    {/* Timeline Node */}
                                    <div className={clsx(
                                        "absolute -left-[31px] w-4 h-4 rounded-full border-2 border-background",
                                        eventType?.color ? eventType.color.split(' ')[0].replace('text-', 'bg-') : "bg-muted" // Use the color for the dot background
                                    )}>
                                        {/* Optional: Put icon inside dot? No, too small. Just colored dot. */}
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] gap-4">
                                        <div className="text-sm font-mono font-medium text-muted-foreground pt-0.5">
                                            {formatTime(event.timestamp)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Icon className={clsx("w-4 h-4", eventType?.color)} />
                                                <span className={clsx("font-medium text-sm", eventType?.color?.split(' ')[0])}>{event.type}</span>
                                            </div>
                                            <p className="text-sm">{event.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Section 3: Contributing Factors */}
                <section className="space-y-6 break-before-page">
                    <h2 className="text-xl font-semibold border-l-4 border-primary pl-3" id="factors">Contributing Factors</h2>
                    <div className="space-y-8">
                        {(['Guide', 'Enable', 'Execute'] as const).map((capacity) => {
                            const factors = factorsByCapacity[capacity];
                            if (factors.length === 0) return null;

                            return (
                                <div key={capacity} className="space-y-4 break-inside-avoid">
                                    <h3 className="text-lg font-medium text-muted-foreground uppercase">{capacity}</h3>
                                    <div className="grid gap-4">
                                        {factors.map((assessment) => {
                                            const factorDef = FORGE_WORKS_FACTORS.find(f => f.id === assessment.factorId);
                                            const contributionType = assessment.contribution ? CONTRIBUTION_TYPES.find(c => c.value === assessment.contribution) : null;

                                            // Determine border color: Contribution > Relevance
                                            const borderColor = contributionType
                                                ? contributionType.borderColor
                                                : assessment.relevance === 'Relevant' ? 'border-l-blue-500' // Fallback for relevant but no contribution set yet (shouldn't happen in summary normally)
                                                    : 'border-l-slate-200';

                                            return (
                                                <div key={assessment.factorId} className={clsx("border-l-4 rounded-r-lg border-y border-r p-5 bg-card print:border-slate-200", borderColor)}>
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h4 className="font-semibold text-base">{factorDef?.name}</h4>
                                                            <p className="text-sm text-muted-foreground">{factorDef?.description}</p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            {/* Relevance Badge */}
                                                            <span className="px-2 py-1 rounded text-xs font-semibold bg-primary/10 text-primary uppercase">
                                                                {assessment.relevance}
                                                            </span>

                                                            {/* Contribution Badge if present */}
                                                            {contributionType && (
                                                                <span className={clsx("px-2 py-1 rounded text-xs font-semibold uppercase flex items-center gap-1", contributionType.color)}>
                                                                    <contributionType.icon className="w-3 h-3" />
                                                                    {contributionType.label}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid md:grid-cols-3 gap-6 mt-4">
                                                        <div>
                                                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Contribution</p>
                                                            <p className="text-sm">{assessment.evidence || "No details provided."}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Key Learnings</p>
                                                            <p className="text-sm">{assessment.learning || "No learnings recorded."}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Actions</p>
                                                            <ul className="list-disc list-inside text-sm space-y-1">
                                                                {assessment.actions && assessment.actions.length > 0 ? (
                                                                    assessment.actions.map((action, idx) => (
                                                                        <li key={idx}>{action}</li>
                                                                    ))
                                                                ) : (
                                                                    <li className="text-muted-foreground italic">No actions recorded.</li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                        {Object.values(factorsByCapacity).every(list => list.length === 0) && (
                            <p className="text-muted-foreground italic text-center py-8">No systemic factors identified yet.</p>
                        )}
                    </div>
                </section>

                {/* Footer for Print */}
                <div className="hidden print:block text-center text-xs text-muted-foreground pt-8 border-t mt-12">
                    generated by Antigravity Safety System on {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}
