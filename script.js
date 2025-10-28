// === UNAERP Incoming Student Form ===
// Handles dynamic form behavior, validation, and submission to Google Apps Script

document.addEventListener("DOMContentLoaded", function () {
  // Garantir que o formulário e o botão existam
  const form = document.getElementById("mobilityForm");
  const submitBtn = document.getElementById("submitBtn");

  if (!form) {
    console.error("❌ Formulário com id='mobilityForm' não encontrado.");
    return;
  }
  if (!submitBtn) {
    console.error("❌ Botão de envio com id='submitBtn' não encontrado.");
    return;
  }

  // === LANGUAGE FIELD CONTROL ===
  const otherLanguageName = document.getElementById("otherLanguageName");
  const otherLanguageLevelField = document.getElementById("otherLanguageLevelField");

  otherLanguageName?.addEventListener("input", () => {
    const hasText = otherLanguageName.value.trim().length > 0;
    otherLanguageLevelField.classList.toggle("hidden", !hasText);
  });

  // === STUDY PERIOD CONTROL ===
  const periodSelect = document.getElementById("period");
  const otherPeriodField = document.getElementById("otherPeriodField");

  periodSelect?.addEventListener("change", () => {
    otherPeriodField.classList.toggle("hidden", periodSelect.value !== "Other / Outro");
  });

  // === COURSE FIELD CONTROL ===
  const courseSelect = document.getElementById("courseSelect");
  const otherCourseField = document.getElementById("otherCourseField");

  courseSelect?.addEventListener("change", () => {
    otherCourseField.classList.toggle("hidden", courseSelect.value !== "Other / Outro");
  });

  // === FORM SUBMISSION HANDLER ===
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    console.log("📤 Submitting form...");

    // --- Validation for required file uploads ---
    const requiredFiles = [
      { id: "academicTranscript", label: "Academic Transcript" },
      { id: "cv", label: "Curriculum Vitae" },
      { id: "motivationLetter", label: "Motivation Letter" },
      { id: "recommendationLetter", label: "Recommendation Letter" },
      { id: "passportCopy", label: "Passport Copy" }
    ];

    const missingFiles = requiredFiles.filter(f => !document.getElementById(f.id)?.files.length);

    if (missingFiles.length > 0) {
      alert(
        "Please upload the following required files before submitting:\n\n" +
        missingFiles.map(f => f.label).join("\n")
      );
      return;
    }

    // --- Disable button during submission ---
    console.log("🔒 Disabling submit button...");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting / Enviando...";

    try {
      // --- Collect text fields ---
      const formData = new FormData(form);
      const fields = {};
      formData.forEach((value, key) => {
        if (value instanceof File) return;
        fields[key] = value;
      });

      // --- Convert files to base64 ---
      const files = {};
      for (const fileField of requiredFiles.map(f => f.id)) {
        const input = document.getElementById(fileField);
        if (input && input.files.length > 0) {
          const file = input.files[0];
          files[fileField] = {
            filename: file.name,
            mimeType: file.type,
            base64: await fileToBase64(file)
          };
        }
      }

      // --- Prepare payload ---
      const payload = JSON.stringify({ fields, files });

      // --- Send to Google Apps Script ---
      console.log("🚀 Sending data to Google Apps Script...");
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload
      });

      const resultText = await response.text();
      console.log("📬 Response:", resultText);

      if (response.ok) {
        alert("✅ Thank you! Your application form has been successfully submitted.\n\nObrigado! Seu formulário foi enviado com sucesso.");
        form.reset();
        otherLanguageLevelField?.classList.add("hidden");
        otherPeriodField?.classList.add("hidden");
        otherCourseField?.classList.add("hidden");
      } else {
        alert("⚠️ An error occurred while submitting your form:\n\n" + resultText);
      }
    } catch (error) {
      console.error("❌ Submission error:", error);
      alert("❌ Error sending form. Please try again or contact the International Office.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit / Enviar";
    }
  });

  // === Convert file to base64 ===
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
});
