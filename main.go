package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

const DB_INIT_SQL = `
CREATE TABLE IF NOT EXISTS "post" (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	author TEXT NOT NULL,
	date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	content TEXT DEFAULT ''
)
`

func init() {
	db, err := sql.Open("sqlite3", "community.db")
	if nil != err {
		panic(err)
	}

	DB = db

	if _, err := DB.Exec(DB_INIT_SQL); nil != err {
		panic(err)
	}
}

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

	api.POST("/posts", func(c echo.Context) error {
		newPost := Post{}
		if err := c.Bind(&newPost); nil != err {
			return c.NoContent(http.StatusBadRequest)
		}

		if _, err := DB.Exec("INSERT INTO post (title, content, author, date) VALUES (?, ?, ?, ?)",
			newPost.Title, newPost.Content, newPost.Author, newPost.Date); nil != err {
			fmt.Println("Failed to insert data ", err)
			return c.NoContent(http.StatusInternalServerError)
		}

		return c.NoContent(http.StatusOK)
	})
	api.GET("/posts", func(c echo.Context) error {
		rows, err := DB.Query("SELECT id, title, author, date FROM post LIMIT 10")
		if nil != err {
			fmt.Println("Failed to query database ", err)
			return c.NoContent(http.StatusInternalServerError)
		}
		defer rows.Close()

		posts := make([]Post, 0)

		for rows.Next() {
			post := Post{}
			if err := rows.Scan(&post.ID, &post.Title, &post.Author, &post.Date); nil != err {
				fmt.Println("Failed to scan database", err)
				return c.NoContent(http.StatusInternalServerError)
			}

			posts = append(posts, post)
		}

		return c.JSON(http.StatusOK, posts)
	})
	api.GET("/posts/:post_id", func(c echo.Context) error {
		postID, _ := strconv.Atoi(c.Param("post_id"))
		row := DB.QueryRow("SELECT id, title, author, date, content FROM post WHERE id = ? LIMIT 1", postID)
		if nil == row {
			fmt.Println("Failed to query database ", row)
			return c.NoContent(http.StatusInternalServerError)
		}

		post := Post{}
		if err := row.Scan(&post.ID, &post.Title, &post.Author, &post.Date, &post.Content); nil != err {
			fmt.Println("Failed to scan database", err)
			return c.NoContent(http.StatusInternalServerError)
		}

		return c.JSON(http.StatusOK, post)
	})

	e.Start(":8080")
}

type Post struct {
	ID      int    `json:"id,omitempty"`
	Title   string `json:"title"`
	Author  string `json:"author"`
	Date    string `json:"date"`
	Content string `json:"content"`
}
