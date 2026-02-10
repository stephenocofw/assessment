import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useIncidents } from '../../context/IncidentContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function InitialReportForm() {
    const navigate = useNavigate();
    const { addIncident, workTypes, worksites } = useIncidents();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        whatHappened: '',
        cause: '',
        prevention: '',
        actions: '',
        workTypeId: '',
        worksiteId: '',
        needsInvestigation: null as boolean | null,
        investigationRationale: '',
        medicalTreatment: null as boolean | null,
        potentialSIF: null as boolean | null,
        potentialSIFWhy: ''
    });

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API delay
        setTimeout(() => {
            const newIncident = {
                id: uuidv4(),
                date: new Date().toISOString().split('T')[0],
                title: `Incident - ${new Date().toLocaleDateString()}`,
                whatHappened: formData.whatHappened,
                cause: formData.cause,
                prevention: formData.prevention,
                initialActions: formData.actions,
                workTypeId: formData.workTypeId || undefined,
                worksiteId: formData.worksiteId || undefined,
                needsInvestigation: formData.needsInvestigation === true,
                status: (formData.needsInvestigation ? 'Investigating' : 'Closed') as 'Investigating' | 'Closed',
                medicalTreatment: formData.medicalTreatment === true,
                potentialSIF: formData.potentialSIF === true,
                potentialSIFWhy: formData.potentialSIFWhy
            };

            addIncident(newIncident);
            setIsSubmitting(false);
            navigate('/');
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>New Safety Incident</CardTitle>
                    <CardDescription>
                        Capture the facts. Focus on what happened, not who is to blame.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="worksite">Worksite</Label>
                                <select
                                    id="worksite"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.worksiteId}
                                    onChange={(e) => handleChange('worksiteId', e.target.value)}
                                    required
                                >
                                    <option value="">Select Worksite</option>
                                    {worksites.map(site => (
                                        <option key={site.id} value={site.id}>{site.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="workType">Work Type (Optional)</Label>
                                <select
                                    id="workType"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.workTypeId}
                                    onChange={(e) => handleChange('workTypeId', e.target.value)}
                                >
                                    <option value="">Select Work Type</option>
                                    {workTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatHappened">What happened?</Label>
                            <Textarea
                                id="whatHappened"
                                placeholder="Describe the event factually. Include what, where, when, and who was involved."
                                value={formData.whatHappened}
                                onChange={(e) => handleChange('whatHappened', e.target.value)}
                                required
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cause">What do you think caused it to happen?</Label>
                            <Textarea
                                id="cause"
                                placeholder="Consider environment, equipment, planning, and procedures."
                                value={formData.cause}
                                onChange={(e) => handleChange('cause', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prevention">What stopped the incident from being worse?</Label>
                            <Textarea
                                id="prevention"
                                placeholder="Controls, people, equipment, or luck?"
                                value={formData.prevention}
                                onChange={(e) => handleChange('prevention', e.target.value)}
                                required
                            />
                        </div>

                        <div className="border-t pt-4 pb-2 space-y-4">
                            <div className="space-y-3">
                                <Label>Did anyone require medical treatment?</Label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 border p-3 rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors flex-1">
                                        <input
                                            type="radio"
                                            name="medicalTreatment"
                                            className="w-4 h-4"
                                            checked={formData.medicalTreatment === true}
                                            onChange={() => handleChange('medicalTreatment', true)}
                                        />
                                        <span className="font-medium">Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2 border p-3 rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors flex-1">
                                        <input
                                            type="radio"
                                            name="medicalTreatment"
                                            className="w-4 h-4"
                                            checked={formData.medicalTreatment === false}
                                            onChange={() => handleChange('medicalTreatment', false)}
                                        />
                                        <span className="font-medium">No</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Could this incident have resulted in a serious injury or fatality?</Label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 border p-3 rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors flex-1">
                                        <input
                                            type="radio"
                                            name="potentialSIF"
                                            className="w-4 h-4"
                                            checked={formData.potentialSIF === true}
                                            onChange={() => handleChange('potentialSIF', true)}
                                        />
                                        <span className="font-medium">Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2 border p-3 rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors flex-1">
                                        <input
                                            type="radio"
                                            name="potentialSIF"
                                            className="w-4 h-4"
                                            checked={formData.potentialSIF === false}
                                            onChange={() => handleChange('potentialSIF', false)}
                                        />
                                        <span className="font-medium">No</span>
                                    </label>
                                </div>

                                {formData.potentialSIF !== null && (
                                    <div className="animate-in fade-in slide-in-from-top-2 pt-2">
                                        <Label htmlFor="potentialSIFWhy" className="text-sm text-muted-foreground mb-1 block">
                                            {formData.potentialSIF ? "Why? (Explain the potential severity)" : "Why not? (Explain why SIF was unlikely)"}
                                        </Label>
                                        <Textarea
                                            id="potentialSIFWhy"
                                            placeholder={formData.potentialSIF ? "Explain how it could have been worse or what controls failed..." : "Explain which critical controls prevented a worse outcome..."}
                                            value={formData.potentialSIFWhy}
                                            onChange={(e) => handleChange('potentialSIFWhy', e.target.value)}
                                            required={formData.potentialSIF !== null}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>





                        <div className="space-y-2">
                            <Label htmlFor="actions">Which actions will you take in response?</Label>
                            <Textarea
                                id="actions"
                                placeholder="Specific steps you are taking immediately."
                                value={formData.actions}
                                onChange={(e) => handleChange('actions', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <Label>Do you think this incident needs further investigation?</Label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 border p-3 rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors">
                                    <input
                                        type="radio"
                                        name="needsInvestigation"
                                        className="w-4 h-4"
                                        checked={formData.needsInvestigation === true}
                                        onChange={() => handleChange('needsInvestigation', true)}
                                    />
                                    <span className="font-medium">Yes</span>
                                </label>
                                <label className="flex items-center gap-2 border p-3 rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors">
                                    <input
                                        type="radio"
                                        name="needsInvestigation"
                                        className="w-4 h-4"
                                        checked={formData.needsInvestigation === false}
                                        onChange={() => handleChange('needsInvestigation', false)}
                                    />
                                    <span className="font-medium">No</span>
                                </label>
                            </div>

                            {formData.needsInvestigation === true && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <Label htmlFor="rationale" className="text-sm text-muted-foreground mb-1 block">Why? (Optional rationale)</Label>
                                    <Input
                                        id="rationale"
                                        placeholder="High potential severity, systemic issue, etc."
                                        value={formData.investigationRationale}
                                        onChange={(e) => handleChange('investigationRationale', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="ghost" onClick={() => navigate('/')}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting || formData.needsInvestigation === null}>
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                            {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div >
    );
}
