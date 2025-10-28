document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("mobilityForm");
  const submitBtn = document.getElementById("submitBtn");
  const iframe = document.getElementById("hidden_iframe");

  if (!form || !submitBtn || !iframe) {
    console.error("❌ Elementos do formulário não encontrados. Verifique IDs no index.html.");
    return;
  }

  form.addEventListener("submit", function () {
    // Desativa o botão para evitar duplo envio
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending... / Enviando...";

    // Listener do iframe (resposta do Apps Script)
    iframe.onload = function () {
      alert("✅ Form successfully submitted! / Formulário enviado com sucesso!");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit / Enviar";
      form.reset();
    };
  });
});
