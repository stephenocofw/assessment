export type Capacity = 'Guide' | 'Enable' | 'Execute';

export interface Factor {
    id: string;
    name: string;
    capacity: Capacity;
    description: string;
    helpText: string;
}

export type RelevanceStatus = 'Relevant' | 'Not Relevant' | 'Unsure';
export type ContributionStatus = 'Yes' | 'No' | 'Recovery' | 'Unclear';

export interface FactorAssessment {
    factorId: string;
    relevance: RelevanceStatus;
    contribution?: ContributionStatus;
    evidence?: string;
    learning?: string;
    actions?: string[];
}

export interface Incident {
    id: string;
    date: string;
    title: string;
    whatHappened: string;
    cause: string;
    prevention: string;
    initialActions: string;
    workTypeId?: string;
    worksiteId?: string;
    needsInvestigation: boolean;
    status: 'Triage' | 'Investigating' | 'Closed';
    medicalTreatment?: boolean;
    potentialSIF?: boolean;
    potentialSIFWhy?: string;
    recordableType?: string;
    severity?: string;
}

export type TimelineEventType =
    | 'Planning & Preparation'
    | 'Conditions & Context'
    | 'Normal Work'
    | 'System Controls & Barriers'
    | 'Interactions & Interfaces'
    | 'Deviation / Drift'
    | 'Recovery & Adaptation'
    | 'Outcome'
    | 'Response & Stabilisation'
    | 'Learning & Follow-up';

export interface TimelineEvent {
    id: string;
    timestamp: string; // HH:mm or full ISO
    type: TimelineEventType;
    description: string;
    notes?: string;
}

export interface Investigation {
    id: string;
    incidentId: string;
    assessments: FactorAssessment[];
    timeline?: TimelineEvent[];
    summary?: string;
    status: 'Draft' | 'Submitted';
}

export interface WorkType {
    id: string;
    name: string;
}

export interface Worksite {
    id: string;
    name: string;
}
