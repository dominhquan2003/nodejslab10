const ChatRouter = require('./ChatRouter');
const AccountRouter = require('./AccountRouter');
const HomeRouter = require('./HomeRouter');


function routes(app) {
      app.use('/', HomeRouter);
      app.use('/account', AccountRouter);
      app.use('/chat', ChatRouter);
     
}

module.exports = routes;