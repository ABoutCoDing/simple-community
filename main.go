package main

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	e := echo.New()

	e.Pre(middleware.RemoveTrailingSlash())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Browse: false,
		HTML5:  true,
		Index:  "index.html",
		Root:   "./public",
	}))

	api := e.Group("/api")

	api.GET("/posts", func(c echo.Context) error {
		return c.JSON(http.StatusOK, []Post{
			Post{
				ID:     1,
				Title:  "ABCD",
				Author: "Jamie Han ",
				Date:   "2018-08-11",
			},
		})
	})

	api.GET("/posts/:post_id", func(c echo.Context) error {
		return c.JSON(http.StatusOK, Post{
			ID:      1,
			Title:   "ABCD",
			Author:  "Jamie Han ",
			Date:    "2018-08-11",
			Content: "ABout CoDing in 종각역",
		})
	})

	// e.GET("/", func(c echo.Context) error {
	// 	return c.JSON(http.StatusOK, map[string]interface{}{
	// 		"message": "Work in Progress",
	// 	})
	// })

	e.Start(":8080")
}

// go run main.go

type Post struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Author  string `json:"author"`
	Date    string `json:"date"`
	Content string `json:"content"`
}
