import * as vscode from "vscode"

export interface IMark {
  name: string
  path: string
  line: number
  col: number
}

export class Marks {
  marks: IMark[]

  constructor(context: vscode.ExtensionContext) {
    this.marks = []

    context.subscriptions.push(vscode.commands.registerCommand("vim-marks.marks", this.showMarks, this))
  }

  get(name: string) {
    return this.marks.findIndex((el) => el.name === name)
  }

  add(name: string, path: string, line: number, col: number) {
    const found = this.get(name)

    if (found > -1) {
      this.marks[found] = {
        ...this.marks[found],
        path,
        line,
        col,
      }
    } else {
      this.marks.push({
        name,
        path,
        line,
        col,
      })
    }
  }

  remove(name: string) {
    this.marks = this.marks.filter((el) => el.name !== name)
  }

  async open(name: string) {
    const found = this.get(name)

    if (found > -1) {
      const mark = this.marks[found]
      const uri = vscode.Uri.file(mark.path)
      const document = await vscode.workspace.openTextDocument(uri)

      await vscode.window.showTextDocument(document)

      const position = new vscode.Position(mark.line, mark.col)
      const editor = vscode.window.activeTextEditor
      if (editor) {
        editor.selection = new vscode.Selection(position, position)
        editor.revealRange(new vscode.Range(position, position))
      }
    }
  }

  async showMarks() {
    const items: vscode.QuickPickItem[] = []

    this.marks.map((el) => {
      items.push({
        label: el.name,
        description: `${el.line + 1} ${el.col + 1}`,
        detail: `${el.path}`,
      })
    })

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a mark to remove it'
    })

    if (selected) {
      this.marks = this.marks.filter((el) => el.name !== selected.label)
    }
  }
}
