import Navigation from '../components/Navigation'
import WordBank from '../components/WordBank'
import Button from '../components/Button'

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