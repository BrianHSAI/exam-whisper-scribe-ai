import { useState } from "react";
import { FileText, Search, Users, Download, Edit3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  description?: string;
  keywords: string[];
  createdAt: string;
}

interface TranscriptionViewerProps {
  transcription: string;
  selectedRoom?: Room;
}

const TranscriptionViewer = ({ transcription: initialTranscription, selectedRoom }: TranscriptionViewerProps) => {
  const [transcription, setTranscription] = useState(initialTranscription);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTranscription, setEditedTranscription] = useState(initialTranscription);

  const keywords = selectedRoom?.keywords || [];
  const missingKeywords = keywords.filter(keyword => 
    !transcription.toLowerCase().includes(keyword.toLowerCase())
  );

  const highlightText = (text: string) => {
    if (!searchTerm && keywords.length === 0) return text;
    
    let highlightedText = text;
    
    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="keyword-highlight">$1</mark>');
    });
    
    // Highlight search term
    if (searchTerm) {
      const searchRegex = new RegExp(`(${searchTerm})`, 'gi');
      highlightedText = highlightedText.replace(searchRegex, '<mark class="bg-yellow-200">$1</mark>');
    }
    
    return highlightedText;
  };

  const saveEdits = () => {
    setTranscription(editedTranscription);
    setIsEditing(false);
    toast.success("Transskription opdateret");
  };

  const cancelEdits = () => {
    setEditedTranscription(transcription);
    setIsEditing(false);
  };

  const downloadTranscription = () => {
    const blob = new Blob([transcription], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `examtape-transcription-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Transskription downloadet");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary-600" />
            <span>Transskription</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Annuller' : 'Rediger'}</span>
            </Button>
            <Button
              onClick={downloadTranscription}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Søg i transskription..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>2 talere identificeret</span>
          </div>
        </div>

        {keywords.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Fundne nøgleord:</p>
            <div className="flex flex-wrap gap-1">
              {keywords.filter(keyword => 
                transcription.toLowerCase().includes(keyword.toLowerCase())
              ).map((keyword, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs bg-accent-100 text-accent-700">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {missingKeywords.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Ikke nævnte nøgleord:</p>
            <div className="flex flex-wrap gap-1">
              {missingKeywords.map((keyword, idx) => (
                <Badge key={idx} variant="destructive" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="border rounded-lg p-4 bg-muted/30">
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editedTranscription}
                onChange={(e) => setEditedTranscription(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
              <div className="flex space-x-2">
                <Button onClick={saveEdits} size="sm">Gem ændringer</Button>
                <Button onClick={cancelEdits} variant="outline" size="sm">Annuller</Button>
              </div>
            </div>
          ) : (
            <div 
              className="prose prose-sm max-w-none font-mono text-sm whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightText(transcription) }}
            />
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Sidst opdateret: {new Date().toLocaleString('da-DK')}</span>
          <span>{transcription.split(' ').length} ord | {transcription.length} tegn</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptionViewer;
