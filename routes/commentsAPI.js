const express = require('express');
const router = express.Router();
const { sqlSearch } = require('../utils/sqlConnect');

router.post('/', async function(req, res, next) {
  let changeDateForm = (req.body.cd).replace(/年/, '-').replace(/月/, '-').replace(/日/, '')
  changeDateForm = new Date(changeDateForm);
  let sqlSentence1 = `select comment_id from ll_comments order by comment_id desc limit 1`
  let commentsId = await sqlSearch(sqlSentence1)
  let commentsIdNum = commentsId[0]['comment_id'] + 1
  let payLoad = [commentsIdNum, req.body.cid || 0, req.body.cu, req.body.ce, changeDateForm, req.body.cc]
  let sqlSentence2 = `insert into ll_comments (comment_id, article_id, comment_username, comment_useremail, comment_date, comment_content) values (?, ?, ?, ?, ?, ?)`
  await sqlSearch(sqlSentence2, payLoad).then(() => {
    res.json({ states: true })
  }).catch(() => {
    res.json({ states: false })
  })
});

module.exports = router;