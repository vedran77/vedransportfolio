import TerrainHero from "@/components/redesign/TerrainHero";
import TerrainAbout from "@/components/redesign/TerrainAbout";
import TerrainProjects from "@/components/redesign/TerrainProjects";
import TerrainReviews from "@/components/redesign/TerrainReviews";
import TerrainContact from "@/components/redesign/TerrainContact";

export default function RedesignPage() {
  return (
    <main>
      <TerrainHero />
      <TerrainAbout />
      <TerrainProjects />
      <TerrainReviews />
      <TerrainContact />
    </main>
  );
}
