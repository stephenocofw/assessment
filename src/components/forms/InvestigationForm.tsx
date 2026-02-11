import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIncidents } from '../../context/IncidentContext';
import { FORGE_WORKS_FACTORS } from '../../data/mockData';
import type { FactorAssessment, Investigation, TimelineEvent } from '../../types';
import { FactorAssessmentCard } from './FactorAssessmentCard';
import { TimelineBuilder } from './TimelineBuilder';
import { InvestigationSummary } from './InvestigationSummary';
import { TriageForm } from './TriageForm';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { FocusModeOverlay } from '../FocusModeOverlay';
import { Target } from 'lucide-react';

export function InvestigationForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getIncident, updateIncident, addInvestigation, getInvestigation } = useIncidents();

    const incident = getIncident(id || '');
    const existingInvestigation = getInvestigation(id || '');

    // Initialize state with existing assessments or empty map
    const [assessments, setAssessments] = useState<Record<string, FactorAssessment>>(() => {
        if (existingInvestigation) {
            return existingInvestigation.assessments.reduce((acc, curr) => ({ ...acc, [curr.factorId]: curr }), {});
        }
        return {};
    });

    // Timeline State
    const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(
        existingInvestigation?.timeline || [] // Load existing or empty
    );

    const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'Triage' | 'Timeline' | 'Systemic Factors' | 'Summary'>('Triage');

    if (!incident) {
        return <div className="p-8 text-center">Incident not found</div>;
    }

    const handleAssessmentChange = (assessment: FactorAssessment) => {
        setAssessments(prev => ({
            ...prev,
            [assessment.factorId]: assessment
        }));
    };

    const handleSubmit = () => {
        const investigation: Investigation = {
            id: existingInvestigation?.id || uuidv4(),
            incidentId: incident.id,
            assessments: Object.values(assessments),
            timeline: timelineEvents,
            status: 'Submitted'
        };

        addInvestigation(investigation);
        navigate('/');
    };

    // Group factors
    const factorsByCapacity = useMemo(() => {
        return {
            Guide: FORGE_WORKS_FACTORS.filter(f => f.capacity === 'Guide'),
            Enable: FORGE_WORKS_FACTORS.filter(f => f.capacity === 'Enable'),
            Execute: FORGE_WORKS_FACTORS.filter(f => f.capacity === 'Execute'),
        };
    }, []);

    const progress = Object.values(assessments).filter(a => a.relevance !== 'Unsure').length;
    const totalFactors = FORGE_WORKS_FACTORS.length;


    return (
        <div className="mx-auto space-y-8 pb-20 transition-all duration-300 max-w-full px-4 md:px-8">
            {/* Header */}
            <div className="space-y-4 print:hidden">
                <Button variant="ghost" size="sm" onClick={() => navigate('/assessments')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Assessments
                </Button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Systemic Assessment</h1>
                        <p className="text-muted-foreground mt-1">
                            Assessing: <span className="font-semibold text-foreground">{incident.title}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">{Math.round((progress / totalFactors) * 100)}%</div>
                        <p className="text-xs text-muted-foreground">Completion</p>
                    </div>
                </div>
            </div>

            {/* Incident Context Card */}
            <Card className="bg-muted/30 border-dashed print:hidden">
                <CardHeader>
                    <CardTitle className="text-base">Incident Context</CardTitle>
                    <CardDescription>{incident.whatHappened}</CardDescription>
                </CardHeader>
            </Card>

            {/* Tabs */}
            <div className="flex space-x-1 rounded-xl bg-muted p-1 overflow-x-auto print:hidden">
                {(['Triage', 'Timeline', 'Systemic Factors', 'Summary'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 whitespace-nowrap px-4
              ${activeTab === tab
                                ? 'bg-background shadow text-foreground'
                                : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="space-y-6 animate-in fade-in duration-500">

                {activeTab === 'Summary' ? (
                    <InvestigationSummary incident={incident} timelineEvents={timelineEvents} assessments={assessments} />
                ) : activeTab === 'Triage' ? (
                    <TriageForm incident={incident} onChange={updateIncident} />
                ) : activeTab === 'Timeline' ? (
                    <div className="space-y-6">
                        <div className="prose prose-sm max-w-none">
                            <h3 className="text-xl font-semibold">Incident Timeline</h3>
                            <p className="text-muted-foreground">
                                Map out the sequence of events to understand the context, drift, and interactions leading up to the incident.
                            </p>
                        </div>
                        <TimelineBuilder events={timelineEvents} onChange={setTimelineEvents} />
                    </div>
                ) : (
                    <>
                        <div className="prose prose-sm max-w-none mb-6 flex justify-between items-start">
                            <div className="prose prose-sm max-w-none mb-6">
                                <h3 className="text-xl font-semibold">
                                    {activeTab}
                                </h3>
                                <p className="text-muted-foreground">
                                    Review all 15 factors. Use Focus Mode for a guided questionnaire.
                                </p>
                            </div>
                            <Button onClick={() => setIsFocusModeOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Target className="w-4 h-4" />
                                Focus Mode
                            </Button>
                        </div>

                        <FocusModeOverlay
                            isOpen={isFocusModeOpen}
                            onClose={() => setIsFocusModeOpen(false)}
                            assessments={assessments}
                            onUpdateAssessment={handleAssessmentChange}
                        />

                        <div className="space-y-12">
                            {/* Guide Section */}
                            <section className="space-y-6">
                                <div className="prose prose-sm max-w-none border-b pb-4">
                                    <h3 className="text-xl font-semibold text-primary">Guide Factors</h3>
                                    <p className="text-muted-foreground">
                                        Identify if leadership, strategy, or risk signals influenced the work.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    {factorsByCapacity.Guide.map(factor => (
                                        <FactorAssessmentCard
                                            key={factor.id}
                                            factor={factor}
                                            assessment={assessments[factor.id]}
                                            onChange={handleAssessmentChange}
                                        />
                                    ))}
                                </div>
                            </section>

                            {/* Enable Section */}
                            <section className="space-y-6">
                                <div className="prose prose-sm max-w-none border-b pb-4">
                                    <h3 className="text-xl font-semibold text-primary">Enable Factors</h3>
                                    <p className="text-muted-foreground">
                                        Identify if resources, systems, or conflicts hindered safe execution.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    {factorsByCapacity.Enable.map(factor => (
                                        <FactorAssessmentCard
                                            key={factor.id}
                                            factor={factor}
                                            assessment={assessments[factor.id]}
                                            onChange={handleAssessmentChange}
                                        />
                                    ))}
                                </div>
                            </section>

                            {/* Execute Section */}
                            <section className="space-y-6">
                                <div className="prose prose-sm max-w-none border-b pb-4">
                                    <h3 className="text-xl font-semibold text-primary">Execute Factors</h3>
                                    <p className="text-muted-foreground">
                                        Identify how work was actually done, including adaptations and decisions.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    {factorsByCapacity.Execute.map(factor => (
                                        <FactorAssessmentCard
                                            key={factor.id}
                                            factor={factor}
                                            assessment={assessments[factor.id]}
                                            onChange={handleAssessmentChange}
                                        />
                                    ))}
                                </div>
                            </section>
                        </div>
                    </>
                )}

                {/* Navigation Actions */}
                <div className="flex justify-between pt-8 border-t print:hidden">
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (activeTab === 'Timeline') setActiveTab('Triage');
                            if (activeTab === 'Systemic Factors') setActiveTab('Timeline');
                            if (activeTab === 'Summary') setActiveTab('Systemic Factors');
                        }}
                        disabled={activeTab === 'Triage'}
                    >
                        Previous Section
                    </Button>

                    {activeTab !== 'Summary' ? (
                        <Button onClick={() => {
                            if (activeTab === 'Triage') setActiveTab('Timeline');
                            if (activeTab === 'Timeline') setActiveTab('Systemic Factors');
                            if (activeTab === 'Systemic Factors') setActiveTab('Summary');
                        }}>
                            Next Section <IconArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                            Submit Investigation <Save className="ml-2 w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper icon
function IconArrowRight({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}
