const db = require("../db/connection");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const { response } = require("express");

beforeEach(() => seed(data));

afterAll(() => {
  return db.end();
});

describe("Testing endpoints in the app.js file", () => {
  test("GET: 200 - request to /api/topcs returns all available topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
  test("GET: 200 - request to /api returns a list of all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpoints = response.body.endpoints;
        expect(typeof endpoints).toBe("object");
      });
  });
});

describe("Error handling", () => {
  test("GET: ", () => {});
});

module.exports = app;
