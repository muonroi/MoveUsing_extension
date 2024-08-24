import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
		if (document.languageId === 'csharp') {
			handleUsings(document);
		}
	});

	let disposable = vscode.commands.registerCommand('muonroi.moveUsings', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor');
			return;
		}

		if (editor.document.languageId === 'csharp') {
			handleUsings(editor.document);
		} else {
			vscode.window.showErrorMessage('This command is only available for C# files.');
		}
	});

	context.subscriptions.push(disposable);
}

function handleUsings(document: vscode.TextDocument) {
	const documentText = document.getText();
	const usingRegex = /^using .*;/gm;
	const usings = documentText.match(usingRegex);

	if (usings && usings.length > 0) {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
		if (!workspaceFolder) {
			vscode.window.showErrorMessage('No workspace folder found');
			return;
		}

		const csprojFilePath = findCsprojFile(workspaceFolder);
		if (!csprojFilePath) {
			vscode.window.showErrorMessage('No .csproj file found');
			return;
		}

		const projectDir = path.dirname(csprojFilePath);
		const globalUsingPath = path.join(projectDir, 'globalUsing.cs');

		if (!fs.existsSync(globalUsingPath)) {
			fs.writeFileSync(globalUsingPath, '', { encoding: 'utf-8' });
		}

		let globalUsingContent = fs.readFileSync(globalUsingPath, { encoding: 'utf-8' });
		let newContent = documentText;
		let hasChanges = false;

		usings.forEach(using => {
			const globalUsingStatement = `global ${using}`;
			if (globalUsingContent.includes(globalUsingStatement)) {
				newContent = newContent.replace(using, '');
				hasChanges = true;
			} else {
				globalUsingContent += globalUsingStatement + '\n';
				hasChanges = true;
			}
		});

		if (hasChanges) {
			fs.writeFileSync(globalUsingPath, globalUsingContent, { encoding: 'utf-8' });

			newContent = newContent.replace(usingRegex, '');
			newContent = newContent.replace(/^\s*\n*(namespace\s)/, '$1');

			const edit = new vscode.WorkspaceEdit();
			const entireRange = new vscode.Range(
				document.positionAt(0),
				document.positionAt(documentText.length)
			);
			edit.replace(document.uri, entireRange, newContent);
			vscode.workspace.applyEdit(edit);

			vscode.window.showInformationMessage('Usings have been moved or removed as necessary.');
		}
	}
}

function findCsprojFile(dir: string): string | null {
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);

		if (stat.isFile() && file.endsWith('.csproj')) {
			return fullPath;
		} else if (stat.isDirectory()) {
			const csprojInSubDir = findCsprojFile(fullPath);
			if (csprojInSubDir) {
				return csprojInSubDir;
			}
		}
	}

	return null;
}

export function deactivate() {
	vscode.window.showInformationMessage('Extension has been deactivated');
}
