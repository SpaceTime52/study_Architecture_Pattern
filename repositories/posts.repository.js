// 서비스 계층에서 사용할 저장소 클래스와 그 안의 메소드를 정의
// 그 과정에서, 다시 각 메소드가 사용할 데이터베이스 모델(시퀄라이즈)를 필요로 함(require)

// 필요한 시퀄라이즈 모델을 확보합니다.
const { Post } = require("../models");
const Sequelize = require("sequelize");

class PostRepository {
  // postId를 받아 게시글 1개의 정보를 반환한다.
  getPost = async (postId) => {
    const thisPost = await Post.findOne({ where: { _id: postId } });
    return thisPost;
  };

  // 작성된 모든 게시글의 상세 정보를 요청한 발행일 순서대로 으로 모두 불러옴 (기본값 날짜 내림차순)
  getAllPosts = async (orderBy = "DESC") => {
    const allPosts = await Post.findAll({
      order: [["createdAt", orderBy]],
    });

    return allPosts;
  };

  // 좋아요리스트를 보내면 그 게시글을 좋아요 수 내림차순으로 가져온다.
  getPostsByLikedArray = async (likedArray) => {
    // 헤딩 게시글 목록 배열(postIdsUserLiked)에 해당하는 게시글의 디테일한 정보들을 가져와서 반환한다.
    const allPostsUserLiked = await Post.findAll({
      where: { _id: likedArray },
      order: [["likes", "DESC"]],
    }).then((e) => {
      return e;
    });

    return allPostsUserLiked;
  };

  // 전달된 내용으로 새로운 게시글을 작성한다. returns 작성한 게시글정보
  createNewPost = async (nickname, password, title, content) => {
    const createdPost = await Post.create({
      nickname,
      password,
      title,
      content,
    });

    return createdPost;
  };

  // 전달된 postId에 해당하는 게시글을 수정하여 저장한다. returns 수정한 게시글정보
  updatePost = async (postId, title, content) => {
    const updatedPost = await Post.update(
      { title, content }, // 어떤 댓글을 수정할지 넣고,
      { where: { _id: postId } }
    );

    return updatedPost;
  };

  // postId에 해당하는 게시글의 좋아요를 1개 올린다. returns 좋아한 게시글의 현재 좋아요 수
  likePost = async (postId) => {
    // 해당 게시글을 찾아 sequelize 문법으로 like를 한개 올린다.
    const likedPost = await Post.update(
      { likes: Sequelize.literal("likes + 1") },
      { where: { _id: postId } }
    );

    return likedPost.likes;
  };

  // postId에 해당하는 게시글의 좋아요를 1개 내린다. returns 좋아요 취소한 게시글의 현재 좋아요
  dislikePost = async (postId) => {
    // 해당 게시글을 찾아 sequelize 문법으로 like를 한개 내린다.
    const dislikedPost = await Post.update(
      { likes: Sequelize.literal("likes - 1") },
      { where: { _id: postId } }
    );

    return dislikedPost.likes;
  };

  // 전달된 postId에 해당하는 게시글을 삭제한. returns 삭제한 게시글정보
  deletePost = async (postId) => {
    const deletedPost = await Post.destroy({ where: { _id: postId } });
    return deletedPost;
  };
}
module.exports = PostRepository;
