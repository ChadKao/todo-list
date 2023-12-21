'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('todos', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false,
      defaultValue: 1
    }
    )

    await queryInterface.changeColumn('todos', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    })
  },
  
  

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('todos', 'userId')
  }
};
