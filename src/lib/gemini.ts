import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
// Ideally this key should be in a .env.local file: VITE_GEMINI_API_KEY
// Google AI Studio (default)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Vertex AI Config (Optional Override)
const vertexProjectId = import.meta.env.VITE_GOOGLE_CLOUD_PROJECT_ID;
const vertexLocation = import.meta.env.VITE_GOOGLE_CLOUD_LOCATION || 'us-central1';

if (!apiKey && !vertexProjectId) { // Combined check for API key or Vertex Project ID
    console.warn("Missing VITE_GEMINI_API_KEY or VITE_GOOGLE_CLOUD_PROJECT_ID environment variable. AI features will not work.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

/**
 * Generates text from a prompt using the specified model (default: gemini-1.5-flash)
 * Automatically switches to Vertex AI REST API if Project ID is configured.
 */
export async function generateContent(prompt: string, modelName: string = "gemini-2.0-flash"): Promise<string> {
    if (!apiKey) {
        throw new Error("Gemini API Key is not configured.");
    }

    // Vertex AI Path
    if (!apiKey && !vertexProjectId) {
        throw new Error("Gemini API Key or Vertex AI Project ID is not configured.");
    }

    // Vertex AI Path
    if (vertexProjectId) {
        return vertexAIGenerate(prompt, modelName);
    }

    // Google AI Studio Path (or Vertex AI path via configured genAI)

    // Google AI Studio Path (or Vertex AI path via configured genAI)
    try {
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating content with Gemini:", error);
        throw error;
    }
}


/**
 * Helper to check if AI is available/configured
 */
export function isAIAvailable(): boolean {
    return !!apiKey;
}

export type InterviewerResponse = {
    nextQuestion: string | null; // Null if interview is complete
    extractedData: Record<string, any>;
    missingInfo: string[];
};

/**
 * Direct REST call to Vertex AI (Bypassing SDK to avoid Node dependencies/Auth complexity if using API Key)
 * Note: Authenticating strictly with API Key on Vertex requires specific API enablement.
 */
async function vertexAIGenerate(prompt: string, modelName: string): Promise<string> {
    const endpoint = `https://${vertexLocation}-aiplatform.googleapis.com/v1/projects/${vertexProjectId}/locations/${vertexLocation}/publishers/google/models/${modelName}:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            role: "user",
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            temperature: 0.7,
        }
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Vertex AI Error ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    // Vertex Response structure is slightly different
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}


export async function conductInterview(
    currentTranscript: string,
    existingData: Record<string, any>
): Promise<InterviewerResponse> {
    if (!apiKey) throw new Error("API Key not found");

    // We use generateContent now to handle the provider switch (Vertex vs Studio)
    // The prompt construction remains the same

    const prompt = `
    You are an expert Safety Supervisor conducting an interview to fill out an incident report.
    Your tone is professional, thorough, and helpful. You are speaking to the person reporting the incident.
    
    CRITICAL INSTRUCTION: You must ONLY ask questions relevant to filling the specific fields listed below. Do NOT ask about the reporter's name, role, employment status (contractor vs employee), or other administrative details not listed.
    
    Your goal is to fill these fields with high-quality, specific information:
    - whatHappened: Detailed description of the event itself (Focus on What, When, Where. Do NOT focus on Who).
    - cause: Root cause analysis (Environment, equipment, procedure, lack of training, etc.).
    - prevention: What controls failed or what stopped it from being worse.
    - actions: Immediate actions taken to secure the scene or help the person.
    - medicalTreatment: Boolean (Did anyone need medical help?).
    - potentialSIF: Boolean (Could it have been a Serious Injury/Fatality?).
    
    Current known data: ${JSON.stringify(existingData)}
    
    The user just said: "${currentTranscript}"
    
    Instructions:
    1. Analyze the user's input.
    2. Merge accessible details into 'extractedData'.
    3. CHECK COMPLETENESS (Only for the above fields):
       - If 'whatHappened' is vague (e.g., "I fell"), ask "How exactly did you fall? Was there an obstacle, or did you slip?"
       - If 'cause' is missing, ask "What do you think caused this to happen?"
       - If 'medicalTreatment' is unclear, ask "Did you or anyone else require medical attention?"
       - If 'potentialSIF' is unclear, ask "Do you think this could have been a serious or fatal accident under slightly different circumstances?"
       
    4. Ask ONE question at a time. Keep it spoken-word friendly (short, clear).
    5. If all critical fields (prevention, actions, cause, whatHappened, medicalTreatment, potentialSIF) are reasonably filled, set nextQuestion to null.
    
    Return JSON structure (do not use markdown code blocks):
    {
      "nextQuestion": "The text you want to speak to the user",
      "extractedData": { ... },
      "missingInfo": [...]
    }
    `;

    try {
        // Unified Call
        const responseText = await generateContent(prompt, "gemini-2.0-flash");

        // Manual cleanup for JSON parsing since we removed the config
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanJson);
    } catch (e: any) {
        console.error("Gemini Interaction Failed:", e);

        // TEMPORARY: Fallback to Mock AI for ALL errors to allow UI testing with invalid keys
        console.warn("Gemini Error (Quota/Auth/Net). Switching to Mock AI Fallback.", e.message);
        return runMockInterview(currentTranscript, existingData);
    }
}

/**
 * Fallback mock interviewer to allow testing even when API quota is hit.
 */
/**
 * Fallback mock interviewer to allow testing even when API quota is hit.
 */
/**
 * Fallback mock interviewer to allow testing even when API quota is hit.
 * Uses a strict state machine based on what data is currently missing.
 */
function runMockInterview(input: string, currentData: Record<string, any>): InterviewerResponse {
    const newData = { ...currentData };
    const lowerInput = input.toLowerCase();

    // Helper to check if a field is missing (null, undefined, or empty string)
    const isMissing = (val: any) => val === null || val === undefined || val === '';

    // STRICT SEQUENTIAL FILLING (Extended for all fields)
    if (isMissing(currentData.whatHappened)) {
        newData.whatHappened = input;
    }
    else if (isMissing(currentData.cause)) {
        newData.cause = input;
    }
    else if (isMissing(currentData.prevention)) {
        newData.prevention = input;
    }
    else if (currentData.medicalTreatment === null) {
        // Simple yes/no extraction
        if (lowerInput.includes('yes') || lowerInput.includes('yeah') || lowerInput.includes('did') || lowerInput.includes('required')) {
            newData.medicalTreatment = true;
        } else {
            newData.medicalTreatment = false;
        }
    }
    else if (currentData.potentialSIF === null) {
        if (lowerInput.includes('yes') || lowerInput.includes('yeah') || lowerInput.includes('could')) {
            newData.potentialSIF = true;
        } else {
            newData.potentialSIF = false;
        }
    }
    else if (newData.potentialSIF === true && isMissing(currentData.potentialSIFWhy)) {
        newData.potentialSIFWhy = input;
    }
    else if (isMissing(currentData.actions)) {
        newData.actions = input;
    }
    else if (currentData.needsInvestigation === null) {
        if (lowerInput.includes('yes') || lowerInput.includes('yeah') || lowerInput.includes('should')) {
            newData.needsInvestigation = true;
        } else {
            newData.needsInvestigation = false;
        }
    }
    else if (newData.needsInvestigation === true && isMissing(currentData.investigationRationale)) {
        newData.investigationRationale = input;
    }

    // DETERMINE NEXT QUESTION
    // specific fields we want to capture in order
    let nextQ = null;
    const missingFields: string[] = [];

    if (isMissing(newData.whatHappened)) {
        nextQ = "Please describe exactly what happened.";
        missingFields.push("whatHappened");
    } else if (isMissing(newData.cause)) {
        nextQ = "What do you think caused this incident?";
        missingFields.push("cause");
    } else if (isMissing(newData.prevention)) {
        nextQ = "What could have been done to prevent this?";
        missingFields.push("prevention");
    } else if (newData.medicalTreatment === null) {
        nextQ = "Did anyone require medical attention?";
        missingFields.push("medicalTreatment");
    } else if (newData.potentialSIF === null) {
        nextQ = "Could this incident have resulted in a serious injury or fatality?";
        missingFields.push("potentialSIF");
    } else if (newData.potentialSIF === true && isMissing(newData.potentialSIFWhy)) {
        nextQ = "Why do you think it could have been serious?";
        missingFields.push("potentialSIFWhy");
    } else if (isMissing(newData.actions)) {
        nextQ = "Which actions will you take in response?";
        missingFields.push("actions");
    } else if (newData.needsInvestigation === null) {
        nextQ = "Do you think this incident needs further investigation?";
        missingFields.push("needsInvestigation");
    } else if (newData.needsInvestigation === true && isMissing(newData.investigationRationale)) {
        nextQ = "Why does it need investigation?";
        missingFields.push("investigationRationale");
    }

    return {
        nextQuestion: nextQ ? nextQ + " (Simulation Mode)" : null,
        extractedData: newData,
        missingInfo: missingFields
    };
}
