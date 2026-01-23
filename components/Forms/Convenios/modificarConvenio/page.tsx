"use client";

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';

// Métodos de actualización
const updateEmpresa = async (empresaData: any) => {
  const response = await fetch(`/api/crud/empresas`, {
    method: 'PUT',
    body: JSON.stringify(empresaData),
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const errorText = await response.text(); // Captura el texto de error
    throw new Error("Error al actualizar la empresa: " + errorText);
  }

  return response.json(); // Analiza solo si es JSON
};


const updateConvenio = async (convenioData: any) => {
  console.log("Id Convenio: ", convenioData.empresaId)

  const response = await fetch(`/api/crud/convenios`, {
    method: 'PUT',
    body: JSON.stringify(convenioData),
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const errorText = await response.text(); // Captura el texto de error
    throw new Error("Error al actualizar el convenio: " + errorText);
  }

  return response.json(); // Analiza solo si es JSON
};

const updateSucursal = async (sucursalData: any) => {
  const response = await fetch(`/api/crud/sucursales`, {
    method: 'PUT',
    body: JSON.stringify(sucursalData),
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const errorText = await response.text(); // Captura el texto de error
    throw new Error("Error al actualizar la sucursal: " + errorText);
  }

  return response.json(); // Analiza solo si es JSON
};


const ModificarConvenio = ({ onClose }: { onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();

  const idString = Array.isArray(id) ? id[0] : id; // Si id es un arreglo, toma el primer elemento

  const [empresaData, setEmpresaData] = useState({
    empresaId: "",
    empresaNombre: "",
    logoUrl: "",
    sitio_web: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
  });

  const [convenioData, setConvenioData] = useState({
    empresaId: "",
    categoriaId: "",
    titulo: "",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    condiciones: "",
  });

  const [sucursalData, setSucursalData] = useState({
    empresaId: "",
    direccion: "",
    telefono: "",
    correo_contacto: "",
    ciudad: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (empresaData.hasOwnProperty(name)) {
      setEmpresaData(prev => ({ ...prev, [name]: value }));
    } else if (convenioData.hasOwnProperty(name)) {
      setConvenioData(prev => ({ ...prev, [name]: value }));
    } else if (sucursalData.hasOwnProperty(name)) {
      setSucursalData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar que los datos de empresa no estén vacíos o incorrectos
    if (!empresaData.empresaNombre || !empresaData.empresaNombre.trim()) {
      alert("El nombre de la empresa es obligatorio.");
      return;
    }

    // Verificar que los datos de convenio sean válidos
    if (!convenioData.titulo || !convenioData.titulo.trim()) {
      alert("El título del convenio es obligatorio.");
      return;
    }

    // Verificar que los datos de sucursal sean válidos
    if (!sucursalData.direccion || !sucursalData.direccion.trim()) {
      alert("La dirección de la sucursal es obligatoria.");
      return;
    }

    try {
      // Llamadas a la API para actualizar los datos
      console.log("EMPRESA ANTES: ", empresaData)
      await updateEmpresa(empresaData);
      console.log("CONVENIO ANTES: ", convenioData)
      await updateConvenio(convenioData);
      console.log("SUCURSAL ANTES: ", sucursalData)
      await updateSucursal(sucursalData);
      onClose(); // Cierra el formulario si todo se actualiza correctamente
      window.location.reload();

    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };


  useEffect(() => {
    if (!id) return;

    const fetchInitialData = async () => {
      try {
        const [empresaResponse, convenioResponse, sucursalResponse] = await Promise.all([
          fetch(`/api/crud/empresas/${id}`),
          fetch(`/api/crud/convenios/${id}`),
          fetch(`/api/crud/sucursales/${id}`)
        ]);

        // Verifica si las respuestas son correctas
        if (!empresaResponse.ok || !convenioResponse.ok || !sucursalResponse.ok) {
          throw new Error("Error al obtener los datos");
        }

        // Conviertes las respuestas a JSON y los almacenas en los datos correspondientes
        const empresaData = await empresaResponse.json();
        const convenioData = await convenioResponse.json();
        const sucursalData = await sucursalResponse.json();

        // Muestra los datos recibidos en la consola para confirmarlos
        /*
        console.log("Empresa Data:", empresaData);
        console.log("Convenio Data:", convenioData);
        console.log("Sucursal  Data:", sucursalData);
        */

        // Asigna los datos al estado
        setEmpresaData({
          empresaId: idString,
          empresaNombre: empresaData.NOMBRE || "",  // Asegúrate de usar la propiedad correcta
          logoUrl: empresaData.LOGO_URL || "",
          sitio_web: empresaData.SITIO_WEB || "",
          facebook: empresaData.FACEBOOK || "",
          instagram: empresaData.INSTAGRAM || "",
          twitter: empresaData.TWITTER || "",
          linkedin: empresaData.LINKEDIN || ""
        });

        setConvenioData({
          empresaId: idString,
          categoriaId: convenioData.CATEGORIA_ID || "",
          titulo: convenioData.TITULO || "",
          fechaInicio: convenioData.FECHA_INICIO ? new Date(convenioData.FECHA_INICIO) : new Date(),
          fechaFin: convenioData.FECHA_FIN ? new Date(convenioData.FECHA_FIN) : new Date(),
          condiciones: convenioData.CONDICIONES || ""
        });

        setSucursalData({
          empresaId: idString,
          direccion: sucursalData.DIRECCION || "",
          telefono: sucursalData.TELEFONO || "",
          correo_contacto: sucursalData.CORREO_CONTACTO || "",
          ciudad: sucursalData.CIUDAD || ""
        });
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchInitialData();
  }, [id]);

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
          <h2 className="mb-5 pt-3 text-center text-2xl font-semibold text-white dark:text-black">
            Editar Convenio
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-5 flex flex-col gap-7.5 lg:flex-row lg:gap-8">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                  Nombre de la empresa
                </label>
                <input
                  type="text"
                  name="empresaNombre"
                  value={empresaData.empresaNombre}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                  Imagen (URL)
                </label>
                <input
                  type="text"
                  name="logoUrl"
                  value={empresaData.logoUrl}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                />
              </div>
            </div>
            <div className="mb-5 flex flex-col gap-7.5 lg:flex-row lg:gap-8">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                  Sitio Web
                </label>
                <input
                  type="text"
                  name="sitio_web"
                  value={empresaData.sitio_web}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                  Facebook
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={empresaData.facebook}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                />
              </div>
            </div>
            <div className="mb-5 flex flex-col gap-7.5 lg:flex-row lg:gap-8">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                  Instagram
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={empresaData.instagram}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                  Twitter
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={empresaData.twitter}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                />
              </div>
            </div>
            <div className="mb-5 flex flex-col gap-7.5 lg:flex-row lg:gap-8">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                  LinkedIn
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={empresaData.linkedin}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="mb-5 flex flex-col gap-7.5 lg:flex-row lg:gap-8">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                  Categoría
                </label>
                <input
                  type="text"
                  name="categoriaId"
                  value={convenioData.categoriaId}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                  Título del Convenio
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={convenioData.titulo}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                />
              </div>
            </div>


            {/* Fecha */}
            <div className="mb-5 flex flex-col gap-7.5 lg:flex-row lg:gap-8">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Fecha de inicio</label>
                <input
                  type="date"
                  name="fechainicio"
                  value={convenioData.fechaInicio instanceof Date && !isNaN(convenioData.fechaInicio.getTime())
                    ? convenioData.fechaInicio.toISOString().split("T")[0]
                    : ""} // Usa una cadena vacía si fechaInicio no es una fecha válida

                  onChange={(e) =>
                    setConvenioData({ ...convenioData, fechaInicio: new Date(e.target.value) })
                  }
                  className="w-full border-b border-strokedark bg-transparent pt-2 appearance-none focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white accent-yellow-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Fecha de Finalización</label>
                <input
                  type="date"
                  name="fechafin"
                  value={convenioData.fechaFin instanceof Date && !isNaN(convenioData.fechaFin.getTime())
                    ? convenioData.fechaFin.toISOString().split("T")[0]
                    : ""} // Usa una cadena vacía si fechaFin no es una fecha válida                  
                  onChange={(e) =>
                    setConvenioData({ ...convenioData, fechaFin: new Date(e.target.value) })
                  }
                  className="w-full border-b border-strokedark bg-transparent pt-2 appearance-none focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white accent-yellow-500"
                />
              </div>
            </div>

            <div className="mb-5 flex flex-col gap-7.5 lg:flex-row lg:gap-8">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                  Condiciones
                </label>
                <input
                  type="text"
                  name="condiciones"
                  value={convenioData.condiciones}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="mb-5 flex flex-col gap-7.5 lg:flex-row lg:gap-8">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={sucursalData.direccion}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                  Telefono
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={sucursalData.telefono}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="mb-5 flex flex-col gap-7.5 lg:flex-row lg:gap-8">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                  Correo de Contacto
                </label>
                <input
                  type="text"
                  name="correo_contacto"
                  value={sucursalData.correo_contacto}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-800">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={sucursalData.ciudad}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="flex justify-center gap-5 pb-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-full dark:bg-green-600"
              >
                Guardar Cambios
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-black rounded-full dark:bg-gray-700 dark:text-white"
                onClick={() => onClose()}
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ModificarConvenio;
