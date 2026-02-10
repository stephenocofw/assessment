import type { Incident } from '../../types';
import { RECORDABLE_TYPES, SEVERITY_TYPES } from '../../data/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import { clsx } from 'clsx';

interface TriageFormProps {
    incident: Incident;
    onChange: (incident: Incident) => void;
}

export function TriageForm({ incident, onChange }: TriageFormProps) {

    const handleRecordableChange = (type: string) => {
        if (incident.recordableType === type) {
            onChange({ ...incident, recordableType: undefined, medicalTreatment: false });
        } else {
            onChange({
                ...incident,
                recordableType: type,
                medicalTreatment: type === 'Medical Treatment'
            });
        }
    };

    const handleSeverityChange = (severity: string) => {
        onChange({ ...incident, severity });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="prose prose-sm max-w-none">
                <h3 className="text-xl font-semibold">Incident Triage & Classification</h3>
                <p className="text-muted-foreground">
                    Classify the incident outcome. This formal record determines reporting requirements and investigation depth.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Recordable Classification */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recordable Outcome</CardTitle>
                        <CardDescription>Select the highest level of treatment or outcome required.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {RECORDABLE_TYPES.map((type) => (
                            <div
                                key={type.value}
                                className={clsx(
                                    "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                                    incident.recordableType === type.value
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "hover:bg-muted/50 border-border"
                                )}
                                onClick={() => handleRecordableChange(type.value)}
                            >
                                <div className={clsx("mt-0.5 w-5 h-5 flex items-center justify-center")}>
                                    {incident.recordableType === type.value ? (
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium">{type.label}</div>
                                    <div className="text-sm text-muted-foreground">{type.description}</div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Severity Classification */}
                <Card>
                    <CardHeader>
                        <CardTitle>Severity Classification</CardTitle>
                        <CardDescription>Assess the actual severity of the event.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {SEVERITY_TYPES.map((sev) => (
                            <button
                                key={sev.value}
                                type="button"
                                onClick={() => handleSeverityChange(sev.value)}
                                className={clsx(
                                    "w-full flex items-center justify-between p-4 rounded-lg border transition-all text-left",
                                    incident.severity === sev.value
                                        ? `${sev.color.replace('text-', 'ring-').split(' ')[0].replace('ring-', 'ring-')} ring-1 ring-offset-1`
                                        : "hover:bg-muted/50",
                                    sev.color.replace('items-center', ''), // Just applying colors roughly
                                    // Better color application:
                                    // Sev color string is like "text-red-700 bg-red-100 border-red-300"
                                    sev.color // Apply distinct colors
                                )}
                            >
                                <span className="font-semibold">{sev.label}</span>
                                {incident.severity === sev.value && (
                                    <CheckCircle2 className="w-5 h-5" />
                                )}
                            </button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
