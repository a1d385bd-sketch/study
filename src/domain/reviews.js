export function applyCardRating(card, rating, mistakes, now = new Date()) {
  let days = Number(card.interval) || 0;
  card.repetitions = Number(card.repetitions) || 0;
  card.ease = Number(card.ease) || 2.5;
  if (rating === 'again') {
    days = 1; card.repetitions = 0; card.ease = Math.max(1.3, card.ease - 0.2);
    mistakes.push({ id: crypto.randomUUID(), prompt: card.prompt, answer: card.answer, source: 'Flashcard review', subject: card.subject, due: dayKey(new Date(now.getTime() + 86400000)), mastered: false });
  } else if (rating === 'good') {
    days = card.repetitions === 0 ? 1 : card.repetitions === 1 ? 3 : Math.max(1, Math.round(days * card.ease)); card.repetitions++;
  } else if (rating === 'hard') {
    days = Math.max(1, Math.round((days || 1) * 1.2)); card.repetitions++;
  } else if (rating === 'easy') {
    days = Math.max(2, Math.round((days || 1) * (card.ease + 0.3))); card.repetitions++; card.ease += 0.15;
  } else throw new Error(`Unknown review rating: ${rating}`);
  card.interval = days; card.due = dayKey(new Date(now.getTime() + days * 86400000));
  card.lastReviewed = dayKey(now); card.reviewCount = (card.reviewCount || 0) + 1;
  return card.due;
}
function dayKey(date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
