import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./Hero.css";

const Hero = () => {
  const svgRef = useRef(null);
  const contentRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "/image/home/JMS_7918-Mejorado-NR.jpg",
    "/image/home/JMS_7879-Mejorado-NR.jpg",
    "/image/home/JMS_7784-Mejorado-NR.jpg",
    "/image/home/JMS_7778-Mejorado-NR.jpg",
  ];

  useEffect(() => {
    // Animación SVG
    const paths = svgRef.current.querySelectorAll("path");
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    });

    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.inOut",
      stagger: 0.5,
      delay: 0.5,
    });

    // Animación del contenido
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power2.out", delay: 1 },
    );

    // Carrusel de imágenes
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;

        // Animación de transición entre imágenes
        gsap.to(`.hero-image-${prevIndex}`, {
          opacity: 0,
          duration: 1.5,
          ease: "power2.inOut",
        });

        gsap.to(`.hero-image-${nextIndex}`, {
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut",
        });

        return nextIndex;
      });
    }, 5000); // Cambiar imagen cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      {/* Carrusel de imágenes de fondo */}
      <div className="hero-images-container">
        {images.map((image, index) => (
          <div
            key={image}
            className={`hero-background-image hero-image-${index}`}
            style={{
              backgroundImage: `url(${image})`,
              opacity: index === 0 ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* Fondo animado con partículas */}
      <div className="hero-background">
        <div className="hero-particles">
          <div className="particle particle1"></div>
          <div className="particle particle2"></div>
          <div className="particle particle3"></div>
          <div className="particle particle4"></div>
          <div className="particle particle5"></div>
          <div className="particle particle6"></div>
          <div className="particle particle7"></div>
          <div className="particle particle8"></div>
          <div className="particle particle9"></div>
          <div className="particle particle10"></div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="hero-content" ref={contentRef}>
        <h1 className="hero-title">Baobabs</h1>
        <p className="hero-subtitle">El teatro que transforma emociones</p>
        <svg
          ref={svgRef}
          className="hero-svg"
          width="500"
          height="250"
          viewBox="0 0 300 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 75 Q150 10 280 75"
            stroke="#2fb979"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M20 95 Q150 30 280 95"
            stroke="#e672ae"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M20 115 Q150 50 280 115"
            stroke="#2fb979"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
