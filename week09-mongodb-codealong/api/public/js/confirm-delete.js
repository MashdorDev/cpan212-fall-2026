// Asks for confirmation before any form with a data-confirm attribute is submitted.
// This lives in a file instead of an onsubmit="..." attribute because a Content Security Policy
// (which you will add in the security week) blocks inline event handlers.
document.addEventListener('submit', (event) => {
  const message = event.target.dataset.confirm;
  if (message && !window.confirm(message)) {
    event.preventDefault();
  }
});
