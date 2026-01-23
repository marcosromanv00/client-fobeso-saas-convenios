import React from "react";

interface FilterCategoryProps {
  setSelectedCategory: (category: string | null) => void;
  categories: string[];  // Nueva prop para recibir categorías
}

const FilterCategory: React.FC<FilterCategoryProps> = ({ setSelectedCategory, categories }) => {
  return (
    <div className="bg-transparent text-black dark:text-white p-5 xs:p-2 sm:p-2 rounded-lg flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4 xs:mb-1 sm:mb-1">Categoría</h3>
      <select
        onChange={(e) => setSelectedCategory(e.target.value || null)}
        className="bg-gray-800 text-yellow-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300"
      >
        <option value="" className="text-yellow-300 bg-gray-800">
          Todas
        </option>
        {categories.map((category) => (
          <option
            key={category}
            value={category}
            className="text-white bg-black hover:bg-yellow-400 hover:text-black"
          >
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterCategory;
