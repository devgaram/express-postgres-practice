module.exports = (sequelize, DataTypes) => {
  return sequelize.define('auth', {
    userid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  }, {
    timestamps: false, // true면 시퀄라이즈가 createdAt, updatedAt 컬럼을 추가함.
  });
};