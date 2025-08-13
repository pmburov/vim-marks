import * as vscode from "vscode"

export type MarksConfig = {
  showInputIndicator: boolean
  centerScreenAfterJump: boolean
  useSameHotkeyToAddAndGo: boolean
}

export function getConfig(config: vscode.WorkspaceConfiguration): MarksConfig {
  return {
    showInputIndicator: config.get<boolean>('showInputIndicator', true),
    centerScreenAfterJump: config.get<boolean>('centerScreenAfterJump', true),
    useSameHotkeyToAddAndGo: config.get<boolean>('useSameHotkeyToAddAndGo', false)
  }
}
