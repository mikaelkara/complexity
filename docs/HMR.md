This project supports HMR for both content script UIs and Extension UI (Options Page, Popup, Sidepanel, etc.). However, there are several caveats:

- **ALWAYS** explicitly specify the port number for the dev server in `vite.config.ts`. Using the wrong port will result in HMR not working.
- **DO NOT** use inline imports in background scripts/service workers, as this will completely break the HMR.
- The "HMR" term indicates support only for React components and directly imported CSS modules. Everything else including inline-imported (`?inline`) CSS modules, constants, utilities, etc. will require a hard page reload to take effect.
