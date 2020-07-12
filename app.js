const express = require('express');
const morgan = require('morgan');
const boardRouter = require('./router/boardRouter')
const userRouter = require('./router/userRouter')
const appError = require('./utils/appError');
const globalHandler = require('./controller/errorController');

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use('/api/v1/boards',boardRouter);
app.use('/api/v1/users',userRouter);



app.all('*',(req,res,next)=>{
  next(new appError(`Cant find ${req.originalUrl} on the server`,404));
});

app.use(globalHandler);

module.exports = app;