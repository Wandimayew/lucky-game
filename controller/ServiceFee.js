import pool from "../db/connect.js";

export const getServiceFeesByCategory = async (req, res) => {
    try {
        const category_id  = req.params.id;

        const categoryExistsQuery = 'SELECT * FROM categories WHERE category_id = $1';
        const categoryExists = await pool.query(categoryExistsQuery, [category_id]);

        if (categoryExists.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Category does not exist',
            });
        }

        const queryText = 'SELECT * FROM service_fees WHERE category_id = $1';
        const values = [category_id];
        const result = await pool.query(queryText, values);

        res.status(200).json({
            success: true,
            serviceFees: result.rows,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get service fees',
            error: error.message,
        });
    }
};

