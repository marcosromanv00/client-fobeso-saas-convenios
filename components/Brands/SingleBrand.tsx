import React from "react";
import Image from "next/image";
import { Empresa } from "@/types/empresa";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const SingleBrand = ({ empresa }: { empresa: Empresa }) => {
  const { logo_url, nombre, empresa_id } = empresa;

  // Obtener la ruta actual
  const pathUrl = usePathname();

  // Determinar el href dinámico
  const href = pathUrl.startsWith("/admin")
    ? `/admin/details/${empresa_id}`
    : `/details/${empresa_id}`;

  return (
    <motion.a
      variants={{
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 1, delay: 0.5 }}
      viewport={{ once: true }}
      href={href}
      className="animate_top mx-w-full relative flex h-[100px] w-[178px] overflow-hidden items-center justify-center"
    >
      {/* Logo de la empresa */}
      {logo_url ? (<Image
        src={logo_url}
        alt={nombre}
        width={178}
        height={100}
        className="opacity-65 transition-all duration-300 hover:opacity-100 dark:hidden rounded-t-lg object-contain"
      />) : (<div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700 text-gray-500">
        Imagen no disponible
      </div>)}
      {logo_url ? (
        <Image
          src={logo_url}
          alt={nombre}
          width={178}
          height={100}
          className="hidden opacity-50 transition-all duration-300 hover:opacity-100 dark:block rounded-t-lg object-contain"
        />) : (<div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700 text-gray-500">
          Imagen no disponible
        </div>)}
    </motion.a>
  );
};

export default SingleBrand;
