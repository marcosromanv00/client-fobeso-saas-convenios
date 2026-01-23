"use client";

import React, { useEffect, useState } from "react";
import SectionHeader from "../Common/SectionHeader";
import FlashItem from "./FlashItem";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { TarjetaOferta } from "@/types/tarjetaOferta";

const Flash = () => {
  const [latestFlash, setLatestFlash] = useState<TarjetaOferta[]>([]);
  const pathUrl = usePathname();

  const getButtonUrl = () =>
    pathUrl.startsWith("/admin")
      ? `/admin/flash`
      : `/flash`;

  useEffect(() => {
    const fetchFlash = async () => {
      try {
        const response = await fetch("/api/flash/recientes");
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          // Ordenamos los datos por fecha (más reciente primero) y tomamos las primeras 3 ofertas
          const sortedData = data
            .sort((a, b) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime())
            .slice(0, 3);

          setLatestFlash(sortedData);
        } else {
          console.error("Formato de datos incorrecto o vacío:", data);
        }
      } catch (error) {
        console.error("Error al cargar las ofertas recientes:", error);
      }
    };

    fetchFlash();
  }, []);

  return (
    <section id="flash" className="py-10 lg:py-10 xl:py-10">
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        {latestFlash.length > 0 && (
          <SectionHeader
            headerInfo={{
              title: "Ofertas Flash",
              subtitle: "Promociones Limitadas",
              description:
                "Disfruta de más beneficios teniendo acceso a ofertas por tiempo limitado, aprovecha la oportunidad y reclama tu beneficio.",
            }}
          />
        )}

        <div className="mt-10 grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:mt-15 lg:grid-cols-3 xl:mt-10 xl:gap-12.5">
          {latestFlash.map((data, key) => (
            <FlashItem tarjeta={data} key={key} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href={getButtonUrl()} passHref>
            <button className="px-6 py-3 text-white bg-black dark:bg-primary dark:text-black rounded-full hover:bg-opacity-80">
            {pathUrl.startsWith("/admin") ? "Gestionar Ofertas" : "Ver Todas"}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Flash;
