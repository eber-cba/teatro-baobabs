// Modal.jsx
import React, { useState, useEffect } from "react";
import "./Modal.css"; // Puedes usar este archivo para ajustes adicionales

const Modal = ({ images }) => {
  const [modalVisible, setModalVisible] = useState(false);
  // Iniciamos currentImage con src en null para evitar <img src="">
  const [currentImage, setCurrentImage] = useState({ src: null, alt: "" });

  useEffect(() => {
    const handleOpenModal = (e) => {
      const { index } = e.detail;
      console.log("Abrir modal para el índice:", index);
      if (images && images[index]) {
        setCurrentImage({
          src: images[index].imagen, // Asegúrate de que coincida con tu JSON
          alt: images[index].titulo,
        });
        setModalVisible(true);
      } else {
        console.error("No se encontró la imagen en el índice:", index);
      }
    };

    window.addEventListener("open-modal", handleOpenModal);

    return () => {
      window.removeEventListener("open-modal", handleOpenModal);
    };
  }, [images]);

  if (!modalVisible) return null;

  return (
    <dialog open id="modal" className="modal-dialog">
      <button
        id="closeModal"
        className="close-button"
        onClick={() => setModalVisible(false)}
      >
        Cerrar
      </button>
      <div className="modal-content">
        {currentImage.src && (
          <img
            id="modalImage"
            src={currentImage.src}
            alt={currentImage.alt}
            className="modal-image"
          />
        )}
      </div>
    </dialog>
  );
};

export default Modal;
