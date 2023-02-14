package utils

import (
	"os"
	"path/filepath"
	"strings"
)

func GetCWD() string {
	cwd, _ := os.Getwd()
	return cwd
}

func TryComplementAbsolutePath(path string) string {
	if !filepath.IsAbs(path) {
		return filepath.Join(GetCWD(), path)
	}
	return path
}

func GetFileName(path string) string {
	base := filepath.Base(path)
	f := strings.Split(base, ".")
	return strings.Join(f[0:len(f)-1], ".")
}

func PanicIfError(err error, msg string) {
	if err != nil {
		panic(msg + ": \n" + err.Error())
	}
}
