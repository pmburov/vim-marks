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

    // this.decorateLineNumbers()
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

  // createDecorator(text: string) {
  //   // ★
  //   const svgCode = `
  //       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  //           <text x="8" y="12" font-size="10" text-anchor="middle" fill="yellow">${text}</text>
  //       </svg>
  //     `;

  //   const gutterIconUri = `data:image/svg+xml;base64,${Buffer.from(svgCode).toString('base64')}`;


  //   const decorationType = vscode.window.createTextEditorDecorationType({
  //     gutterIconPath: vscode.Uri.parse(gutterIconUri),
  //     gutterIconSize: 'contain',
  //   });

  //   return decorationType
  // }

  // decorateLineNumbers() {
  //   const editor = vscode.window.activeTextEditor
  //   if (!editor) {
  //     return false
  //   }

  //   const linesMap: { [key: number]: string | number } = {}

  //   this.marks.map((mark) => {
  //     if (!linesMap[mark.line]) {
  //       linesMap[mark.line] = mark.name
  //     } else {
  //       if (typeof linesMap[mark.line] === "string") {
  //         linesMap[mark.line] = 2
  //       } else if (typeof linesMap[mark.line] === "number") {
  //         // @ts-expect-error I checked for number above you stupid ts
  //         linesMap[mark.line] += 1
  //       }
  //     }
  //   })

  //   Object.keys(linesMap).map((line) => {
  //     const value = linesMap[Number(line)]
  //     let decorationType: vscode.TextEditorDecorationType

  //     if (typeof value === "string") {
  //       decorationType = this.createDecorator(value)
  //     } else {
  //       decorationType = this.createDecorator('★')
  //     }

  //     const decorations = [{
  //       range: new vscode.Range(Number(line), 0, Number(line), 0)
  //     }]
  //     editor.setDecorations(decorationType, []);
  //     editor.setDecorations(decorationType, decorations);
  //   })
  // }
}
