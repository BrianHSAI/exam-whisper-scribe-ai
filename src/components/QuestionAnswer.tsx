
import { useState } from "react";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface QuestionAnswerProps {
  transcription: string;
}

const QuestionAnswer = ({ transcription }: QuestionAnswerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hej! Jeg er klar til at besvare spørgsmål om din transskription. Hvad vil du gerne vide?',
      timestamp: new Date()
    }
  ]);
  
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const exampleQuestions = [
    "Hvad var de vigtigste punkter i samtalen?",
    "Hvilke fagtermer blev nævnt?",
    "Hvordan var fordelingen af taletid?",
    "Var der nogle misforståelser i samtalen?"
  ];

  const sendQuestion = async () => {
    if (!currentQuestion.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentQuestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentQuestion('');
    setIsLoading(true);

    // Simulate AI response based on transcription
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateResponse(userMessage.content, transcription),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateResponse = (question: string, transcription: string): string => {
    const words = transcription.split(' ').length;
    const speakers = (transcription.match(/\[Taler \d+\]:/g) || []).length;
    
    if (question.toLowerCase().includes('vigtigste')) {
      return 'Baseret på transskriptionen var de vigtigste punkter: 1) Præsentation af AI-projekt, 2) Diskussion af machine learning algoritmer, særligt neural networks og BERT, 3) Fokus på tekstanalyse og sentiment analyse.';
    } else if (question.toLowerCase().includes('fagterm')) {
      return 'De følgende fagtermer blev nævnt: neural networks, LSTM, transformer modeller, BERT, contextual embeddings, machine learning, og sentiment analyse. Dette viser en god teknisk forståelse.';
    } else if (question.toLowerCase().includes('taletid')) {
      return `Baseret på transskriptionen var der ${speakers} talesekvenser. Den samlede transskription indeholder ${words} ord, hvilket svarer til cirka ${Math.round(words * 0.5 / 60)} minutters tale.`;
    }
    return 'Det er et interessant spørgsmål. Baseret på transskriptionen kan jeg se forskellige mønstre og detaljer. Kan du være mere specifik om hvad du leder efter?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-primary-600" />
          <span>Spørgsmål & Svar</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        <div className="flex-1 overflow-y-auto space-y-4 max-h-[400px]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-accent-100 text-accent-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              
              <div className={`flex-1 max-w-[80%] ${
                message.type === 'user' ? 'text-right' : ''
              }`}>
                <div className={`inline-block p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-muted border'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString('da-DK')}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted border rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Forsøg disse spørgsmål:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {exampleQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(question)}
                className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded border transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="Stil et spørgsmål om transskriptionen..."
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendQuestion}
            disabled={!currentQuestion.trim() || isLoading}
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const handleKeyPress = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendQuestion();
  }
};

export default QuestionAnswer;
