
import { TrendingUp, MessageSquare, Clock, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AnalysisDashboardProps {
  transcription: string;
}

const AnalysisDashboard = ({ transcription }: AnalysisDashboardProps) => {
  // Calculate analysis metrics based on transcription
  const words = transcription.split(' ').filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Calculate Lix index (simplified)
  const sentences = transcription.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const longWords = words.filter(word => word.length > 6);
  const lixIndex = sentences.length > 0 ? Math.round((wordCount / sentences.length) + (longWords.length * 100 / wordCount)) : 0;
  
  // Count filler words
  const fillerWords = ['øh', 'eh', 'hm', 'hmm', 'jo', 'så', 'altså', 'vel', 'ikke'];
  const fillerCount = words.filter(word => 
    fillerWords.includes(word.toLowerCase().replace(/[,.!?]/g, ''))
  ).length;
  const fillerPercentage = wordCount > 0 ? Math.round((fillerCount / wordCount) * 100) : 0;
  
  // Extract speakers and calculate talk time
  const speakerMatches = transcription.match(/\[Taler \d+\]:/g) || [];
  const uniqueSpeakers = [...new Set(speakerMatches)].length;
  
  const analysisData = {
    wordCount,
    lixIndex,
    fillerCount,
    fillerPercentage,
    speakingTime: Math.round(wordCount * 0.5), // Rough estimate: 2 words per second
    uniqueSpeakers,
    clarity: Math.max(0, 100 - fillerPercentage * 2),
    engagement: Math.min(100, Math.max(0, (wordCount / 10) + (lixIndex * 2) - fillerPercentage))
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="analysis-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordantal</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.wordCount}</div>
            <p className="text-xs text-muted-foreground">
              Estimeret taletid: {Math.round(analysisData.speakingTime / 60)} min
            </p>
          </CardContent>
        </Card>

        <Card className="analysis-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lix-tal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.lixIndex}</div>
            <p className="text-xs text-muted-foreground">
              {analysisData.lixIndex < 30 ? 'Let læselig' : 
               analysisData.lixIndex < 40 ? 'Middel' : 
               analysisData.lixIndex < 50 ? 'Svær' : 'Meget svær'}
            </p>
          </CardContent>
        </Card>

        <Card className="analysis-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fyldord</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.fillerCount}</div>
            <p className="text-xs text-muted-foreground">
              {analysisData.fillerPercentage}% af ordene
            </p>
          </CardContent>
        </Card>

        <Card className="analysis-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Talere</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.uniqueSpeakers}</div>
            <p className="text-xs text-muted-foreground">
              Identificerede stemmer
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="analysis-card">
          <CardHeader>
            <CardTitle>Sproglig Klarhed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Klarhedsscore</span>
                <span>{analysisData.clarity}%</span>
              </div>
              <Progress value={analysisData.clarity} className="h-2" />
            </div>
            <div className="text-sm text-muted-foreground">
              Baseret på fyldord og sproglig kompleksitet
            </div>
          </CardContent>
        </Card>

        <Card className="analysis-card">
          <CardHeader>
            <CardTitle>Engagement Level</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Engagement</span>
                <span>{analysisData.engagement}%</span>
              </div>
              <Progress value={analysisData.engagement} className="h-2" />
            </div>
            <div className="text-sm text-muted-foreground">
              Baseret på ordantal, kompleksitet og klarhed
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="analysis-card">
        <CardHeader>
          <CardTitle>Feedback & Anbefalinger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-green-700 mb-2">Positive punkter:</h4>
              <ul className="text-sm space-y-1 text-green-600">
                {analysisData.wordCount > 200 && <li>• God mængde indhold dækket</li>}
                {analysisData.lixIndex >= 30 && analysisData.lixIndex <= 50 && <li>• Passende sproglig kompleksitet</li>}
                {analysisData.fillerPercentage < 10 && <li>• Begrænset brug af fyldord</li>}
                {analysisData.uniqueSpeakers >= 2 && <li>• God dialog og interaktion</li>}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-amber-700 mb-2">Forbedringspunkter:</h4>
              <ul className="text-sm space-y-1 text-amber-600">
                {analysisData.wordCount < 150 && <li>• Overvej at udvide indholdet</li>}
                {analysisData.fillerPercentage > 15 && <li>• Reducer brugen af fyldord som "øh", "hm"</li>}
                {analysisData.lixIndex < 25 && <li>• Øg sproglig kompleksitet</li>}
                {analysisData.lixIndex > 55 && <li>• Forenkle sproget lidt</li>}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisDashboard;
