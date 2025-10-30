import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export default function Playgroud() {
  const client = express.Router();

  var root = process.cwd();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const __client = path.join(__dirname, "./build/client");
  const __map = path.resolve(root, "opposer-map.json");

  /*if (!fs.existsSync(__map)) {
    throw new Error(
      "[Playground] - Necessary generate map system in root path, for generate run 'npx opposer system generate-map'."
    );
  }

  if (!fs.existsSync(__static)) {
    fs.mkdirSync(__static);
  }

  //copy map for public folder
  fs.copyFileSync(__map, __static);
  */
  console.log(__client);
  client.use("/data/", express.static(__client));

  client.get("/playground*", (req, res) => {
    res.sendFile(path.join(__client, "index.html"));
  });

  return client;
}
