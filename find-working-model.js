
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function findWorkingModel() {
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

    const genAI = new GoogleGenerativeAI(apiKey);

    // List of candidates to try, prioritized by likely availability/cost
    const candidates = [
        "gemini-1.5-flash", // Try explicitly if it works now?
        "gemini-1.5-flash-latest",
        "gemini-flash-latest",
        "gemini-1.5-pro",
        "gemini-pro", // 1.0 pro
        "gemini-1.0-pro",
        "gemini-2.0-flash-lite-preview-02-05", // Specific preview might work
        "gemini-2.0-flash-001",
        "gemini-flash-lite-latest"
    ];

    console.log("Testing models for availability...");

    for (const modelName of candidates) {
        process.stdout.write(`Trying ${modelName}... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test");
            const response = await result.response;
            const text = response.text();
            console.log(`✅ SUCCESS! (Response: ${text.substring(0, 10)}...)`);
            console.log(`\n>>> RECOMMENDED MODEL: ${modelName} <<<`);
            return;
        } catch (e) {
            if (e.message.includes("404")) {
                console.log("❌ 404 Not Found");
            } else if (e.message.includes("429")) {
                console.log("❌ 429 Quota Exceeded");
            } else {
                console.log(`❌ Error: ${e.message.split('[')[0]}`); // Shorten error
            }
        }
    }

    console.log("😭 No working models found in candidate list.");
}

findWorkingModel();
