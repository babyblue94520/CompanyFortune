/**
 * App下，开起分享视窗
 */
function AppShare(){
	var that = this;
	var _$appShare = false;
	var _appUrl = 'devGsmcApp://';
	var _param = {
		Type:4,
		Title:'',
		ShareTo:'',
		Desc:'',
		SendUrl:'',
		ImageUrl:''
	};

	var _htmlTemplate = [
		'<div class="app-share">',
			'<div class="app-share-screen"></div>',
			'<div class="app-share-block">',
			'	<div class="app-share-header">Header</div>',
			'	<div class="app-share-content"></div>',
			'	<div class="app-share-footer">footer</div>',
			'</div>',
		'</div>'
	].join('');

	var _itemHtmlTemplate = [
		'<div class="item mui-col-xs32-4">',
			'	<img class="image" src="{0}" />',
			'	<div class="text">{1}</div>',
		'</div>'
	].join('');

	var _data = [
		{id:'wx_friend',name:'微信好友',image:'images/wechat/wx_logo.png'},
		{id:'wx_monments',name:'微信朋友圈',image:'images/wechat/wx_moments.png'},
		{id:'wx_collect',name:'微信搜藏',image:'images/wechat/wx_collect.png'}
	];

	var _itemToShareId = {
		wx_friend:'0',
		wx_monments:'0',
		wx_collect:'0'
	};

	that.setParam = _setParam;
	that.open = _open;
	that.close = _close;

	_init();

	/**
	 *
	 *  @private
	 */
	function _init(){
		if(_$appShare)return;
		_$appShare = $(_htmlTemplate);

		_createShareItem();
		$('body').append(_$appShare);
	}

	/**
	 *
	 * @param param
	 * @private
     */
	function _setParam(param){
		if(!typeof param ==='Object')return;
		$.extend(_param,param);
	}

	/**
	 *
	 * @private
     */
	function _open(){
		_$appShare.addClass('show');
	}

	/**
	 *
	 * @private
	 */
	function _close(){
		_$appShare.removeClass('show');
	}
	
	
	/**
	 * '
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
	 *
	 * @private
     */
	function _itemHandler(e){
		if(!_itemToShareId[e.data.id])return;
		_param['ShareTo'] = _itemToShareId[e.data.id];
//		window.location.assign(_getAppUrl(_appUrl,_param));
		window.open(_getAppUrl(_appUrl,_param));
	}

	/**
	 *
	 * @private
     */
	function _getAppUrl(url,data){
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