
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
  keywords: string[];
  createdAt: string;
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
    keywords: ''
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

  const createRoom = () => {
    if (!newRoom.name.trim()) {
      toast.error("Rum navn er påkrævet");
      return;
    }

    if (!newRoom.keywords.trim()) {
      toast.error("Nøgleord er påkrævet");
      return;
    }

    const room: Room = {
      id: Date.now().toString(),
      name: newRoom.name.trim(),
      description: newRoom.description.trim() || undefined,
      keywords: newRoom.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0),
      createdAt: new Date().toISOString()
    };

    setRooms(prev => [...prev, room]);
    setNewRoom({ name: '', description: '', keywords: '' });
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
        if (!imported.name || !Array.isArray(imported.keywords)) {
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
    <Card className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="bg-gradient-to-r from-slate-700 to-blue-700 bg-clip-text text-transparent">Rum Manager</span>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                  <Key className="w-4 h-4 mr-1" />
                  API-nøgle
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="bg-gradient-to-r from-slate-700 to-blue-700 bg-clip-text text-transparent">Google Gemini API-nøgle</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>API-nøgle</Label>
                    <Input
                      type="password"
                      placeholder="Indtast din Google Gemini API-nøgle"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="border-slate-200 focus:border-blue-400"
                    />
                  </div>
                  <Button onClick={saveApiKey} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
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
              className="border-blue-200 hover:bg-blue-50"
            >
              <Upload className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => setIsCreatingRoom(true)}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Nyt Rum
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCreatingRoom && (
          <div className="border border-slate-200 rounded-lg p-4 space-y-4 bg-slate-50/50">
            <div>
              <Label className="text-slate-700">Rum Navn</Label>
              <Input
                placeholder="f.eks. Danske Noveller"
                value={newRoom.name}
                onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                className="border-slate-200 focus:border-blue-400"
              />
            </div>
            
            <div>
              <Label className="text-slate-700">Beskrivelse (valgfri)</Label>
              <Textarea
                placeholder="Kort beskrivelse af tekstområdet..."
                rows={2}
                value={newRoom.description}
                onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                className="border-slate-200 focus:border-blue-400"
              />
            </div>

            <div>
              <Label className="text-slate-700">Nøgleord (separeret med komma)</Label>
              <Textarea
                placeholder="f.eks. protagonist, antagonist, tematik, symbolik, fortælleteknik"
                rows={3}
                value={newRoom.keywords}
                onChange={(e) => setNewRoom({...newRoom, keywords: e.target.value})}
                className="border-slate-200 focus:border-blue-400"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={createRoom} size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Opret Rum
              </Button>
              <Button 
                onClick={() => {
                  setIsCreatingRoom(false);
                  setNewRoom({ name: '', description: '', keywords: '' });
                }}
                variant="outline" 
                size="sm"
                className="border-slate-300 hover:bg-slate-50"
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
              className={`border rounded-lg p-4 space-y-3 cursor-pointer transition-all duration-200 ${
                selectedRoomId === room.id 
                  ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md' 
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white/50'
              }`}
              onClick={() => onRoomSelect(room)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">{room.name}</h3>
                  {room.description && (
                    <p className="text-sm text-slate-600 mt-1">{room.description}</p>
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
                    className="hover:bg-blue-100"
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
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Nøgleord ({room.keywords.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {room.keywords.map((keyword, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <p className="text-xs text-slate-500">
                Oprettet: {new Date(room.createdAt).toLocaleDateString('da-DK')}
              </p>
            </div>
          ))}
        </div>

        {rooms.length === 0 && !isCreatingRoom && (
          <div className="text-center py-8 text-slate-500">
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
