const history = require('connect-history-api-fallback');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const homeAPI = require('./routes/homeAPI');
const appComponentsAPI = require('./routes/appComponentsAPI');
const articleAPI = require('./routes/articleAPI');
const friendsAPI = require('./routes/friendsAPI');
const searchAPI = require('./routes/searchAPI');
const commentsAPI = require('./routes/commentsAPI');

const app = express();

app.use(cors({
  origin: ['*'],
  methods: ['GET', 'POST']
}));
//跨域问题解决方面
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  // DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(cookieParser());
app.use(history({
  rewrites: [
    {
      from: /^\/api\/.*$/,
      to: function (context) {
        return context.parsedUrl.path
      }
    }
  ]
}));
app.use(express.static(path.join(__dirname, '../../../project/personal-blog/dist')));
// app.use(express.static(path.join(__dirname, './dist')));

app.use('/api/home', homeAPI);
app.use('/api/appcomponents', appComponentsAPI);
app.use('/api/search', searchAPI);
app.use('/api/friends', friendsAPI);
app.use('/api/article', articleAPI);
app.use('/api/comments', commentsAPI);

app.use(function(err, req, res, next) {
  res.send('error');
});

app.listen(8000, () => {
  console.log('8000端口已打开');
})
