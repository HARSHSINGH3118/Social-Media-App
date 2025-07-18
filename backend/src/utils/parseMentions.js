// Extract @mentions from a string (e.g., "Hello @john_doe and @alice!")
function extractMentions(text) {
  const mentions = text.match(/@[\w_]+/g);
  if (!mentions) return [];
  return [...new Set(mentions.map((m) => m.slice(1).toLowerCase()))]; // remove '@'
}

module.exports = extractMentions;
