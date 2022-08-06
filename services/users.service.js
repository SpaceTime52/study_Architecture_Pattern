// 컨트롤러에서 사용할 서비스 클래스와 그 안의 메소드를 정의
// 그 과정에서, 다시 각 메소드가 사용할 저장소 클래스를 필요로 함(require)

const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/users.repository");
const MY_SECRET_KEY = process.env.MY_SECRET_KEY;

class UserService {
  userRepository = new UserRepository();

  // 검증이 완료된 nickname과 password를 받아, 기존 유저가 없으면
  signUp = async (nickname, password) => {
    // 기존에 같은 닉네임을 가진 유저가 있는지 확인
    const existUsers = await this.userRepository.getUserbyNickname(nickname);

    // 기존에 같은 닉네임을 가진 유저가 있으면 에러메세지
    if (existUsers) {
      return { success: false, message: "이미 사용중인 닉네임 입니다." };
    } else {
      // 기존에 같은 닉네임을 가진 유저가 없으면 가입 가능
      await this.userRepository.createUser(nickname, password);
      return { success: true, message: "회원 가입에 성공하였습니다." };
    }
  };

  // 검증이 완료된 nickname과 password를 받아, 토큰을 반환해줍니다.
  getToken = async (nickname, password) => {
    // 접속을 시도한 동일한 유저정보(ID, PW)가 있는지 확인해보고,
    const user = await this.userRepository.getUserbyNicknamePw(
      nickname,
      password
    );

    // 찾아봤는데 DB에 그런 user가 없으면 반려
    if (!user) {
      return {
        success: false,
        message: "닉네임 또는 패스워드를 확인해주세요.",
      };

      // DB에 그런 user가 있으면 userId를 payload에 담은 토큰에 서명,발행하여 리턴
    } else {
      const token = jwt.sign({ userId: user.userId }, MY_SECRET_KEY);

      return { success: true, token: token };
    }
  };
}

module.exports = UserService;

/* 서비스 레벨에서는 비즈니스 로직을 수행, 데이터를 요청하여 각 케이스별 요구사항 구현, 프레젠테이션 계층과 저장소 계층이 직접 통신하지 않게 함

    - API 뒤에 이렇게 로직을 감췄기 때문에 서비스 계층의 코드를 자유롭게 리팩터링할 수 있습니다. : 뭔말임?
    - 사용자의 요구사항을 처리 : 현업에서는 서비스 코드의 역할이 많아짐 
    
*/
