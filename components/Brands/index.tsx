"use client";
import React, { useEffect, useState } from "react";
import SingleBrand from "./SingleBrand";
import { Empresa } from "@/types/empresa";

const Brands = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  // Fetch de las empresas desde el API
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await fetch("/api/crud/empresas");
        const data = await response.json();

        if (Array.isArray(data)) {
          // Mapear y asignar datos al estado
          const formattedData = data.map(
            (item: any): Empresa => ({
              empresa_id: item.EMPRESA_ID,
              nombre: item.NOMBRE,
              logo_url: item.LOGO_URL,
              sitio_web: item.SITIO_WEB || "",
              facebook: item.FACEBOOK || "",
              instagram: item.INSTAGRAM || "",
              twitter: item.TWITTER || "",
              linkedin: item.LINKEDIN || "",
              estado: item.ESTADO || 0,
            }),
          );
          setEmpresas(formattedData);
        } else {
          console.error("Formato de datos incorrecto o vacío:", data);
        }
      } catch (error) {
        console.error("Error al cargar las empresas:", error);
      }
    };

    fetchEmpresas();
  }, []);

  return (
    <>
      {/* <!-- ===== Clients Start ===== --> */}
      <section className="overflow-hidden border border-x-0 border-y-stroke bg-blacksection py-11 dark:border-y-strokedark dark:bg-black">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          {empresas.length > 0 ? (
            <div className="marquee-container relative w-full overflow-hidden whitespace-nowrap">
              <div className="marquee-content animate-marquee inline-flex items-center space-x-12">
                {/* Repetimos las empresas 4 veces para asegurar un loop fluido */}
                {[...Array(4)].map((_, groupIndex) => (
                  <React.Fragment key={groupIndex}>
                    {empresas.map((empresa) => (
                      <div
                        key={`${groupIndex}-${empresa.empresa_id}`}
                        className="inline-block"
                      >
                        <SingleBrand empresa={empresa} />
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Cargando empresas...
            </div>
          )}
        </div>
      </section>
      {/* <!-- ===== Clients End ===== --> */}

      <style jsx>{`
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }

        .marquee-container:hover .animate-marquee {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
};

export default Brands;
