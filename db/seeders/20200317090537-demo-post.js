'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Posts', [{
      title: '첫번째 블로그',
      content: '내용이댜~',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Posts', null, {});
  }
};
