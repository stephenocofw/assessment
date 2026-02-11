import type { Factor, Incident, Investigation } from '../types';

export const FORGE_WORKS_FACTORS: Factor[] = [
    // ... (keeping existing factors)
    // GUIDE
    {
        id: 'guide-leadership',
        name: 'Senior Leadership',
        capacity: 'Guide',
        description: 'Priorities, messaging, and visible behaviors.',
        helpText: 'Did senior leadership direction or behaviours influence how work was planned or carried out?',
        focusQuestion: 'Did leadership priorities, messages, or behaviours influence how this work was planned or carried out?',
        focusPrompts: [
            'Was safety seen as competing with production or delivery?',
            'Were signals from leadership unclear, absent, or contradictory?',
            'Would leadership recognise this situation as acceptable?'
        ]
    },
    {
        id: 'guide-strategy',
        name: 'Strategy',
        capacity: 'Guide',
        description: 'Strategic objectives and organizational goals.',
        helpText: 'Did organisational strategy or goals influence the conditions under which the work was done?',
        focusQuestion: 'Did organisational goals, targets, or initiatives influence decisions related to this work?',
        focusPrompts: [
            'Were cost, schedule, or output targets influencing behaviour?',
            'Was this work aligned (or misaligned) with stated safety strategy?',
            'Did strategic priorities shape risk tolerance?'
        ]
    },
    {
        id: 'guide-risk',
        name: 'Risk Management',
        capacity: 'Guide',
        description: 'Risk understanding, anticipation, and frameworks.',
        helpText: 'Did the way risks were identified, assessed, or managed contribute to the incident?',
        focusQuestion: 'Were risks related to this task or situation identified, understood, and managed beforehand?',
        focusPrompts: [
            'Was the risk known but accepted?',
            'Had conditions changed since the risk was assessed?',
            'Were controls based on assumptions that no longer held?'
        ]
    },
    {
        id: 'guide-safety-org',
        name: 'Safety Organisation',
        capacity: 'Guide',
        description: 'Structure and capability of the safety function.',
        helpText: 'Did the safety function or safety governance influence how this work was set up or managed?',
        focusQuestion: 'Did the safety function or support model influence how this work was planned, supported, or monitored?',
        focusPrompts: [
            'Was safety advice timely and practical?',
            'Were roles and responsibilities clear?',
            'Was safety engaged before, during, or only after the event?'
        ]
    },
    {
        id: 'guide-work-understanding',
        name: 'Work Understanding',
        capacity: 'Guide',
        description: 'Insight into how real work actually happens.',
        helpText: 'Did gaps in understanding how work is actually done contribute to the incident?',
        focusQuestion: 'Was there a difference between how the work was planned and how it was actually carried out?',
        focusPrompts: [
            'Did procedures reflect real conditions?',
            'Were adaptations required to get the job done?',
            'Did assumptions about “normal work” prove incorrect?'
        ]
    },

    // ENABLE
    {
        id: 'enable-operational-mgmt',
        name: 'Operational Management',
        capacity: 'Enable',
        description: 'Planning, scheduling, and supervision.',
        helpText: 'Did the way work was planned, scheduled, or supervised contribute to the incident?',
        focusQuestion: 'Did planning, supervision, or coordination affect how the work was performed?',
        focusPrompts: [
            'Was the work well prepared and sequenced?',
            'Was supervision available and effective?',
            'Were competing activities managed?'
        ]
    },
    {
        id: 'enable-resource',
        name: 'Resource Allocation',
        capacity: 'Enable',
        description: 'Time, budget, equipment, and people.',
        helpText: 'Did resourcing decisions influence how safely the work could be done?',
        focusQuestion: 'Were time, staffing, equipment, or tools adequate for the task and conditions?',
        focusPrompts: [
            'Were people rushed or stretched?',
            'Was equipment unavailable, unsuitable, or unreliable?',
            'Were workarounds needed due to shortages?'
        ]
    },
    {
        id: 'enable-systems',
        name: 'Management Systems',
        capacity: 'Enable',
        description: 'Procedures, permits, and tools.',
        helpText: 'Did management systems help or hinder the safe execution of the work?',
        focusQuestion: 'Did systems, procedures, or tools support or hinder safe work?',
        focusPrompts: [
            'Were procedures usable and up to date?',
            'Were systems overly complex or ignored?',
            'Did the system reflect how work actually happens?'
        ]
    },
    {
        id: 'enable-tradeoffs',
        name: 'Goal Conflict & Trade-offs',
        capacity: 'Enable',
        description: 'Balancing competing priorities (e.g., production vs safety).',
        helpText: 'Did competing goals or trade-offs influence decisions during the work?',
        focusQuestion: 'Were people balancing competing priorities that affected safety-related decisions?',
        focusPrompts: [
            'Speed vs safety?',
            'Compliance vs practicality?',
            'Production vs recovery?'
        ]
    },
    {
        id: 'enable-learning',
        name: 'Learning & Development',
        capacity: 'Enable',
        description: 'Skills, training, and experience.',
        helpText: 'Did learning, training, or experience levels influence how the work was done?',
        focusQuestion: 'Did knowledge, skills, experience, or training influence the outcome?',
        focusPrompts: [
            'Was training adequate for real conditions?',
            'Did people rely on experience rather than formal guidance?',
            'Were lessons from previous incidents applied?'
        ]
    },

    // EXECUTE
    {
        id: 'execute-frontline',
        name: 'Frontline Workers',
        capacity: 'Execute',
        description: 'Role, involvement, and agency of workers.',
        helpText: 'Did frontline actions or adaptations influence the outcome?',
        focusQuestion: 'Did frontline actions, decisions, or adaptations influence how the situation unfolded?',
        focusPrompts: [
            'Were actions reasonable given the context?',
            'Were adaptations necessary to succeed?',
            'Did experience or judgment play a key role?'
        ]
    },
    {
        id: 'execute-communication',
        name: 'Communication & Coordination',
        capacity: 'Execute',
        description: 'Information flow and teamwork.',
        helpText: 'Did communication or coordination influence how the work unfolded?',
        focusQuestion: 'Did communication or coordination affect shared understanding or timing of work?',
        focusPrompts: [
            'Was information missing, delayed, or misunderstood?',
            'Were handovers effective?',
            'Did teams have the same picture of risk?'
        ]
    },
    {
        id: 'execute-decision',
        name: 'Decision Making',
        capacity: 'Execute',
        description: 'Decisions made under uncertainty or pressure.',
        helpText: 'Did decision-making during the task influence the incident?',
        focusQuestion: 'Were decisions made under uncertainty, time pressure, or incomplete information?',
        focusPrompts: [
            'Were assumptions made that later proved incorrect?',
            'Were options constrained by context?',
            'Was “best available decision” made at the time?'
        ]
    },
    {
        id: 'execute-contractor',
        name: 'Contractor Management',
        capacity: 'Execute',
        description: 'Integration and support of contractors.',
        helpText: 'Did contractor arrangements or interfaces influence the work or risk?',
        focusQuestion: 'Were contractors involved, and did integration or oversight influence the work?',
        focusPrompts: [
            'Were expectations clear?',
            'Were contractors supported and supervised?',
            'Were site systems aligned with contractor practices?'
        ]
    },
    {
        id: 'execute-metrics',
        name: 'Monitoring & Metrics',
        capacity: 'Execute',
        description: 'Data used to understand work outcomes.',
        helpText: 'Did monitoring, metrics, or reporting influence what was noticed or acted on?',
        focusQuestion: 'Did monitoring, reporting, or performance measures influence attention or action?',
        focusPrompts: [
            'Were warning signs visible but unacted on?',
            'Did metrics focus attention away from emerging risk?',
            'Was success or risk invisible to the system?'
        ]
    }
];

// Helper to get a date string relative to today
const getRecentDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
};

export const MOCK_INCIDENTS: Incident[] = [
    {
        id: 'inc-001',
        date: getRecentDate(2), // 2 days ago
        title: 'Drill Rig Uncontrolled Movement',
        whatHappened: 'During night shift set-up at Pit A (Bench 2), Drill Rig 04 experienced an uncontrolled backward movement. The operator had positioned the rig and was in the process of lowering the jacks when the unit shifted and rolled approx 1.5m backwards. The operator immediately engaged the emergency brake, bringing the unit to a halt. The area was lit by mobile lighting towers, but shadows were present.',
        cause: 'Initial inspection suggests the rig was positioned on ground that appeared level but had a slight gradient obscured by soft material. The park brake was engaged, but the weight shift during jacking overcame the static friction before the jacks fully took the load.',
        prevention: 'The operator\'s quick reaction to hit the E-stop/Emergency Brake prevented the rig from rolling further into the exclusion zone. No other personnel were in the line of fire.',
        initialActions: 'Rig tagged out of service. Area barricaded. Geotech team requested to assess bench stability. All crews stood down for a safety share regarding ground assessment.',
        workTypeId: 'wt-001', // Drilling
        worksiteId: 'ws-001', // Pit A
        needsInvestigation: true,
        potentialSIF: true,
        potentialSIFWhy: 'Uncontrolled movement of heavy plant on a bench could have led to a rollover or collision with light vehicles.',
        status: 'Investigating'
    },
    {
        id: 'inc-002',
        date: getRecentDate(5), // 5 days ago
        title: 'Hand Injury at Conveyor',
        whatHappened: 'While replacing a return roller on CV-02 in the secondary crushing circuit, a trades assistant sustained a laceration to the right hand. The IP was manually positioning the roller into the bracket when it slipped, trapping their gloved hand between the roller shaft and the frame structure. The glove was torn, resulting in a 3cm laceration to the dorsal aspect of the hand.',
        cause: 'The roller weighs approx 25kg and is awkward to position manually. The IP was trying to align it by hand instead of using a pry bar or lifting aid. poor access due to adjacent guarding rails restricted movement.',
        prevention: 'The conveyor was fully isolated as per procedure, preventing any rotation injuries. The IP was wearing impact-resistant gloves which likely prevented a fracture.',
        initialActions: 'IP escorted to medical center for suturing. Task suspended. Maintenance supervisor reviewing manual handling method for this specific roller location.',
        workTypeId: 'wt-004', // Processing
        worksiteId: 'ws-004', // Plant
        needsInvestigation: true,
        medicalTreatment: true,
        status: 'Open'
    },
    {
        id: 'inc-003',
        date: getRecentDate(12), // 12 days ago
        title: 'Near Miss on Haul Road',
        whatHappened: 'During routine inspections at approximately 06:20 hrs, a supervisor observed a contractor walk through an active haul road without using the designated pedestrian crossing. A haul truck was approaching at low speed and stopped once the pedestrian was sighted.',
        cause: 'The contractor appeared unfamiliar with site pedestrian access routes and took a shortcut to reach the workshop.',
        prevention: 'The haul truck operator was alert and travelling at reduced speed. Good visibility and early eye contact allowed the vehicle to stop safely.',
        initialActions: 'Remind all contractors during toolbox talks of designated pedestrian access routes. Reinforce pedestrian exclusion zone requirements.',
        needsInvestigation: false,
        status: 'Closed'
    },
    // Historical Data for Trends
    {
        id: 'inc-004',
        date: getRecentDate(0), // Today
        title: 'Hydraulic Hose Failure',
        whatHappened: 'At 11:45 this morning, Excavator EX-04 suffered a catastrophic failure of the main boom lift cylinder hose during truck loading. A high-pressure spray of hydraulic oil was released, contacting the hot engine exhaust manifold. Smoke was observed, but no fire ignited. Approximately 80L of oil was lost to ground.',
        cause: 'The hose assembly appears to have failed due to fatigue at the crimp fitting. Maintenance records show this hose was flagged for "monitoring" 2 weeks ago due to minor cover abrasion but wasn\'t scheduled for replacement until next service.',
        prevention: 'The fire suppression system was manual-ready but not triggered as no flame was visible. The operator ceased operations immediately and slewed away from the truck. Containment bunds in the loading area captured the majority of the spill.',
        initialActions: 'EX-04 shut down and isolated. Spill kit deployed to capture residual oil. Environmental team notified. Hose assembly removed for failure analysis by supplier.',
        workTypeId: 'wt-002', // Hauling/Loading
        worksiteId: 'ws-001', // Pit A
        needsInvestigation: true,
        potentialSIF: true,
        potentialSIFWhy: 'High pressure oil spray on hot surfaces is a primary cause of machine fires. If ignited, the operator would have been at high risk.',
        status: 'Open'
    },
    {
        id: 'inc-005',
        date: getRecentDate(1), // Yesterday
        title: 'Light Vehicle Interaction',
        whatHappened: 'During shift changeover at the workshop car park, LV-22 (Toyota Hilux) reversed into a concrete bollard. The driver was attempting to reverse park into Bay 4. The rear bumper and tailgate sustained moderate damage. No injuries to the driver or passenger.',
        cause: 'Driver stated they checked mirrors but did not see the bollard. The time of day (16:30) meant the sun was low and causing significant glare on the reversing camera screen, rendering it ineffective. The bollard is below the tray line and not visible in side mirrors when close.',
        prevention: 'Low speed (<5km/h) meant the impact was low energy. Seatbelts were worn.',
        initialActions: 'LV taken to workshop for damage assessment. Driver sent for D&A test (negative). Parking bay closed off to check if bollard height meets visibility standards.',
        workTypeId: 'wt-003', // Maintenance
        worksiteId: 'ws-003', // Workshop
        needsInvestigation: true,
        status: 'Investigating'
    },
    {
        id: 'inc-006',
        date: getRecentDate(3), // 3 days ago
        title: 'Dropped Object from Height',
        whatHappened: 'A 24mm combination spanner was dropped from the level 3 walkway of the Screen House to the ground floor (approx 8m drop). The tool landed in a designated walkway. Fortunately, the area had been flagged off as an exclusion zone, so no personnel were struck.',
        cause: 'The fitter was tightening a flange bolt when the spanner slipped. They were not using a tool lanyard despite working outside the handrails. The gloves used were noted to be oily from a previous task, contributing to the loss of grip.',
        prevention: 'The effective establishment of a "Red Tape" exclusion zone below the work area was the primary control that prevented injury. A spotter was also in place.',
        initialActions: 'Work stopped. All tools retrieved. Team held an immediate stand-down to check all tools for lanyard attachment points. Fitter retrained on "Drops" policy.',
        workTypeId: 'wt-003', // Maintenance
        worksiteId: 'ws-004', // Plant
        needsInvestigation: true,
        potentialSIF: true,
        potentialSIFWhy: '2.5kg spanner dropped 8m could have been fatal if it struck a person below.',
        status: 'Investigating'
    },
    {
        id: 'inc-007',
        date: getRecentDate(75), // 75 days ago
        title: 'incorrect Isolation',
        whatHappened: 'Electrician identified that the wrong isolation point had been locked out for the pump maintenance.',
        cause: 'Labeling on the panel was ambiguous.',
        prevention: 'Test-dead verification step identified the error before work started.',
        initialActions: 'Re-label the panel immediately.',
        needsInvestigation: true,
        status: 'Closed',
        medicalTreatment: false,
        potentialSIF: true,
        potentialSIFWhy: 'If not tested for dead, electrician could have been electrocuted.'
    }
];

// MOCK INVESTIGATION DATA
export const MOCK_INVESTIGATIONS: Investigation[] = [
    {
        id: 'inv-001',
        incidentId: 'inc-001',
        status: 'Submitted',
        timeline: [
            { id: 't1-1', timestamp: '21:45', type: 'Planning & Preparation', description: 'Pre-start check conducted. Operator noted "ground uneven" but proceeded as per common practice.' },
            { id: 't1-2', timestamp: '22:15', type: 'Conditions & Context', description: 'Lighting was poor in the setup area. Shadows masked the true gradient of the slope.' },
            { id: 't1-3', timestamp: '22:25', type: 'Normal Work', description: 'Rig positioned for setup. Jacks lowered to level the machine.' },
            { id: 't1-4', timestamp: '22:30', type: 'Deviation / Drift', description: 'Ground under rear jack subsided slightly. Rig shifted weight.' },
            { id: 't1-5', timestamp: '22:30', type: 'System Controls & Barriers', description: 'Park brake was engaged but wheel chocks were not yet placed (procedure sequence issue).' },
            { id: 't1-6', timestamp: '22:31', type: 'Outcome', description: 'Rig rolled backward approx 1 meter.' },
            { id: 't1-7', timestamp: '22:31', type: 'Recovery & Adaptation', description: 'Operator hit emergency stop/brake override immediately.' }
        ],
        assessments: [
            {
                factorId: 'guide-risk',
                relevance: 'Relevant',
                contribution: 'Yes',
                evidence: 'JHA did not account for uneven ground.',
                learning: 'Risk assessments need to be dynamic allowing for condition changes.',
                actions: ['Review JHA trigger points.']
            },
            {
                factorId: 'enable-operational-mgmt',
                relevance: 'Relevant',
                contribution: 'Yes',
                evidence: 'Supervisor was covering two areas.',
                learning: 'Span of control was too wide for high-risk activities.',
                actions: ['Review supervisor ratios.']
            },
            {
                factorId: 'execute-decision',
                relevance: 'Relevant',
                contribution: 'Recovery',
                evidence: 'Operator made rapid decision to use emergency brake.',
                learning: 'Emergency response training was effective.',
                actions: ['Commend operator.']
            }
        ]
    },
    {
        id: 'inv-004',
        incidentId: 'inc-004',
        status: 'Submitted',
        timeline: [
            { id: 't4-1', timestamp: '08:00', type: 'Planning & Preparation', description: 'Excavator 04 pre-start completed. Hose condition checked visually (pass).' },
            { id: 't4-2', timestamp: '10:30', type: 'Normal Work', description: 'Loading trucks at face. High intensity visuals.' },
            { id: 't4-3', timestamp: '11:15', type: 'Conditions & Context', description: 'Ambient temperature reached 38°C. Hydraulic system under heavy load.' },
            { id: 't4-4', timestamp: '11:45', type: 'Deviation / Drift', description: 'Burst protection sleeve on boom hose worked loose recently (noted in maintenance log but deferred).' },
            { id: 't4-5', timestamp: '12:00', type: 'Outcome', description: 'Main boom lift hose ruptured under pressure.' },
            { id: 't4-6', timestamp: '12:01', type: 'Response & Stabilisation', description: 'Operator shut down engine immediately. Spill contained within bunded area.' }
        ],
        assessments: [
            { factorId: 'enable-resource', relevance: 'Relevant', contribution: 'Yes', evidence: 'Maintenance budget cuts delayed hose replacement schedule.', learning: 'Deferring maintenance increases failure risk.', actions: ['Restore maintenance budget.'] },
            { factorId: 'enable-systems', relevance: 'Relevant', contribution: 'Yes', evidence: 'Inspection checklist did not specifically check hose condition.', learning: 'Checklists need to be specific.', actions: ['Update checklist.'] }
        ]
    },
    {
        id: 'inv-005',
        incidentId: 'inc-005',
        status: 'Submitted',
        timeline: [
            { id: 't5-1', timestamp: '05:30', type: 'Conditions & Context', description: 'Operator on 13th shift of roster. Reported feeling "a bit foggy".' },
            { id: 't5-2', timestamp: '16:00', type: 'Interactions & Interfaces', description: 'Shift changeover time. High traffic in car park.' },
            { id: 't5-3', timestamp: '16:05', type: 'Normal Work', description: 'Operator reversing LV into parking bay.' },
            { id: 't5-4', timestamp: '16:05', type: 'System Controls & Barriers', description: 'Reverse camera screen was glared out by sun (common issue at this time).' },
            { id: 't5-5', timestamp: '16:05', type: 'Outcome', description: 'LV impacted extensive height bollard.' }
        ],
        assessments: [
            { factorId: 'execute-frontline', relevance: 'Relevant', contribution: 'Yes', evidence: 'Driver was fatigued from double shift.', learning: 'Fatigue management policy not followed.', actions: ['Enforce roster limits.'] },
            { factorId: 'enable-tradeoffs', relevance: 'Relevant', contribution: 'Yes', evidence: 'Pressure to get to meeting led to rushing.', learning: 'Schedule pressure compromises safety.', actions: ['Review meeting schedules.'] }
        ]
    },
    {
        id: 'inv-006',
        incidentId: 'inc-006',
        status: 'Submitted',
        timeline: [
            { id: 't6-1', timestamp: '09:00', type: 'Planning & Preparation', description: 'Work at height permit issued. Tools listed.' },
            { id: 't6-2', timestamp: '09:30', type: 'System Controls & Barriers', description: 'Exclusion zone established below walkway using red tape.' },
            { id: 't6-3', timestamp: '10:15', type: 'Normal Work', description: 'Technician loosening bolts on flange.' },
            { id: 't6-4', timestamp: '10:20', type: 'Deviation / Drift', description: 'Wrench slipped from gloved hand (gloves were oily from previous task).' },
            { id: 't6-5', timestamp: '10:20', type: 'System Controls & Barriers', description: 'Tool lanyard was not attached to the wrench (available but not used).' },
            { id: 't6-6', timestamp: '10:20', type: 'Outcome', description: 'Wrench fell 4m to ground.' },
            { id: 't6-7', timestamp: '10:21', type: 'Recovery & Adaptation', description: 'Exclusion zone worked - nobody was in the drop zone.' }
        ],
        assessments: [
            { factorId: 'enable-learning', relevance: 'Relevant', contribution: 'Yes', evidence: 'Contractor had not received working at heights training.', learning: 'Onboarding gap.', actions: ['Audit training records.'] },
            { factorId: 'guide-safety-org', relevance: 'Relevant', contribution: 'Recovery', evidence: 'Safety advisor had established exclusion zone.', learning: 'Controls worked.', actions: ['Communicate success.'] }
        ]
    },
    {
        id: 'inv-007',
        incidentId: 'inc-007',
        status: 'Submitted',
        timeline: [
            { id: 't7-1', timestamp: '07:00', type: 'Planning & Preparation', description: 'Isolation permit created. Isolation points identified from schematic.' },
            { id: 't7-2', timestamp: '07:30', type: 'Normal Work', description: 'Electrician proceeded to MCC to perform isolation.' },
            { id: 't7-3', timestamp: '07:35', type: 'Conditions & Context', description: 'MCC panel labels were faded and handwritten.' },
            { id: 't7-4', timestamp: '07:40', type: 'Deviation / Drift', description: 'Electrician isolated "Pump 1" as labeled, but label was on wrong breaker.' },
            { id: 't7-5', timestamp: '07:45', type: 'System Controls & Barriers', description: 'Test for Dead verification step performed at the motor.' },
            { id: 't7-6', timestamp: '07:45', type: 'Recovery & Adaptation', description: 'Test revealed voltage still present. Work stopped immediately.' }
        ],
        assessments: [
            { factorId: 'enable-systems', relevance: 'Relevant', contribution: 'Yes', evidence: 'Labeling standard was outdated.', learning: 'Standards need to be maintained.', actions: ['Audit all panels.'] },
            { factorId: 'guide-work-understanding', relevance: 'Relevant', contribution: 'Yes', evidence: 'Engineers assumed labels were correct without checking.', learning: 'Work-as-imagined vs Work-as-done gap.', actions: ['Walkthroughs required.'] }
        ]
    }
];

export const MOCK_WORK_TYPES = [
    { id: 'wt-001', name: 'Drilling' },
    { id: 'wt-002', name: 'Hauling' },
    { id: 'wt-003', name: 'Maintenance' },
    { id: 'wt-004', name: 'Processing' },
    { id: 'wt-005', name: 'Blasting' }
];

export const MOCK_WORKSITES = [
    { id: 'ws-001', name: 'Pit A' },
    { id: 'ws-002', name: 'Pit B' },
    { id: 'ws-003', name: 'Workshop' },
    { id: 'ws-004', name: 'Processing Plant' },
    { id: 'ws-005', name: 'Admin Office' }
];

// --- GENERATE BULK DATA ---
const generateBulkData = () => {
    const historicalIncidents: Incident[] = [];
    const historicalInvestigations: Investigation[] = [];

    // Generate 120 incidents over the last 6 months
    for (let i = 0; i < 120; i++) {
        const daysAgo = Math.floor(Math.random() * 180);
        const date = getRecentDate(daysAgo);
        const id = `hist-inc-${i}`;

        // Randomly assign types to create trends
        const typeRoll = Math.random();
        let title = 'General Incident';

        if (typeRoll < 0.3) {
            title = 'Vehicle Interaction';
        } else if (typeRoll < 0.5) {
            title = 'Equipment Failure';
        } else if (typeRoll < 0.7) {
            title = 'Process Deviation';
        } else {
            title = 'Procedural Breach';
        }



        // Determine Classification
        const severityRoll = Math.random();
        let medicalTreatment = false;
        let recordableType = 'First Aid'; // Default
        let potentialSIF = false;
        let severity = 'Minor';

        if (severityRoll < 0.05) {
            // 5% Serious SIF
            potentialSIF = true;
            severity = 'Serious / Life Altering';
            medicalTreatment = true;
            recordableType = 'Medical Treatment';
            title = `Serious ${title}`;
        } else if (severityRoll < 0.15) {
            // 10% Potential SIF
            potentialSIF = true;
            severity = 'Potential Serious / Life Altering';
        }

        if (severityRoll > 0.05 && severityRoll < 0.25) {
            // 20% Medical Treatment (inclusive of SIFs partially)
            medicalTreatment = true;
            recordableType = 'Medical Treatment';
        }

        historicalIncidents.push({
            id,
            date,
            title: `${title} #${i}`,
            whatHappened: 'Generated historical record for trend analysis.',
            cause: 'Systemic factors present.',
            prevention: 'Controls reviewed.',
            initialActions: 'Investigation launched.',
            needsInvestigation: true, // Most get investigated for data density
            status: 'Closed',
            medicalTreatment,
            recordableType,
            potentialSIF,
            severity
        });

        // 80% chance of having an investigation
        if (Math.random() < 0.8) {
            const numAssessments = Math.floor(Math.random() * 3) + 1; // 1-3 assessments
            const assessments = [];

            for (let j = 0; j < numAssessments; j++) {
                // Weighted selection of factors to create "Trends"
                // Let's make 'enable-resource' and 'execute-communication' common issues
                // And 'execute-decision' a common strength

                const factorRoll = Math.random();
                let factorId = '';
                let contribution: 'Yes' | 'Recovery' = 'Yes';

                if (factorRoll < 0.15) factorId = 'enable-resource';
                else if (factorRoll < 0.30) factorId = 'execute-communication';
                else if (factorRoll < 0.40) factorId = 'guide-risk';
                else if (factorRoll < 0.50) factorId = 'enable-systems';
                else if (factorRoll < 0.60) {
                    factorId = 'execute-decision';
                    contribution = 'Recovery'; // Investigated strength
                }
                else if (factorRoll < 0.70) {
                    factorId = 'guide-leadership';
                    contribution = 'Recovery';
                }
                else {
                    // Random other factor
                    factorId = FORGE_WORKS_FACTORS[Math.floor(Math.random() * FORGE_WORKS_FACTORS.length)].id;
                }

                assessments.push({
                    factorId,
                    relevance: 'Relevant' as const,
                    contribution,
                    evidence: 'Historical evidence point.',
                    learning: 'Historical learning.',
                    actions: ['Historical action.']
                });
            }

            historicalInvestigations.push({
                id: `hist-inv-${i}`,
                incidentId: id,
                status: 'Submitted',
                assessments
            });
        }
    }

    return { historicalIncidents, historicalInvestigations };
};

const { historicalIncidents, historicalInvestigations } = generateBulkData();

// Combine static and generated data
// We modify the exports to include the generated items
export const COMBINED_INCIDENTS = [...MOCK_INCIDENTS, ...historicalIncidents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
export const COMBINED_INVESTIGATIONS = [...MOCK_INVESTIGATIONS, ...historicalInvestigations];
