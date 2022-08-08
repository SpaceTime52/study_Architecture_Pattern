const createCommentRes = {
  message: "댓글을 작성하였습니다.",
};

const getCommentsRes = {
  data: [
    {
      commentId: 10,
      userId: 2,
      nickname: "Developer",
      comment: "안녕하세요 2번째 댓글입니다.",
      createdAt: "2022-08-04T14:47:36.000Z",
      updatedAt: "2022-08-04T14:47:36.000Z",
    },
    {
      commentId: 9,
      userId: 2,
      nickname: "Developer",
      comment: "안녕하세요 2번째 댓글입니다.",
      createdAt: "2022-08-04T14:47:36.000Z",
      updatedAt: "2022-08-04T14:47:36.000Z",
    },
  ],
};

const updateCommentRes = {
  message: "댓글을 수정하였습니다.",
};

const deleteCommentRes = {
  message: "댓글을 삭제하였습니다.",
};

module.exports = {
  createCommentRes,
  getCommentsRes,
  updateCommentRes,
  deleteCommentRes,
};
