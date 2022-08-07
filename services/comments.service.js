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
    console.log("**** --- CommentService.leaveCommentOn---");

    // 부여받은 정보로 댓글 작성
    const thisPost = await this.postRepository.getPost(postId);

    // 댓글남길 포스트 id 가 존재하지 않으면,

    console.log("**** --- CommentService.leaveCommentOn Returns---");
    if (!thisPost) {
      return { status: 400, message: "해당 게시글이 없습니다." };

      //존재하면 코멘트 남김
    } else {
      await this.commentRepository.createComment(
        postId,
        user.userId,
        user.nickname,
        comment
      );

      return { status: 200, message: "댓글을 생성하였습니다." };
    }
  };

  // ------------------
  // TASK 2. 댓글 목록 조회
  getCommentsOn = async (postId) => {
    console.log("**** --- CommentService.getCommentsOn---");

    // postId에 해당하는 게시글 찾아서 없으면 반려
    const thisPost = await this.postRepository.getPost(postId);
    if (!thisPost) {
      console.log("**** --- CommentService.getCommentsOn End---");
      return {
        status: 400,
        message: "해당 게시글이 없습니다.",
        data: undefined,
      };

      //있으면 조회
    } else {
      const allCommentsInfo = await this.commentRepository.getAllCommentsOn(
        postId
      );

      console.log(allCommentsInfo);

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

      console.log("**** --- CommentService.getCommentsOn End---");
      return { status: 200, message: "댓글 목록을 불러왔습니다.", data: data };
    }
  };

  // ------------------
  // TASK 3. 댓글 수정
  updateComment = async (user, commentId, comment) => {
    console.log("**** --- CommentService.updateComment---");
    const commentToUpdate = await this.commentRepository.getCommentDetail(
      commentId
    );
    console.log("**** --- CommentService.updateComment End---");
    if (!commentToUpdate) {
      return { status: 400, message: "해당 댓글이 없습니다." };
    } else if (user.nickname != commentToUpdate.nickname) {
      return { status: 400, message: "수정 권한이 없습니다." };
    } else {
      await this.commentRepository.updateComment(commentId, comment);

      return { status: 200, message: "댓글을 수정하였습니다." };
    }
  };

  // ------------------
  // TASK 4.게시글 삭제
  deleteComment = async (user, commentId) => {
    console.log("**** --- CommentService.deleteComment---");

    const commentToUpdate = await this.commentRepository.getCommentDetail(
      commentId
    );

    console.log("**** --- CommentService.deleteComment End---");

    if (!commentToUpdate) {
      return { status: 400, message: "해당 댓글이 없습니다." };
    } else if (user.nickname != commentToUpdate.nickname) {
      return { status: 400, message: "삭제 권한이 없습니다." };
    } else {
      await this.commentRepository.deleteComment(commentId);
      return { status: 200, message: "댓글을 삭제하였습니다." };
    }
  };
}

module.exports = CommentService;
