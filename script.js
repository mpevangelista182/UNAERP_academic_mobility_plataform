// ===============================
// UNAERP Incoming Student Form
// ===============================

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("mobilityForm");
  const hiddenIframe = document.getElementById("hidden_iframe");
  const submitBtn = document.getElementById("submitBtn");

  // --- Dynamic fields ---
  const otherLanguageName = document.getElementById("otherLanguageName");
  const otherLanguageLevelField = document.getElementById("otherLanguageLevelField");
  const otherCourseField = document.getElementById("otherCourseField");
  const otherPeriodField = document.getElementById("otherPeriodField");
  const courseSelect = document.getElementById("courseSelect");
  const periodSelect = document.getElementById("period");

  // Show/hide optional fields
  otherLanguageName.addEventListener("input", () => {
    otherLanguageLevelField.classList.toggle("hidden", otherLanguageName.value.trim() === "");
  });

  courseSelect.addEventListener("change", () => {
    otherCourseField.classList.toggle("hidden", courseSelect.value !== "Other / Outro");
  });

  periodSelect.addEventListener("change", () => {
    otherPeriodField.classList.toggle("hidden", periodSelect.value !== "Other / Outro");
  });

  // --- Form submission handler ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending / Enviando…";

    try {
      // Collect all text fields
      const formData = new FormData(form);
      const fields = {};
      const files = {};

      formData.forEach((value, key) => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input && input.type === "file") {
          const file = input.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const base64 = event.target.result.split(",")[1];
              files[key] = {
                filename: file.name,
                mimeType: file.type,
                base64: base64,
              };
            };
            reader.readAsDataURL(file);
          }
        } else {
          fields[key] = value;
        }
      });

      // Wait a bit for files to encode (FileReader async)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create payload
      const payload = { fields, files };

      // Send JSON via hidden iframe to avoid CORS
      const jsonBlob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      const formDataToSend = new FormData();
      formDataToSend.append("json", JSON.stringify(payload));

      await fetch(form.action, {
        method: "POST",
        body: formDataToSend,
        mode: "no-cors",
      });

      // Show bilingual success message
      showSuccessMessage();

      // Reset form
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit / Enviar";
    } catch (error) {
      console.error("Error sending form:", error);
      alert("❌ Error submitting form. Please try again.\nErro ao enviar o formulário. Tente novamente.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit / Enviar";
    }
  });

  // --- Success message ---
  function showSuccessMessage() {
    const message = document.createElement("div");
    message.innerHTML = `
      <div style="
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
      ">
        <div style="
          background: white;
          padding: 30px 40px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          font-family: 'Inter', 'Arial', sans-serif;
          max-width: 400px;
        ">
          <h2 style="color: #244C9C;">✅ Thank you!</h2>
          <p>Your form has been successfully submitted.</p>
          <hr style="margin: 16px 0;">
          <h2 style="color: #244C9C;">✅ Obrigado!</h2>
          <p>Seu formulário foi enviado com sucesso.</p>
        </div>
      </div>
    `;
    document.body.appendChild(message);

    // Remove message after 3 seconds
    setTimeout(() => message.remove(), 3000);
  }
});
