// script.js — validação de email, arquivos obrigatórios e envio via fetch para Apps Script
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("mobilityForm");
  const submitBtn = document.getElementById("submitBtn");

  // Campos dinâmicos (mesma lógica do seu original)
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

  // Validação e envio
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // vamos controlar o envio manualmente

    // Desativar o botão enquanto processa
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    // 1) Validar e-mail (presença + formato)
    const emailField = document.getElementById("email");
    const emailValue = emailField ? emailField.value.trim() : "";
    if (!emailValue) {
      alert("Por favor informe um e-mail antes de enviar.");
      emailField.focus();
      resetButton();
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
      alert("Por favor informe um endereço de e-mail válido.");
      emailField.focus();
      resetButton();
      return;
    }

    // 2) Verificar arquivos obrigatórios (IDs correspondem ao index.html acima)
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
      alert("Por favor faça upload dos seguintes arquivos obrigatórios:\n\n" + missingFiles.join("\n"));
      resetButton();
      return;
    }

    // 3) Preparar FormData e enviar via fetch para o URL do form.action
    const formData = new FormData(form);

    // Observação: o comportamento no servidor depende do Apps Script.
    // O Apps Script precisa estar preparado para receber multipart/form-data (ou aceitar apenas text fields).
    // Se você ainda não publicou o Web App, substitua a URL no atributo action do form antes de testar.
    const url = form.action;
    if (!url || !url.startsWith("https://script.google.com/")) {
      alert("URL do Apps Script inválida. Verifique o atributo action no <form> e cole o Web App URL correto.");
      resetButton();
      return;
    }

    fetch(url, {
      method: "POST",
      body: formData,
      mode: "cors",
      credentials: "omit"
    })
      .then(response => {
        // Alguns Apps Script retornam texto simples; outros retornam 200 com mensagem.
        if (response.ok) {
          return response.text().then(text => ({ ok: true, text }));
        } else {
          return response.text().then(text => Promise.reject({ status: response.status, text }));
        }
      })
      .then(result => {
        alert("✅ Thank you! Your application has been successfully submitted! / Obrigado! Seu formulário foi enviado com sucesso!");
        form.reset();
        // esconder campos dinâmicos após reset
        if (otherLanguageLevelField) otherLanguageLevelField.classList.add("hidden");
        if (otherPeriodField) otherPeriodField.classList.add("hidden");
        if (otherCourseField) otherCourseField.classList.add("hidden");
      })
      .catch(err => {
        console.error("Erro ao enviar o formulário:", err);
        const message = err && err.text ? err.text : "Erro desconhecido ao tentar enviar. Confira o Console do navegador.";
        alert("❌ Falha no envio: " + message);
      })
      .finally(() => {
        resetButton();
      });

    function resetButton() {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit / Enviar";
    }
  });
});
