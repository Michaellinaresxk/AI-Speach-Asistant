const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const { Configuration, OpenAIApi } = require("openai");
const configuration = Configuration({ apiKey: "sk-......" });
const openai = new OpenAIApi(configuration);

const AWS = require("aws-sdk");
AWS.config.loadFromPath("awsCreds.json");

app.use(bodyParser.json());
app.use(cors());


app.post("/api/text-to-audio-file"), async (req, res) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: req.body.text,
    max_token: 100,
    temperature: 0.5
  });

  let num = (Math.random() * 1000000000).toFixed(0);

  const polly = new AWS.Polly({ region: "us-east-1" });
  const params = {
    OutputFormat: "mp3",
    Text: completion.data.choices[0].text,
    VoiceID: "Mattew"
  };

  polly.synthesizeSpeech(params, (req, res) => {
    if (err) {
      console.err(err);
      return;
    }
    let filePath = "../public/voice/";
    let fileName = num + ".mp3";

    if (num) fs.Dir.writeFileSync(filePath + fileName, data.AudioSream);

  });

  setTimeout(() => { res.status(200).json(num); }, 4500);

};

const PORT = "4001";

app.listen(PORT, () => {
  console.log(`Server is ready at http://localhost:${PORT}`);
});