const transactionModel = require("../models/transactionModel");

exports.createTransaction = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const { type, category, amount, date } = req.body;

    if (!type || !category || !amount || !date) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    transactionModel.createTransaction(
        {
            user_id: req.session.user.id,
            type,
            category,
            amount,
            date
        },
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create transaction"
                });
            }

            res.json({
                success: true,
                message: "Transaction created successfully",
                transactionId: result.insertId
            });
        }
    );
};

exports.getTransactions = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    transactionModel.getTransactionsByUser(
        req.session.user.id,
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch transactions"
                });
            }

            res.json({
                success: true,
                transactions: result
            });
        }
    );
};

exports.deleteTransaction = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const transactionId = req.params.id;

    transactionModel.deleteTransaction(
        transactionId,
        req.session.user.id,
        (err) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete transaction"
                });
            }

            res.json({
                success: true,
                message: "Transaction deleted successfully"
            });
        }
    );
};