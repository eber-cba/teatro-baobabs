import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Carousel.css";

// Registramos los plugins necesarios
gsap.registerPlugin(ScrollTrigger);

const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const mainImageRef = useRef(null);
  const infoOverlayRef = useRef(null);
  const intervalRef = useRef(null);
  const tl = useRef(null);
  const backgroundRef = useRef(null);
  const turbulenceRef = useRef(null);
  const blobPathRef = useRef(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const bubblesRef = useRef([]);
  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const progressRef = useRef(null);
  const svgShapesRef = useRef([]);

  // Función para crear burbujas dinámicas con mejor rendimiento
  const createBubbles = () => {
    const container = containerRef.current;
    if (!container) return;

    // Limpiar burbujas existentes
    bubblesRef.current.forEach((bubble) => {
      if (bubble.element && bubble.element.parentNode) {
        bubble.element.parentNode.removeChild(bubble.element);
      }
    });
    bubblesRef.current = [];

    // Crear nuevas burbujas
    const count = Math.floor(window.innerWidth / 80); // Optimizamos cantidad para mejor rendimiento
    for (let i = 0; i < count; i++) {
      const bubble = document.createElement("div");
      bubble.className = "animated-bubble";
      const size = Math.random() * 80 + 40;

      // Configurar estilos de burbuja con colores del tema
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.top = `${Math.random() * 100}%`;
      bubble.style.background =
        Math.random() > 0.5
          ? `rgba(47, 185, 121, ${Math.random() * 0.2 + 0.1})`
          : `rgba(230, 114, 174, ${Math.random() * 0.2 + 0.1})`;
      bubble.style.borderRadius = "50%";
      bubble.style.position = "absolute";
      bubble.style.filter = "blur(10px)";

      container.appendChild(bubble);

      // Animación más compleja con varios puntos de control
      const timeline = gsap.timeline({
        repeat: -1,
        yoyo: true,
        repeatDelay: Math.random() * 2,
      });

      // Animación con múltiples waypoints para movimiento más orgánico
      timeline
        .to(bubble, {
          x: Math.random() * 200 - 100,
          y: Math.random() * 100 - 50,
          scale: Math.random() * 0.3 + 0.9,
          duration: Math.random() * 8 + 10,
          ease: "sine.inOut",
        })
        .to(bubble, {
          x: Math.random() * 150 - 75,
          y: Math.random() * -100,
          scale: Math.random() * 0.3 + 0.7,
          duration: Math.random() * 5 + 8,
          ease: "power2.inOut",
        })
        .to(bubble, {
          x: Math.random() * -150,
          y: Math.random() * 150 - 75,
          scale: Math.random() * 0.3 + 0.8,
          duration: Math.random() * 7 + 7,
          ease: "power1.inOut",
        });

      bubblesRef.current.push({ element: bubble, timeline });
    }
  };

  // Animaciones principales mejoradas
  const animateSlide = () => {
    if (tl.current) tl.current.kill();

    tl.current = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    // Animación de la imagen principal con efectos de profundidad
    tl.current.fromTo(
      mainImageRef.current,
      {
        opacity: 0,
        scale: 1.1,
        filter: "brightness(0.7) blur(10px)",
      },
      {
        opacity: 1,
        scale: 1,
        filter: "brightness(1) blur(0px)",
        duration: 1.5,
        ease: "power3.out",
      },
    );

    // Animación mejorada de información con stagger y efectos 3D
    tl.current.fromTo(
      infoOverlayRef.current.querySelectorAll(
        ".title, .description, .more-info-btn",
      ),
      {
        y: 80,
        opacity: 0,
        rotationX: 10,
        transformOrigin: "bottom",
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 1,
        stagger: 0.15,
        ease: "back.out(1.7)",
      },
      "-=1",
    );

    // Efectos de destello en la transición
    const flashEffect = document.createElement("div");
    flashEffect.style.position = "absolute";
    flashEffect.style.top = "0";
    flashEffect.style.left = "0";
    flashEffect.style.width = "100%";
    flashEffect.style.height = "100%";
    flashEffect.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    flashEffect.style.pointerEvents = "none";
    flashEffect.style.zIndex = "5";

    mainImageRef.current.parentNode.appendChild(flashEffect);

    gsap.to(flashEffect, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        if (flashEffect.parentNode) {
          flashEffect.parentNode.removeChild(flashEffect);
        }
      },
    });
  };

  // Autoplay mejorado con pausas inteligentes
  const startAutoPlay = () => {
    if (items.length < 2) return;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000); // Tiempo aumentado para mejor visualización

    // Reiniciar la barra de progreso con cada cambio
    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { width: "0%" },
        { width: "100%", duration: 8, ease: "linear" },
      );
    }
  };

  // Inicializar efectos mejorados
  useEffect(() => {
    createBubbles();

    // Efecto de fluido más complejo con SVG
    const turbTimeline = gsap.timeline({ repeat: -1 });
    turbTimeline.to(turbulenceRef.current, {
      duration: 20,
      attr: { baseFrequency: "0.01 0.02" },
      ease: "sine.inOut",
      repeat: 1,
      yoyo: true,
    });

    // Animación para el blob SVG - usando transformaciones en lugar de morphSVG
    if (blobPathRef.current) {
      gsap.to(blobPathRef.current, {
        rotation: 360,
        scale: 1.05,
        x: 10,
        y: -10,
        duration: 30,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "center center",
      });

      // Animación secundaria para crear efecto de pulsación
      gsap.to(blobPathRef.current, {
        scale: 0.95,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 5,
      });
    }

    // Fondo más definido y con colores más sólidos
    gsap.to(backgroundRef.current, {
      duration: 15,
      background: `linear-gradient(135deg, 
        rgba(47, 185, 121, 1), 
        rgba(230, 114, 174, 1))`,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Asegurar que el fondo cubra todo el contenedor
    backgroundRef.current.style.backgroundSize = "100% 100%";
    backgroundRef.current.style.backgroundPosition = "center";

    // Reducir la cantidad de formas geométricas animadas
    const shapeCount = 5;
    for (let i = 0; i < shapeCount; i++) {
      const shape = document.createElement("div");
      shape.className = "animated-shape";
      shape.style.position = "absolute";
      shape.style.width = `${Math.random() * 80 + 50}px`;
      shape.style.height = `${Math.random() * 80 + 50}px`;
      shape.style.background =
        Math.random() > 0.5
          ? "rgba(47, 185, 121, 0.5)"
          : "rgba(230, 114, 174, 0.5)";
      shape.style.borderRadius = Math.random() > 0.5 ? "50%" : "30%";
      shape.style.left = `${Math.random() * 100}%`;
      shape.style.top = `${Math.random() * 100}%`;
      shape.style.filter = "blur(8px)";
      backgroundRef.current.appendChild(shape);

      gsap.to(shape, {
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        rotation: Math.random() * 180,
        duration: Math.random() * 20 + 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Animación para las formas SVG
    if (svgShapesRef.current.length > 0) {
      svgShapesRef.current.forEach((shape, index) => {
        gsap.to(shape, {
          x: Math.random() * 50 - 25,
          y: Math.random() * 50 - 25,
          rotation: Math.random() * 30 - 15,
          scale: 0.9 + Math.random() * 0.4,
          duration: 15 + index * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }

    // Rastrear posición del ratón para efectos interactivos mejorados
    const updateMousePosition = (e) => {
      mousePos.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };

      // Mover el gradiente según la posición del ratón con efecto de suavizado
      gsap.to(backgroundRef.current, {
        duration: 1.5,
        backgroundPosition: `${mousePos.current.x * 40}% ${mousePos.current.y * 40}%`,
        ease: "power2.out",
      });

      // Efecto 3D de parallax en el carrusel
      if (carouselRef.current) {
        gsap.to(carouselRef.current, {
          rotationY: (mousePos.current.x - 0.5) * 5,
          rotationX: (mousePos.current.y - 0.5) * -5,
          transformPerspective: 1000,
          transformOrigin: "center center",
          duration: 1,
          ease: "power2.out",
        });
      }

      // Interacción con las burbujas mejorada
      bubblesRef.current.forEach(({ element }) => {
        const rect = element.getBoundingClientRect();
        const bubbleX = rect.left + rect.width / 2;
        const bubbleY = rect.top + rect.height / 2;

        const deltaX = e.clientX - bubbleX;
        const deltaY = e.clientY - bubbleY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < 350) {
          const pushForce = (1 - distance / 350) * 70;
          const angleX = deltaX / distance;
          const angleY = deltaY / distance;

          gsap.to(element, {
            x: `-=${angleX * pushForce}`,
            y: `-=${angleY * pushForce}`,
            scale: 1.1,
            duration: 1.5,
            ease: "elastic.out(1, 0.3)",
            overwrite: "auto",
          });
        }
      });
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("resize", createBubbles);

    // Scroll effects
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => {
        gsap.to(containerRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        });
      },
      onEnterBack: () => {
        gsap.to(containerRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        });
      },
      onLeave: () => {
        gsap.to(containerRef.current, {
          opacity: 0.7,
          y: 50,
          duration: 1,
          ease: "power2.in",
        });
      },
      onLeaveBack: () => {
        gsap.to(containerRef.current, {
          opacity: 0.7,
          y: -50,
          duration: 1,
          ease: "power2.in",
        });
      },
    });

    // Establecer la opacidad inicial
    gsap.set(containerRef.current, { opacity: 0, y: 50 });
    gsap.to(containerRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.5,
      ease: "power2.out",
    });

    return () => {
      turbTimeline.kill();
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("resize", createBubbles);
      bubblesRef.current.forEach(({ timeline }) => timeline.kill());
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Efectos principales
  useEffect(() => {
    animateSlide();
    startAutoPlay();
    return () => {
      clearInterval(intervalRef.current);
      tl.current?.kill();
    };
  }, [currentIndex]);

  // Título con animación más sofisticada
  useEffect(() => {
    const titleRef = document.querySelector(".carousel-title");
    const titleChars = titleRef.querySelectorAll(".char");

    // Animación de letras individuales para un efecto más dramático
    gsap.fromTo(
      titleChars,
      {
        opacity: 0,
        y: -100,
        rotationX: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "back.out(1.7)",
      },
    );

    // Añadir efecto de brillo continuo
    gsap.to(titleRef, {
      duration: 2,
      backgroundPosition: "200% center",
      repeat: -1,
      ease: "none",
    });
  }, []);

  const handleThumbnailClick = (index) => {
    if (index === currentIndex) return;

    clearInterval(intervalRef.current);

    // Efecto de transición avanzado
    gsap.to(mainImageRef.current, {
      scale: 1.05,
      filter: "brightness(0.8) blur(5px)",
      duration: 0.3,
      onComplete: () => {
        setCurrentIndex(index);
      },
    });

    // Actualizar la barra de progreso
    if (progressRef.current) {
      gsap.killTweensOf(progressRef.current);
    }
  };

  const handleMoreInfo = () => {
    const currentItem = items[currentIndex];

    // Animación al salir
    gsap.to(containerRef.current, {
      opacity: 0.8,
      scale: 0.95,
      duration: 0.5,
      onComplete: () => {
        window.location.href = `/talleres/${currentItem.id}`;
      },
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="modern-carousel-container" ref={containerRef}>
      <h2
        className="carousel-title"
        style={{
          fontSize: "6rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "2rem",
          fontFamily: "FuturaBold, sans-serif",
          background: `linear-gradient(to right, #2fb979, #e672ae, #2fb979)`,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          display: "inline-block",
          position: "relative",
          padding: "0.5rem 2rem",
          marginTop: "1rem",
          filter: "drop-shadow(0 0 5px rgba(0, 0, 0, 0.3))",
        }}
      >
        <span className="char">T</span>
        <span className="char">a</span>
        <span className="char">l</span>
        <span className="char">l</span>
        <span className="char">e</span>
        <span className="char">r</span>
        <span className="char">e</span>
        <span className="char">s</span>
      </h2>

      <div
        ref={backgroundRef}
        className="dynamic-background"
        style={{
          position: "relative",
          width: "100%",
          height: "400px",
          overflow: "hidden",
          borderRadius: "20px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.5,
          }}
        >
          <defs>
            <filter id="fluid">
              <feTurbulence
                ref={turbulenceRef}
                type="fractalNoise"
                baseFrequency="0.01 0.02"
                numOctaves="3"
                result="turbulence"
              />
              <feDisplacementMap
                in2="turbulence"
                in="SourceGraphic"
                scale="15"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            <radialGradient
              id="bubble-gradient"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" stopColor="rgba(230, 114, 174, 0.9)" />
              <stop offset="70%" stopColor="rgba(47, 185, 121, 0.7)" />
              <stop offset="100%" stopColor="rgba(47, 185, 121, 0.4)" />
            </radialGradient>

            <filter id="glow-effect">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <linearGradient
              id="neon-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#2fb979" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#e672ae" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#2fb979" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Formas orgánicas animadas */}
          <g filter="url(#fluid)">
            <path
              ref={(el) => (blobPathRef.current = el)}
              d="M446.7,261.5c19.4,54.8-7.4,123.5-51.2,162.6c-43.8,39.1-104.6,48.6-156.7,30.5c-52.1-18.1-95.5-64-106.9-123.6 C120.5,271.4,141.3,198,185.2,158.5c43.9-39.5,111.1-45,165.3-16.8C404.7,169.9,427.3,206.7,446.7,261.5z"
              fill="url(#neon-gradient)"
              opacity="0.6"
              filter="url(#glow-effect)"
            />
            <circle
              ref={(el) => (svgShapesRef.current[0] = el)}
              cx="30%"
              cy="30%"
              r="100"
              fill="rgba(47, 185, 121, 0.4)"
              filter="url(#glow-effect)"
            />
            <circle
              ref={(el) => (svgShapesRef.current[1] = el)}
              cx="70%"
              cy="60%"
              r="120"
              fill="rgba(230, 114, 174, 0.4)"
              filter="url(#glow-effect)"
            />
            <circle
              ref={(el) => (svgShapesRef.current[2] = el)}
              cx="20%"
              cy="70%"
              r="80"
              fill="rgba(47, 185, 121, 0.3)"
            />
            <circle
              ref={(el) => (svgShapesRef.current[3] = el)}
              cx="80%"
              cy="20%"
              r="90"
              fill="rgba(230, 114, 174, 0.3)"
            />
          </g>
        </svg>
      </div>

      <div className="modern-carousel" ref={carouselRef}>
        <div className="main-display">
          <img
            ref={mainImageRef}
            src={items[currentIndex].imagen}
            alt={items[currentIndex].titulo}
            className="main-image"
          />

          <div ref={infoOverlayRef} className="info-overlay">
            <h2 className="title">{items[currentIndex].titulo}</h2>
            <p className="description">{items[currentIndex].descripcion}</p>
            <button onClick={handleMoreInfo} className="more-info-btn">
              Más info
              <span className="hover-effect"></span>
            </button>
          </div>
        </div>

        <div className="thumbnails-container">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`thumbnail-item ${index === currentIndex ? "active" : ""}`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={item.imagen}
                alt={item.titulo}
                className="thumbnail-image"
              />
              <div className="thumbnail-overlay"></div>
            </div>
          ))}
        </div>

        <div className="progress-bar">
          <div
            ref={progressRef}
            className="progress-fill"
            key={currentIndex}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
