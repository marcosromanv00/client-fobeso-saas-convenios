import React, { useEffect, useState } from "react";

interface FilterLocationProps {
  setSelectedLocation: (location: string | null) => void;
  locations: string[];
}

const FilterLocation: React.FC<FilterLocationProps> = ({ setSelectedLocation, locations }) => {
  return (
    <div className="bg-transparent text-black dark:text-white p-5 xs:p-2 sm:p-2  rounded-lg flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4 xs:mb-1 sm:mb-1 ">Filtrar por Ubicación</h3>

      {/* ComboBox de ubicaciones */}
      <select
        onChange={(e) => setSelectedLocation(e.target.value || null)}
        className="bg-gray-800 text-yellow-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300"
      >
        {/* Opción "Todas" */}
        <option value="" className="text-yellow-300 bg-gray-800">
          Todas
        </option>

        {/* Opciones de ubicación */}
        {locations.map((location) => (
          <option
            key={location}
            value={location}
            className="text-white bg-black hover:bg-yellow-400 hover:text-black"
          >
            {location}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterLocation;
