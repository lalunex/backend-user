const express = require('express');
const router = express.Router();
const { sqlSearch } = require('../utils/sqlConnect');

router.get('/', async function(req, res, next) {
  const appComponentsObj = {}
  // 获得headerImg
  appComponentsObj.appComponentsImg = Math.round(Math.random() * 95 + 1)
  // 获得诗歌
  let sqlSentence1 = `select poem_text from ll_poem where poem_id = '${Math.round(Math.random() * 260 + 1)}'`
  let poemText = await sqlSearch(sqlSentence1)
  appComponentsObj.appComponentsPoem = poemText[0]['poem_text']
  // 获得最新的4篇文章
  let sqlSentence2 = `select article_id from ll_articles order by article_id desc limit 4`
  let articleId = await sqlSearch(sqlSentence2)
  // 获得文章的具体内容
  appComponentsObj.appComponentsAside = {}
  appComponentsObj.appComponentsAside.asideContentLatestPostsObjs = []
  for(let item of articleId) {
    // 获得文章主体内容
    let sqlSentence3 = `select article_title, article_id from ll_articles where article_id = ${item['article_id']}`
    let cardSimple = await sqlSearch(sqlSentence3)
    // 获得文章所有标签
    let sqlSentence4 = `select label_id from ll_set_article_label where article_id = ${item['article_id']}`
    let cardTags = await sqlSearch(sqlSentence4)
    // 获得文章单个标签
    let cardTagNameStr = ''
    for(let value of cardTags[0]['label_id'].split('-')) {
      if (!value) continue
      let sqlSentence5 = `select label_name from ll_labels where label_id = ${value}`
      let cardTagName = await sqlSearch(sqlSentence5)
      cardTagNameStr += cardTagName[0]['label_name'] + '-'
    }
    let cardObj = {}
    cardObj.latestPostsImg = cardSimple[0]['article_id']
    cardObj.latestPostsTitle = cardSimple[0]['article_title']
    cardObj.latestPostsUrl = cardSimple[0]['article_id']
    cardObj.latestPostsTags = cardTagNameStr
    appComponentsObj.appComponentsAside.asideContentLatestPostsObjs.push(cardObj)
  }
  
  // 获得所有标签
  let sqlSentence6 = `select label_name from ll_labels`
  let cardTagNames = await sqlSearch(sqlSentence6)
  appComponentsObj.appComponentsAside.asideContentTagsObjs = []
  for(let item of cardTagNames) {
    appComponentsObj.appComponentsAside.asideContentTagsObjs.push(item['label_name'])
  }
  
  // 获得广告内容
  appComponentsObj.appComponentsAside.asideContentAdvertisesements = []
  const AdvertisesementsImgNum = Math.round(Math.random() * 170 + 1)
  const AdvertisesementsSoupNum = Math.round(Math.random() * 310 + 1)
  // 获得毒鸡汤
  let sqlSentence7 = `select chickensoup_text from ll_chickensoup where chickensoup_id between ${AdvertisesementsSoupNum} and (${AdvertisesementsSoupNum} + 4)`
  let chickensoupText = await sqlSearch(sqlSentence7)
  for(let i = 0; i < 5; i++) {
    let AdvertisesementsContent = {}
    AdvertisesementsContent.text = chickensoupText[i]['chickensoup_text']
    AdvertisesementsContent.imgSrc = i + AdvertisesementsImgNum
    AdvertisesementsContent.url = 'https://lightliang.top/'
    appComponentsObj.appComponentsAside.asideContentAdvertisesements.push(AdvertisesementsContent)
  }
  await res.json(appComponentsObj)
});

module.exports = router;