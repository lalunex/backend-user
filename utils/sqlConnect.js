const ms = require('mysql');

mysql =  ms.createConnection({
  host: '127.0.0.1',
  // host: '*********',
  port: '3306',                 					// 可选，默认是3306
  user: 'root',
  password: 'DEARliliang1998',
  database: 'lightliang'
})

mysql.connect();

function sqlSearch(sqlSentence, payload) {
  payload = payload ? payload : []
  return new Promise((resolve, reject) => {
    mysql.query(sqlSentence, payload, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
    // mysql.end()
  })
}
// let sqlSentence1 = `select sort_id from ll_sorts`
//
// sqlSearch(sqlSentence1).then(res => {
//   console.log(res);
// }).catch(err => {
//   console.log(err);
// })
module.exports = {
  sqlSearch
}
