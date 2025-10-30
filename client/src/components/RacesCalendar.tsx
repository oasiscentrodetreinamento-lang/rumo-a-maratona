import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, DollarSign, Mountain, ExternalLink, Star } from "lucide-react";

interface Race {
  id: number;
  name: string;
  date: string;
  city: string;
  state: string;
  distance: string;
  url: string;
  deadline: string;
  price: string;
  terrain: string;
  recommended: boolean;
  trainingWeek: number | null;
  description: string;
}

export default function RacesCalendar() {
  const [races, setRaces] = useState<Race[]>([]);
  const [filteredRaces, setFilteredRaces] = useState<Race[]>([]);
  const [selectedDistance, setSelectedDistance] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [showOnlyRecommended, setShowOnlyRecommended] = useState<boolean>(false);

  useEffect(() => {
    fetch("/races-calendar.json")
      .then((res) => res.json())
      .then((data) => {
        setRaces(data.races);
        setFilteredRaces(data.races);
      });
  }, []);

  useEffect(() => {
    let filtered = races;

    if (selectedDistance !== "all") {
      filtered = filtered.filter((race) => race.distance === selectedDistance);
    }

    if (selectedState !== "all") {
      filtered = filtered.filter((race) => race.state === selectedState);
    }

    if (showOnlyRecommended) {
      filtered = filtered.filter((race) => race.recommended);
    }

    // Ordenar por data
    filtered = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setFilteredRaces(filtered);
  }, [selectedDistance, selectedState, showOnlyRecommended, races]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getTerrainIcon = (terrain: string) => {
    if (terrain === "ondulado" || terrain === "montanha") {
      return <Mountain className="w-4 h-4" />;
    }
    return null;
  };

  const getDistanceBadgeColor = (distance: string) => {
    if (distance === "5km") return "bg-green-500/20 text-green-400 border-green-500/30";
    if (distance === "10km") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (distance === "15km") return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    if (distance === "21km") return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    if (distance === "42km") return "bg-red-500/20 text-red-400 border-red-500/30";
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-6 bg-zinc-900 border-zinc-800">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-zinc-400 mb-2 block">Distância</label>
            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white"
            >
              <option value="all">Todas as distâncias</option>
              <option value="5km">5km</option>
              <option value="10km">10km</option>
              <option value="15km">15km</option>
              <option value="21km">21km (Meia Maratona)</option>
              <option value="42km">42km (Maratona)</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-zinc-400 mb-2 block">Estado</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white"
            >
              <option value="all">Todos os estados</option>
              <option value="MG">Minas Gerais</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant={showOnlyRecommended ? "default" : "outline"}
              onClick={() => setShowOnlyRecommended(!showOnlyRecommended)}
              className="gap-2"
            >
              <Star className={`w-4 h-4 ${showOnlyRecommended ? "fill-yellow-400" : ""}`} />
              Recomendadas
            </Button>
          </div>
        </div>

        <div className="mt-4 text-sm text-zinc-400">
          Mostrando {filteredRaces.length} de {races.length} provas
        </div>
      </Card>

      {/* Lista de Provas */}
      <div className="grid gap-4">
        {filteredRaces.map((race) => (
          <Card
            key={race.id}
            className={`p-6 bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors ${
              race.recommended ? "ring-2 ring-yellow-500/30" : ""
            }`}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  {race.recommended && (
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{race.name}</h3>
                    {race.recommended && race.trainingWeek && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-2">
                        Recomendada para Semana {race.trainingWeek}
                      </Badge>
                    )}
                    {race.distance === "42km" && race.name.includes("Rio") && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-2">
                        🎯 SUA META!
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-zinc-400 text-sm mb-4">{race.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <span>{formatDate(race.date)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-300">
                    <MapPin className="w-4 h-4 text-zinc-500" />
                    <span>
                      {race.city}, {race.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-300">
                    <DollarSign className="w-4 h-4 text-zinc-500" />
                    <span>{race.price}</span>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-300">
                    {getTerrainIcon(race.terrain)}
                    <span className="capitalize">{race.terrain}</span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-zinc-500">
                  Prazo de inscrição: {formatDate(race.deadline)}
                </div>
              </div>

              <div className="flex flex-col gap-3 md:items-end justify-between">
                <Badge className={`${getDistanceBadgeColor(race.distance)} text-lg font-bold px-4 py-2`}>
                  {race.distance}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(race.url, "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver Prova
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredRaces.length === 0 && (
          <Card className="p-12 bg-zinc-900 border-zinc-800 text-center">
            <p className="text-zinc-400">Nenhuma prova encontrada com os filtros selecionados.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

