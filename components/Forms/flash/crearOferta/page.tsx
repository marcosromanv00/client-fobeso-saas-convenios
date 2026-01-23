"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";

// API functions for companies, agreements, and branches (stubbed for demonstration)
const createOferta = async (ofertaData: any) => {
    // Llamada API para crear la empresa
    const response = await fetch('/api/crud/flash', {
        method: 'POST',
        body: JSON.stringify(ofertaData),
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        throw new Error("Error al crear la oferta: " + response.statusText);
    }

    const result = await response.json();

    return result;
};

const CrearOferta = ({ onClose }: { onClose: () => void }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const [ofertaData, setOfertaData] = useState({
        convenio_id: "",
        categoria_id: "",
        titulo: "",
        fechaInicio: new Date(),
        fechaFin: new Date(),
        condiciones: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (ofertaData.hasOwnProperty(name)) {
            setOfertaData(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación de campos requeridos
        if (!ofertaData.categoria_id || !ofertaData.titulo) {
            alert("Por favor, completa todos los campos requeridos.");
            return;
        }

        try {
            // Crear oferta
            const ofertaResponse = await createOferta({
                convenioId: ofertaData.convenio_id,
                categoriaId: ofertaData.categoria_id,
                titulo: ofertaData.titulo,
                fechaInicio: ofertaData.fechaInicio,
                fechaFin: ofertaData.fechaFin,
                condiciones: ofertaData.condiciones,
            });


            console.log("Oferta creada:", ofertaResponse);

            // Cerrar modal después de la creación exitosa de todos los objetos
            onClose();
        } catch (error) {
            // Muestra el mensaje de error al usuario
            alert(`Error: ${error.message}`);
            console.error("Error al crear el objeto oferta:", error);
        }
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex justify-center items-center">
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-xl relative z-60 max-h-[80vh] w-full max-w-lg overflow-y-auto">
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: -20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 1, delay: 0.1 }}
                    className="rounded-lg px-7.5 pt-2 shadow-solid-8 bg-black dark:bg-white dark:border dark:border-gray-700"
                >
                    <h2 className="mb-3 pt-2 text-center text-2xl font-semibold text-white dark:text-black">
                        Crear Oferta
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                                    Id del convenio
                                </label>
                                <input
                                    type="text"
                                    name="convenio_id"
                                    value={ofertaData.convenio_id}
                                    onChange={handleInputChange}
                                    className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                                    Categoría
                                </label>
                                <input
                                    type="text"
                                    name="categoria_id"
                                    value={ofertaData.categoria_id}
                                    onChange={handleInputChange}
                                    className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                                    Título de la Oferta
                                </label>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={ofertaData.titulo}
                                    onChange={handleInputChange}
                                    className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Fecha de inicio</label>
                                <input
                                    type="date"
                                    name="fechainicio"
                                    value={ofertaData.fechaInicio.toISOString().split("T")[0]}
                                    onChange={(e) =>
                                        setOfertaData({ ...ofertaData, fechaInicio: new Date(e.target.value) })
                                    }
                                    className="w-full border-b border-strokedark bg-transparent pt-2 appearance-none focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white accent-yellow-500"
                                /></div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Fecha de Finalización</label>
                                <input
                                    type="date"
                                    name="fechafin"
                                    value={ofertaData.fechaFin.toISOString().split("T")[0]}
                                    onChange={(e) =>
                                        setOfertaData({ ...ofertaData, fechaFin: new Date(e.target.value) })
                                    }
                                    className="w-full border-b border-strokedark bg-transparent pt-2 appearance-none focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white accent-yellow-500"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                                    Condiciones
                                </label>
                                <input
                                    type="text"
                                    name="condiciones"
                                    value={ofertaData.condiciones}
                                    onChange={handleInputChange}
                                    className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                                />
                            </div>
                            <div className="flex justify-center gap-5 pb-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded-full dark:bg-green-600"
                                    onClick={() => {
                                        "";
                                    }}
                                >
                                    Guardar Cambios
                                </button>
                                <button
                                    className="px-4 py-2 bg-gray-300 text-black rounded-full dark:bg-gray-700 dark:text-white"
                                    onClick={() => onClose()}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CrearOferta;
