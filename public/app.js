const buttons = document.querySelectorAll('button[data-url]');
const statusDisplay = document.getElementById('statusDisplay');
const responseDisplay = document.getElementById('responseDisplay');

buttons.forEach((button) => {
  button.addEventListener('click', async () => {
    const url = button.getAttribute('data-url');
    const method = button.getAttribute('data-method');

    statusDisplay.textContent = 'Loading...';
    responseDisplay.textContent = '';

    try {
      const response = await fetch(url, { method });
      statusDisplay.textContent = `${response.status} ${response.statusText}`;

      const rawText = await response.text();
      try {