package customerror

type CError struct {
	Code       string
	Message    string
	StatusCode int
	Err        error
}

func New(code, message string, err error, statusCode int) *CError {
	return &CError{
		Code:       code,
		Message:    message,
		StatusCode: statusCode,
		Err:        err,
	}
}

func (e *CError) Error() string {
	return e.Message
}

func GenError(baseErr CError) func(err error) *CError {
	return func(err error) *CError {
		return New(baseErr.Code, err.Error(), err, baseErr.StatusCode)
	}
}

var (
	ErrInvalidParam = CError{Code: "INVALID_PARAM", Message: "Invalid param", StatusCode: 400}
	ErrUnknown = CError{Code: "UNKNOWN_ERROR", Message: "Unknown error", StatusCode: 500}

	ErrCompressFailed = CError{Code: "COMPRESS_FAILED", Message: "Compress failed.", StatusCode: 500}
	ErrClassifyFailed = CError{Code: "AUTO_CLASSIFY_FAILED", Message: "Failed to auto classify the image", StatusCode: 500}
)

var (
	GenInvalidParamError = GenError(ErrInvalidParam)
	GenUnknownError      = GenError(ErrUnknown)
	GenCompressFailedError = GenError(ErrCompressFailed)
	GenClassifyFailedError = GenError(ErrClassifyFailed)
)
