import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  Circle,
  Dumbbell,
  Trophy,
  Activity,
  Edit3,
  BarChart3
} from "lucide-react";
import { WorkoutLogModal, WorkoutLogData } from "@/components/WorkoutLogModal";
import { ProgressCharts } from "@/components/ProgressCharts";

interface TrainingData {
  athlete: {
    name: string;
    age: number;
    weight: number;
    height: number;
    bodyFat: number;
    currentPerformance: {
      "5k": string;
      "11k": string;
    };
    goal: {
      race: string;
      date: string;
      targetTime: string;
      targetPace: string;
    };
  };
  block1: {
    name: string;
    startDate: string;
    endDate: string;
    totalWeeks: number;
    weeks: Array<{
      weekNumber: number;
      weekName: string;
      totalDistance: number;
      days: Array<{
        day: string;
        type: string;
        name: string;
        description?: string;
        totalDistance: number;
        pace?: string;
        workouts?: any[];
        notes?: string;
      }>;
    }>;
  };
  strengthExercises: Array<{
    id: number;
    name: string;
    sets: number;
    reps: string;
    duration?: string;
    focus: string;
    description: string;
  }>;
  trainingZones: {
    [key: string]: {
      name: string;
      hrPercent: string;
      pace: string;
      description: string;
    };
  };
}

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

export default function Home() {
  const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<{
    weekNumber: number;
    day: string;
    name: string;
    plannedDistance: number;
  } | null>(null);

  useEffect(() => {
    // Carregar dados do JSON
    fetch("/training-data.json")
      .then((res) => res.json())
      .then((data) => {
        setTrainingData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar dados:", err);
        setLoading(false);
      });

    // Carregar progresso do localStorage
    const saved = localStorage.getItem("trainingProgress");
    if (saved) {
      setCompletedWorkouts(JSON.parse(saved));
    }
  }, []);

  const toggleWorkoutComplete = (weekNumber: number, day: string) => {
    const existing = completedWorkouts.find(
      (w) => w.weekNumber === weekNumber && w.day === day
    );

    let updated: CompletedWorkout[];
    if (existing) {
      updated = completedWorkouts.map((w) =>
        w.weekNumber === weekNumber && w.day === day
          ? { ...w, completed: !w.completed }
          : w
      );
    } else {
      updated = [
        ...completedWorkouts,
        {
          weekNumber,
          day,
          completed: true,
          date: new Date().toISOString(),
        },
      ];
    }

    setCompletedWorkouts(updated);
    localStorage.setItem("trainingProgress", JSON.stringify(updated));
  };

  const openLogModal = (weekNumber: number, day: string, name: string, plannedDistance: number) => {
    setSelectedWorkout({ weekNumber, day, name, plannedDistance });
    setLogModalOpen(true);
  };

  const saveWorkoutLog = (data: WorkoutLogData) => {
    if (!selectedWorkout) return;

    const updated = completedWorkouts.map((w) =>
      w.weekNumber === selectedWorkout.weekNumber && w.day === selectedWorkout.day
        ? {
            ...w,
            completed: true,
            distance: data.distance,
            time: data.time,
            pace: data.pace,
            notes: data.notes,
            date: new Date().toISOString(),
          }
        : w
    );

    // Se não existir, adicionar
    const exists = completedWorkouts.some(
      (w) => w.weekNumber === selectedWorkout.weekNumber && w.day === selectedWorkout.day
    );

    if (!exists) {
      updated.push({
        weekNumber: selectedWorkout.weekNumber,
        day: selectedWorkout.day,
        completed: true,
        distance: data.distance,
        time: data.time,
        pace: data.pace,
        notes: data.notes,
        date: new Date().toISOString(),
      });
    }

    setCompletedWorkouts(updated);
    localStorage.setItem("trainingProgress", JSON.stringify(updated));
  };

  const isWorkoutCompleted = (weekNumber: number, day: string) => {
    const workout = completedWorkouts.find(
      (w) => w.weekNumber === weekNumber && w.day === day
    );
    return workout?.completed || false;
  };

  const getWorkoutDetails = (weekNumber: number, day: string) => {
    return completedWorkouts.find(
      (w) => w.weekNumber === weekNumber && w.day === day
    );
  };

  const getWeekProgress = (weekNumber: number) => {
    if (!trainingData) return 0;
    const week = trainingData.block1.weeks.find((w) => w.weekNumber === weekNumber);
    if (!week) return 0;

    const totalDays = week.days.filter((d) => d.type !== "rest").length;
    const completedDays = week.days.filter(
      (d) => d.type !== "rest" && isWorkoutCompleted(weekNumber, d.day)
    ).length;

    return (completedDays / totalDays) * 100;
  };

  const getTotalProgress = () => {
    if (!trainingData) return 0;
    const totalWeeks = trainingData.block1.totalWeeks;
    let totalCompleted = 0;

    for (let i = 1; i <= totalWeeks; i++) {
      totalCompleted += getWeekProgress(i);
    }

    return totalCompleted / totalWeeks;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      test: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      interval: "bg-red-500/20 text-red-400 border-red-500/30",
      tempo: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      speed: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      fartlek: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      long: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      easy: "bg-green-500/20 text-green-400 border-green-500/30",
      race: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      rest: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      strength: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    };
    return colors[type] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      test: "Teste",
      interval: "Intervalado",
      tempo: "Tempo Run",
      speed: "Velocidade",
      fartlek: "Fartlek",
      long: "Long Run",
      easy: "Fácil",
      race: "Prova",
      rest: "Descanso",
      strength: "Força",
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando plano de treino...</p>
        </div>
      </div>
    );
  }

  if (!trainingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-destructive">Erro ao carregar dados do treino</p>
      </div>
    );
  }

  const currentWeekData = trainingData.block1.weeks.find(
    (w) => w.weekNumber === currentWeek
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Rumo a Maratona <span className="text-muted-foreground text-2xl">sub</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">By Maylon Watson</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {trainingData.athlete.goal.race}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Meta: {trainingData.athlete.goal.targetTime} ({trainingData.athlete.goal.targetPace}/km)
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Progress Overview */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Progresso Geral - Bloco 1</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {trainingData.block1.name}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {Math.round(getTotalProgress())}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={getTotalProgress()} className="h-3 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">{currentWeek}/8</p>
                <p className="text-xs text-muted-foreground">Semanas</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">
                  {currentWeekData?.totalDistance || 0}km
                </p>
                <p className="text-xs text-muted-foreground">Esta Semana</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">
                  {completedWorkouts.filter((w) => w.completed).length}
                </p>
                <p className="text-xs text-muted-foreground">Treinos Completos</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                <Dumbbell className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">
                  {trainingData.strengthExercises.length}
                </p>
                <p className="text-xs text-muted-foreground">Exercícios Força</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="training" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="training">Plano de Treino</TabsTrigger>
            <TabsTrigger value="progress">
              <BarChart3 className="w-4 h-4 mr-2" />
              Progresso
            </TabsTrigger>
            <TabsTrigger value="strength">Fortalecimento</TabsTrigger>
            <TabsTrigger value="zones">Zonas de Treino</TabsTrigger>
          </TabsList>

          {/* Training Plan Tab */}
          <TabsContent value="training" className="space-y-6">
            {/* Week Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {trainingData.block1.weeks.map((week) => (
                <Button
                  key={week.weekNumber}
                  variant={currentWeek === week.weekNumber ? "default" : "outline"}
                  onClick={() => setCurrentWeek(week.weekNumber)}
                  className="min-w-fit"
                >
                  Semana {week.weekNumber}
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-background/50"
                  >
                    {Math.round(getWeekProgress(week.weekNumber))}%
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Current Week Details */}
            {currentWeekData && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Semana {currentWeekData.weekNumber}: {currentWeekData.weekName}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Volume total: {currentWeekData.totalDistance}km
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={getWeekProgress(currentWeek)} className="mb-6 h-2" />
                  <div className="space-y-4">
                    {currentWeekData.days.map((day, idx) => {
                      const completed = isWorkoutCompleted(currentWeek, day.day);
                      const details = getWorkoutDetails(currentWeek, day.day);
                      return (
                        <Card
                          key={idx}
                          className={`border-2 transition-all ${
                            completed
                              ? "bg-green-500/5 border-green-500/30"
                              : "bg-card border-border hover:border-primary/50"
                          }`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge
                                    variant="outline"
                                    className={`${getTypeColor(day.type)} border`}
                                  >
                                    {getTypeLabel(day.type)}
                                  </Badge>
                                  <span className="text-sm font-medium text-muted-foreground">
                                    {day.day}
                                  </span>
                                </div>
                                <CardTitle className="text-lg text-foreground">
                                  {day.name}
                                </CardTitle>
                                {day.totalDistance > 0 && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {day.totalDistance}km
                                    {day.pace && ` • Pace: ${day.pace}/km`}
                                  </p>
                                )}
                              </div>
                              {day.type !== "rest" && (
                                <div className="flex gap-2 ml-4">
                                  {completed && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        openLogModal(
                                          currentWeek,
                                          day.day,
                                          day.name,
                                          day.totalDistance
                                        )
                                      }
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant={completed ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                      if (!completed) {
                                        openLogModal(
                                          currentWeek,
                                          day.day,
                                          day.name,
                                          day.totalDistance
                                        );
                                      } else {
                                        toggleWorkoutComplete(currentWeek, day.day);
                                      }
                                    }}
                                  >
                                    {completed ? (
                                      <>
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Completo
                                      </>
                                    ) : (
                                      <>
                                        <Circle className="w-4 h-4 mr-2" />
                                        Registrar
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            {day.description && (
                              <p className="text-sm text-muted-foreground mb-3">
                                {day.description}
                              </p>
                            )}
                            {day.workouts && day.workouts.length > 0 && (
                              <div className="space-y-2 bg-muted/30 p-3 rounded-md border border-border mb-3">
                                {day.workouts.map((workout, widx) => (
                                  <div key={widx} className="space-y-1">
                                    <div className="text-sm text-foreground flex items-start gap-2">
                                      <span className="text-primary">•</span>
                                      <span>{workout.description}</span>
                                    </div>
                                    {workout.recovery && workout.reps && workout.reps > 1 && (
                                      <div className="ml-5 text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/30 inline-block">
                                        <strong>Recuperação:</strong> {workout.recovery}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {details && details.distance && (
                              <div className="p-3 bg-primary/10 border border-primary/30 rounded-md">
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Distância</p>
                                    <p className="font-bold text-foreground">
                                      {details.distance}km
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Tempo</p>
                                    <p className="font-bold text-foreground">{details.time}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Pace</p>
                                    <p className="font-bold text-primary">{details.pace}/km</p>
                                  </div>
                                </div>
                                {details.notes && (
                                  <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-primary/20">
                                    {details.notes}
                                  </p>
                                )}
                              </div>
                            )}
                            {day.notes && (
                              <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                                <p className="text-sm text-yellow-400">
                                  <strong>Nota:</strong> {day.notes}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Progress Charts Tab */}
          <TabsContent value="progress" className="space-y-6">
            <ProgressCharts
              completedWorkouts={completedWorkouts}
              totalWeeks={trainingData.block1.totalWeeks}
            />
          </TabsContent>

          {/* Strength Training Tab */}
          <TabsContent value="strength" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Exercícios de Fortalecimento</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Realizar 2-3x por semana • Descanso: 60-90seg entre séries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {trainingData.strengthExercises.map((exercise) => (
                    <Card key={exercise.id} className="bg-muted/30 border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-foreground">
                          {exercise.name}
                        </CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {exercise.sets} séries
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {exercise.duration || `${exercise.reps} reps`}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-primary font-medium">
                          {exercise.focus}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {exercise.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Zones Tab */}
          <TabsContent value="zones" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Zonas de Treino</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Baseadas no teste de 5km da Semana 1
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(trainingData.trainingZones).map(([key, zone]) => (
                    <Card key={key} className="bg-muted/30 border-border">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base text-foreground">
                            {zone.name}
                          </CardTitle>
                          <Badge variant="outline">{zone.hrPercent} FCM</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Pace:</span>
                          <span className="font-mono text-primary font-medium">
                            {zone.pace}/km
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground pt-2 border-t border-border">
                          {zone.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>
            Plano de treino profissional • Bloco 1 de 11 • Meta: Maratona do Rio 2026
          </p>
          <p className="mt-2">
            Preparado para <strong className="text-foreground">Maylon Watson</strong>
          </p>
        </div>
      </footer>

      {/* Workout Log Modal */}
      {selectedWorkout && (
        <WorkoutLogModal
          open={logModalOpen}
          onClose={() => setLogModalOpen(false)}
          onSave={saveWorkoutLog}
          workoutName={selectedWorkout.name}
          plannedDistance={selectedWorkout.plannedDistance}
        />
      )}
    </div>
  );
}

