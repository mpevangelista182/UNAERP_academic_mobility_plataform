document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("mobilityForm");
  const periodSelect = document.getElementById("period");
  const otherPeriodField = document.getElementById("otherPeriodField");
  const courseSelect = document.getElementById("courseSelect");
  const otherCourseField = document.getElementById("otherCourseField");
  const otherLanguageName = document.getElementById("otherLanguageName");
  const otherLanguageLevelField = document.getElementById("otherLanguageLevelField");

  if (periodSelect) {
    periodSelect.addEventListener("change", () => {
      otherPeriodField.classList.toggle("hidden", !periodSelect.value.includes("Other"));
    });
  }

  if (courseSelect) {
    courseSelect.addEventListener("change", () => {
      otherCourseField.classList.toggle("hidden", !courseSelect.value.includes("Other"));
    });
  }

  if (otherLanguageName) {
    otherLanguageName.addEventListener("input", () => {
      otherLanguageLevelField.classList.toggle("hidden", otherLanguageName.value.trim() === "");
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Formulário pronto para envio! / Form ready to submit!");
  });
});

