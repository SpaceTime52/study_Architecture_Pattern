const request = require("supertest"); // http 요청을 보낼 수 있는 라이브러리
const app = require("../../app"); // 서버
const { sequelize } = require("../../models");
const { Comment, Post } = require("../../models");

const userDataIn = require("../data/user-data-in.js"); // 받아올 mock 데이터
const commentDataIn = require("../data/comment-data-in.js"); // 받아올 mock 데이터
const postDataIn = require("../data/post-data-in.js"); // 받아올 mock 데이터

// DB 초기화 및 초기데이터 입력
beforeAll(async () => {
  await sequelize.sync();

  // 테스트를 위한 몇개의 포스팅을 DB에 미리 만들어두는 작업
  // 2명 회원가입
  await request(app)
    .post("/api/signup") // 회원가입 후
    .send(userDataIn.signUpReq1);

  await request(app)
    .post("/api/signup") // 회원가입 후
    .send(userDataIn.signUpReq3);

  // 2명 로그인 정보
  const response1 = await request(app)
    .post("/api/login")
    .send(userDataIn.loginpReq1);
  cookie_1 = response1.headers["set-cookie"];

  const response3 = await request(app)
    .post("/api/login")
    .send(userDataIn.loginpReq3);
  cookie_3 = response3.headers["set-cookie"];

  // 게시글 각 3개 작성
  await request(app)
    .post("/api/posts")
    .set("Cookie", cookie_1)
    .send(postDataIn.sampleBaseReq_1);

  await request(app)
    .post("/api/posts")
    .set("Cookie", cookie_1)
    .send(postDataIn.sampleBaseReq_2);

  await request(app)
    .post("/api/posts")
    .set("Cookie", cookie_3)
    .send(postDataIn.sampleBaseReq_3);

  // 댓글 3개 작성 (1번에 2개, 3번에 1개 댓글 작성)
  await request(app).post("/api/comments/1").set("Cookie", cookie_1).send({
    comment: "안녕하세요 댓글입니다~~.",
  }); // 1번 유저가 1번 게시글에 게시한 1번 댓글

  await request(app).post("/api/comments/1").set("Cookie", cookie_1).send({
    comment: "안녕하세요 댓글입니다~~.",
  }); // 1번 유저가 1번 게시글에 게시한 2번 댓글

  await request(app).post("/api/comments/3").set("Cookie", cookie_3).send({
    comment: "안녕하세요 댓글입니다~~.",
  }); // 3번 유저가 3번 게시글에 게시한 3번 댓글
});

describe("#1 POST api/comments/:_postId 댓글 작성 셍성 테스트", () => {
  // 로그인이 필요한 경우 쿠키만드는 beforeEach
  let cookie;
  beforeEach(async () => {
    const response = await request(app)
      .post("/api/login") // 로그인까지 해둔 상태에서 이번 테스트 그룹을 실행한다.
      .send(userDataIn.loginpReq3); // 3번 유저로 접속
    cookie = response.headers["set-cookie"];
  });

  test("1번 게시글에 댓글 작성 - 작성내용 일치 확인 ", async () => {
    const response = await request(app)
      .post("/api/comments/1")
      .set("Cookie", cookie)
      .send(commentDataIn.createCommentReq);
    expect(response.statusCode).toBe(201);

    // db에 잘 들어갔는지 확인
    const commentInfo = await Comment.findOne({
      where: {
        comment: "안녕하세요 이번에 1번 게시글에 새로 작성한 댓글입니다.",
      },
    });

    expect(commentInfo).toBeTruthy();
  });
});

describe("#2 GET /api/comments/:_postId 댓글 모두 조회", () => {
  test("1번 게시글의 댓글 모두 조회", async () => {
    const response = await request(app).get("/api/comments/1");
    expect(response.statusCode).toBe(200); // 정상 응답
  });
});

describe("#3 PUT /api/comments/:_commentId 특정 댓글 수정", () => {
  // 로그인이 필요한 경우 쿠키만드는 beforeEach
  let cookie;
  beforeEach(async () => {
    // login 과정에서 사용할 로그인할 유저의 정보를 db에 미리 담아둠 (매번 초기화되기 때문에)

    const response = await request(app)
      .post("/api/login")
      .send(userDataIn.loginpReq1); // 1번 댓글을 작성한 Tester1로 로그인 한 상태로 수정 시도
    cookie = response.headers["set-cookie"];
  });
  test("글쓴이가 특정 게시글 수정 시도", async () => {
    const response = await request(app)
      .put("/api/comments/1")
      .set("Cookie", cookie)
      .send(commentDataIn.updateCommentReq);
    expect(response.statusCode).toBe(201); // 정상 응답

    // db에 잘 수정되었는지 확인
    const commentInfo = await Comment.findOne({
      where: { _id: 1 },
    });
    expect(commentInfo.comment).toStrictEqual("수정된 댓글입니다.");
  });
  test("글쓴이가 아닌 유저가 특정 게시글 수정 시도", async () => {
    // Tester1가 작성하지 않은 3번 댓글 수정 시도
    const response = await request(app)
      .put("/api/comments/3")
      .set("Cookie", cookie)
      .send(commentDataIn.updateCommentReq);
    expect(response.statusCode).toBe(400); // 정상 응답
  });
  test("로그인 하지 않고 게시글 수정 시도", async () => {
    const response = await request(app)
      .put("/api/comments/3")
      .send(commentDataIn.updateCommentReq);
    expect(response.statusCode).toBe(401); // 정상 응답
  });
});

describe("#4 DELETE /api/comments/:_commentId 특정 댓글 삭제", () => {
  // 로그인이 필요한 경우 쿠키만드는 beforeEach
  let cookie;
  beforeEach(async () => {
    // login 과정에서 사용할 로그인할 유저의 정보를 db에 미리 담아둠 (매번 초기화되기 때문에)

    const response = await request(app)
      .post("/api/login")
      .send(userDataIn.loginpReq1); // 1번 댓글을 작성한 Tester1로 로그인 한 상태로 삭제 시도
    cookie = response.headers["set-cookie"];
  });
  test("글쓴이가 특정 게시글 수정 시도", async () => {
    const response = await request(app)
      .delete("/api/comments/1")
      .set("Cookie", cookie);
    expect(response.statusCode).toBe(200); // 정상 응답

    // db에 잘 삭제 되었는지 확인
    const commentInfo = await Comment.findOne({
      where: { _id: 1 },
    });
    expect(commentInfo).toBeFalsy();
  });
  test("글쓴이가 아닌 유저가 특정 게시글 삭제 시도", async () => {
    // Tester1가 작성하지 않은 3번 댓글 삭제 시도
    const response = await request(app)
      .delete("/api/comments/3")
      .set("Cookie", cookie);
    expect(response.statusCode).toBe(400); // 정상 응답
  });
  test("로그인 하지 않고 게시글 삭제 시도", async () => {
    const response = await request(app).delete("/api/comments/3");
    expect(response.statusCode).toBe(401); // 정상 응답
  });
});

// 테스트가 끝난 후 데이터베이스 강제 초기화
afterAll(async () => {
  await sequelize.sync({ force: true });
});
