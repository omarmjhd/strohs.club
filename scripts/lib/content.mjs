import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import { COMPETITIONS_DIR, publicAsset } from './paths.mjs';

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

export function listCompetitions() {
  return fs
    .readdirSync(COMPETITIONS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(COMPETITIONS_DIR, f));
}

export function loadComponent(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  return { data, content, bodyHtml: md.render(content), bodyMd: content };
}

export function loadCompetitions() {
  return listCompetitions()
    .map((file) => loadComponent(file))
    .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
}

export function dataUri(file) {
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
  return `data:${mime};base64,` + fs.readFileSync(file).toString('base64');
}

export function heroFile(data) {
  return data.hero ? publicAsset(data.hero) : null;
}
