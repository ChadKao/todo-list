'use strict';
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction
    try {
      const hash = await bcrypt.hash('123', 10)
      transaction = await queryInterface.sequelize.transaction()

      await queryInterface.bulkInsert('users', [
        {
          id: 1,
          name: 'root',
          email: 'user1@example.com',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction })


      await queryInterface.bulkInsert('todos',
        Array.from({ length: 10 }).map((_, i) =>
        ({
          name: `todo-${i}`,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ),
        { transaction }
      )

      await transaction.commit()
    } catch (error) {
      if (transaction) transaction.rollback()
      console.error(error)
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
};
