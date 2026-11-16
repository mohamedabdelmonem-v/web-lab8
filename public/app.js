const buttons = document.querySelectorAll('button[data-url]');
const statusDisplay = document.getElementById('statusDisplay');
const responseDisplay = document.getElementById('responseDisplay');

buttons.forEach((button) => {
  button.addEventListener('click', async () => {
    const url = button.getAttribute('data-url');
    const method = button.getAttribute('data-method');