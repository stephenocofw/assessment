import { useState, useEffect, useRef } from 'react';
import { Mic, Send, MessageSquare, StopCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { conductInterview } from '../lib/gemini';
import type { InterviewerResponse } from '../lib/gemini';

interface VoiceIntakeProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: Record<string, any>) => void;
    currentData: Record<string, any>;
}

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export function VoiceIntake({ isOpen, onClose, onComplete, currentData }: VoiceIntakeProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "I'm your AI Safety Assistant. Please describe the incident in your own words. I'll listen and ask follow-up questions if I need more details." }
    ]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const recognitionRef = useRef<any>(null); // Use any for SpeechRecognition to avoid strict type issues if types aren't available

    // Text-to-Speech Helper
    const speakText = (text: string, onEnd?: () => void) => {
        if ('speechSynthesis' in window) {
            // Cancel any current speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            utterance.onend = () => {
                if (onEnd) onEnd();
            };

            window.speechSynthesis.speak(utterance);
        } else {
            if (onEnd) onEnd();
        }
    };

    useEffect(() => {
        if (!isOpen) {
            // Reset state when closed
            setMessages([{ role: 'assistant', content: "I'm your AI Safety Assistant. Please describe the incident in your own words. I'll listen and ask follow-up questions if I need more details." }]);
            setIsComplete(false);
            return;
        }

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                if (isListening) {
                    setIsListening(false);
                }
            }
        } else {
            console.error("Browser does not support Speech Recognition");
        }

        // Initial Greeting
        const timer = setTimeout(() => {
            const greeting = "I'm here to help you report this incident accurately. Please tell me what happened.";
            if (isOpen) {
                speakText(greeting, () => {
                    if (isOpen) setTimeout(() => startListening(), 500);
                });
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            window.speechSynthesis.cancel();
            recognitionRef.current?.stop();
            setIsListening(false);
        };

    }, [isOpen]);

    const startListening = () => {
        setTranscript('');
        setIsListening(true);
        recognitionRef.current?.start();
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            startListening();
        }
    };

    const handleSend = async () => {
        if (!transcript.trim()) return;

        // Stop listening when sending
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        }

        const userMessage = transcript;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setTranscript('');
        setIsProcessing(true);

        try {
            const response: InterviewerResponse = await conductInterview(userMessage, currentData);

            if (response.extractedData && Object.keys(response.extractedData).length > 0) {
                Object.assign(currentData, response.extractedData);
            }

            if (response.nextQuestion) {
                setMessages(prev => [...prev, { role: 'assistant', content: response.nextQuestion! }]);
                speakText(response.nextQuestion!, () => {
                    setTimeout(() => startListening(), 500);
                });
            } else {
                const closingMsg = "Thank you. I have enough information to create the preliminary report. Please click the Finish button to review your report.";
                setMessages(prev => [...prev, { role: 'assistant', content: closingMsg }]);
                setIsComplete(true);
                speakText(closingMsg);
            }

            onComplete(response.extractedData);

        } catch (error: any) {
            console.error("AI Error", error);
            const errorMessage = error.message || "I'm having trouble connecting. Please try again.";
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMessage}` }]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Auto-scroll to bottom of messages
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-indigo-600" />
                        AI Safety Interviewer
                    </DialogTitle>
                    <DialogDescription>
                        Speak clearly. I'll ask questions to gather the facts.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col h-[300px] overflow-y-auto border rounded-md p-4 bg-muted/30 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background border shadow-sm'}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isProcessing && (
                        <div className="flex justify-start">
                            <div className="bg-background border shadow-sm p-3 rounded-lg flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="space-y-4">
                    {!isComplete ? (
                        <div className="flex gap-2">
                            <Button
                                onClick={toggleListening}
                                variant={isListening ? "destructive" : "secondary"}
                                className="gap-2 shrink-0"
                            >
                                {isListening ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                {isListening ? "Stop" : "Speak"}
                            </Button>
                            <Input
                                value={transcript}
                                onChange={(e) => setTranscript(e.target.value)}
                                placeholder="Type your response or speak..."
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!transcript && !isListening}
                                size="sm"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={onClose}
                        >
                            Finish & Review Report
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
