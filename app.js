var hangoutsBot = require("hangouts-bot");
var bot = new hangoutsBot("susiaifossasia@gmail.com", process.env.password);
var request = require('request');
var express = require('express');

var app = express();
app.set('port', 8080);

 
bot.on('online', function() {
    console.log('online');
});
 
bot.on('message', function(from, message) {
    console.log(from + ">> " + message);

        var options1 = {
        method: 'GET',
        url: 'http://api.susi.ai/susi/chat.json',
        qs: {
            timezoneOffset: '-330',
            q: message
        }
    };

    request(options1, function(error, response, body) {
            if (error) throw new Error(error);
            // answer fetched from susi
            var type = (JSON.parse(body)).answers[0].actions;
            var answer, columns, data, key, i, count;
            if (type.length == 1 && type[0].type == "answer") {
                answer = (JSON.parse(body)).answers[0].actions[0].expression;
                bot.sendMessage(from, answer);
            } else if (type.length == 1 && type[0].type == "table") {
                data = JSON.parse(body).answers[0].data;
                columns = type[0].columns;
                key = Object.keys(columns);
                count = JSON.parse(body).answers[0].metadata.count;
                console.log(key);

                for (i = 0; i < count; i++) {
                    answer = "";
                    answer =key[0].toUpperCase() + ": " + data[i][key[0]] + "\n" + key[1].toUpperCase() + ": " + data[i][key[1]] + "\n" + key[2].toUpperCase() + ": " + data[i][key[2]] + "\n\n";
                    bot.sendMessage(from, answer);
                }

            } else if (type.length == 2 && type[1].type == "rss"){
              data = (JSON.parse(body)).answers[0].data;
              columns = type[1];
              key = Object.keys(columns);

              for(i = 0; i< 4; i++){
                  if(i == 0){
                      answer = (JSON.parse(body)).answers[0].actions[0].expression;
                      bot.sendMessage(from, answer);
                  } else {
                      answer = "";
                      answer = key[1].toUpperCase() + ": " + data[i][key[1]] + "\n" + key[2].toUpperCase() + ": " + data[i][key[2]] + "\n" + key[3].toUpperCase() + ": " + data[i][key[3]] + "\n\n";
                      bot.sendMessage(from, answer);
                  }
              }
            } else {
                answer = "Oops looks like SUSI is taking break try to contact later.";
                bot.sendMessage(from, answer);
            }
    });

});

app.listen(app.get('port'));