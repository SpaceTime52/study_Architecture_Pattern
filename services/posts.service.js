/* 서비스 레벨에서는 비즈니스 로직을 수행, 데이터를 요청하여 각 케이스별 요구사항 구현, 프레젠테이션 계층과 저장소 계층이 직접 통신하지 않게 함

    - API 뒤에 이렇게 로직을 감췄기 때문에 서비스 계층의 코드를 자유롭게 리팩터링할 수 있습니다. : 뭔말임?
    - 사용자의 요구사항을 처리 : 현업에서는 서비스 코드의 역할이 많아짐 
    
*/

// 컨트롤러에서 사용할 서비스 클래스와 그 안의 메소드를 정의
// 그 과정에서, 다시 각 메소드가 사용할 저장소 클래스를 필요로 함(require)
c;
const UserRepository = require("../repositories/users.repository");

class PostService {
  postRepository = new PostRepository();
  userRepository = new UserRepository();

  // ------------------
  // TASK 1 : 게시글 목록 조회
  getAllPosts = async () => {
    const dataAll = await postRepository.getAllPosts((orderBy = "DESC"));

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

    return resultData; //  = [ { ... }, { ... }, { ... } ]
  };

  // ------------------
  // TASK 2 : 게시글 작성
  creatNewPost = async (user, title, content) => {
    await postRepository.createNewPost(
      user.userId,
      user.nickname,
      title,
      content
    );
    return { message: "게시글을 생성하였습니다." };
  };

  // ------------------
  // TASK 3 : 게시글 상세조회
  getPostDetail = async (postId) => {
    const thisPost = await postRepository.getPost(postId);
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

  // ------------------
  // TASK 4 : 게시글 수정
  updatePost = async (user, postId, title, content) => {
    const thisPost = await postRepository.getPost(postId);
    if (!thisPost) {
      return { message: "해당 게시글이 없습니다." };
    } else if (user.nickname != thisPost.nickname) {
      return { message: "수정 권한이 없습니다." };
    } else {
      return await postRepository.updatePost(postId, title, content);
    }
  };

  // ------------------
  // TASK 5 : 게시글 삭제
  deletePost = async (user, postId) => {
    const thisPost = await postRepository.getPost(postId);

    if (!thisPost) {
      return { message: "해당 게시글이 없습니다." };
    } else if (user.nickname != thisPost.nickname) {
      return { message: "삭제 권한이 없습니다." };
    } else {
      return await postRepository.deletePost(postId);
    }
  };

  // ------------------
  // TASK 6 : 게시글 좋아요 누르기
  likePost = async (user, postId) => {
    const thisPost = await postRepository.getPost(postId);
    const postIdsUserLiked = await userRepository.getAllLikedPosts(user.userId);

    if (!thisPost) {
      return { message: "해당 게시글이 없습니다." };
    } else if (!postIdsUserLiked.includes(thisPost._id.toString())) {
      await postRepository.likePost(postId);
      await userRepository.likePost(userId, postId);
      return { message: "게시글의 좋아요를 등록하였습니다." };
    } else {
      await postRepository.dislikePost(postId);
      await userRepository.dislikePost(userId, postId);
      return { message: "게시글의 좋아요를 취소하였습니다." };
    }
  };

  // ------------------
  // TASK 7 : 내가 좋아한 게시글 조회
  listMyLikedPosts = async (user) => {
    // 유저의 좋아요 배열
    const postIdsUserLiked = await userRepository.getAllLikedPosts(user.userId);

    // 그 배열에 해당하는 게시글 디테일
    const postsUserLiked = await postRepository.getPostsByLikedArray(
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

    return data;
  };
}

module.exports = PostService;
