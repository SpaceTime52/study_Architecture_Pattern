// 컨트롤러에서 사용할 서비스 클래스와 그 안의 메소드를 정의
// 그 과정에서, 다시 각 메소드가 사용할 저장소 클래스를 필요로 함(require)

const CommentRepository = require("../repositories/comments.repository");
const PostRepository = require("../repositories/posts.repository");

class CommentService {
  commentRepository = new CommentRepository();
  postRepository = new PostRepository();

  // ------------------
  // TASK 1. 댓글 작성
  leaveCommentOn = async (user, postId, comment) => {
    // 부여받은 정보로 댓글 작성
    await commentRepository.createComment(
      postId,
      user.userId,
      user.nickname,
      comment
    );

    return { message: "댓글을 생성하였습니다." };
  };

  // ------------------
  // TASK 2. 댓글 목록 조회
  getCommentsOn = async (postId) => {
    // postId에 해당하는 게시글 찾아서 없으면 반려
    const thisPost = await postRepository.getPost(postId);
    if (!thisPost) {
      return { message: "해당 게시글이 없습니다." };

      //있으면 조회
    } else {
      const allCommentsInfo = await commentRepository.getAllCommentsOn(postId);

      const data = allCommentsInfo.map((el) => {
        return {
          commentId: el._id,
          userId: el.userId,
          nickname: el.nickname,
          comment: el.comment,
          createdAt: el.createdAt,
          updatedAt: el.updatedAt,
        };
      });

      return data;
    }
  };

  // ------------------
  // TASK 3. 댓글 수정
  updateComment = async (user, commentId, comment) => {
    const commentToUpdate = await commentRepository.getCommentDetail(commentId);
    if (!commentToUpdate) {
      return { message: "해당 댓글이 없습니다." };
    } else if (user.nickname != commentToUpdate.nickname) {
      return { message: "수정 권한이 없습니다." };
    } else {
      await commentRepository.updateComment(commentId, comment);
      return { message: "댓글을 수정하였습니다." };
    }
  };

  // ------------------
  // TASK 4.게시글 삭제
  deleteComment = async (user, commentId) => {
    const commentToUpdate = await commentRepository.getCommentDetail(commentId);
    if (!commentToUpdate) {
      return { message: "해당 댓글이 없습니다." };
    } else if (user.nickname != commentToUpdate.nickname) {
      return { message: "삭제 권한이 없습니다." };
    } else {
      await commentRepository.deleteComment(commentId);
      return { message: "댓글을 삭제하였습니다." };
    }
  };
}

module.exports = CommentService;
