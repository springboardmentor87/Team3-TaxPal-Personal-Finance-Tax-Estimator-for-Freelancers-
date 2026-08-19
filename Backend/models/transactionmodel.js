const db = require("../config/db");

exports.createTransaction = (transaction, callback) => {
    db.query(
        `INSERT INTO transactions
        (user_id, type, category, amount, date)
        VALUES (?, ?, ?, ?, ?)`,
        [
            transaction.user_id,
            transaction.type,
            transaction.category,
            transaction.amount,
            transaction.date
        ],
        callback
    );
};

exports.getTransactionsByUser = (userId, callback) => {
    db.query(
        `SELECT * FROM transactions
         WHERE user_id = ?
         ORDER BY date DESC`,
        [userId],
        callback
    );
};

exports.deleteTransaction = (id, userId, callback) => {
    db.query(
        `DELETE FROM transactions
         WHERE id = ? AND user_id = ?`,
        [id, userId],
        callback
    );
};