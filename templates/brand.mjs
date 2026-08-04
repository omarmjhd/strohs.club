export const NAVY = '#002060';
export const CRIMSON = '#C00840';
export const CREAM = '#F8E8B8';
export const INK = '#1A1A2E';

export const FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">';

export const facts = (data) =>
  (data.keyFacts || [])
    .map(
      (f) =>
        `<div class="fact"><span class="l">${f.label}</span><span class="v">${f.value}</span></div>`
    )
    .join('');
