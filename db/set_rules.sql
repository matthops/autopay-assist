UPDATE rules 
SET category = $2
WHERE user_id = $1
RETURNING *;

