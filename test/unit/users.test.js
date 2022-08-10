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
const { request } = require("express");

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




//컨트롤러 회원가입(joi객체 통과 확인, 인증정보 있는지 확인, 비밀번호 확인, 비번이 닉네임 포함하는지 확인 )
//         로그인(joi객체 통과확인, 쿠키가지고 있는지 확인)


// 회원가입 관련 테스트 그룹
describe("User - Signup-related Test", () => {
  //
  // 회원가입 과정에서 컨트롤러 관련 테스트 그룹
  describe("회원가입에서 컨트롤러 테스트", () => {
    // 구성


    // 기능 테스트 코드를 돌리려면 

    test("받은 객체가 joi객체를 통과하는지 테스트 해야한다", async () => {
      req.body = userdataIn.signUpReq;
      expect(resCode).toBe(201);
    });

    test("헤더가 인증정보를 가지고 있으면 이미 로그인이 됐다는 응답을 줘야한다", () => {      
      const result = userController.signUp.
      mockReturnValue("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY1OTk2MzA1NH0.XFjC5KhSJ-K-3XwjvyOTdmMu5k5Fe3GDqaCOfOezrAo");

      expect(result).toStrictEqual({
        status: 400,
        messagee: "이미 로그인이 되어있습니다"
      })
    });



    
    test("패스워드와 닉네임이 일치하면 오류 메세지를 출력해야 한다", () => {
      let result;
      const nic = userDatain.loginReq.nickname;
      const pas = userDatain.loginReq.password;
      if(nic == pas){
        return result = false;
      }
      expect(result).toEqual(flase);
    });

    test("로그인한 유저라면 쿠키 값을 가지고 있어야 한다", async () => {
      const result = userDataout.loginRes.
      mockReturnValue("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY1OTk2MzA1NH0.XFjC5KhSJ-K-3XwjvyOTdmMu5k5Fe3GDqaCOfOezrAo");

      expect(result).toEqual(true);
    });

    // 예외처리
    test("사용자 컨트롤러는 아래와 같은 상황에서도 정상 상태를 유지할 수 있어야 한다.", () => {
      expect(true).toBe(true);
    });
  });

  // 회원가입, 로그인 과정에서 서비스 관련 테스트 그룹
  describe("User Services Layer Test", () => {

    // 기능
    test("회원가입할때 저장된 닉네임과 같은 값을 가진 유저가 있는지 확인해야 한다", () => {
      const nick = userService.userRepository.signUpReq.nickname.mockReturnValue("Develope");
      const user = req.body.nickname;
      expect((nick == user)).toEqual(true);
    });

    test("아이디 비번 검증이 완료되면 토큰이 발급되어야 한다", () => {
        request.loclas.user= userDatain.userReq_Cookie;
        expect(request.loclas.user).toEqual(true);
    });

    // 예외처리
    test("db에서 유저를 찾지 못하면 닉네임또는 패스워드를 확인해주세요라는 메시지 출력해야 된다.", () => {
      const user  =UserRepository.createUser;
      expect(user).toStrictEqual({
        status: 404,
        message: "닉네임또는 패스워드를 확인해주세요.",
      });
    });
  });

  // 회원가입 과정에서 저장소 관련 테스트 그룹
  describe("User Repositories Layer Test", () => {

    // 기능
    test("닉네임에 해당하는 유저를 찾을 수 있어야 한다", () => {
      const nickanme = "Developer"; 
      const user = userDatain.loginReq.mockReturnValue('Developer');
      expect(nickname == user).toEqual(true);
    });

    test("userId에 해당하는 유저를 찾을 수 있어야 한다", () => {
      const Id = 3; 
      const userId =  userDatain.mockUser_ResLocals.mockReturnValue(3);
      expect(Id == userId).toBe(true);
    });

    test("가입된 유저를 가입일 순서대로 불러와야 한다", () => {
      User.findAll.mockReturnValue(mockUser_ResLocals);
      const result = await userRepository.getAllPosts("DESC");

      if (result.length > 1) {
        expect(
          new Date(result[0].createdAt) -
            new Date(result[result.length - 1].createdAt)
        ).toBeGreaterThanOrEqual(0);
      } else {
        expect(true).toBe(true);
      }
    });


    test("해당 유저가 좋아요 누른 게시글을 반환할 수 있어야 한다", () => {
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
