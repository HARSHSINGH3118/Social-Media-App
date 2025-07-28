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
    SELECT 
      posts.*, 
      users.username,
      ARRAY_REMOVE(ARRAY_AGG(DISTINCT tags.name), NULL) AS tags,
      COALESCE(COUNT(DISTINCT likes.user_id), 0) AS like_count,
      FALSE AS liked_by_user
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    LEFT JOIN post_tags ON posts.id = post_tags.post_id
    LEFT JOIN tags ON post_tags.tag_id = tags.id
    WHERE LOWER(tags.name) = $1
    GROUP BY posts.id, users.username
    ORDER BY posts.created_at DESC
    `,
    [tagName.toLowerCase()]
  );

  return {
    posts: result.rows.map((post) => ({
      id: post.id,
      caption: post.content,
      imageUrl: post.image_url,
      tags: post.tags || [],
      likeCount: parseInt(post.like_count, 10) || 0,
      likedByUser: false,
      createdAt: post.created_at,
      createdBy: { username: post.username },
    })),
  };
}

module.exports = {
  addTagsToPost,
  getPostsByTag,
};
