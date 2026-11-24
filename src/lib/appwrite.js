import { Client, Account, Databases, ID, Query } from "appwrite";

export const client = new Client()
    .setEndpoint("https://nyc.cloud.appwrite.io/v1")
    .setProject("6b05a67c001dec3abaee");

export const account = new Account(client);
export const databases = new Databases(client);

export { ID, Query };
