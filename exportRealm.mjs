import fs from 'fs'
import fetch from 'node-fetch';
const baseUrl = 'http://localhost:8080/realms/demo';


async function authenticate() {
    try {
        const credentials = {
            username: 'wandi',
            password: 'wandi',
            client_id: 'demos',
            grant_type: 'password',
            realmName: 'demo'
            
        };

        const response = await fetch(`${baseUrl}/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(credentials).toString()
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Authentication error:', error);
        throw error; // Rethrow the error to handle it outside this function
    }
}


// Function to export the entire Keycloak realm configuration with users, clients, groups, and roles to a JSON file
async function exportRealmWithUsers() {
    try {
        console.log("rithignksdns lgosf json");
        const token = await authenticate();

        // Retrieve realm configuration
        const realmResponse = await fetch(baseUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const realmConfig = await realmResponse.json();

        // Retrieve users in the realm
        const usersResponse = await fetch(`${baseUrl}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const users = await usersResponse.json();

        // Retrieve clients in the realm
        const clientsResponse = await fetch(`${baseUrl}/clients`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const clients = await clientsResponse.json();

        // Retrieve groups in the realm
        const groupsResponse = await fetch(`${baseUrl}/groups`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const groups = await groupsResponse.json();

        // Retrieve roles in the realm
        const rolesResponse = await fetch(`${baseUrl}/roles`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const roles = await rolesResponse.json();

        // Combine all data into a single object
        const realmData = {
            realm: realmConfig,
            users: users,
            clients: clients,
            groups: groups,
            roles: roles,
        };

        // Write realm configuration with users, clients, groups, and roles to a JSON file
        fs.writeFileSync('keycloakrealmwithdata.json', JSON.stringify(realmData, null, 2));

        console.log('Realm configuration along with users, clients, groups, and roles exported to keycloakrealmwithdata.json successfully.');
    } catch (error) {
        console.error('Error exporting realm with data:', error);
    }
}

// Call the exportRealmWithUsers function to start the export process
exportRealmWithUsers();
