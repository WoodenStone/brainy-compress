import grpc
from pb import classify_pb2_grpc, classify_pb2
from model import classify_model
import config


class Classifier(classify_pb2_grpc.ClassificationServiceServicer):

    def ClassifyOneImage(self,
                         request: classify_pb2.ClassifyOneImageRequest,
                         context: grpc.aio.ServicerContext) -> classify_pb2.ClassifyOneImageResponse:

        image_data = request.image_data

        (class_name, probability) = classify_model.classify_image(image_data)

        result = config.label_map[class_name]
        return classify_pb2.ClassifyOneImageResponse(result=result, probability=probability)
