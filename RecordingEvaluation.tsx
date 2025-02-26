'use client';

interface EvaluationResult {
  accuracy: number;
  feedback: string[];
  timestamp: Date;
}

interface RecordingEvaluationProps {
  evaluation?: EvaluationResult;
  isLoading?: boolean;
}

export default function RecordingEvaluation({ 
  evaluation,
  isLoading = false 
}: RecordingEvaluationProps) {
  if (isLoading) {
    return (
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <p className="text-gray-500">Analyzing recording...</p>
      </div>
    );
  }

  if (!evaluation) {
    return null;
  }

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Pronunciation Score</h4>
          <span className={`text-lg font-bold ${
            evaluation.accuracy >= 80 ? 'text-green-600' :
            evaluation.accuracy >= 60 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {evaluation.accuracy}%
          </span>
        </div>
        
        {evaluation.feedback.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Feedback</h4>
            <ul className="space-y-1">
              {evaluation.feedback.map((item, index) => (
                <li key={index} className="text-sm text-gray-600">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <p className="text-xs text-gray-400">
          Evaluated on: {evaluation.timestamp.toLocaleString()}
        </p>
      </div>
    </div>
  );
}