import io
import os
import time

import PIL

from model import compress_model
import pandas as pd

models = [
    'bmshj2018-factorized', 'bmshj2018-hyperprior', 'mbt2018-mean', 'mbt2018', 'cheng2020-anchor', 'cheng2020-attn'
]
req_metrics = ['mse', 'ms-ssim']

column_set = ['label', 'image_name', 'model', 'metric', 'quality', 'time_cost',
              'compressed_ratio', 'PSNR', 'MS-SSIM', 'bpp', 'score', 'rating']

results = pd.DataFrame(columns=column_set)

type_dict = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
}

quality_map = {
    'high': {
        'bmshj2018-factorized': 8,
        'bmshj2018-hyperprior': 8,
        'mbt2018-mean': 8,
        'mbt2018': 8,
        'cheng2020-anchor': 6,
        'cheng2020-attn': 6
    },
    'medium': {
        'bmshj2018-factorized': 6,
        'bmshj2018-hyperprior': 6,
        'mbt2018-mean': 6,
        'mbt2018': 6,
        'cheng2020-anchor': 5,
        'cheng2020-attn': 5
    },
    'low': {
        'bmshj2018-factorized': 4,
        'bmshj2018-hyperprior': 4,
        'mbt2018-mean': 4,
        'mbt2018': 4,
        'cheng2020-anchor': 3,
        'cheng2020-attn': 3
    }
}


def evaluate_model(quality, metric, model_name, image, image_type):
    metrics, compressed_img = compress_model.compress_one_image(img=image, model=model_name, img_type=image_type,
                                                                req_metric=metric, req_quality=quality)
    return metrics


def append_results(results, quality, model_name, image_name, label, metric, metrics):
    # print(quality, model_name, image_name, label, metric, metrics)
    results.loc[len(results)] = [label, image_name, model_name, metric, quality, metrics['time_cost'],
                                 metrics['compressed_ratio'], metrics['PSNR'], metrics['MS-SSIM'], metrics['Bit-rate'],
                                 metrics['score'], metrics['rating']]


def get_image_name_and_type(image: PIL.Image):
    name = image.filename
    img_type = name.split('.')[-1].lower()
    img_type = type_dict[img_type] if img_type in type_dict else 'image/jpeg'
    return name, img_type


def get_image_bytes(path):
    with open(path, 'rb') as f:
        return f.read()


def get_image_bytes_from_PIL(image: PIL.Image) -> io.BytesIO:
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format=image.format)
    img_byte_arr = img_byte_arr.getvalue()
    return img_byte_arr


def normalize_0_1(x: list):
    min_x = min(x)
    max_x = max(x)
    return [(item - min_x) / (max_x - min_x) for item in x]


def calculate_scores(req_metric, results: list):
    """
    Calculate the score for each item in the results.
    Normalize bpp, PSNR, MS-SSIM to 0-1 first.
    If the req_metric is MSE, then score = (1 / bpp) + 2 * PSNR + MS-SSIM
    If the req_metric is MS-SSIM, then score = (1 / bpp) + 2 * MS-SSIM + PSNR
    :param req_metric:
    :param results:
    :return:
    """

    # normalize the bpp to 0-1
    normalized_bpp = normalize_0_1([1 / float(item['Bit-rate']) for item in results])
    normalized_MSSSIM = normalize_0_1([float(item['MS-SSIM']) for item in results])
    normalized_PSNR = normalize_0_1([float(item['PSNR']) for item in results])

    if req_metric == 'mse':
        for i, item in enumerate(results):
            item['score'] = normalized_PSNR[i] + 2 * normalized_MSSSIM[i] + normalized_bpp[i]
    elif req_metric == 'ms-ssim':
        for i, item in enumerate(results):
            item['score'] = normalized_MSSSIM[i] + 2 * normalized_PSNR[i] + normalized_bpp[i]

    # sort the results by the score in ascending order
    sorted_results = sorted(results, key=lambda x: x['score'])
    # add a new key-value to each of the item of the list indicating the score with the index
    for i, item in enumerate(sorted_results):
        item['rating'] = i + 1
    return sorted_results


def find_nearest_h_w_larger_than_160(h, w):
    while h < 160 or w < 160:
        h += h
        w += w
    return h, w


def evaluate_one_image(image_path: str, req_quality: str, label: str):
    # load the image
    img = PIL.Image.open(image_path)
    image_name, image_type = get_image_name_and_type(img)
    new_img = img
    # judge if image size is smaller than 160, if is, resize it to 168
    h, w = img.size
    if h < 160 and w < 160:
        new_h, new_w = find_nearest_h_w_larger_than_160(h, w)
        print(f"Image size is smaller than 160, resize it to {new_h} x {new_w}.")
        new_img = img.resize((new_w, new_h))
        new_img.format = img.format

    image_result = pd.DataFrame(columns=column_set)
    img_bytes = get_image_bytes_from_PIL(new_img)
    # evaluate the model
    for metric in req_metrics:
        temp_res = []
        current_metric = ''
        for model_name in models:
            quality = quality_map[req_quality][model_name]
            current_metric = metric
            metrics = evaluate_model(quality, metric, model_name, img_bytes, image_type)
            metrics['model_name'] = model_name
            metrics['quality'] = quality
            temp_res.append(metrics)
        sorted_res = calculate_scores(req_metric=current_metric, results=temp_res)
        for item in sorted_res:
            append_results(image_result, metrics['quality'], item['model_name'], image_name, label, current_metric,
                           item)
    return image_result, False


if __name__ == '__main__':
    # 从用户输入中获取图片label
    label = input('Input the label of the image: ')
    # 从用户输入中获取图片质量
    quality = input('Input the quality of the image (high/low/medium): ')
    # 遍历文件夹下的所有图片
    folder_path = f"dataset/{label}/"
    for image_path in os.listdir(folder_path):
        print(f"processing {image_path}...")
        one_result, skip = evaluate_one_image(folder_path + image_path, quality, label)
        if skip:
            continue
        # update the results to the global results
        results = pd.concat([results, one_result], ignore_index=True)
    # 分别查找在 mse 和 ms-ssim 指标下的最优模型
    # 分别计数每个模型在 mse 和 ms-ssim 指标下 rating 的和，最小的为各自的最优模型
    model_rating_mse = {}
    model_rating_ms_ssim = {}
    for model_name in models:
        model_rating_mse[model_name] = 0
        model_rating_ms_ssim[model_name] = 0
    for index, row in results.iterrows():
        model_name = row['model']
        if row['metric'] == 'mse':
            model_rating_mse[model_name] += row['rating']
        elif row['metric'] == 'ms-ssim':
            model_rating_ms_ssim[model_name] += row['rating']
    best_model_mse = min(model_rating_mse, key=model_rating_mse.get)
    best_model_ms_ssim = min(model_rating_ms_ssim, key=model_rating_ms_ssim.get)

    print(f"Best model in MSE: {best_model_mse}, score: {model_rating_mse[best_model_mse]}")
    print(f"Best model in MS-SSIM: {best_model_ms_ssim}, score: {model_rating_ms_ssim[best_model_ms_ssim]}")
    time_info = time.strftime("%Y-%m-%d-%H-%M-%S", time.localtime())
    # 将所有结果导出为 xlsx 文件
    results.to_excel(f"results/{label}_{quality}_{time_info}.xlsx")
