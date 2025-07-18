const db = require("../config/db");

// Add tags for a post
async function addTagsToPost(post_id, tags) {
  for (const tag of tags) {
    // Insert tag if not exists
    const result = await db.query(
      "INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id",
      [tag]
    );

    // Get tag ID
    const tag_id =
      result.rows[0]?.id ||
      (await db.query("SELECT id FROM tags WHERE name = $1", [tag])).rows[0]
        ?.id;

    // Insert into post_tags
    if (tag_id) {
      await db.query(
        "INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [post_id, tag_id]
      );
    }
  }
}

// Get posts by tag name
async function getPostsByTag(tagName) {
  const result = await db.query(
    `
    SELECT posts.* FROM posts
    JOIN post_tags ON posts.id = post_tags.post_id
    JOIN tags ON tags.id = post_tags.tag_id
    WHERE tags.name = $1
    ORDER BY posts.created_at DESC
    `,
    [tagName.toLowerCase()]
  );
  return result.rows;
}

module.exports = {
  addTagsToPost,
  getPostsByTag,
};
