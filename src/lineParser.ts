import * as fs from "fs";
import * as path from "path";
import { LanguageRules, MULTI_LANGUAGE_RULES } from "./types/index"

export class LineParser {
  private blankLines: number = 0;
  private singleLineComments: number = 0; 
  private multiLineComments: number = 0;  
  private codeLines: number = 0;
  private totalLines: number = 0;
  private inMultiLineComment: boolean = false; 

  private isSingleLineComment(line: string, rules: LanguageRules): boolean {
    const trimmed = line.trim();
    return trimmed.startsWith(rules.singleLineComment) && !trimmed.includes(";");
  }

  private isBlankLine(line: string): boolean {
    return line.trim() === "";
  }

  private checkMultiLineComment(line: string, rules:LanguageRules): boolean {
    const trimmed = line.trim();

    if (this.inMultiLineComment) {
      this.multiLineComments++;
      if (trimmed.endsWith(rules.multiLineCommentEnd)) {
        this.inMultiLineComment = false;
      }
      return true; 
    } else if (trimmed.startsWith(rules.multiLineCommentStart)) {
      this.inMultiLineComment = true;
      this.multiLineComments++;
      return true; 
    }
    return false;
  }

  public analyzeFile(filePath: string, language: string): void {
    const lines = fs.readFileSync(filePath, "utf-8").split("\n");
    const rules = MULTI_LANGUAGE_RULES[language];

    for (const line of lines) {
      if (this.isBlankLine(line)) {
        this.blankLines++;
      } else if (this.checkMultiLineComment(line, rules)) {
        // Multi-line comment lines are already handled
      } else if (this.isSingleLineComment(line, rules)) {
        this.singleLineComments++;
      } else {
        this.codeLines++;
      }
    }

    this.totalLines += lines.length;
    console.log(`File: ${filePath}`);
    console.log(`Blank lines: ${this.blankLines}`);
    console.log(`Single-line comment lines: ${this.singleLineComments}`);
    console.log(`Multi-line comment lines: ${this.multiLineComments}`);
    console.log(`Code lines: ${this.codeLines}`);
    console.log(`Total lines: ${lines.length}\n`);
  }


  public resetCounters(): void {
    this.blankLines = 0;
    this.singleLineComments = 0;
    this.multiLineComments = 0;
    this.codeLines = 0;
    this.inMultiLineComment = false;
  }

  public analyzeDirectory(directoryPath: string, language:string): void {
    const files = fs.readdirSync(directoryPath);

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.analyzeDirectory(filePath,language); 
      } else if (filePath?.includes(".")) {
        this.resetCounters();
        this.analyzeFile(filePath, language);
      }
    });
  }

  public printSummary(): void {
    console.log(`Total Blank Lines: ${this.blankLines}`);
    console.log(`Total Single-Line Comment Lines: ${this.singleLineComments}`);
    console.log(`Total Multi-Line Comment Lines: ${this.multiLineComments}`);
    console.log(`Total Code Lines: ${this.codeLines}`);
    console.log(`Total Lines Analyzed: ${this.totalLines}`);
  }
}