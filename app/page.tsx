import { Button } from "@/components/ui/button";
import { getMedals, getPodiums } from "@/db/queries";
import { ClubsMedals } from "@/components/clubs-medals/clubs-medals";
import { ClubsPoints } from "@/components/clubs-points/clubs-points";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Podium } from "@/db/schema";
import { CategoryPoints } from "@/components/category-points/category-points";
import { CategoryMedals } from "@/components/category-medals/category-medals";

type ClubMedalData = {
  id: string;
  name: string;
  medals: Podium[];
};

type ClubPointData = {
  id: string;
  name: string;
  podiums: Podium[];
};

export default async function Home() {
  const [clubs, podiums] = await Promise.all([getMedals(), getPodiums()]);

  const processedMedals: ClubMedalData[] = clubs.map((club) => ({
    id: club.id,
    name: club.name,
    medals: podiums.filter((podium) => podium.clubId === club.id),
  }));

  const processedPoints: ClubPointData[] = clubs.map((club) => ({
    id: club.id,
    name: club.name,
    podiums: podiums.filter((podium) => podium.clubId === club.id),
  }));

  return (
    <main className="!max-w-[960px] container relative min-h-screen pb-12">
      <div className="flex flex-col items-left gap-2 py-8 text-left md:py-16 lg:py-20">
        <h1 className="text-primary max-w-2xl text-2xl font-bold text-balance xl:tracking-tighter">
          Quadro de Medalhas
        </h1>
        <div className="flex gap-2">
          <Button className="font-bold text-xs px-2 py-0.5">
            TV Sergipe 2025
          </Button>
          <Button variant="secondary" className="font-bold text-xs px-2 py-0.5">
            Xadrez
          </Button>
        </div>
      </div>

      <Tabs defaultValue="club-medals" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="club-medals">Medalhas</TabsTrigger>
          <TabsTrigger value="category-medals">Medalhas Categorias</TabsTrigger>
          <TabsTrigger value="points">Categorias</TabsTrigger>
          <TabsTrigger value="categories">Subcategorias</TabsTrigger>
        </TabsList>
        <TabsContent value="club-medals">
          <ClubsMedals
            medals={processedMedals}
            isLoading={false}
            isError={false}
          />
        </TabsContent>
        <TabsContent value="category-medals">
          <CategoryMedals
            medals={processedMedals}
            isLoading={false}
            isError={false}
          />
        </TabsContent>
        <TabsContent value="points">
          <ClubsPoints
            pointsData={processedPoints}
            isLoading={false}
            isError={false}
          />
        </TabsContent>
        <TabsContent value="categories">
          <CategoryPoints
            pointsData={processedPoints}
            isLoading={false}
            isError={false}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
