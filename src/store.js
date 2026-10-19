const KEY = 'studyloop-state-v2';
export const seed = {
  subjects: [], cards: [], page: 'today', mode: 'recall', card: 0, answerVisible: false,
  name: '', year: '', course: '', decks: [], quizResults: [], quizDraft: [], quizRun: null,
  plannerNotes: '', aiMessages: [], maps: [], activeMap: '', sacs: [], activeSubject: '',
  mistakes: [], sessions: [], blurtings: [], weeklyTarget: null
};
const arrayKeys = ['subjects','cards','decks','quizResults','quizDraft','maps','sacs','mistakes','sessions','blurtings','aiMessages'];
function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return structuredClone(seed);
    const value = { ...structuredClone(seed), ...stored };
    for (const key of arrayKeys) if (!Array.isArray(value[key])) value[key] = []; else value[key] = value[key].filter(item => item && typeof item === 'object' && !Array.isArray(item));
    if (!['today','practice','study','ai','quizzes','progress','planner','settings','mindmaps','revision','subject'].includes(value.page)) value.page = 'today';
    for (const key of ['subjects','cards','decks','maps','sacs','mistakes','sessions']) {
      for (const item of value[key]) if (!item.id) item.id = crypto.randomUUID();
    }
    for (const item of value.subjects) { if (!Array.isArray(item.areas)) item.areas = []; if (!Array.isArray(item.assessments)) item.assessments = []; }
    for (const item of value.decks) if (!Array.isArray(item.items)) item.items = [];
    for (const map of value.maps) { if (!Array.isArray(map.nodes)) map.nodes = []; for (const node of map.nodes) if (!node.id) node.id = crypto.randomUUID(); }
    return value;
  } catch { return structuredClone(seed); }
}
export const state = loadState();
export const cards = state.cards;
export const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch { return false; } };
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
export const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"></use></svg>`;
export const toast = message => {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message; el.classList.add('show'); clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2400);
};
export const subject = id => state.subjects.find(item => item.id === id) || null;
export const dayKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const dueCards = () => state.cards.filter(card => !card.suspended && (!card.due || card.due <= dayKey()));
export const dueMistakes = () => state.mistakes.filter(item => !item.mastered && (!item.due || item.due <= dayKey()));
export const completedSessions = () => state.sessions.filter(item => item.completed);
export const getStreak = () => {
  const days = new Set(completedSessions().map(session => session.date)); const date = new Date(); let count = 0;
  if (!days.has(dayKey(date))) date.setDate(date.getDate()-1);
  while (days.has(dayKey(date))) { count++; date.setDate(date.getDate()-1); }
  return count;
};
export const escapeHtml = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));