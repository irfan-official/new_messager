import { openDB } from "idb";

const DB_NAME = "MyAppDB";
const STORE_NAME = "userDetails";

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
}

export async function addUserData(message) {
  const db = await initDB();
  await db.add(STORE_NAME, message);
}

export async function getAllUserData() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function deleteUserData(id) {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
}
