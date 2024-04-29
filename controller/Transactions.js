import pool from "../db/connect.js";

export const addTransaction = async (req, res) => {
  try {
    const { player_id, category_id, game_id, amount, description } = req.body;

    console.log("amount comes: ", amount);
    const playerExistsQuery = "SELECT * FROM user_entity WHERE id = $1";
    const playerExists = await pool.query(playerExistsQuery, [player_id]);

    if (playerExists.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Player does not exist",
      });
    }

    const gameQuery = "SELECT * FROM games WHERE game_id = $1";
    const gameResult = await pool.query(gameQuery, [game_id]);
    if (gameResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }
    const playerBalanceExistsQuery =
      "SELECT ua.value AS balance FROM USER_ATTRIBUTE ua WHERE ua.user_id = $1 AND ua.name = $2";
    const playerBalance = await pool.query(playerBalanceExistsQuery, [
      player_id,
      "balance",
    ]);

    console.log("player balance", playerBalance.rows[0]);
    if (playerBalance.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Balance not found for the player",
      });
    }

    console.log("Player balance:", playerBalance.rows[0].balance);
    if (amount > playerBalance.rows[0].balance) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }
    const newBalance = playerBalance.rows[0].balance - amount;
    console.log("new balance", newBalance);
    const updateBalanceQuery =
      "UPDATE USER_ATTRIBUTE SET value = $1 WHERE user_id = $2 AND name = $3";
    await pool.query(updateBalanceQuery, [newBalance, player_id, "balance"]);

    console.log("Balance updated successfully");

    const categoryExistsQuery =
      "SELECT * FROM categories WHERE category_id = $1";
    const categoryExists = await pool.query(categoryExistsQuery, [category_id]);

    if (categoryExists.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Category does not exist",
      });
    }

    const queryText =
      "INSERT INTO transactions (player_id,game_id, category_id, amount, description) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [player_id, game_id, category_id, amount, description];
    const result = await pool.query(queryText, values);

    res.status(201).json({
      success: true,
      transaction: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add transaction",
      error: error.message,
    });
  }
};

export const getTransactionsByPlayer = async (req, res) => {
  try {
    const player_id = req.params.id;

    const playerExistsQuery = "SELECT * FROM user_entity WHERE id = $1";
    const playerExists = await pool.query(playerExistsQuery, [player_id]);

    if (playerExists.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Player does not exist",
      });
    }

    const queryText = "SELECT * FROM transactions WHERE player_id = $1";
    const values = [player_id];
    const result = await pool.query(queryText, values);

    res.status(200).json({
      success: true,
      transactions: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get transactions",
      error: error.message,
    });
  }
};

export const getTransactionsByGame = async (req, res) => {
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

    const queryText = "SELECT * FROM transactions WHERE game_id = $1";
    const values = [game_id];
    const result = await pool.query(queryText, values);

    res.status(200).json({
      success: true,
      message: "Transactions by Game id retrieved successfully",
      transactions: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get transactions",
      error: error.message,
    });
  }
};

export const getTransactionsByCategory = async (req, res) => {
  try {
    const category_id = req.params.id;

    const categoryExistsQuery =
      "SELECT * FROM categories WHERE category_id = $1";
    const categoryExists = await pool.query(categoryExistsQuery, [category_id]);

    if (categoryExists.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Category does not exist",
      });
    }

    const queryText = "SELECT * FROM transactions WHERE category_id = $1";
    const values = [category_id];
    const result = await pool.query(queryText, values);

    res.status(200).json({
      success: true,
      message: "Transactions by Category id retrieved successfully",
      transactions: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get transactions",
      error: error.message,
    });
  }
};

export const addBalance = async (req, res) => {
  try {
    const { player_id, amount } = req.body;

    console.log("amount comes: ", amount);
    const playerExistsQuery = "SELECT * FROM user_entity WHERE id = $1";
    const playerExists = await pool.query(playerExistsQuery, [player_id]);

    if (playerExists.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Player does not exist",
      });
    }

    const playerBalanceExistsQuery =
      "SELECT ua.value AS balance FROM USER_ATTRIBUTE ua WHERE ua.user_id = $1 AND ua.name = $2";
    const playerBalance = await pool.query(playerBalanceExistsQuery, [
      player_id,
      "balance",
    ]);

    console.log("player balance", playerBalance.rows[0]);
    if (playerBalance.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Balance not found for the player",
      });
    }

    console.log("Player balance:", playerBalance.rows[0].balance);
    const addedBalance = playerBalance.rows[0].balance + amount;
    const description = "Depositing a balance";

    console.log("new balance", addedBalance);
    const updatedPlayerBalance =
      "UPDATE USER_ATTRIBUTE SET value = $1 WHERE user_id = $2 AND name = $3";
    await pool.query(updatedPlayerBalance, [
      addedBalance,
      player_id,
      "balance",
    ]);

    console.log("Balance Added successfully");

    const queryText =
      "INSERT INTO transactions (player_id, amount, description) VALUES ($1, $2, $3) RETURNING *";
    const values = [player_id, amount, description];
    const result = await pool.query(queryText, values);

    res.status(201).json({
      success: true,
      transaction: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add transaction or balance",
      error: error.message,
    });
  }
};

export const getPendingBalance = async (req, res) => {
  try {
    const queryText = await pool.query(
      "SELECT * FROM bank_accounts WHERE actions = 'pending';"
    );
    console.log("pending :", queryText.rows[0]);
    console.log("and numbers: ", queryText.rowCount);
    if (queryText.rowCount > 0) {
      res.status(200).json({
        success: true,
        pending: queryText.rows,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add Get Pendings",
      error: error.message,
    });
  }
};

export const addWithDraw = async (req, res) => {
  try {

    const player_id = req.params.player_id;
    console.log(player_id);
    const formData = req.body;
    console.log("body",formData);
    const name = formData.name;
    const fatherName = formData.fatherName;
    const bankName = formData.bankName;
    const accountNumber = formData.accountNumber;
    const amount = formData.amount;
    const actions = "pending";
    console.log("actions", actions);
    const queryText =
      "INSERT INTO bank_accounts (player_id,first_name, father_name, bank_name, account_number, balance, actions) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const queryValue = [
      player_id,
      name,
      fatherName,
      bankName,
      accountNumber,
      amount,
      actions,
    ];

    console.log("finale");
    const result = await pool.query(queryText, queryValue);

    console.log("inserted value: ", result.rows[0]);
    res.status(201).json({
      success: true,
      transaction: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to Withdraw  balance",
      error: error.message,
    });
  }
};

export const completeWithDraw=async(req,res)=>{
    const {player_id, id}=req.body;
    try {
        const queryText="UPDATE bank_accounts SET actions = 'approved' WHERE id = $1 AND player_id= $2 RETURNING *;";
        const value=[id,player_id];

        const result=await pool.query(queryText,value);
        console.log("inserted value: ", result.rows[0]);
        res.status(201).json({
          success: true,
          message: "Transaction Approval completed",
          transaction: result.rows[0],
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
          success: false,
          message: "Failed to Withdraw  balance",
          error: error.message,
        });
    }
    
}

export const cancelWithDraw=async(req,res)=>{
    const {player_id, id}=req.body;
    try {
        const queryText="DELETE FROM bank_accounts WHERE id = $1 AND player_id= $2;";
        const value=[id,player_id];

        const result=await pool.query(queryText,value);
        console.log("inserted value: ", result.rows[0]);
        res.status(201).json({
          success: true,
          message: "Transaction Cancelled completed"
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
          success: false,
          message: "Failed to Cancel",
          error: error.message,
        });
    }
}

export const getCompletedWithDraw=async(req,res)=>{
    try {
        const queryText = await pool.query(
          "SELECT * FROM bank_accounts WHERE actions = 'approved';"
        );
        console.log("Approved :", queryText.rows[0]);
        console.log("and numbers: ", queryText.rowCount);
        if (queryText.rowCount > 0) {
          res.status(200).json({
            success: true,
            approved: queryText.rows[0],
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to add Get Approved",
          error: error.message,
        });
      }
}

export const getTransactionCount=async(req,res)=>{
    try {
        const count=await pool.query("SELECT COUNT(*) AS transaction_count FROM bank_accounts;");
        return res.status(200).json({
          success: true,
          message: "Transaction Count fetched.",
          count: count.rows[0].transaction_count
        })
        
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Game Count Not fetched.",
          error: error.message
        })
    }
      
}