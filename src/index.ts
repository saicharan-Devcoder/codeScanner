import * as fs from "fs";
import { LineParser } from "./lineParser";
import * as path from "path";

const args = process.argv.slice(2,3); 

let language = process.argv.slice(3)[0];

if (args.length === 0) {
  console.error("Usage: ts-node src/index.ts <file-path|directory-path>");
  process.exit(1);
}

const lineParser = new LineParser();

args.forEach((arg) => {
  const fullPath = path.resolve(arg);

  const stat = fs.statSync(fullPath);

  if (stat.isDirectory()) {
    console.log(`\nAnalyzing directory: ${fullPath}`);
    lineParser.analyzeDirectory(fullPath, language);
  } else if (stat.isFile()) {
    console.log(`\nAnalyzing file: ${fullPath}`);
    lineParser.analyzeFile(fullPath, language);
  } else {
    console.error(`Invalid path: ${fullPath}`);
  }
});

lineParser.printSummary();
