import { Card, CardContent } from "@/components/ui/card";

interface FeedbackDisplayProps {
  feedback: {
    transcribed_text: string;
    accuracy: number;
    feedback: string;
  } | null;
}

export default function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  if (!feedback) return null;

  return (
    <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-2 viet">Đánh giá:</h3>
      <p className="mb-2 viet">Văn bản nhận dạng: {feedback.transcribed_text}</p>
      <p className="mb-2 viet">Độ chính xác: {feedback.accuracy}%</p>
      <p>Nhận xét: {feedback.feedback}</p>
    </div>
  );
}