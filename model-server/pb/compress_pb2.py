# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: compress.proto
"""Generated protocol buffer code."""
from google.protobuf.internal import builder as _builder
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x0e\x63ompress.proto\x12\x0e\x63ompress_model\"\xb5\x01\n\x16\x43ompressOneFileRequest\x12\x0f\n\x07\x66ile_id\x18\x01 \x01(\t\x12\x11\n\tfile_name\x18\x02 \x01(\t\x12\x11\n\tfile_type\x18\x03 \x01(\t\x12\x12\n\nmodel_name\x18\x04 \x01(\t\x12\x0e\n\x06metric\x18\x05 \x01(\t\x12\x0f\n\x07quality\x18\x06 \x01(\x05\x12\x1c\n\x14image_classification\x18\x07 \x01(\t\x12\x11\n\tfile_data\x18\x08 \x01(\x0c\"\xba\x01\n\x17\x43ompressOneFileResponse\x12\x0f\n\x07\x66ile_id\x18\x01 \x01(\t\x12\x45\n\x07metrics\x18\x02 \x03(\x0b\x32\x34.compress_model.CompressOneFileResponse.MetricsEntry\x12\x17\n\x0f\x63ompressed_file\x18\x03 \x01(\x0c\x1a.\n\x0cMetricsEntry\x12\x0b\n\x03key\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\t:\x02\x38\x01\x32}\n\x14ImageCompressService\x12\x65\n\x10\x43ompressOneImage\x12&.compress_model.CompressOneFileRequest\x1a\'.compress_model.CompressOneFileResponse\"\x00\x42\tZ\x07./modelb\x06proto3')

_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, globals())
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'compress_pb2', globals())
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  DESCRIPTOR._serialized_options = b'Z\007./model'
  _COMPRESSONEFILERESPONSE_METRICSENTRY._options = None
  _COMPRESSONEFILERESPONSE_METRICSENTRY._serialized_options = b'8\001'
  _COMPRESSONEFILEREQUEST._serialized_start=35
  _COMPRESSONEFILEREQUEST._serialized_end=216
  _COMPRESSONEFILERESPONSE._serialized_start=219
  _COMPRESSONEFILERESPONSE._serialized_end=405
  _COMPRESSONEFILERESPONSE_METRICSENTRY._serialized_start=359
  _COMPRESSONEFILERESPONSE_METRICSENTRY._serialized_end=405
  _IMAGECOMPRESSSERVICE._serialized_start=407
  _IMAGECOMPRESSSERVICE._serialized_end=532
# @@protoc_insertion_point(module_scope)
