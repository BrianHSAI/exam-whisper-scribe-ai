
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExamTapeHeader from "@/components/ExamTapeHeader";
import RecordingPanel from "@/components/RecordingPanel";
import RoomManager from "@/components/RoomManager";
import TranscriptionViewer from "@/components/TranscriptionViewer";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import QuestionAnswer from "@/components/QuestionAnswer";

interface Room {
  id: string;
  name: string;
  description?: string;
  keywords: string[];
  createdAt: string;
}

const Index = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    setIsAnalyzing(true);
    setShowResults(false);
    
    // Simulate transcription process
    setTimeout(() => {
      const mockTranscription = `[Taler 1]: Velkommen til dagens eksamen. Jeg hedder Lars, og jeg vil være jeres eksaminator i dag.

[Taler 2]: Tak skal du have. Jeg hedder Marie, og jeg skal præsentere mit projekt om kunstig intelligens.

[Taler 1]: Fantastisk. Kan du starte med at give os en kort introduktion til dit projekt?

[Taler 2]: Ja, selvfølgelig. Mit projekt fokuserer på, øh, implementering af machine learning algoritmer til, øh, tekstanalyse. Jeg har arbejdet med naturlig sprogbehandling og, hmm, forskellige former for sentiment analyse.

[Taler 1]: Interessant. Hvilke specifikke algoritmer har du arbejdet med?

[Taler 2]: Jeg har primært brugt neural networks, særligt LSTM og transformer modeller. Øh, jeg har også eksperimenteret med BERT til contextual embeddings.`;
      
      setTranscription(mockTranscription);
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ExamTapeHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
            Intelligent Samtaleanalyse
          </h1>
          <p className="text-lg text-slate-600">
            Optag, transskriber og analyser samtaler med avanceret AI-teknologi
          </p>
        </div>

        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
            <TabsTrigger value="rooms" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Rum</TabsTrigger>
            <TabsTrigger value="recording" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Optagelse</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-6">
            <RoomManager 
              onRoomSelect={handleRoomSelect}
              selectedRoomId={selectedRoom?.id}
            />
          </TabsContent>

          <TabsContent value="recording" className="space-y-6">
            <RecordingPanel 
              selectedRoom={selectedRoom}
              onRecordingComplete={handleRecordingComplete}
            />
            
            {isAnalyzing && (
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-lg">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-slate-700 font-medium">Transskriberer og analyserer...</span>
                  </div>
                </div>
              </div>
            )}

            {showResults && (
              <div className="space-y-6">
                <TranscriptionViewer transcription={transcription} selectedRoom={selectedRoom} />
                <AnalysisDashboard transcription={transcription} />
                <QuestionAnswer transcription={transcription} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
