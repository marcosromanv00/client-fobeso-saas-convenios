import { Metadata } from "next";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import Feature from "@/components/Features";
import FunFact from "@/components/FunFact";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Head from "../head";
import Flash from "@/components/Flash";

export const metadata: Metadata = {
  title: "Convenios FBS UNA-SITUN",
  description: "Página Informativa y Gestión de Convenios",
  // other metadata
};

export default function Home() {
  return (
    <main>
      <Head />
      <Hero />
      <Brands />
      <Feature />
      <CTA />
      <Flash />
      <FunFact />
      <FAQ />
      {/*<Contact />*/}
    </main>
  );
}
