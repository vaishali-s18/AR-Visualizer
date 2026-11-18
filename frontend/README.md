# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## UPI checkout configuration

Set `VITE_UPI_ID` and `VITE_UPI_NAME` in `frontend/.env.local` to show a merchant UPI QR code. The current checkout is a frontend demo and does not verify payments or receive carrier tracking updates; do not treat its order confirmation as proof of payment.

## Testing AR on a phone

The Vite development server uses a self-signed HTTPS certificate for mobile camera/WebXR access. Connect the phone and computer to the same Wi-Fi, open the computer's LAN address over HTTPS (not `localhost` or `127.0.0.1`), and accept the development certificate warning. Set `VITE_PUBLIC_URL` to an HTTPS-reachable URL when QR links should use a different host. Browser API requests use Vite's same-origin proxy to avoid mixed-content errors.
