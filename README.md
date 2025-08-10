# Vim-Marks

In Vim you can press `m` and any character to mark an exact position in the file, then, wherever you are in the code, press ` (backtick) and the same character to return to that exact position in that exact file.

Vim-Marks extension brings the same feature to VS Code.

## Demo

https://github.com/user-attachments/assets/51664812-1128-4197-9108-6f870b183e20

## Default hotkeys

Hotkeys and commands activate input mode to enter a single character

- `alt+'` - Add a mark
- `alt+;` - Go to mark

## Available commands

- Vim-Marks: Show Marks
- Vim-Marks: Add mark
- Vim-Marks: Go to mark
- Vim-Marks: Clear all Marks

## How to build locally

Run `npm run deps` once, it will globally install `@vscode/vsce` necessary for creating `.vsix` package

```bash
npm run build
npm run pack
```

Drag and drop `.vsix` package into Extensions sidebar area inside VS Code
