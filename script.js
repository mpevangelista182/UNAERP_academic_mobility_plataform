document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("mobilityForm");
  const submitBtn = document.getElementById("submitBtn");

  const showError = (field, message) => {
    const errorElement = document.getElementById(`error-${field.id}`);
    if (errorElement) errorElement.textContent = message;
    field.classList.add("invalid");
  };

  const clearError = (field) => {
    const errorElement = document.getElementById(`error-${field.id}`);
    if (errorElement) errorElement.textContent = "";
    field.classList.remove("invalid");
  };

  const validateField = (field) => {
    if (field.validity.valueMissing) {
      showError(field, "⚠️ This field is required / Campo obrigatório");
      return false;
    }
    if (field.validity.patternMismatch) {
      showError(field, "⚠️ Invalid format / Formato inválido");
      return false;
    }
    if (field.type === "email" && !field.value.match(/^[\\w-.]+@[\\w-]+\\.[a-z]{2,}$/i)) {
      showError(field, "⚠️ Please enter a valid email");
      return false;
    }
    clearError(field);
    return true;
  };

  form.addEventListener("input", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") {
      validateField(e.target);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    [...form.elements].forEach((el) => {
      if ((el.tagName === "INPUT" || el.tagName === "SELECT") && !validateField(el)) {
        valid = false;
      }
    });

    if (!valid) {
      alert("❌ Please correct the highlighted fields before submitting.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          alert("✅ Thank you! Your form was submitted successfully.");
          form.reset();
          document.querySelectorAll(".error-message").forEach((e) => (e.textContent = ""));
        } else {
          alert("❌ Submission failed. Please check your backend.");
        }
      })
      .catch(() => alert("❌ Network error. Please try again later."))
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit / Enviar";
      });
  });
});
