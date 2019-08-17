module.exports = {
  action: require(process.env.PWD + '/app/middleware/micropub/action'),
  create: require(process.env.PWD + '/app/middleware/micropub/create'),
  query: require(process.env.PWD + '/app/middleware/micropub/query')
};
