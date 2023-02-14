package httpapi

import (
	"forwarder/apis/httpapi/controller/compress"
	"forwarder/apis/httpapi/middleware"
	"forwarder/internal/config"
	customerror "forwarder/internal/custom-error"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GinHandler(cfg *config.Config) *gin.Engine {
	gin.SetMode(cfg.GinMode)
	r := gin.New()

	r.SetTrustedProxies([]string{})

	r.Use(gin.Recovery())
	r.Use(middleware.Cors())

	v1 := r.Group("/v1")
	{
		v1.POST("/compress", WrapGinHandler(compress.CompressOneImage))
		v1.POST("/auto-compress", WrapGinHandler(compress.AutoCompressOneImage))
	}

	return r
}

type HandlerFunc func(*gin.Context) (any, *customerror.CError)

func WrapGinHandler(h HandlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		res, err := h(c)
		if err != nil {
			c.JSON(err.StatusCode, gin.H{
				"code":    err.Code,
				"message": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, res)
	}
}
