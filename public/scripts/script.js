document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll(".carousel-item video");

  videos.forEach(video => {
    // Crear <a> estilizado debajo del vídeo original
    const originalLink = document.createElement("a");
    originalLink.href = video.dataset.link || "#";
    originalLink.textContent = "Visitar página";
    originalLink.target = originalLink.href === "#" ? "_self" : "_blank";
    Object.assign(originalLink.style, {
      display: "inline-block",
      marginTop: "8px",
      padding: "8px 14px",
      background: "rgba(100,100,100,0.9)",
      color: "#fff",
      textDecoration: "none",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "background 150ms ease, transform 120ms ease",
      userSelect: "none"
    });
    // Hover effect (inline via events para compatibilidad)
    originalLink.addEventListener("mouseenter", () => {
      originalLink.style.background = "rgba(120,120,120,1)";
      originalLink.style.transform = "translateY(-1px)";
    });
    originalLink.addEventListener("mouseleave", () => {
      originalLink.style.background = "rgba(100,100,100,0.9)";
      originalLink.style.transform = "none";
    });
    // Evitar que el click en el enlace dispare el click del vídeo (si el enlace está encima)
    originalLink.addEventListener("click", (e) => {
      e.stopPropagation();
      // Si href es "#", evitar navegación real
      if (originalLink.href.endsWith("#")) e.preventDefault();
    });

    // Insertar el enlace justo después del vídeo en el DOM
    if (video.parentNode) {
      video.parentNode.insertBefore(originalLink, video.nextSibling);
    }

    video.addEventListener("click", function () {
      // Crear modal flotante
      const modal = document.createElement("div");
      Object.assign(modal.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "9999",
        padding: "20px",
        boxSizing: "border-box"
      });

      // Contenedor para video + enlace (columna)
      const container = document.createElement("div");
      Object.assign(container.style, {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        maxWidth: "95vw",
        boxSizing: "border-box"
      });

      // Crear botón de cierre
      const closeBtn = document.createElement("span");
      closeBtn.textContent = "×";
      Object.assign(closeBtn.style, {
        position: "absolute",
        top: "20px",
        right: "30px",
        fontSize: "40px",
        color: "white",
        cursor: "pointer",
        zIndex: "10000",
        userSelect: "none"
      });

      // Clonar video
      const clone = document.createElement("video");
      const source = video.querySelector("source");
      clone.src = source ? source.src : video.src;
      clone.autoplay = true;
      clone.muted = true;
      clone.loop = true;
      clone.playsInline = true;
      clone.removeAttribute("controls");
      clone.style.display = "block";
      clone.style.borderRadius = "16px";
      clone.style.boxShadow = "0 0 40px rgba(0,0,0,0.7)";
      clone.style.background = "#000";
      clone.style.pointerEvents = "none"; // evitar interacción directa con el vídeo

      // Crear <a> estilizado para el modal (se basa en data-link del vídeo original)
      const modalLink = document.createElement("a");
      modalLink.href = video.dataset.link || "#";
      modalLink.textContent = "Visitar página";
      modalLink.target = modalLink.href === "#" ? "_self" : "_blank";
      Object.assign(modalLink.style, {
        display: "inline-block",
        padding: "10px 18px",
        background: "rgba(100,100,100,0.95)",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "16px",
        transition: "background 150ms ease, transform 120ms ease",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        userSelect: "none"
      });
      modalLink.addEventListener("mouseenter", () => {
        modalLink.style.background = "rgba(130,130,130,1)";
        modalLink.style.transform = "translateY(-2px)";
      });
      modalLink.addEventListener("mouseleave", () => {
        modalLink.style.background = "rgba(100,100,100,0.95)";
        modalLink.style.transform = "none";
      });
      modalLink.addEventListener("click", (e) => {
        e.stopPropagation();
        if (modalLink.href.endsWith("#")) e.preventDefault();
      });

      // Función para aplicar estilos según relación de aspecto
      function applySizing() {
        const vw = video.videoWidth || video.clientWidth || 1;
        const vh = video.videoHeight || video.clientHeight || 1;
        const aspect = vw / vh;

        if (aspect < 1) {
          // Vertical (móvil)
          clone.style.width = "auto";
          clone.style.height = "80vh";
          clone.style.maxHeight = "900px";
          clone.style.maxWidth = "420px";
          clone.style.objectFit = "contain";
        } else {
          // Horizontal
          clone.style.width = "95vw";
          clone.style.maxWidth = "1000px";
          clone.style.height = "auto";
          clone.style.objectFit = "contain";
        }
      }

      applySizing();
      if (!video.videoWidth || !video.videoHeight) {
        video.addEventListener("loadedmetadata", applySizing, { once: true });
      }

      // Insertar elementos en el modal
      container.appendChild(clone);
      container.appendChild(modalLink);
      modal.appendChild(closeBtn);
      modal.appendChild(container);
      document.body.appendChild(modal);

      // Reproducir el clon (manejo de promesas)
      const playPromise = clone.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {
          clone.muted = true;
          clone.play().catch(() => {});
        });
      }

      // Ajustar posición del enlace si la ventana cambia de tamaño (mantener centrado)
      function onResize() {
        applySizing();
      }
      window.addEventListener("resize", onResize);

      // Limpieza
      function cleanup() {
        clone.pause();
        if (modal.parentNode) modal.remove();
        window.removeEventListener("resize", onResize);
        document.removeEventListener("keydown", escHandler);
      }

      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target === closeBtn) {
          cleanup();
        }
      });

      function escHandler(e) {
        if (e.key === "Escape") {
          cleanup();
        }
      }
      document.addEventListener("keydown", escHandler);
    });
  });
});