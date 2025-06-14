export function markdownEscape(
  string: string,
  extra: (string | RegExp)[][] = [],
) {
  const escapes = [
    [/\\/g, "\\\\"],
    [/\*/g, "\\*"],
    [/^-/g, "\\-"],
    [/^\+ /g, "\\+ "],
    [/^(=+)/g, "\\$1"],
    [/^(#{1,6}) /g, "\\$1 "],
    [/`/g, "\\`"],
    [/^~~~/g, "\\~~~"],
    [/\[/g, "\\["],
    [/\]/g, "\\]"],
    [/^>/g, "\\>"],
    [/_/g, "\\_"],
    [/^(\d+)\. /g, "$1\\. "],
    [/\(/g, "\\("],
    [/\)/g, "\\)"],
    ...extra,
  ];

  return escapes.reduce(
    (accumulator, x) => accumulator.replace(x[0], x[1] as string),
    string,
  );
}

export function telegramMarkdownEscape(string: string) {
  const extra = [
    [/-/g, "\\-"],
    [/\./g, "\\."],
    [/\+/g, "\\+"],
    [/\|/g, "\\|"],
    [/=/g, "\\="],
    [/>/g, "\\>"],
    [/#/g, "\\#"],
    [/!/g, "\\!"],
  ];

  return markdownEscape(string, extra);
}
