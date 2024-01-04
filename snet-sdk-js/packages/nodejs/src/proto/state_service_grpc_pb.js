// state_service_pb.js needs to be imported as an ESM module for this to work

import grpc from '@grpc/grpc-js';
import {
  ChannelStateReply,
  ChannelStateRequest,
  FreeCallStateReply,
  FreeCallStateRequest,
} from './state_service_pb.js';

export function serialize_escrow_ChannelStateReply(arg) {
  if (!(arg instanceof ChannelStateReply)) {
    throw new Error('Expected argument of type escrow.ChannelStateReply');
  }
  return Buffer.from(arg.serializeBinary());
}

export function deserialize_escrow_ChannelStateReply(buffer_arg) {
  return ChannelStateReply.deserializeBinary(new Uint8Array(buffer_arg));
}

export function serialize_escrow_ChannelStateRequest(arg) {
  if (!(arg instanceof ChannelStateRequest)) {
    throw new Error('Expected argument of type escrow.ChannelStateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

export function deserialize_escrow_ChannelStateRequest(buffer_arg) {
  return ChannelStateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

export function serialize_escrow_FreeCallStateReply(arg) {
  if (!(arg instanceof FreeCallStateReply)) {
    throw new Error('Expected argument of type escrow.FreeCallStateReply');
  }
  return Buffer.from(arg.serializeBinary());
}

export function deserialize_escrow_FreeCallStateReply(buffer_arg) {
  return FreeCallStateReply.deserializeBinary(new Uint8Array(buffer_arg));
}

export function serialize_escrow_FreeCallStateRequest(arg) {
  if (!(arg instanceof FreeCallStateRequest)) {
    throw new Error('Expected argument of type escrow.FreeCallStateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

export function deserialize_escrow_FreeCallStateRequest(buffer_arg) {
  return FreeCallStateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

// PaymentChannelStateService contains methods to get the MultiPartyEscrow
// payment channel state.
// channel_id, channel_nonce, value and amount fields below in fact are
// Solidity uint256 values. Which are big-endian integers, see
// https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#formal-specification-of-the-encoding
// These values may be or may be not padded by zeros, service supports both
// options.
var PaymentChannelStateServiceService = exports.PaymentChannelStateServiceService = {
  getChannelState: {
    path: '/escrow.PaymentChannelStateService/GetChannelState',
    requestStream: false,
    responseStream: false,
    requestType: ChannelStateRequest,
    responseType: ChannelStateReply,
    requestSerialize: serialize_escrow_ChannelStateRequest,
    requestDeserialize: deserialize_escrow_ChannelStateRequest,
    responseSerialize: serialize_escrow_ChannelStateReply,
    responseDeserialize: deserialize_escrow_ChannelStateReply,
  },
};

exports.PaymentChannelStateServiceClient = grpc.makeClientConstructor(PaymentChannelStateServiceService);

// Used to determine free calls available for a given user.
var FreeCallStateServiceService = exports.FreeCallStateServiceService = {
  getFreeCallsAvailable: {
    path: '/escrow.FreeCallStateService/GetFreeCallsAvailable',
    requestStream: false,
    responseStream: false,
    requestType: FreeCallStateRequest,
    responseType: FreeCallStateReply,
    requestSerialize: serialize_escrow_FreeCallStateRequest,
    requestDeserialize: deserialize_escrow_FreeCallStateRequest,
    responseSerialize: serialize_escrow_FreeCallStateReply,
    responseDeserialize: deserialize_escrow_FreeCallStateReply,
  },
};

exports.FreeCallStateServiceClient = grpc.makeClientConstructor(FreeCallStateServiceService);
