import grpc from '@grpc/grpc-js';
import {
  TokenReply,
  TokenRequest,
} from './token_service_pb.js';

export function serialize_escrow_TokenReply(arg) {
  if (!(arg instanceof TokenReply)) {
    throw new Error('Expected argument of type escrow.TokenReply');
  }
  return Buffer.from(arg.serializeBinary());
}

export function deserialize_escrow_TokenReply(buffer_arg) {
  return TokenReply.deserializeBinary(new Uint8Array(buffer_arg));
}

export function serialize_escrow_TokenRequest(arg) {
  if (!(arg instanceof TokenRequest)) {
    throw new Error('Expected argument of type escrow.TokenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

export function deserialize_escrow_TokenRequest(buffer_arg) {
  return TokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

// It is expected that the user would call the GetChannelState to Determine the Current state of the Channel
// ... (rest of your comments remain the same)

var TokenServiceService = exports.TokenServiceService = {
  getToken: {
    path: '/escrow.TokenService/GetToken',
    requestStream: false,
    responseStream: false,
    requestType: TokenRequest,
    responseType: TokenReply,
    requestSerialize: serialize_escrow_TokenRequest,
    requestDeserialize: deserialize_escrow_TokenRequest,
    responseSerialize: serialize_escrow_TokenReply,
    responseDeserialize: deserialize_escrow_TokenReply,
  },
};

export const TokenServiceClient = grpc.makeGenericClientConstructor(TokenServiceService);
