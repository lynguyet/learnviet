interface ExampleProps {
  vietnamese: string;
  english: string;
}

export function Example({ vietnamese, english }: ExampleProps) {
  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
      <p className="text-lg mb-1">{vietnamese}</p>
      <p className="text-gray-600">{english}</p>
    </div>
  );
}