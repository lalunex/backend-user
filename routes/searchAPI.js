const express = require('express');
const router = express.Router();
const { sqlSearch } = require('../utils/sqlConnect');

router.get('/', async function(req, res, next) {
  const searchObj = {}
  searchObj.isDone = false
  // 获得查询标题内容的博客id
  let sqlSentence1 = `select article_id from ll_articles where article_title like '%${req.query.t}%' order by article_id desc`
  let articleIds = await sqlSearch(sqlSentence1)
  
  // 获得页数
  searchObj.searchPages = req.query.p
  // 获得种类的文章ID
  // let sqlSentence2 = `select article_id from ll_set_article_sort, ll_sorts where ll_set_article_sort.sort_id = ll_sorts.sort_id and sort_name like '%${req.query.t}%' order by article_id desc`
  // let articleIds2 = await sqlSearch(sqlSentence2)
  
  // 获得标签的文章ID
  let sqlSentence3 = `select label_id from ll_labels where label_name like '%${req.query.t}%'`
  let articleTags = await sqlSearch(sqlSentence3)
  let articleIds3
  // console.log(articleTags);
  // console.log(req.query.t);
  if (!articleTags[0]) {
    articleIds3 = []
  } else {
    let sqlSentence4 = `select article_id from ll_set_article_label where label_id like '%-${articleTags[0]['label_id']}-%' order by article_id desc`
    articleIds3 = await sqlSearch(sqlSentence4)
  }
  // console.log(articleIds3);
  // 总的文章id和去重并从大到小排列
  articleIds.push(...articleIds3)
  let middleArr = []
  articleIds.forEach((item, index) => {
    middleArr.push(item['article_id'])
  })
  
  let newArticlesId = [...new Set(middleArr)].sort((a, b) => {
    return b - a
  })
  console.log(newArticlesId);
  
  // 判断数据是否结束
  let articleNum = 8 * (req.query.p - 1)
  let finallArr
  if ((8 * req.query.p) >= newArticlesId.length) {
    searchObj.isDone = true
    finallArr = newArticlesId.slice(articleNum)
  } else {
    finallArr = newArticlesId.slice(articleNum, articleNum + 8)
  }
  // 获得文章的具体内容
  searchObj.searchCards = []
  for(let item of finallArr) {
    // 获得文章主体内容
    let sqlSentence5 = `select article_date, article_title, article_id from ll_articles where article_id = ${item}`
    let cardMain = await sqlSearch(sqlSentence5)
    // 获得文章评论内容
    let sqlSentence6 = `select count(*) from ll_comments where article_id = ${item}`
    let cardComment = await sqlSearch(sqlSentence6)
    // 获得文章所有标签
    let sqlSentence7 = `select label_id from ll_set_article_label where article_id = ${item}`
    let cardTags = await sqlSearch(sqlSentence7)
    // 获得文章单个标签
    let cardTagNameStr = ''
    for(let value of cardTags[0]['label_id'].split('-')) {
      if (!value) continue
      let sqlSentence8 = `select label_name from ll_labels where label_id = ${value}`
      let cardTagName = await sqlSearch(sqlSentence8)
      cardTagNameStr += cardTagName[0]['label_name'] + '-'
    }
    let cardObj = {}
    cardObj.cardImgId = cardMain[0]['article_id']
    cardObj.cardTitle = cardMain[0]['article_title']
    cardObj.cardDate = cardMain[0]['article_date']
    cardObj.cardUrl = cardMain[0]['article_id']
    cardObj.cardMessage = cardComment[0]['count(*)']
    cardObj.cardTags = cardTagNameStr
    searchObj.searchCards.push(cardObj)
  }
  await res.json(searchObj)
});

module.exports = router;