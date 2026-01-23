"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaFacebook, FaInstagram, FaYoutube, FaGlobe } from "react-icons/fa"; // Importar íconos

const Footer = () => {
  const pathUrl = usePathname();

  // Verifica si la ruta actual contiene "/admin/" y oculta el footer en esas rutas
  const isAdminRoute = pathUrl.startsWith('/admin');

  return (
    <>
      {/* Si no es una ruta del módulo admin, se renderiza el footer */}
      <footer className="border-t border-stroke bg-blacksection dark:border-strokedark dark:bg-blacksection">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          {/* <!-- Footer Top --> */}
          <div className="py-10 lg:py-15">
            <div className="xl:px-20 lg:px-15 md:px-10 px-10 flex flex-wrap lg:justify-between lg:gap-0 xl:gap-5">
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: -20,
                  },

                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
                className="animate_top w-1/2 lg:w-1/4"
              >
                <a href="/" className="relative">
                  <Image
                    width={110}
                    height={80}
                    src="/images/logo/logo-blanco.png"
                    alt="Logo"
                    className="dark:hidden"
                  />
                  <Image
                    width={110}
                    height={80}
                    src="/images/logo/logo-blanco.png"
                    alt="Logo"
                    className="hidden dark:block"
                  />
                </a>

                <p className="mt-15 mb-1.5 text-sectiontitle uppercase tracking-[5px]">
                  contacto
                </p>
                <a
                  href="#"
                  className="text-itemtitle font-medium text-white dark:text-white"
                >
                  info@fobeso.com
                </a>
              </motion.div>

              <div className="flex w-full flex-col gap-8 md:flex-row md:justify-between md:gap-0 lg:w-2/3 xl:w-7/12">
                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: -20,
                    },

                    visible: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 1, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="animate_top"
                >
                  <h4 className="mb-9 text-itemtitle2 font-medium text-white dark:text-white">
                    Información
                  </h4>

                  <ul>
                    <li>
                      <a
                        href="https://fobeso.com/nosotros/"
                        className="mb-3 inline-block hover:text-primary"
                      >
                        Acerca del FBS
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://fobeso.com/ahorro/"
                        className="mb-3 inline-block hover:text-primary"
                      >
                        Planes de Ahorro
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://fobeso.com/credito/"
                        className="mb-3 inline-block hover:text-primary"
                      >
                        Planes de Crédito
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://sucursalvirtual.fobeso.com/"
                        className="mb-3 inline-block hover:text-primary"
                      >
                        Trámites en Línea
                      </a>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: -20,
                    },

                    visible: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 1, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="animate_top"
                >
                  <h4 className="mb-9 text-itemtitle2 font-medium text-white dark:text-white">
                    Recursos
                  </h4>

                  <ul>
                    <li>
                      <a
                        href="https://fobeso.com/adm_cesantia/"
                        className="mb-3 inline-block hover:text-primary"
                      >
                        Cesantía
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://fobeso.com/informes-anuales-y-estados-financieros/"
                        className="mb-3 inline-block hover:text-primary"
                      >
                        Informes
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://fobeso.com/plan-estrategico/"
                        className="mb-3 inline-block hover:text-primary"
                      >
                        Plan Estratégico
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://fobeso.com/galeria/"
                        className="mb-3 inline-block hover:text-primary"
                      >
                        Galería
                      </a>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: -20,
                    },

                    visible: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 1, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="animate_top"
                >
                  <h4 className="mb-9 text-itemtitle2 font-medium text-white dark:text-white">
                    Redes Sociales
                  </h4>
                  <p className="mb-4 w-[90%]">
                    Suscíbete para más información
                  </p>

                  <ul className="mt-5 flex items-center gap-5">
                    
                      <li>
                        <a
                          href='#'
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:underline"
                        >
                          <FaGlobe />
                        </a>
                      </li>
                      <li>
                        <a
                          href='#'
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:underline"
                        >
                          <FaFacebook />
                        </a>
                      </li>
                      <li>
                        <a
                          href='#'
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-pink-500 hover:underline"
                        >
                          <FaInstagram />
                        </a>
                      </li>
                    
                      <li>
                        <a
                          href='#'
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-red-600 hover:underline"
                        >
                          <FaYoutube />
                        </a>
                      </li>
                    
                      
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
