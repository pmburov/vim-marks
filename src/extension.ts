import * as vscode from "vscode"
import { VimState } from "./vimState"

export function activate(context: vscode.ExtensionContext) {
  VimState.init(context)

  const d1 = vscode.commands.registerCommand("vim-marks.add", () => {
    VimState.add()
  })
  context.subscriptions.push(d1)

  const d2 = vscode.commands.registerCommand("vim-marks.go", () => {
    VimState.go()
  })
  context.subscriptions.push(d2)

  const d3 = vscode.commands.registerCommand("vim-marks.stop", () => {
    VimState.stop()
  })
  context.subscriptions.push(d3)

  const d4 = vscode.commands.registerCommand("vim-marks.center", async () => {
    VimState.center()
  })
  context.subscriptions.push(d4)

  const configChangeListener = vscode.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('vim-marks')) {
      const config = vscode.workspace.getConfiguration("vim-marks")
      VimState.updateConfig(config)
    }
  })
  context.subscriptions.push(configChangeListener)

  return {
    VimState,
  }
}

export { VimState }

export function deactivate() { }
