import pool from "../db/connect.js";
import { io } from "../index.js";

export const addUserChoice = async (req, res) => {
  let result = "";
  // io.emit('userChoiceUpdated', { message: 'A new user choice has been added!' });
  let selectedChoices = 0;

  try {
    const { player_id, category_id, selected_number, game_id } = req.body;

    // Check if the player exists
    const playerQuery = "SELECT * FROM user_entity WHERE id = $1";
    const playerResult = await pool.query(playerQuery, [player_id]);
    if (playerResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the category exists
    const categoryQuery = "SELECT * FROM categories WHERE category_id = $1";
    const categoryResult = await pool.query(categoryQuery, [category_id]);
    if (categoryResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    console.log("category is", categoryResult.rows[0]);
    const amount = categoryResult.rows[0].multiplier * 10;
    // console.log("amount is",amount);
    // console.log("amount for one % is ",amount* (40/100));
    // console.log("amount for two % is ",amount* (30/100));
    // console.log("amount for three % is ",amount* (20/100));
    // console.log("amount for fee % is ",amount* (10/100));
    const amount1 = amount * (40 / 100);
    const amount2 = amount * (30 / 100);
    const amount3 = amount * (20 / 100);
    const amount4 = amount * (10 / 100);

    // Check if the selected number has already been chosen for this category and game
    const categoryQueryCheck =
      "SELECT * FROM category_choices WHERE category_id = $1 AND is_selected = true AND available_number=$2 AND game_id = $3";
    const result2 = await pool.query(categoryQueryCheck, [
      category_id,
      selected_number,
      game_id,
    ]);
    if (result2.rowCount > 0) {
      console.log("result is", result2.rows[0]);
      return res.status(400).json({
        success: false,
        message: "Number already selected. Please choose another number.",
      });
    }

    // Insert the user's choice
    const queryText =
      "INSERT INTO user_choices (player_id, category_id, selected_number, game_id) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [player_id, category_id, selected_number, game_id];
    result = await pool.query(queryText, values);

    // Mark the selected number as chosen for this category and game
    const selected_numberQuery =
      "UPDATE category_choices SET is_selected = true WHERE category_id = $1 AND available_number = $2 AND game_id = $3 RETURNING *";
    const selected_numberValues = [category_id, selected_number, game_id];
    const selected_numberResult = await pool.query(
      selected_numberQuery,
      selected_numberValues
    );

    const categoryQueryCheck2 =
      "SELECT * FROM category_choices WHERE category_id = $1 AND game_id = $2 AND is_selected = true";
    const result3 = await pool.query(categoryQueryCheck2, [
      category_id,
      game_id,
    ]);
    console.log("result3 is", result3.rows);

    if (result3.rows.length > 0) {
      let updatedSelectedNumbers = result3.rows.map((choice) => {
        return {
          category: choice.category_id,
          choisedNumber: choice.available_number,
          game: choice.game_id,
        };
      });
      io.emit("selectedNumbers", updatedSelectedNumbers);
      console.log("updatedSelectedNumbers:", updatedSelectedNumbers);
    } else {
      console.log("No data found in result3.rows");
    }

    // Emit an event to inform all clients about the updated choice
    // io.emit('userChoiceUpdated', { player_id,category_id, selected_number, game_id });

    // Check if all choices are selected
    const allChoicesSelectedQuery =
      "SELECT COUNT(*) AS selected_choices FROM category_choices WHERE category_id = $1 AND is_selected = true AND game_id = $2";
    const allChoicesSelectedResult = await pool.query(allChoicesSelectedQuery, [
      category_id,
      game_id,
    ]);
    selectedChoices = parseInt(
      allChoicesSelectedResult.rows[0].selected_choices
    );
    if (selectedChoices === 10) {
      // Generate winners
      const winner1 = getRandomUniqueNumber();
      const winner2 = getRandomUniqueNumber();
      const winner3 = getRandomUniqueNumber();

      const selected_numberQuery1 =
        "SELECT * FROM user_choices WHERE category_id = $1 AND selected_number = $2 AND game_id = $3";
      const selected_numberValues1 = [category_id, winner1, game_id];
      const selected_numberQuery2 =
        "SELECT * FROM user_choices WHERE category_id = $1 AND selected_number = $2 AND game_id = $3";
      const selected_numberValues2 = [category_id, winner2, game_id];
      const selected_numberQuery3 =
        "SELECT * FROM user_choices WHERE category_id = $1 AND selected_number = $2 AND game_id = $3";
      const selected_numberValues3 = [category_id, winner3, game_id];
      // console.log("selected number values: ",selected_numberValues);
      const selected_numberResult1 = await pool.query(
        selected_numberQuery1,
        selected_numberValues1
      );
      const selected_numberResult2 = await pool.query(
        selected_numberQuery2,
        selected_numberValues2
      );
      const selected_numberResult3 = await pool.query(
        selected_numberQuery3,
        selected_numberValues3
      );

      const winner_game1 = selected_numberResult1.rows[0].player_id;
      const winner_game2 = selected_numberResult2.rows[0].player_id;
      const winner_game3 = selected_numberResult3.rows[0].player_id;
      console.log(
        "first winner user id is",
        selected_numberResult1.rows[0].player_id
      );
      console.log(
        "second winner user id is",
        selected_numberResult2.rows[0].player_id
      );
      console.log(
        "third winner user id is",
        selected_numberResult3.rows[0].player_id
      );

      // Insert winners into the database

      // Note: Replace the following placeholders with actual queries to insert winners into your database
      const winner1Query =
        "INSERT INTO winners (player_id,category_id, game_id, prize_amount, position) VALUES ($1, $2, $3, $4, $5)";
      const winner2Query =
        "INSERT INTO winners (player_id,category_id, game_id, prize_amount, position) VALUES ($1, $2, $3, $4, $5)";
      const winner3Query =
        "INSERT INTO winners (player_id,category_id, game_id, prize_amount, position) VALUES ($1, $2, $3, $4, $5)";
      io.emit("gameWon", {
        winners: [
          { position: 1, player_id: winner_game1 },
          { position: 2, player_id: winner_game2 },
          { position: 3, player_id: winner_game3 },
        ],
        category_id,
        game_id,
      });
      io.emit("winnerAdded", {message: "new winner added"})

      await pool.query(
        "UPDATE games SET winning_number = $1 WHERE game_id= $2 AND category_id= $3 ",
        [winner1, game_id, category_id]
      );
      // Execute winner insertion queries (you need to replace the placeholders with actual values)
      await pool.query(winner1Query, [
        winner_game1,
        category_id,
        game_id,
        amount1,
        1,
      ]);
      await pool.query(winner2Query, [
        winner_game2,
        category_id,
        game_id,
        amount2,
        2,
      ]);
      await pool.query(winner3Query, [
        winner_game3,
        category_id,
        game_id,
        amount3,
        3,
      ]);

      await pool.query(
        "INSERT INTO service_fees (category_id, game_id, amount) VALUES ($1, $2, $3)",
        [category_id, game_id, amount4]
      );

      await pool.query(
        "UPDATE games SET is_over=true WHERE game_id= $1 AND category_id= $2 ",
        [game_id, category_id]
      );
      return res.status(200).json({
        success: true,
        message: "Congratulations! You won the game.",
        // You can include any additional data you want to send in the response
      });
    }

    // If not all choices are selected yet, send a success response
    return res.status(201).json({
      success: true,
      message: "User choice added successfully",
      userChoice: result.rows[0],
      selectedNumberResult: selected_numberResult.rows[0],
    });
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error adding user choice:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add user choice",
      error: error.message,
    });
  }
};

export const getUserChoicesByPlayer = async (req, res) => {
  try {
    const player_id = req.params.id;

    const queryText = "SELECT * FROM user_choices WHERE player_id = $1";
    const result = await pool.query(queryText, [player_id]);

    res.status(200).json({
      success: true,
      message: "User choices retrieved successfully",
      userChoices: result.rows,
    });
  } catch (error) {
    console.error("Error retrieving user choices:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user choices",
      error: error.message,
    });
  }
};

export const getUserChoiceByCategory = async (req, res) => {
  try {
    const { player_id, category_id } = req.body;

    const queryText =
      "SELECT * FROM user_choices WHERE player_id = $1 AND category_id = $2";
    const result = await pool.query(queryText, [player_id, category_id]);

    res.status(200).json({
      success: true,
      message: "User choices retrieved successfully",
      userChoices: result.rows,
    });
  } catch (error) {
    console.error("Error retrieving user choices:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user choices",
      error: error.message,
    });
  }
};

let previousWinners = [];

function getRandomUniqueNumber() {
  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * 10) + 1;
  } while (previousWinners.includes(randomNumber)); // Keep generating until a unique number is found

  previousWinners.push(randomNumber); // Store the winner to ensure uniqueness
  console.log("Random unique number: ", randomNumber);
  return randomNumber;
}
