import React, { useState, useEffect } from "react";
import "./Carousel.css";

const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Avanza automáticamente cada 4 segundos
  useEffect(() => {
    if (items.length < 2) return; // Si hay 0 ó 1 elemento, no hay nada que auto-rotar
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [items]);

  // Cambia al slide correspondiente al hacer clic en una miniatura
  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  // Lógica para "Más info"
  const handleMoreInfo = () => {
    const currentItem = items[currentIndex];
    window.location.href = `/talleres/${currentItem.id}`;
  };

  // Si no hay elementos, no renderiza nada
  if (!items || items.length === 0) return null;

  return (
    <div className="side-carousel">
      {/* Columna de miniaturas (thumbnails) */}
      <div className="thumbnail-container">
        {items.map((item, index) => (
          <img
            key={item.id}
            src={item.imagen}
            alt={item.titulo}
            onClick={() => handleThumbnailClick(index)}
            className={`thumbnail ${index === currentIndex ? "active" : ""}`}
          />
        ))}
      </div>

      {/* Área principal con imagen grande y texto */}
      <div className="main-display">
        <img
          key={items[currentIndex].id}
          src={items[currentIndex].imagen}
          alt={items[currentIndex].titulo}
          className="main-image"
        />
        <div className="info-overlay">
          <h2>{items[currentIndex].titulo}</h2>
          <p>{items[currentIndex].descripcion}</p>
          <button onClick={handleMoreInfo}>Más info</button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
