const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.connectDb = async (retries = 10) => {
  while (retries) {
    try {
      await sequelize.authenticate(); // testing the connection
      console.log(`Testing the connect is success`);
      sequelize.sync(); // 정의한 모델들로 자동으로 테이블 생성
      break;
    } catch (err) {
      console.log(`db connect error: ${err}`);
      retries--;
      console.log(`retries left: ${retries}`);
      await new Promise(res => setTimeout(res, 5000)); // 5초 기다림
    }
  }
};
db.disconnectDb = async () => {
  await sequelize.close();
}

// 모델 정의
db.Auth = require('./auth')(sequelize, Sequelize);
db.Token = require('./token')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Tag = require('./tag')(sequelize, Sequelize);
db.Category = require('./category')(sequelize, Sequelize);

// 관계 정의
// post : tag = N : M
// post : category = N : M
db.Post.belongsToMany(db.Tag, { through: 'PostTag' });
db.Tag.belongsToMany(db.Post, { through: 'PostTag' });
db.Post.belongsToMany(db.Category, { through: 'PostCategory' });
db.Category.belongsToMany(db.Post, { through: 'PostCategory' });

module.exports = db;