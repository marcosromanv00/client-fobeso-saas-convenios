"use client";
import React, { useEffect, useState } from "react";
import SingleFeature from "./SingleFeature";
import SectionHeader from "../Common/SectionHeader";
import { TarjetaConvenio } from "@/types/tarjetaConvenio"; // Importa el tipo Feature

const FeatureComponent = () => {
  // Define el tipo de `latestFeatures` como `Feature[]`
  const [latestFeatures, setLatestFeatures] = useState<TarjetaConvenio[]>([]);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch("/api/convenios/recientes");
        const data = await response.json();

        setLatestFeatures(data);
      } catch (error) {
        console.error("Error al cargar los convenios recientes:", error);
      }
    };

    fetchFeatures();
  }, []);

  return (
    <>
      <section id="convenios-recientes" className="py-10 lg:py-10 xl:py-10">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          {/* Verificamos que `latestFeatures` tenga al menos un elemento antes de acceder al primero */}
          {latestFeatures.length > 0 && (
            <SectionHeader
            headerInfo={{
              title: "Nuevos Beneficios",
              subtitle: "Convenios más Recientes",
              description: `Los beneficios más actualizados a los que tienes acceso como 
              persona afiliada al Fondo de Beneficio Social. Haz uso de estos beneficios 
              y ahorra dinero al cubrir tus necesidades.`,
            }}
          />
          )}

          <div className="mt-10 grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:mt-15 lg:grid-cols-3 xl:mt-10 xl:gap-12.5">
            {latestFeatures.map((data, key) => (
              <SingleFeature tarjeta={data} key={key} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeatureComponent;
