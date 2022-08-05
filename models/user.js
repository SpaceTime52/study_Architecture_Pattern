"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      userId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nickname: DataTypes.STRING,
      password: DataTypes.STRING,
      likedPosts: DataTypes.JSON, // 이 유저가 좋아한 게시글(post)들의 id를 배열형태의 객체로 넣는 column입니다.
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
