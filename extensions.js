const vscode = require('vscode');

function activate(context) {
  // Register the formatter
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider('off', {
      provideDocumentFormattingEdits(document) {
        const text = document.getText();
        const formatted = formatIngredients(text);
        const range = new vscode.Range(
          document.positionAt(0),
          document.positionAt(text.length)
        );
        return [vscode.TextEdit.replace(range, formatted)];
      },
    })
  );
}

function formatIngredients(input) {
  let output = '';
  let indent = 0;
  let currentNumber = '';
  let inBrackets = 0;

  function addIndent() {
    return '  '.repeat(indent);
  }

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // Sammele Prozentangaben
    if (!isNaN(char) || char === ',' || char === '.') {
      currentNumber += char;
      continue;
    } else if (currentNumber) {
      output += currentNumber + ' ';
      currentNumber = '';
    }

    // Verarbeite Klammern und Formatierung
    switch (char) {
      case '[':
        inBrackets++;
        output += '[\n';
        indent++;
        output += addIndent();
        break;
      case ']':
        inBrackets--;
        output = output.trimEnd();
        output += '\n';
        indent--;
        output += addIndent() + ']';
        break;
      case '(':
        output += '(\n';
        indent++;
        output += addIndent();
        break;
      case ')':
        output = output.trimEnd();
        output += '\n';
        indent--;
        output += addIndent() + ')';
        break;
      case ',':
        if (inBrackets > 0) {
          output = output.trimEnd();
          output += ',\n' + addIndent();
        } else {
          output += ', ';
        }
        break;
      default:
        output += char;
    }
  }

  return output;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
