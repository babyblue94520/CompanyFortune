/**
 * Dosciz API
 * 
 */
function DiscuzAPI(){
	var that = this;
	//论坛微信扫码调用URL
//	var _discuzWeChatSMUrl = 'http://www.wusong123.com/wechat-login.html';
	var _discuzWeChatSMUrl = 'http://192.168.5.122:8000/plugin.php?id=wechat:login';
	//附加的GET Data
	var _data = {
//		SynchronizeReferer:window.location.href,
		SynchronizeName:'官网',
		SynchronizeReferer:window.location.origin,
		SynchronizeOrigin:window.location.origin
	};
	//扫码视窗
	var _smWindow = false;
	//视窗名称
	var _smTitle = '微信扫码登录';
	//视窗大小
	var _smWidth = 400;
	var _smHeight = 400;
	//window.opn config
	var _windowConfig = [
		'width='+_smWidth+'px',
		'height='+_smHeight+'px',
		'toolbar=no',
		'scrollbars=no',
		'resizeable=no',
		'menubar=no',
		'status=no'
	];
	//登录成功后是否关闭视窗
	var _smClose = true;
	//检查登录URL
	var _checkLoginUrl = 'mobi/login.php';
	//第一次检查是否登录的等待时间
	var _checkWaitTime = 5000;
	//每次检查是否登录的时间
	var _checkDelay = 3000;
	//检查是否登录次数
	var _checkMaxCount = 20;
	//已检查次数
	var _checkCount = 0;
	
	//微信扫码登录
	that.weChatSMLogin = _weChatSMLogin;
	
	/**
	 * 初始化
	 * @private
	 */
	function _init(){
		
	}
	
	/**
	 * 微信扫码登录
	 * @private
	 */
	function _weChatSMLogin(){
		//检查是否登录
		_chekcLogin(function(login){
			if(!login){
				//登录流程2 直接跳转
				window.location.href =_getGetUrl(_discuzWeChatSMUrl,_data);
				
				//登录流程1 开启新视窗扫码
//				_openWeChatSM();
			}else{
				window.location.reload();
			}
		});
	}
	
	/**
	 * 开启微信扫码视窗
	 */
	function _openWeChatSM(){
		if(!_smClose){
			console.log();
			_smWindow = window.open(_getGetUrl(_discuzWeChatSMUrl,_data),_smTitle);
			setTimeout(_chekcLogin,_checkWaitTime);
			return;
		}
		
		var left = $(document).width()-_smWidth;
		left = left<0?0:left/2;
		var top = $(document).height()-_smHeight;
		top = top<0?0:top/2;
		_windowConfig.push('left='+left);
		_windowConfig.push('top='+top);
		_smWindow = window.open(_getGetUrl(_discuzWeChatSMUrl,_data),_smTitle,_windowConfig.join(','));
		if(!_smWindow){
			alert('亲爱的用户您好，您封锁了微信扫码弹窗，请解除封锁后，再操作一次！');
		}else{
			setTimeout(_chekcLogin,_checkWaitTime);
		}
	}

	/**
	 * 确认是否登录
	 * @param {Function} callback(Boolean) 回调  可为空 
	 * @private
	 */
	function _chekcLogin(callback){
		$.ajax({
			url:_checkLoginUrl,
			dataType:'json'
		}).done(function(result) {
			if(callback&&typeof callback === 'function'){
				callback(true);
			}else{
				_smWindowClose();
				window.location.reload();
			}
		}).fail(function() {
			if(callback&&typeof callback === 'function'){
				callback(false);
			}else{
//				_checkAgein();
			}
		});
	}
	
	/**
	 * 关闭扫码视窗
	 */
	function _smWindowClose(){
		if(_smClose&&_smWindow){
			_smWindow.close();
			_smWindow = false;
		}
	}
	
	/**
	 * 判断是否超过扫码时间或者检查次数
	 * @private
	 */
	function _checkAgein(){
		if(_checkCount++<_checkMaxCount){
			setTimeout(_chekcLogin,_checkDelay);
		}else{
			_smWindowClose();
			alert('超过扫码时间，请重新操作。');
		}
	}
	
	/**
	 * URL增加GET 资料
	 * @param {String} url 网址
	 * @param {Object} data 要增加的资料
	 * @return {String}
	 * @private
	 */
	function _getGetUrl(url,data){
		var get = [];
		for(var i in data){
			get.push(i+'='+data[i]);
		}
		if(url.indexOf('?')==-1){
			return url+'?'+get.join('&');
		}else{
			return url+'&'+get.join('&');
		}
	}
	
}