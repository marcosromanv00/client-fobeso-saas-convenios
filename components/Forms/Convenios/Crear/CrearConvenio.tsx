"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  FiSearch,
  FiCheck,
  FiChevronRight,
  FiChevronLeft,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import clsx from "clsx";

// --- Tipos ---
type Empresa = {
  EMPRESA_ID: number;
  NOMBRE: string;
  LOGO_URL: string;
  SITIO_WEB?: string;
  FACEBOOK?: string;
  INSTAGRAM?: string;
  TWITTER?: string;
  LINKEDIN?: string;
};

type Categoria = {
  CATEGORIA_ID: number;
  NOMBRE: string;
};

// --- API Helpers ---
const fetchCategorias = async (): Promise<Categoria[]> => {
  const response = await fetch("/api/convenios/categorias");
  if (!response.ok) throw new Error("Error al obtener las categorías");
  const data = await response.json();
  return Array.isArray(data) ? data : data.rows || [];
};

const fetchEmpresas = async (): Promise<Empresa[]> => {
  const response = await fetch("/api/crud/empresas");
  if (!response.ok) throw new Error("Error al obtener las empresas");
  return await response.json();
};

const createEmpresa = async (empresaData: any) => {
  const response = await fetch("/api/crud/empresas", {
    method: "POST",
    body: JSON.stringify(empresaData),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Error al crear la empresa");
  return await response.json();
};

const createConvenio = async (convenioData: any) => {
  const response = await fetch("/api/crud/convenios", {
    method: "POST",
    body: JSON.stringify(convenioData),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Error al crear el convenio");
  return await response.json();
};

const createSucursal = async (sucursalData: any) => {
  const response = await fetch("/api/crud/sucursales", {
    method: "POST",
    body: JSON.stringify(sucursalData),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Error al crear la sucursal");
  return await response.json();
};

// --- Componente Principal ---
const CrearConvenio = ({ onClose }: { onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Estados del Wizard
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [loading, setLoading] = useState(false);

  // Datos Globales
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [empresasExistentes, setEmpresasExistentes] = useState<Empresa[]>([]);
  const [empresaSearch, setEmpresaSearch] = useState("");
  const [filteredEmpresas, setFilteredEmpresas] = useState<Empresa[]>([]);
  const [empresaMode, setEmpresaMode] = useState<"new" | "existing">(
    "existing",
  );
  const [uploading, setUploading] = useState(false);

  // Datos de Formularios
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(
    null,
  );

  const [empresaData, setEmpresaData] = useState({
    empresaNombre: "",
    logoUrl: "",
    sitio_web: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
  });

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

  // --- Efectos e Inicialización ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, emps] = await Promise.all([
          fetchCategorias(),
          fetchEmpresas(),
        ]);
        setCategorias(cats);
        setEmpresasExistentes(emps);
        setFilteredEmpresas(emps);
      } catch (e: any) {
        toast.error("Error cargando datos iniciales: " + e.message);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    // Filtro de empresas
    if (empresaSearch.trim() === "") {
      setFilteredEmpresas(empresasExistentes);
    } else {
      setFilteredEmpresas(
        empresasExistentes.filter((e) =>
          e.NOMBRE.toLowerCase().includes(empresaSearch.toLowerCase()),
        ),
      );
    }
  }, [empresaSearch, empresasExistentes]);

  // Cerrar al hacer click fuera
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // --- Handlers ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files?.length) return;

      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Error subiendo imagen");

      const data = await response.json();
      setEmpresaData((prev) => ({ ...prev, logoUrl: data.url }));
      toast.success("Logo subido correctamente");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const validateStep1 = () => {
    if (empresaMode === "existing") {
      if (!selectedEmpresaId) {
        toast.error("Selecciona una empresa existente o crea una nueva");
        return false;
      }
    } else {
      if (!empresaData.empresaNombre) {
        toast.error("El nombre de la empresa es obligatorio");
        return false;
      }
    }
    return true;
  };

  const validateStep2 = () => {
    if (!convenioData.titulo || !convenioData.categoria_id) {
      toast.error("Título y Categoría son obligatorios");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!sucursalData.direccion) {
      toast.error("La dirección es obligatoria");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setLoading(true);
    const notification = toast.loading("Guardando datos...");

    try {
      let finalEmpresaId = selectedEmpresaId;

      // 1. Crear Empresa si es nueva
      if (empresaMode === "new") {
        const empresaRes = await createEmpresa({
          nombre: empresaData.empresaNombre,
          logoUrl: empresaData.logoUrl,
          sitio_web: empresaData.sitio_web,
          facebook: empresaData.facebook,
          instagram: empresaData.instagram,
          twitter: empresaData.twitter,
          linkedin: empresaData.linkedin,
        });
        finalEmpresaId = empresaRes.EMPRESA_ID;
      }

      if (!finalEmpresaId) throw new Error("ID de empresa no válido");

      // 2. Crear Convenio
      await createConvenio({
        empresaId: finalEmpresaId,
        categoriaId: convenioData.categoria_id,
        titulo: convenioData.titulo,
        fechaInicio: convenioData.fechaInicio,
        fechaFin: convenioData.fechaFin,
        condiciones: convenioData.condiciones,
      });

      // 3. Crear Sucursal
      await createSucursal({
        empresaId: finalEmpresaId,
        direccion: sucursalData.direccion,
        telefono: sucursalData.telefono,
        correoContacto: sucursalData.correo_contacto,
        ciudad: sucursalData.ciudad,
      });

      toast.success("¡Convenio creado exitosamente!", { id: notification });
      onClose();
      // Opcional: recargar solo los datos necesarios en lugar de reload completo
      window.location.reload();
    } catch (error: any) {
      toast.error("Error: " + error.message, { id: notification });
    } finally {
      setLoading(false);
    }
  };

  // --- Render Steps ---

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="mx-auto flex w-fit gap-4 rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-black">
        <button
          onClick={() => setEmpresaMode("existing")}
          className={clsx(
            "rounded-md px-4 py-2 text-sm font-medium transition-all",
            empresaMode === "existing"
              ? "bg-white text-blue-600 shadow-sm dark:bg-gray-800"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400",
          )}
        >
          Empresa Existente
        </button>
        <button
          onClick={() => {
            setEmpresaMode("new");
            setSelectedEmpresaId(null);
          }}
          className={clsx(
            "rounded-md px-4 py-2 text-sm font-medium transition-all",
            empresaMode === "new"
              ? "bg-white text-blue-600 shadow-sm dark:bg-gray-800"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400",
          )}
        >
          Nueva Empresa
        </button>
      </div>

      {empresaMode === "existing" ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4 duration-300">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar empresa por nombre..."
              value={empresaSearch}
              onChange={(e) => setEmpresaSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700"
            />
          </div>
          <div className="custom-scrollbar max-h-60 space-y-2 overflow-y-auto pr-2">
            {filteredEmpresas.map((emp) => (
              <div
                key={emp.EMPRESA_ID}
                onClick={() => setSelectedEmpresaId(emp.EMPRESA_ID)}
                className={clsx(
                  "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                  selectedEmpresaId === emp.EMPRESA_ID
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-800",
                )}
              >
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                  {emp.LOGO_URL ? (
                    <Image
                      src={emp.LOGO_URL}
                      alt={emp.NOMBRE}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                      N/A
                    </div>
                  )}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {emp.NOMBRE}
                </span>
                {selectedEmpresaId === emp.EMPRESA_ID && (
                  <FiCheck className="ml-auto text-blue-500" />
                )}
              </div>
            ))}
            {filteredEmpresas.length === 0 && (
              <p className="py-4 text-center text-gray-500">
                No se encontraron empresas.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4 duration-300">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Nombre de la Empresa *
            </label>
            <input
              value={empresaData.empresaNombre}
              onChange={(e) =>
                setEmpresaData({
                  ...empresaData,
                  empresaNombre: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700"
              placeholder="Ej. Restaurante Sabor Latino"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Logo Upload */}
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1 block text-sm font-medium">Logo</label>
              <div className="flex items-center gap-4">
                <div className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  {empresaData.logoUrl ? (
                    <Image
                      src={empresaData.logoUrl}
                      alt="Logo"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <FiUploadCloud className="text-xl text-gray-400" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    disabled={uploading}
                  />
                </div>
                {uploading && (
                  <span className="text-xs text-blue-500">Subiendo...</span>
                )}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1 block text-sm font-medium">
                Sitio Web
              </label>
              <input
                value={empresaData.sitio_web}
                onChange={(e) =>
                  setEmpresaData({ ...empresaData, sitio_web: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700"
                placeholder="https://"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {["facebook", "instagram", "twitter", "linkedin"].map((social) => (
              <div key={social}>
                <label className="mb-1 block text-sm font-medium capitalize">
                  {social}
                </label>
                <input
                  value={(empresaData as any)[social]}
                  onChange={(e) =>
                    setEmpresaData({ ...empresaData, [social]: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700"
                  placeholder="URL perfil"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-in fade-in slide-in-from-right-4 space-y-4 duration-300">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Título del Convenio *
        </label>
        <input
          value={convenioData.titulo}
          onChange={(e) =>
            setConvenioData({ ...convenioData, titulo: e.target.value })
          }
          className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700"
          placeholder="Ej. 20% de Descuento en Consumo"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Categoría *</label>
        <select
          value={convenioData.categoria_id}
          onChange={(e) =>
            setConvenioData({ ...convenioData, categoria_id: e.target.value })
          }
          className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700"
        >
          <option value="">Seleccionar...</option>
          {categorias.map((c) => (
            <option key={c.CATEGORIA_ID} value={c.CATEGORIA_ID}>
              {c.NOMBRE}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Inicio</label>
          <input
            type="date"
            value={convenioData.fechaInicio.toISOString().split("T")[0]}
            onChange={(e) =>
              setConvenioData({
                ...convenioData,
                fechaInicio: new Date(e.target.value),
              })
            }
            className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Fin</label>
          <input
            type="date"
            value={convenioData.fechaFin.toISOString().split("T")[0]}
            onChange={(e) =>
              setConvenioData({
                ...convenioData,
                fechaFin: new Date(e.target.value),
              })
            }
            className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Condiciones</label>
        <textarea
          value={convenioData.condiciones}
          onChange={(e) =>
            setConvenioData({ ...convenioData, condiciones: e.target.value })
          }
          className="h-24 w-full resize-none rounded-lg border border-gray-200 bg-transparent px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700"
          placeholder="Detalles y restricciones..."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-in fade-in slide-in-from-right-4 space-y-4 duration-300">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Dirección Principal *
        </label>
        <input
          value={sucursalData.direccion}
          onChange={(e) =>
            setSucursalData({ ...sucursalData, direccion: e.target.value })
          }
          className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700"
          placeholder="Av. Principal #123"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Ciudad</label>
          <input
            value={sucursalData.ciudad}
            onChange={(e) =>
              setSucursalData({ ...sucursalData, ciudad: e.target.value })
            }
            className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Teléfono</label>
          <input
            value={sucursalData.telefono}
            onChange={(e) =>
              setSucursalData({ ...sucursalData, telefono: e.target.value })
            }
            className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Email de Contacto
        </label>
        <input
          value={sucursalData.correo_contacto}
          onChange={(e) =>
            setSucursalData({
              ...sucursalData,
              correo_contacto: e.target.value,
            })
          }
          className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700"
          placeholder="contacto@empresa.com"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:border dark:border-white/10 dark:bg-black/90"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white/50 p-6 dark:border-white/10 dark:bg-transparent">
          <div>
            <h2 className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-xl font-bold text-transparent">
              {step === 1
                ? "Seleccionar Empresa"
                : step === 2
                  ? "Detalles del Convenio"
                  : "Registrar Sucursal"}
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Paso {step} de {totalSteps}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <FiX className="text-xl text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="custom-scrollbar flex-1 overflow-y-auto scroll-smooth p-6">
          <AnimatePresence mode="wait">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 p-6 dark:border-white/10 dark:bg-white/5">
          <button
            onClick={prevStep}
            disabled={step === 1 || loading}
            className={clsx(
              "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
              step === 1
                ? "pointer-events-none opacity-0"
                : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10",
            )}
          >
            <FiChevronLeft /> Atrás
          </button>

          <button
            onClick={step === totalSteps ? handleSubmit : nextStep}
            disabled={loading}
            className={clsx(
              "flex transform items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all active:scale-95",
              loading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700",
            )}
          >
            {loading
              ? "Procesando..."
              : step === totalSteps
                ? "Finalizar"
                : "Siguiente"}
            {!loading && step !== totalSteps && <FiChevronRight />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CrearConvenio;
