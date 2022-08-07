/* 서비스 레벨에서는 비즈니스 로직을 수행, 데이터를 요청하여 각 케이스별 요구사항 구현, 프레젠테이션 계층과 저장소 계층이 직접 통신하지 않게 함

    - API 뒤에 이렇게 로직을 감췄기 때문에 서비스 계층의 코드를 자유롭게 리팩터링할 수 있습니다. : 뭔말임?
    - 사용자의 요구사항을 처리 : 현업에서는 서비스 코드의 역할이 많아짐 
    
*/

// 컨트롤러에서 사용할 서비스 클래스와 그 안의 메소드를 정의
// 그 과정에서, 다시 각 메소드가 사용할 저장소 클래스를 필요로 함(require)
const PostRepository = require("../repositories/posts.repository");
const UserRepository = require("../repositories/users.repository");

class PostService {
  postRepository = new PostRepository();
  userRepository = new UserRepository();

  // TASK 1 : 게시글 목록 조회
  getAllPosts = async () => {
    console.log("**** --- PostService.getAllPosts ---");

    const dataAll = await this.postRepository.getAllPosts("DESC");

    // dataAll 하나씩 돌면서 리턴 필요한 요소들만 찾아 resultData 완성
    const resultData = dataAll.map((el) => {
      return {
        postId: el._id, // .toString()으로 안바꿔줘도 되는지 테스트 필요
        userId: el.userId,
        nickname: el.nickname,
        title: el.title,
        createdAt: el.createdAt,
        updatedAt: el.updatedAt,
        likes: el.likes,
      };
    });

    console.log("**** --- PostService.getAllPosts Returns ---");
    return resultData; //  = [ { ... }, { ... }, { ... } ]
  };
  // TASK 2 : 게시글 작성
  createNewPost = async (user, title, content) => {
    console.log("**** --- PostService.createNewPost ---");
    await this.postRepository.createNewPost(
      user.userId,
      user.nickname,
      title,
      content
    );

    console.log("**** --- PostService.createNewPost Returns---");
    return { success: true, message: "게시글을 생성하였습니다." };
  };
  // TASK 3 : 게시글 상세조회
  getPostDetail = async (postId) => {
    console.log("**** --- PostService.getPostDetail ---");
    const thisPost = await this.postRepository.getPost(postId);

    console.log("**** --- PostService.getPostDetail returns---");
    if (!thisPost) {
      return { message: "해당 게시글이 없습니다." };
    } else {
      return {
        postId: thisPost._id,
        userId: thisPost.userId,
        nickname: thisPost.nickname,
        title: thisPost.title,
        content: thisPost.content,
        createdAt: thisPost.createdAt,
        updatedAt: thisPost.updatedAt,
        likes: thisPost.likes,
      };
    }
  };
  // TASK 4 : 게시글 수정
  updatePost = async (user, postId, title, content) => {
    console.log("**** --- PostService.updatePost ---");
    const thisPost = await this.postRepository.getPost(postId);

    console.log("**** --- PostService.updatePost returns ---");
    if (!thisPost) {
      return { status: 400, message: "해당 게시글이 없습니다." };
    } else if (user.nickname != thisPost.nickname) {
      return { status: 400, message: "수정 권한이 없습니다." };
    } else {
      await this.postRepository.updatePost(postId, title, content);
      return { status: 200, message: "게시글을 수정하였습니다." };
    }
  };
  // TASK 5 : 게시글 삭제
  deletePost = async (user, postId) => {
    console.log("**** --- PostService.deletePost ---");

    const thisPost = await this.postRepository.getPost(postId);

    console.log("**** --- PostService.deletePost returns ---");
    if (!thisPost) {
      return { status: 400, message: "해당 게시글이 없습니다." };
    } else if (user.nickname != thisPost.nickname) {
      return { status: 400, message: "삭제 권한이 없습니다." };
    } else {
      await this.postRepository.deletePost(postId);
      return { status: 200, message: "게시글을 삭제하였습니다." };
    }
  };
  // TASK 6 : 게시글 좋아요 누르기
  likePost = async (user, postId) => {
    console.log("**** --- PostService.likePost ---");
    const thisPost = await this.postRepository.getPost(postId);
    const postIdsUserLiked = await this.userRepository.getAllLikedPosts(
      user.userId
    );

    if (!thisPost) {
      console.log("**** --- PostService.likePost Reutrns ---");
      return { status: 400, message: "해당 게시글이 없습니다." };
    } else if (!postIdsUserLiked.includes(thisPost._id.toString())) {
      await this.postRepository.likePost(postId);
      await this.userRepository.likePost(user.userId, postId);
      console.log("**** --- PostService.likePost Reutrns ---");
      return { status: 200, message: "게시글의 좋아요를 등록하였습니다." };
    } else {
      await this.postRepository.dislikePost(postId);
      await this.userRepository.dislikePost(user.userId, postId);
      console.log("**** --- PostService.likePost Reutrns ---");
      return { status: 200, message: "게시글의 좋아요를 취소하였습니다." };
    }
  };
  // TASK 7 : 내가 좋아한 게시글 조회
  listMyLikedPosts = async (user) => {
    console.log("**** --- PostService.listMyLikedPosts ---");
    // 유저의 좋아요 배열
    const postIdsUserLiked = await this.userRepository.getAllLikedPosts(
      user.userId
    );

    // 그 배열에 해당하는 게시글 디테일
    const postsUserLiked = await this.postRepository.getPostsByLikedArray(
      postIdsUserLiked
    );

    // data 배열에 리턴이 필요한 요소들을 하나씩 넣어줍니다.
    const data = postsUserLiked.map((el) => {
      return {
        postId: el._id,
        userId: el.userId,
        nickname: el.nickname,
        title: el.title,
        createdAt: el.createdAt,
        updatedAt: el.updatedAt,
        likes: el.likes,
      };
    });

    console.log("**** --- PostService.listMyLikedPosts Returns ---");

    return data;
  };
}

module.exports = PostService;
