import fs from "fs";
import path from "path";

// Helper function to read a JSON file
const readJson = (filename) => {
  const filePath = path.join("./JsonModeller", filename);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return data ? JSON.parse(data) : [];
};

// Helper function to write to a JSON file
const writeJson = (filename, data) => {
  const filePath = path.join("./JsonModeller", filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); // 'null, 2' makes the JSON pretty
};

// Export specific functions for each data type
export const getChats = () => readJson("chats.json");
export const saveChats = (chats) => writeJson("chats.json", chats);

export const getUsers = () => readJson("users.json");
export const saveUsers = (users) => writeJson("users.json", users);

export const getMessages = () => readJson("messages.json");
export const saveMessages = (messages) => writeJson("messages.json", messages);
