// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

  // === LANGUAGE FIELD CONTROL ===
  const otherLanguageName = document.getElementById("otherLanguageName");
  const otherLanguageLevelField = document.getElementById("otherLanguageLevelField");

  otherLanguageName.addEventListener("input", () => {
    const hasText = otherLanguageName.value.trim().length > 0;
    otherLanguageLevelField.classList.toggle("hidden", !hasText);
  });

  // === STUDY PERIOD CONTROL ===
  const periodSelect = document.getElementById("period");
  const otherPeriodField = document.getElementById("otherPeriodField");

  periodSelect.addEventListener("change", () => {
    if (periodSelect.value === "Other / Outro") {
      otherPeriodField.classList.remove("hidden");
    } else {
      otherPeriodField.classList.add("hidden");
    }
  });

  // === COURSE FIELD CONTROL ===
  const courseSelect = document.getElementById("courseSelect");
  const otherCourseField = document.getElementById("otherCourseField");

  courseSelect.addEventListener("change", () => {
    if (courseSelect.value === "Other / Outro") {
      otherCourseField.classList.remove("hidden");
    } else {
      otherCourseField.classList.add("hidden");
    }
  });

  // === FORM VALIDATION ===
  const form = document.getElementById("mobilityForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default submission for validation

    const requiredFiles = [
      { id: "academicTranscript", label: "Academic Transcript" },
      { id: "cv", label: "Curriculum Vitae" },
      { id: "motivationLetter", label: "Motivation Letter" },
      { id: "recommendationLetter", label: "Recommendation Letter" },
      { id: "passportCopy", label: "Passport Copy" },
      { id: "learningAgreement", label: "Signed UNAERP Learning Agreement" } // ✅ new required file
    ];

    let missingFiles = [];

    // Check that all required files are uploaded
    requiredFiles.forEach(fileField => {
      const fileInput = document.getElementById(fileField.id);
      if (!fileInput.files.length) {
        missingFiles.push(fileField.label);
      }
    });

    if (missingFiles.length > 0) {
      alert(
        "Please upload the following required files before submitting:\n\n" +
        missingFiles.join("\n")
      );
      return;
    }

    // If validation passes, submit the form (for now, show confirmation)
    alert("✅ Thank you! Your application form has been successfully submitted.");
    form.reset();

    // Hide dynamic fields again after reset
    otherLanguageLevelField.classList.add("hidden");
    otherPeriodField.classList.add("hidden");
    otherCourseField.classList.add("hidden");
  });

});


