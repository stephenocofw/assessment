
const apiKey = "AIzaSyCSRJy7pK3FdmE3IqFfYLFEj7j9_izWL9I";

async function main() {
    console.log("Checking API Key against Generative Language API...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) {
            console.error("Error:", response.status, response.statusText);
            console.error(await response.text());
        } else {
            const data = await response.json();
            console.log("Success! Available models:");
            // Just log names to keep it short
            const names = data.models?.map(m => m.name) || [];
            console.log(names.join("\n"));
        }
    } catch (e) {
        console.error("Network Error:", e);
    }
}
main();
