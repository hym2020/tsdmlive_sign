var tsdmSim = require("./tsdmliveSim.js");
var request = require("request");


function getRealSiteDomain(){
	return new Promise(resolve => {
		var t = request({
			url: process.env.SITEURL,
			headers: {"User-Agent": "Mozilla/5.0 (X11; Linux i686; rv:64.0) Gecko/20100101 Firefox/64.0"}
		}, () => {
			resolve(`${t.uri.protocol}//${t.uri.host}`);
		});
	});
}

async function main(){
	var clog = console.log;
	
	const siteURL = await getRealSiteDomain();
	
	clog("正在嘗試腳本做任務....\n\n");
	var tds = new tsdmSim(siteURL);
	
	clog("查看是否登入...\n\n");
	if(!tds.isLogin){
		clog("未登入，無法做任務...\n\n");
		return;
	}
	
	clog("已登入...\n\n");
	
	clog("正在獲取用戶數據...\n\n");
	
	let pros = await tds.getUserProfile();
	if(pros.status == "success"){
		clog("用戶數據: \n\n");
		clog(pros.message);
		clog("\n\n");
	}
	else{
		clog("獲取用戶數據失敗!!\n\n")
	}
	
	clog("嘗試進行每日簽到...\n\n");
	
	pros = await tds.dailySign();
	if(pros.status == "success"){
		clog("嘗試成功!!\n\n");
		clog(`目前狀態為: ${pros.message}\n\n`)
	}
	else{
		clog("嘗試每日簽到失敗!!\n\n");
	}
	
	clog("嘗試進行打工任務...\n\n");
	pros = await tds.dailyTasks();
	if(pros.status == "success"){
		clog("嘗試成功!!\n\n");
		clog(`目前狀態為: ${pros.message}\n\n`)
	}
	else{
		clog("嘗試打工任務失敗!!\n\n");
	}
	
};

main();