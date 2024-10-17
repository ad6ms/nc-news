const db = require("../db/connection");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const { response } = require("express");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("Testing get endpoints in the app.js file", () => {
  test("GET: 200 - request to /api/topcs returns all available topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        if (!topics.length === 0) {
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        }
      });
  });
  test("GET: 200 - request to /api returns a list of all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpoints = response.body.endpoints;
        expect(response.body.endpoints).toEqual(endpoints);
      });
  });
  test("GET: 200 - request to /api/articles/:article_id responds with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.article_id).toBe(1);
        expect(response.body.article.title).toBe(
          "Living in the shadow of a great man"
        );
        expect(response.body.article.topic).toBe("mitch");
        expect(response.body.article.author).toBe("butter_bridge");
        expect(response.body.article.body).toBe(
          "I find this existence challenging"
        );
        expect(response.body.article.created_at).toBe(
          "2020-07-09T20:11:00.000Z"
        );
        expect(response.body.article.votes).toBe(100);
        expect(response.body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET: 400 - request to endpoint with invalid id will respond with invalid article id", () => {
    return request(app)
      .get("/api/articles/articleone")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid article ID");
      });
  });
  test("GET: 404 - requests to endpoint with valid id that doesnt exist will respond with 404 not found", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
  test("GET: 200 - request to /api/articles responds with all articles sorted by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        response.body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  test("GET: 200 - requests to the enpoint return all comments on an article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
        response.body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("GET: 404 - requests to endpoint with a valid id that doesn't exist returns article not found", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
  test("GET: 400 - requests to enpoint with an invalid id returns invalid article ID", () => {
    return request(app)
      .get("/api/articles/articleone/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid article ID");
      });
  });
  test("POST: 201 - requests to endpoint will add a comment to the specified article", () => {
    const testComment = {
      body: "comment",
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201)
      .then((response) => {
        expect(response.body.newComment.author).toBe("icellusedkars");
        expect(response.body.newComment.body).toBe("comment");
        expect(response.body.newComment.votes).toBe(0);
        expect(response.body.newComment.article_id).toBe(1);
        expect(typeof response.body.newComment.comment_id).toBe("number");
        expect(typeof response.body.newComment.created_at).toBe("string");
      });
  });
  test("POST: 400 - requests to endpoint with invalid comment will return 400 invalid comment", () => {
    const testComment = {
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid comment");
      });
  });
  test("PATCH: 200 - requests to endpoint will update votes on article specified by article id", () => {
    const testVotes = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(testVotes)
      .expect(200)
      .then((response) => {
        expect(response.body.article[0].votes).toBe(110);
        expect(response.body.article[0].article_id).toBe(1);
      });
  });
  test("PATCH: 400 - requests to endpoint with ivalid article id returns ivalid article error msg", () => {
    const testVotes = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/one")
      .send(testVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid article ID");
      });
  });
  test("PATCH: 404 - requests to endpoint with a valid article id that doesn't exist returns article not found error msg", () => {
    const testVotes = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/9999")
      .send(testVotes)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
  test("PATCH: 400 - requests to endpoints without valid vote will return invalid request", () => {
    const testVotes = {
      inc_votes: "one",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(testVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid request");
      });
  });
  test("DELETE: 204 - requests to endpoint will delete specified comment by comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE: 404 - requests to endpoint with valid comment that doesnt exist returns 404 comment not found", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment not found");
      });
  });
  test("GET: 200 - requests to endpoint will return array of all user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(
          response.body.forEach((user) => {
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          })
        );
      });
  });
  test("GET: 200 - requests to endpoint will accept sort by query and allow client to sort response by any valid column", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("GET: 400 - requests to endpoint with invalid queries returns 400 invalid query", () => {
    return request(app)
      .get("/api/articles?sort_by=colour")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid query");
      });
  });
  test("GET: 200 - requests to endpoint return articles by topic query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(1);
        expect(response.body.articles[0].topic).toBe("cats");
      });
  });
  test("GET: 200 - requests to endpoint with multiple queries return correct articles", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=article_id&order=ASC")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("article_id", {
          ascending: true,
        });
        response.body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
});

module.exports = app;
