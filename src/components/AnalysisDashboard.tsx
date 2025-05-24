
import { BarChart3, TrendingUp, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const AnalysisDashboard = () => {
  const analysisData = {
    lixtal: 42,
    fillerWords: {
      total: 23,
      percentage: 8.2,
      breakdown: [
        { word: "øh", count: 12 },
        { word: "hmm", count: 6 },
        { word: "jo", count: 3 },
        { word: "så", count: 2 }
      ]
    },
    keywordCoverage: 73,
    speakerStats: [
      { name: "Taler 1", wordCount: 156, percentage: 35 },
      { name: "Taler 2", wordCount: 289, percentage: 65 }
    ],
    positives: [
      "Klar struktur i præsentationen",
      "God brug af fagterminologi",
      "Relevant eksempelbrug"
    ],
    improvements: [
      "Reducer brugen af fyldord",
      "Øg tempo i introduktionen",
      "Uddyb teoretiske begreber"
    ]
  };

  const getLixtalLevel = (score: number) => {
    if (score < 25) return { level: "Meget let", color: "bg-green-500" };
    if (score < 35) return { level: "Let", color: "bg-green-400" };
    if (score < 45) return { level: "Middel", color: "bg-yellow-500" };
    if (score < 55) return { level: "Svær", color: "bg-orange-500" };
    return { level: "Meget svær", color: "bg-red-500" };
  };

  const lixtalInfo = getLixtalLevel(analysisData.lixtal);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Lixtal Analysis */}
      <Card className="analysis-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            <span>Lixtal Analyse</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {analysisData.lixtal}
            </div>
            <Badge className={`${lixtalInfo.color} text-white`}>
              {lixtalInfo.level}
            </Badge>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Læsbarhed</span>
              <span>{Math.round((60 - analysisData.lixtal) * 100 / 60)}%</span>
            </div>
            <Progress value={(60 - analysisData.lixtal) * 100 / 60} className="h-2" />
          </div>
          <div className="text-sm text-gray-600">
            <p>Lixtal måler tekstens kompleksitet. Lavere værdi = lettere at læse.</p>
          </div>
        </CardContent>
      </Card>

      {/* Filler Words */}
      <Card className="analysis-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-primary-600" />
            <span>Fyldord Analyse</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {analysisData.fillerWords.total}
              </div>
              <div className="text-sm text-gray-600">
                {analysisData.fillerWords.percentage}% af alle ord
              </div>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              analysisData.fillerWords.percentage > 10 ? 'bg-red-100' : 
              analysisData.fillerWords.percentage > 5 ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              <span className={`text-sm font-bold ${
                analysisData.fillerWords.percentage > 10 ? 'text-red-600' : 
                analysisData.fillerWords.percentage > 5 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {analysisData.fillerWords.percentage}%
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            {analysisData.fillerWords.breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm font-medium">"{item.word}"</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${(item.count / analysisData.fillerWords.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Speaker Statistics */}
      <Card className="analysis-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <span>Taler Statistik</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysisData.speakerStats.map((speaker, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{speaker.name}</span>
                <span className="text-sm text-gray-600">{speaker.wordCount} ord</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={speaker.percentage} className="flex-1 h-2" />
                <span className="text-sm font-medium text-gray-600 w-12">
                  {speaker.percentage}%
                </span>
              </div>
            </div>
          ))}
          
          <div className="pt-2 border-t">
            <div className="text-sm text-gray-600">
              Total ord: {analysisData.speakerStats.reduce((sum, s) => sum + s.wordCount, 0)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card className="analysis-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-success-600" />
            <span>Feedback & Forbedringer</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-success-700 mb-3 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Styrker</span>
            </h4>
            <ul className="space-y-2">
              {analysisData.positives.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-orange-700 mb-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Forbedringsområder</span>
            </h4>
            <ul className="space-y-2">
              {analysisData.improvements.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisDashboard;
