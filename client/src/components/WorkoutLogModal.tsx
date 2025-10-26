import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface WorkoutLogModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: WorkoutLogData) => void;
  workoutName: string;
  plannedDistance: number;
}

export interface WorkoutLogData {
  distance: number;
  time: string;
  pace: string;
  notes: string;
}

export function WorkoutLogModal({
  open,
  onClose,
  onSave,
  workoutName,
  plannedDistance,
}: WorkoutLogModalProps) {
  const [distance, setDistance] = useState(plannedDistance.toString());
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [notes, setNotes] = useState("");

  const calculatePace = () => {
    const dist = parseFloat(distance);
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;

    if (dist > 0) {
      const totalMinutes = h * 60 + m + s / 60;
      const paceMinutes = totalMinutes / dist;
      const paceMin = Math.floor(paceMinutes);
      const paceSec = Math.round((paceMinutes - paceMin) * 60);
      return `${paceMin}:${paceSec.toString().padStart(2, "0")}`;
    }
    return "0:00";
  };

  const handleSave = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const timeStr = `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

    onSave({
      distance: parseFloat(distance),
      time: timeStr,
      pace: calculatePace(),
      notes,
    });

    // Reset form
    setDistance(plannedDistance.toString());
    setHours("");
    setMinutes("");
    setSeconds("");
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Registrar Treino</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {workoutName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Distância */}
          <div className="space-y-2">
            <Label htmlFor="distance" className="text-foreground">
              Distância (km)
            </Label>
            <Input
              id="distance"
              type="number"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="10.5"
              className="bg-background border-border text-foreground"
            />
          </div>

          {/* Tempo */}
          <div className="space-y-2">
            <Label className="text-foreground">Tempo</Label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="hours" className="text-xs text-muted-foreground">
                  Horas
                </Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="0"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="minutes" className="text-xs text-muted-foreground">
                  Minutos
                </Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="45"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="seconds" className="text-xs text-muted-foreground">
                  Segundos
                </Label>
                <Input
                  id="seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  placeholder="30"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Pace Calculado */}
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pace médio:</span>
              <span className="text-2xl font-bold font-mono text-primary">
                {calculatePace()}/km
              </span>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-foreground">
              Observações (opcional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Como foi o treino? Como você se sentiu?"
              className="bg-background border-border text-foreground min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Treino</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

