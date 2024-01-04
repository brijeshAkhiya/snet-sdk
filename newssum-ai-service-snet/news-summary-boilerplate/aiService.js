import dotenv from "dotenv";
import * as SnetSDK from "snet-sdk";
import * as messages from "./grpc_stubs/summary_pb.cjs";
import { TextSummaryClient } from "./grpc_stubs/summary_grpc_pb.cjs";
import config from "./config.js";

dotenv.config();
const sdk = new SnetSDK.default(config);

const orgId = "snet";
const serviceId = "news-summary";
const groupName = "default_group";
const paymentStrategy = new DefaultPaymentStrategy(100);
let tokenToMakeFreeCall = process.env.FREE_CALL_TOKEN
  ? process.env.FREE_CALL_TOKEN.toUpperCase()
  : "";
tokenToMakeFreeCall = Boolean(tokenToMakeFreeCall)
  ? tokenToMakeFreeCall.startsWith("0X")
    ? tokenToMakeFreeCall
    : `0X${tokenToMakeFreeCall}`
  : "";
const serviceClientOptions = {
  tokenToMakeFreeCall,
  tokenExpirationBlock: process.env.TOKEN_EXPIRATION_BLOCK,
  email: process.env.EMAIL,
  disableBlockchainOperations: false,
  concurrency: true,
};

const closeConnection = () => {
  sdk.web3.currentProvider.connection &&
    sdk.web3.currentProvider.connection.close();
};

export const getServiceClient = async () => {
  try {
    const serviceClient = await sdk.createServiceClient(
      orgId,
      serviceId,
      TextSummaryClient, // Update with the correct client
      groupName,
      paymentStrategy,
      serviceClientOptions
    );
    console.log("DEBUG aiService.js service Client: " + serviceClient);
    return serviceClient;
  } catch (error) {
    console.error("Error creating service client:", error);
  }
};

const summarizeText = async (serviceClientWithToken, text) => {
  let serviceClient = serviceClientWithToken;
  try {
    if (!serviceClient) {
      serviceClient = await getServiceClient();
    }
    console.log("DEBUG aiService.js serviceClient var: " + serviceClient);
    console.log("DEBUG aiService.js messages.proto var: " + messages.proto);
    const request = new messages.proto.Request(); // Adjusted for named import
    request.setArticleContent(text); // Assuming setText is the correct method for setting text

    return new Promise((resolve, reject) => {
      serviceClient.service.summarize(request, (err, result) => {
        // Update method name
        if (err) {
          return reject(err);
        }
        console.log("DEBUG aiService.js result: " + result);
        resolve(result.getSummary()); // Assuming getSummary is the correct method to get summary
      });
    });
  } catch (error) {
    console.error("Error in summarizeText:", error);
    throw error;
  }
};

export default summarizeText;
