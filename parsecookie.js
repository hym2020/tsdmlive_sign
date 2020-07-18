const fs = require("fs")
	, path = require("path")
	, linebot = require("linebot")

const cookieDir = path.join(process.cwd(), "cookies")
	, cookiePath = path.join(process.cwd(), "cookies", `${process.env.SITENAME}.json`)
	, botTokens = {
		channelId: process.env.LINECHANNEL,
		channelSecret: process.env.LINESECRET,
		channelAccessToken: process.env.LINECHANNELTOKEN
	  };

function makeCookies(){
	if(!fs.existsSync(cookieDir))
		fs.mkdirSync(cookieDir);
	fs.writeFileSync(cookiePath, atob(process.env.COOKIE));
}


function checkCookies(){
	if(fs.existsSync(cookiePath)){
		const sitecookies = JSON.parse(fs.readFileSync(cookiePath, "utf-8"));		
		const authKey = Object.keys(Object.keys(sitecookies)[0]).find(e => /auth/.test(e));
		
		if(new Date().getTime() >= new Date(sitecookies[authKey].authKey).getTime())
			sendMessage();
	}
}

function sendMessage(){
	const bot = linebot({...botTokens});
	bot.push(process.env.LINE_USERID, `SITE: ${process.env.SITENAME} cookies is about to expired`);
}

if(process.argv[2] == "make")
	makeCookies();
else if(process.argv[2] == "check")
	checkCookies();