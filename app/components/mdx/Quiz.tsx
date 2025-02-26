'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  vietnamese?: string;
  audio?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  title?: string;
  showProgress?: boolean;
}

export function Quiz({ 
  questions, 
  title = "Practice Quiz",
  showProgress = true 
}: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const question = questions[currentQuestion];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden my-6">
      {/* Quiz Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {showProgress && (
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <div className="ml-4 flex-1 max-w-xs">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Content */}
      <div className="p-6">
        {!quizCompleted ? (
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question */}
              <div className="mb-6">
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {question.question}
                </p>
                {question.vietnamese && (
                  <p className="text-gray-600 italic">
                    {question.vietnamese}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`
                      w-full text-left p-4 rounded-lg transition-all
                      ${selectedAnswer === null 
                        ? 'hover:bg-gray-50 border border-gray-200'
                        : index === question.correctAnswer
                          ? 'bg-green-50 border border-green-200 text-green-800'
                          : selectedAnswer === index
                            ? 'bg-red-50 border border-red-200 text-red-800'
                            : 'border border-gray-200'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full border mr-3 text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </div>
                  </button>
                ))}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && question.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6"
                  >
                    <div className="p-4 bg-blue-50 rounded-lg text-blue-800">
                      <p className="font-medium mb-1">Explanation:</p>
                      <p>{question.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        ) : (
          // Quiz Complete Screen
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="mb-6">
              <p className="text-2xl font-bold text-gray-900 mb-2">
                Quiz Complete!
              </p>
              <p className="text-gray-600">
                You scored {score} out of {questions.length}
              </p>
            </div>
            <button
              onClick={restartQuiz}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer Actions */}
      {!quizCompleted && selectedAnswer !== null && (
        <div className="px-6 py-4 bg-gray-50 border-t">
          <button
            onClick={nextQuestion}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
}