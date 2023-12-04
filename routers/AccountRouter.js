const express = require('express')
const Router = express.Router();
Router.get('/login', (req, res) => {
      res.render('login');
})


module.exports = Router
