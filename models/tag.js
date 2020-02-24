module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
  }, {
    timestamps: false,
  });
};