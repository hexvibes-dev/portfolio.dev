document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll(".carousel-item video");

  videos.forEach(video => {
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
        zIndex: "9999"
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
        zIndex: "10000"
      });

      // Clonar video como animación
      const clone = document.createElement("video");
      const source = video.querySelector("source");
      clone.src = source ? source.src : video.src;
      clone.autoplay = true;
      clone.muted = true;
      clone.loop = true;
      clone.playsInline = true;
      clone.removeAttribute("controls"); // sin controles
      clone.style.pointerEvents = "none"; // sin interacción
      Object.assign(clone.style, {
        width: "95vw",
        maxWidth: "1000px",
        borderRadius: "16px",
        boxShadow: "0 0 40px rgba(0,0,0,0.7)",
        objectFit: "cover"
      });

      // Insertar y mostrar
      modal.appendChild(closeBtn);
      modal.appendChild(clone);
      document.body.appendChild(modal);

      // Cerrar al tocar fuera o el botón
      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target === closeBtn) {
          clone.pause();
          modal.remove();
        }
      });

      // Cerrar con Escape
      document.addEventListener("keydown", function escHandler(e) {
        if (e.key === "Escape") {
          clone.pause();
          modal.remove();
          document.removeEventListener("keydown", escHandler);
        }
      });
    });
  });
});
// Contact popup toggle
document.querySelectorAll("nav a").forEach(link => {
  if (link.textContent.toLowerCase().includes("contact")) {
    link.addEventListener("click", e => {
      e.preventDefault();
      const popup = document.getElementById("contact-popup");
      popup.classList.toggle("hidden");
    });
  }
});