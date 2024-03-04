import { generateImage } from "./openai.js";
import { uploadBlob, updateCard } from "./firebase.js";
import { v4 as uuid } from "uuid";
import sharp from "sharp";

export function generateImagePromt(style, card, summary) {
  const styleBit = "Create an image in the following style: \n" + style + "\n";
  const contentBit =
    "The actual scene you must depict is of people playing a game, SPECIFICALLY DOING THE FOLLOWING: \n" +
    card.title +
    ": " +
    card.content +
    "\n";
  const contextBit =
    "Whilst loosley keeping in mind the overall goal of the game: \n" + summary;

  return styleBit + contentBit + contextBit;
}

// Generates an image, fetches the generated image and uploads it to cloud storage
export function generateAndUpload(card, promt, path) {
  return new Promise((resolve, reject) => {
    try {
      getImageBlob(promt).then((blob) => {
        const filename = uuid() + ".png";

        uploadBlob(blob, path, filename).then((snapshot) => {
          // Update image-field for game to path + "/" + filename
          updateCard(card.id, {
            image: path + "/" + filename,
          })
            .then((response) => {
              resolve(snapshot, response);
            })
            .catch((error) => {
              reject(error);
            });
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Test function for now...
export function generateAndUploadBuffer(card, promt, path) {
  return new Promise((resolve, reject) => {
    try {
      getImageBuffer(promt).then((imageBuffer) => {
        sharp(imageBuffer)
          .toFormat("webp")
          .toBuffer()
          .then((resizedImageBuffer) => {
            // Proceed to upload `resizedImageBuffer` to a storage bucket
            const filename = uuid() + ".webp";

            uploadBlob(resizedImageBuffer, path, filename).then((snapshot) => {
              // Update image-field for game to path + "/" + filename
              updateCard(card.id, {
                image: path + "/" + filename,
              })
                .then((response) => {
                  resolve(snapshot, response);
                })
                .catch((error) => {
                  reject(error);
                });
            });
          })
          .catch((err) => {
            console.error("Error resizing image:", err);
            reject(err);
          });
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Function that returnes image data generated with Dall-e-3 as a blob:
function getImageBlob(promt) {
  return new Promise((resolve, reject) => {
    try {
      generateImage(promt).then((data) => {
        const url = data[0].url;

        fetch(url).then((response) => {
          response.blob().then((blob) => {
            resolve(blob);
          });
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getImageBuffer(promt) {
  return new Promise((resolve, reject) => {
    try {
      generateImage(promt).then((data) => {
        const url = data[0].url;

        fetch(url).then((response) => {
          response.arrayBuffer().then((buffer) => {
            resolve(Buffer.from(buffer));
          });
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}
