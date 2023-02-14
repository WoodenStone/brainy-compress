package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {

		cors.New(cors.Config{
			AllowOrigins: []string{"*"},
			AllowMethods: []string{"HEAD", "GET", "POST", "PUT", "PATCH", "DELETE"},
			AllowHeaders: []string{
				"Origin",
				"Content-Length",
				"Content-Type",
				"Authorization",
				"User-Agent",
				"Referer",
				"Tracestate",
				"Traceparent",
				"X-Request-Id",
				"X-Request-Timestamp",
				"X-Device-Id",
			},
			ExposeHeaders:    []string{"Content-Length", "X-TCB-Trace"},
			AllowCredentials: true,
			MaxAge:           5 * time.Minute,
		})(c)

		c.Next()
	}
}
