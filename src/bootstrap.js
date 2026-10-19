const stylesheet = document.getElementById('stylesheet');
const stylesReady = stylesheet.sheet ? Promise.resolve() : new Promise((resolve, reject) => {
  stylesheet.addEventListener('load', resolve, { once: true });
  stylesheet.addEventListener('error', reject, { once: true });
});
try {
  const [app] = await Promise.all([import('./app.js'), stylesReady]);
  app.start();
} catch {
  document.getElementById('game').setAttribute('aria-busy', 'false');
  document.getElementById('loading').textContent = 'The game could not finish loading. Reconnect and reload to try again. Play is available only after all game files have loaded.';
}
