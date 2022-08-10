const signUpReq = {
  nickname: "Tester10",
  password: "12345",
  confirm: "12345",
};

const loginpReq = {
  nickname: "Tester10",
  password: "12345",
};

const userReq_Cookie = {
  token:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY1OTk2MzA1NH0.XFjC5KhSJ-K-3XwjvyOTdmMu5k5Fe3GDqaCOfOezrAo",
};

const mockUser_ResLocals = {
  userId: 3,
  nickname: "Tester3",
  password: "12345",
  likedPosts: [],
  createdAt: new Date("2022-08-06T04:14:16.000Z"),
  updatedAt: new Date("2022-08-07T05:05:33.000Z"),
};

const allUsersRes = [
  {
    userId: 3,
    nickname: "Tester3",
    password: "12345",
    likedPosts: [],
    createdAt: new Date("2022-08-06T04:14:16.000Z"),
    updatedAt: new Date("2022-08-07T05:05:33.000Z"),
  },
  {
    userId: 2,
    nickname: "Tester2",
    password: "12345",
    likedPosts: ["3"],
    createdAt: new Date("2022-08-03T04:14:16.000Z"),
    updatedAt: new Date("2022-08-03T04:14:16.000Z"),
  },
];

const signUpReq1 = {
  nickname: "Tester1",
  password: "12345",
  confirm: "12345",
};

const loginpReq1 = {
  nickname: "Tester1",
  password: "12345",
};

const signUpReq3 = {
  nickname: "Tester3",
  password: "12345",
  confirm: "12345",
};

const loginpReq3 = {
  nickname: "Tester3",
  password: "12345",
};

module.exports = {
  signUpReq,
  loginpReq,
  userReq_Cookie,
  mockUser_ResLocals,
  signUpReq1,
  loginpReq1,
  signUpReq3,
  loginpReq3,
  allUsersRes,
};
