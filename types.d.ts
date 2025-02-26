interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    start(): void;
    stop(): void;
  }
  
  declare global {
    interface Window {
      webkitSpeechRecognition: new () => SpeechRecognition;
      SpeechRecognition: new () => SpeechRecognition;
    }
  }
  
  export {};