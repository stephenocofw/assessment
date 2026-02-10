import { useState } from 'react';
import type { TimelineEvent } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Plus, Trash2, Edit2, XCircle } from 'lucide-react';
import { EVENT_TYPES, formatTime } from '../../data/constants';
import { v4 as uuidv4 } from 'uuid';
import { clsx } from 'clsx';

interface TimelineBuilderProps {
    events: TimelineEvent[];
    onChange: (events: TimelineEvent[]) => void;
}
import { TimelineHelpPanel } from '../help/TimelineHelp';
import { BookOpen } from 'lucide-react';

export function TimelineBuilder({ events, onChange }: TimelineBuilderProps) {
    const [showGuide, setShowGuide] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
        type: 'Normal Work',
        timestamp: '',
        description: ''
    });

    const handleAddEvent = () => {
        if (!newEvent.timestamp || !newEvent.description || !newEvent.type) return;

        if (editingId) {
            // Update existing event
            const updatedEvents = events.map(e =>
                e.id === editingId
                    ? { ...e, timestamp: newEvent.timestamp, type: newEvent.type, description: newEvent.description, notes: newEvent.notes } as TimelineEvent
                    : e
            ).sort((a, b) => a.timestamp.localeCompare(b.timestamp));

            onChange(updatedEvents);
            setEditingId(null);
        } else {
            // Add new event
            const event: TimelineEvent = {
                id: uuidv4(),
                timestamp: newEvent.timestamp,
                type: newEvent.type!,
                description: newEvent.description!,
                notes: newEvent.notes
            };

            const updatedEvents = [...events, event].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
            onChange(updatedEvents);
        }

        // Reset form but keep last time for convenience if adding, or clear if editing finished
        setNewEvent({
            type: 'Normal Work',
            timestamp: editingId ? '' : newEvent.timestamp,
            description: '',
            notes: ''
        });
    };

    const handleEdit = (event: TimelineEvent) => {
        setNewEvent({
            type: event.type,
            timestamp: event.timestamp,
            description: event.description,
            notes: event.notes
        });
        setEditingId(event.id);
    };

    const handleCancelEdit = () => {
        setNewEvent({
            type: 'Normal Work',
            timestamp: '',
            description: '',
            notes: ''
        });
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        onChange(events.filter(e => e.id !== id));
    };

    return (
        <div className="flex gap-6 items-start relative">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col space-y-4 min-w-0">
                <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border border-border/50 shrink-0">
                    <div>
                        <h3 className="text-lg font-semibold">Incident Timeline</h3>
                        <p className="text-sm text-muted-foreground">Map out the sequence of events.</p>
                    </div>
                    {!showGuide && (
                        <Button variant="outline" size="sm" onClick={() => setShowGuide(true)} className="gap-2">
                            <BookOpen className="w-4 h-4" />
                            Show Guide
                        </Button>
                    )}
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Event Input Form */}
                    <Card className="h-fit sticky top-4 z-10">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg">{editingId ? 'Edit Event' : 'Add Timeline Event'}</h3>
                                {editingId && (
                                    <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="h-8 text-muted-foreground">
                                        <XCircle className="w-4 h-4 mr-2" /> Cancel
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Event Type</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {EVENT_TYPES.map((et) => {
                                        const Icon = et.icon;
                                        return (
                                            <button
                                                key={et.type}
                                                type="button"
                                                onClick={() => setNewEvent({ ...newEvent, type: et.type })}
                                                className={clsx(
                                                    "flex items-center gap-2 p-2 rounded-md text-xs font-medium border transition-all text-left",
                                                    newEvent.type === et.type
                                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                        : "border-transparent bg-muted/50 hover:bg-muted"
                                                )}
                                            >
                                                <Icon className={clsx("w-4 h-4 shrink-0", et.color.split(' ')[0])} />
                                                <span className="truncate">{et.type}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Time (HH:mm)</Label>
                                <Input
                                    type="time"
                                    value={newEvent.timestamp}
                                    onChange={(e) => setNewEvent({ ...newEvent, timestamp: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="What happened?"
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                />
                            </div>

                            <Button onClick={handleAddEvent} className={clsx("w-full", editingId ? "bg-amber-600 hover:bg-amber-700" : "")}>
                                {editingId ? (
                                    <>
                                        <Edit2 className="w-4 h-4 mr-2" /> Update Event
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-2" /> Add to Timeline
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Timeline Visualization */}
                    <div className="space-y-4 mb-20">
                        <h3 className="font-semibold text-lg">Event Sequence</h3>
                        <div className="relative pl-6 border-l-2 border-muted space-y-8 pb-10">
                            {events.length === 0 && (
                                <p className="text-muted-foreground text-sm italic">No events recorded. Start by adding one.</p>
                            )}
                            {events.map((event) => {
                                const eventType = EVENT_TYPES.find(t => t.type === event.type);
                                const Icon = eventType?.icon;

                                return (
                                    <div key={event.id} className="relative group">
                                        {/* Timeline Node */}
                                        <div className={clsx(
                                            "absolute -left-[33px] p-1.5 rounded-full border-2 border-background shadow-sm",
                                            eventType?.color
                                        )}>
                                            <Icon className="w-4 h-4 text-current" />
                                        </div>

                                        {/* Event Card */}
                                        <div className={`bg-muted/30 p-4 rounded-lg border hover:border-primary/20 transition-all ${editingId === event.id ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-border/50'}`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-sm font-mono font-medium text-foreground bg-background px-2 py-0.5 rounded border">
                                                    {formatTime(event.timestamp)}
                                                </span>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => handleEdit(event)}
                                                        className="p-1 text-muted-foreground hover:text-primary transition-all"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(event.id)}
                                                        className="p-1 text-muted-foreground hover:text-destructive transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={clsx("text-xs font-semibold px-2 py-0.5 rounded-full", eventType?.color)}>
                                                    {event.type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-foreground/90">{event.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Side Panel Guide */}
            {showGuide && (
                <div className="w-[350px] shrink-0 border-l pl-6 animate-in slide-in-from-right duration-300 sticky top-4 h-[calc(100vh-2rem)] overflow-hidden">
                    <TimelineHelpPanel onClose={() => setShowGuide(false)} />
                </div>
            )}
        </div>
    );
}
