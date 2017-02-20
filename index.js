var linebot = require('linebot');
var express = require('express');
var getJSON = require('get-json');

var bot = linebot({
  channelId: '1501849021',
  channelSecret: '182a23a7e9c6b80bad4a557c8e7879d3',
  channelAccessToken: 'fPPdnXyU1WDXhQGVXUswJU9AJC4jRgaDm/B84ezhp+Av8KCJbQRdFjDR6OQnF5R9vwTqLb7G7vDFwAvjjo+dpXzPwTv4tEIjcfQlms6bftGPEQl+pHm6qO/HZqJjB2cIoR7wj2Odw+ANaASE30j+agdB04t89/1O/w1cDnyilFU='
});


var timer;
var pm = [];
var uvi = [];
_getPMJSON();
_getUVIJSON();

_bot();

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});

//回答的 function
function _bot() {
  bot.on('message', function(event) {
    if (event.message.type == 'text') {
      var msg = event.message.text;
      var replyMsg = '';
      if (msg.indexOf('PM2.5') != -1) {
        pm.forEach(function(e, i) {
          if (msg.indexOf(e[0]) != -1) {
            replyMsg =  e[0] + '的 PM2.5 數值為 ' + e[1];
          }
        });
        if (replyMsg == '') {
          replyMsg = '查無此處請輸入完整地名(區)';
        }
      } else if(msg.indexOf('UVI') != -1){
        uvi.forEach(function(e, i) {
          if (msg.indexOf(e[0]) != -1) {
            replyMsg =  e[0] + '的 紫外線為 ' + e[1];
          }
        });
        if (replyMsg == '') {
          replyMsg = '查無此處請輸入完整地名(區)' ;
        }
      }
      if (replyMsg == '') {

        replyMsg = '測試請打：某地區的 PM2.5 \n測試請打：某地區的 UVI \n資料來源：http://taqm.epa.gov.tw/taqm/tw/Pm25Index.aspx \n  \n不知道「'+msg+'」是什麼意思,能吃ㄇ:p';

      }

      event.reply(replyMsg).then(function(data) {
        console.log(replyMsg);
      }).catch(function(error) {
        console.log('error');
      });
    }
  });

}

//取得 PM2.5 OpenData Json 的資料
function _getPMJSON() {
  clearTimeout(timer);
  getJSON('http://opendata2.epa.gov.tw/AQX.json', function(error, response) {
    response.forEach(function(e, i) {
      pm[i] = [];
      pm[i][0] = e.SiteName;
      pm[i][1] = e['PM2.5'] * 1;
      pm[i][2] = e.PM10 * 1;
    });
  });
  timer = setInterval(_getPMJSON, 1800000); //每半小時抓取一次新資料

}

//取的 紫外線 OpenData Json 的資料
function _getUVIJSON() {
  clearTimeout(timer);
  getJSON('http://opendata.epa.gov.tw/ws/Data/UV/?format=json', function(error, response) {
    response.forEach(function(e, i) {
      uvi[i] = [];
      uvi[i][0] = e.SiteName;
      uvi[i][1] = e['UVI'] * 1;
    });
  });
  timer = setInterval(_getUVIJSON, 3600000); //每1小時抓取一次新資料

}


//自動推播 使用 timeout發送
setTimeout(function(){
    var userId = '286686578';
    var sendMsg = '早安親愛的irving';
    bot.push(userId,sendMsg);
    console.log('send: '+sendMsg);
},5000);

