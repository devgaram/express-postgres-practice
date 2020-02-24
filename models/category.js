module.exports = (sequelize, DataTypes) => {
  return sequelize.define('category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
  }, {
    timestamps: false,
  });
};