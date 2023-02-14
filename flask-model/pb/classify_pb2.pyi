from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class ClassifyOneImageRequest(_message.Message):
    __slots__ = ["image_data", "image_id", "image_name", "image_type"]
    IMAGE_DATA_FIELD_NUMBER: _ClassVar[int]
    IMAGE_ID_FIELD_NUMBER: _ClassVar[int]
    IMAGE_NAME_FIELD_NUMBER: _ClassVar[int]
    IMAGE_TYPE_FIELD_NUMBER: _ClassVar[int]
    image_data: bytes
    image_id: str
    image_name: str
    image_type: str
    def __init__(self, image_id: _Optional[str] = ..., image_name: _Optional[str] = ..., image_type: _Optional[str] = ..., image_data: _Optional[bytes] = ...) -> None: ...

class ClassifyOneImageResponse(_message.Message):
    __slots__ = ["image_id", "probability", "result"]
    IMAGE_ID_FIELD_NUMBER: _ClassVar[int]
    PROBABILITY_FIELD_NUMBER: _ClassVar[int]
    RESULT_FIELD_NUMBER: _ClassVar[int]
    image_id: str
    probability: float
    result: str
    def __init__(self, image_id: _Optional[str] = ..., result: _Optional[str] = ..., probability: _Optional[float] = ...) -> None: ...
