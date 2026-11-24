import { Client, Account, TablesDB, ID, Query } from "appwrite";

export const client = new Client()
    .setEndpoint("https://nyc.cloud.appwrite.io/v1")
    .setProject("6b05a67c001dec3abaee");

export const account = new Account(client);

export const tablesDB = new TablesDB(client);

export { ID, Query };

// Identificador de nuestra base de datos
export const DATABASE_ID = "6b05a96000195be5c6a0";
