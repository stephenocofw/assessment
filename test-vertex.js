
const apiKey = "AIzaSyCgTQhmZiOYEI-OvnwUb_2Wt4mn8lbhiRM";
const projectId = "testing-stuff-487302";
const location = "us-central1";
const model = "gemini-1.5-flash";

async function testVertex() {
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent?key=${apiKey}`;

    console.log("Testing Vertex AI Connection...");
    console.log("Endpoint:", endpoint);

    const payload = {
        contents: [{
            role: "user",
            parts: [{ text: "Hello, are you working?" }]
        }],
        generationConfig: {
            temperature: 0.7,
        }
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`FAILED: ${response.status} ${response.statusText}`);
            console.error("Error Body:", errorText);
            return;
        }

        const data = await response.json();
        console.log("SUCCESS!");
        console.log("Response:", JSON.stringify(data, null, 2));

    } catch (e) {
        console.error("NETWORK ERROR:", e);
    }
}

testVertex();
