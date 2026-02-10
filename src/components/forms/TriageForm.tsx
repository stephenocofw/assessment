import type { Incident } from '../../types';
import { RECORDABLE_TYPES, SEVERITY_TYPES } from '../../data/constants';
import { MOCK_WORKSITES, MOCK_WORK_TYPES } from '../../data/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { CheckCircle2, Circle, Calendar, FileText, ShieldAlert, Stethoscope } from 'lucide-react';
import { clsx } from 'clsx';

interface TriageFormProps {
    incident: Incident;
    onChange: (incident: Incident) => void;
    isLocked?: boolean;
}

export function TriageForm({ incident, onChange, isLocked = false }: TriageFormProps) {

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
                    Classify the incident outcome based on the initial report below.
                </p>
            </div>

            {/* Initial Report Details */}
            <Card className="bg-muted/30">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            Initial Report Details
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <span className="font-medium text-foreground">Worksite:</span>
                                {MOCK_WORKSITES.find(w => w.id === incident.worksiteId)?.name || 'Unknown'}
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="font-medium text-foreground">Type:</span>
                                {MOCK_WORK_TYPES.find(t => t.id === incident.workTypeId)?.name || 'General'}
                            </div>
                            <div className="flex items-center gap-1 border-l pl-4 ml-2">
                                <Calendar className="w-3 h-3" />
                                {incident.date}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold mb-1">What Happened?</h4>
                        <p className="text-sm text-muted-foreground bg-background p-3 rounded-md border">{incident.whatHappened}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-semibold mb-1">Immediate Cause</h4>
                            <p className="text-sm text-muted-foreground bg-background p-3 rounded-md border text-xs">{incident.cause}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold mb-1">Immediate Prevention</h4>
                            <p className="text-sm text-muted-foreground bg-background p-3 rounded-md border text-xs">{incident.prevention}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-1">Initial Actions Taken</h4>
                        <p className="text-sm text-muted-foreground bg-background p-3 rounded-md border text-xs">{incident.initialActions}</p>
                    </div>


                    <div className="grid md:grid-cols-2 gap-4 pt-2 border-t">
                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold">Did anyone require medical treatment?</h4>
                            <div className={clsx(
                                "text-sm font-medium px-3 py-1.5 rounded-md border inline-flex items-center gap-2",
                                incident.medicalTreatment
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-muted/50 text-muted-foreground border-transparent"
                            )}>
                                {incident.medicalTreatment ? (
                                    <><Stethoscope className="w-4 h-4" /> Yes, Treatment Required</>
                                ) : (
                                    "No"
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold">Could this have been a SIF?</h4>
                            <div className={clsx(
                                "text-sm font-medium px-3 py-1.5 rounded-md border inline-flex items-center gap-2",
                                incident.potentialSIF
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-muted/50 text-muted-foreground border-transparent"
                            )}>
                                {incident.potentialSIF ? (
                                    <><ShieldAlert className="w-4 h-4" /> Yes, Potential SIF</>
                                ) : (
                                    "No"
                                )}
                            </div>
                            {incident.potentialSIF && incident.potentialSIFWhy && (
                                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100 italic mt-2">
                                    <span className="font-semibold not-italic">Rationale: </span>
                                    "{incident.potentialSIFWhy}"
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

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
                                    "flex items-start gap-3 p-4 rounded-lg border transition-all",
                                    !isLocked && "cursor-pointer",
                                    incident.recordableType === type.value
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "border-border",
                                    !isLocked && incident.recordableType !== type.value && "hover:bg-muted/50",
                                    isLocked && incident.recordableType !== type.value && "opacity-50 grayscale"
                                )}
                                onClick={() => !isLocked && handleRecordableChange(type.value)}
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
                                onClick={() => !isLocked && handleSeverityChange(sev.value)}
                                disabled={isLocked}
                                className={clsx(
                                    "w-full flex items-center justify-between p-4 rounded-lg border transition-all text-left",
                                    incident.severity === sev.value
                                        ? `${sev.color.replace('text-', 'ring-').split(' ')[0].replace('ring-', 'ring-')} ring-1 ring-offset-1`
                                        : "",
                                    !isLocked && incident.severity !== sev.value && "hover:bg-muted/50",
                                    isLocked && incident.severity !== sev.value && "opacity-50 grayscale",
                                    sev.color.replace('items-center', ''),
                                    sev.color
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
