const LATEX_SYMBOLS: Record<string, string> = {
  '\\times': '×',
  '\\cdot': '·',
  '\\div': '÷',
  '\\pm': '±',
  '\\mp': '∓',
  '\\approx': '≈',
  '\\leq': '≤',
  '\\geq': '≥',
  '\\neq': '≠',
  '\\infty': '∞',
  '\\degree': '°',
  '\\celsius': '°C',
  '\\omega': 'ω',
  '\\alpha': 'α',
  '\\beta': 'β',
  '\\gamma': 'γ',
  '\\delta': 'δ',
  '\\Delta': 'Δ',
  '\\lambda': 'λ',
  '\\mu': 'μ',
  '\\pi': 'π',
  '\\sigma': 'σ',
  '\\theta': 'θ',
  '\\phi': 'φ',
  '\\rho': 'ρ',
  '\\tau': 'τ',
};

function stripLatexCommands(text: string): string {
  let result = text;

  for (let pass = 0; pass < 4; pass += 1) {
    result = result.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2');
    result = result.replace(
      /\\(?:text|mathrm|mathbf|mathit|operatorname|left|right)\{([^{}]*)\}/g,
      '$1'
    );
  }

  result = result.replace(/\^\{([^{}]*)\}/g, '^$1');
  result = result.replace(/_\{([^{}]*)\}/g, '_$1');

  for (const [command, symbol] of Object.entries(LATEX_SYMBOLS)) {
    result = result.split(command).join(symbol);
  }

  result = result.replace(/\\[,;:!]/g, ' ');
  result = result.replace(/\\([a-zA-Z]+)/g, ' ');
  result = result.replace(/[{}]/g, '');
  result = result.replace(/\s+/g, ' ');

  return result.trim();
}

function replaceMathSegments(text: string, pattern: RegExp): string {
  return text.replace(pattern, (_, expression: string) => stripLatexCommands(expression));
}

/** Convert Gemini-style LaTeX math to readable plain text for the chat UI. */
export function plainTextChatResponse(text: string): string {
  let result = text;

  result = replaceMathSegments(result, /\$\$([\s\S]*?)\$\$/g);
  result = replaceMathSegments(result, /\\\[([\s\S]*?)\\\]/g);
  result = replaceMathSegments(result, /\$([^$\n]+?)\$/g);
  result = replaceMathSegments(result, /\\\(([\s\S]*?)\\\)/g);

  result = result.replace(/\\%/g, '%');
  result = result.replace(/\\_/g, '_');
  result = result.replace(/\\#/g, '#');
  result = result.replace(/\\\$/g, '$');
  result = result.replace(/[ \t]+\n/g, '\n');
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}
