"use client";

import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Podium } from "@/db/schema";
import { columns, type ClubWithPoints } from "./columns";
import { DataTable } from "@/components/ui/data-table";

const categoryGroups = {
  "Sub 18": [
    "Sub 18 Masculino",
    "Sub 18 Feminino",
    "Sub 18 Masculino Equipes",
    "Sub 18 Feminino Equipes",
  ],
  "Sub 16": [
    "Sub 16 Masculino",
    "Sub 16 Feminino",
    "Sub 16 Masculino Equipes",
    "Sub 16 Feminino Equipes",
  ],
  "Sub 14": [
    "Sub 14 Masculino",
    "Sub 14 Feminino",
    "Sub 14 Masculino Equipes",
    "Sub 14 Feminino Equipes",
  ],
  "Sub 12": [
    "Sub 12 Masculino",
    "Sub 12 Feminino",
    "Sub 12 Masculino Equipes",
    "Sub 12 Feminino Equipes",
  ],
  "Sub 10": [
    "Sub 10 Masculino",
    "Sub 10 Feminino",
    "Sub 10 Masculino Equipes",
    "Sub 10 Feminino Equipes",
  ],
  "Sub 8": [
    "Sub 8 Masculino",
    "Sub 8 Feminino",
    "Sub 8 Masculino Equipes",
    "Sub 8 Feminino Equipes",
  ],
};

type ClubPointData = {
  id: string;
  name: string;
  podiums: Podium[];
};

type ClubsPointsProps = {
  pointsData: ClubPointData[];
  isLoading: boolean;
  isError: boolean;
};

export function ClubsPoints({
  pointsData: initialPointsData,
  isLoading,
  isError,
}: ClubsPointsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<
    string | undefined
  >(undefined);

  const clubsWithPoints: ClubWithPoints[] = useMemo(() => {
    if (!initialPointsData?.length) {
      return [];
    }

    const filteredClubs = initialPointsData.filter((club) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        club.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    const result = filteredClubs
      .map((club) => {
        const clubPodiums = club.podiums.filter((podium) => {
          if (!selectedCategoryGroup) return true;
          const categoriesInGroup =
            categoryGroups[
              selectedCategoryGroup as keyof typeof categoryGroups
            ];
          return categoriesInGroup?.includes(podium.category);
        });
        const points = clubPodiums.reduce((sum, p) => sum + p.points, 0);
        return { ...club, points };
      })
      .sort((a, b) => b.points - a.points);

    return result;
  }, [initialPointsData, searchTerm, selectedCategoryGroup]);

  if (isLoading) {
    return (
      <>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            📊 Points <Badge className="rounded-sm">?</Badge>
          </CardTitle>
        </div>
        <div className="w-full mt-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-ground rounded"></div>
            {Array.from({ length: 5 }).map((_, _i) => (
              <div
                key={`loading-skeleton-${crypto.randomUUID()}`}
                className="h-16 bg-ground rounded"
              ></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            🏅 Leaderboard <Badge className="rounded-sm">?</Badge>
          </CardTitle>
        </div>
        <div className="w-full mt-4">
          <p className="text-red-600 text-center">Error. Please try again.</p>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <CardTitle className="flex items-center gap-2">
          📊 Pontos{" "}
          <Badge className="rounded-sm">{clubsWithPoints.length}</Badge>
        </CardTitle>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-[140px] bg-ground rounded-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder="Procurar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-0"
            />
          </div>
          <Select
            value={selectedCategoryGroup}
            onValueChange={(value) =>
              setSelectedCategoryGroup(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {Object.keys(categoryGroups).map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-full mt-4">
        {clubsWithPoints.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm ? (
              <div>
                <p className="text-lg">
                  No clubs found matching "{searchTerm}"
                </p>
                <p className="text-sm mt-2">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg">No clubs found</p>
              </div>
            )}
          </div>
        ) : (
          <DataTable columns={columns} data={clubsWithPoints} />
        )}
      </div>
    </div>
  );
}
