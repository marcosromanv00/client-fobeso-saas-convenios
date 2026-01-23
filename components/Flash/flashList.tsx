import React from "react";
import FlashItem from "./FlashItem"; // Importa el componente que muestra cada tarjeta

interface FlashListProps {
  tarjetas: any[];
}

const FlashList: React.FC<FlashListProps> = ({ tarjetas }) => {
  return (
    <div className="p-10 grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-3 xl:gap-12.5">
      {tarjetas.map((tarjeta) => (
        <FlashItem key={tarjeta.oferta_id} tarjeta={tarjeta} />
      ))}
    </div>
  );
};

export default FlashList;
