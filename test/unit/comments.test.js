// 테스트할 User 컨트롤러, 서비스, 저장소의 각 클래스 import
const CommentsController = require("../../controllers/comments.controller");
const CommentsService = require("../../services/comments.service");
const CommentRepository = require("../../repositories/comments.repository");
const PostRepository = require("../../repositories/posts.repository");
const { Comment } = require("../../models");

// 테스트할 각 클래스의 인스턴스 생성
const commentsController = new CommentsController();
const commentsService = new CommentsService();
const commentRepository = new CommentRepository();
const postRepository = new PostRepository();

// req, res, next 가상 객체를 생성해주는 모듈 import
const httpMocks = require("node-mocks-http");

// 공용 변수들을 여기에 정의

// 테스트에 필요한 Mock Data import
const userDataIn = require("../data/user-data-in.js"); // 받아올 mock 데이터
const commentDataIn = require("../data/comment-data-in.js"); // 받아올 mock 데이터
const commentDataout = require("../data/comment-data-out.js"); // 나와야 할 mock 데이터
const postDataout = require("../data/post-data-out.js"); // 나와야 할 mock 데이터

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn(); // mock 함수로 선언
});

describe("commentsController의 클래스의 테스트", () => {
  describe("leaveComment 메소드 테스트", () => {
    beforeEach(() => {
      // getAllPosts 메소드안에서 사용할 메소드 mocking
      commentsController.commentService.leaveCommentOn = jest.fn();
      commentsController.commentService.leaveCommentOn.mockReturnValue({
        status: 201,
        message: "댓글을 작성하였습니다.",
      });
      // 인증 거쳐온 로그인 유저의 쿠키 전달
      res.locals.user = userDataIn.mockUser_ResLocals;
    });

    it("예외처리 : _postId로 전달받은 데이터가 숫자가 아니면 존재하지 않는 path로 지나가도록 next()를 전달합니다. ", async () => {
      req.body = commentDataIn.createCommentReq;
      req.params._postId = "like";

      await commentsController.leaveComment(req, res, next);
      expect(next.mock.calls.length).toBe(1);
      expect(
        commentsController.commentService.leaveCommentOn.mock.calls.length
      ).toBe(0);
    });
    it("예외처리 : 바디로 전달받은 comment가 빈 문자열이라면 '댓글 내용을 입력해주세요' 를 반환합니다. 이 때 400번 status-code와 함께 반환합니다.", async () => {
      req.body = { comment: "" };
      req.params._postId = "3";

      await commentsController.leaveComment(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({
        message: "댓글 내용을 입력해주세요",
      });
    });
    it("예외처리 : 바디로 전달반은 comment가 문자열이 아니라면 에러를 발생시키고 '잘못된 접근입니다.'라는 메세지와 함께 400 status-code를 반환합니다.", async () => {
      req.body = {};
      req.params._postId = "3";

      await commentsController.leaveComment(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({
        message: "잘못된 접근입니다.",
      });
    });
  });
  describe("updateComment 메소드 테스트", () => {
    beforeEach(async () => {
      // updatePost 메소드안에서 사용할 메소드 mocking
      commentsController.commentService.updateComment = jest.fn();
      commentsController.commentService.updateComment.mockReturnValue({
        status: 201,
        message: "게시글을 수정하였습니다.",
      });
      // 인증 거쳐온 로그인 유저의 쿠키 전달
      res.locals = userDataIn.mockUser_ResLocals;
    });

    it("예외처리: _commentId로 전달받은 데이터가 숫자가 아니면 존재하지 않는 path로 지나가도록 next()를 전달합니다. ", async () => {
      req.body = commentDataIn.updateCommentReq;
      req.params._commentId = "like";

      await commentsController.updateComment(req, res, next);
      // next가 1번 불러지고, 그 뒤의 서비스 메소드는 불러와지지 않아야 한다.
      expect(next.mock.calls.length).toBe(1);
      expect(
        commentsController.commentService.updateComment.mock.calls.length
      ).toBe(0);
    });
    it("예외처리: 바디로 전달반든 comment가 문자열이 아니라면 에러를 발생시키고 '잘못된 접근입니다.'라는 메세지와 함께 400 status-code를 반환합니다.", async () => {
      req.body = { comment: {} };
      req.params._postId = "like"; // params 에 이상한 데이터가 들어옴
      await commentsController.updateComment(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({
        message: "잘못된 접근입니다.",
      });
    });
  });
});

describe("CommentService의 클래스의 테스트", () => {
  describe("leaveCommentOn 메소드 테스트", () => {
    beforeEach(() => {
      // leaveCommentOn 메소드안에서 사용할 메소드 mocking
      commentsService.postRepository.getPost = jest.fn();
      commentsService.commentRepository.createComment = jest.fn();
      // 인증 거쳐온 로그인 유저의 쿠키 전달
      res.locals.user = userDataIn.mockUser_ResLocals;
    });
    it("예외처리: 리턴하는 데이터에 두가지 key : status와 message 가 있어야 합니다. ", async () => {
      commentsService.postRepository.getPost.mockReturnValue(
        postDataout.getPostDetailRes.data
      );
      commentsService.commentRepository.createComment.mockReturnValue(
        commentDataout.createdCommentRes
      );
      const result = await commentsService.leaveCommentOn(
        res.locals.user,
        "3",
        "안녕하세요 댓글입니다."
      );

      console.log(result);
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("message");
    });
    it("예외처리: 전달 받은 데이터 id에 해당하는 게시글이 없으면 status-code 400 과 함께 ‘해당 게시글이 없습니다.’를 메세지로 리턴합니다. ", async () => {
      commentsService.postRepository.getPost.mockReturnValue(undefined); // 저장소 메소드가 찾은게 없으면
      const result = await commentsService.leaveCommentOn(
        res.locals.user,
        "3",
        "안녕하세요 댓글입니다."
      );
      expect(result.status).toBe(400);
      expect(result).toStrictEqual({
        status: 400,
        message: "해당 게시글이 없습니다.",
      });
    });
  });
  describe("updateComment 메소드 테스트", () => {
    beforeEach(() => {
      // getAllPosts 메소드안에서 사용할 메소드 mocking
      commentsService.commentRepository.getCommentDetail = jest.fn();
      commentsService.commentRepository.updateComment = jest.fn();
      // 인증 거쳐온 로그인 유저의 쿠키 전달
      res.locals.user = userDataIn.mockUser_ResLocals;
    });
    it("기능:리턴하는 데이터에 두가지 key : status와 message 가 있어야 합니다. ", async () => {
      commentsService.commentRepository.getCommentDetail.mockReturnValue(
        commentDataout.getCommentDetailRes
      );

      const result = await commentsService.updateComment(
        "5",
        "수정된 댓글입니다."
      );

      console.log(result);
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("message");
    });
    it("예외처리:전달 받은 데이터 id에 해당하는 게시글이 없으면 status-code 400 과 함께 '해당 댓글이 없습니다.'를 메세지로 리턴합니다. ", async () => {
      // commentRepository가 게시글을 찾지 못한 경우,
      commentsService.commentRepository.getCommentDetail.mockReturnValue(null);

      console.log(res.locals.user);
      const result = await commentsService.updateComment(
        res.locals.user,
        "3",
        "title",
        "content"
      );
      expect(result.status).toBe(400);
      expect(result).toStrictEqual({
        status: 400,
        message: "해당 댓글이 없습니다.",
      });
    });
    it("예외처리: 기존 댓글의 작성자와 수정을 희망하는 로그인 작성자가 다른 경우 status-code 400 과 함께 ’수정 권한이 없습니다.’를 메세지로 리턴합니다.", async () => {
      // commentRepository가 게시글을 찾지 못한 경우,
      commentsService.commentRepository.getCommentDetail.mockReturnValue(
        commentDataout.getCommentDetailRes
      );

      const result = await commentsService.updateComment(
        res.locals.user, // 접속한 유저 id : 3
        "10",
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
});

describe("CommentRepository 클래스의 메소드 테스트", () => {
  beforeEach(() => {
    // commentRepository가 의존하는 DB 모델을 모두 mocking
    Comment.findOne = jest.fn();
    Comment.findAll = jest.fn();
    Comment.create = jest.fn();
    Comment.update = jest.fn();
    Comment.destroy = jest.fn();
  });
  describe("getAllCommentsOn 메소드 테스트", () => {
    it("기능: 인자가 'DESC'이거나 없으면, 모델로부터 받아온 데이터가 날짜의 내림차순 정렬되어 있다.", async () => {
      Comment.findAll.mockReturnValue(commentDataout.getCommentsRes.data);
      const result = await commentRepository.getAllCommentsOn("DESC");

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
      Comment.findAll.mockReturnValue(
        commentDataout.getCommentsResAscending.data
      );
      const result = await commentRepository.getAllCommentsOn("ASC");

      if (result.length > 1) {
        expect(
          new Date(result[0].createdAt) -
            new Date(result[result.length - 1].createdAt)
        ).toBeLessThanOrEqual(0);
      } else {
        expect(true).toBe(true);
      }
    });
    it("예외처리: 해당 게시글에 달린 댓글이 없더라도 빈 배열을 반환합니다.", async () => {
      Comment.findAll.mockReturnValue([]); // 찾아온 data 가 빈배열인 경우,
      const result = await commentRepository.getAllCommentsOn("DESC");
      expect(result).toMatchObject([]); // toMatchObject를 쓰는 이유 _ (Array는 참조형)
    });
  });

  describe("createComment 메소드 테스트", () => {
    it("기능: 저장하기 위해 전달한 데이터의 값 → create 메소드 실행 후 리턴으로 받아 → 리턴으로 전달할 데이터가 동일합니다.", async () => {
      Comment.create.mockReturnValue(commentDataout.createdCommentRes);
      const result = await commentRepository.createComment(
        5,
        4,
        "Tester5",
        "안녕하세요 댓글입니다."
      );

      const dataToComeOut = [
        // 이 저장소에서 리턴할 데이터
        result._postId,
        result.userId,
        result.nickname,
        result.comment,
      ];

      expect(dataToComeOut).toMatchObject([
        5,
        4,
        "Tester5",
        "안녕하세요 댓글입니다.",
      ]);
    });
  });

  describe("deleteComment 메소드 테스트", () => {
    it("기능: DB모델에 destroy 수행 후 삭제된 데이터의 객체를 반환받아, 지우려고 의도했던 데이터가 잘 지워진 것을 확인합니다.  ", async () => {
      //
      Comment.destroy.mockReturnValue(commentDataout.deletedCommentRes);
      const result = await commentRepository.deleteComment(5);

      const dataToComeOut = [
        // 이 저장소에서 리턴할 데이터
        result.commentId,
        result.userId,
        result.nickname,
      ];

      expect(dataToComeOut).toMatchObject([11, 4, "Tester5"]);
    });
  });
});
