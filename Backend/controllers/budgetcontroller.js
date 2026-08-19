const budgetModel = require("../models/budgetModel");

exports.createBudget = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const { category, limit, month } = req.body;

    if (!category || !limit || !month) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    budgetModel.createBudget(
        {
            user_id: req.session.user.id,
            category,
            limit,
            month
        },
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create budget"
                });
            }

            res.json({
                success: true,
                message: "Budget created successfully",
                budgetId: result.insertId
            });
        }
    );
};

exports.getBudgets = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    budgetModel.getBudgetsByUser(
        req.session.user.id,
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch budgets"
                });
            }

            res.json({
                success: true,
                budgets: result
            });
        }
    );
};

exports.deleteBudget = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const budgetId = req.params.id;

    budgetModel.deleteBudget(
        budgetId,
        req.session.user.id,
        (err) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete budget"
                });
            }

            res.json({
                success: true,
                message: "Budget deleted successfully"
            });
        }
    );
};

exports.updateBudget = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const budgetId = req.params.id;
    const { category, limit, month } = req.body;

    if (!category || !limit || !month) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    budgetModel.updateBudget(
        budgetId,
        req.session.user.id,
        { category, limit, month },
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update budget"
                });
            }

            res.json({
                success: true,
                message: "Budget updated successfully"
            });
        }
    );
};