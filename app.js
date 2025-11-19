import express from 'express';
import session from 'express-session';

const app = express();

app.set('view engine', 'pug');




app.use(session({
  secret: 'detHemmeligeSted',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  res.render('includes/landingPage');
});