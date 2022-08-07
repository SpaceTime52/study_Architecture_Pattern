// 서비스 계층에서 사용할 저장소 클래스와 그 안의 메소드를 정의
// 그 과정에서, 다시 각 메소드가 사용할 데이터베이스 모델(시퀄라이즈)를 필요로 함(require)

// 필요한 시퀄라이즈 모델을 확보합니다.
const { Comment } = require("../models");

class CommentRepository {
  // postId에 해당하는 게시글에 달린 댓글을 모두 불러옴 (기본정렬 : 날짜의 내림차순 )
  getAllCommentsOn = async (postId, orderBy = "DESC") => {
    console.log("****** --- CommentRepository.getAllCommentsOn ---");
    const allComments = await Comment.findAll({
      where: { _postId: postId },
      order: [["createdAt", orderBy]],
    });

    console.log("****** --- CommentRepository.getAllCommentsOn Returns ---");
    return allComments;
  };

  // commentId에 해당하는 댓글을 불러옴
  getCommentDetail = async (commentId) => {
    console.log("****** --- CommentRepository.getCommentDetail ---");
    const thisComment = await Comment.findOne({
      where: { _id: commentId },
    });

    console.log("****** --- CommentRepository.getCommentDetail Returns ---");
    return thisComment;
  };

  // postId에 해당하는 게시글에 새로운 댓글을 생성 (returns 생성된 댓글 정보를 반환)
  createComment = async (postId, userId, nickname, comment) => {
    console.log("****** --- CommentRepository.createComment ---");
    const createdComment = await Comment.create({
      _postId: postId,
      userId,
      nickname,
      comment,
    });

    console.log("****** --- CommentRepository.createComment Returns ---");
    return createdComment;
  };

  // commentId에 해당하는 댓글을 새로운 댓글로 수정 (returns 수정된 댓글 정보를 반환)
  updateComment = async (commentId, comment) => {
    console.log("****** --- CommentRepository.updateComment ---");
    const updatedComment = await Comment.update(
      { comment },
      { where: { _id: commentId } }
    );

    console.log("****** --- CommentRepository.updateComment Returns---");
    return updatedComment;
  };

  // commentId에 해당하는 댓글을 삭제 (returns 삭제된 댓글의 정보를 반환)
  deleteComment = async (commentId) => {
    console.log("****** --- CommentRepository.deleteComment ---");
    const deletedComment = await Comment.destroy({ where: { _id: commentId } });

    console.log("****** --- CommentRepository.deleteComment Returns---");
    return deletedComment;
  };
}

module.exports = CommentRepository;

/* 
CommentRepository 이용 매뉴얼 

CommentRepository.getAllCommentsOn(postId, orderBy = "DESC")  
 : postId에 해당하는 게시글에 달린 댓글을 모두 불러옴 (기본정렬 : 날짜의 내림차순 )

CommentRepository.getCommentDetail(commentId)
 : commentId에 해당하는 댓글을 불러옴

CommentRepository.createComment(postId, userId, nickname, comment)
 : postId에 해당하는 게시글에 새로운 댓글을 생성 (returns 생성된 댓글 정보를 반환)

CommentRepository.updateComment(commentId, comment)
 : commentId에 해당하는 댓글을 새로운 댓글로 수정 (returns 수정된 댓글 정보를 반환)

CommentRepository.deleteComment(commentId)
 : commentId에 해당하는 댓글을 삭제 (returns 삭제된 댓글의 정보를 반환)

*/
