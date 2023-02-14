import grpc
from pb import compress_pb2_grpc, compress_pb2
from model import compress_model


class Compressor(compress_pb2_grpc.ImageCompressServiceServicer):

    def CompressOneImage(self,
                         request: compress_pb2.CompressOneFileRequest,
                         context: grpc.aio.ServicerContext) -> compress_pb2.CompressOneFileResponse:
        # print request and context
        file_name, file_type, model_name, req_metric, \
            req_quality, file_data = request.file_name, request.file_type, request.model_name, \
            request.metric, request.quality, request.file_data

        print(f"file_name: {file_name}")
        print(f"file_type: {file_type}")
        print(f"model_name: {model_name}")
        print(f"req_metric: {req_metric}")
        print(f"req_quality: {req_quality}")

        (metrics, compressed_img) = compress_model.compress_one_image(img=file_data, model=model_name, img_type=file_type,
                                                                      req_metric=req_metric, req_quality=req_quality)

        return compress_pb2.CompressOneFileResponse(metrics=metrics, compressed_file=compressed_img)
