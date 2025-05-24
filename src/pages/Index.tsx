
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExamTapeHeader from "@/components/ExamTapeHeader";
import RecordingPanel from "@/components/RecordingPanel";
import SceneManager from "@/components/SceneManager";
import RoomManager from "@/components/RoomManager";
import TranscriptionViewer from "@/components/TranscriptionViewer";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import QuestionAnswer from "@/components/QuestionAnswer";

interface Room {
  id: string;
  name: string;
  description?: string;
  scenes: RoomScene[];
  createdAt: string;
}

interface RoomScene {
  id: string;
  name: string;
  keywords: string[];
  description?: string;
}

const Index = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="min-h-screen bg-background">
      <ExamTapeHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Intelligent Samtaleanalyse
          </h1>
          <p className="text-lg text-gray-600">
            Optag, transskriber og analyser samtaler med avanceret AI-teknologi
          </p>
        </div>

        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="rooms">Rum</TabsTrigger>
            <TabsTrigger value="recording">Optagelse</TabsTrigger>
            <TabsTrigger value="scenes">Scener</TabsTrigger>
            <TabsTrigger value="transcription">Transskription</TabsTrigger>
            <TabsTrigger value="analysis">Analyse</TabsTrigger>
            <TabsTrigger value="questions">Spørgsmål</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-6">
            <RoomManager 
              onRoomSelect={handleRoomSelect}
              selectedRoomId={selectedRoom?.id}
            />
          </TabsContent>

          <TabsContent value="recording" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecordingPanel />
              </div>
              <div>
                <SceneManager selectedRoom={selectedRoom} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scenes" className="space-y-6">
            <SceneManager selectedRoom={selectedRoom} />
          </TabsContent>

          <TabsContent value="transcription" className="space-y-6">
            <TranscriptionViewer />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <AnalysisDashboard />
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <QuestionAnswer />
              </div>
              <div className="space-y-4">
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Hurtige Indsigter</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Samlet varighed:</span>
                      <span className="font-medium">12:34</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Antal talere:</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ord i alt:</span>
                      <span className="font-medium">445</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lixtal:</span>
                      <span className="font-medium">42</span>
                    </div>
                    {selectedRoom && (
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span>Aktivt rum:</span>
                        <span className="font-medium text-primary-600">{selectedRoom.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
