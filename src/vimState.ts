import * as vscode from "vscode"
import { Marks } from "./marks"

export class VimState {
  static statusBar: vscode.StatusBarItem
  static marks: Marks
  static listenForInput: boolean
  static isAdd: boolean
  static typeHandler: vscode.Disposable | null = null

  static init(context: vscode.ExtensionContext) {
    this.listenForInput = false
    this.isAdd = false

    this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10)
    context.subscriptions.push(this.statusBar)

    this.marks = new Marks(context)
  }

  static regTypeHandler() {
    this.typeHandler = vscode.commands.registerCommand("type", (text) => {
      this.type(text.text)
    })
  }

  static add() {
    this.regTypeHandler()
    const config = vscode.workspace.getConfiguration("vim-marks")

    this.isAdd = true
    this.listenForInput = true

    if (config.get("showInputIndicator")) {
      this.statusBar.text = "Input mark"
      this.statusBar.show()
    }
  }

  static go() {
    this.regTypeHandler()
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
    if (this.typeHandler) {
      this.typeHandler.dispose()
      this.typeHandler = null
    }
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
    if (this.typeHandler) {
      this.typeHandler.dispose()
      this.typeHandler = null
    }
  }
}
