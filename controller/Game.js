import pool from "../db/connect.js";
// import { io } from 'socket.io-client';

export const addGame = async (req, res) => {
    try {
        const category_id = req.params.id;

        console.log("category id", category_id);
        const categoryExistsQuery = 'SELECT * FROM categories WHERE category_id = $1';
        const categoryExists = await pool.query(categoryExistsQuery, [category_id]);

        if (categoryExists.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Category does not exist',
            });
        }

        const gameExistsQuery = 'SELECT * FROM games WHERE category_id = $1 AND is_over = false';
        const gameExists = await pool.query(gameExistsQuery, [category_id]);

        if (gameExists.rows.length === 0) {
            const queryText = 'INSERT INTO games (category_id) VALUES ($1) RETURNING *';
            const values = [category_id];
            const result = await pool.query(queryText, values);
            const game_id = result.rows[0].game_id;

            // Initialize category choices for the new game
            await initializeCategoryChoicesForGame(game_id, category_id);

            return res.status(201).json({
                success: true,
                message: 'Game added successfully',
                game: result.rows[0],
            });
        } else {
            console.log("game id ish:", gameExists.rows[0].game_id);
            return res.status(200).json({
                success: true,
                message: 'Game Exists for this category',
                game: gameExists.rows[0]
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add game',
            error: error.message,
        });
    }
};



// export const addGame = async (req, res) => {
    
//     try {
//         const category_id  = req.params.id;

//         console.log("category id",category_id);
//         const categoryExistsQuery = 'SELECT * FROM categories WHERE category_id = $1';
//         const categoryExists = await pool.query(categoryExistsQuery, [category_id]);

//         const gameExistsQuery = 'SELECT * FROM games WHERE category_id = $1 AND is_over = true';
//         const gameExists = await pool.query(gameExistsQuery, [category_id]);



//         if (categoryExists.rows.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Category does not exist',
//             });
//         }
//         if (gameExists.rows.length === 0) {
//             const queryText = 'INSERT INTO games (category_id) VALUES ($1) RETURNING *';
//         const values = [category_id];
//         const result = await pool.query(queryText, values);
//         const game_id = result.rows[0].game_id;

//            // Initialize category choices for the new game
//            await initializeCategoryChoicesForGame(game_id, category_id);
//         //    io.emit('gameAdded', { message: 'A new game has been added!' });
//         res.status(201).json({
//             success: true,
//             message: 'Game added successfully',
//             game: result.rows[0],
//         });

//         }
//         console.log("game id ish:",gameExists.rows[0].game_id);

//         if(!(gameExists.rows.length === 0)){
//             return res.status(200).json({
//                 success: true,
//                 message: 'Game Exists for this category',
//                 game_id: gameExists.rows[0].game_id
//             });
//         }
        
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to add game',
//             error: error.message,
//         });
//     }
// };

export const getGamesByCategory = async (req, res) => {
    try {
        const  {category_id, game_id}  = req.params;

        const categoryExistsQuery = 'SELECT * FROM categories WHERE category_id = $1';
        const categoryExists = await pool.query(categoryExistsQuery, [category_id]);

        if (categoryExists.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Category does not exist',
            });
        }

        const queryText = 'SELECT * FROM games WHERE category_id = $1 AND game_id = $2';
        const values = [category_id,game_id];
        const result = await pool.query(queryText, values);

        res.status(200).json({
            success: true,
            games: result.rows,
        });
    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Failed to get games',
            error: error.message,
        });
    }
};



// Function to initialize category choices for a new game
const initializeCategoryChoicesForGame = async (game_id, category_id) => {
    try {
        // Get the total number of choices for the category
        const getCategoryQuery = 'SELECT total_choices FROM categories WHERE category_id = $1';
        const categoryResult = await pool.query(getCategoryQuery, [category_id]);
        const totalChoices = categoryResult.rows[0].total_choices;

        // Insert category choices for the new game
        const insertChoicesQuery = `
            INSERT INTO category_choices (category_id, game_id, available_number, is_selected)
            SELECT $1, $2, generate_series(1, $3),FALSE
        `;
        await pool.query(insertChoicesQuery, [category_id, game_id, totalChoices]);
    } catch (error) {
        console.error('Error initializing category choices for game:', error);
        throw error;
    }
};
