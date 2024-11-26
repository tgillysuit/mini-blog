CREATE DATABASE miniblog;

USE miniblog;

DROP TABLE IF EXISTS posts;

CREATE TABLE posts(
	id INT AUTO_INCREMENT PRIMARY KEY,
    author VARCHAR(255),
    title VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO posts (author, title, content)
VALUES ('John Doe','Hello, world!','Welcome to the Mini Blog posts for all your posts!');

SELECT * FROM posts;