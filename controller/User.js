import pool from "../db/connect.js";
// import KcAdminClient from '@keycloak/keycloak-admin-client';

// // Create a new Keycloak admin client instance
// const kcAdminClient = new KcAdminClient({
//   baseUrl: 'http://127.0.0.1:8080',
//   realmName: process.env.KEYCLOAK_REALM

// });

// Middleware to authenticate the admin client
// await kcAdminClient.auth({
//   username: process.env.USER_NAME ,
//   password: process.env.PASSWORD,
//   grantType: 'password', 
//   realmName: process.env.KEYCLOAK_REALM,
//   clientId: process.env.KEYCLOAK_CLIENT
// });

export const getUserBalance=async(req,res) =>{

  try {
    const player_id  = req.params.player_id;
    console.log("player id", player_id);

    const playerExistsQuery = 'SELECT * FROM user_entity WHERE id = $1';
    const playerExists = await pool.query(playerExistsQuery, [player_id]);

    if (playerExists.rows.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Player does not exist',
        });
    }

     const playerBalanceExistsQuery = 'SELECT ua.value AS balance FROM USER_ATTRIBUTE ua WHERE ua.user_id = $1 AND ua.name = $2';
        const playerBalance = await pool.query(playerBalanceExistsQuery, [player_id, 'balance']);

        console.log("player balanceee", playerBalance.rows[0]);
        if (playerBalance.rows.length > 0) {
          console.log("true");
            return res.status(200).json({
                success: true,
                message: 'Balance found for the player',
                balance: playerBalance.rows[0].balance,
            });
        }
    
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: 'Failed to get balance',
        error: error.message,
    })
    
  }
}

export const getUserCount=async(req,res)=>{
  try {
    const count=await pool.query("SELECT COUNT(*) AS user_count FROM user_entity;");
    return res.status(200).json({
      success: true,
      message: "User Count fetched.",
      count: count.rows[0].user_count
    })
    
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "User Count Not fetched.",
      error: error.message
    })
    
  }
}








