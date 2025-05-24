
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
  const [showResults, setShowResults] = useState(false);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleRecordingComplete = () => {
    setIsAnalyzing(true);
    // Simulate processing time
    setTimeout(() => {
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
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
            <TabsTrigger value="rooms" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Rum</TabsTrigger>
            <TabsTrigger value="recording" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Optagelse</TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Analyse</TabsTrigger>
            <TabsTrigger value="transcription" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Transskription & Spørgsmål</TabsTrigger>
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
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {showResults ? (
              <AnalysisDashboard />
            ) : (
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-8 shadow-lg text-center">
                <p className="text-slate-600">Foretag en optagelse først for at se analyseresultater</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="transcription" className="space-y-6">
            {showResults ? (
              <div className="space-y-6">
                <TranscriptionViewer />
                <QuestionAnswer />
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-8 shadow-lg text-center">
                <p className="text-slate-600">Foretag en optagelse først for at se transskription</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
