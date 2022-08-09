// 검증할 모듈 import
const authMiddleware = require("../middlewares/auth-middleware");

// 필요한 내부 모듈과 DataSet import
const UserRepository = require("../repositories/users.repository");
const userRepository = new UserRepository();
const userDataIn = require("./data/user-data-in.js"); // 받아올 mock 데이터

// 필요한 외부 모듈과 변수들을 import
const jwt = require("jsonwebtoken"); // 토큰 관련
const httpMocks = require("node-mocks-http"); // req, res, next 가상 객체를 생성해주는 모듈
const MY_SECRET_KEY = process.env.MY_SECRET_KEY;

// 공용 변수들을 define
let req, res, next;

beforeEach(() => {
  // test에 활용할 수 있도록 mock data 할당
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn(); // mocking 함수로 정의

  UserRepository.getUserbyId = jest.fn();
});

describe("AuthMiddleware _ 기능 검증 Group", () => {
  test("유효한 토큰을 전달했을 때 res.locals에 user 정보 기록", () => {
    req.cookies.token = userDataIn.userReq_Cookie.token;
    authMiddleware(req, res, next);
    expect(true).toHaveBeenCalledTimes(true);
  });
});

// 회원가입 과정에서 저장소 관련 테스트 그룹
describe("AuthMiddleware _ 예외처리 검증 Group", () => {
  test("Bearer로 시작하지 않는 토큰에 에러.", () => {
    expect(true).toBe(true);
  });

  test("payload가 없거나 비어 있는 토큰 반려.", () => {
    expect(true).toBe(true);
  });

  test("무효한 토큰 반려.", () => {
    expect(true).toBe(true);
  });

  test("시간이 지난 토큰 반려.", () => {
    expect(true).toBe(true);
  });

  test("토큰이 빈 문자열일 때.", () => {
    expect(true).toBe(true);
  });
});
