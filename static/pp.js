window.zAsyncInit = function() {
	zmeOpenWidget.init({
		//apikey: '2dcba61457d14dc3a2c9913600f7a984',//public
		//apikey: '634c34d7acc8e12cfbfea8fa1718a9f2',//local
		apikey: 'b8ac2ec3bd1b4e75a3c945b8496e1c36',//IoT Viet
		pid: '296',
		//css : 'css/login_quickreg_1.06.css',
		css: 'http://static.me.zing.vn/openwidget/css/login_quickreg_1.06.css',
		callback: 'cb',
		callback_ex: 'cb_ex', // unsafe acc
		tpl: '5'
	});
};

function cb_ex(url){
	try {
		console.log(url);
	
	} catch (ex) {
		console.log('CBEX Error')
	}
};

function cb(cbdata,acn,zid,uin,autcode,obj){
	try {
		console.log("loginSSO success");
		var u1 = $("#u1").val();
		window.location.replace("https://sso3.zing.vn/xchecklogin?u=" + u1 + "%26u%3D" + acn + "%26zid%3D" + zid + "%26uin%3D" + uin + "&apikey=b8ac2ec3bd1b4e75a3c945b8496e1c36" + "&pid=296" );
	} catch (ex) {
		console.log('loginSSO Error')
	}
};

(function(d){
	var js, id = 'zid-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement('script'); js.id = id; js.async = true;
	var t= Math.floor(Math.random()*10000);
	//js.src = "http://open.id.zing.vn/widget/_static/openwidget.js?t="+t;
	js.src = "http://open.id.zing.vn/widget/_static/openwidget.js?type=2&t="+t;
	ref.parentNode.insertBefore(js, ref);
}(document));