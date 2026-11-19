const params = new URLSearchParams(window.location.search);
const code = params.get('code') || '';
const state = params.get('state') || '';
const error = params.get('error') || '';
const codeOutput = document.querySelector('#oauth-code');
const stateOutput = document.querySelector('#oauth-state');
const status = document.querySelector('#oauth-status');
const copyButton = document.querySelector('#copy-code');

if (window.location.search) window.history.replaceState({}, '', window.location.pathname);

if (error) {
  status.textContent = `Authorization returned an error: ${error}. No code was received.`;
  copyButton.disabled = true;
} else if (code) {
  codeOutput.textContent = code;
  stateOutput.textContent = state || 'No state parameter was returned.';
  status.textContent = 'Code received. Paste it only into the local application that started this authorization.';
} else {
  status.textContent = 'No authorization code is present. Start the flow from your local application.';
  copyButton.disabled = true;
}

copyButton.addEventListener('click', async () => {
  if (!code) return;
  await navigator.clipboard.writeText(code);
  copyButton.textContent = 'Code copied';
  codeOutput.textContent = '••••••••••••••••';
});
