// 테스트할 User 컨트롤러, 서비스, 저장소의 각 클래스 import
const UsersController = require("../../controllers/users.controller");
const UsersService = require("../../services/users.service");
const UserRepository = require("../../repositories/users.repository");

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
const { a, b, c } = require("../data/user-data-in.js");
const { x, y, z } = require("../data/user-data-out.js");

// jest.fn() ; - 의존적인 부분을 가짜로 대체하는 mocking function 전달
// 테스트 해볼 각종 메소드 나열
UsersController.signUp = jest.fn();
UsersController.login = jest.fn();

UsersService.signUp = jest.fn();
UsersService.getToken = jest.fn();

UserRepository.getUserbyNickname = jest.fn();
UserRepository.getUserbyId = jest.fn();
UserRepository.getUserbyNicknamePw = jest.fn();
UserRepository.createUser = jest.fn();
UserRepository.getAllUsers = jest.fn();
UserRepository.getAllLikedPosts = jest.fn();
UserRepository.likePost = jest.fn();
UserRepository.dislikePost = jest.fn();

// 회원가입 관련 테스트 그룹
describe("User - Signup-related Test", () => {
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

// 시나리오
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
