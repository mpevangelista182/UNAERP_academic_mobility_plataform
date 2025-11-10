document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("mobilityForm");
  const submitBtn = document.getElementById("submitBtn");

  // --- Dynamic fields (unchanged logic, just keep behavior) ---
  const otherLanguageName = document.getElementById("otherLanguageName");
  const otherLanguageLevelField = document.getElementById("otherLanguageLevelField");
  if (otherLanguageName) {
    otherLanguageName.addEventListener("input", () => {
      otherLanguageLevelField.classList.toggle("hidden", !otherLanguageName.value.trim().length);
    });
  }

  const periodSelect = document.getElementById("period");
  const otherPeriodField = document.getElementById("otherPeriodField");
  if (periodSelect) {
    periodSelect.addEventListener("change", () => {
      otherPeriodField.classList.toggle("hidden", periodSelect.value !== "Other / Outro");
    });
  }

  const courseSelect = document.getElementById("courseSelect");
  const otherCourseField = document.getElementById("otherCourseField");
  if (courseSelect) {
    courseSelect.addEventListener("change", () => {
      otherCourseField.classList.toggle("hidden", courseSelect.value !== "Other / Outro");
    });
  }

  // --- Scroll reveal (pure JS + CSS) ---
  const revealItems = document.querySelectorAll("section");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(s => {
    s.classList.add("reveal");
    io.observe(s);
  });

  // --- Helper to show transient toast style alerts (small, accessible) ---
  function tinyAlert(msg) {
    // fallback to alert for older browsers — keep UX simple
    try {
      // create ephemeral element
      const el = document.createElement("div");
      el.textContent = msg;
      el.setAttribute("role", "status");
      el.style.position = "fixed";
      el.style.left = "50%";
      el.style.bottom = "30px";
      el.style.transform = "translateX(-50%)";
      el.style.background = "rgba(2,6,23,0.9)";
      el.style.color = "#fff";
      el.style.padding = "10px 14px";
      el.style.borderRadius = "10px";
      el.style.zIndex = 9999;
      el.style.fontSize = "0.95rem";
      el.style.boxShadow = "0 6px 18px rgba(2,6,23,0.2)";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3800);
    } catch (e) { alert(msg); }
  }

  // --- Button animation helpers ---
  function setLoadingState() {
    submitBtn.disabled = true;
    submitBtn.dataset.origText = submitBtn.textContent;
    submitBtn.innerHTML = `<span class="btn-spinner" aria-hidden="true"></span><span style="opacity:0.95">Enviando...</span>`;
  }
  function resetButton() {
    submitBtn.disabled = false;
    const orig = submitBtn.dataset.origText || "Submit / Enviar";
    submitBtn.textContent = orig;
    submitBtn.classList.remove("btn-success");
  }
  function showSuccessState() {
    submitBtn.classList.add("btn-success");
    submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg><span style="font-weight:600"> Enviado</span>`;
    setTimeout(() => {
      resetButton();
    }, 2200);
  }

  // --- Main form submit with validations (keeps original logic + enhanced UX) ---
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // we'll control submit

    // set loading UI
    setLoadingState();

    // simple helper to mark invalid fields
    function markInvalid(el) {
      if (el) {
        el.classList.add("error");
        el.focus && el.focus();
        setTimeout(() => el.classList.remove("error"), 3200);
      }
    }

    // 1) Email presence + format
    const emailField = document.getElementById("email");
    const emailValue = emailField ? emailField.value.trim() : "";
    if (!emailValue) {
      tinyAlert("Por favor informe um e-mail antes de enviar.");
      markInvalid(emailField);
      resetButton();
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
      tinyAlert("Por favor informe um endereço de e-mail válido.");
      markInvalid(emailField);
      resetButton();
      return;
    }

    // 2) Required files check (IDs unchanged)
    const requiredFiles = [
      { id: "academicTranscript", label: "Academic Transcript" },
      { id: "cv", label: "Curriculum Vitae" },
      { id: "motivationLetter", label: "Motivation Letter" },
      { id: "recommendationLetter", label: "Recommendation Letter" },
      { id: "passportCopy", label: "Passport Copy" }
    ];

    const missingFiles = [];
    requiredFiles.forEach(f => {
      const input = document.getElementById(f.id);
      if (!input || !input.files || input.files.length === 0) {
        missingFiles.push(f.label);
      }
    });

    if (missingFiles.length > 0) {
      tinyAlert("Por favor faça upload dos seguintes arquivos obrigatórios: " + missingFiles.join(", "));
      // focus first missing
      const firstMissing = document.getElementById(requiredFiles.find(f => missingFiles.includes(f.label)).id);
      markInvalid(firstMissing);
      resetButton();
      return;
    }

    // 3) Prepare FormData and send via fetch to Apps Script (same URL from HTML)
    const formData = new FormData(form);
    const url = form.action;

    if (!url || !url.startsWith("https://script.google.com/")) {
      tinyAlert("URL do Apps Script inválida. Verifique o atributo action no <form>.");
      resetButton();
      return;
    }

    // Use fetch, keep mode cors
    fetch(url, {
      method: "POST",
      body: formData,
      mode: "cors",
      credentials: "omit"
    })
      .then(response => {
        if (response.ok) {
          return response.text().then(text => ({ ok: true, text }));
        } else {
          return response.text().then(text => Promise.reject({ status: response.status, text }));
        }
      })
      .then(result => {
        // success
        showSuccessState();
        tinyAlert("Obrigado! Seu formulário foi enviado com sucesso.");
        form.reset();
        // hide dynamic fields after reset
        if (otherLanguageLevelField) otherLanguageLevelField.classList.add("hidden");
        if (otherPeriodField) otherPeriodField.classList.add("hidden");
        if (otherCourseField) otherCourseField.classList.add("hidden");
      })
      .catch(err => {
        console.error("Erro ao enviar o formulário:", err);
        const message = err && err.text ? err.text : "Erro desconhecido ao tentar enviar. Confira o Console do navegador.";
        tinyAlert("Falha no envio: " + (message || err));
      })
      .finally(() => {
        // ensure the button is enabled again unless success animation is showing
        // the success animation will call resetButton after a short delay
        setTimeout(() => {
          if (!submitBtn.classList.contains("btn-success")) resetButton();
        }, 900);
      });
  });

  // small UX: remove 'error' class on input when user types
  const inputs = form.querySelectorAll("input, textarea, select");
  inputs.forEach(i => {
    i.addEventListener("input", () => i.classList.remove("error"));
  });

  // Accessibility: allow pressing Enter on the button to trigger form (default), ensure keyboard focus
  submitBtn.addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "Enter") && !submitBtn.disabled) {
      e.preventDefault();
      submitBtn.click();
    }
  });
});

      submitBtn.textContent = "Submit / Enviar";
    }
  });
});

