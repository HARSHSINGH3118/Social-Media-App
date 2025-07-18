// Extract hashtags like #travel, #foodie from text
function extractHashtags(text) {
  const matches = text.match(/#[\w_]+/g);
  if (!matches) return [];
  return [...new Set(matches.map((tag) => tag.slice(1).toLowerCase()))];
}

module.exports = extractHashtags;
