const params = new URLSearchParams(window.location.search);
const code = params.get('code') || '';
const state = params.get('state') || '';
const error = params.get('error') || '';
const errorDescription = params.get('error_description') || '';
const fullUrl = window.location.href;

const status = document.querySelector('#nv-oauth-status');
const success = document.querySelector('#nv-oauth-success');
const errorPanel = document.querySelector('#nv-oauth-error');
const copyStatus = document.querySelector('#nv-copy-status');
const codeOutput = document.querySelector('#nv-oauth-code');
const stateOutput = document.querySelector('#nv-oauth-state');
const urlOutput = document.querySelector('#nv-oauth-url');

// Display the complete original callback, then remove sensitive parameters from the address bar.
if (window.location.search) window.history.replaceState({}, '', window.location.pathname);

if (error) {
  status.textContent = 'Authorization returned an error. No action was completed.';
  errorPanel.hidden = false;
  document.querySelector('#nv-oauth-error-code').textContent = error;
  document.querySelector('#nv-oauth-error-description').textContent = errorDescription || 'No error description was returned.';
} else if (code) {
  status.textContent = 'Authorization received.';
  success.hidden = false;
  codeOutput.textContent = code;
  stateOutput.textContent = state || 'No state parameter was returned.';
  urlOutput.textContent = fullUrl;
} else {
  status.textContent = 'No authorization code or error is present. Start the flow from the local tool.';
}

async function copyValue(value, label) {
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    copyStatus.textContent = `${label} copied.`;
  } catch {
    copyStatus.textContent = `Clipboard access was unavailable. Select and copy the displayed ${label.toLowerCase()} manually.`;
  }
}

document.querySelector('#nv-copy-code').addEventListener('click', () => copyValue(code, 'Code'));
document.querySelector('#nv-copy-url').addEventListener('click', () => copyValue(fullUrl, 'Full URL'));
document.querySelector('#nv-copy-error-url').addEventListener('click', () => copyValue(fullUrl, 'Full URL'));
