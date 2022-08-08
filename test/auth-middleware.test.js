// 테스트할 User 컨트롤러, 서비스, 저장소의 각 클래스 import
const PostsController = require("../../controllers/posts.controller");
const PostsService = require("../../services/posts.service");
const PostRepository = require("../../repositories/posts.repository");

// req, res, next 가상 객체를 생성해주는 모듈 import
const httpMocks = require("node-mocks-http");

// 공용 변수들을 여기에 정의
let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn();
});

// 테스트에 필요한 Mock Data import
const postDataIn = require("../data/post-data-in.js"); // 받아올 mock 데이터
const postDataOut = require("../data/post-data-out.js"); // 나와야 할 mock 데이터

// jest.fn() ; - 의존적인 부분을 가짜로 대체하는 mocking function 전달
// 테스트 해볼 각종 메소드 나열
PostsController.signUp = jest.fn();
PostsController.login = jest.fn();

PostsController.signUp = jest.fn();
PostsController.getToken = jest.fn();

PostsController.getUserbyNickname = jest.fn();
PostsController.getUserbyId = jest.fn();
PostsController.getUserbyNicknamePw = jest.fn();
PostsController.createUser = jest.fn();
PostsController.getAllUsers = jest.fn();
PostsController.getAllLikedPosts = jest.fn();
PostsController.likePost = jest.fn();
PostsController.dislikePost = jest.fn();

// 회원가입 관련 테스트 그룹
describe("User - Signup-related Test", () => {
  //
  // 회원가입 과정에서 컨트롤러 관련 테스트 그룹
  describe("User Controllers Layer Test", () => {
    // 구성
    test("사용자 컨트롤러 계층은 아래와 같이 구성되어 있어야 한다.", () => {
      console.log(req);
      expect(PostsController.getUserbyNicknamePw("Tester3", "12345")).toBe(
        "정답"
      );
    });

    // 기능
    test("사용자 컨트롤러는 아래와 같은 역할을 할 수 있어야 한다.", () => {
      expect(true).toBe(true);
    });

    // 예외처리
    test("사용자 컨트롤러는 아래와 같은 상황에서도 정상 상태를 유지할 수 있어야 한다.", () => {
      expect(true).toBe(true);
    });
  });

  // 회원가입 과정에서 서비스 관련 테스트 그룹
  describe("User Services Layer Test", () => {
    // 구성
    test("사용자 서비스 계층은 아래와 같이 구성되어 있어야 한다.", () => {
      expect(true).toBe(true);
    });

    // 기능
    test("사용자 서비스는 아래와 같은 역할을 할 수 있어야 한다.", () => {
      expect(true).toBe(true);
    });

    // 예외처리
    test("사용자 서비스는 아래와 같은 상황에서도 정상 상태를 유지할 수 있어야 한다.", () => {
      expect(true).toBe(true);
    });
  });

  // 회원가입 과정에서 저장소 관련 테스트 그룹
  describe("User Repositories Layer Test", () => {
    // 구성
    test("사용자 저장소는 아래와 같이 구성되어 있어야 한다.", () => {
      expect(true).toBe(true);
    });

    // 기능
    test("사용자 저장소는 아래와 같은 역할을 할 수 있어야 한다.", () => {
      expect(true).toBe(true);
    });

    // 예외처리
    test("사용자 저장소는 아래와 같은 상황에서도 정상 상태를 유지할 수 있어야 한다.", () => {
      expect(true).toBe(true);
    });
  });
});

describe("User - Login-related Test", () => {
  //
  // 회원가입 과정에서 컨트롤러 관련 테스트 그룹
  describe("User Controllers Layer Test", () => {
    // 구성
    test("사용자 컨트롤러 계층은 아래와 같이 구성되어 있어야 한다.", () => {
      console.log(req);
      expect(true).toBe(true);
    });

    // 기능
    test("사용자 컨트롤러는 아래와 같은 역할을 할 수 있어야 한다.", () => {
      expect(true).toBe(true);
    });

    // 예외처리
    test("사용자 컨트롤러는 아래와 같은 상황에서도 정상 상태를 유지할 수 있어야 한다.", () => {
      expect(true).toBe(true);
    });
  });

  // 회원가입 과정에서 서비스 관련 테스트 그룹
  describe("User Services Layer Test", () => {
    // 구성
    test("사용자 서비스 계층은 아래와 같이 구성되어 있어야 한다.", () => {
      expect(true).toBe(true);
    });

    // 기능
    test("사용자 서비스는 아래와 같은 역할을 할 수 있어야 한다.", () => {
      expect(true).toBe(true);
    });

    // 예외처리
    test("사용자 서비스는 아래와 같은 상황에서도 정상 상태를 유지할 수 있어야 한다.", () => {
      expect(true).toBe(true);
    });
  });

  // 회원가입 과정에서 저장소 관련 테스트 그룹
  describe("User Repositories Layer Test", () => {
    // 구성
    test("사용자 저장소는 아래와 같이 구성되어 있어야 한다.", () => {
      expect(true).toBe(true);
    });

    // 기능
    test("사용자 저장소는 아래와 같은 역할을 할 수 있어야 한다.", () => {
      expect(true).toBe(true);
    });

    // 예외처리
    test("사용자 저장소는 아래와 같은 상황에서도 정상 상태를 유지할 수 있어야 한다.", () => {
      expect(true).toBe(true);
    });
  });
});
// 회원가입 관련 테스트 그룹

// 유저 시나리오
// 회원가입 - ㅇㅇ 기능 관련 테스트
// 컨트롤러 테스트
// 구조 테스트
// 컨트롤러 안에는 닉네임과 패스워드를 받아서 검증하는 요소가 필요하다.
// 컨트롤러 안에는 ㅇ~~~
// 기능 테스트
// 컨트롤러 안에 닉네임이 들어오면 서비스로 제대로 넘긴다.
// 예외 처리 테스트
// 컨트롤러 안에 닉네임이 들어오면 서비스로 제대로 넘긴다. "abc@@@@email.com"

// 서비스 테스트
// 구조 테스트
// 기능 테스트
// 예외 처리 테스트

// 저장소 테스트
// 구조 테스트
// 기능 테스트
// 예외 처리 테스트

// 게시글 - ㅇㅇ 기능 관련 테스트
// 컨트롤러 테스트
// 구조 테스트
// 기능 테스트
// 예외 처리 테스트

// 서비스 테스트
// 구조 테스트
// 기능 테스트
// 예외 처리 테스트

// 저장소 테스트
// 구조 테스트
// 기능 테스트
// 예외 처리 테스트
