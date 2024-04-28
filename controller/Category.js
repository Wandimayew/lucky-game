import pool from "../db/connect.js";
import { io } from "../index.js";

export const getCategory=async(req,res)=>{
    try {
      const queryText = 'SELECT * FROM categories';
      const result = await pool.query(queryText);
  
      res.status(200).json({
        success: true,
        categories: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get categories',
        error: error.message,
      });
    }
  
  }
  
  export const addCategory = async (req, res) => {
    try {
      const { name, multiplier, total_choices } = req.body;
  
      const queryText = 'INSERT INTO categories (name, multiplier, total_choices) VALUES ($1, $2, $3) RETURNING *';
      const values = [name, multiplier, total_choices];
      const result = await pool.query(queryText, values);
  
      io.emit("categoryAdded", {message: "new Category added"})
      res.status(201).json({
        success: true,
        message: 'Category added successfully',
        category: result.rows[0], 
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to add category',
        error: error.message,
      });
    }
  };
  
  
  export const getNotSelectedChoice=async(req,res)=>{
    try {
      const { categoryId,gameId } = req.body;
      console.log("category id is", categoryId);
      console.log("game id is", gameId);
      const categoryQueryCheck2 = 'SELECT * FROM category_choices WHERE category_id = $1 AND game_id = $2 AND is_selected = true';
      const result3 = await pool.query(categoryQueryCheck2, [categoryId, gameId]);
      console.log("result3 is", result3.rows);
      
          if (result3.rows.length > 0) {
            let updatedSelectedNumbers = result3.rows.map((choice) => {
              return {
                category: choice.category_id,
                choisedNumber: choice.available_number,
                game: choice.game_id
              };
            });
            io.emit("selectedNumbers", updatedSelectedNumbers);
            console.log("updatedSelectedNumbers:", updatedSelectedNumbers);
          } else {
            console.log("No datas found in result3.rows");
          }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get categories',
        error: error.message,
      });
    }
  
  }

  export const getCategoryCount=async(req,res)=>{
    try {
      const count=await pool.query("SELECT COUNT(*) AS category_count FROM categories;");
      return res.status(200).json({
        success: true,
        message: "Category Count fetched.",
        count: count.rows[0].category_count
      })
      
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Category Count Not fetched.",
        error: error.message
      })
      
    }
  }