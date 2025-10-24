document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("mobilityForm");
  const periodSelect = document.getElementById("period");
  const otherPeriodField = document.getElementById("otherPeriodField");
  const courseSelect = document.getElementById("courseSelect");
  const otherCourseField = document.getElementById("otherCourseField");

  const otherLanguageName = document.getElementById("otherLanguageName");
  const otherLanguageLevelField = document.getElementById("otherLanguageLevelField");

  // Show Other Period Field
  if (periodSelect) {
    periodSelect.addEventListener("change", () => {
      if (periodSelect.value.includes("Other")) {
        otherPeriodField.classList.remove("hidden");
      } else {
        otherPeriodField.classList.add("hidden");
      }
    });
  }

  // Show Other Course Field
  if (courseSelect) {
    courseSelect.addEventListener("change", () => {
      if (courseSelect.value.includes("Other")) {
        otherCourseField.classList.remove("hidden");
      } else {
        otherCourseField.classList.add("hidden");
      }
    });
  }

  // Show Other Language Level when user types a language
  if (otherLanguageName) {
    otherLanguageName.addEventListener("input", () => {
      if (otherLanguageName.value.trim() !== "") {
        otherLanguageLevelField.classList.remove("hidden");
      } else {
        otherLanguageLevelField.classList.add("hidden");
      }
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Formulário pronto para envio! / Form ready to submit!");
  });
});

