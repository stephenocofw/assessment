
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function listModels() {
    let apiKey;
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
            if (match) apiKey = match[1];
        }
    } catch (e) { }

    if (!apiKey) {
        try {
            const envPath = path.resolve(process.cwd(), '.env.local');
            if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, 'utf-8');
                const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
                if (match) apiKey = match[1];
            }
        } catch (e) { }
    }

    if (!apiKey) {
        console.error("No API KEY found");
        return;
    }
    apiKey = apiKey.trim().replace(/^["'](.*)["']$/, '$1');

    console.log("Using API Key starting with: " + apiKey.substring(0, 5) + "...");

    // Basic fetch to list models since SDK might hide it
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("AVAILABLE MODELS:");
            data.models.forEach(m => {
                if (m.name.includes("gemini")) {
                    console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
                }
            });
        } else {
            console.log("No models found or error:", data);
        }

    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

listModels();
