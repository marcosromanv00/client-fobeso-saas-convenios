import React from "react";
import Image from "next/image";
import { Empresa } from "@/types/empresa";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const SingleBrand = ({ empresa }: { empresa: Empresa }) => {
  const { logo_url, nombre, empresa_id } = empresa;
  const [imgError, setImgError] = React.useState(false);

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
      className="animate_top mx-w-full relative flex h-[100px] w-[178px] items-center justify-center p-4"
    >
      {logo_url && !imgError ? (
        <>
          <Image
            src={logo_url}
            alt={nombre}
            fill
            className="object-contain opacity-65 transition-all duration-300 hover:opacity-100 dark:hidden"
            onError={() => setImgError(true)}
          />
          <Image
            src={logo_url}
            alt={nombre}
            fill
            className="hidden object-contain opacity-50 transition-all duration-300 hover:opacity-100 dark:block"
            onError={() => setImgError(true)}
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-200 p-2 text-center text-sm font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-300">
          {nombre}
        </div>
      )}
    </motion.a>
  );
};

export default SingleBrand;
