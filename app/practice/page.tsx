import Navigation from '../components/Navigation'
import WordBank from '../components/WordBank'
import { ButtonHTMLAttributes } from 'react';

// Add Button component inline (same as other components)
function Button({ 
  children, 
  className = '', 
  variant = 'primary',
  ...props 
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
}) {
  return (
    <button
      className={`${className} ${
        variant === 'primary' 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-200 text-gray-800'
      } px-4 py-2 rounded`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function Page() {
  return (
    <>
      <Navigation />
      <div className="max-w-7xl mx-auto">
        <main className="py-8">
          <h1 className="text-3xl font-bold mb-4">Practice Vietnamese</h1>
          <p className="text-gray-600 font-sans mb-8">
            Start recording and our system will analyze your reading skill
          </p>
          <WordBank />
        </main>
      </div>
    </>
  );
}