const generateDummyTransactions = require('../src/seeders/transactionSeeder');

console.log('Starting to generate dummy transactions...');

generateDummyTransactions()
  .then(() => {
    console.log('Successfully generated dummy transactions');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to generate dummy transactions:', error);
    process.exit(1);
  }); 