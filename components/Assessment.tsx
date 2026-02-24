import React, { useState, useCallback } from 'react';
import { Question, Trait, OceanScore, Language } from '../types';
import { getLabel } from '../translations';

interface AssessmentProps {
  questions: Question[];
  language: Language;
  onComplete: (scores: OceanScore) => void;
  onCancel: () => void;
}

const Assessment: React.FC<AssessmentProps> = ({ questions, language, onComplete, onCancel }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentPage, setCurrentPage] = useState(0);

  const QUESTIONS_PER_PAGE = 5;
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const currentQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const calculateScores = useCallback(() => {
    const rawScores: Record<Trait, number> = {
      [Trait.Openness]: 0,
      [Trait.Conscientiousness]: 0,
      [Trait.Extraversion]: 0,
      [Trait.Agreeableness]: 0,
      [Trait.Neuroticism]: 0,
    };

    const counts: Record<Trait, number> = {
      [Trait.Openness]: 0,
      [Trait.Conscientiousness]: 0,
      [Trait.Extraversion]: 0,
      [Trait.Agreeableness]: 0,
      [Trait.Neuroticism]: 0,
    };

    questions.forEach((q) => {
      const ans = answers[q.id];
      if (ans !== undefined) {
        let score = ans;
        // Keyed minus means 1=5, 2=4, 3=3, 4=2, 5=1
        if (q.keyed === 'minus') {
          score = 6 - ans;
        }
        rawScores[q.trait] += score;
        counts[q.trait] += 1;
      }
    });

    const finalScores = {} as OceanScore;
    Object.values(Trait).forEach((trait) => {
      // Normalize to 0-100 scale
      const raw = rawScores[trait];
      const max = counts[trait] * 5;
      const min = counts[trait] * 1;
      
      if (max === min || counts[trait] === 0) {
          finalScores[trait] = 50;
      } else {
         finalScores[trait] = Math.round(((raw - min) / (max - min)) * 100);
      }
    });

    onComplete(finalScores);
  }, [answers, questions, onComplete]);

  const canProceed = currentQuestions.every((q) => answers[q.id] !== undefined);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
      window.scrollTo(0, 0);
    } else {
      calculateScores();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">{getLabel(language, 'assessment')}</h2>
        <span className="text-sm font-medium text-slate-500">
          {getLabel(language, 'page')} {currentPage + 1} / {totalPages}
        </span>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-8">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentPage) / totalPages) * 100}%` }}
        ></div>
      </div>

      <div className="space-y-8">
        {currentQuestions.map((q) => (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-lg text-slate-700 font-medium mb-4">{q.text[language]}</p>
            <div className="flex justify-between items-center gap-2 flex-wrap sm:flex-nowrap">
              <span className="text-xs text-slate-400 w-full sm:w-auto text-left sm:text-right mb-2 sm:mb-0">{getLabel(language, 'inaccurate')}</span>
              <div className="flex gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-center">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAnswer(q.id, val)}
                    className={`
                      w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 font-semibold text-lg transition-all
                      ${
                        answers[q.id] === val
                          ? 'bg-indigo-600 border-indigo-600 text-white transform scale-110'
                          : 'border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-600'
                      }
                    `}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400 w-full sm:w-auto text-right sm:text-left mt-2 sm:mt-0">{getLabel(language, 'accurate')}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium"
        >
          {getLabel(language, 'cancel')}
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`
            px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-all
            ${
              canProceed
                ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5'
                : 'bg-slate-300 cursor-not-allowed'
            }
          `}
        >
          {currentPage === totalPages - 1 ? getLabel(language, 'calculate') : getLabel(language, 'next')}
        </button>
      </div>
    </div>
  );
};

export default Assessment;
