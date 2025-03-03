// Add Card components inline
function Card({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardContent({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

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
    <Card>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2 viet">Đánh giá:</h3>
        <p className="mb-2 viet">Văn bản nhận dạng: {feedback.transcribed_text}</p>
        <p className="mb-2 viet">Độ chính xác: {feedback.accuracy}%</p>
        <p>Nhận xét: {feedback.feedback}</p>
      </CardContent>
    </Card>
  );
}