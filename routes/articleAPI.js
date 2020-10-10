const express = require('express');
const router = express.Router();
const { sqlSearch } = require('../utils/sqlConnect');

router.get('/', async function(req, res, next) {
  const articleObj = {}
  // 获得文章图片
  articleObj.articleArticle = {}
  articleObj.articleArticle.articleContentImg = Math.round(Math.random() * 95 + 1)
  // 获得文章标签
  let sqlSentence1 = `select label_id from ll_set_article_label where article_id = '${req.query.id}'`
  let labelId = await sqlSearch(sqlSentence1)
  let cardTagNameStr = ''
  articleObj.articleArticle.articleContentTags = []
  for(let value of labelId[0]['label_id'].split('-')) {
    let sqlSentence2 = `select label_name from ll_labels where label_id = ${value}`
    let cardTagName = await sqlSearch(sqlSentence2)
    articleObj.articleArticle.articleContentTags.push(cardTagName[0]['label_name'])
  }
  // 获得文章的具体内容
  articleObj.articleArticle.articleContentMainbody = {}
  let sqlSentence3 = `select article_date, article_title, article_content from ll_articles where article_id = ${req.query.id}`
  let cardMain = await sqlSearch(sqlSentence3)
  articleObj.articleArticle.articleContentMainbody.articleTitle = cardMain[0]['article_title']
  articleObj.articleArticle.articleContentMainbody.articleDate = cardMain[0]['article_date']
  articleObj.articleArticle.articleContentMainbody.articleContent = cardMain[0]['article_content']
  // 获得文章评论条数
  let sqlSentence4 = `select count(*) from ll_comments where article_id = ${req.query.id}`
  let articleCommentNum = await sqlSearch(sqlSentence4)
  articleObj.articleArticle.articleContentMainbody.articleCommentNum = articleCommentNum[0]['count(*)']
  // 文章回复内容
  articleObj.articleReplyObjs = []
  let sqlSentence5 = `select comment_id, comment_username, comment_date, comment_content from ll_comments where article_id = ${req.query.id}`
  let articleComments = await sqlSearch(sqlSentence5)
  for(let item of articleComments) {
    let articleCommentNumObj = {}
    articleCommentNumObj.replyContentImg = item['comment_id']
    articleCommentNumObj.replyContentName = item['comment_username']
    articleCommentNumObj.replyContentDate = item['comment_date']
    articleCommentNumObj.replyContentContent = item['comment_content']
    articleObj.articleReplyObjs.push(articleCommentNumObj)
  }
  await res.json(articleObj)
});

module.exports = router;