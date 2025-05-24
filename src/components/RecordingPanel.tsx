
import { useState, useRef } from "react";
import { Mic, Square, Play, Pause, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const RecordingPanel = () => {
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
      
      toast.success("Optagelse stoppet");
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mic className="w-5 h-5 text-primary-600" />
          <span>Lydoptagelse</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            <Button
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full ${
                isRecording 
                  ? 'bg-destructive hover:bg-destructive/90 recording-indicator' 
                  : 'academic-gradient hover:opacity-90'
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
            <div className="text-3xl font-mono font-bold text-gray-900">
              {formatTime(recordingTime)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {isRecording ? (isPaused ? 'Sat på pause' : 'Optager...') : 'Klar til optagelse'}
            </div>
          </div>
        </div>

        {isRecording && (
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={pauseRecording}
              className="flex items-center space-x-2"
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
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Optagelse</span>
            </Button>
          </div>
        )}

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Mikrofon klar - Klik for at begynde optagelse</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordingPanel;
