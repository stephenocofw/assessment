
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function listModels() {
    // Try to find the API key manually
    let apiKey;

    // Try reading .env manually
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
            if (match) apiKey = match[1];
        }
    } catch (e) {
        console.log("Could not read .env");
    }

    if (!apiKey) {
        // Try .env.local
        try {
            const envPath = path.resolve(process.cwd(), '.env.local');
            if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, 'utf-8');
                const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
                if (match) apiKey = match[1];
            }
        } catch (e) {
            console.log("Could not read .env.local");
        }
    }

    if (!apiKey) {
        console.error("No API KEY found");
        return;
    }

    // Clean API key (remove quotes and whitespace)
    apiKey = apiKey.trim().replace(/^["'](.*)["']$/, '$1');

    console.log("Using API Key starting with: " + apiKey.substring(0, 5) + "...");

    const genAI = new GoogleGenerativeAI(apiKey);
    console.log("Fetching models...");

    // List of models to try
    const modelNames = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro', 'gemini-1.0-pro'];

    for (const name of modelNames) {
        console.log(`Testing model: ${name}`);
        try {
            const model = genAI.getGenerativeModel({ model: name });
            const result = await model.generateContent("Hello");
            console.log(`✅ SUCCESS: ${name}`);
            return; // Found one!
        } catch (e) {
            // Need to cast or access message safely in pure JS/TS
            const msg = e.message || JSON.stringify(e);
            console.log(`❌ FAILED: ${name} - ${msg}`);
        }
    }
}

listModels();
