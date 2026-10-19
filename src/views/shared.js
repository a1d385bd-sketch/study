import { escapeHtml } from '../store.js';

export function pageHeading(eyebrow,title,sub,extra=''){return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${sub}</p></div>${extra?`<div class="date-note">${extra}</div>`:''}</div>`;}

export function subjectIcon(s){return s?`<span class="subject-icon" style="--bg:${s.bg||'#f0f1ec'};--fg:${s.tone||'#6c7d70'}">${escapeHtml(s.short||s.name?.slice(0,2)||'—')}</span>`:'<span class="subject-icon">—</span>';}

export function plant(){return `<div class="plant-art" aria-hidden="true"><svg viewBox="0 0 130 150"><path class="stem" d="M65 123C63 90 70 60 61 30M65 90c-10-20-19-28-33-33M67 76c17-14 24-27 25-42M65 105c14-12 25-16 39-17"/><path class="leaf-fill" d="M61 31C42 8 27 22 32 43c13 3 24-1 29-12ZM91 34c-1-22 14-30 25-16-2 17-13 25-24 23ZM32 57C14 44 4 52 10 68c10 4 20 1 24-8ZM105 89c12-20 28-14 25 3-9 9-20 9-28 2Z"/><path class="pot" d="m43 118 44 0-6 24H49Z"/><path class="stem" d="M50 124h31"/></svg></div>`;}
