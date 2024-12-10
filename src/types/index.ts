export type LanguageRules = {
    singleLineComment: string;
    multiLineCommentStart: string;
    multiLineCommentEnd: string;
  };
  
export const MULTI_LANGUAGE_RULES: { [key: string]: LanguageRules } = {
    typescript: {
      singleLineComment: "//",
      multiLineCommentStart: "/*",
      multiLineCommentEnd: "*/",
    },
    javascript: {
      singleLineComment: "//",
      multiLineCommentStart: "/*",
      multiLineCommentEnd: "*/",
    },
    java: {
      singleLineComment: "//",
      multiLineCommentStart: "/*",
      multiLineCommentEnd: "*/",
    },
    python: {
      singleLineComment: "#",
      multiLineCommentStart: '"""',
      multiLineCommentEnd: '"""',
    },
  };