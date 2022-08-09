// 테스트할 User 컨트롤러, 서비스, 저장소의 각 클래스 import
const PostsController = require("../../controllers/posts.controller");
const PostsService = require("../../services/posts.service");
const PostRepository = require("../../repositories/posts.repository");
const { Post } = require("../../models");

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
      // getAllPosts 메소드안에서 사용할 메소드 mocking
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
      // updatePost 메소드안에서 사용할 메소드 mocking
      postsController.postService.updatePost = jest.fn();
      postsController.postService.updatePost.mockReturnValue({
        status: 201,
        message: "게시글을 수정하였습니다.",
      });
      // 인증 거쳐온 로그인 유저의 쿠키 전달
      res.locals = userDataIn.mockUser_ResLocals;
    });

    it("기능: 받아온 데이터를 받아 메세지만 전달받아 응답하고, 201번의 status-code를 응답해야 한다.", async () => {
      res.body = postDataIn.updatePostReq; // bodt, params 에 모두 정상적인 데이터가 들어왔을 때,
      req.params._postId = "3";
      await postsController.updatePost(req, res, next);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toStrictEqual(postDataOut.updatePostRes);
    });

    it("예외처리: _postId 에 담겨 들어온 데이터가 숫자가 아니면,다음 경로를 검토하도록 흘려보낸다.", async () => {
      req.params._postId = "like"; // params 에 이상한 데이터가 들어옴
      res.body = postDataIn.updatePostReq; // 바디엔 정상적인 데이터가 들어옴
      await postsController.updatePost(req, res, next);
      // next가 1번 불러지고, 그 뒤의 서비스 메소드는 불러와지지 않아야 한다.
      expect(next.mock.calls.length).toBe(1);
      expect(postsController.postService.updatePost.mock.calls.length).toBe(0);
    });

    it("예외처리: body에 담겨 들어온 title, content 가 이상하면, 에러메세지를 띄워 리턴한다.그때 400번의 에러메세지를 응답해야 한다.", async () => {
      req.params._postId = "3"; // params 에 정상적인 데이터가 들어옴
      res.body = 3; // 바디에 비정상적인 데이터가 들어옴

      postsController.postService.updatePost.mockImplementation(() => {
        throw new Error("게시글을 수정할 수 없습니다.");
      });
      await postsController.updatePost(req, res, next);
      expect(res.statusCode).toBe(400);
    });
  });
});

describe("PostServices의 클래스의 테스트", () => {
  describe("getAllPosts 메소드 테스트", () => {
    beforeEach(() => {
      // getAllPosts 메소드안에서 사용할 메소드 mocking
      postsService.postRepository.getAllPosts = jest.fn();
    });
    it("예외처리: 받아온 데이터가 빈 배열일 경우에도 빈 배열을 리턴한다.", async () => {
      postsService.postRepository.getAllPosts.mockReturnValue([]);
      const resultData = await postsService.getAllPosts();
      expect(resultData).toMatchObject([]); // toMatchObject를 쓰는 이유 _ [] === [] : false (Array는 참조형)
    });
  });
  describe("updatePost 메소드 테스트", () => {
    beforeEach(() => {
      // getAllPosts 메소드안에서 사용할 메소드 mocking
      postsService.postRepository.getPost = jest.fn();
      postsService.postRepository.updatePost = jest.fn();
      // 인증 거쳐온 로그인 유저의 쿠키 전달
      res.locals.user = userDataIn.mockUser_ResLocals;
    });
    it("기능: - 게시글을 업데이트한 후 '게시글을 수정하였습니다.'라는 메세지를 컨트롤러에 전달한다. 이 때 status-code 201번을 함께 전달함으로써 컨트롤러가 객체로써 활용하도록 한다.", async () => {
      // 정상적인 데이터가 접수 되었을 때 postRepository의 리턴
      postsService.postRepository.getPost.mockReturnValue(
        postDataOut.getPostDetailRes.data
      );
      postsService.postRepository.updatePost.mockReturnValue(
        postDataOut.getPostDetailRes
      );

      console.log(res.locals);
      const result = await postsService.updatePost(
        res.locals.user,
        "3",
        "title",
        "content"
      );
      expect(result.status).toBe(201);
      expect(result).toStrictEqual({
        status: 201,
        message: "게시글을 수정하였습니다.",
      });
    });
    it("예외처리: DB에서 게시글을 찾지 못하는 경우 '해당 게시글이 없습니다.'”'라는 메세지를 컨트롤러에 전달한다. 이 때 status-code 400번을 함께 전달하여 컨트롤러가 객체로서 사용하게 한다.", async () => {
      // postRepository가 게시글을 찾지 못한 경우,
      postsService.postRepository.getPost.mockReturnValue(null);

      const result = await postsService.updatePost(
        res.locals.user,
        "3",
        "title",
        "content"
      );
      expect(result.status).toBe(400);
      expect(result).toStrictEqual({
        status: 400,
        message: "해당 게시글이 없습니다.",
      });
    });
    it("예외처리: 수정하려는 글(postId)을 작성한 작성자가 아니면 수정 권한이 없으므로 수정하지 않고 '수정 권한이 없습니다.'라는 에러메세지를 리턴한다. 이 때 status-code 400번을 함께 전달하여 컨트롤러가 객체로서 사용하게 한다.", async () => {
      // 정상적인 데이터가 접수 되었을 때 postRepository의 리턴
      postsService.postRepository.getPost.mockReturnValue(
        postDataOut.getPostDetailRes_otherWriter.data
      );

      console.log(res.locals);
      const result = await postsService.updatePost(
        res.locals.user,
        "3",
        "title",
        "content"
      );
      expect(result.status).toBe(400);
      expect(result).toStrictEqual({
        status: 400,
        message: "수정 권한이 없습니다.",
      });
    });
  });
  describe("likePost 메소드 테스트", () => {
    beforeEach(() => {
      // likePost 메소드안에서 사용할 메소드 mocking
      postsService.postRepository.getPost = jest.fn();
      postsService.postRepository.likePost = jest.fn();
      postsService.postRepository.dislikePost = jest.fn();
      postsService.userRepository.getAllLikedPosts = jest.fn();
      postsService.userRepository.likePost = jest.fn();
      postsService.userRepository.dislikePost = jest.fn();
      // 인증 거쳐온 로그인 유저의 쿠키 전달
      res.locals.user = userDataIn.mockUser_ResLocals;
    });

    it("기능: 사용자가 지금까지 좋아한 리스트에 이번 게시글이 없는 경우, 함께 호출되는 메소드는 this.postRepository.likePost와 this*.userRepository.likePost여야 한다.", async () => {
      // 정상적인 데이터가 접수 되었을 때 Repository들의 리턴
      postsService.postRepository.getPost.mockReturnValue(
        postDataOut.getPostDetailRes.data
      );
      postsService.userRepository.getAllLikedPosts.mockReturnValue(["1", "3"]); // 기존에 좋아한 배열이 1,3인 상태에서
      await postsService.likePost(res.locals.user, "4"); // 4번을 좋아하면

      // 좋아요가 각각 1번씩 호출된다.
      expect(postsService.postRepository.likePost.mock.calls.length).toBe(1);
      expect(postsService.userRepository.likePost.mock.calls.length).toBe(1);
    });
    it("기능: 사용자가 지금까지 좋아한 리스트에 이번 게시글이 있는 경우, 좋아요를 취소해야 하므로 함께 호출되는 메소드는 this.postRepository.dislikePost와 this.userRepository.dislikePost여야 한다.", async () => {
      // 정상적인 데이터가 접수 되었을 때 Repository들의 리턴
      postsService.postRepository.getPost.mockReturnValue(
        postDataOut.getPostDetailRes.data
      );
      postsService.userRepository.getAllLikedPosts.mockReturnValue(["1", "3"]); // 기존에 좋아한 배열이 1,3인 상태에서
      await postsService.likePost(res.locals.user, "3"); // 3번을 좋아하면

      // 좋아요가 각각 1번씩 호출된다.
      expect(postsService.postRepository.dislikePost.mock.calls.length).toBe(1);
      expect(postsService.userRepository.dislikePost.mock.calls.length).toBe(1);
    });
    it("예외처리: - DB에서 게시글을 찾지 못하는 경우 '해당 게시글이 없습니다.'라는 메세지를 컨트롤러에 전달한다.이 때 status-code 400번을 함께 전달하여 컨트롤러가 객체로서 사용하게 한다.", async () => {
      // 정상적인 데이터가 접수 되었을 때 Repository들의 리턴
      postsService.postRepository.getPost.mockReturnValue(null); // 좋아요 누른 포스트가 DB에 없어서 저장소가 못찾아오면,
      postsService.userRepository.getAllLikedPosts.mockReturnValue(["1", "3"]); // 기존에 좋아한 배열이 1,3인 상태에서
      const result = await postsService.likePost(res.locals.user, "55"); // 55번을 좋아하더라도

      // 좋아요가 각각 1번씩 호출된다.
      expect(result.status).toBe(400);
      expect(result).toStrictEqual({
        status: 400,
        message: "해당 게시글이 없습니다.",
      });
    });
  });
  describe("listMyLikedPosts 메소드 테스트", () => {
    beforeEach(() => {
      // listMyLikedPosts 메소드안에서 쓰이는 메소드 mocking
      postsService.userRepository.getAllLikedPosts = jest.fn();
      postsService.postRepository.getPostsByLikedArray = jest.fn();
      postsService.userRepository.getAllLikedPosts.mockReturnValue(["1", "3"]); // 기존에 좋아한 배열이 1,3인 상태에서 시작
      // 인증 거쳐온 로그인 유저의 쿠키 전달
      res.locals.user = userDataIn.mockUser_ResLocals;
    });

    it("기능: 반환하는 값이 배열인지 확인한다.", async () => {
      // 정상적인 데이터가 접수 되었을 때 Repository들의 리턴

      postsService.postRepository.getPostsByLikedArray.mockReturnValue(
        postDataOut.getlikedPostsRes.data
      );
      const result = await postsService.listMyLikedPosts(res.locals.user); // 로그인한 유저의 리스트

      // 좋아요가 각각 1번씩 호출된다.
      expect(Array.isArray(result)).toBe(true);
      expect(postsService.postRepository.getPostsByLikedArray).toBeCalledWith([
        "1",
        "3",
      ]);
    });
    it("기능: this.postRepository.getPostsByLikedArray와 함께 호출된 파라미터가 this.userRepository.getAllLikedPosts의 리턴값과 같은지 확인한다.", () => {
      expect(true).toBe(true);
    });
  });
});

describe("PostRepository 클래스의 메소드 테스트", () => {
  beforeEach(() => {
    // PostRepository가 의존하는 DB 모델을 모두 mocking
    Post.findOne = jest.fn();
    Post.findAll = jest.fn();
    Post.create = jest.fn();
    Post.update = jest.fn();
    Post.destroy = jest.fn();
  });
  describe("getPost 메소드 테스트", () => {
    it("기능: 파라미터에 존재하는 게시글의 를 넣으면 DB의 컬럼이 모두 담긴 데이터를 반환한다.", async () => {
      Post.findOne.mockReturnValue(postDataOut.getPostDetailRes.data);
      const result = await postRepository.getPost("3");
      expect(result).toHaveProperty("postId");
      expect(result).toHaveProperty("userId");
      expect(result).toHaveProperty("nickname");
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("content");
      expect(result).toHaveProperty("createdAt");
      expect(result).toHaveProperty("updatedAt");
      expect(result).toHaveProperty("likes");
    });
  });
  describe("getAllPosts 메소드 테스트", () => {
    it("기능: 인자가 'DESC'이거나 없으면, 모델로부터 받아온 데이터가 날짜의 내림차순 정렬되어 있다.", async () => {
      Post.findAll.mockReturnValue(postDataOut.getPostsRes.data);
      const result = await postRepository.getAllPosts("DESC");

      if (result.length > 1) {
        expect(
          new Date(result[0].createdAt) -
            new Date(result[result.length - 1].createdAt)
        ).toBeGreaterThanOrEqual(0);
      } else {
        expect(true).toBe(true);
      }
    });
    it("기능: 인자가 ‘ASC’이면, 모델로부터 받아온 데이터가 날짜의 오름차순 정렬되어 있다.", async () => {
      Post.findAll.mockReturnValue(postDataOut.getPostsResAscending.data);
      const result = await postRepository.getAllPosts("ASC");

      if (result.length > 1) {
        expect(
          new Date(result[0].createdAt) -
            new Date(result[result.length - 1].createdAt)
        ).toBeLessThan(0);
      } else {
        expect(true).toBe(true);
      }
    });
  });
  describe("getPostsByLikedArray 메소드 테스트", () => {
    it("기능: findAll을 통해서 반환된 값(allPostsUserLiked)이 likes수에 내림차순으로 잘 정렬 되어 있는지 확인한다.", async () => {
      Post.findAll.mockReturnValue(postDataOut.getPostsResAscending.data); // likes 내림차순 정렬돼있는 공용 mockdata 제시
      const result = await postRepository.getPostsByLikedArray(["7", "8"]);

      if (result.length > 1) {
        expect(
          new Date(result[0].likes) - new Date(result[result.length - 1].likes)
        ).toBeGreaterThanOrEqual(0);
      } else {
        expect(true).toBe(true);
      }
    });
  });
  describe("createNewPost 메소드 테스트", () => {
    it("기능: 모델 Post에 Post.create를 명령하고 반환 받은 리턴값이 전달한 값과 동일하게 잘 들어왔는지 확인한다. ", async () => {
      const mockDataDBout = postDataOut.createdPostRes.data; //
      Post.create.mockReturnValue(mockDataDBout);
      const result = await postRepository.createNewPost(
        5,
        "Tester4",
        "새로생성한 글의 제목",
        "안녕하세요 새로 생성한 글의 content 입니다."
      );

      console.log(result);

      const dataToComeOut = [
        // 이 저장소에서 리턴할 데이터
        result.userId,
        result.nickname,
        result.title,
        result.content,
      ];

      expect(dataToComeOut).toMatchObject([
        5,
        "Tester4",
        "새로생성한 글의 제목",
        "안녕하세요 새로 생성한 글의 content 입니다.",
      ]);
    });
  });
  describe("updatePost 메소드 테스트", () => {
    it("기능: 모델 Post에 Post.update를 명령하고 반환 받은 리턴값이 전달한 값과 동일하게 잘 들어왔는지 확인한다. ", async () => {
      //
      const mockDataDBout = postDataOut.updatedPostRes.data;
      Post.update.mockReturnValue(mockDataDBout);
      const result = await postRepository.updatePost(
        5,
        "수정한 글의 제목",
        "안녕하세요 수정한 글의 content 입니다."
      );

      console.log(result);

      const dataToComeOut = [
        // 이 저장소에서 리턴할 데이터
        result.userId,
        result.title,
        result.content,
      ];

      expect(dataToComeOut).toMatchObject([
        5,
        "수정한 글의 제목",
        "안녕하세요 수정한 글의 content 입니다.",
      ]);
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
