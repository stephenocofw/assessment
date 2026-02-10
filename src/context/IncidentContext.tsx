import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Incident, Investigation, WorkType, Worksite } from '../types';
import { COMBINED_INCIDENTS, COMBINED_INVESTIGATIONS, MOCK_WORK_TYPES, MOCK_WORKSITES } from '../data/mockData'; // Import mock investigations

interface IncidentContextType {
    incidents: Incident[];
    investigations: Investigation[];
    workTypes: WorkType[];
    worksites: Worksite[];
    addIncident: (incident: Incident) => void;
    updateIncident: (incident: Incident) => void;
    addInvestigation: (investigation: Investigation) => void;
    updateInvestigation: (investigation: Investigation) => void;
    getIncident: (id: string) => Incident | undefined;
    getInvestigation: (incidentId: string) => Investigation | undefined;
    addWorkType: (workType: WorkType) => void;
    deleteWorkType: (id: string) => void;
    addWorksite: (worksite: Worksite) => void;
    deleteWorksite: (id: string) => void;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export function IncidentProvider({ children }: { children: ReactNode }) {
    const [incidents, setIncidents] = useState<Incident[]>(COMBINED_INCIDENTS);
    const [investigations, setInvestigations] = useState<Investigation[]>(COMBINED_INVESTIGATIONS); // Initialize with mock data

    const [workTypes, setWorkTypes] = useState<WorkType[]>(MOCK_WORK_TYPES);
    const [worksites, setWorksites] = useState<Worksite[]>(MOCK_WORKSITES);

    const addIncident = (incident: Incident) => {
        setIncidents(prev => [incident, ...prev]);
    };

    const updateIncident = (updated: Incident) => {
        setIncidents(prev => prev.map(inc => inc.id === updated.id ? updated : inc));
    };

    const addInvestigation = (investigation: Investigation) => {
        setInvestigations(prev => {
            const exists = prev.find(i => i.id === investigation.id);
            if (exists) {
                return prev.map(inv => inv.id === investigation.id ? investigation : inv);
            }
            return [...prev, investigation];
        });

        // Also update incident status
        const incident = incidents.find(i => i.id === investigation.incidentId);
        if (incident && incident.status !== 'Closed') {
            // Logic to update incident status could go here
        }
    };

    const updateInvestigation = (updated: Investigation) => {
        setInvestigations(prev => prev.map(inv => inv.id === updated.id ? updated : inv));
    };

    const addWorkType = (workType: WorkType) => {
        setWorkTypes(prev => [...prev, workType]);
    };

    const deleteWorkType = (id: string) => {
        setWorkTypes(prev => prev.filter(wt => wt.id !== id));
    };

    const addWorksite = (worksite: Worksite) => {
        setWorksites(prev => [...prev, worksite]);
    };

    const deleteWorksite = (id: string) => {
        setWorksites(prev => prev.filter(ws => ws.id !== id));
    };

    const getIncident = (id: string) => incidents.find(inc => inc.id === id);
    const getInvestigation = (incidentId: string) => investigations.find(inv => inv.incidentId === incidentId);

    return (
        <IncidentContext.Provider value={{
            incidents,
            investigations,
            workTypes,
            worksites,
            addIncident,
            updateIncident,
            addInvestigation,
            updateInvestigation,
            getIncident,
            getInvestigation,
            addWorkType,
            deleteWorkType,
            addWorksite,
            deleteWorksite
        }}>
            {children}
        </IncidentContext.Provider>
    );
}

export function useIncidents() {
    const context = useContext(IncidentContext);
    if (context === undefined) {
        throw new Error('useIncidents must be used within an IncidentProvider');
    }
    return context;
}
