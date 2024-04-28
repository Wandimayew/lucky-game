import { Socket } from "socket.io";
import pool from "../db/connect.js";

export const getWinnersByGame = async (req, res) => {
  try {
    const game_id = req.params.id;

    const gameExistsQuery = "SELECT * FROM games WHERE game_id = $1";
    const gameExists = await pool.query(gameExistsQuery, [game_id]);

    if (gameExists.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Game does not exist",
      });
    }

    const queryText = "SELECT * FROM winners WHERE game_id = $1";
    const values = [game_id];
    const result = await pool.query(queryText, values);

    res.status(200).json({
      success: true,
      winners: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get winners",
      error: error.message,
    });
  }
};

export const getAllWinners = async (req, res) => {
  try {
    console.log("in the method");
    const queryText =
      "SELECT * FROM winners WHERE position = 1 AND created_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'";
    const result = await pool.query(queryText);
    console.log("below it");
    // Assuming the player_id is available in the result from the winners table
    const playerIds = result.rows.map((row) => row.player_id);
    console.log("player ids", playerIds);
    const userQueryText =
      "SELECT id, username FROM user_entity WHERE id = ANY($1)";
    const userResult = await pool.query(userQueryText, [playerIds]);
    console.log("again below it", userResult.rows);
    // Create a map of user ids to usernames
    const userIdToUsernameMap = {};
    userResult.rows.forEach((row) => {
      userIdToUsernameMap[row.id] = row.username;
    });
    console.log("userIdToUsernameMap", userIdToUsernameMap);

    // Combine user names with winners data
    const winnersWithUserNames = result.rows.map((row) => ({
      ...row,
      user_name: userIdToUsernameMap[row.player_id], // Map the username using player_id
    }));

    console.log("winners with usernames", winnersWithUserNames);

    res.status(200).json({
      success: true,
      winners: winnersWithUserNames,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get winners",
      error: error.message,
    });
  }
};


export const getWinnerCount=async(req,res)=>{
    try {
      const count=await pool.query("SELECT COUNT(*) AS winners_count FROM winners;");
      return res.status(200).json({
        success: true,
        message: "Winner Count fetched.",
        count: count.rows[0].winners_count
      })
      
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Winners Count Not fetched.",
        error: error.message
      })
      
    }
  }
