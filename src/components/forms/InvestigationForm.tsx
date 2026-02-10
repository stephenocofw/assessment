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

    const [activeTab, setActiveTab] = useState<'Triage' | 'Timeline' | 'Guide' | 'Enable' | 'Execute' | 'Summary'>('Triage');

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
                <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Systemic Assessment</h1>
                        <p className="text-muted-foreground mt-1">
                            Investigating: <span className="font-semibold text-foreground">{incident.title}</span>
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
                {(['Triage', 'Timeline', 'Guide', 'Enable', 'Execute', 'Summary'] as const).map((tab) => (
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
                        <div className="prose prose-sm max-w-none mb-6">
                            <h3 className="text-xl font-semibold">
                                {activeTab} Factors
                            </h3>
                            <p className="text-muted-foreground">
                                {activeTab === 'Guide' && "Identify if leadership, strategy, or risk signals influenced the work."}
                                {activeTab === 'Enable' && "Identify if resources, systems, or conflicts hindered safe execution."}
                                {activeTab === 'Execute' && "Identify how work was actually done, including adaptations and decisions."}
                            </p>
                        </div>

                        {factorsByCapacity[activeTab].map(factor => (
                            <FactorAssessmentCard
                                key={factor.id}
                                factor={factor}
                                assessment={assessments[factor.id]}
                                onChange={handleAssessmentChange}
                            />
                        ))}
                    </>
                )}

                {/* Navigation Actions */}
                <div className="flex justify-between pt-8 border-t print:hidden">
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (activeTab === 'Timeline') setActiveTab('Triage');
                            if (activeTab === 'Guide') setActiveTab('Timeline');
                            if (activeTab === 'Enable') setActiveTab('Guide');
                            if (activeTab === 'Execute') setActiveTab('Enable');
                            if (activeTab === 'Summary') setActiveTab('Execute');
                        }}
                        disabled={activeTab === 'Triage'}
                    >
                        Previous Section
                    </Button>

                    {activeTab !== 'Summary' ? (
                        <Button onClick={() => {
                            if (activeTab === 'Triage') setActiveTab('Timeline');
                            if (activeTab === 'Timeline') setActiveTab('Guide');
                            if (activeTab === 'Guide') setActiveTab('Enable');
                            if (activeTab === 'Enable') setActiveTab('Execute');
                            if (activeTab === 'Execute') setActiveTab('Summary');
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
