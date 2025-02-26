interface NoteProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'tip';
}

export function Note({ children, type = 'info' }: NoteProps) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    tip: 'bg-green-50 border-green-200 text-green-800'
  };

  return (
    <div className={`p-4 my-4 border rounded-lg ${styles[type]}`}>
      {children}
    </div>
  );
}