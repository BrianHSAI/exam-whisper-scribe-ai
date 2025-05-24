
import { useState } from "react";
import { Plus, Trash2, Edit3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Scene {
  id: string;
  name: string;
  keywords: string[];
  startTime?: number;
  endTime?: number;
  description?: string;
}

const SceneManager = () => {
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: '1',
      name: 'Introduktion',
      keywords: ['velkommen', 'præsentation', 'formål'],
      description: 'Indledende præsentation og formål'
    },
    {
      id: '2', 
      name: 'Teori',
      keywords: ['teori', 'koncept', 'definition'],
      description: 'Teoretisk gennemgang af kernebegreber'
    }
  ]);
  
  const [newScene, setNewScene] = useState({
    name: '',
    keywords: '',
    description: ''
  });
  
  const [isAdding, setIsAdding] = useState(false);

  const addScene = () => {
    if (!newScene.name.trim()) {
      toast.error("Scene navn er påkrævet");
      return;
    }

    const scene: Scene = {
      id: Date.now().toString(),
      name: newScene.name.trim(),
      keywords: newScene.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0),
      description: newScene.description.trim() || undefined
    };

    setScenes([...scenes, scene]);
    setNewScene({ name: '', keywords: '', description: '' });
    setIsAdding(false);
    toast.success("Scene tilføjet");
  };

  const removeScene = (id: string) => {
    setScenes(scenes.filter(scene => scene.id !== id));
    toast.success("Scene fjernet");
  };

  const updateSceneTime = (id: string, type: 'start' | 'end') => {
    // This would typically be called during playback to mark scene boundaries
    const timestamp = Date.now(); // In real app, this would be the current playback time
    setScenes(scenes.map(scene => 
      scene.id === id 
        ? { ...scene, [type === 'start' ? 'startTime' : 'endTime']: timestamp }
        : scene
    ));
    toast.success(`Scene ${type === 'start' ? 'start' : 'slut'} markeret`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary-600" />
            <span>Scener</span>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            className="flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Tilføj Scene</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <div>
              <Label htmlFor="scene-name">Scene Navn</Label>
              <Input
                id="scene-name"
                placeholder="f.eks. Introduktion"
                value={newScene.name}
                onChange={(e) => setNewScene({...newScene, name: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="scene-keywords">Nøgleord (separeret med komma)</Label>
              <Input
                id="scene-keywords"
                placeholder="f.eks. velkommen, præsentation, formål"
                value={newScene.keywords}
                onChange={(e) => setNewScene({...newScene, keywords: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="scene-description">Beskrivelse (valgfri)</Label>
              <Textarea
                id="scene-description"
                placeholder="Kort beskrivelse af scenen..."
                rows={2}
                value={newScene.description}
                onChange={(e) => setNewScene({...newScene, description: e.target.value})}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={addScene} size="sm">Tilføj</Button>
              <Button 
                onClick={() => {
                  setIsAdding(false);
                  setNewScene({ name: '', keywords: '', description: '' });
                }}
                variant="outline" 
                size="sm"
              >
                Annuller
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {scenes.map((scene, index) => (
            <div key={scene.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="scene-badge">
                    Scene {index + 1}
                  </Badge>
                  <h3 className="font-semibold text-gray-900">{scene.name}</h3>
                </div>
                <Button
                  onClick={() => removeScene(scene.id)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              {scene.description && (
                <p className="text-sm text-gray-600">{scene.description}</p>
              )}
              
              {scene.keywords.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Nøgleord:</p>
                  <div className="flex flex-wrap gap-1">
                    {scene.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2 pt-2">
                <Button
                  onClick={() => updateSceneTime(scene.id, 'start')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Marker Start
                </Button>
                <Button
                  onClick={() => updateSceneTime(scene.id, 'end')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Marker Slut
                </Button>
              </div>
              
              {(scene.startTime || scene.endTime) && (
                <div className="text-xs text-gray-500 flex space-x-4">
                  {scene.startTime && <span>Start: {new Date(scene.startTime).toLocaleTimeString()}</span>}
                  {scene.endTime && <span>Slut: {new Date(scene.endTime).toLocaleTimeString()}</span>}
                </div>
              )}
            </div>
          ))}
        </div>

        {scenes.length === 0 && !isAdding && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Ingen scener defineret endnu</p>
            <p className="text-sm">Klik "Tilføj Scene" for at komme i gang</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SceneManager;
