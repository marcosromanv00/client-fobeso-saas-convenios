"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation"; // Importa usePathname

const CTA = () => {
  // Obtenemos la ruta actual
  const pathUrl = usePathname();

  // Determinamos el href según la ruta actual
  const href = pathUrl?.startsWith("/admin") ? "/admin/convenios" : "/convenios";

  return (
    <>
      {/* <!-- ===== CTA Start ===== --> */}
      <section id= "all-features" className="overflow-hidden px-4 md:px-8 lg:pt-5 xl:pt-10 2xl:px-0">
        <div className="mx-auto max-w-c-1390 rounded-lg bg-gradient-to-t from-[#F8F9FF] to-[#DEE7FF] px-7.5 pt-12.5 dark:bg-blacksection dark:bg-gradient-to-t dark:from-transparent dark:to-transparent dark:stroke-strokedark md:px-12.5 xl:px-17.5 xl:py-0">
          <div className="flex flex-wrap gap-8 md:flex-nowrap md:items-center md:justify-between md:gap-0">
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: -20,
                },

                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_left md:w-[70%] lg:w-1/2"
            >
              <h2 className="mb-4 w-11/12 text-3xl font-bold text-black dark:text-white xl:text-sectiontitle4">
                ¿Quiere ver todos los convenios que tenemos para usted?
              </h2>
              <p>
                Actualmente el Fondo de Beneficio Social cuenta con X 
                cantidad de convenios de todo tipo para cuidar tus finanzas, 
                al mismo tiempo que obtienes beneficios para los servicios que más necesites. 
              </p>
            </motion.div>
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: 20,
                },

                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_right lg:w-[45%]"
            >
              <div className="flex items-center justify-end xl:justify-between">
                <Image
                  width={299}
                  height={299}
                  src="/images/shape/shape-06.png"
                  alt="Saly"
                  className="hidden xl:block"
                />
                <a
                  href={href} // Usamos el href determinado
                  className="inline-flex items-center gap-2.5 rounded-full bg-black px-8 py-5 text-xl font-semibold text-white hover:opacity-90 dark:bg-primary dark:text-black"
                >
                  Ver convenios
                  <Image
                    width={20}
                    height={20}
                    src="/images/icon/icon-arrow-dark.svg"
                    alt="Arrow"
                    className="dark:hidden"
                  />
                  <Image
                    width={20}
                    height={20}
                    src="/images/icon/icon-arrow-light.svg"
                    alt="Arrow"
                    className="hidden dark:block"
                  />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* <!-- ===== CTA End ===== --> */}
    </>
  );
};

export default CTA;
