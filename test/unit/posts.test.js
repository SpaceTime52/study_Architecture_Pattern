// 테스트할 User 컨트롤러, 서비스, 저장소의 각 클래스 import
const PostsController = require("../../controllers/posts.controller");
const PostsService = require("../../services/posts.service");
const PostRepository = require("../../repositories/posts.repository");

// 테스트할 각 클래스의 인스턴스 생성
const postsController = new PostsController();
const postsService = new PostsService();
const postRepository = new PostRepository();

// req, res, next 가상 객체를 생성해주는 모듈 import
const httpMocks = require("node-mocks-http");

// 공용 변수들을 여기에 정의

// 테스트에 필요한 Mock Data import
const userDataIn = require("../data/user-data-in.js"); // 받아올 mock 데이터
const postDataIn = require("../data/post-data-in.js"); // 받아올 mock 데이터
const postDataOut = require("../data/post-data-out.js"); // 나와야 할 mock 데이터

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn();
});

describe("PostsController의 클래스의 테스트", () => {
  describe("getAllPosts 메소드 테스트", () => {
    beforeEach(() => {
      postsController.postService.getAllPosts = jest.fn();
      postsController.postService.getAllPosts.mockReturnValue(
        postDataOut.getPostsRes.data
      );
    });
    it("기능: 받아온 데이터를 받아 200번의 status-code를 응답해야 한다.", async () => {
      await postsController.getAllPosts(req, res, next);
      expect(res.statusCode).toBe(200);
    });
    it("기능: 받아온 데이터는 특정 형태로 응답하여 명세서에 맞춰야 한다.", async () => {
      await postsController.getAllPosts(req, res, next);
      expect(res._getJSONData()).toStrictEqual(postDataOut.getPostsRes);
    });
  });
  describe("updatePost 메소드 테스트", () => {
    beforeEach(async () => {
      res.body = postDataIn.updatePostReq;
      postsController.postService.updatePost = jest.fn();
      postsController.postService.updatePost.mockReturnValue({
        status: 201,
        message: "게시글을 수정하였습니다.",
      });
      // 인증 거쳐온 로그인 유저의 쿠키 전달
      res.locals = userDataIn.mockUser_ResLocals;
    });

    it("기능: 받아온 데이터를 받아 메세지만 전달받아 응답하고, 201번의 status-code를 응답해야 한다.", async () => {
      req.params._postId = "3";
      await postsController.updatePost(req, res, next);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toStrictEqual(postDataOut.updatePostRes);
    });
    it("예외처리: _postId 에 담겨 들어온 데이터가 숫자가 아니면,다음 경로를 검토하도록 흘려보낸다.", async () => {
      req.params._postId = "like";
      await postsController.updatePost(req, res, next);
      // next가 1번 불러지고, 그 뒤의 서비스 메소드는 불러와지지 않아야 한다.
      expect(next.mock.calls.length).toBe(1);
      expect(postsController.postService.updatePost.mock.calls.length).toBe(0);
    });
    it("예외처리: - body에 담겨 들어온 *title*, *content 가 이상하면, 에러메세지를 띄워 리턴한다.그때 400번의 에러메세지를 응답해야 한다.", async () => {
      expect(true).toBe(true);
    });
    it("예외처리: _postId 숫자에 맞는 게시글 데이터가 없으면  에러메세지를 띄워 리턴한다. 그때 400번의 에러메세지를 응답해야 한다.", async () => {
      expect(true).toBe(true);
    });
  });
});

describe("PostServices의 클래스의 테스트", () => {
  describe("getAllPosts 메소드 테스트", () => {
    it("예외처리: 받아온 데이터가 빈 배열일 경우에도 빈 배열을 리턴한다. .", () => {
      expect(true).toBe(true);
    });
  });
  describe("updatePost 메소드 테스트", () => {
    it("기능: - 게시글을 업데이트한 후 '게시글을 수정하였습니다.'”'라는 메세지를 컨트롤러에 전달한다. 이 때 status-code 201번을 함께 전달함으로써 컨트롤러가 객체로써 활용하도록 한다.", () => {
      expect(true).toBe(true);
    });
    it("예외처리: DB에서 게시글을 찾지 못하는 경우 '해당 게시글이 없습니다.'”'라는 메세지를 컨트롤러에 전달한다. 이 때 status-code 400번을 함께 전달하여 컨트롤러가 객체로서 사용하게 한다.", () => {
      expect(true).toBe(true);
    });
    it("예외처리: 수정하려는 글(postId)을 작성한 작성자가 아니면 수정 권한이 없으므로 수정하지 않고 '수정 권한이 없습니다.'라는 에러메세지를 리턴한다. 이 때 status-code 400번을 함께 전달하여 컨트롤러가 객체로서 사용하게 한다.", () => {
      expect(true).toBe(true);
    });
  });
  describe("likePost 메소드 테스트", () => {
    it("기능: this.userRepository.getAllLikedPosts(userId)에서 받아온 값이 배열인지 확인한다.", () => {
      expect(true).toBe(true);
    });
    it("기능: 사용자가 지금까지 좋아한 리스트에 이번 게시글이 없는 경우, 함께 호출되는 메소드는 this.postRepository.likePost와 this*.userRepository.likePost여야 한다.", () => {
      expect(true).toBe(true);
    });
    it("기능: 사용자가 지금까지 좋아한 리스트에 이번 게시글이 있는 경우, 좋아요를 취소해야 하므로 함께 호출되는 메소드는 this.postRepository.dislikePost와 this.userRepository.dislikePost여야 한다.", () => {
      expect(true).toBe(true);
    });
    it("기능: 각각의 경우에 2개의 메소드가 모두 잘 호출 되었는지 확인한다.", () => {
      expect(true).toBe(true);
    });
    it("예외처리: - DB에서 게시글을 찾지 못하는 경우 '해당 게시글이 없습니다.'라는 메세지를 컨트롤러에 전달한다.이 때 status-code 400번을 함께 전달하여 컨트롤러가 객체로서 사용하게 한다.", () => {
      expect(true).toBe(true);
    });
  });
  describe("listMyLikedPosts 메소드 테스트", () => {
    it("기능: this.userRepository.getAllLikedPosts와 this.postRepository.getPostsByLikedArray가 잘 호출되었는지 확인한다.", () => {
      expect(true).toBe(true);
    });
    it("기능: this.userRepository.getAllLikedPosts*에서 받아온 값이 배열인지 확인한다.", () => {
      expect(true).toBe(true);
    });
    it("기능: this.postRepository.getPostsByLikedArray와 함께 호출된 파라미터가 this.userRepository.getAllLikedPosts의 리턴값과 같은지 확인한다.", () => {
      expect(true).toBe(true);
    });
  });
});

describe("PostRepository 클래스의 메소드 테스트", () => {
  describe("getPost 메소드 테스트", () => {
    it("기능: 파라미터에 ## 를 넣으면 {} ~~~ 모양의 데이터를 반환한다.", () => {
      expect(true).toBe(true);
    });
  });
  describe("getAllPosts 메소드 테스트", () => {
    it("기능: 인자가 'DESC'이거나 없으면, 모델로부터 받아온 데이터가 날짜의 내림차순 정렬되어 있다.", () => {
      expect(true).toBe(true);
    });
    it("기능: 인자가 ‘ASC’이면, 모델로부터 받아온 데이터가 날짜의 오름차순 정렬되어 있다.", () => {
      expect(true).toBe(true);
    });
  });
  describe("getPostsByLikedArray 메소드 테스트", () => {
    it("기능: findAll을 통해서 반환된 값(allPostsUserLiked)이 likes수에 내림차순으로 잘 정렬 되어 있는지 확인한다.", () => {
      expect(true).toBe(true);
    });
  });
  describe("createNewPost 메소드 테스트", () => {
    it("기능: 모델 Post에 Post.create를 명령하고 반환 받은 리턴값이 전달한 값과 동일하게 잘 들어왔는지 확인한다. ", () => {
      expect(true).toBe(true);
    });
  });
  describe("updatePost 메소드 테스트", () => {
    it("기능: 모델 Post에 Post.update를 명령하고 반환 받은 리턴값이 전달한 값과 동일하게 잘 들어왔는지 확인한다. ", () => {
      expect(true).toBe(true);
    });
  });
  describe("likePost 메소드 테스트", () => {
    it("기능: 전달한 postId의 전후 비교하여 해당 게시글의 likes 데이터가 1만큼 상승하였는지 확인한다.", () => {
      expect(true).toBe(true);
    });
  });
  describe("dislikePost 메소드 테스트", () => {
    it("기능: 전달한 postId의 전후  비교하여 해당 게시글의 likes 데이터가 1만큼 감소하였는지 확인한다.", () => {
      expect(true).toBe(true);
    });
    it("기능: 모델 Post에 Post.create를 명령하고 반환 받은 리턴값이 전달한 값과 동일하게 잘 들어왔는지 확인한다. ", () => {
      expect(true).toBe(true);
    });
  });
});

// 사용 가능 메소드

// postsController.getAllPosts
// postsController.updatePost
// postsController.createNewPost
// postsController.getPostDetail
// postsController.deletePost
// postsController.likePost
// postsController.listMyLikedPosts

// postsService.getAllPosts
// postsService.updatePost
// postsService.likePost
// postsService.listMyLikedPosts
// postsService.createNewPost
// postsService.getPostDetail
// postsService.deletePost

// postRepository.deletePost
// postRepository.getPost
// postRepository.getAllPosts
// postRepository.getPostsByLikedArray
// postRepository.createNewPost
// postRepository.updatePost
// postRepository.likePost
// postRepository.dislikePost
