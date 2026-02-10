import { Button } from "../ui/button";
import { Layers, Clock, PlayCircle, ShieldCheck, Activity, AlertTriangle, RefreshCw, StopCircle, FileText, X } from "lucide-react";
import { clsx } from "clsx";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";

const MAPPING_CONTENT = [
    {
        title: "Planning & Preparation",
        icon: Layers,
        color: "text-blue-500",
        focus: "assignments, risk assessments, permits, tool selection",
        question: "Was the work set up for success, or were there latent conditions present before start-up?",
        factors: [
            { name: "Operational Management (Enable)", desc: "Scheduling, supervision ratios, task assignment." },
            { name: "Risk Management (Guide)", desc: "Did the JHA/Risk Assessment catch the actual risks?" },
            { name: "Resource Allocation (Enable)", desc: "Tools, people, time allocated correctly?" },
            { name: "Work Understanding (Guide)", desc: "Did plan reflect Work-as-Imagined vs Work-as-Done?" }
        ]
    },
    {
        title: "Conditions & Context",
        icon: Clock,
        color: "text-slate-500",
        focus: "weather, lighting, fatigue, staffing, pressure",
        question: "How did conditions influence human performance and equipment reliability?",
        factors: [
            { name: "Resource Allocation (Enable)", desc: "Staffing shortages, maintenance budget constraints." },
            { name: "Goal Conflict (Enable)", desc: "Pressure to continue despite poor conditions." },
            { name: "Strategy (Guide)", desc: "Do KPIs encourage working in poor conditions?" }
        ]
    },
    {
        title: "Normal Work",
        icon: PlayCircle,
        color: "text-emerald-500",
        focus: "routine execution, adaptations",
        question: "Why did this moment look like 'normal business' right up until it didn't?",
        factors: [
            { name: "Work Understanding (Guide)", desc: "Does leadership know how work is actually performed?" },
            { name: "Frontline Workers (Execute)", desc: "How do workers adapt to get the job done daily?" },
            { name: "Management Systems (Enable)", desc: "Are procedures usable or bypassed?" }
        ]
    },
    {
        title: "System Controls & Barriers",
        icon: ShieldCheck,
        color: "text-purple-500",
        focus: "guards, interlocks, permits, checks",
        question: "Why were controls missing, failed, or bypassed?",
        factors: [
            { name: "Management Systems (Enable)", desc: "Design and maintenance of controls." },
            { name: "Safety Organisation (Guide)", desc: "Effectiveness of governance in verifying controls." },
            { name: "Design for Safety (Enable)", desc: "Was the hazard engineered out?" }
        ]
    },
    {
        title: "Interactions & Interfaces",
        icon: Activity,
        color: "text-amber-500",
        focus: "human-machine, team-to-team, contractor-client",
        question: "Did a breakdown in coordination or handoff create the risk?",
        factors: [
            { name: "Communication (Execute)", desc: "Handovers, radio comms, shared mental models." },
            { name: "Contractor Management (Execute)", desc: "Alignment of site standards and practices." },
            { name: "Operational Management (Enable)", desc: "Coordination between workgroups." }
        ]
    },
    {
        title: "Deviation / Drift",
        icon: AlertTriangle,
        color: "text-orange-500",
        focus: "unexpected behavior, slip/lapse, procedural drift",
        question: "What influenced the drift or the unexpected response?",
        factors: [
            { name: "Monitoring & Metrics (Execute)", desc: "Signals of drift before incident?" },
            { name: "Learning & Development (Enable)", desc: "Skills to recognize deviation?" },
            { name: "Decision Making (Execute)", desc: "How were decisions made once drift was noticed?" }
        ]
    },
    {
        title: "Recovery & Adaptation",
        icon: RefreshCw,
        color: "text-indigo-500",
        focus: "interventions, near misses, stopping work",
        question: "What went right? How did the system survive or minimise harm?",
        factors: [
            { name: "Frontline Workers (Execute)", desc: "Agency and expertise to respond." },
            { name: "Decision Making (Execute)", desc: "Rapid assessment under pressure." },
            { name: "Learning & Development (Enable)", desc: "Was recovery due to good training?" }
        ]
    },
    {
        title: "Outcome",
        icon: StopCircle,
        color: "text-red-500",
        focus: "injury, damage, spill",
        question: "Impact drives urgency.",
        factors: [
            { name: "Strategy (Guide)", desc: "Is organizational risk appetite too high?" }
        ]
    },
    {
        title: "Response & Stabilisation",
        icon: ShieldCheck,
        color: "text-green-500",
        focus: "first aid, scene preservation",
        question: "Was emergency response effective?",
        factors: [
            { name: "Resource Allocation (Enable)", desc: "Emergency equipment availability." },
            { name: "Communication (Execute)", desc: "Efficiency of response team." }
        ]
    },
    {
        title: "Learning & Follow-up",
        icon: FileText,
        color: "text-cyan-500",
        focus: "reporting, investigation quality",
        question: "Does the organisation actually learn?",
        factors: [
            { name: "Learning & Development (Enable)", desc: "Institutional memory." },
            { name: "Senior Leadership (Guide)", desc: "Psychological safety in reporting." },
            { name: "Monitoring & Metrics (Execute)", desc: "Are findings tracked to closure?" }
        ]
    }
];

interface TimelineHelpPanelProps {
    onClose: () => void;
}

export function TimelineHelpPanel({ onClose }: TimelineHelpPanelProps) {
    return (
        <Card className="h-full border-l rounded-none md:rounded-lg md:border flex flex-col shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base">Timeline Guide</CardTitle>
                        <CardDescription className="text-xs">Map "What Happened" to factors.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                    {MAPPING_CONTENT.map((item, idx) => (
                        <div key={idx} className="space-y-3 pb-4 border-b last:border-0 border-border/40">
                            <div className="flex items-center gap-2">
                                <div className={clsx("p-1.5 rounded-md bg-muted", item.color)}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <h4 className="font-semibold text-sm">{item.title}</h4>
                            </div>

                            <div className="pl-9 space-y-3">
                                {/* Focus / Includes - Primary Content */}
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Includes:</p>
                                    <p className="text-sm font-medium text-foreground bg-muted/30 p-2 rounded-md border border-border/50">
                                        {item.focus}
                                    </p>
                                </div>

                                {/* Context Question */}
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground mb-1">Context:</p>
                                    <p className="text-xs text-muted-foreground italic">{item.question}</p>
                                </div>

                                {/* Systemic Factors - De-emphasized */}
                                <div className="pt-1">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1">Related Factors:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {item.factors.map((factor, fIdx) => (
                                            <span
                                                key={fIdx}
                                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-transparent hover:border-border transition-colors cursor-help"
                                                title={`${factor.name}: ${factor.desc}`}
                                            >
                                                {factor.name.split('(')[0].trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
