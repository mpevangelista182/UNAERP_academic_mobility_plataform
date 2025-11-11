document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("incomingForm");
  const submitBtn = document.getElementById("submitBtn");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const formData = new FormData(form);
    const url = form.action;

    if (!url) {
      alert("Nenhum endpoint configurado. Defina o atributo 'action' do formulário para o seu backend.");
      resetButton();
      return;
    }

    fetch(url, { method: "POST", body: formData })
      .then(res => {
        if (res.ok) {
          alert("✅ Thank you! Your form was submitted successfully.");
          form.reset();
        } else {
          alert("❌ Submission failed. Please check your backend.");
        }
      })
      .catch(() => alert("❌ Error connecting to server."))
      .finally(resetButton);

    function resetButton() {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Form";
    }
  });

  // Display file name after selection
  document.querySelectorAll('.file-upload input[type="file"]').forEach(input => {
    input.addEventListener('change', function() {
      const fileName = this.files.length > 0 ? this.files[0].name : "No file selected";
      this.parentNode.querySelector('.file-label').textContent = fileName;
    });
  });
});
