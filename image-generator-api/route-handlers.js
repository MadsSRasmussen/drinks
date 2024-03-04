import {
  getUserAuthStatus,
  getCardsForGame,
  createJob,
  updateGame,
  updateJob,
  getCard,
} from "./firebase.js";
import { summariazeGameFromCards } from "./openai.js";
import {
  generateImagePromt,
  generateImagePromtAlt,
  generateAndUploadBuffer,
} from "./helpers.js";
import { queue } from "./index.js";
import { Job } from "./job.js";

// Function to generate images for each card assosiated with a game and upload these to the apropriate storage-bucket...
export async function generateGameHandler(req, res) {
  try {
    // Check auth-status of user - respond with 401-not-authorized if user is not authorized
    const auth = await getUserAuthStatus(req.headers["authorization"]);

    if (auth != "super") {
      res.status(401);
      res.send("Not authorized.");
      return;
    }

    const jobRef = await createJob(
      "Generate images for all cards in game.",
      "processing",
    );

    // Respond with id of this job-document. Frontend can poll this for updates...
    res.send({ job: jobRef.id });

    // Set status of game to processing:
    await updateGame(req.body["game-id"], {
      status: "queued",
    });

    const task = () => {
      return new Promise(async (resolve, reject) => {
        try {
          await updateGame(req.body["game-id"], {
            status: "processing",
          });

          // Get cards corresponding to gid - if these exist, perceed.
          const cards = await getCardsForGame(req.body["game-id"]);

          // Get AI-generated summary of the game...
          const summary = await summariazeGameFromCards(cards);

          const contextPromts = [];
          cards.forEach((card) => {
            contextPromts.push(
              generateImagePromt(req.body["style"], card, summary),
            );
          });

          const noContextPromts = [];
          cards.forEach((card) => {
            noContextPromts.push(
              generateImagePromtAlt(req.body["style"], card),
            );
          });

          // Generate and upload images in batches of ??...
          for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const path = "card-images/" + card.game + "/" + card.id;

            await generateAndUploadBuffer(card, contextPromts[i], path);
            await generateAndUploadBuffer(card, contextPromts[i], path);
            await generateAndUploadBuffer(card, noContextPromts[i], path);
            await generateAndUploadBuffer(card, noContextPromts[i], path);
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      });
    };

    const onDone = async () => {
      // Set status of job to complete in firebase...
      await updateGame(req.body["game-id"], {
        status: "stable",
      });

      await updateJob(jobRef.id, {
        status: "completed",
      });

      console.log("job: ", jobRef.id, "has been completed!");
    };

    const onError = async (error) => {
      // Set status of job to failed in firebase...
      await updateGame(req.body["game-id"], {
        status: "stable",
      });

      await updateJob(jobRef.id, {
        status: "failed",
      });

      console.log(
        "job: ",
        jobRef.id,
        "has failed with the following error: ",
        error,
      );
    };

    const job = new Job(task, jobRef.id, onDone, onError);

    queue.addJob(job);
  } catch (error) {
    console.log(error);
    res.status(502);
    res.send("Internal server error!");
  }
}

// Generates an image for a single card...
export async function generateImagesForCard(req, res) {
  try {
    // Check auth-status of user - respond with 401-not-authorized if user is not authorized
    const auth = await getUserAuthStatus(req.headers["authorization"]);

    if (auth != "super") {
      res.status(401);
      res.send("Not authorized.");
      return;
    }

    const jobRef = await createJob("Generate image card.", "processing");

    // Respond with id of this job-document. Frontend can poll this for updates...
    res.send({ job: jobRef.id });

    const task = () => {
      return new Promise(async (resolve, reject) => {
        try {
          const card = await getCard(req.body["card"]);

          const cards = await getCardsForGame(card.game);

          const summary = await summariazeGameFromCards(cards);

          const promt = generateImagePromt(req.body["style"], card, summary);
          const promtAlt = generateImagePromtAlt(req.body["style"], card);

          const path = "card-images/" + card.game + "/" + card.id;

          const snapshot = await generateAndUploadBuffer(card, promt, path);
          await generateAndUploadBuffer(card, promtAlt, path);

          resolve(snapshot);
        } catch (error) {
          reject(error);
        }
      });
    };

    const onDone = async () => {
      // Update status of job.
      await updateJob(jobRef.id, {
        status: "completed",
      });

      console.log("job: ", jobRef.id, "has been completed!");
    };

    const onError = async (error) => {
      // Update status of job.
      await updateJob(jobRef.id, {
        status: "failed",
      });

      console.log(
        "job: ",
        jobRef.id,
        "has failed with the following error: ",
        error,
      );
    };

    const job = new Job(task, jobRef.id, onDone, onError);

    queue.addJob(job);
  } catch (error) {
    console.log(error);

    res.status(502);
    res.send("Internal server error");
  }
}
