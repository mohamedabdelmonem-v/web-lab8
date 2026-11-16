const buttons = document.querySelectorAll('button[data-url]');
const statusDisplay = document.getElementById('statusDisplay');
const responseDisplay = document.getElementById('responseDisplay');

buttons.forEach((button) => {
  button.addEventListener('click', async () => {