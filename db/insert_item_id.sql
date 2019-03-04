INSERT INTO items (item_id, user_id, ACCESS_TOKEN)
VALUES ($1, $2, $3)
RETURNING *;