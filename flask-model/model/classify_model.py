import io
import config
import torch
import numpy as np
from torch import nn
from PIL import Image
from torchvision import models
import torch.nn.functional as fn
import torchvision.transforms as transforms

transform_op = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
])


def get_model():
    model = models.resnet18(weights=None)
    num_fits = model.fc.in_features
    model.fc = nn.Linear(num_fits, config.num_classes)
    model.load_state_dict(torch.load(config.model_path)['net'])
    model.to(config.device)
    model.eval()
    return model


def classify_image(img: bytes):
    raw_img = Image.open(io.BytesIO(img))
    raw_img = raw_img.convert("RGB")
    np.asarray(raw_img.copy())
    image = transform_op(raw_img)
    image = image.unsqueeze_(0).to(config.device)
    model = get_model()
    with torch.no_grad():
        outputs = model(image)
        outputs = outputs.to(config.device)
    predict_label = torch.max(outputs, dim=1)[1].data.cpu().numpy()[0]
    confidence = fn.softmax(outputs[0], dim=0)
    probabilities = torch.max(confidence)
    probabilities = round(probabilities.item(), 3)
    return predict_label, probabilities



# def predict_images(image_file, label, model):
#     image = Image.open(image_file)
#     image = image.convert("RGB")
#     np.asarray(image.copy())
#     image = transform_op(image)
#     image = image.unsqueeze_(0).to(config.device)
#     with torch.no_grad():
#         outputs = model(image)
#         outputs = outputs.to(config.device)
#     predict_label = torch.max(outputs, dim=1)[1].data.cpu().numpy()[0]
#     confidence = F.softmax(outputs[0], dim=0)
#     probabilities = torch.max(confidence)
#     probabilities = round(probabilities.item(), 3)
#     print("image={},预测label={},概率={}".format(image_file, predict_label, probabilities))
#
#     return predict_label


# def get_image_label_to_predict():
#     model = model.resnet18(pretrained=False)
#     num_fits = model.fc.in_features
#     model.fc = nn.Linear(num_fits, config.num_classes)
#     model.load_state_dict(torch.load(config.model_path)['net'])
#     model.to(config.device)
#     model.eval()
#     classes_dir = os.listdir(config.predict_image_path)
#     for label in classes_dir:
#         label_path = os.path.join(config.predict_image_path, label)
#         if os.path.isdir(label_path):
#             images = glob.glob(os.path.join(label_path, "*.{}".format(config.image_format)))
#             for img in images:
#                 predict_images(img, int(label), model)
