"use client";
import React from "react";
import SectionHeader from "../Common/SectionHeader";

const Dashboard = () => {
    return (
        <>
            {/* Dashboard Section */}
            <section id="dashboard" className="pb-12.5 pt-20 xs:pt-30 lg:pb-25 lg:pt-30 xl:pb-30 xl:pt-40">
                <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
                    {/* Header */}
                    <SectionHeader
                        headerInfo={{
                            title: "Estadísticas Generales",
                            subtitle: "Datos para toma de decisiones",
                            description: `Maneja los datos generales de este sitio para potenciar 
                                el alcance en la toma de decisiones e impactar positivamente en  
                                las personas afiliadas.`,
                        }}
                    />

                    {/* Layout Wrapper */}
                    <div className="mt-10 flex gap-6">
                        {/* Sidebar for navigation */}
                        <aside className="hidden lg:block w-1/4 bg-gray-100 p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Navegación</h3>
                            <ul className="space-y-4">
                                <li className="text-primary cursor-pointer">Visitas y Tráfico</li>
                                <li className="text-primary cursor-pointer">Interacciones</li>
                                <li className="text-primary cursor-pointer">Usuarios Afiliados</li>
                                <li className="text-primary cursor-pointer">Rendimiento de Contenidos</li>
                            </ul>
                        </aside>

                        {/* Main Dashboard Content */}
                        <div className="flex-1 grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-3 xl:gap-12.5">
                            {/* Statistic Cards */}
                            <div className="p-6 bg-white shadow-md rounded-lg">
                                <h4 className="text-lg font-semibold">Visitas Totales</h4>
                                <p className="mt-2 text-3xl font-bold text-primary">15,384</p>
                                <p className="text-sm text-gray-500">Mes actual</p>
                            </div>
                            <div className="p-6 bg-white shadow-md rounded-lg">
                                <h4 className="text-lg font-semibold">Interacciones</h4>
                                <p className="mt-2 text-3xl font-bold text-primary">4,285</p>
                                <p className="text-sm text-gray-500">Mes actual</p>
                            </div>
                            <div className="p-6 bg-white shadow-md rounded-lg">
                                <h4 className="text-lg font-semibold">Usuarios Afiliados</h4>
                                <p className="mt-2 text-3xl font-bold text-primary">2,145</p>
                                <p className="text-sm text-gray-500">Total</p>
                            </div>
                            <div className="p-6 bg-white shadow-md rounded-lg">
                                <h4 className="text-lg font-semibold">Contenido Popular</h4>
                                <p className="mt-2 text-lg text-gray-800">Convenio ABC</p>
                                <p className="text-sm text-gray-500">1,482 visitas</p>
                            </div>

                            {/* Chart Section */}
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 p-6 bg-white shadow-md rounded-lg">
                                <h4 className="text-lg font-semibold mb-4">Gráficos de Interacción</h4>
                                <div className="w-full h-64 bg-gray-100 flex justify-center items-center rounded-lg">
                                    {/* Aquí puedes integrar un componente de gráfico */}
                                    <p>Gráfico de Interacción (Integrar gráfico aquí)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Dashboard;
