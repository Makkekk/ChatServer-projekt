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

app.get('/createAccount', (request, response)=>{

  response.render('includes/createAccount')
})

app.listen(8080, () => {
    console.log('Serveren kører på http://localhost:8080')
});