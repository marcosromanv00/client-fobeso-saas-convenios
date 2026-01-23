import React from "react";
import { TarjetaOferta } from "@/types/tarjetaOferta";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FlashItem = ({ tarjeta }: { tarjeta: TarjetaOferta | null | undefined }) => {
  // Verificamos si 'tarjeta' es válida antes de continuar
  if (!tarjeta) {
    return <div>Información no disponible</div>; // Puedes retornar lo que desees en caso de no tener datos
  }

  // Desestructuración con valores por defecto
  const {
    oferta_id = "",  // Valor por defecto si no está disponible
    convenio_id = "",  // Valor por defecto si no está disponible
    nombre_emp = "Empresa desconocida",
    logo_url = "",
    direccion = "Dirección no disponible",
    ciudad = "Ciudad no disponible",
    categoria_id = "",
    nombre_cat = "Categoría no disponible",
    titulo = "Título no disponible",
    condiciones = "Condiciones no disponibles"
  } = tarjeta;

  const pathUrl = usePathname();

  // Convertimos 'location' en una lista si es un string o dejamos el array intacto si ya es una lista
  const locationList = Array.isArray(location) ? location : [location].filter(Boolean);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="animate_top z-20 rounded-lg border border-white bg-white p-10 shadow-solid-3 transition-all hover:shadow-solid-4 dark:border-strokedark dark:bg-blacksection dark:hover:bg-hoverdark xl:p-10"
    >
      {/* Imagen de tipo header */}
      <div className="relative w-full h-40 sm:h-50 md:h-60 lg:h-70 overflow-hidden rounded-t-lg">
        {logo_url ? (
          <Image src={logo_url} alt={nombre_emp} layout="fill" className="rounded-t-lg object-scale-down" />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700 text-gray-500">
            Imagen no disponible
          </div>
        )}
      </div>

      {/* Título y descripción */}
      <h3 className="mb-5 mt-7.5 text-xl font-semibold text-black dark:text-primary xl:text-itemtitle">
        {nombre_emp}
      </h3>
      <p className="mb-4">{condiciones}</p>

      <div className="pl-2 mb-2">
        {/* Categoría */}
        {nombre_cat && (
          <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-white">
            Categoría: {nombre_cat}
          </p>
        )}

        {/* Ubicaciones separadas por coma */}
        {locationList.length > 0 && (
          <p className="text-sm font-semibold text-gray-700 dark:text-white">
            Dirección: {direccion}
          </p>
        )}

      </div>

      {/* Botón Ver más */}
      <div className="flex justify-end mt-3">
        <Link href={pathUrl.startsWith("/admin") ? `/admin/flash/details/${oferta_id}` : `/flash/details/${oferta_id}`}>
          <button className="text-white bg-black dark:text-primary dark:bg-transparent border dark:border-primary rounded-full px-4 py-2 transition-all hover:bg-primary hover:text-white">
            Ver más
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default FlashItem;
