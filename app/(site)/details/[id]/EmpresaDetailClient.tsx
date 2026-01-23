"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import ReactQRCode from "react-qr-code";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";

interface EmpresaDetailClientProps {
  empresaDetails: {
    empresaNombre: string;
    logoUrl: string;
    sitio_web: string;
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    direccion: string;
    telefono: string;
    correo_contacto: string;
    ciudad: string;
    titulo: string;
    condiciones: string;
    fechaInicio?: Date | string;
    fechaFin?: Date | string;
  };
}

const EmpresaDetailClient = ({ empresaDetails }: EmpresaDetailClientProps) => {
  const [isCouponPopupOpen, setCouponPopupOpen] = useState(false);
  const [isCouponGenerated, setCouponGenerated] = useState(false);
  const [cedula, setCedula] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [userName, setUserName] = useState("Nombre de Usuario");

  const generateHexCode = () => {
    return Math.random().toString(16).substr(2, 8).toUpperCase();
  };

  const handleCouponSubmit = () => {
    console.log("Validar cédula: ", cedula);
    // Aquí podrías agregar una llamada a API para validar la cédula realmente
    setCouponCode(generateHexCode());
    setCouponPopupOpen(false);
    setCouponGenerated(true);
  };

  const handleNullValue = (value: string | null) => {
    return value ? value : "No disponible";
  };

  return (
    <>
      <section className="overflow-hidden pb-20 pt-45">
        <div className="mx-auto max-w-c-1235 px-4 md:px-8 xl:px-0">
          <div className="flex items-center gap-8 lg:gap-32.5">
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_left relative mx-auto hidden aspect-[588/526.5] md:block md:w-1/2"
            >
              {empresaDetails.logoUrl && (
                <Image
                  src={empresaDetails.logoUrl}
                  alt={empresaDetails.empresaNombre}
                  layout="fill"
                  objectFit="contain"
                />
              )}
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_right md:w-1/2"
            >
              <h2 className="relative mb-6 text-3xl font-bold text-black dark:text-white xl:text-hero">
                {empresaDetails.empresaNombre}
              </h2>
              <p>{empresaDetails.condiciones}</p>

              <div className="mt-7.5">
                <h3 className="mb-0.5 text-metatitle2 text-black dark:text-white">
                  Ubicación:
                </h3>
                <p>
                  {handleNullValue(empresaDetails.direccion)},{" "}
                  {handleNullValue(empresaDetails.ciudad)}
                </p>
                <p>{handleNullValue(empresaDetails.telefono)}</p>
                <p>{handleNullValue(empresaDetails.correo_contacto)}</p>
              </div>

              <div className="mt-7.5">
                <h3 className="mb-0.5 text-metatitle2 text-black dark:text-white">
                  Redes Sociales:
                </h3>
                <ul className="space-y-2">
                  {empresaDetails.sitio_web && (
                    <li>
                      <a
                        href={empresaDetails.sitio_web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <FaGlobe /> Sitio Web
                      </a>
                    </li>
                  )}
                  {empresaDetails.facebook && (
                    <li>
                      <a
                        href={empresaDetails.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <FaFacebook /> Facebook
                      </a>
                    </li>
                  )}
                  {empresaDetails.instagram && (
                    <li>
                      <a
                        href={empresaDetails.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-pink-500 hover:underline"
                      >
                        <FaInstagram /> Instagram
                      </a>
                    </li>
                  )}
                  {empresaDetails.twitter && (
                    <li>
                      <a
                        href={empresaDetails.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:underline"
                      >
                        <FaTwitter /> Twitter
                      </a>
                    </li>
                  )}
                  {empresaDetails.linkedin && (
                    <li>
                      <a
                        href={empresaDetails.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-700 hover:underline"
                      >
                        <FaLinkedin /> LinkedIn
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              {/* Botón para generar cupón */}
              <div className="mt-4">
                <button
                  className="mt-2 inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-lg font-bold text-black"
                  onClick={() => setCouponPopupOpen(true)}
                >
                  Generar Cupón de Descuento
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popup para ingresar la cédula */}
      {isCouponPopupOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-75 px-5">
          <div className="rounded bg-white p-4 shadow-xl shadow-primary/25 dark:bg-black">
            <div className="rounded bg-black px-8 pb-4 pt-6 shadow-xl dark:bg-white">
              <h3 className="mb-4 items-center justify-center border-b border-stroke pb-3 text-center text-lg font-semibold text-primary dark:border-gray-400 dark:text-black">
                Ingrese su número de cédula
              </h3>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="mb-2 flex w-full items-center justify-center rounded-lg border-b border-stroke bg-black pb-2 pl-2 pt-4 text-white focus:border-waterloo focus:placeholder:text-white focus-visible:outline-none dark:border-strokedark dark:bg-white dark:text-black dark:focus:placeholder:text-black"
                placeholder="Número de cédula"
              />

              <div className="mt-2 px-5 pt-3">
                <button
                  className="inline-flex items-center gap-2.5 rounded-full bg-primary px-4 py-2 text-base font-semibold text-black"
                  onClick={handleCouponSubmit}
                >
                  Verificar y Generar Cupón
                </button>
                <button
                  className="ml-4 inline-flex items-center gap-2.5 rounded-full border border-white bg-transparent px-4 py-2 text-white dark:border-black dark:text-black"
                  onClick={() => setCouponPopupOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup para mostrar el cupón generado */}
      {isCouponGenerated && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 px-5">
          <div className="rounded bg-white p-4 shadow-xl shadow-primary/25 dark:bg-black">
            <div className="rounded bg-black px-6 pb-4 pt-6 shadow-xl dark:bg-white">
              <h3 className="mb-4 text-center text-lg font-semibold text-primary dark:text-black">
                ¡Hemos verificado tu cupón!
              </h3>
              <p className="mb-4 text-center text-white dark:text-black">
                El usuario <strong>{userName}</strong> se encuentra
                <br />
                afiliado al Fondo de Beneficio Social.
              </p>
              <div className="my-2 flex justify-center">
                <ReactQRCode value={couponCode} size={150} />
              </div>
              <p className="text-center text-white dark:text-black">
                Código del cupón: {couponCode}
              </p>
              <button
                className="mx-auto mt-3 flex items-center justify-center gap-2.5 rounded-full bg-primary px-4 py-2 text-black"
                onClick={() => setCouponGenerated(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmpresaDetailClient;
