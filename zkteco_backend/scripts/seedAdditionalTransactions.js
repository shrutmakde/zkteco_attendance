require('dotenv').config();

const generateAdditionalTransactions = require('../src/seeders/additionalTransactionSeeder');

console.log('Starting to generate additional transactions...');

generateAdditionalTransactions()
  .then(() => {
    console.log('Successfully completed generating additional transactions');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to generate additional transactions:', error);
    process.exit(1);
  });