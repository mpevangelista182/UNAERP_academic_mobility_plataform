document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("mobilityForm");
  const periodSelect = document.getElementById("period");
  const otherPeriodField = document.getElementById("otherPeriodField");

  const courseSelect = document.getElementById("courseSelect");
  const otherCourseField = document.getElementById("otherCourseField");

  // Show "Other period" text input when user selects "Other / Outro"
  periodSelect.addEventListener("change", () => {
    if (periodSelect.value.includes("Other")) {
      otherPeriodField.classList.remove("hidden");
    } else {
      otherPeriodField.classList.add("hidden");
    }
  });

  // Show "Other course" text input when user selects "Other / Outro"
  courseSelect.addEventListener("change", () => {
    if (courseSelect.value.includes("Other")) {
      otherCourseField.classList.remove("hidden");
    } else {
      otherCourseField.classList.add("hidden");
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const requiredFiles = [
      "academicTranscript",
      "cv",
      "motivationLetter",
      "recommendationLetter",
      "passportCopy"
    ];

    for (const id of requiredFiles) {
      const input = document.getElementById(id);
      if (!input.value) {
        alert("Por favor, envie todos os arquivos obrigatórios / Please upload all required files.");
        return;
      }
    }

    alert("Formulário pronto para envio! / Form ready to submit!");
  });
});
