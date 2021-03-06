/*
 * All routes for maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

const cookieSession = require('cookie-session');
const app = express();
app.use(cookieSession({
  name: 'cookiemonster',
  keys: ['my secret key', 'yet another secret key']
}));

module.exports = (db) => {
  //post to 'login/'
  router.post('/login', (req, res) => {
    //hard-code to set cookie params user_id =1
    req.session.user_id = 1;
    res.redirect("/index");
    });

  router.post('/logout', (req, res) => {
    req.session = null;
    // console.log(req.session.user_id);
    res.redirect("/index");
  })

    return router;

};


