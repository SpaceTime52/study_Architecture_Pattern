// 테스트할 User 컨트롤러, 서비스, 저장소의 각 클래스 import
const UserController = require("../../controllers/users.controller");
const UsersService = require("../../services/users.service");
const UserRepository = require("../../repositories/users.repository");
const { User } = require("../../models");

// 테스트할 각 클래스의 인스턴스 생성
const usersController = new UserController();
const usersService = new UsersService();
const userRepository = new UserRepository();

// req, res, next 가상 객체를 생성해주는 모듈 import
const httpMocks = require("node-mocks-http");

// 테스트에 필요한 Mock Data import
const userDataIn = require("../data/user-data-in.js"); // 받아올 mock 데이터
const userDataOut = require("../data/user-data-out.js"); // 받아올 mock 데이터

// 공용 변수들을 여기에 정의
let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn();
});

// 회원가입 과정에서 컨트롤러 관련 테스트 그룹
describe("컨트롤러 signUp 메소드 단위 테스트", () => {
  beforeEach(() => {
    // signUp 메소드안에서 사용할 하위 메소드 mocking
    usersController.signupSchema.validateAsync = jest.fn();
    usersController.userService.signUp = jest.fn();
  });

  test("받은 객체가 joi객체를 통과하는지 테스트 해야한다", async () => {
    req.body = userDataIn.signUpReq;
    usersController.signupSchema.validateAsync.mockReturnValue(req.body);
    usersController.userService.signUp.mockReturnValue({
      success: true,
      message: "회원 가입에 성공하였습니다.",
    });
    await usersController.signUp(req, res, next);
    expect(usersController.signupSchema.validateAsync.mock.calls.length).toBe(
      1
    ); // 1번 불러온다.
    expect(res.statusCode).toBe(200);
  });

  test("헤더가 인증정보를 가지고 있으면 이미 로그인이 됐다는 응답을 줘야한다", async () => {
    res.locals = userDataIn.mockUser_ResLocals; // 인증 거쳐온 로그인 유저가 있으면,
    await usersController.signUp(req, res, next);
    console.log(res);
    expect(res.statusCode).toBe(400);
  });

  test("패스워드가 닉네임을 포함하면 오류 메세지를 출력해야 한다", async () => {
    // body로 이상한 데이터가 들어오면,
    req.body = {
      nickname: "Tester",
      password: "Tester1234",
      confirm: "Tester1234",
    };
    await usersController.signUp(req, res, next);
    expect(res.statusCode).toBe(400);
  });
});

describe("서비스계층 getToken 메소드 단위 테스트", () => {
  beforeEach(() => {
    // usersService의 getToken 메소드안에서 사용할 하위 메소드 mocking
    usersService.userRepository.getUserbyNicknamePw = jest.fn();
    usersService.userRepository.createUser = jest.fn();
  });

  // 기능
  test("이미 저장된 닉네임과 같은 값을 가진 유저가 있는지 확인해야 하고, 아이디 비번 검증이 완료되면 토큰이 발급되어야 한다", async () => {
    // userRepository는 유저 찾아줄 준비 완료
    usersService.userRepository.getUserbyNicknamePw.mockReturnValue(
      userDataIn.mockUser_ResLocals
    );

    // 위 유저 검증 완료되면 { success: true, token: token }를 반환할 것
    const returnValue = await usersService.getToken("Tester3", "12345");

    expect(
      usersService.userRepository.getUserbyNicknamePw.mock.calls.length
    ).toBe(1); // 이 검증 과정이 1번은 불려져야 한다.
    expect(returnValue.success).toBe(true); // 요청이 성공해야 하고,
    expect(returnValue.token).toBeTruthy(); // 토큰이 있어야 한다.
  });
  // 예외처리
  test("db에서 유저를 찾지 못하면 닉네임또는 패스워드를 확인해주세요라는 메시지 출력해야 된다.", async () => {
    // "db에서 유저를 찾지 못할" 준비를 하고 있는 재료.
    usersService.userRepository.getUserbyNicknamePw.mockReturnValue(null);

    // 못찾을 예정이므로 { success: false, message: "닉네임 또는 패스워드를 확인해주세요."}를 반환할 것
    const returnValue = await usersService.getToken("Tester3", "12345");

    expect(returnValue.success).toBe(false); // 요청이 성공해야 하고,
    expect(returnValue.message).toStrictEqual(
      "닉네임 또는 패스워드를 확인해주세요."
    ); // 토큰이 있어야 한다.
  });
});

// 회원가입 과정에서 저장소 관련 테스트 그룹
describe("저장소계층 getToken 메소드 단위 테스트", () => {
  beforeEach(() => {
    // userRepository가 의존하는 DB 모델을 모두 mocking
    User.findOne = jest.fn();
    User.findAll = jest.fn();
    User.create = jest.fn();
    User.update = jest.fn();
  });

  // 기능
  test("getUserbyNickname 메소드 : 닉네임에 해당하는 유저를 찾을 수 있어야 한다", async () => {
    // 찾아줄 준비가 된 mock 메소드
    User.findOne.mockReturnValue(userDataIn.mockUser_ResLocals);
    const user = await userRepository.getUserbyNickname("Tester3");
    expect(user.nickname).toEqual("Tester3");
  });

  test("getUserbyId: userId에 해당하는 유저를 찾을 수 있어야 한다", async () => {
    User.findOne.mockReturnValue(userDataIn.mockUser_ResLocals);
    const user = await userRepository.getUserbyId(3);
    expect(user.userId).toEqual(3);
  });

  test("getAllUsers: 가입된 유저를 가입일 순서대로 불러와야 한다", async () => {
    // User 모델 findAll에서 준비된 가짜 데이터 (createdAt에 대해 내림차순)
    User.findAll.mockReturnValue(userDataIn.allUsersRes);

    const allUsers = await userRepository.getAllUsers("DESC");

    if (allUsers.length > 1) {
      expect(
        new Date(allUsers[0].createdAt) -
          new Date(allUsers[allUsers.length - 1].createdAt)
      ).toBeGreaterThanOrEqual(0);
    } else {
      expect(true).toBe(true);
    }
  });
});
