import express from "express";
import aiService, { getServiceClient } from "./aiService.js";

let localConcurrencyToken = "";
let localChannelId = "";
let tokenCreationInProgress = false;
let serviceClient;

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/newssummary", async (req, res) => {
    const { textToSummarize } = req.body; // Expect text to summarize in the request body
    if (!serviceClient) {
        serviceClient = await getServiceClient();
    }

    function waitForTokenCreation() {
        return new Promise((resolve, reject) => {
            const checking = setInterval(() => {
                if (!tokenCreationInProgress) {
                    clearInterval(checking);
                    resolve();
                }
            }, 3000);
        });
    }

    const createConcurrencyToken = async () => {
        try {
            tokenCreationInProgress = true;
            const { concurrencyToken, channelId } = await serviceClient.getConcurrencyTokenAndChannelId();
            tokenCreationInProgress = false;
            localConcurrencyToken = concurrencyToken;
            localChannelId = channelId;
        } catch (error) {
            throw error;
        }
    };

    const invokeAiService = async () => {
        try {
            serviceClient.setConcurrencyTokenAndChannelId(localConcurrencyToken, localChannelId);
            const summary = await aiService(serviceClient, textToSummarize); // Pass the text to the aiService
            res.send({ summary }); // Send the summary as the response
        } catch (error) {
            throw error;
        }
    };

    const run = async (shouldCreateNewToken = false) => {
        try {
            if (tokenCreationInProgress) await waitForTokenCreation();
            if (shouldCreateNewToken) await createConcurrencyToken();
            await invokeAiService();
        } catch (error) {
            let errorMessage = error.message.toLowerCase();
            if (
                errorMessage.includes("Usage Exceeded on channel Id".toLowerCase()) ||
                errorMessage.includes(
                    "signed amount for token request cannot be greater than full amount in channel".toLowerCase()
                ) ||
                errorMessage.includes("signed amount for token request needs to be greater than last signed amount") ||
                errorMessage.includes("Insufficient funds in channel".toLowerCase())
            ) {
                await run(true);
            } else if (errorMessage.includes("already known")) {
                tokenCreationInProgress = true;
                await run();
            } else {
                res.status(500).send({ error: error.message });
            }
        }
    };

    try {
        await run(!Boolean(localConcurrencyToken));
    } catch (error) {
        console.error("Service Failed", error.message);
        res.status(500).send({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
