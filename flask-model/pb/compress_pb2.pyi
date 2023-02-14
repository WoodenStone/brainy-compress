from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Mapping as _Mapping, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class CompressOneFileRequest(_message.Message):
    __slots__ = ["file_data", "file_id", "file_name", "file_type", "image_classification", "metric", "model_name", "quality"]
    FILE_DATA_FIELD_NUMBER: _ClassVar[int]
    FILE_ID_FIELD_NUMBER: _ClassVar[int]
    FILE_NAME_FIELD_NUMBER: _ClassVar[int]
    FILE_TYPE_FIELD_NUMBER: _ClassVar[int]
    IMAGE_CLASSIFICATION_FIELD_NUMBER: _ClassVar[int]
    METRIC_FIELD_NUMBER: _ClassVar[int]
    MODEL_NAME_FIELD_NUMBER: _ClassVar[int]
    QUALITY_FIELD_NUMBER: _ClassVar[int]
    file_data: bytes
    file_id: str
    file_name: str
    file_type: str
    image_classification: str
    metric: str
    model_name: str
    quality: int
    def __init__(self, file_id: _Optional[str] = ..., file_name: _Optional[str] = ..., file_type: _Optional[str] = ..., model_name: _Optional[str] = ..., metric: _Optional[str] = ..., quality: _Optional[int] = ..., image_classification: _Optional[str] = ..., file_data: _Optional[bytes] = ...) -> None: ...

class CompressOneFileResponse(_message.Message):
    __slots__ = ["compressed_file", "file_id", "metrics"]
    class MetricsEntry(_message.Message):
        __slots__ = ["key", "value"]
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    COMPRESSED_FILE_FIELD_NUMBER: _ClassVar[int]
    FILE_ID_FIELD_NUMBER: _ClassVar[int]
    METRICS_FIELD_NUMBER: _ClassVar[int]
    compressed_file: bytes
    file_id: str
    metrics: _containers.ScalarMap[str, str]
    def __init__(self, file_id: _Optional[str] = ..., metrics: _Optional[_Mapping[str, str]] = ..., compressed_file: _Optional[bytes] = ...) -> None: ...
