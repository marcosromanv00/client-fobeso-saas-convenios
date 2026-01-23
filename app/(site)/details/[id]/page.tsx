// app/site/details/[id]/page.tsx

"use client"; // Asegúrate de que tu componente sea un cliente

import { useParams } from "next/navigation"; // Importa useParams
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import ReactQRCode from "react-qr-code";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaGlobe } from "react-icons/fa"; // Importar íconos

const EmpresaDetail = () => {
  const { id } = useParams(); // Usa useParams para obtener el ID
  const idString = Array.isArray(id) ? id[0] : id; // Si id es un arreglo, toma el primer elemento

  const [isCouponPopupOpen, setCouponPopupOpen] = useState(false); // Estado para manejar el popup de cédula
  const [isCouponGenerated, setCouponGenerated] = useState(false); // Estado para manejar el popup del cupón
  const [cedula, setCedula] = useState(""); // Estado para manejar el campo de cédula
  const [couponCode, setCouponCode] = useState(""); // Estado para el código del cupón
  const [userName, setUserName] = useState("Nombre de Usuario"); // Simulación de nombre
  const [empresaDetails, setEmpresaDetails] = useState({
    empresaId: "",
    empresaNombre: "",
    logoUrl: "",
    sitio_web: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    direccion: "",
    telefono: "",
    correo_contacto: "",
    ciudad: "",
    titulo: "",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    condiciones: "",
}); // Estado para los datos del convenio

  // Cargar los datos del convenio desde la API
  useEffect(() => {
    const fetchConvenioData = async () => {
      try {
        const response = await fetch(`/api/convenios/details/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEmpresaDetails({
            empresaId: idString,
            empresaNombre: data.EMPRESA_NOMBRE || "",  // Asegúrate de usar la propiedad correcta
            logoUrl: data.LOGO_URL || "",
            sitio_web: data.SITIO_WEB || "",
            facebook: data.FACEBOOK || "",
            instagram: data.INSTAGRAM || "",
            twitter: data.TWITTER || "",
            linkedin: data.LINKEDIN || "",
            direccion: data.DIRECCION || "",
            telefono: data.TELEFONO || "",
            correo_contacto: data.CORREO_CONTACTO || "",
            ciudad: data.CIUDAD || "",
            titulo: data.TITULO || "",
            fechaInicio: data.FECHA_INICIO ? new Date(data.FECHA_INICIO) : new Date(),
            fechaFin: data.FECHA_FIN ? new Date(data.FECHA_FIN) : new Date(),
            condiciones: data.CONDICIONES || ""
        }
        );
        } else {
          console.error("Error al cargar los datos del convenio");
        }
      } catch (error) {
        console.error("Error al obtener los detalles del convenio:", error);
      }
    };

    fetchConvenioData();
  }, [id]);

  if (!empresaDetails) {
    return <p>Loading...</p>; // Mensaje de carga o error
  }

  // Función para generar un código hexadecimal aleatorio
  const generateHexCode = () => {
    return Math.random().toString(16).substr(2, 8).toUpperCase();
  };

  // Maneja la validación de cédula y generación del cupón
  const handleCouponSubmit = () => {
    console.log("Validar cédula: ", cedula);
    setCouponCode(generateHexCode()); // Genera un código aleatorio
    setCouponPopupOpen(false); // Cierra el popup de cédula
    setCouponGenerated(true); // Abre el popup con el código QR y hex
  };

  const handleNullValue = (value: string | null) => {
    return value ? value : "No disponible";
  };

  return (
    <>
      <section className="overflow-hidden pt-45 pb-20">
        <div className="mx-auto max-w-c-1235 px-4 md:px-8 xl:px-0">
          <div className="flex items-center gap-8 lg:gap-32.5">
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
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_left relative mx-auto hidden aspect-[588/526.5] md:block md:w-1/2"
            >
              <Image
                src={empresaDetails.logoUrl} // Imagen de la empresa
                alt={empresaDetails.empresaNombre}
                layout="fill"
                objectFit="contain"
              />
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
                <p>{handleNullValue(empresaDetails.direccion)}, {handleNullValue(empresaDetails.ciudad)}</p>
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
                  className="inline-flex items-center gap-2.5 rounded-full bg-primary text-black px-8 py-4 mt-2 text-lg font-bold"
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
        <div className="fixed inset-0 z-40 px-5 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-white dark:bg-black p-4 rounded shadow-xl shadow-primary/25">
            <div className="bg-black dark:bg-white px-8 pt-6 pb-4 rounded shadow-xl">
              <h3 className="text-lg text-center pb-3 border-b border-stroke dark:border-gray-400 text-primary dark:text-black font-semibold mb-4 justify-center items-center">
                Ingrese su número de cédula
              </h3>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="flex pt-4 justify-center items-center w-full border-b rounded-lg text-white dark:text-black bg-black dark:bg-white border-stroke dark:border-strokedark focus:border-waterloo focus:placeholder:text-white dark:focus:placeholder:text-black focus-visible:outline-none pb-2 pl-2 mb-2"
                placeholder="Número de cédula"
              />

              <div className="px-5 pt-3 mt-2">
                <button
                  className="inline-flex items-center gap-2.5 rounded-full bg-primary text-black px-4 py-2 text-base font-semibold"
                  onClick={handleCouponSubmit}
                >
                  Verificar y Generar Cupón
                </button>
                <button
                  className="ml-4 px-4 py-2 inline-flex items-center gap-2.5 rounded-full bg-transparent border border-white dark:border-black text-white dark:text-black"
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
        <div className="fixed inset-0 px-5 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-white dark:bg-black p-4 rounded shadow-xl shadow-primary/25">
            <div className="dark:bg-white bg-black px-6 pt-6 pb-4 rounded shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-center text-primary dark:text-black">
                ¡Hemos verificado tu cupón!
              </h3>
              <p className="text-white dark:text-black text-center mb-4">
                El usuario <strong>{userName}</strong> se encuentra
                <br />
                afiliado al Fondo de Beneficio Social.
              </p>
              <div className="flex justify-center my-2">
                <ReactQRCode value={couponCode} size={150} />
              </div>
              <p className="text-white dark:text-black text-center">Código del cupón: {couponCode}</p>
              <button
                className="flex mx-auto mt-3 px-4 py-2 justify-center items-center gap-2.5 rounded-full bg-primary text-black"
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

export default EmpresaDetail;
