import { useState } from 'react';
import { generateContent, isAIAvailable } from '../lib/gemini';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Textarea } from './ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';

export function AITestComponent() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setError('');
        setResponse('');

        try {
            if (!isAIAvailable()) {
                throw new Error("API Key not found. Please set VITE_GEMINI_API_KEY in .env.local");
            }

            const result = await generateContent(prompt);
            setResponse(result);
        } catch (err: any) {
            setError(err.message || "Failed to generate content");
        } finally {
            setLoading(false);
        }
    };



    return (
        <Card className="w-full max-w-2xl mx-auto mt-8 border-dashed">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    Gemini AI Integration Test
                </CardTitle>
                <CardDescription>
                    Enter a prompt to test if the Gemini API is correctly configured.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Ask Gemini something..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={loading}
                    className="min-h-[100px]"
                />

                <Button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="w-full sm:w-auto"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        "Generate Response"
                    )}
                </Button>

                {error && (
                    <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {response && (
                    <div className="p-4 mt-4 bg-muted/50 rounded-md border">
                        <h4 className="text-sm font-semibold mb-2">Response:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {response}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
