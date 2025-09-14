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
import { categoryZodEnum, type Podium } from "@/db/schema";
import { columns, type ClubWithMedals } from "./columns";
import { DataTable } from "@/components/ui/data-table";

const categoryGroups = {
  "Sub 18": [
    "Sub 18 Masculino", "Sub 18 Feminino",
    "Sub 18 Masculino Equipes", "Sub 18 Feminino Equipes"
  ],
  "Sub 16": [
    "Sub 16 Masculino", "Sub 16 Feminino",
    "Sub 16 Masculino Equipes", "Sub 16 Feminino Equipes"
  ],
  "Sub 14": [
    "Sub 14 Masculino", "Sub 14 Feminino",
    "Sub 14 Masculino Equipes", "Sub 14 Feminino Equipes"
  ],
  "Sub 12": [
    "Sub 12 Masculino", "Sub 12 Feminino",
    "Sub 12 Masculino Equipes", "Sub 12 Feminino Equipes"
  ],
  "Sub 10": [
    "Sub 10 Masculino", "Sub 10 Feminino",
    "Sub 10 Masculino Equipes", "Sub 10 Feminino Equipes"
  ],
  "Sub 8": [
    "Sub 8 Masculino", "Sub 8 Feminino",
    "Sub 8 Masculino Equipes", "Sub 8 Feminino Equipes"
  ],
};

type ClubMedalData = {
  id: string;
  name: string;
  medals: Podium[];
};

type ClubsMedalsProps = {
  medals: ClubMedalData[];
  isLoading: boolean;
  isError: boolean;
};

export function CategoryMedals({
  medals: initialMedals,
  isLoading,
  isError,
}: ClubsMedalsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<string | undefined>(
    undefined
  );

  const clubsWithMedals: ClubWithMedals[] = useMemo(() => {
    if (!initialMedals?.length) {
      return [];
    }

    const filteredClubs = initialMedals.filter((club) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        club.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    const result = filteredClubs
      .map((club) => {
        const clubPodiums = club.medals.filter((podium) => {
          if (!selectedCategoryGroup) return true;
          const categoriesInGroup = categoryGroups[selectedCategoryGroup as keyof typeof categoryGroups];
          return categoriesInGroup && categoriesInGroup.includes(podium.category);
        });

        const medals = {
          gold: clubPodiums.reduce((sum, p) => sum + (p?.place === "1" ? (p.category.includes("Equipes") ? 2 : 1) : 0), 0),
          silver: clubPodiums.reduce((sum, p) => sum + (p?.place === "2" ? (p.category.includes("Equipes") ? 2 : 1) : 0), 0),
          bronze: clubPodiums.reduce((sum, p) => sum + (p?.place === "3" ? (p.category.includes("Equipes") ? 2 : 1) : 0), 0),
        };

        return { ...club, medals };
      })
      .sort((a, b) => {
        if (b.medals.gold !== a.medals.gold) {
          return b.medals.gold - a.medals.gold;
        }
        if (b.medals.silver !== a.medals.silver) {
          return b.medals.silver - a.medals.silver;
        }
        return b.medals.bronze - a.medals.bronze;
      });

    return result;
  }, [initialMedals, searchTerm, selectedCategoryGroup]);

  if (isLoading) {
    return (
      <>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            🏅 Leaderboard <Badge className="rounded-sm">?</Badge>
          </CardTitle>
        </div>
        <div className="w-full mt-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-ground rounded"></div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`loading-placeholder-${i}-${Math.random()}`}
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
          🏅 Quadro de Medalhas{" "}
          <Badge className="rounded-sm">{clubsWithMedals.length}</Badge>
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
              <SelectItem value="all">Todos os grupos</SelectItem>
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
        {clubsWithMedals.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm ? (
              <div>
                <p className="text-lg">
                  No clubs found matching "{searchTerm}"
                </p>
                <p className="text-sm mt-2">
                  Try searching with different keywords or clear the search
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg">No clubs found</p>
              </div>
            )}
          </div>
        ) : (
          <DataTable columns={columns} data={clubsWithMedals} />
        )}
      </div>
    </div>
  );
}
