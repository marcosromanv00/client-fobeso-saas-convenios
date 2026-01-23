import React from "react";
import SingleFeature from "./SingleFeature"; // Importa el componente que muestra cada tarjeta

interface FeatureListProps {
  tarjetas: any[]; // O mejor, usa un tipo específico en lugar de 'any[]'
}

const FeatureList: React.FC<FeatureListProps> = ({ tarjetas }) => {
  return (
    <div className="p-10 xs:p-4 sm:p-4 xs:pb-8 sm:pb-8 xs:px-6 sm:px-6 grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-3 xl:gap-12.5">
      {tarjetas.map((tarjeta) => (
        // Asegúrate de pasar 'tarjeta' y no 'feature'
        <SingleFeature key={tarjeta.convenio_id} tarjeta={tarjeta} />
      ))}
    </div>
  );
};

export default FeatureList;
