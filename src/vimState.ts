import * as vscode from "vscode"
import { Marks } from "./marks"
import { getConfig, MarksConfig } from "./config"

export class VimState {
  static statusBar: vscode.StatusBarItem
  static marks: Marks
  static listenForInput: boolean
  static isAdd: boolean
  static typeHandler: vscode.Disposable | null = null
  static config: MarksConfig

  static init(context: vscode.ExtensionContext) {
    this.listenForInput = false
    this.isAdd = false

    this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10)
    context.subscriptions.push(this.statusBar)

    this.marks = new Marks(context)
    vscode.commands.executeCommand("setContext", "vim-marks.mode", "")

    const config = vscode.workspace.getConfiguration("vim-marks")
    this.config = getConfig(config)
  }

  static updateConfig(config: vscode.WorkspaceConfiguration) {
    this.config = getConfig(config)
  }

  static regTypeHandler() {
    this.typeHandler = vscode.commands.registerCommand("type", (text) => {
      this.type(text.text)
    })
  }

  static add() {
    vscode.commands.executeCommand("setContext", "vim-marks.mode", "input")
    this.regTypeHandler()

    this.isAdd = true
    this.listenForInput = true

    if (this.config.showInputIndicator) {
      this.statusBar.text = "Input mark"
      this.statusBar.show()
    }
  }

  static go() {
    vscode.commands.executeCommand("setContext", "vim-marks.mode", "input")
    this.regTypeHandler()

    this.isAdd = false
    this.listenForInput = true

    if (this.config.showInputIndicator) {
      this.statusBar.text = "Input mark"
      this.statusBar.show()
    }
  }

  static async center() {
    const currentLineNumber = vscode.window.activeTextEditor?.selection.start.line;
    await vscode.commands.executeCommand("revealLine", {
      lineNumber: currentLineNumber,
      at: "center"
    });
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
    vscode.commands.executeCommand("setContext", "vim-marks.mode", "")
  }

  static async type(text: string) {
    if (this.listenForInput) {
      if (this.config.useSameHotkeyToAddAndGo) {
        const found = this.marks.get(text)

        if (found > -1) {
          this.statusBar.text = ""
          this.statusBar.hide()
          this.marks.open(text)
          this.stop()
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

      this.stop()
    } else {
      vscode.commands.executeCommand("default:type", { text: text })
    }
  }
}
