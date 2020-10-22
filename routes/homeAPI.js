const express = require('express');
const router = express.Router();
const { sqlSearch } = require('../utils/sqlConnect');

router.get('/', async function(req, res, next) {
  const homeObj = {}
  homeObj.isDone = false
  // 获得种类
  let sqlSentence1 = `select sort_id from ll_sorts where sort_name = '${req.query.t}'`
  let typeId = await sqlSearch(sqlSentence1)
  // 获得页数
  homeObj.homePages = req.query.p
  // 获得种类的文章ID
  let articleNum = 8 * req.query.p
  let sqlSentence3 = `select article_id from ll_set_article_sort where sort_id = '${typeId[0]['sort_id']}' order by article_id desc limit ${articleNum}`
  let articleId = await sqlSearch(sqlSentence3)
  articleId.splice(0, 8 * (req.query.p - 1))
  // 获得文章的具体内容
  homeObj.homeCards = []
  for(let item of articleId) {
    // 获得文章主体内容
    let sqlSentence4 = `select article_date, article_title, article_id from ll_articles where article_id = ${item['article_id']}`
    let cardMain = await sqlSearch(sqlSentence4)
    // 获得文章评论内容
    let sqlSentence5 = `select count(*) from ll_comments where article_id = ${item['article_id']}`
    let cardComment = await sqlSearch(sqlSentence5)
    // 获得文章所有标签
    let sqlSentence6 = `select label_id from ll_set_article_label where article_id = ${item['article_id']}`
    let cardTags = await sqlSearch(sqlSentence6)
    // 获得文章单个标签
    let cardTagNameStr = ''
    for(let value of cardTags[0]['label_id'].split('-')) {
      if (!value) continue
      let sqlSentence7 = `select label_name from ll_labels where label_id = ${value}`
      let cardTagName = await sqlSearch(sqlSentence7)
      cardTagNameStr += cardTagName[0]['label_name'] + '-'
    }
    let cardObj = {}
    cardObj.cardImgId = cardMain[0]['article_id']
    cardObj.cardTitle = cardMain[0]['article_title']
    cardObj.cardDate = cardMain[0]['article_date']
    cardObj.cardUrl = cardMain[0]['article_id']
    cardObj.cardMessage = cardComment[0]['count(*)']
    cardObj.cardTags = cardTagNameStr
    homeObj.homeCards.push(cardObj)
  }
  // 判断数据是否结束
  let articleNumIsDone = articleNum + 1
  let sqlSentence8 = `select article_id from ll_set_article_sort where sort_id = '${typeId[0]['sort_id']}' order by article_id desc limit ${articleNumIsDone}`
  let isOver = await sqlSearch(sqlSentence8)
  isOver.splice(0, 8 * req.query.p)
  if (!isOver.length) {
    homeObj.isDone = true
  }
  await res.json(homeObj)
});

module.exports = router;