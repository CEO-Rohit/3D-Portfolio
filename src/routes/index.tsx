import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rohit Kumar — 3D Web Architect & Creative Developer" },
      {
        name: "description",
        content:
          "Portfolio of Rohit Kumar — immersive WebGL experiences, creative development, and 3D-led product sites.",
      },
      { property: "og:title", content: "Rohit Kumar — 3D Web Architect" },
      {
        property: "og:description",
        content:
          "Immersive WebGL portfolio: hero 3D core, asymmetric project grid, scroll-bound storytelling.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <Hero />
      <Experience />
      <Projects />
      <Footer />
    </main>
  );
}
