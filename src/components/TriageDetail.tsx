import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';
import { TriageForm } from './forms/TriageForm';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight, CheckCircle2, Lock, Unlock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';

export function TriageDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getIncident, updateIncident, addInvestigation, getInvestigation } = useIncidents();

    const incident = getIncident(id || '');
    const existingInvestigation = getInvestigation(id || '');

    if (!incident) {
        return <div className="p-8 text-center">Incident not found</div>;
    }

    // Determine initial locked state: Locked if status is NOT 'Open' (meaning it's likely triaged or investigating)
    // User can manually unlock to edit
    const [isLocked, setIsLocked] = useState(incident.status !== 'Open');
    const [escalateChecked, setEscalateChecked] = useState(false);

    const handleCompleteTriage = () => {
        if (escalateChecked) {
            // 1. Create Investigation if not exists
            if (!existingInvestigation) {
                addInvestigation({
                    id: crypto.randomUUID(),
                    incidentId: incident.id,
                    assessments: [], // Start empty
                    timeline: [],    // Start empty
                    status: 'Draft'
                });
            }

            // 2. Update Incident Status to Investigating
            updateIncident({
                ...incident,
                status: 'Investigating',
                needsInvestigation: true
            });

            // 3. Navigate back to Triage List (to continue triaging)
            navigate('/triage');
        } else {
            // Mark as Closed (Triaged but not escalated)
            updateIncident({
                ...incident,
                status: 'Closed',
                needsInvestigation: false
            });
            navigate('/triage');
        }
    };

    const isFullyClassified = incident.severity && incident.recordableType;
    const isAlreadyAssessing = incident.status === 'Investigating' || incident.status === 'Closed';

    return (
        <div className="mx-auto space-y-8 pb-20 max-w-4xl px-4 md:px-8">
            {/* Header */}
            <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/triage')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Triage List
                </Button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Incident Triage</h1>
                        <p className="text-muted-foreground mt-1">
                            Classifying: <span className="font-semibold text-foreground">{incident.title}</span>
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        {isAlreadyAssessing && (
                            <Button
                                variant="outline"
                                onClick={() => navigate(`/assessments/${incident.id}`)}
                            >
                                View Assessment <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {/* Lock/Unlock Toggle */}
                    <div className="flex items-center gap-2">
                        {isLocked && (
                            <Button variant="ghost" size="sm" onClick={() => setIsLocked(false)}>
                                <Lock className="w-4 h-4 mr-2" /> Locked
                            </Button>
                        )}
                        {!isLocked && incident.status !== 'Open' && (
                            <Button variant="outline" size="sm" onClick={() => setIsLocked(true)}>
                                <Unlock className="w-4 h-4 mr-2" /> Editing
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Context Card (Simplified compared to Assessment view) */}
            <Card className="bg-muted/30 border-dashed">
                <CardHeader>
                    <CardTitle className="text-base">Incident Context</CardTitle>
                    <CardDescription>{incident.whatHappened}</CardDescription>
                </CardHeader>
            </Card>

            {/* Reuse Triage Form */}
            {/* The TriageForm component handles the display of details AND the classification drop downs */}
            <TriageForm incident={incident} onChange={updateIncident} isLocked={isLocked} />

            {/* Footer Action Hint */}
            {!isAlreadyAssessing && (
                <Card className="border-2 border-primary/10 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Triage Outcome</CardTitle>
                        <CardDescription>Determine the next steps for this incident.</CardDescription>
                    </CardHeader>
                    <div className="px-6 pb-6 space-y-6">
                        <div className="flex items-start space-x-3 p-4 bg-background rounded-lg border">
                            <input
                                type="checkbox"
                                id="escalate"
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={escalateChecked}
                                onChange={(e) => setEscalateChecked(e.target.checked)}
                            />
                            <div className="space-y-1">
                                <label htmlFor="escalate" className="font-medium cursor-pointer block">
                                    Escalate for Systemic Assessment
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    Checking this will create a new Assessment case and changing the incident status to "Investigating".
                                    Select this if there are potential systemic factors involved.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="text-sm text-muted-foreground">
                                {!escalateChecked && (
                                    <span className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> Outcome: Incident will be closed.
                                    </span>
                                )}
                            </div>
                            <Button
                                size="lg"
                                onClick={handleCompleteTriage}
                                disabled={!isFullyClassified && escalateChecked} // Require calcification only if escalating? Or always? Let's say lenient for closing.
                            >
                                Complete Triage <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                        {!isFullyClassified && escalateChecked && (
                            <p className="text-xs text-red-500 text-right">Please complete classification above before escalating.</p>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}
