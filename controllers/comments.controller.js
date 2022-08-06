/* 여기에 전달될 클라이언트의 요청을 적절히 나누어 처리보내고 반환해주는 역할을 함 (요청 수신, 데이터 검증, 결과 반환, 예외처리) */
// 라우터에서 사용할 컨트롤러 클래스와 그 안의 메소드를 정의
// 그 과정에서, 다시 각 메소드가 사용할 서비스 클래스를 필요로 함(require)

const PostService = require("../services/posts.service");

// Post의 컨트롤러(Controller)역할을 하는 클래스
class PostsController {
  postService = new PostService(); // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.

  getPosts = async (req, res, next) => {
    // 서비스 계층에 구현된 findAllPost 로직을 실행합니다.
    const posts = await this.postService.findAllPost();

    res.status(200).json({ data: posts });
  };

  createPost = async (req, res, next) => {
    const { nickname, password, title, content } = req.body;

    // 서비스 계층에 구현된 createPost 로직을 실행합니다.
    const createPostData = await this.postService.createPost(
      nickname,
      password,
      title,
      content
    );

    res.status(201).json({ data: createPostData });
  };

  getPostDetail = async (req, res, next) => {
    const { nickname, password, title, content } = req.body;

    // 서비스 계층에 구현된 createPost 로직을 실행합니다.
    const createPostData = await this.postService.createPost(
      nickname,
      password,
      title,
      content
    );

    res.status(201).json({ data: createPostData });
  };

  putPost = async (req, res, next) => {
    // 서비스 계층에 구현된 findAllPost 로직을 실행합니다.
    const posts = await this.postService.findAllPost();

    res.status(200).json({ data: posts });
  };

  deletePost = async (req, res, next) => {
    const { nickname, password, title, content } = req.body;

    // 서비스 계층에 구현된 createPost 로직을 실행합니다.
    const createPostData = await this.postService.createPost(
      nickname,
      password,
      title,
      content
    );

    res.status(201).json({ data: createPostData });
  };
}

module.exports = PostsController;
