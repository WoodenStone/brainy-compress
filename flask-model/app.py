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
from flask import Flask, send_file
from flask import request, make_response
from pytorch_msssim import ms_ssim
from torchvision import transforms

app = Flask(__name__)

HOST = os.getenv('HOST_IP', '0.0.0.0')
PORT = os.getenv('PORT', 5000)

device = 'cuda' if torch.cuda.is_available() else 'cpu'
metric = 'mse'  # only pre-trained model for mse are available for now
# lower quality -> lower bit-rate (use lower quality to clearly see visual differences in the notebook)
quality = 1

format_dict = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'image/bmp': 'BMP',
    'image/tiff': 'TIFF',
    'image/webp': 'WebP',
}

networks = {
    'bmshj2018-factorized': bmshj2018_factorized(quality=quality, pretrained=True).eval().to(device),
    'bmshj2018-hyperprior': bmshj2018_hyperprior(quality=quality, pretrained=True).eval().to(device),
    'mbt2018-mean': mbt2018_mean(quality=quality, pretrained=True).eval().to(device),
    'mbt2018': mbt2018(quality=quality, pretrained=True).eval().to(device),
    'cheng2020-anchor': cheng2020_anchor(quality=quality, pretrained=True).eval().to(device),
    'cheng2020-attn': cheng2020_attn(quality=quality, pretrained=True).eval().to(device),
}


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


def run_network(network, img):
    """
    run the specified network on the image
    :param network:
    :param img:
    :return:
    """
    with torch.no_grad():
        out_net = network(img)
    out_net['x_hat'].clamp_(0, 1)
    return out_net


def get_image_from_output(output) -> Image:
    img = transforms.ToPILImage()(output['x_hat'].squeeze())
    return img


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


def calculate_metrics(img: Image, outputs, **kwargs):
    metrics = {
        "PSNR": "{:.4f}dB".format(compute_psnr(img, outputs['x_hat'])),
        "MS-SSIM": "{:.4f}".format(compute_msssim(img, outputs['x_hat'])),
        "Bit-rate": "{:.4f}bpp".format(compute_bpp(outputs)),
    }
    metrics.update(kwargs)
    return metrics


@app.route('/compress', methods=['POST'])
def compress():
    # get the image from the request in the form of multipart/form-data
    img = request.files['file']
    model = request.form['model']
    img_type = request.form['filetype']

    raw_img = Image.open(img.stream)
    original_img_size = len(raw_img.tobytes())

    # convert img from file to tensor
    img_converted_rgb = raw_img.convert('RGB')

    # resize the image to the nearest multiple of 128
    h, w = find_resize_hw(img_converted_rgb.size[0], img_converted_rgb.size[1])
    img_resized = img_converted_rgb.resize((h, w))

    img_converted = transforms.ToTensor()(img_resized).unsqueeze(0).to(device)

    # run the specific model
    start_time = time.time()
    outputs = run_network(networks[model], img_converted)
    time_cost = time.time() - start_time

    compressed_img = get_image_from_output(outputs)
    # resize the image to the original size
    compressed_img = compressed_img.resize(
        (img_converted_rgb.size[0], img_converted_rgb.size[1]))

    # convert the image to byte array
    img_format = format_dict[img_type] if img_type in format_dict else 'JPEG'
    img_bytes = image_to_byte_array(compressed_img, img_format)

    compressed_img_size = len(img_bytes)
    compressed_ratio = "{:.2f}%".format(
        100 - compressed_img_size / original_img_size * 100)

    metrics = calculate_metrics(
        img_converted,
        outputs,
        time_cost=f"{time_cost:.2f}s",
        compressed_ratio=compressed_ratio,
        original_size=f"{original_img_size / 1024:.2f}KB",
        compressed_size=f"{compressed_img_size / 1024:.2f}KB",
    )

    # return the image as file with metrics in the header
    response = make_response(
        send_file(io.BytesIO(img_bytes), mimetype=img_type))
    response.headers['X-metrics'] = json.dumps(metrics)
    return response


if __name__ == '__main__':
    from waitress import serve
    serve(app, host=HOST, port=PORT)
