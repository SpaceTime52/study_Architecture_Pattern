const app = require("../../app"); // 서버
const request = require("supertest"); // http 요청을 보낼 수 있는 라이브러리
const userIntDataIn = require("../data/user-data-in.js"); // 받아올 mock 데이터
const userIntDataOut = require("../data/user-data-out.js"); // 나와야 할 mock 데이터

// 예시 코드
test("POST /api/posts", async () => {
  // userIntData의 a를 넣었을 때 나오는 response
  const response = await request(app).post("/api/posts").send(userIntDataIn.a);
  expect(response.statusCode).toBe(200);
  expect(response.body.name).toBe(userIntDataOut.name);
  expect(response.body.description).toBe(userIntDataOut.description);
});
