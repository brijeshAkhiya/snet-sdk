// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var summary_pb = require('./summary_pb.js');

function serialize_Request(arg) {
  if (!(arg instanceof summary_pb.Request)) {
    throw new Error('Expected argument of type Request');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Request(buffer_arg) {
  return summary_pb.Request.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_Result(arg) {
  if (!(arg instanceof summary_pb.Result)) {
    throw new Error('Expected argument of type Result');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Result(buffer_arg) {
  return summary_pb.Result.deserializeBinary(new Uint8Array(buffer_arg));
}


var TextSummaryService = exports.TextSummaryService = {
  summary: {
    path: '/TextSummary/summary',
    requestStream: false,
    responseStream: false,
    requestType: summary_pb.Request,
    responseType: summary_pb.Result,
    requestSerialize: serialize_Request,
    requestDeserialize: deserialize_Request,
    responseSerialize: serialize_Result,
    responseDeserialize: deserialize_Result,
  },
};

exports.TextSummaryClient = grpc.makeGenericClientConstructor(TextSummaryService);
