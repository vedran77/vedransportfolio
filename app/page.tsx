import TerrainHero from "@/components/redesign/TerrainHero";
import TerrainAbout from "@/components/redesign/TerrainAbout";
import TerrainProjects from "@/components/redesign/TerrainProjects";
import TerrainReviews from "@/components/redesign/TerrainReviews";
import TerrainContact from "@/components/redesign/TerrainContact";
import TerrainTools from "@/components/redesign/TerrainTools";
import ScrollProgress from "@/components/redesign/ScrollProgress";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <main>
        <TerrainHero />
        <TerrainAbout />
        <TerrainProjects />
        <TerrainReviews />
        <TerrainTools />
        <TerrainContact />
      </main>
    </>
  );
}
