export function markdownEscape(
  string: string,
  extra: (string | RegExp)[][] = []
) {
  let escapes = [
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

  return escapes.reduce(function (accumulator, escape) {
    return accumulator.replace(escape[0], escape[1] as string);
  }, string);
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
  ];

  string = markdownEscape(string, extra);

  return string;
}
