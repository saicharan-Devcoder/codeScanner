import * as fs from "fs";
import * as path from "path";
import { Stats } from "fs";
// Mocking fs and path
jest.mock("fs");

import { LineParser } from "../src/lineParser";


jest.mock("path");

// Mock Language Rules
jest.mock("../src/types", () => ({
  MULTI_LANGUAGE_RULES: {
    javascript: {
      singleLineComment: "//",
      multiLineCommentStart: "/*",
      multiLineCommentEnd: "*/",
    },
    python: {
      singleLineComment: "#",
      multiLineCommentStart: '"""',
      multiLineCommentEnd: '"""',
    },
  },
}));

const mockedFs = fs as jest.Mocked<typeof fs>;

const mockedPath = path as jest.Mocked<typeof path>;

describe("LineParser Class Tests", () => {
  let parser: LineParser;

  beforeEach(() => {
    parser = new LineParser();
    jest.clearAllMocks();
  });

  test("analyzeFile should correctly count blank lines, comments, and code lines", () => {
    const filePath = "/path/to/file.js";
    const fileContent = `// This is a comment
      let x = 10; 
      
      /* Start multi-line comment
      End of comment */
      
      console.log(x);`;
  
    mockedFs.readFileSync.mockReturnValue(fileContent);
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
  
    // Call the method under test
    parser.analyzeFile(filePath, "javascript");
  
    // Assertions
    expect(mockedFs.readFileSync).toHaveBeenCalledWith(filePath, "utf-8");
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Blank lines: 2")); // Updated
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Single-line comment lines: 1"));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Multi-line comment lines: 2"));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Code lines: 2"));
  
    // Cleanup
    consoleLogSpy.mockRestore();
  });
  

  test("analyzeFile handles files with no comments", () => {
    const filePath = "/path/to/file.js";
    const fileContent = `let x = 10;\nconsole.log(x);`;
  
    // Mock console.log
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
  
    // Mock readFileSync
    mockedFs.readFileSync.mockReturnValue(fileContent);
  
    // Call the method under test
    parser.analyzeFile(filePath, "javascript");
  
    // Assertions
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Blank lines: 0"));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Single-line comment lines: 0"));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Multi-line comment lines: 0"));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Code lines: 2"));
  
    // Cleanup: Restore console.log
    consoleLogSpy.mockRestore();
  });
  

  test("analyzeDirectory should traverse files and directories", () => {
    const directoryPath = "/path/to";
  
    // Mocked Dirent objects
    const files: fs.Dirent[] = [
      { name: "file1.js", isFile: () => true, isDirectory: () => false } as fs.Dirent,
      { name: "subdir", isFile: () => false, isDirectory: () => true } as fs.Dirent,
    ];
  
    const subDirFiles: fs.Dirent[] = [
      { name: "file2.js", isFile: () => true, isDirectory: () => false } as fs.Dirent,
    ];
  
    // Mock readdirSync
    mockedFs.readdirSync.mockImplementation((dirPath: string) => {
      if (dirPath === directoryPath) return files;
      if (dirPath === path.join(directoryPath, "subdir")) return subDirFiles;
      throw new Error(`Unexpected directory path: ${dirPath}`);
    });
  
    // Mock statSync
    mockedFs.statSync.mockImplementation((filePath: string) => {
      if (filePath === path.join(directoryPath, "file1.js") ||
          filePath === path.join(directoryPath, "subdir", "file2.js")) {
        return { isDirectory: () => false, isFile: () => true } as fs.Stats;
      } else if (filePath === path.join(directoryPath, "subdir")) {
        return { isDirectory: () => true, isFile: () => false } as fs.Stats;
      }
      throw new Error(`Unexpected path: ${filePath}`);
    });
  
    // Call the method under test
    parser.analyzeDirectory(directoryPath, "javascript");
  
    // Verify readdirSync was called for the directory and subdirectory
    expect(mockedFs.readdirSync).toHaveBeenCalledTimes(1);
    expect(mockedFs.readdirSync).toHaveBeenCalledWith(directoryPath);
    expect(mockedFs.readdirSync).toHaveBeenCalledWith('/path/to');
  
    // Verify statSync was called correctly
    expect(mockedFs.statSync).toHaveBeenCalledWith(path.join(directoryPath, "file1.js"));
    expect(mockedFs.statSync).toHaveBeenCalledWith(path.join(directoryPath, "subdir"));
    expect(mockedFs.statSync).toHaveBeenCalledWith(path.join(directoryPath, "subdir", "file2.js"));
  });
  
  

  test("printSummary prints cumulative results", () => {
    parser["blankLines"] = 10;
    parser["singleLineComments"] = 5;
    parser["multiLineComments"] = 3;
    parser["codeLines"] = 20;
    parser["totalLines"] = 38;

    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    parser.printSummary();

    expect(consoleSpy).toHaveBeenCalledWith("Total Blank Lines: 10");
    expect(consoleSpy).toHaveBeenCalledWith("Total Single-Line Comment Lines: 5");
    expect(consoleSpy).toHaveBeenCalledWith("Total Multi-Line Comment Lines: 3");
    expect(consoleSpy).toHaveBeenCalledWith("Total Code Lines: 20");
    expect(consoleSpy).toHaveBeenCalledWith("Total Lines Analyzed: 38");
  });
});

describe("Index.ts Tests", () => {
  let mockExit: jest.SpyInstance;
  let mockConsoleError: jest.SpyInstance;

  beforeEach(() => {
    mockExit = jest.spyOn(process, "exit").mockImplementation(() => undefined as never);
    mockConsoleError = jest.spyOn(console, "error").mockImplementation();
    jest.clearAllMocks();
  });

  test("index.ts exits with error on missing arguments", () => {
    process.argv = ["node", "index.ts"];
    require("../src/index");

    expect(mockConsoleError).toHaveBeenCalledWith("Usage: ts-node src/index.ts <file-path|directory-path>");
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  // test("index.ts handles file input", () => {
  //   process.argv = ["node", "index.ts", "file.js", "javascript"];
  //   const mockStatSync = jest.spyOn(fs, "statSync").mockReturnValue({ isFile: () => true, isDirectory: () => false });

  //   const mockAnalyzeFile = jest.spyOn(LineParser.prototype, "analyzeFile").mockImplementation();

  //   require("./index");

  //   expect(mockStatSync).toHaveBeenCalledWith(expect.stringContaining("file.js"));
  //   expect(mockAnalyzeFile).toHaveBeenCalledWith(expect.stringContaining("file.js"), "javascript");
  // });

  // test("index.ts handles directory input", () => {
  //   process.argv = ["node", "index.ts", "dirPath", "javascript"];
  //   const mockStatSync = jest.spyOn(fs, "statSync").mockReturnValue({ isFile: () => false, isDirectory: () => true });

  //   const mockAnalyzeDirectory = jest.spyOn(LineParser.prototype, "analyzeDirectory").mockImplementation();

  //   require("./index");

  //   expect(mockStatSync).toHaveBeenCalledWith(expect.stringContaining("dirPath"));
  //   expect(mockAnalyzeDirectory).toHaveBeenCalledWith(expect.stringContaining("dirPath"), "javascript");
  // });
});
