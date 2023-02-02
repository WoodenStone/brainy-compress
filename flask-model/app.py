import io
import json
import math
import os
import time

import torch
from PIL import Image
from compressai.zoo import (
    bmshj2018_factorized, bmshj2018_hyperprior, mbt2018_mean, mbt2018, cheng2020_anchor, cheng2020_attn
)
from flask import Flask, send_file, request, make_response
from pytorch_msssim import ms_ssim
from torchvision import transforms

app = Flask(__name__)

HOST = os.getenv('HOST_IP', '0.0.0.0')
PORT = os.getenv('PORT', 5000)

device = 'cuda' if torch.cuda.is_available() else 'cpu'

format_dict = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'image/bmp': 'BMP',
    'image/tiff': 'TIFF',
    'image/webp': 'WebP',
}

networks = {
    'bmshj2018-factorized': bmshj2018_factorized,
    'bmshj2018-hyperprior': bmshj2018_hyperprior,
    'mbt2018-mean': mbt2018_mean,
    'mbt2018': mbt2018,
    'cheng2020-anchor': cheng2020_anchor,
    'cheng2020-attn': cheng2020_attn,
}


def get_network(model: str, quality: int, metric: str):
    return networks[model](quality=quality, metric=metric, pretrained=True).eval().to(device)


def find_resize_hw(original_h, original_w, factor_h=128, factor_w=128):
    # 找到最接近 128 的倍数的值
    # why 128? 试出来的 - -!
    h = original_h
    w = original_w
    while h % factor_h != 0:
        h += 1
    while w % factor_w != 0:
        w += 1
    return h, w


def image_to_byte_array(image: Image, image_format: str) -> bytes:
    """
    convert PIL image to byte array
    :param image: image to convert
    :param image_format: e.g. 'JPEG', 'PNG', 'GIF', 'BMP', 'TIFF', 'WebP'
    :return:
    """
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format=image_format)
    img_byte_arr = img_byte_arr.getvalue()
    return img_byte_arr


def compute_psnr(a, b):
    mse = torch.mean((a - b) ** 2).item()
    return -10 * math.log10(mse)


def compute_msssim(a, b):
    return ms_ssim(a, b, data_range=1.).item()


def compute_bpp(out_net):
    size = out_net['x_hat'].size()
    num_pixels = size[0] * size[2] * size[3]
    return sum(torch.log(likelihoods).sum() / (-math.log(2) * num_pixels)
               for likelihoods in out_net['likelihoods'].values()).item()


def preprocess_img(img: Image) -> Image:
    img_rgb = img.convert('RGB')
    h, w = find_resize_hw(img.size[0], img.size[1])
    img_resized = img_rgb.resize((h, w))
    return img_resized


@app.route('/compress', methods=['POST'])
def compress():
    # get the image from the request in the form of multipart/form-data
    img = request.files['file']
    model = request.form['model']
    img_type = request.form['filetype']
    req_metric = request.form['metric']
    req_quality = request.form['quality']

    raw_img = Image.open(img.stream)
    original_img_size = len(raw_img.tobytes())

    # resize the image to the nearest multiple of 128
    img_resized = preprocess_img(raw_img)

    network = get_network(model, int(req_quality), req_metric)
    # start the compression
    img_compressor = ImageCompressor(network, img_resized)
    # 1. convert image to tensor
    img_compressor.image_to_tensor()
    # 2. run the specific model
    start_time = time.time()
    img_compressor.run()
    time_cost = time.time() - start_time
    # 3. get the compressed image
    compressed_img = img_compressor.tensor_to_image()
    # 4. get the metrics
    compression_metrics = img_compressor.calculate_metrics()

    # resize the image to the original size
    compressed_img = compressed_img.resize(
        (raw_img.size[0], raw_img.size[1]))

    # convert the image to byte array
    img_format = format_dict[img_type] if img_type in format_dict else 'JPEG'
    img_bytes = image_to_byte_array(compressed_img, img_format)

    compressed_img_size = len(img_bytes)
    compressed_ratio = "{:.2f}%".format(
        100 - compressed_img_size / original_img_size * 100)

    metrics = {
        "time_cost": f"{time_cost:.2f}s",
        "compressed_ratio": compressed_ratio,
        "original_size": f"{original_img_size / 1024:.2f}KB",
        "compressed_size": f"{compressed_img_size / 1024:.2f}KB",
    }
    metrics.update(compression_metrics)

    # return the image as file with metrics in the header
    response = make_response(
        send_file(io.BytesIO(img_bytes), mimetype=img_type))
    response.headers['X-metrics'] = json.dumps(metrics)
    return response


class ImageCompressor:
    def __init__(self, model, image: Image) -> None:
        self.model = model
        self.image = image
        self.out_net = None
        self.image_tensor = None

    def image_to_tensor(self):
        self.image_tensor = transforms.ToTensor()(self.image).unsqueeze(0).to(device)

    def tensor_to_image(self):
        return transforms.ToPILImage()(
            self.out_net['x_hat'].squeeze())

    def run(self):
        self.image_to_tensor()
        with torch.no_grad():
            out_net = self.model(self.image_tensor)
        out_net['x_hat'].clamp_(0, 1)
        self.out_net = out_net
        self.tensor_to_image()
        return out_net

    def calculate_metrics(self):
        metrics = {
            "PSNR": "{:.4f}dB".format(compute_psnr(self.image_tensor, self.out_net['x_hat'])),
            "MS-SSIM": "{:.4f}".format(compute_msssim(self.image_tensor, self.out_net['x_hat'])),
            "Bit-rate": "{:.4f}bpp".format(compute_bpp(self.out_net)),
        }
        return metrics


if __name__ == '__main__':
    from waitress import serve

    serve(app, host=HOST, port=PORT)
