// ------------- auth-middleware의 테스트코드

// const { User } = require("../models");
const MY_SECRET_KEY = process.env.MY_SECRET_KEY;
const authMiddleware = require("./auth-middleware.js");

console.dir(authMiddleware);

// 예시 리퀘스트_1은 cookie를 가지고 있다.
const mockRequest_1 = {
  cookies: {
    token:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY1OTc2MjU4MX0.cuGaovJIzzpOmPPhWaccq46NJ2ozFxnqUHcXGFgOinM",
  },
};

// 예시 리퀘스트_2는 cookie를 가지고 있지 않다.
const mockRequest_2 = {
  cookies: {},
};

// 예시 리퀘스트_3은 cookie를 가지고 있지만 Bearer가 없다.
const mockRequest_3 = {
  cookies: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY1OTc2MjU4MX0.cuGaovJIzzpOmPPhWaccq46NJ2ozFxnqUHcXGFgOinM",
  },
};

const expectedOkayResponse = true;

// {
//   locals: {
//     user: {
//       userId: 3,
//       nickname: "Tester3",
//       password: "12345",
//       likedPosts: [],
//     },
//   },
// };

let nextFunction = jest.fn();

describe("Authorization middleware 테스트 중입니다.", () => {
  test("테스트가 성공해야 하는 상황", () => {
    authMiddleware(mockRequest_1, expectedOkayResponse, nextFunction);
    expect(expectedOkayResponse).toEqual(true);
  });
  test("테스트가 실패하는 상황", () => {
    authMiddleware(mockRequest_1, expectedOkayResponse, nextFunction);
    expect(expectedOkayResponse).toEqual(false);
  });
});
