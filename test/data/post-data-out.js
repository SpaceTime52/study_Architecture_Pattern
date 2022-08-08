const createPostRes = {
  message: "게시글 작성에 성공하였습니다.",
};

const getPostsRes = {
  data: [
    {
      postId: 8,
      userId: 2,
      nickname: "Developer",
      title: "안녕하세요 2번째 게시글 제목입니다.",
      createdAt: "2022-08-04T14:45:40.000Z",
      updatedAt: "2022-08-04T14:45:40.000Z",
      likes: 0,
    },
    {
      postId: 7,
      userId: 2,
      nickname: "Developer",
      title: "안녕하세요 2번째 게시글 제목입니다.",
      createdAt: "2022-08-03T20:55:18.000Z",
      updatedAt: "2022-08-03T20:55:18.000Z",
      likes: 1,
    },
  ],
};

const getPostDetailRes = {
  data: {
    postId: 8,
    userId: 2,
    nickname: "Developer",
    title: "안녕하세요 2번째 게시글 제목입니다.",
    content: "안녕하세요 content 입니다.",
    createdAt: "2022-08-04T14:45:40.000Z",
    updatedAt: "2022-08-04T14:45:40.000Z",
    likes: 0,
  },
};

const updatePostRes = {
  message: "게시글을 수정하였습니다.",
};
const deletePostRes = {
  message: "게시글을 삭제하였습니다.",
};

const getlikedPostsRes = {
  data: [
    {
      postId: 7,
      userId: 2,
      nickname: "Developer",
      title: "안녕하세요 2번째 게시글 제목입니다.",
      createdAt: "2022-08-03T20:55:18.000Z",
      updatedAt: "2022-08-03T20:55:18.000Z",
      likes: 1,
    },
    {
      postId: 3,
      userId: 1,
      nickname: "Developer",
      title: "안녕하세요 2번째 게시글 제목입니다.",
      createdAt: "2022-08-03T20:55:18.000Z",
      updatedAt: "2022-08-03T20:55:18.000Z",
      likes: 1,
    },
  ],
};

const likePostRes = {
  message: "게시글의 좋아요를 등록하였습니다.",
};

const dislikePostRes = {
  message: "게시글의 좋아요를 취소하였습니다.",
};

module.exports = {
  createPostRes,
  getPostsRes,
  getPostDetailRes,
  updatePostRes,
  deletePostRes,
  getlikedPostsRes,
  likePostRes,
  dislikePostRes,
};
