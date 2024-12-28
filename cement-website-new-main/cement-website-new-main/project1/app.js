const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000; // Use the dynamic port assigned by Heroku or default to 5000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('project1'));

function loadPreDefinedValues() {
  try {
    return JSON.parse(fs.readFileSync('project1/preDefinedValues.json', 'utf8'));
  } catch (err) {
    console.error('Error loading pre-defined values:', err);
    return {}; 
  }
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.get('/login-registration', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});


app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  const preDefinedValues = loadPreDefinedValues();

  if (preDefinedValues.signupInfo) {
    const user = preDefinedValues.signupInfo.find(info => info.email === email);

    if (user && user.password === password) {
      const currentTime = new Date();
      const expirationTime = new Date(currentTime.getTime() + 5 * 60 * 1000); // Add 10 minutes in milliseconds
      res.cookie('username', user.name, { expires: expirationTime });
      res.cookie('username', user.name);
      res.redirect('/index.html');
      return;
    }
  }
  res.send('<script>alert("Invalid email or password."); window.location.href = "/login-registration";</script>');
  res.redirect('/login-registration');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
