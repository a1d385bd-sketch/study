import { escapeHtml } from '../store.js';

export function openFormDialog({ title, description = '', fields, submitLabel = 'Save', onSubmit }) {
  const overlay = document.createElement('div');
  overlay.className = 'subject-modal-backdrop';
  const controls = fields.map(field => {
    const required = field.required ? ' required' : '';
    const value = field.value == null ? '' : String(field.value);
    if (field.type === 'select') {
      const options = (field.options || []).map(option => `<option value="${escapeHtml(option.value)}"${String(option.value) === value ? ' selected' : ''}>${escapeHtml(option.label)}</option>`).join('');
      return `<label class="field-label" for="dialog-${escapeHtml(field.name)}">${escapeHtml(field.label)}<select id="dialog-${escapeHtml(field.name)}" name="${escapeHtml(field.name)}"${required}>${options}</select></label>`;
    }
    const type = field.type || 'text';
    const min = field.min == null ? '' : ` min="${escapeHtml(field.min)}"`;
    const max = field.max == null ? '' : ` max="${escapeHtml(field.max)}"`;
    return `<label class="field-label" for="dialog-${escapeHtml(field.name)}">${escapeHtml(field.label)}<input id="dialog-${escapeHtml(field.name)}" name="${escapeHtml(field.name)}" type="${escapeHtml(type)}" value="${escapeHtml(value)}"${min}${max}${required}></label>`;
  }).join('');
  overlay.innerHTML = `<section class="subject-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}"><h3>${escapeHtml(title)}</h3>${description ? `<p>${escapeHtml(description)}</p>` : ''}<form data-dialog-form>${controls}<div class="modal-actions"><button class="secondary-button" type="button" data-dialog-cancel>Cancel</button><button class="primary-button">${escapeHtml(submitLabel)}</button></div></form></section>`;
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKeydown); };
  const onKeydown = event => { if (event.key === 'Escape') close(); };
  overlay.addEventListener('click', event => { if (event.target === overlay || event.target.closest('[data-dialog-cancel]')) close(); });
  overlay.querySelector('[data-dialog-form]').addEventListener('submit', event => {
    event.preventDefault();
    onSubmit(Object.fromEntries(new FormData(event.currentTarget)));
    close();
  });
  document.addEventListener('keydown', onKeydown);
  document.body.append(overlay);
  overlay.querySelector('input,select')?.focus();
  return close;
}
