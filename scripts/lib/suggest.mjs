// Levenshtein, used to turn "you wrote a name nothing recognises" into "did you mean".

const distance = (a, b) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return d[a.length][b.length];
};

export function nearest(word, options) {
  const best = options
    .map((option) => ({ option, d: distance(word.toLowerCase(), option.toLowerCase()) }))
    .sort((a, b) => a.d - b.d)[0];
  return best && best.d <= Math.max(2, Math.ceil(word.length / 3)) ? best.option : null;
}
