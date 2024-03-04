import express from "express";
import { getUserAuthStatus, getCardsForGame } from "./firebase.js";
import {
  generateGameHandler,
  generateImagesForCard,
} from "./route-handlers.js";
import { Queue } from "./queue.js";

const app = express();
const port = 3000;

const queue = new Queue();
export { queue };

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world");
});

// Queues a game for image processing...
app.post("/generate/game", (req, res) => {
  generateGameHandler(req, res);
});

app.post("/card", (req, res) => {
  generateImagesForCard(req, res);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
