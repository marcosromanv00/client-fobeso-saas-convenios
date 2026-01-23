"use client";
import React, { useEffect, useRef, useState } from "react";
import SingleBrand from "./SingleBrand";
import { Empresa } from "@/types/empresa";

const Brands = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    let scrollSpeed = 0.5;

    const scroll = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollContainer.scrollLeft = 0;
        }
      }
    };

    const interval = setInterval(scroll, 20);

    return () => clearInterval(interval);
  }, []);

  // Fetch de las empresas desde el API
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await fetch("/api/crud/empresas");
        const data = await response.json();

        if (Array.isArray(data)) {
          // Mapear y asignar datos al estado
          const formattedData = data.map((item: any): Empresa => ({
            empresa_id: item.EMPRESA_ID,
            nombre: item.NOMBRE,
            logo_url: item.LOGO_URL,
            sitio_web: item.SITIO_WEB || "",
            facebook: item.FACEBOOK || "",
            instagram: item.INSTAGRAM || "",
            twitter: item.TWITTER || "",
            linkedin: item.LINKEDIN || "",
            estado: item.ESTADO || 0,
          }));
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
      <section className="border border-x-0 border-y-stroke py-11 dark:border-y-strokedark bg-blacksection dark:bg-black">
        <div className="w-full mx-20 overflow-hidden justify-center items-center xs:mx-4 sm:mx-4" ref={scrollContainerRef}>
          <div className="w-full flex space-x-5 items-center justify-start" style={{ minWidth: `${empresas.length * 1000}px` }}>
            {/* Agregamos el primer logo nuevamente al final para crear el efecto de bucle infinito */}
            {empresas.map((empresa) => (
              <SingleBrand key={empresa.empresa_id} empresa={empresa} />
            ))}
            {empresas.map((empresa) => (
              <SingleBrand key={empresa.empresa_id} empresa={empresa} />
            ))}
            {empresas.map((empresa) => (
              <SingleBrand key={empresa.empresa_id} empresa={empresa} />
            ))}
            {empresas.map((empresa) => (
              <SingleBrand key={empresa.empresa_id} empresa={empresa} />
            ))}
          </div>
        </div>
      </section>
      {/* <!-- ===== Clients End ===== --> */}
      <style jsx>{`
        div {
          width: calc(10 * 1800px); /* Ajusta el ancho según el número de logos que desees mostrar */
          overflow: hidden; /* Asegúrate de que no se muestren los elementos que sobresalen */
          max-width: 90%; /* Se asegura de que no sobrepase el ancho de la pantalla */
        }
        .flex {
          display: flex;
          animation: scroll 120s linear infinite; /* Controla la velocidad y duración de la animación */
        }
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%); /* Se desplaza el 50% del contenedor, que ahora tiene logos duplicados */
          }
        }

        /* Estilos responsivos */
        @media (max-width: 640px) { /* Pantallas pequeñas */
          div {
            width: calc(2 * 600px); /* Muestra 2 logos */
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) { /* Pantallas medianas */
          div {
            width: calc(4 * 600px); /* Muestra 4 logos */
          }
        }

        @media (min-width: 1025px) { /* Pantallas grandes */
          div {
            width: calc(6 * 900px); /* Muestra 6 logos */
          }
        }
      `}</style>
    </>
  );
};

export default Brands;
