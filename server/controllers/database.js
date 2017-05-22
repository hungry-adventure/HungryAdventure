const pg = require('../config/database.js');

module.exports = {
  getProfile(req, res) {
    pg('users').where('email', req.query.email).then((results) => {
      const name = req.query.name;
      const email = req.query.email;
      const profilePicture = (JSON.parse(req.query.picture)).data.url;

      if (results.length < 1) {
        // create a new users
        pg('users').insert({
          name,
          email,
          profilePicture,
        }).then(() => {
          const outcome = [];
          outcome.push({ name, email, profilePicture });
          res.send(results);
        });
      } else {
        // User exists
        res.send(results);
      }
    });
  },
  saveQuery(req, res) {
    pg('searchQueries').insert({
      email: req.query.email,
      budget: req.query.budget,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    }).then(() => {
      res.send('Saved');
    });
  },
};
