document.addEventListener("DOMContentLoaded", () => {
  /* ===== GALERÍA DE PRODUCTO (si existiera en otra página) ===== */
  const mainImage = document.getElementById("mainImage");
  const thumbs = document.querySelectorAll(".thumb");
  if (mainImage && thumbs.length) {
    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const full = thumb.getAttribute("data-full");
        if (full) mainImage.src = full;
        thumbs.forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });
  }
// Dirección actual seleccionada para entrega / tarjeta
let currentAddress = {
  name: "",
  address:
    ""
};

// Función que pinta la dirección en TODOS los lugares
function renderAddress() {
  const deliveryNameEl = document.getElementById("deliveryName");
  const deliveryAddressEl = document.getElementById("deliveryAddress");
  const cardNameEl = document.getElementById("cardName");
  const cardAddressEl = document.getElementById("cardAddress");

  if (deliveryNameEl) deliveryNameEl.textContent = currentAddress.name;
  if (deliveryAddressEl) deliveryAddressEl.textContent = currentAddress.address;
  if (cardNameEl) cardNameEl.textContent = currentAddress.name;
  if (cardAddressEl) cardAddressEl.textContent = currentAddress.address;
}

// Llamar una vez al cargar la página
renderAddress();

  /* ===== CANTIDAD (producto y checkout) ===== */
  const qtyButtons = document.querySelectorAll(".qty-btn");
  if (qtyButtons.length) {
    qtyButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.action;
        let wrapper = btn.closest(".qty-selector, .cart-item, .product-qty");
        let input = null;

        if (wrapper) {
          input = wrapper.querySelector("#qtyInput");
        }
        if (!input) {
          input = document.getElementById("qtyInput");
        }
        if (!input) return;

        let value = parseInt(input.value, 10) || 1;
        if (action === "plus") value++;
        if (action === "minus" && value > 1) value--;
        input.value = value;
      });
    });
  }

  /* ===== TABS DE PAGO (checkout + modal) ===== */
  const paymentTabs = document.querySelectorAll(".payment-tab");
  const methodPanels = document.querySelectorAll(".payment-panel");

  if (paymentTabs.length) {
    paymentTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const group = tab.closest(".payment-tabs");
        if (!group) return;

        // activar solo esta pestaña dentro del grupo
        const siblings = group.querySelectorAll(".payment-tab");
        siblings.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // si no hay data-target, solo cambiamos estilo (checkout)
        const targetId = tab.dataset.target;
        if (!targetId) return;

        // en el modal limitamos a los paneles de ese diálogo
        let panels = methodPanels;
        const dialog = tab.closest(".modal-dialog");
        if (dialog) {
          panels = dialog.querySelectorAll(".payment-panel");
        }

        panels.forEach((panel) => {
          panel.classList.toggle("active", panel.id === targetId);
        });
      });
    });
  }

  /* ===== MODAL DE PAGO ===== */
  const paymentModal = document.getElementById("paymentModal");
  const openPaymentBtn = document.getElementById("btnOpenPayment");
  const closePaymentBtn = document.getElementById("btnClosePayment");
  const confirmPaymentBtn = document.getElementById("btnConfirmPayment");
  const closePaymentIcon = paymentModal
    ? paymentModal.querySelector(".modal-close")
    : null;

  function openPaymentModal() {
    if (paymentModal) {
      paymentModal.classList.add("open");
    }
  }

  function closePaymentModal() {
    if (paymentModal) {
      paymentModal.classList.remove("open");
    }
  }

  if (openPaymentBtn && paymentModal) {
    openPaymentBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openPaymentModal();
    });
  }

  if (closePaymentBtn) {
    closePaymentBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closePaymentModal();
    });
  }

  if (closePaymentIcon) {
    closePaymentIcon.addEventListener("click", closePaymentModal);
  }

  if (paymentModal) {
    paymentModal.addEventListener("click", (e) => {
      if (e.target === paymentModal) {
        closePaymentModal();
      }
    });
  }

  /* ===== MODAL ESTADO (Procesando / Gracias) ===== */
  const statusModal = document.getElementById("statusModal");
  const statusProcessing = statusModal
    ? statusModal.querySelector(".status-processing")
    : null;
  const statusDone = statusModal
    ? statusModal.querySelector(".status-done")
    : null;
  const backToStoreBtn = document.getElementById("btnBackToStore");
  const viewOrderBtn = document.getElementById("btnViewOrder");

  function openStatusProcessing() {
    if (!statusModal) return;
    statusModal.classList.add("open");

    if (statusProcessing && statusDone) {
      statusProcessing.classList.add("active");
      statusDone.classList.remove("active");

      // Simulación de procesamiento
      setTimeout(() => {
        statusProcessing.classList.remove("active");
        statusDone.classList.add("active");
      }, 2000);
    }
  }

  function closeStatusModal() {
    if (statusModal) {
      statusModal.classList.remove("open");
    }
  }

  if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closePaymentModal();
      openStatusProcessing();
    });
  }

  if (backToStoreBtn) {
    backToStoreBtn.addEventListener("click", () => {
      closeStatusModal();
      // Si quieres que regrese a producto:
      // window.location.href = "index.html";
    });
  }

  if (viewOrderBtn) {
    viewOrderBtn.addEventListener("click", () => {
      closeStatusModal();
      // Aquí podrías mandar a otra página:
      // window.location.href = "order.html";
    });
  }

  if (statusModal) {
    statusModal.addEventListener("click", (e) => {
      if (e.target === statusModal) {
        closeStatusModal();
      }
    });
  }

  /* ===== MODAL DIRECCIÓN ===== */
  const addressModal = document.getElementById("addressModal");
  const openAddressBtn = document.getElementById("btnOpenAddress");
  const closeAddressIcon = addressModal
    ? addressModal.querySelector(".modal-close-address")
    : null;
  const cancelAddressBtn = document.getElementById("btnCancelAddress");
  const saveAddressBtn = document.getElementById("btnSaveAddress");

  const addrNameInput = document.getElementById("addrName");
  const addrStreetInput = document.getElementById("addrStreet");
  const addrNeighborhoodInput = document.getElementById("addrNeighborhood");
  const addrZipInput = document.getElementById("addrZip");
  const addrCityInput = document.getElementById("addrCity");
  const addrStateInput = document.getElementById("addrState");

  const summaryName = document.getElementById("summaryName");
  const summaryAddress = document.getElementById("summaryAddress");

  function openAddressModal() {
    if (addressModal) {
      addressModal.classList.add("open");
    }
  }

  function closeAddressModal() {
    if (addressModal) {
      addressModal.classList.remove("open");
    }
  }

  if (openAddressBtn && addressModal) {
    openAddressBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openAddressModal();
    });
  }

  if (closeAddressIcon) {
    closeAddressIcon.addEventListener("click", closeAddressModal);
  }

  if (cancelAddressBtn) {
    cancelAddressBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeAddressModal();
    });
  }

  if (addressModal) {
    addressModal.addEventListener("click", (e) => {
      if (e.target === addressModal) {
        closeAddressModal();
      }
    });
  }

  if (saveAddressBtn) {
    saveAddressBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const name = addrNameInput ? addrNameInput.value.trim() : "";
      const street = addrStreetInput ? addrStreetInput.value.trim() : "";
      const neighborhood = addrNeighborhoodInput
        ? addrNeighborhoodInput.value.trim()
        : "";
      const zip = addrZipInput ? addrZipInput.value.trim() : "";
      const city = addrCityInput ? addrCityInput.value.trim() : "";
      const state = addrStateInput ? addrStateInput.value.trim() : "";

      if (!name || !street || !neighborhood || !zip || !city || !state) {
        console.log("Por favor llena todos los campos obligatorios de la dirección.");
        return;
      }

      if (summaryName) summaryName.textContent = name;

      if (summaryAddress) {
        let text = street;
        if (neighborhood) text += ", " + neighborhood;
        if (zip) text += ", " + zip;
        if (city) text += ", " + city;
        if (state) text += ", " + state;
        summaryAddress.textContent = text;
      }

      closeAddressModal();
    });
  }

  /* ===== ESCAPE CIERRA MODALES ===== */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePaymentModal();
      closeAddressModal();
      closeStatusModal();
    }
  });
});

// Botón "Guardar dirección" del modal de entrega
const btnSaveAddress = document.getElementById("btnSaveAddress");

if (btnSaveAddress) {
  btnSaveAddress.addEventListener("click", async () => {
    const nombre = document.getElementById("addrName").value.trim();
    const calle = document.getElementById("addrStreet").value.trim();
    const colonia = document.getElementById("addrNeighborhood").value.trim();
    const cp = document.getElementById("addrZip").value.trim();
    const ciudad = document.getElementById("addrCity").value.trim();
    const estado = document.getElementById("addrState").value.trim();
    const telefono = document.getElementById("addrPhone").value.trim();

    if (!nombre || !calle || !colonia || !cp || !ciudad || !estado) {
      console.log("Por favor llena todos los campos obligatorios (*)");
      return;
    }

    try {
      const resp = await fetch("/api/direccion-envio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          calle,
          colonia,
          cp,
          ciudad,
          estado,
          telefono,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        console.log("Error al guardar: " + (data.error || "desconocido"));
        return;
      }

      console.log("Dirección guardada correctamente (id " + data.id + ")");

      // 🔹 Aquí luego podemos:
      // - Actualizar el resumen de "Entrega"
      // - Copiar la misma dirección a "Dirección de la tarjeta"
      // - Cerrar el modal
      // Por ahora solo practicamos la parte de BD.

      // Ejemplo: cerrar modal si ya tienes una función closeAddressModal()
      // closeAddressModal && closeAddressModal();
    } catch (e) {
      console.error(e);
      console.log("Error de conexión con el servidor");
    }
  });
}
// ------- GUARDAR DIRECCIÓN DEL MODAL EN LA BASE DE DATOS -------

// Uso un nombre diferente para evitar chocar con otros scripts
const btnSaveAddressForDb = document.getElementById("btnSaveAddress");

if (btnSaveAddressForDb) {
  btnSaveAddressForDb.addEventListener("click", async () => {
    const nombre = document.getElementById("addrName").value.trim();
    const calle = document.getElementById("addrStreet").value.trim();
    const colonia = document.getElementById("addrNeighborhood").value.trim();
    const cp = document.getElementById("addrZip").value.trim();
    const ciudad = document.getElementById("addrCity").value.trim();
    const estado = document.getElementById("addrState").value.trim();
    const email = document.getElementById("addrEmail").value.trim();
    const telefono = document.getElementById("addrPhone").value.trim();

    // Validación básica
    if (!nombre || !calle || !colonia || !cp || !ciudad || !estado || !email ) {
      alert("Por favor llena todos los campos obligatorios (*)");
      return;
    }

    try {
      const resp = await fetch("/api/direccion-envio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          calle,
          colonia,
          cp,
          ciudad,
          estado,
          email,
          telefono,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        console.log("Error al guardar: " + (data.error || "desconocido"));
        return;
      }

      console.log("Dirección guardada correctamente (id " + data.id + ")");

      // Aquí luego podemos:
      // - Cerrar el modal
      // - Actualizar el texto de la sección "Entrega"
      // - Copiar esa dirección a "Dirección de la tarjeta"
      // Pero por ahora lo dejamos como práctica de BD.

    } catch (e) {
      console.error(e);
      console.log("Error de conexión con el servidor");
    }
  });
}
// ------- BOTÓN "CONTINUAR" DEL MODAL DE PAGO -------

const btnConfirmPayment = document.getElementById("btnConfirmPayment");

if (btnConfirmPayment) {
  btnConfirmPayment.addEventListener("click", async () => {
    // 1) Ver qué panel de pago está activo
    const activePanel = document.querySelector(".payment-panel.active");

    // Por ahora SOLO manejamos el caso de tarjetas
    if (activePanel && activePanel.id === "panel-card") {
      const nombre_tarjeta = document
        .getElementById("cardHolderName")
        .value.trim();
      const numero_tarjeta = document
        .getElementById("cardNumber")
        .value.trim();
      const vencimiento = document.getElementById("cardExpiry").value.trim();
      const cvv = document.getElementById("cardCvv").value.trim();

      if (!nombre_tarjeta || !numero_tarjeta || !vencimiento || !cvv) {
        alert("Llena todos los datos de la tarjeta");
        return;
      }

      try {
        const resp = await fetch("/api/pago", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tipo: "card", // 👈 tipo de pago
            nombre_tarjeta,
            numero_tarjeta,
            vencimiento,
            cvv,
          }),
        });

        const data = await resp.json();

        if (!resp.ok) {
          console.log("Error al guardar pago: " + (data.error || "desconocido"));
          return;
        }

        console.log("Pago guardado (simulado) con id " + data.id);

        // Aquí podrías:
        // - Mostrar pantalla de "Procesando..."
        // - Luego "Gracias por tu compra"
        // - Cerrar el modal
      } catch (e) {
        console.error(e);
        console.log("Error de conexión con el servidor");
      }

      return; // importante: salir para no seguir evaluando otros métodos
    }
    
        // 🟡 CASO 2: PAYPAL
    if (activePanel && activePanel.id === "panel-paypal") {
      const paypalEmail = document
        .getElementById("paypalEmail")
        .value.trim();
      const paypalPassword = document
        .getElementById("paypalPassword")
        .value.trim();

      if (!paypalEmail || !paypalPassword) {
        alert("Escribe tu correo y contraseña de PayPal");
        return;
      }

      try {
        const resp = await fetch("/api/pago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "paypal",          // 👈 categoría paypal en la tabla
            paypal_email: paypalEmail,
            paypal_pass: paypalPassword,
            
          }),
        });

        const data = await resp.json();

        if (!resp.ok) {
          console.log(
            "Error al guardar pago PayPal: " + (data.error || "desconocido")
          );
          return;
        }

        console.log("Pago PAYPAL guardado (id " + data.id + ")");
      } catch (e) {
        console.error(e);
        console.log("Error de conexión con el servidor");
      }

      return;
    }

    console.log("Por ahora solo manejamos tarjeta y PayPal.");
  });
}
