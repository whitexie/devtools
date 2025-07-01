# Vite DevTools

> [!IMPORTANT]
> This project is still in development. Not yet usable.

### Development Guide

Currently Vite DevTools only supports build time inspection, to develop this project, you first need to build itself to get the Rolldown meta for testing.

Run `pnpm build` first and then run `pnpm dev` to start the dev server.

As the data interface between Rolldown is not yet stable, when you pull the latest code, it's recommended remove the `./packages/devtools/.rolldown` folder and run `pnpm build` again to get the latest log.

## Licenses

This project is licensed under the [MIT License](LICENSE).
