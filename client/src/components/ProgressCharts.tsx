import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CompletedWorkout {
  weekNumber: number;
  day: string;
  completed: boolean;
  date?: string;
  distance?: number;
  time?: string;
  pace?: string;
  notes?: string;
}

interface ProgressChartsProps {
  completedWorkouts: CompletedWorkout[];
  totalWeeks: number;
}

export function ProgressCharts({ completedWorkouts, totalWeeks }: ProgressChartsProps) {
  // Preparar dados para gráfico de frequência semanal
  const weeklyFrequencyData = Array.from({ length: totalWeeks }, (_, i) => {
    const weekNumber = i + 1;
    const weekWorkouts = completedWorkouts.filter(
      (w) => w.weekNumber === weekNumber && w.completed
    );
    return {
      week: `S${weekNumber}`,
      treinos: weekWorkouts.length,
    };
  });

  // Preparar dados para gráfico de distância semanal (estimado)
  const weeklyDistanceData = Array.from({ length: totalWeeks }, (_, i) => {
    const weekNumber = i + 1;
    const weekWorkouts = completedWorkouts.filter(
      (w) => w.weekNumber === weekNumber && w.completed
    );
    const totalDistance = weekWorkouts.reduce((sum, w) => sum + (w.distance || 0), 0);
    return {
      week: `S${weekNumber}`,
      distancia: totalDistance,
    };
  });

  // Preparar dados para gráfico de pace ao longo do tempo
  const paceData = completedWorkouts
    .filter((w) => w.completed && w.pace && w.date)
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
    .map((w, idx) => {
      // Converter pace "5:30" para minutos decimais
      const [min, sec] = w.pace!.split(":").map(Number);
      const paceDecimal = min + sec / 60;
      return {
        treino: `T${idx + 1}`,
        pace: paceDecimal.toFixed(2),
        data: new Date(w.date!).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
      };
    });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-muted-foreground">
              {entry.name}: <span className="font-bold text-primary">{entry.value}</span>
              {entry.name === "pace" && " min/km"}
              {entry.name === "distancia" && " km"}
              {entry.name === "treinos" && " treinos"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Gráfico de Frequência Semanal */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Frequência de Treinos por Semana</CardTitle>
          <CardDescription className="text-muted-foreground">
            Quantidade de treinos completados em cada semana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="week"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ color: "hsl(var(--foreground))" }}
                iconType="circle"
              />
              <Bar
                dataKey="treinos"
                fill="hsl(var(--primary))"
                radius={[8, 8, 0, 0]}
                name="Treinos"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Distância Semanal */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Volume Semanal (km)</CardTitle>
          <CardDescription className="text-muted-foreground">
            Distância total percorrida em cada semana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyDistanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="week"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ color: "hsl(var(--foreground))" }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="distancia"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", r: 5 }}
                activeDot={{ r: 7 }}
                name="Distância"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Evolução de Pace */}
      {paceData.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Evolução de Pace</CardTitle>
            <CardDescription className="text-muted-foreground">
              Ritmo médio dos treinos ao longo do tempo (min/km)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={paceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="treino"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  domain={["dataMin - 0.5", "dataMax + 0.5"]}
                  reversed
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ color: "hsl(var(--foreground))" }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="pace"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-2))", r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Pace"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

