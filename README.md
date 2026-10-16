# Snekworld

A static browser game. No install, server, database, login, or external API is required.
Open `index.html` in a browser and use arrow keys or WASD. Click **Re-Snek** after a round.
All scripts and styles are local; the game makes no API calls and uses no third-party assets.

The score is shown for the current round only and is not saved.

## GitHub Pages

In repository Settings → Pages, select **GitHub Actions** as the publishing source.
The included workflow tests and publishes on pushes to `main` or `master`, or manual dispatch.
Only `index.html`, `.nojekyll`, and `assets/` are published. Relative asset URLs support
project sites such as `/snekworld/`. No secrets or runtime services are needed.
The game source is included directly in `assets/`; submodule checkout is unnecessary.

## Checks

With Node.js 22 or newer, run `npm test`. No dependency installation is needed.
