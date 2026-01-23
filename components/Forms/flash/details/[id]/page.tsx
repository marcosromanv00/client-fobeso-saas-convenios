// app/site/details/[id]/page.tsx

"use client"; // Asegúrate de que tu componente sea un cliente

import { useParams } from "next/navigation"; // Importa useParams
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaGlobe } from "react-icons/fa"; // Importar íconos

//import ModificarConvenio from "../../convenios/modificarConvenio/page";
//import EliminarConvenio from "../../convenios/eliminarConvenio/page";

const FlashDetail = () => {
    const { id } = useParams(); // Usa useParams para obtener el ID
    const idString = Array.isArray(id) ? id[0] : id; // Si id es un arreglo, toma el primer elemento

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


    const [isModifyModalOpen, setModifyModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    // Funciones para manejar la apertura y cierre de los modales
    const handleModifyClose = () => setModifyModalOpen(false);
    const handleDeleteClose = () => setDeleteModalOpen(false);

    // Cargar los datos del convenio desde la API
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/flash/details/${id}`);
                if (!response.ok) throw new Error("No se pudo obtener el convenio");
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
            } catch (err: any) {
                console.error("Error fetching details:", err.message);
                setError("Error al cargar los datos.");
            }
        };

        fetchData();
    }, [id]);

    if (error) {
        return <p>{error}</p>;
    }

    useEffect(() => {
        if (isModifyModalOpen || isDeleteModalOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isModifyModalOpen, isDeleteModalOpen]);


    if (!empresaDetails) {
        return <p>Loading...</p>; // Mensaje de carga o error
    }

    // Función para generar un código hexadecimal aleatorio
    const generateHexCode = () => {
        return Math.random().toString(16).substr(2, 8).toUpperCase();
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
                            <div className="flex justify-center gap-3 p-4">
                                {/* Botones de Modificar y Eliminar */}
                                <button
                                    className="inline-flex items-center gap-2.5 rounded-full bg-blue-500 text-white px-8 py-4 mt-2 text-lg font-bold"
                                    onClick={() => setModifyModalOpen(true)} // Abre el modal de Modificar
                                >
                                    Modificar
                                </button>
                                <button
                                    className="inline-flex items-center gap-2.5 rounded-full bg-red-500 text-white px-8 py-4 mt-2 text-lg font-bold"
                                    onClick={() => setDeleteModalOpen(true)} // Abre el modal de Eliminar
                                >
                                    Eliminar
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/*isModifyModalOpen && <ModificarConvenio onClose={handleModifyClose} />*/}
                    {/*isDeleteModalOpen && <EliminarConvenio
                        empresaId={idString}
                        empresaNombre={empresaDetails.empresaNombre}
                        onClose={handleDeleteClose}
                    />*/}
                </div>
            </section>
        </>
    );
};

export default FlashDetail;
