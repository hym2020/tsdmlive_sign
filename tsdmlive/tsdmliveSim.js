var discuzSim = require("../core/discuzSim.js");
var fs = require("fs");


class tsdmliveSims extends discuzSim {
	constructor(site){
		super("tsdmlive", site);	
	}
	
	
	
	async dailySign(){
		if(!this.isLogin)
			return Promise.resolve({
				status: "failed",
				message: "Not logged in"
			});
		try{		
			let $ = this.siteUtils.constructor.cheerioLoad((await this.siteUtils.sendGetRequest(`${this.hostURL}/plugin.php?id=dsu_paulsign:sign`)).body);

			let data = {
				formhash: $("input[name='formhash']").attr("value"),
				qdmode: "1",
				todaysay: "大家好，又是美好的一天，願上帝保佑你",
				fastreply: "1",
				qdxq: "kx"
			};
			
			let r = await this.siteUtils.sendPostRequest(`${this.hostURL}/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1`, data);
			
			return Promise.resolve({
				status: "success",
				message: /签到成功|已经签到/.test(r.body) ? "已簽" : "未簽"
			});

			return Promise.resolve(r);		
			
		}
		catch(e){
			console.log(e);
			return Promise.resolve({
				status: "failed",
				message: "Error in dailySign"
			});
		}	
	}
	
	async dailyTasks(url){
		if(!this.isLogin)
			return Promise.resolve({
				status: "failed",
				message: "Not logged in"
			});
		try{
			var sleep = sec => new Promise(resolve => setTimeout(resolve, sec*1000));
			
			let r = await this.siteUtils.sendGetRequest(`${this.hostURL}/plugin.php?id=np_cliworkdz:work`);
			
			
			
			if(/需要等待/.test(r.body)){
				let waitUntil = r.body.match(/等待[0-9]+小时[0-9]+分钟[0-9]+秒/);
				let d = new Date();
				if(waitUntil !== null){
					waitUntil = waitUntil[0].match(/[0-9]+/g);
					d.setHours(d.getHours() + parseInt(waitUntil[0]));
					d.setMinutes(d.getMinutes() + parseInt(waitUntil[1]));
					d.setSeconds(d.getSeconds() + parseInt(waitUntil[2]));
				}
				
				return Promise.resolve({
					status: "success",
					message: "需要等待冷卻，時間為 "+ d.toString()
				});		
			}	
			
			
			for(let i = 0 ; i< 6 ;i++){
				await this.siteUtils.sendPostRequest(`${this.hostURL}/plugin.php?id=np_cliworkdz:work`, {act:"clickad"});
				await sleep(2);
			}
			r = await this.siteUtils.sendPostRequest(`${this.hostURL}/plugin.php?id=np_cliworkdz:work`, {act:"getcre"});
			
			return Promise.resolve({
				status: "success",
				message: /成功领取/.test(r.body) ? "已做任務" : "未做任務"
			});
		}
		catch(e){
			console.log(e);
		return Promise.resolve({
				status: "failed",
				message: "Error in dailyTasks"
			});
		}	
	}
}

module.exports = tsdmliveSims;