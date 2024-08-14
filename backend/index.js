const express = require('express')
const app = express();
const cors = require('cors')
const signupRouter = require('./routes/Signup')
const signinRouter = require('./routes/Signin')
const dashboardRouter = require('./routes/Dashboard')

app.use(express.json());
app.use(cors());
app.use('/dashboard', dashboardRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})