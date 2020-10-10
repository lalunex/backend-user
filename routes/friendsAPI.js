const express = require('express');
const router = express.Router();
const { sqlSearch } = require('../utils/sqlConnect');

router.get('/', async function(req, res, next) {
  const friendsObj = []
  // 获得朋友具体信息
  let sqlSentence1 = `select * from ll_friends`
  let friendsContent = await sqlSearch(sqlSentence1)
  // 获得朋友的具体内容
  for(let item of friendsContent) {
    // 获得朋友主体内容
    let friendObj = {}
    friendObj.friendImg = item['friends_id']
    friendObj.friendName = item['friends_name']
    friendObj.friendLink = item['friends_web']
    friendsObj.push(friendObj)
  }
  await res.json(friendsObj)
});

module.exports = router;