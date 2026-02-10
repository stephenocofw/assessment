
import type { Factor, FactorAssessment, RelevanceStatus, ContributionStatus } from '../../types';
import { CONTRIBUTION_TYPES } from '../../data/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

import { FileText, Lightbulb, CheckCircle2, Plus, XCircle, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface FactorAssessmentCardProps {
    factor: Factor;
    assessment?: FactorAssessment;
    onChange: (assessment: FactorAssessment) => void;
}

export function FactorAssessmentCard({ factor, assessment, onChange }: FactorAssessmentCardProps) {
    const currentRelevance = assessment?.relevance;

    const handleRelevanceChange = (relevance: RelevanceStatus) => {
        onChange({
            ...assessment,
            factorId: factor.id,
            relevance,
            // Reset downstream fields if irrelevant
            contribution: relevance === 'Not Relevant' ? undefined : assessment?.contribution,
        });
    };

    const handleContributionChange = (contribution: ContributionStatus) => {
        onChange({
            ...assessment!, // Safe because this only shows if assessment exists
            contribution
        });
    };

    const handleTextChange = (field: 'evidence' | 'learning', value: string) => {
        onChange({
            ...assessment!,
            [field]: value
        });
    };

    const contributionType = assessment?.contribution
        ? CONTRIBUTION_TYPES.find(c => c.value === assessment.contribution)
        : null;

    return (
        <Card className={clsx("transition-all duration-300 border-l-4",
            contributionType ? contributionType.borderColor + " shadow-md" :
                currentRelevance === 'Relevant' ? "border-l-blue-500 shadow-md" :
                    currentRelevance === 'Unsure' ? "border-l-amber-500" :
                        currentRelevance === 'Not Relevant' ? "border-l-slate-200 opacity-60" : "border-l-transparent"
        )}>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            {factor.name}
                            {currentRelevance === 'Relevant' && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                        </CardTitle>
                        <CardDescription className="mt-1">{factor.description}</CardDescription>
                    </div>
                    <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                        {(['Relevant', 'Not Relevant', 'Unsure'] as RelevanceStatus[]).map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => handleRelevanceChange(status)}
                                className={clsx(
                                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                    currentRelevance === status
                                        ? "bg-background shadow-sm text-foreground ring-1 ring-border"
                                        : "text-muted-foreground hover:bg-background/50"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </CardHeader>

            {(currentRelevance === 'Relevant' || currentRelevance === 'Unsure') && (
                <CardContent className="space-y-6 animate-in slide-in-from-top-2 duration-300">

                    {/* Contribution Selection */}
                    <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-border/50">
                        <Label className="flex items-center gap-2 text-primary">
                            <HelpCircle className="w-4 h-4" />
                            {factor.helpText}
                        </Label>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {CONTRIBUTION_TYPES.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleContributionChange(opt.value as ContributionStatus)}
                                    className={clsx(
                                        "flex flex-col items-center justify-center p-3 rounded-lg border transition-all gap-2",
                                        assessment?.contribution === opt.value
                                            ? `${opt.color} ring-1 ring-offset-1`
                                            : "bg-background hover:bg-accent border-border text-muted-foreground"
                                    )}
                                >
                                    <opt.icon className="w-5 h-5" />
                                    <span className="text-xs font-medium">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Inputs - Only Show if Contribution is selected */}
                    {assessment?.contribution && (
                        <div className="space-y-4 pt-2 animate-in fade-in">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> Evidence
                                    </Label>
                                    <Textarea
                                        placeholder="Attach observations, statements, or logs..."
                                        className="min-h-[80px] bg-background/50 resize-none"
                                        value={assessment.evidence || ''}
                                        onChange={(e) => handleTextChange('evidence', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Lightbulb className="w-3 h-3" /> Learning
                                    </Label>
                                    <Textarea
                                        placeholder="What does this teach us about the system?"
                                        className="min-h-[80px] bg-background/50 resize-none"
                                        value={assessment.learning || ''}
                                        onChange={(e) => handleTextChange('learning', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Proposed Actions</Label>
                                <div className="space-y-2">
                                    {(assessment.actions || []).map((action, index) => (
                                        <div key={index} className="flex gap-2">
                                            <div className="flex-1">
                                                <input
                                                    className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                    placeholder="Specific, assignable improvement..."
                                                    value={action}
                                                    onChange={(e) => {
                                                        const newActions = [...(assessment.actions || [])];
                                                        newActions[index] = e.target.value;
                                                        onChange({ ...assessment, actions: newActions });
                                                    }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newActions = assessment.actions?.filter((_, i) => i !== index);
                                                    onChange({ ...assessment, actions: newActions });
                                                }}
                                                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                                title="Remove action"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newActions = [...(assessment.actions || []), ''];
                                            onChange({ ...assessment, actions: newActions });
                                        }}
                                        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium px-2 py-1 rounded-md border border-dashed border-primary/30 hover:bg-primary/5 transition-colors"
                                    >
                                        <Plus className="w-3 h-3" /> Add Action
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </CardContent>
            )}
        </Card>
    );
}
