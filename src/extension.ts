import * as vscode from "vscode";
import * as clipboardy from "clipboardy";

export function activate(context: vscode.ExtensionContext) {
  const copyDisposable = vscode.commands.registerCommand(
    "copy-flow.copy",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No active text editor found.");
        return;
      }

      // Copy the editor's content to the clipboard
      const content = editor.document.getText();
      clipboardy.default.writeSync(content);
      vscode.window.showInformationMessage(
        "Editor content copied to clipboard."
      );
    }
  );

  const pasteDisposable = vscode.commands.registerCommand(
    "copy-flow.paste",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No active text editor found.");
        return;
      }

      // Replace the editor's content with the clipboard content
      const clipboardContent = clipboardy.default.readSync();
      await editor.edit((editBuilder) => {
        const documentRange = new vscode.Range(
          editor.document.positionAt(0),
          editor.document.positionAt(editor.document.getText().length)
        );
        editBuilder.replace(documentRange, clipboardContent);
      });
      vscode.window.showInformationMessage(
        "Clipboard content pasted and replaced editor content."
      );
    }
  );

  context.subscriptions.push(copyDisposable);
  context.subscriptions.push(pasteDisposable);

  // Create and show the buttons in the toolbar
  const copyButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  copyButton.text = "$(clippy) Copy";
  copyButton.command = "copy-flow.copy";
  copyButton.tooltip = "Copy editor content";
  copyButton.show();

  const pasteButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  pasteButton.text = "$(diff-insert) Paste";
  pasteButton.command = "copy-flow.paste";
  pasteButton.tooltip = "Paste clipboard content";
  pasteButton.show();
}

// This method is called when your extension is deactivated
export function deactivate() {}
