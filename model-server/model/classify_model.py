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
    if torch.cuda.is_available():
        model.load_state_dict(torch.load(config.model_path)['net'])
    else:
        model.load_state_dict(torch.load(config.model_path, map_location=torch.device('cpu'))['net'])
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
