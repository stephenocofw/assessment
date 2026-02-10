import type { TimelineEventType, ContributionStatus } from '../types';
import { Clock, AlertTriangle, Activity, ShieldCheck, PlayCircle, StopCircle, RefreshCw, Layers, FileText, AlertCircle, XCircle, HelpCircle } from 'lucide-react';

export const EVENT_TYPES: { type: TimelineEventType; icon: any; color: string; description: string }[] = [
    { type: 'Planning & Preparation', icon: Layers, color: 'text-blue-500 bg-blue-50', description: 'Handover, pre-start, allocation' },
    { type: 'Conditions & Context', icon: Clock, color: 'text-slate-500 bg-slate-50', description: 'Environment, staffing, time pressure' },
    { type: 'Normal Work', icon: PlayCircle, color: 'text-emerald-500 bg-emerald-50', description: 'Routine operations, standard practice' },
    { type: 'System Controls & Barriers', icon: ShieldCheck, color: 'text-purple-500 bg-purple-50', description: 'Control missing, present, or failed' },
    { type: 'Interactions & Interfaces', icon: Activity, color: 'text-amber-500 bg-amber-50', description: 'Human-machine, team coordination' },
    { type: 'Deviation / Drift', icon: AlertTriangle, color: 'text-orange-500 bg-orange-50', description: 'Loss of control, unexpected condition' },
    { type: 'Recovery & Adaptation', icon: RefreshCw, color: 'text-indigo-500 bg-indigo-50', description: 'Human intervention, redundancy' },
    { type: 'Outcome', icon: StopCircle, color: 'text-red-500 bg-red-50', description: 'Near miss, injury, damage' },
    { type: 'Response & Stabilisation', icon: ShieldCheck, color: 'text-green-500 bg-green-50', description: 'Immediate actions, area secured' },
    { type: 'Learning & Follow-up', icon: FileText, color: 'text-cyan-500 bg-cyan-50', description: 'Reporting, reviews' },
];

export const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    if (isNaN(h) || isNaN(m)) return time;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedH = h % 12 || 12;
    return `${formattedH}:${minutes.padStart(2, '0')} ${ampm}`;
};

export const CONTRIBUTION_TYPES: { value: ContributionStatus; label: string; icon: any; color: string; borderColor: string }[] = [
    { value: 'Yes', label: 'Contributed', icon: AlertCircle, color: 'text-amber-600 bg-amber-50 border-amber-200', borderColor: 'border-l-amber-500' },
    { value: 'Recovery', label: 'Recovery', icon: Activity, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', borderColor: 'border-l-emerald-500' },
    { value: 'No', label: 'Did Not Contribute', icon: XCircle, color: 'text-slate-600 bg-slate-50 border-slate-200', borderColor: 'border-l-slate-200' },
    { value: 'Unclear', label: 'Unclear', icon: HelpCircle, color: 'text-purple-600 bg-purple-50 border-purple-200', borderColor: 'border-l-purple-500' },
];

export const RECORDABLE_TYPES = [
    { value: 'Medical Treatment', label: 'Medical Treatment', description: 'Requires professional medical care' },

];

export const SEVERITY_TYPES = [
    { value: 'Fatality', label: 'Fatality', color: 'text-red-700 bg-red-100 border-red-300' },
    { value: 'Potential Fatality', label: 'Potential Fatality', color: 'text-orange-700 bg-orange-100 border-orange-300' },
    { value: 'Serious / Life Altering', label: 'Serious / Life Altering Injury', color: 'text-amber-700 bg-amber-100 border-amber-300' },
    { value: 'Potential Serious / Life Altering', label: 'Potential Serious / Life Altering Injury', color: 'text-yellow-700 bg-yellow-100 border-yellow-300' },
    { value: 'Minor', label: 'Minor Incident', color: 'text-blue-700 bg-blue-100 border-blue-300' }
];
