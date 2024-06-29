const ts = require("typescript");
const fs = require("fs");
const path = require("path");

const configPath = "./ts.config.json"; // Adjust path as per your project structure
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);

if (configFile.error) {
  console.error("Error reading tsconfig.json:", configFile.error.messageText);
  process.exit(1);
}

const configParseResult = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  path.dirname(configPath)
);

const program = ts.createProgram({
  rootNames: configParseResult.fileNames,
  options: configParseResult.options,
});

const emitResult = program.emit();

const allDiagnostics = ts
  .getPreEmitDiagnostics(program)
  .concat(emitResult.diagnostics);

allDiagnostics.forEach((diagnostic) => {
  if (diagnostic.file) {
    const { line, character } =
      diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    const message = ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      "\n"
    );
    console.log(
      `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
    );
  } else {
    console.log(
      ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
    );
  }
});

const exitCode = emitResult.emitSkipped ? 1 : 0;
process.exit(exitCode);
