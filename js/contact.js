(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const submitButton = form.querySelector(".form-submit");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setStatus(message, type) {
    status.textContent = message;
    status.classList.remove("success", "error");
    if (type) status.classList.add(type);
  }

  function validate(data) {
    if (!data.nome) return "Informe seu nome ou o nome da empresa.";
    if (!data.email) return "Informe seu e-mail.";
    if (!emailPattern.test(data.email)) return "Informe um e-mail válido.";
    if (!data.mensagem) return "Escreva sua mensagem.";
    return "";
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Bots costumam preencher o campo oculto; ignora o envio sem avisar.
    if (form.elements._honey.value) return;

    const data = {
      nome: form.elements.nome.value.trim(),
      email: form.elements.email.value.trim(),
      mensagem: form.elements.mensagem.value.trim(),
    };

    const error = validate(data);
    if (error) {
      setStatus(error, "error");
      return;
    }

    submitButton.disabled = true;
    setStatus("Enviando...");

    try {
      // Endpoint AJAX do FormSubmit: mesmo endereço do action, com /ajax/ antes do e-mail.
      const endpoint = form.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          _subject: form.elements._subject.value,
          _template: form.elements._template.value,
          _captcha: form.elements._captcha.value,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || String(result.success) === "false") {
        throw new Error(result.message || "Falha no envio");
      }

      form.reset();
      setStatus("Mensagem enviada com sucesso! Retornarei em breve.", "success");
    } catch (err) {
      setStatus("Não foi possível enviar agora. Tente novamente ou me chame pelo e-mail ou WhatsApp.", "error");
    } finally {
      submitButton.disabled = false;
    }
  });
})();
