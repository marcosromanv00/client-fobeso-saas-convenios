"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import FilterCategory from "components/Features/filterCategory";
import FilterLocation from "components/Features/filterLocation";
import FeatureList from "components/Features/featureList";
import SectionHeader from "components/Common/SectionHeader";
import CrearConvenio from "components/Forms/Convenios/Crear/CrearConvenio";
import { TarjetaConvenio } from "@/types/tarjetaConvenio";

const AllFeatures = () => {
  const pathUrl = usePathname();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [tarjetas, setTarjetas] = useState<TarjetaConvenio[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateClose = () => setCreateModalOpen(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch("/api/info/tarjetasConvenios");
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const formattedData = data.map((item) => ({
            convenio_id: item.convenio_id,
            empresa_id: item.empresa_id,
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
      <section id="list-features" className="pt-40">
        <div className="mx-auto max-w-c-1315 px-4 pt-10 xs:pt-2 sm:pt-2 md:px-8 xl:px-0">
          <SectionHeader
            headerInfo={{
              title: "Convenios Existentes",
              subtitle: "Filtros por Categoría y Ubicación",
              description: "Descubre todos los convenios disponibles y selecciona por categoría, ubicación o palabras clave para encontrar lo que más te interesa.",
            }}
          />

          <div className="justify-evenly">
            <div className={`mt-10 mx-10 xs:mt-2 xs:mx-2 sm:mt-2 sm:mx-2 grid grid-cols-1 gap-4 xs:gap-1 sm:gap-1 md:grid-cols-2 ${pathUrl === "/admin/convenios" ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} xl:gap-8`}>
              <div className={`bg-transparent text-black dark:text-white p-5 xs:p-1 sm:p-1 rounded-lg flex flex-col items-center`}>
                <h3 className="text-lg font-semibold mb-4">Búsqueda</h3>
                <input
                  type="text"
                  className="bg-gray-800 text-yellow-300 rounded-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300 min-w-[400px] lg:min-w-[250px]"
                  placeholder="Buscar convenios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <FilterCategory setSelectedCategory={setSelectedCategory} categories={categories} />
              <FilterLocation setSelectedLocation={setSelectedLocation} locations={locations} />

              {pathUrl === "/admin/convenios" && (
                <div className="bg-transparent text-white rounded-lg flex justify-center items-center">
                  <button
                    className="font-semibold bg-primary text-black py-4 px-5 rounded-full hover:bg-black hover:text-primary hover:border hover:border-primary transition"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    Nuevo Convenio
                  </button>
                </div>
              )}
            </div>
          </div>

          {tarjetas.length > 0 ? (
            <FeatureList tarjetas={filteredInfo} />
          ) : (
            <div>...</div>
          )}


          {isCreateModalOpen && <CrearConvenio onClose={handleCreateClose} />}
        </div>
      </section>
    </>
  );
};

export default AllFeatures;
