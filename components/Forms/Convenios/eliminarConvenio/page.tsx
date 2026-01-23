// app/admin/convenios/eliminarConvenio.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const EliminarConvenio = ({
  empresaId,
  empresaNombre,
  onClose,
}: {
  empresaId: string;
  empresaNombre: string;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();

  const idString = Array.isArray(id) ? id[0] : id;

  const [empresaDetails, setEmpresaDetails] = useState<any>(null); // Estado para los datos del convenio

  // Obtener los datos del convenio
  useEffect(() => {
    const fetchConvenioData = async () => {
      try {
        const response = await fetch(`/api/convenios/details/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEmpresaDetails(data); // Guardar los datos de la respuesta
        } else {
          console.error("Error al cargar los datos del convenio");
        }
      } catch (error) {
        console.error("Error al obtener los detalles del convenio:", error);
      }
    };

    fetchConvenioData();
  }, [id]);

  // Manejo de eliminación
  const onDelete = async () => {
    try {
      if (!empresaDetails) {
        alert("No se encontraron detalles del convenio.");
        return;
      }

      // Eliminar la sucursal
      const sucursalResponse = await fetch(`/api/crud/sucursales`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ empresaId: idString }),
      });
      if (!sucursalResponse.ok) {
        throw new Error("Error al eliminar la sucursal.");
      }

      // Eliminar el convenio
      const convenioResponse = await fetch(`/api/crud/convenios`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ empresaId: idString }),
      });
      if (!convenioResponse.ok) {
        throw new Error("Error al eliminar el convenio.");
      }

      // Eliminar la empresa
      const empresaResponse = await fetch(`/api/crud/empresas`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ empresaId: idString }),
      });
      if (!empresaResponse.ok) {
        throw new Error("Error al eliminar la empresa.");
      }

      alert("Convenio eliminado exitosamente.");
      onClose();
      window.location.href = '/admin/convenios';
    } catch (error) {
      console.error("Error al eliminar el convenio:", error);
      alert("Ocurrió un error al eliminar el convenio.");
    }
  };

  // Cerrar el modal al hacer clic fuera
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
      <div ref={modalRef} className="bg-transparent p-6 rounded-lg shadow-xl relative z-60 max-h-[80vh] w-full max-w-lg overflow-y-auto">


        <div className="fixed inset-0 px-5 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-white dark:bg-black p-4 rounded shadow-xl shadow-primary/25">
            <div className="dark:bg-white bg-black px-6 pt-6 pb-4 rounded shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-center text-primary dark:text-black">
                ¡Hemos verificado tu cupón!
              </h3>
              <p className="text-white dark:text-black text-center mb-4">
                ¿Está seguro de que quiere eliminar el convenio
                <br />
                con la empresa <strong>{empresaNombre}</strong>?
              </p>

              <div className="flex justify-center gap-5 pb-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={onDelete}
                >
                  Eliminar
                </button>
                <button
                  className="ml-4 px-4 py-2 bg-transparent border border-gray-500 rounded"
                  onClick={onClose}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliminarConvenio;
