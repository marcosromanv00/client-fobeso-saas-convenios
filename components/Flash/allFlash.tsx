"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SectionHeader from "components/Common/SectionHeader";
import { motion } from "framer-motion";
import { Flash } from "@/types/flash";
import FlashList from "./flashList";
import { TarjetaOferta } from "@/types/tarjetaOferta";
import CrearOferta from "@/components/Forms/flash/crearOferta/page";

const AllFlash = () => {
  const pathUrl = usePathname();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [tarjetas, setTarjetas] = useState<TarjetaOferta[]>([]);

  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateClose = () => setCreateModalOpen(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch("/api/info/tarjetasOfertas");
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const formattedData = data.map((item) => ({
            oferta_id: item.convenio_id,
            convenio_id: item.empresa_id,
            nombre_emp: item.nombre_emp,
            logo_url: item.logo_url,
            direccion: item.direccion,
            ciudad: item.ciudad,
            categoria_id: item.categoria_id,
            nombre_cat: item.nombre_cat,
            titulo: item.titulo,
            condiciones: item.condiciones,
          }));

          setTarjetas(formattedData);
          setCategories(Array.from(new Set(formattedData.map((item) => item.nombre_cat))) as string[]);
          setLocations(Array.from(new Set(formattedData.map((item) => item.ciudad))) as string[]);
        } else {
          console.error("No data or incorrect data format:", data);
        }
      } catch (error) {
        console.error("Error al cargar todos los convenios:", error);
      }
    };

    fetchInfo();
  }, []);


  useEffect(() => {
    if (isCreateModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isCreateModalOpen]);

  const filteredInfo = tarjetas.filter((tarjetas) => {
    const byCategory = selectedCategory ? tarjetas.nombre_cat === selectedCategory : true;
    const byLocation = selectedLocation ? tarjetas.direccion.includes(selectedLocation) : true;
    const bySearchTerm = searchTerm
      ? (tarjetas.nombre_emp ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tarjetas.condiciones ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tarjetas.nombre_cat ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tarjetas.direccion ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return byCategory && byLocation && bySearchTerm;
  });

  return (
    <>
      {/* Sección de convenios */}
      <section id="all-flash" className="pt-40">
        <div className="mx-auto max-w-c-1315 px-4 py-10 md:px-8 xl:px-0">
          <SectionHeader
            headerInfo={{
              title: "Ofertas Limitadas",
              subtitle: "Filtros por Categoría y Ubicación",
              description: `Descubre todas las ofertas de tiempo limitado disponibles y selecciona por categoría, ubicación o palabras clave para encontrar lo que más te interesa.`,
            }}
          />

          {/* Filtros y búsqueda */}
          <div className="">
            <div className={`mt-5 justify-evenly mx-10 grid grid-cols-1 gap-4 md:grid-cols-2 ${pathUrl === "/admin/flash" ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} xl:gap-8`}>

              {/* Filtro de búsqueda con un mayor ancho */}
              <div className={`bg-transparent text-black dark:text-white p-5 rounded-lg flex flex-col items-center`}>
                <h3 className="text-lg font-semibold mb-4">Búsqueda</h3>
                <input
                  type="text"
                  className="bg-gray-800 text-yellow-300 rounded-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300 min-w-[400px]"
                  placeholder="Buscar ofertas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Botón para crear nuevo convenio */}
              {pathUrl === "/admin/flash" && (
                <div className="bg-transparent text-white p-5 rounded-lg flex flex-col items-center">
                  <button
                    className="mt-2 font-semibold bg-primary text-black py-4 px-5 rounded-full hover:bg-black hover:text-primary hover:border hover:border-primary transition"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    Nueva Oferta
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Listado de convenios filtrados */}
          {tarjetas.length > 0 ? (
            <FlashList tarjetas={filteredInfo} />
          ) : (
            <div>...</div>
          )}

          {isCreateModalOpen && <CrearOferta onClose={handleCreateClose} />}
        </div>
      </section>
    </>
  );
};

export default AllFlash;
