import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Building {
  id: string;
  name: string;
  resource: string;
  amount: number;
  level: number;
  efficiency: number;
  color: string;
  productionTime: number; // in seconds
  timeRemaining: number; // in seconds
}

const initialBuildings: Building[] = [
  {
    id: "metal-mine",
    name: "Metal Mine",
    resource: "Metal",
    amount: 1250,
    level: 3,
    efficiency: 72,
    color: "text-yellow-600",
    productionTime: 30, // 30 seconds
    timeRemaining: 30,
  },
  {
    id: "crystal-mine",
    name: "Crystal Mine",
    resource: "Crystal",
    amount: 800,
    level: 2,
    efficiency: 55,
    color: "text-blue-500",
    productionTime: 45, // 45 seconds
    timeRemaining: 45,
  },
  {
    id: "deuterium-extractor",
    name: "Deuterium Extractor",
    resource: "Deuterium",
    amount: 420,
    level: 1,
    efficiency: 38,
    color: "text-green-600",
    productionTime: 60, // 60 seconds
    timeRemaining: 60,
  },
  {
    id: "solar-power",
    name: "Solar Power Plant",
    resource: "Energy",
    amount: 2500,
    level: 4,
    efficiency: 85,
    color: "text-orange-500",
    productionTime: 20, // 20 seconds
    timeRemaining: 20,
  },
];

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const RessourcesPage = () => {
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);

  useEffect(() => {
    const interval = setInterval(() => {
      setBuildings((prevBuildings) =>
        prevBuildings.map((building) => {
          if (building.timeRemaining > 0) {
            return {
              ...building,
              timeRemaining: building.timeRemaining - 1,
            };
          } else {
            // Production complete, add resources and restart
            return {
              ...building,
              timeRemaining: building.productionTime,
              amount:
                building.amount +
                Math.floor(building.level * 100 * (building.efficiency / 100)),
            };
          }
        }),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimerProgress = (building: Building): number => {
    return (
      ((building.productionTime - building.timeRemaining) /
        building.productionTime) *
      100
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
        {buildings.map((bldg) => (
          <Card key={bldg.id} className="flex flex-col justify-between">
            <CardHeader>
              <span className={`text-lg font-semibold ${bldg.color}`}>
                {bldg.name}
              </span>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div>
                Produces: <span className={bldg.color}>{bldg.resource}</span>
              </div>
              <div>
                Amount: <span className="font-mono">{bldg.amount}</span>
              </div>
              <div>
                Level: <span className="font-bold">{bldg.level}</span>
              </div>
              <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <span>Efficiency</span>
                  <span className="font-mono">{bldg.efficiency}%</span>
                </div>
                <Progress value={bldg.efficiency} className="h-2" />
              </div>
              <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Production Time</span>
                  <span className="font-mono text-sm">
                    {bldg.productionTime}s
                  </span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">Time Remaining</span>
                  <span className="font-mono text-sm font-semibold">
                    {formatTime(bldg.timeRemaining)}
                  </span>
                </div>
                <Progress value={getTimerProgress(bldg)} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="secondary" className="flex-1">
                Upgrade
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="bg-muted/50 min-h-[40vh] flex-1 rounded-xl md:min-h-min flex items-center justify-center">
        <span className="text-muted-foreground">
          Select a building for detailed stats and upgrades.
        </span>
      </div>
    </div>
  );
};

export default RessourcesPage;
