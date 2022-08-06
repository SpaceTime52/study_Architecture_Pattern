// 서비스 계층에서 사용할 저장소 클래스와 그 안의 메소드를 정의
// 그 과정에서, 다시 각 메소드가 사용할 데이터베이스 모델(시퀄라이즈)를 필요로 함(require)

// 필요한 시퀄라이즈 모델을 확보합니다.
const { Posts } = require("../models");

class PostRepository {
  findAllPost = async () => {
    const posts = await Posts.findAll();

    return posts;
  };

  createPost = async (nickname, password, title, content) => {
    const createPostData = await Posts.create({
      nickname,
      password,
      title,
      content,
    });

    return createPostData;
  };
}

module.exports = PostRepository;
