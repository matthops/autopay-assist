INSERT INTO transactions (account_id, account_owner, amount, category, category_id, date, ios_currency_code, location, name, payment_meta, pending, pending_transaction_id, transaction_id, transaction_type, unofficial_currency_code )
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
RETURNING *;