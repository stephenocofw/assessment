import { useState } from 'react';
import { FORGE_WORKS_FACTORS } from '../data/mockData';
import type { FactorAssessment, RelevanceStatus } from '../types';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { X, HelpCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FocusModeOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    assessments: Record<string, FactorAssessment>;
    onUpdateAssessment: (assessment: FactorAssessment) => void;
}

export function FocusModeOverlay({ isOpen, onClose, assessments, onUpdateAssessment }: FocusModeOverlayProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const currentFactor = FORGE_WORKS_FACTORS[currentIndex];
    const totalFactors = FORGE_WORKS_FACTORS.length;
    const progress = ((currentIndex + 1) / totalFactors) * 100;

    const handleAnswer = (relevance: RelevanceStatus) => {
        // Create or update assessment
        const currentAssessment = assessments[currentFactor.id] || {
            factorId: currentFactor.id,
            relevance: 'Unsure' // Default fallback
        };

        const updatedAssessment: FactorAssessment = {
            ...currentAssessment,
            relevance
        };

        onUpdateAssessment(updatedAssessment);

        // Auto-advance if not at the end
        if (currentIndex < totalFactors - 1) {
            handleNext();
        } else {
            // Optional: Show completion or just stay on last one?
            // For now, let's just stay, user can explicitly close.
        }
    };

    const handleNext = () => {
        if (currentIndex < totalFactors - 1) {
            setDirection(1);
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex(prev => prev - 1);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-background">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-muted/30">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {currentFactor.capacity}
                            </span>
                            Systemic Factor Support
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">
                            Step {currentIndex + 1} of {totalFactors}
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="h-1 w-full bg-muted">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-in-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 relative overflow-hidden flex flex-col">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="flex-1 p-8 md:p-12 overflow-y-auto flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full"
                        >
                            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
                                {currentFactor.name}
                            </h1>

                            <div className="space-y-8 w-full">
                                <div className="bg-muted/50 p-6 rounded-xl border border-border/50">
                                    <h3 className="text-xl font-medium mb-2 text-foreground">
                                        {currentFactor.focusQuestion}
                                    </h3>
                                </div>

                                {currentFactor.focusPrompts && (
                                    <div className="grid gap-3 text-left">
                                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1 text-center">
                                            Prompts to consider
                                        </p>
                                        {currentFactor.focusPrompts.map((prompt, idx) => (
                                            <div key={idx} className="flex items-start gap-3 text-foreground/80 bg-background p-3 rounded-lg border shadow-sm">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                <span>{prompt}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t bg-muted/10 grid md:grid-cols-3 gap-4 items-center">
                    <div className="flex justify-start">
                        <Button
                            variant="ghost"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className="gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Previous
                        </Button>
                    </div>

                    <div className="flex justify-center gap-3">
                        <Button
                            variant={assessments[currentFactor.id]?.relevance === 'Relevant' ? 'default' : 'outline'}
                            onClick={() => handleAnswer('Relevant')}
                            className={assessments[currentFactor.id]?.relevance === 'Relevant' ? 'bg-red-600 hover:bg-red-700' : ''}
                        >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Relevant
                        </Button>
                        <Button
                            variant={assessments[currentFactor.id]?.relevance === 'Not Relevant' ? 'default' : 'outline'}
                            onClick={() => handleAnswer('Not Relevant')}
                            className={assessments[currentFactor.id]?.relevance === 'Not Relevant' ? 'bg-stone-600 hover:bg-stone-700' : ''}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Not Relevant
                        </Button>
                        <Button
                            variant={assessments[currentFactor.id]?.relevance === 'Unsure' ? 'default' : 'outline'}
                            onClick={() => handleAnswer('Unsure')}
                            className={assessments[currentFactor.id]?.relevance === 'Unsure' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                        >
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Unsure
                        </Button>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            variant="ghost"
                            onClick={handleNext}
                            disabled={currentIndex === totalFactors - 1}
                            className="gap-2"
                        >
                            Next <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
