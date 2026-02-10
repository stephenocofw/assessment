import { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Trash2, Plus, Settings as SettingsIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function Settings() {
    const { workTypes, worksites, addWorkType, deleteWorkType, addWorksite, deleteWorksite } = useIncidents();

    // Local state for inputs
    const [newWorkType, setNewWorkType] = useState('');
    const [newWorksite, setNewWorksite] = useState('');

    const handleAddWorkType = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWorkType.trim()) return;
        addWorkType({ id: uuidv4(), name: newWorkType });
        setNewWorkType('');
    };

    const handleAddWorksite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWorksite.trim()) return;
        addWorksite({ id: uuidv4(), name: newWorksite });
        setNewWorksite('');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <SettingsIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                        <p className="text-muted-foreground mt-1">Manage classifications and lists used in reporting.</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Work Types Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Work Types</CardTitle>
                        <CardDescription>Common work activities performed on site.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleAddWorkType} className="flex gap-2">
                            <Input
                                placeholder="Add new work type..."
                                value={newWorkType}
                                onChange={(e) => setNewWorkType(e.target.value)}
                            />
                            <Button type="submit" size="icon" disabled={!newWorkType.trim()}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </form>

                        <div className="space-y-2">
                            {workTypes.map(type => (
                                <div key={type.id} className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors group">
                                    <span className="font-medium">{type.name}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => deleteWorkType(type.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {workTypes.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No work types defined.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Worksites Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Worksites</CardTitle>
                        <CardDescription>Locations where work is performed.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleAddWorksite} className="flex gap-2">
                            <Input
                                placeholder="Add new worksite..."
                                value={newWorksite}
                                onChange={(e) => setNewWorksite(e.target.value)}
                            />
                            <Button type="submit" size="icon" disabled={!newWorksite.trim()}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </form>

                        <div className="space-y-2">
                            {worksites.map(site => (
                                <div key={site.id} className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors group">
                                    <span className="font-medium">{site.name}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => deleteWorksite(site.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {worksites.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No worksites defined.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
