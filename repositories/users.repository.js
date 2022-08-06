/* 
Database CRUD 작업을 감춰서 수행하고, DB 관련 연결, 해제, 자원관리 등 DB를 디테일하게 제어 
    pros.
    - 데이터를 저장하는 방법을 더 쉽게 변경해서 코드를 재사용
    - 테스트 코드 작성에 필요한 Mock Repository를 제공하기가 더 쉬워짐
    - 저장소를 추상화(Abstraction)하여 내부가 바뀌거나 DB를 마이그레이션 하더라도 영향을 받지 않음
    - 서비스 단에서 저장소 관련 코드가 분리되고 쉬워져서, 로직에 집중하기 쉬워짐
    
    cons.
    - ORM과 같은 역할. 복잡하지 않으면 왜필요함?

*/

// 서비스 계층에서 사용할 저장소 클래스와 그 안의 메소드를 정의
// 그 과정에서, 다시 각 메소드가 사용할 데이터베이스 모델(시퀄라이즈)를 필요로 함(require)

// 필요한 시퀄라이즈 모델을 확보합니다.
const { User } = require("../models");

// UserRepository.getAllUsers(orderBy = "DESC") : 가입된 User를 최근 순서대로 으로 모두 불러옴 (기본값 날짜 내림차순) :
// UserRepository.createUser(nickname, password) : User DB 생성
// UserRepository.getUserbyNickname(nickname) : nickname에 해당하는 1명의 유저를 찾는다.

class UserRepository {
  // nickname에 해당하는 1명의 유저를 찾는다.
  getUserbyNickname = async (nickname) => {
    const userInfo = await User.findOne({
      where: { nickname },
    });
    return userInfo;
  };

  // userId에 해당하는 1명의 유저를 찾는다.
  getUserbyId = async (userId) => {
    const userInfo = await User.findOne({
      where: { userId },
    });
    return userInfo;
  };

  // User DB 생성
  createUser = async (nickname, password) => {
    const createUserData = await User.create({ nickname, password });

    return createUserData;
  };

  // 가입된 User를 요청한 가입일 순서대로 으로 모두 불러옴 (기본값 날짜 내림차순)
  getAllUsers = async (orderBy = "DESC") => {
    const allUsers = await User.findAll({
      order: [["createdAt", orderBy]],
    });

    return allUsers;
  };

  // 이 유저가 지금까지 좋아요 누른 게시글 리스트를 반환  (배열로 반환 - [ '7', '9', '8' ] )
  getAllLikedPosts = async (userId) => {
    let postIdsUserLiked = await User.findOne({
      where: { userId: user.userId },
    }).then((e) => e.likedPosts);

    return postIdsUserLiked; // 배열로 반환
  };

  // userId에 해당하는 유저가 좋아한 게시글 배열에 하나 추가. returns 이후 유저가 지금까지 좋아한 리스트 반환
  likePost = async (userId, postId) => {
    // 지금까지 좋아한 배열을 불러옴
    const likedPosts = this.getAllLikedPosts(userId);
    likedPosts.push(postId); // 이번에 좋아한 게시글 id 하나를 추가함

    // 서비스에 따라 혹시 중복되어 있을 수 있으므로 set으로 중복 제거 후 다시 배열화
    likedPosts = Array.from(new Set(likedPosts));

    const newLikedPosts = await User.update(
      { likedPosts: likedPosts },
      { where: { userId: userId } }
    );

    return newLikedPosts;
  };

  // userId에 해당하는 유저가 좋아한 게시글 배열에 하나 삭제. returns 이후 유저가 지금까지 좋아한 리스트 반환
  dislikePost = async (userId, postId) => {
    // 지금까지 좋아한 배열을 불러옴
    const likedPosts = this.getAllLikedPosts(userId);

    // 그 중에 이번에 삭제할 id를 걸러낸 배열 반환
    likedPosts = likedPosts.filter((element) => element !== _postId);

    // 해당 배열로 새로운 리스트를 DB에 업데이트한 후 그 배열을 return
    const newLikedPosts = await User.update(
      { likedPosts: likedPosts },
      { where: { userId: userId } }
    );
    return newLikedPosts;
  };
}

module.exports = UserRepository;
