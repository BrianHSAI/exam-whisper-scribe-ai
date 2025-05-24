
import { useState, useEffect } from "react";
import { Building2, Plus, Trash2, Download, Upload, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

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

interface RoomManagerProps {
  onRoomSelect: (room: Room) => void;
  selectedRoomId?: string;
}

const RoomManager = ({ onRoomSelect, selectedRoomId }: RoomManagerProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    scenes: [] as RoomScene[]
  });
  const [newScene, setNewScene] = useState({
    name: '',
    keywords: '',
    description: ''
  });

  // Load rooms and API key from localStorage on mount
  useEffect(() => {
    const savedRooms = localStorage.getItem('examtape-rooms');
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms));
    }
    
    const savedApiKey = localStorage.getItem('examtape-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save rooms to localStorage whenever rooms change
  useEffect(() => {
    localStorage.setItem('examtape-rooms', JSON.stringify(rooms));
  }, [rooms]);

  // Save API key to localStorage
  const saveApiKey = () => {
    localStorage.setItem('examtape-api-key', apiKey);
    toast.success('API-nøgle gemt');
  };

  const addSceneToNewRoom = () => {
    if (!newScene.name.trim()) {
      toast.error("Scene navn er påkrævet");
      return;
    }

    const scene: RoomScene = {
      id: Date.now().toString() + Math.random(),
      name: newScene.name.trim(),
      keywords: newScene.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0),
      description: newScene.description.trim() || undefined
    };

    setNewRoom(prev => ({
      ...prev,
      scenes: [...prev.scenes, scene]
    }));
    
    setNewScene({ name: '', keywords: '', description: '' });
    toast.success("Scene tilføjet til nyt rum");
  };

  const removeSceneFromNewRoom = (sceneId: string) => {
    setNewRoom(prev => ({
      ...prev,
      scenes: prev.scenes.filter(scene => scene.id !== sceneId)
    }));
  };

  const createRoom = () => {
    if (!newRoom.name.trim()) {
      toast.error("Rum navn er påkrævet");
      return;
    }

    if (newRoom.scenes.length === 0) {
      toast.error("Mindst én scene er påkrævet");
      return;
    }

    const room: Room = {
      id: Date.now().toString(),
      name: newRoom.name.trim(),
      description: newRoom.description.trim() || undefined,
      scenes: newRoom.scenes,
      createdAt: new Date().toISOString()
    };

    setRooms(prev => [...prev, room]);
    setNewRoom({ name: '', description: '', scenes: [] });
    setIsCreatingRoom(false);
    toast.success("Rum oprettet");
  };

  const deleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
    toast.success("Rum slettet");
  };

  const exportRoom = (room: Room) => {
    const dataStr = JSON.stringify(room, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${room.name.replace(/\s+/g, '_')}_rum.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Rum eksporteret");
  };

  const importRoom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        
        // Validate imported room structure
        if (!imported.name || !Array.isArray(imported.scenes)) {
          throw new Error('Ugyldig rum struktur');
        }

        const room: Room = {
          ...imported,
          id: Date.now().toString(), // Generate new ID to avoid conflicts
          createdAt: new Date().toISOString()
        };

        setRooms(prev => [...prev, room]);
        toast.success(`Rum "${room.name}" importeret`);
      } catch (error) {
        toast.error("Fejl ved import af rum");
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-primary-600" />
            <span>Rum Manager</span>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Key className="w-4 h-4 mr-1" />
                  API-nøgle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Google Gemini API-nøgle</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>API-nøgle</Label>
                    <Input
                      type="password"
                      placeholder="Indtast din Google Gemini API-nøgle"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  <Button onClick={saveApiKey} className="w-full">
                    Gem API-nøgle
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <input
              type="file"
              accept=".json"
              onChange={importRoom}
              style={{ display: 'none' }}
              id="import-room"
            />
            <Button
              onClick={() => document.getElementById('import-room')?.click()}
              variant="outline"
              size="sm"
            >
              <Upload className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => setIsCreatingRoom(true)}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Nyt Rum
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCreatingRoom && (
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <div>
              <Label>Rum Navn</Label>
              <Input
                placeholder="f.eks. Danske Noveller"
                value={newRoom.name}
                onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Beskrivelse (valgfri)</Label>
              <Textarea
                placeholder="Kort beskrivelse af rummet..."
                rows={2}
                value={newRoom.description}
                onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Tilføj Scener</h4>
              <div className="space-y-3">
                <div>
                  <Label>Scene Navn</Label>
                  <Input
                    placeholder="f.eks. Analyse af karakterer"
                    value={newScene.name}
                    onChange={(e) => setNewScene({...newScene, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Nøgleord (separeret med komma)</Label>
                  <Input
                    placeholder="f.eks. protagonist, antagonist, udvikling"
                    value={newScene.keywords}
                    onChange={(e) => setNewScene({...newScene, keywords: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Beskrivelse (valgfri)</Label>
                  <Input
                    placeholder="Kort beskrivelse..."
                    value={newScene.description}
                    onChange={(e) => setNewScene({...newScene, description: e.target.value})}
                  />
                </div>
                <Button onClick={addSceneToNewRoom} size="sm" variant="outline">
                  Tilføj Scene
                </Button>
              </div>
            </div>

            {newRoom.scenes.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">Tilføjede Scener:</h5>
                <div className="space-y-2">
                  {newRoom.scenes.map((scene) => (
                    <div key={scene.id} className="flex items-center justify-between bg-background p-2 rounded">
                      <div>
                        <span className="font-medium">{scene.name}</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {scene.keywords.map((keyword, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => removeSceneFromNewRoom(scene.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button onClick={createRoom} size="sm">Opret Rum</Button>
              <Button 
                onClick={() => {
                  setIsCreatingRoom(false);
                  setNewRoom({ name: '', description: '', scenes: [] });
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
          {rooms.map((room) => (
            <div 
              key={room.id} 
              className={`border rounded-lg p-4 space-y-3 cursor-pointer transition-colors ${
                selectedRoomId === room.id ? 'border-primary-500 bg-primary-50' : 'hover:bg-muted/30'
              }`}
              onClick={() => onRoomSelect(room)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{room.name}</h3>
                  {room.description && (
                    <p className="text-sm text-gray-600 mt-1">{room.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      exportRoom(room);
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRoom(room.id);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Scener ({room.scenes.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {room.scenes.map((scene) => (
                    <Badge key={scene.id} variant="outline" className="text-xs">
                      {scene.name} ({scene.keywords.length} nøgleord)
                    </Badge>
                  ))}
                </div>
              </div>
              
              <p className="text-xs text-gray-500">
                Oprettet: {new Date(room.createdAt).toLocaleDateString('da-DK')}
              </p>
            </div>
          ))}
        </div>

        {rooms.length === 0 && !isCreatingRoom && (
          <div className="text-center py-8 text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Ingen rum oprettet endnu</p>
            <p className="text-sm">Klik "Nyt Rum" for at komme i gang</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoomManager;
