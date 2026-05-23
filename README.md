# Relay Template Generator

Web UI for [Relay](https://github.com/batthepig-two/Relay) — build copy-pasteable commands for the CLI tool.

**[Open the tool →](https://batthepig-two.github.io/Relay-template_generator/)**

## What it does

Pick your seed, Minecraft version, and one or more search steps (block + search radius + cluster radius). The page generates the exact command to run in your terminal.

All 222 blocks from `blocks.c` are included, grouped by category, with dimension (overworld/nether/end) and Y-range shown.

## Install the CLI

```sh
curl -fsSL https://raw.githubusercontent.com/Batthepig-two/Relay/main/install.sh -o install.sh
sh install.sh
cd Relay
```

Works on macOS, Linux, and [a-Shell](https://holzschu.github.io/a-Shell_iOS/) (iOS).

## Development

```sh
pnpm install
pnpm dev
```

Built with React + Vite + Tailwind CSS. The `docs/` folder is the GitHub Pages build.
