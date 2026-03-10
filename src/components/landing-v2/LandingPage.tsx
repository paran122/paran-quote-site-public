"use client";

import HeroParticle from "./HeroParticle";
import About from "./AboutSection";
import Portfolio from "./PortfolioSection";
import Estimate from "./EstimateSection";
import Process from "./ProcessSection";
import Clients from "./ClientsSection";
import BlogSection from "./BlogSection";
import Contact from "./ContactSection";

export default function LandingPage() {
  return (
    <main className="lg:pl-40">
      <HeroParticle />
      <About />
      <Portfolio />
      <Estimate />
      <Process />
      <Clients />
      <BlogSection />
      <Contact />
    </main>
  );
}
