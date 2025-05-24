
import { useState, useRef } from "react";
import { Mic, Square, Play, Pause, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  description?: string;
  keywords: string[];
  createdAt: string;
}

interface RecordingPanelProps {
  selectedRoom?: Room;
  onRecordingComplete?: () => void;
}

const RecordingPanel = ({ selectedRoom, onRecordingComplete }: RecordingPanelProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        
        // Trigger automatic processing
        if (onRecordingComplete) {
          onRecordingComplete();
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success("Optagelse startet");
    } catch (error) {
      toast.error("Kunne ikke tilgå mikrofon");
      console.error("Recording error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      toast.success("Optagelse stoppet - Starter transskription...");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        intervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
        setIsPaused(false);
        toast.info("Optagelse genoptaget");
      } else {
        mediaRecorderRef.current.pause();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setIsPaused(true);
        toast.info("Optagelse sat på pause");
      }
    }
  };

  const downloadRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `examtape-recording-${new Date().toISOString()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Optagelse downloadet");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
        <CardTitle className="flex items-center space-x-2">
          <Mic className="w-5 h-5 text-blue-600" />
          <span className="bg-gradient-to-r from-slate-700 to-blue-700 bg-clip-text text-transparent">Lydoptagelse</span>
          {selectedRoom && (
            <Badge variant="secondary" className="ml-auto bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200">
              {selectedRoom.name}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedRoom && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Aktivt rum: {selectedRoom.name}</h4>
            {selectedRoom.description && (
              <p className="text-sm text-blue-700 mb-3">{selectedRoom.description}</p>
            )}
            <div>
              <p className="text-sm font-medium text-blue-700 mb-2">Nøgleord der søges efter:</p>
              <div className="flex flex-wrap gap-1">
                {selectedRoom.keywords.map((keyword, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs border-blue-300 text-blue-600 bg-blue-50">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            <Button
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full ${
                isRecording 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 recording-indicator shadow-lg' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg'
              } transition-all duration-300`}
            >
              {isRecording ? (
                <Square className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </Button>
          </div>
          
          <div className="mt-4">
            <div className="text-3xl font-mono font-bold bg-gradient-to-r from-slate-700 to-blue-700 bg-clip-text text-transparent">
              {formatTime(recordingTime)}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {isRecording ? (isPaused ? 'Sat på pause' : 'Optager...') : 'Klar til optagelse'}
            </div>
          </div>
        </div>

        {isRecording && (
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={pauseRecording}
              className="flex items-center space-x-2 border-slate-300 hover:bg-slate-50"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span>{isPaused ? 'Genoptag' : 'Pause'}</span>
            </Button>
          </div>
        )}

        {audioBlob && !isRecording && (
          <div className="flex justify-center">
            <Button
              onClick={downloadRecording}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Download className="w-4 h-4" />
              <span>Download Optagelse</span>
            </Button>
          </div>
        )}

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-sm text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Mikrofon klar - Klik for at begynde optagelse</span>
          </div>
          {!selectedRoom && (
            <p className="text-xs text-green-600 mt-1">Vælg et rum først for optimale analyseresultater</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordingPanel;
