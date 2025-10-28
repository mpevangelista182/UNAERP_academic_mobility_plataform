// script.js — versão completa (converte arquivos para base64 e submete via iframe)
// Requisitos no index.html:
//  - <form id="mobilityForm" action=".../exec" method="POST" enctype="multipart/form-data" target="hidden_iframe">
//  - <button id="submitBtn" type="submit">Submit / Enviar</button>
//  - <iframe name="hidden_iframe" id="hidden_iframe" style="display:none;"></iframe>

document.addEventListener("DOMContentLoaded", function () {
  // --- Elementos principais ---
  const form = document.getElementById("mobilityForm");
  const submitBtn = document.getElementById("submitBtn");
  const iframe = document.getElementById("hidden_iframe");

  if (!form || !submitBtn || !iframe) {
    console.error("❌ Elementos essenciais (form, submitBtn, hidden_iframe) não encontrados no DOM.");
    return;
  }

  // --- Campos dinâmicos (mantém comportamento anterior) ---
  const otherLanguageName = document.getElementById("otherLanguageName");
  const otherLanguageLevelField = document.getElementById("otherLanguageLevelField");
  otherLanguageName?.addEventListener("input", () => {
    otherLanguageLevelField?.classList.toggle("hidden", !otherLanguageName.value.trim().length);
  });

  const periodSelect = document.getElementById("period");
  const otherPeriodField = document.getElementById("otherPeriodField");
  periodSelect?.addEventListener("change", () => {
    otherPeriodField?.classList.toggle("hidden", periodSelect.value !== "Other / Outro");
  });

  const courseSelect = document.getElementById("courseSelect");
  const otherCourseField = document.getElementById("otherCourseField");
  courseSelect?.addEventListener("change", () => {
    otherCourseField?.classList.toggle("hidden", courseSelect.value !== "Other / Outro");
  });

  // --- Helper: converte File -> base64 (Promise) ---
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // reader.result = "data:<mime>;base64,<base64data>"
        const parts = reader.result.split(",");
        resolve(parts[1]); // retorna somente a parte base64
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  // --- Ao submeter o form ---
  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // vamos controlar o submit manualmente

    // Validação básica de e-mail (opcional)
    const emailField = document.getElementById("email");
    if (emailField) {
      const email = emailField.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert("Por favor, insira um e-mail válido.");
        emailField.focus();
        return;
      }
    }

    // Lista de arquivos obrigatórios (mesma ordem do form)
    const requiredFiles = [
      { id: "academicTranscript", label: "Academic Transcript" },
      { id: "cv", label: "Curriculum Vitae" },
      { id: "motivationLetter", label: "Motivation Letter" },
      { id: "recommendationLetter", label: "Recommendation Letter" },
      { id: "passportCopy", label: "Passport Copy" }
    ];

    // Verifica se todos os requiredFiles estão presentes
    const missing = requiredFiles.filter(f => {
      const el = document.getElementById(f.id);
      return !(el && el.files && el.files.length);
    });
    if (missing.length > 0) {
      alert("Por favor, envie os arquivos obrigatórios:\n\n" + missing.map(m => m.label).join("\n"));
      return;
    }

    // Desativa botão
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending... / Enviando...";

    try {
      // 1) Recolhe todos os campos de texto/select/textarea (exceto arquivos)
      const formData = new FormData(form);
      const fields = {};
      formData.forEach((value, key) => {
        // FormData coloca File para inputs file; ignoramos aqui
        if (value instanceof File) return;
        fields[key] = value;
      });

      // 2) Lê e converte arquivos obrigatórios (em base64)
      const filesPayload = {};
      for (const f of requiredFiles) {
        const input = document.getElementById(f.id);
        if (input && input.files && input.files.length > 0) {
          const file = input.files[0];
          const base64 = await fileToBase64(file);
          filesPayload[f.id] = {
            filename: file.name,
            mimeType: file.type || "application/octet-stream",
            base64: base64
          };
        }
      }

      // 3) Monta o payload JSON
      const payload = { fields, files: filesPayload };

      // 4) Coloca o JSON no campo hidden 'json' (cria se não existir)
      let jsonInput = form.querySelector('input[name="json"]');
      if (!jsonInput) {
        jsonInput = document.createElement("input");
        jsonInput.type = "hidden";
        jsonInput.name = "json";
        form.appendChild(jsonInput);
      }
      jsonInput.value = JSON.stringify(payload);

      // 5) Submete o form para o iframe (sem fetch => evita CORS)
      // Observação: estamos enviando multipart/form-data com um campo "json" contendo o JSON.
      form.submit();

      // 6) Quando o iframe carregar a resposta do Apps Script, tratamos o feedback
      iframe.onload = function () {
        // A resposta do Apps Script geralmente será "Success" ou "Error: ...".
        // Não conseguimos ler o conteúdo do iframe se for cross-origin, mas se o Apps Script
        // retornar uma página simples, o onload será disparado e podemos mostrar sucesso.
        alert("✅ Form successfully submitted! / Formulário enviado com sucesso!");
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit / Enviar";
        form.reset();
      };

    } catch (err) {
      console.error("Submission error:", err);
      alert("❌ Erro ao enviar o formulário. Verifique o console para detalhes.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit / Enviar";
    }
  });
});
