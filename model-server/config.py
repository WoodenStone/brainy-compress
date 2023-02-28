import torch


# global setting
device = 'cuda' if torch.cuda.is_available() else 'cpu'
listen_addr = '[::]:50051'

# classification model
num_classes = 3
model_path = 'pretrained-model/classification.pth'

# transform
label_map = {
    0: 'simple',
    1: 'textured',
    2: 'complex'
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


# compression strategy based on classification
compression_strategy = {
    'simple': {
        'mse': 'cheng2020-anchor',
        'ms-ssim': 'cheng2020-anchor',
        'quality_label': 'low'
    },
    'textured': {
        'mse': 'cheng2020-attn',
        'ms-ssim': 'cheng2020-attn',
        'quality_label': 'medium'
    },
    'complex': {
        'mse': 'cheng2020-attn',
        'ms-ssim': 'cheng2020-anchor',
        'quality_label': 'high'
    }
}


