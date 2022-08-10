const request = require("supertest"); // http 요청을 보낼 수 있는 라이브러리
const express = require("express");
const app = require("../../app"); // 서버
const { sequelize } = require("../../models");

const userDataIn = require("../data/user-data-in.js"); // 받아올 mock 데이터
const userDataOut = require("../data/user-data-out.js"); // 나와야 할 mock 데이터

// 예시 코드
beforeAll(async () => {
  await sequelize.sync();
});
