import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { conductInterview } from '../lib/gemini';
import type { InterviewerResponse } from '../lib/gemini';

interface ConversationalIntakeProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: Record<string, any>) => void;
    currentData: Record<string, any>;
}

// Animation variants for the orb
const orbVariants = {
    idle: {
        scale: [1, 1.05, 1],
        opacity: 0.8,
        background: "radial-gradient(circle, rgba(99,102,241,1) 0%, rgba(67,56,202,0.5) 100%)", // Indigo
        transition: { duration: 2, repeat: Infinity }
    },
    listening: {
        scale: [1, 1.2, 1],
        opacity: 1,
        background: "radial-gradient(circle, rgba(59,130,246,1) 0%, rgba(29,78,216,0.5) 100%)", // Blue
        transition: { duration: 1.5, repeat: Infinity }
    },
    processing: {
        scale: [0.9, 1.1, 0.9],
        rotate: 360,
        borderRadius: ["50%", "40%", "50%"],
        background: "radial-gradient(circle, rgba(239, 233, 68, 1) 0%, rgba(176, 176, 4, 0.86) 100%)", // Yellow
        transition: { duration: 1, repeat: Infinity }
    },
    speaking: {
        scale: [1, 1.15, 1],
        background: "radial-gradient(circle, rgba(239, 233, 68, 1) 0%, rgba(176, 176, 4, 0.86) 100%)", // Yellow
        transition: { duration: 0.5, repeat: Infinity }
    },
    complete: {
        scale: 1,
        background: "radial-gradient(circle, rgba(16,185,129,1) 0%, rgba(6,95,70,1) 100%)", // Solid Green
    }
};

export function ConversationalIntake({ isOpen, onClose, onComplete, currentData }: ConversationalIntakeProps) {
    const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking' | 'complete'>('idle');
    const [transcript, setTranscript] = useState('');
    const transcriptRef = useRef(''); // Ref to track latest transcript for timeouts
    const [currentQuestion, setCurrentQuestion] = useState("Please describe the incident in your own words.");

    // Silence detection refs
    const silenceTimerRef = useRef<any>(null);
    const recognitionRef = useRef<any>(null);
    const lastSpeechTimeRef = useRef<number>(Date.now());

    // Initialize or reset
    useEffect(() => {
        if (!isOpen) {
            setStatus('idle');
            setTranscript('');
            transcriptRef.current = '';
            setCurrentQuestion("Please describe the incident in your own words.");
            stopListening();
            window.speechSynthesis.cancel();
            return;
        }

        // Start the conversation
        startConversation();

        return () => {
            stopListening();
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            window.speechSynthesis.cancel();
        };
    }, [isOpen]);

    const startConversation = () => {
        // Initial delay before speaking
        setTimeout(() => {
            speak(currentQuestion);
        }, 500);
    };

    const speak = (text: string) => {
        setStatus('speaking');

        setCurrentQuestion(text);

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.onend = () => {
                setStatus('listening');
                startListening();
            };
            window.speechSynthesis.speak(utterance);
        } else {
            // Fallback if no TTS
            setTimeout(() => {
                setStatus('listening');
                startListening();
            }, 2000);
        }
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            console.error("Speech recognition not supported");
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!recognitionRef.current) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
                transcriptRef.current = currentTranscript;
                lastSpeechTimeRef.current = Date.now();

                // Reset silence timer on every result
                resetSilenceTimer();
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                // If 'no-speech' error or similar, maybe just restart?
                if (event.error !== 'aborted') {
                    // setStatus('idle'); // Or handle gracefully
                }
            };
        }

        try {
            recognitionRef.current.start();
            setStatus('listening');
            resetSilenceTimer();
        } catch (e) {
            // Already started?
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
        }
    };

    const resetSilenceTimer = () => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        // Auto-submit after 2.5 seconds of silence
        silenceTimerRef.current = setTimeout(() => {
            if (transcriptRef.current.trim().length > 2) { // Only if we have some meaningful text
                handleSend();
            }
        }, 2500);
    };

    const handleSend = async () => {
        stopListening();
        const userText = transcriptRef.current; // Use ref to ensure latest
        if (!userText.trim()) return;

        setTranscript('');
        transcriptRef.current = '';
        setStatus('processing');

        try {
            const response: InterviewerResponse = await conductInterview(userText, currentData);

            // Update underlying data
            if (response.extractedData && Object.keys(response.extractedData).length > 0) {
                Object.assign(currentData, response.extractedData);
            }

            if (response.nextQuestion) {
                speak(response.nextQuestion);
            } else {
                setStatus('complete');
                const closingMsg = "Great, I have everything I need. Check the form to review.";
                setCurrentQuestion(closingMsg);
                // Don't auto-speak closing if we want them to click finish, 
                // but let's speak it to be polite.
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(closingMsg);
                    window.speechSynthesis.speak(utterance);
                }
                onComplete(response.extractedData);
            }

        } catch (error) {
            console.error(error);
            speak("I'm having trouble. Please try saying that again.");
        }
    };

    const manualFinish = () => {
        stopListening();
        window.speechSynthesis.cancel();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && manualFinish()}>
            <DialogContent className="sm:max-w-[600px] h-[500px] flex flex-col items-center justify-between bg-zinc-950 text-white border-zinc-800">
                <div className="sr-only">
                    <DialogTitle>Conversational AI Safety Interviewer</DialogTitle>
                    <DialogDescription>
                        A hands-free voice assistant to help report safety incidents.
                    </DialogDescription>
                </div>
                {/* Header omitted for cleaner look, or minimal */}
                <div className="absolute top-4 right-4">
                    <button onClick={manualFinish} className="text-zinc-500 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Main Visual Area */}
                <div className="flex-1 flex flex-col items-center justify-center w-full space-y-8">

                    {/* The Orb */}
                    <div className="relative flex items-center justify-center">
                        <motion.div
                            className="w-32 h-32 rounded-full cursor-pointer blur-xl absolute"
                            variants={orbVariants}
                            animate={status}
                        />
                        <motion.div
                            className="w-32 h-32 rounded-full cursor-pointer relative z-10 flex items-center justify-center shadow-2xl"
                            variants={orbVariants}
                            animate={status}
                            onClick={() => {
                                if (status === 'listening') {
                                    handleSend(); // Manual send if they tap
                                } else if (status === 'idle') {
                                    startConversation();
                                }
                            }}
                        >
                            {status === 'listening' && <Mic className="w-10 h-10 text-white/90" />}
                            {status === 'processing' && <RotateCcw className="w-10 h-10 text-white/90 animate-spin" />}
                            {status === 'speaking' && <div className="space-y-1">
                                <motion.div className="w-1 h-3 bg-white/80 rounded-full inline-block mx-[1px]" animate={{ height: [8, 16, 8] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} />
                                <motion.div className="w-1 h-4 bg-white/80 rounded-full inline-block mx-[1px]" animate={{ height: [10, 24, 10] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} />
                                <motion.div className="w-1 h-3 bg-white/80 rounded-full inline-block mx-[1px]" animate={{ height: [8, 16, 8] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} />
                            </div>}
                            {status === 'complete' && <Check className="w-12 h-12 text-white" />}
                        </motion.div>
                    </div>

                    {/* Status Text */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-light tracking-wide text-zinc-200">
                            {status === 'listening' ? "Listening..." :
                                status === 'processing' ? "Thinking..." :
                                    status === 'speaking' ? "Speaking..." :
                                        status === 'complete' ? "Complete" : "Ready"}
                        </h2>
                    </div>
                </div>

                {/* Subtitles Area */}
                <div className="w-full bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 min-h-[140px] flex flex-col justify-end">
                    <AnimatePresence mode="wait">
                        {status === 'listening' || status === 'processing' ? (
                            <motion.div
                                key="user-input"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-center"
                            >
                                <p className="text-sm text-zinc-500 uppercase tracking-wider mb-2">You</p>
                                <p className="text-xl text-white font-medium">
                                    {transcript || "..."}
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="ai-output"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-center"
                            >
                                <p className="text-sm text-indigo-400 uppercase tracking-wider mb-2">AI Safety Assistant</p>
                                <p className="text-lg text-zinc-100 leading-relaxed">
                                    {currentQuestion}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="w-full mt-6 flex justify-between items-center px-2">
                    <span className="text-xs text-zinc-600">
                        {status === 'listening' ? "Auto-detecting silence..." : ""}
                    </span>

                    {status === 'complete' ? (
                        <Button onClick={manualFinish} className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8">
                            Finish Review <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button variant="ghost" className="text-zinc-500 hover:text-white" onClick={stopListening}>
                            <MicOff className="w-4 h-4 mr-2" /> Pause
                        </Button>
                    )}
                </div>

            </DialogContent>
        </Dialog>
    );
}
