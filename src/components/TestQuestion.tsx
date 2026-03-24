'use client';

import { useState } from 'react';
import { TestQuestion } from '@/types';

interface TestQuestionProps {
  question: TestQuestion;
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (answer: 'A' | 'B') => void;
}

export default function TestQuestionComponent({
  question,
  currentQuestion,
  totalQuestions,
  onAnswer,
}: TestQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);

  const handleAnswer = (answer: 'A' | 'B') => {
    setSelectedAnswer(answer);
    setTimeout(() => {
      onAnswer(answer);
      setSelectedAnswer(null);
    }, 300);
  };

  const progress = ((currentQuestion - 1) / totalQuestions) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>问题 {currentQuestion} / {totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 问题卡片 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
          {question.question}
        </h3>

        <div className="space-y-4">
          {/* 选项 A */}
          <button
            onClick={() => handleAnswer('A')}
            className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedAnswer === 'A'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-center">
                A
              </span>
              <span className="text-gray-700 dark:text-gray-300 flex-1">
                {question.direction === 'first' ? '是的，这很像我的风格' : '不太像我'}
              </span>
            </div>
          </button>

          {/* 选项 B */}
          <button
            onClick={() => handleAnswer('B')}
            className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedAnswer === 'B'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 font-semibold flex items-center justify-center">
                B
              </span>
              <span className="text-gray-700 dark:text-gray-300 flex-1">
                {question.direction === 'first' ? '不太像我' : '是的，这更像我的风格'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 提示 */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        请根据您的第一反应选择，没有对错之分
      </p>
    </div>
  );
}
