import OpenAI from "openai";
import 'dotenv/config'

const openai = new OpenAI();
const apiKey = process.env.OPENAI_API_KEY;


export function generateImage(promt) {

    return new Promise((resolve, reject) => {
        try {
            openai.images.generate({
                model: "dall-e-3",
                prompt: promt,
            })
            .then((image) => {
                resolve(image.data)
            })
            .catch((error) => {
                reject(error)
            })
        } catch (error) {
            reject(error);
        }
    })

 }

export function summariazeGameFromCards(cards) {
    return new Promise((resolve, reject) => {
        
        try {
            
            const systemPromt = "You are presented with a set of instructions for playing a drinking-game. Summarize these instructions into a description of the game. The description should be about 25 words in length."

            let contentsString;

            cards.forEach((card) => {
                    contentsString += card.title + ": " + card.content + "\n";
            });

            openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {role: "system", content: systemPromt},
                    {role: "user", content: contentsString}
                ]
            })
            .then((response) => {
                resolve(response.choices[0].message.content)
            })
            .catch((error) => {
                reject(error)
            })

        } catch (error) {
            reject(error);
        }

    })
}

//summariazeGameFromCards(mockCards).then((response) => {console.log(response)});
