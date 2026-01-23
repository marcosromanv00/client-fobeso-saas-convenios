"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import Image from "next/image";

const fetchCategorias = async () => {
  const response = await fetch("/api/convenios/categorias");
  if (!response.ok) {
    throw new Error("Error al obtener las categorías");
  }
  const data = await response.json();
  return data; // Esperamos que la respuesta sea un array de categorías
};

const createEmpresa = async (empresaData: any) => {
  // Llamada API para crear la empresa
  const response = await fetch("/api/crud/empresas", {
    method: "POST",
    body: JSON.stringify(empresaData),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Error al crear la empresa: " + response.statusText);
  }

  const result = await response.json();

  return result;
};

const createConvenio = async (convenioData: any) => {
  // Llamada API para crear el convenio
  const response = await fetch("/api/crud/convenios", {
    method: "POST",
    body: JSON.stringify(convenioData),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json(); // Asegúrate de que la respuesta es válida JSON
};

const createSucursal = async (sucursalData: any) => {
  // Llamada API para crear la sucursal
  const response = await fetch("/api/crud/sucursales", {
    method: "POST",
    body: JSON.stringify(sucursalData),
    headers: { "Content-Type": "application/json" },
  });
  return response.json(); // Suponiendo que la respuesta incluye el SUCURSAL_ID creado
};

const CrearConvenio = ({ onClose }: { onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [categorias, setCategorias] = useState<any[]>([]);

  const [empresaData, setEmpresaData] = useState({
    empresaNombre: "",
    logoUrl: "",
    sitio_web: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
  });
  const [uploading, setUploading] = useState(false);

  const [convenioData, setConvenioData] = useState({
    categoria_id: "",
    titulo: "",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    condiciones: "",
  });

  const [sucursalData, setSucursalData] = useState({
    direccion: "",
    telefono: "",
    correo_contacto: "",
    ciudad: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (empresaData.hasOwnProperty(name)) {
      setEmpresaData((prev) => ({ ...prev, [name]: value }));
    } else if (convenioData.hasOwnProperty(name)) {
      setConvenioData((prev) => ({ ...prev, [name]: value }));
    } else if (sucursalData.hasOwnProperty(name)) {
      setSucursalData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (convenioData.hasOwnProperty(name)) {
      setConvenioData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error uploading image");
      }

      const data = await response.json();
      setEmpresaData((prev) => ({ ...prev, logoUrl: data.url }));
    } catch (error: any) {
      alert("Error uploading image: " + error.message);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de campos requeridos
    if (
      !empresaData.empresaNombre ||
      !convenioData.categoria_id ||
      !convenioData.titulo ||
      !sucursalData.direccion
    ) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      // Crear empresa
      const empresaResponse = await createEmpresa({
        nombre: empresaData.empresaNombre,
        logoUrl: empresaData.logoUrl,
        sitio_web: empresaData.sitio_web,
        facebook: empresaData.facebook,
        instagram: empresaData.instagram,
        twitter: empresaData.twitter,
        linkedin: empresaData.linkedin,
      });

      if (!empresaResponse || !empresaResponse.EMPRESA_ID) {
        throw new Error(
          "Error al crear la empresa: No se recibió el EMPRESA_ID",
        );
      }

      const empresa_id = empresaResponse.EMPRESA_ID;

      // Crear convenio
      const convenioResponse = await createConvenio({
        empresaId: empresa_id,
        categoriaId: convenioData.categoria_id,
        titulo: convenioData.titulo,
        fechaInicio: convenioData.fechaInicio,
        fechaFin: convenioData.fechaFin,
        condiciones: convenioData.condiciones,
      });

      // Crear sucursal
      const sucursalResponse = await createSucursal({
        empresaId: empresa_id,
        direccion: sucursalData.direccion,
        telefono: sucursalData.telefono,
        correoContacto: sucursalData.correo_contacto,
        ciudad: sucursalData.ciudad,
      });

      console.log(
        "Empresa, convenio y sucursal creados:",
        empresaResponse,
        convenioResponse,
        sucursalResponse,
      );

      // Cerrar modal después de la creación exitosa de todos los objetos
      onClose();
      window.location.reload();
    } catch (error) {
      // Muestra el mensaje de error al usuario
      alert(`Error: ${error.message}`);
      console.error("Error al crear los objetos:", error);
    }
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("/api/convenios/categorias");
        const data = await response.json();
        console.log("Categorías obtenidas:", data); // Verifica los datos aquí
        if (data.rows && Array.isArray(data.rows)) {
          setCategorias(data.rows); // Accede a la propiedad rows
        } else {
          console.error("La respuesta no contiene un array de categorías");
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div
        ref={modalRef}
        className="z-60 relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1, delay: 0.1 }}
          className="rounded-lg bg-black px-7.5 pt-2 shadow-solid-8 dark:border dark:border-gray-700 dark:bg-white"
        >
          <h2 className="mb-5 pt-3 text-center text-2xl font-semibold text-white dark:text-black">
            Crear Convenio
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
                  Logo de la Empresa
                </label>
                <div className="mt-2 flex flex-col gap-2">
                  {empresaData.logoUrl && (
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border border-gray-300">
                      <Image
                        src={empresaData.logoUrl}
                        alt="Logo preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="w-full text-sm text-gray-500
                        file:mr-4 file:rounded-full file:border-0
                        file:bg-blue-50 file:px-4
                        file:py-2 file:text-sm
                        file:font-semibold file:text-blue-700
                        hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300
                      "
                    />
                    {uploading && (
                      <span className="mt-1 text-xs text-blue-500">
                        Subiendo...
                      </span>
                    )}
                  </div>
                  {/* Fallback hidden input for submission just in case */}
                  <input
                    type="hidden"
                    name="logoUrl"
                    value={empresaData.logoUrl}
                  />
                </div>
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
                <select
                  name="categoria_id"
                  value={convenioData.categoria_id}
                  onChange={handleSelectChange}
                  className="w-full border-b border-gray-300 bg-transparent pt-2 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-300 dark:focus:placeholder:text-gray-300"
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((categoria) => (
                    <option
                      key={categoria.CATEGORIA_ID}
                      value={categoria.CATEGORIA_ID}
                    >
                      {categoria.NOMBRE}
                    </option>
                  ))}
                </select>
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
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  name="fechainicio"
                  value={convenioData.fechaInicio.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setConvenioData({
                      ...convenioData,
                      fechaInicio: new Date(e.target.value),
                    })
                  }
                  className="w-full appearance-none border-b border-strokedark bg-transparent pt-2 accent-yellow-500 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de Finalización
                </label>
                <input
                  type="date"
                  name="fechafin"
                  value={convenioData.fechaFin.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setConvenioData({
                      ...convenioData,
                      fechaFin: new Date(e.target.value),
                    })
                  }
                  className="w-full appearance-none border-b border-strokedark bg-transparent pt-2 accent-yellow-500 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
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
                className="rounded-full bg-green-500 px-4 py-2 text-white dark:bg-green-600"
                onClick={() => {
                  ("");
                }}
              >
                Guardar Cambios
              </button>
              <button
                className="rounded-full bg-gray-300 px-4 py-2 text-black dark:bg-gray-700 dark:text-white"
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

export default CrearConvenio;
