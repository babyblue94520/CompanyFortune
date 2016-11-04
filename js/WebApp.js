/**
 * App下，开起分享视窗
 */
function WebApp(){
	var that = this;
	var _urlParamValue = {};
	var _$appShare = false;
	var _$header = false;
	var _$footer = false;
	var _headerContent = false;
	var _footerContent = false;
	
	
	/*Text
      image
      music
      video
      webPage
    */
	var _param = {
		Type:'text',
		Title:'',
		ShareTo:'',
		Desc:'',
		SendUrl:'',
		ImageUrl:''
	};
	
	//分享参数
	var _shareParam = {
		wxFriend:{
			Title:'',
			Desc:'',
			SendUrl:'',
			ImageUrl:''
		},
		wxMonments:{
			Title:'',
			Desc:'',
			SendUrl:'',
			ImageUrl:''
		},
		wxCollect:{
			Title:'',
			Desc:'',
			SendUrl:'',
			ImageUrl:''
		}
	};
	
	
	//html格式
	var _htmlTemplate = [
		'<div class="app-share">',
			'<div class="app-share-screen"></div>',
			'<div class="app-share-block">',
			'	<div class="app-share-header"></div>',
			'	<div class="app-share-content"></div>',
			'	<div class="app-share-footer"><div style="text-align:center;">随时分享，微信与您同在</div></div>',
			'</div>',
		'</div>'
	].join('');
	
	//选项html格式
	var _itemHtmlTemplate = [
		'<div class="item mui-col-xs32-4">',
			'	<img class="image" src="{0}" />',
			'	<div class="text">{1}</div>',
		'</div>'
	].join('');

	//选项资料
	var _data = [
		{id:'wxFriend',name:'微信好友',image:'images/wechat/wx_logo.png'},
		{id:'wxMonments',name:'微信朋友圈',image:'images/wechat/wx_moments.png'},
		{id:'wxCollect',name:'微信搜藏',image:'images/wechat/wx_collect.png'}
	];
	
	//名称对应ShareTo key
	var _itemToShareId = {
		wxFriend:'0',
		wxMonments:'1',
		wxCollect:'2'
	};
	
	
	that.setHeader = _setHeader;
	that.setFooter = _setFooter;
	that.setShareParam = _setShareParam;
	that.openShare = _openShare;
	that.closeShare = _closeShare;

	//开启浏览器
	that.openBrowser = _openBrowser;
	//转页
	that.redirect = _redirect;
	//开启QQ
	that.openAppKeFu = _openAppKeFu;
	//清除
	that.clearCache = _clearCache;
	//是否为webview开启
	that.isWebApp = _isWebApp;
	//webapp版本
	that.getVersion = _getVersion;

	_init();

	/**
	 * 初始化
	 *  @private
	 */
	function _init(){

		_initUrlParamValue();
		
		//判断
		if(!that.isWebApp()&&_urlParamValue['webapp']){
			sessionStorage['webapp'] = _urlParamValue['webapp'];
		}
		if(!that.getVersion()&&_urlParamValue['webappversion']){
			sessionStorage['webappversion'] = _urlParamValue['webappversion'];
		}
		console.log(that.getVersion())
	}
	
	/**
	 * 初始化事件
	 */
	function _event(){
		if(!_$appShare)return;
		_$appShare.find('.app-share-screen').click(_closeShare);
	}
	
	/**
	 *
	 * @param param
	 * @private
    */
	function _setHeader(content){
		_headerContent = content;
	}
	
	/**
	 *
	 * @param param
	 * @private
   */
	function _setFooter(content){
		_footerContent = content;
	}
	
	/**
	 * 修改url scheme 参数
	 * @param param
	 * @private
     */
	function _setShareParam(param){
		if(!typeof param ==='Object')return;
		$.extend(_shareParam,param);
	}

	/**
	 * 是否为webview开启
	 */
	function _isWebApp(){
		return sessionStorage['webapp']?JSON.parse(sessionStorage['webapp']):false;
	}
	
	/**
	 * 是否为webview开启
	 */
	function _getVersion(){
		return sessionStorage['webappversion']?JSON.parse(sessionStorage['webappversion']):false;
	}
	
	/**
	 * 显示
	 * @private
     */
	function _openShare(){
		if(!_$appShare){
			if(_$appShare)return;
			_$appShare = $(_htmlTemplate);
			_$header = _$appShare.find('.app-share-header');
			_$footer = _$appShare.find('.app-share-footer');
			
			_createShareItem();
			$('body').append(_$appShare);
			 _event();
		}
		
		if(_headerContent){
			_$header.empty();
			_$header.append(_headerContent);
		}
		if(_footerContent){
			_$footer.empty();
			_$footer.append(_footerContent);
		}
		setTimeout(_shareShow,100);
	}

	/**
	 * 显示
	 * @private
	 */
	function _shareShow(){
		if(!_$appShare)return;
		_$appShare.addClass('show');
	}
	
	/**
	 * 关闭
	 * @private
	 */
	function _closeShare(){
		if(!_$appShare)return;
		_$appShare.removeClass('show');
	}
	
	
	/**
	 * 产生选项
	 * @private
     */
	function _createShareItem(){
		if(!_$appShare)return;
		_$appShare.find('.app-share-content').empty();
		var $els = [];
		var $el;
		for(var i in _data){
			if(!_data[i])continue;
			$el = $(String.format(_itemHtmlTemplate,_data[i].image,_data[i].name));
			$el.bind('click',{id:_data[i].id},_itemHandler);
			$els.push($el);
		}
		_$appShare.find('.app-share-content').append($els);
	}

	/**
	 * 选项点击处理
	 * @private
     */
	function _itemHandler(e){
		if(!_itemToShareId[e.data.id])return;
		$.extend(_param,_shareParam[e.data.id]);
		
		_openWx('open_wxShare',_itemToShareId[e.data.id],_param.Type,_param.Title,_param.Desc,_param.SendUrl,_param.ImageUrl);
		_closeShare();
	}
	
	
	/**
	 * 开启微信分享功能
	 */
	function _openWx(){
		if(!that.isWebApp()){
			alert('该装置不支持。');
			return;
		}
		if(!that.getVersion()){
			alert('该版本不支持。');
	        return;
		}
		_callApp.apply(null,arguments);
	}
	
	/**
	 * 开启浏览器
	 */
	function _openBrowser(url){
		if(that.isWebApp()){
			if(that.getVersion()){
				_callApp('open_url',arguments[0],arguments[1],arguments[2]);
			}else{
				window.open(url);
			}
		}else{
			window.open(url);
		}
	}

	/**
	 * 跳转
	 */
	function _redirect(url){
		if(that.isWebApp()){
			if(that.getVersion()){
				_callApp('open_url',arguments[0],arguments[1],arguments[2]);
			}else{
				window.location.href = url;
			}
		}else{
			window.location.href = url;
		}
	}
	
	/**
	 * 开启微客服
	 */
    function _openAppKeFu(username){
		if(!that.isWebApp()){
			alert('该装置不支持。');
			return;
		}
		if(!that.getVersion()){
			alert('该版本不支持。');
	        return;
		}
		_callApp('open_appKeFu',username,'wusonggroup','武松客服组','1');
    }
    
	/**
	 * 清除缓存
	 */
	function _clearCache(url){
		if(!that.isWebApp()){
			alert('该装置不支持。');
			return;
		}
		if(!that.getVersion()){
			alert('该版本不支持。');
	        return;
		}
		_callApp('clear_cache');
	}

	/**
	 * 呼叫App方法
	 */
	function _callApp(){
		var data = {};
		for(var i =0;i<9;i++){
			if(i==0){
				data['type'] = arguments[i]||'';
			}else{
				data['extra'+i] = arguments[i]||'';
			}
		}
//		alert(JSON.stringify(data));
		if(_getMobileKind()=='Android'){
			window.gsmc.jsToMobile(JSON.stringify(data));
		}else{
			window.webkit.messageHandlers.jsToMobile.postMessage(data);
		}
	}
	
	/**
	 * 取得 url scheme
	 * @private
     */
	function _getAppUrl(url,data){
		var get = [];
		for(var i in data){
			if(data[i]==undefined||data[i]==null||data[i]==''||data[i]==false){
				get.push(i+'='+data[i]);
			}
		}
		if(url.indexOf('?')==-1){
			return url+'?'+get.join('&');
		}else{
			return url+'&'+get.join('&');
		}
	}

	/**
	 * 解析Url param内容
	 */
	function _initUrlParamValue() {
		_urlParamValue = {};
		var query = window.location.search.substring(1);
		if(query.length==0)return;
		var vars = query.split("&"),pair;
		for (var i=0;i<vars.length;i++) {
			pair = vars[i].split("=");
			_urlParamValue[pair[0]] = pair[1];
		}
		query = vars = pair = null;
	}
	

	/**
	 * app版本
	 */
	function _getMobileKind(){
		if(navigator.userAgent.match(/Android/i))
			return 'Android';
		if(navigator.userAgent.match(/iPhone/i)
		 || navigator.userAgent.match(/iPad/i)
		 || navigator.userAgent.match(/iPod/i))
			return 'IOS';
		if(navigator.userAgent.match(/Windows Phone/i))
			return 'Windows Phone';
		return 'other';
	}
}
