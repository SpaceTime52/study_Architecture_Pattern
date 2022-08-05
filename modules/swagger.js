const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: `</br>
        (연습문제이므로 ERD도 여기에 기록합니다.)
        <img src="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/08c62cea-a311-4ef0-9579-5e2fe16def2c/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220805%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220805T010127Z&X-Amz-Expires=86400&X-Amz-Signature=a98404c2aaf18bb4ddfedc2ef0ed5b15e648fb3f3129635bff494db538294cfc&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject" alt="image" width="600">
        </br>
        <b>API 연습을 위한 블로그 콘텐츠, 댓글 API</b> - 명세는 아래와 같습니다.
        </br>
        `,
    },
    host: "http://nodeapi.myspaceti.me:8000",
    basePath: "/",
  },
  apis: ["./routes/users.js", "./routes/posts.js", "./routes/comments.js"],
};

const specs = swaggereJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
