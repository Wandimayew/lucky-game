import dotenv from "dotenv";
import KeycloakConnect from "keycloak-connect";

dotenv.config();

console.log("the out put is"+process.env.KEYCLOAK_REALM+process.env.KEYCLOAK_URL+process.env.KEYCLOAK_CLIENT);

const config = {
    "realm": process.env.KEYCLOAK_REALM,
    "auth-server-url": 'http://127.0.0.1:8080',
    "ssl-required": "external",
    "resource": process.env.KEYCLOAK_CLIENT,
    "bearer-only": true
  }
  const keycloak= new KeycloakConnect({}, config);
  console.log("the token is comming");

  export default keycloak;