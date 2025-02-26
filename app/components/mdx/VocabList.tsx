interface VocabItem {
    word: string;
    pronunciation: string;
    meaning: string;
    example?: {
      vietnamese: string;
      english: string;
    };
  }
  
  interface VocabListProps {
    items: VocabItem[];
    title?: string;
  }
  
  export function VocabList({ items, title = "Vocabulary" }: VocabListProps) {
    return (
      <div className="my-8">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="grid gap-4">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-medium text-gray-900">{item.word}</p>
                  <p className="text-sm text-gray-500 italic">/{item.pronunciation}/</p>
                  <p className="text-gray-600 mt-1">{item.meaning}</p>
                </div>
              </div>
              {item.example && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">{item.example.vietnamese}</p>
                  <p className="text-sm text-gray-500">{item.example.english}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }