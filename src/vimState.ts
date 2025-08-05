import * as vscode from "vscode"
import { Marks } from "./marks"

export type Mode = "NORMAL" | "INSERT" | "VISUAL" | "VISUAL_LINE"
export type SubMode = "OPERATOR_PENDING" | "MULTI_CURSOR" | "NONE"

export class VimState {
  static statusBar: vscode.StatusBarItem
  static marks: Marks
  static listenForInput: boolean
  static isAdd: boolean

  static init(context: vscode.ExtensionContext) {
    this.listenForInput = false
    this.isAdd = false

    this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10)
    context.subscriptions.push(this.statusBar)

    this.marks = new Marks(context)
  }

  static add() {
    const config = vscode.workspace.getConfiguration("vim-marks")

    this.isAdd = true
    this.listenForInput = true

    if (config.get("showInputIndicator")) {
      this.statusBar.text = "Input mark"
      this.statusBar.show()
    }
  }

  static go() {
    const config = vscode.workspace.getConfiguration("vim-marks")

    this.isAdd = false
    this.listenForInput = true

    if (config.get("showInputIndicator")) {
      this.statusBar.text = "Input mark"
      this.statusBar.show()
    }
  }

  static stop() {
    this.isAdd = false
    this.listenForInput = false
    this.statusBar.text = ""
    this.statusBar.hide()
  }

  static async type(text: string) {
    if (this.listenForInput) {
      const config = vscode.workspace.getConfiguration("vim-marks")

      if (config.get("useSameHotkeyToAddAndGo")) {
        const found = this.marks.get(text)

        if (found > -1) {
          this.statusBar.text = ""
          this.statusBar.hide()
          this.marks.open(text)
          return true
        }
      }

      const editor = vscode.window.activeTextEditor
      if (!editor) {
        return false
      }

      const cursor = editor?.selections[0].active

      if (this.isAdd) {
        this.marks.add(
          text,
          vscode.window.activeTextEditor?.document.uri.path || "",
          cursor.line,
          cursor.character,
        )

        this.isAdd = false
      } else {
        this.marks.open(text)
      }

      this.statusBar.text = ""
      this.statusBar.hide()
      this.listenForInput = false
    } else {
      vscode.commands.executeCommand("default:type", { text: text })
    }
  }
}
