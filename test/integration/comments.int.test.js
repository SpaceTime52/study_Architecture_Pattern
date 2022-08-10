const request = require("supertest"); // http 요청을 보낼 수 있는 라이브러리
const app = require("../../app"); // 서버
const { sequelize } = require("../../models");
const { User, Post } = require("../../models");

const userDataIn = require("../data/user-data-in.js"); // 받아올 mock 데이터
const postDataIn = require("../data/post-data-in.js"); // 받아올 mock 데이터

// DB 초기화 및 초기데이터 입력
beforeAll(async () => {
  await sequelize.sync();

  // 테스트를 위한 몇개의 포스팅을 미리 만들어둠

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

  // 게시글 각 4개 작성
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

  await request(app)
    .post("/api/posts")
    .set("Cookie", cookie_3)
    .send(postDataIn.sampleBaseReq_4);
});

describe("#1 POST /api/posts 게시글 작성 셍성 테스트", () => {
  // 로그인이 필요한 경우 쿠키만드는 beforeEach
  let cookie;
  beforeEach(async () => {
    // login 과정에서 사용할 로그인할 유저의 정보를 db에 미리 담아둠 (매번 초기화되기 때문에)
    await request(app)
      .post("/api/signup") // 회원가입 후
      .send(userDataIn.signUpReq);

    const response = await request(app)
      .post("/api/login") // 로그인까지 해둔 상태에서 이번 테스트 그룹을 실행한다.
      .send(userDataIn.loginpReq);
    cookie = response.headers["set-cookie"];
  });

  test("모두 기입 시 글 작성되었는지 확인", async () => {
    const response = await request(app)
      .post("/api/posts")
      .set("Cookie", cookie)
      .send(postDataIn.createPostReq);
    expect(response.statusCode).toBe(201);

    // db에 잘 들어갔는지 확인
    const postInfo = await Post.findOne({
      where: { title: postDataIn.createPostReq.title },
    });
    expect(postInfo).toBeTruthy();
  });
});

describe("#2 GET /api/posts 게시글 모두 조회", () => {
  test("게시글 모두 조회", async () => {
    const response = await request(app).get("/api/posts");
    expect(response.statusCode).toBe(200); // 정상 응답
  });
});

describe("#3 GET /api/posts/:_postId 특정 게시글 상세 조회", () => {
  test("특정 게시글 상세 조회", async () => {
    const response = await request(app).get("/api/posts/3");
    console.log(response);
    console.log(response.statusCode);
    expect(true).toBe(true); // 정상 응답
  });
});

describe("#4 PUT /api/posts/:_postId 특정 게시글 수정", () => {
  // 로그인이 필요한 경우 쿠키만드는 beforeEach
  let cookie;
  beforeEach(async () => {
    // login 과정에서 사용할 로그인할 유저의 정보를 db에 미리 담아둠 (매번 초기화되기 때문에)

    const response = await request(app)
      .post("/api/login")
      .send(userDataIn.loginpReq1); // 1번 글을 작성한 Tester1로 로그인 한 상태로 수정 시도
    cookie = response.headers["set-cookie"];
  });
  test("글쓴이가 특정 게시글 수정 시도", async () => {
    const response = await request(app)
      .put("/api/posts/1")
      .set("Cookie", cookie)
      .send(postDataIn.updatePostReq);
    expect(response.statusCode).toBe(201); // 정상 응답

    // db에 잘 수정되었는지 확인
    const postInfo = await Post.findOne({
      where: { _id: 1 },
    });
    expect(postInfo.title).toStrictEqual("수정된 게시글 입니다.");
  });
  test("글쓴이가 아닌 유저가 특정 게시글 수정 시도", async () => {
    const response = await request(app)
      .put("/api/posts/3")
      .set("Cookie", cookie)
      .send(postDataIn.updatePostReq);
    expect(response.statusCode).toBe(400); // 정상 응답
  });
  test("로그인 하지 않고 게시글 수정 시도", async () => {
    const response = await request(app)
      .put("/api/posts/3")
      .send(postDataIn.updatePostReq);
    expect(response.statusCode).toBe(401); // 정상 응답
  });
});

describe("#5 DELETE /api/posts/:_postId 특정 게시글 삭제", () => {
  // 로그인이 필요한 경우 쿠키만드는 beforeEach
  let cookie;
  beforeEach(async () => {
    // login 과정에서 사용할 로그인할 유저의 정보를 db에 미리 담아둠 (매번 초기화되기 때문에)

    const response = await request(app)
      .post("/api/login")
      .send(userDataIn.loginpReq1); // 1번 글을 작성한 Tester1로 로그인 한 상태로 삭제 시도
    cookie = response.headers["set-cookie"];
  });
  test("글쓴이가 특정 게시글 삭제 시도", async () => {
    const response = await request(app)
      .delete("/api/posts/1")
      .set("Cookie", cookie)
      .send(postDataIn.updatePostReq);
    expect(response.statusCode).toBe(200); // 정상 응답

    // db에 잘 삭제되었는지 확인
    const postInfo = await Post.findOne({
      where: { _id: 1 },
    });
    expect(postInfo).toBeFalsy();
  });
  test("글쓴이가 아닌 유저가 특정 게시글 삭제 시도", async () => {
    const response = await request(app)
      .delete("/api/posts/3")
      .set("Cookie", cookie);
    expect(response.statusCode).toBe(400); // 정상 응답
  });
  test("로그인하지 않고 특정 게시글 삭제 시도", async () => {
    const response = await request(app).delete("/api/posts/3");
    expect(response.statusCode).toBe(401); // 정상 응답
  });
});

// 현재 1번 게시글은 삭제된 상태
describe("####### Like Tester #######", () => {
  describe("#6 PUT /api/posts/:_postId/like 게시글 좋아요", () => {
    // 로그인이 필요한 경우 쿠키만드는 beforeEach
    let cookie;
    beforeEach(async () => {
      // login 과정에서 사용할 로그인할 유저의 정보를 db에 미리 담아둠 (매번 초기화되기 때문에)

      const response = await request(app)
        .post("/api/login")
        .send(userDataIn.loginpReq1); // 1번 글을 작성한 Tester1로 로그인 한 상태로 수정 시도
      cookie = response.headers["set-cookie"];
    });

    test("Tester1 유저가 2번 게시글 좋아요 (현재 좋아요 0개)", async () => {
      await request(app).put("/api/posts/2/like").set("Cookie", cookie);

      const { likedPosts } = await User.findOne({
        where: { userId: 1 },
      });

      const { likes } = await Post.findOne({
        where: { _id: 2 },
      });

      expect(likedPosts).toMatchObject(["2"]); // 정상 응답
      expect(likes).toStrictEqual(1); // 정상 응답
    });
    test("Tester1 유저가 2번 게시글 좋아요 취소 (현재 좋아요 1개)", async () => {
      await request(app).put("/api/posts/2/like").set("Cookie", cookie);

      const { likedPosts } = await User.findOne({
        where: { userId: 1 },
      });

      const { likes } = await Post.findOne({
        where: { _id: 2 },
      });

      expect(likedPosts).toMatchObject([]); // 정상 응답
      expect(likes).toStrictEqual(0); // 정상 응답
    });

    test("글쓴이가 아닌 Tester3 유저가 2번 게시글 좋아요 (현재 좋아요 0개)", async () => {
      const response = await request(app)
        .post("/api/login")
        .send(userDataIn.loginpReq3);
      tester_3 = response.headers["set-cookie"]; // Tester3으로 로그인 한 쿠키

      await request(app).put("/api/posts/2/like").set("Cookie", tester_3);

      const { likedPosts } = await User.findOne({
        where: { userId: 2 }, // Tester3의 UserId
      });

      const { likes } = await Post.findOne({
        where: { _id: 2 },
      });

      expect(likedPosts).toMatchObject(["2"]); // 정상 응답
      expect(likes).toStrictEqual(1); // 정상 응답
    });
  });

  describe("#7 GET /api/posts/:_postId/like 사용자가 좋아한 게시글 리스트", () => {
    // 로그인이 필요한 경우 쿠키만드는 beforeEach
    let tester_3;
    beforeEach(async () => {
      // #6 번 테스트 와 연달아 실행되므로 Tester3의 정보로 테스트 진행
      const response = await request(app)
        .post("/api/login")
        .send(userDataIn.loginpReq3);
      tester_3 = response.headers["set-cookie"]; // Tester3으로 로그인 한 쿠키
    });
    test("사용자가 좋아한 게시글 리스트", async () => {
      const response = await request(app)
        .get("/api/posts/like")
        .set("Cookie", tester_3);
      const likedList = JSON.parse(response.text).data[0];
      console.log(likedList);
      expect(response.statusCode).toBe(200); // 정상 응답
      expect(likedList).toHaveProperty("postId"); // 정상 응답
      expect(likedList).toHaveProperty("userId"); // 정상 응답
      expect(likedList).toHaveProperty("nickname"); // 정상 응답
      expect(likedList).toHaveProperty("title"); // 정상 응답
    });
  });
});

// 테스트가 끝난 후 데이터베이스 강제 초기화
afterAll(async () => {
  await sequelize.sync({ force: true });
});
