var host = 'localhost';
if (process.env.DOCKER === 'true') {
  host = 'mongo';
}

module.exports = {
  port: 3330,
  dbhost: 'mongodb://' + host + '/business'
};
