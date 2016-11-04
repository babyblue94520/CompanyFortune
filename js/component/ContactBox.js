/**
 * 联系我们
 */
function ContactBox(){
	var that = this;
	
	var _$itembox = false;
	var _showClassName = 'show-contact';
	
	var _menuHtml = [
	    '<div class="common-contact-screen"></div>',
	    '<div class="common-contact">',
	    '	<nav class="menu-side">{0}</nav>',
		'</div>'
	].join('');
	
	var _itemHtml = [
		'<div class="item">',
		'	<a class="icon {0}" href="{1}"></a>',
		'	<a class="text" href="{1}">{2}</a>',
		'</div>'
	].join('');
	
	var _imageHtml = '<img src="{0}" style="width:90%;" />';
	
	
	//按钮显示内容
	var _menuItems = {
		'live800':{id:'live800',text:'在线客服',icon:'flaticon-microphone',href:'',handler:false},
		'QQ':{id:'QQ',text:'QQ客服',icon:'flaticon-social',href:'',handler:false},
		'makeCall':{id:'makeCall',text:'电话回播',icon:'flaticon-telephone',href:'javascript:void(0)',handler:_makeCall},
		'email':{id:'email',text:'客服邮箱',icon:'flaticon-web',href:'mailto:',handler:false}
	};
	
	//选单
	var _$items = {};

	var _event = {};
	var _$body;
	
	that.bind = _bind;
	that.unbind = _unbind;
	that.hide = _hide;
	that.show = _show;
	that.isShow = function(){
		return $('body').hasClass(_showClassName);
	};

	
	_init();
	
	/**
	 * 初始化
	 */
	function _init(){
		_$body = $('body');
		if(_$body.find('.common-contact').length>0){
			return;
		}
		_$body.append(_menuHtml);
		that.$el = _$body.find('.common-contact');
		_$itembox = that.$el.find('.menu-side');
		
		_refresh();
		
		_$items['QQ'].find('a').attr('href','mqq://im/chat?chat_type=wpa&uin='+Config.QQ);
		_$items['QQ'].find('.text').html('QQ客服<br/>'+Config.QQ);
		
		_$items['email'].find('a').attr('href','mailto:'+Config.EMAIL);
		_$items['email'].find('.text').html('客服邮箱<br/>'+Config.EMAIL);
		
		//绑定资料异动
		webManage.getStoreService().bind(StoreDataName.LIVE800INFO,function(store){
			_$items['live800'].find('a').attr('href',Config.LIVE800+store.data);
		});
	}
	
	/**
	 * 刷新
	 */
	function _refresh(){
		_renderItems();
	}
	
	/**
	 * 刷新选项
	 */
	function _renderItems(){
		_$itembox.empty();
		var array = [],obj;
		for(var i in _menuItems){
			obj = _menuItems[i];
			if(obj){
				_$items[obj.id] = $(String.format(_itemHtml,obj.icon,obj.href,obj.text));
				if(obj.handler){
					_$items[obj.id].click(obj.handler);
				}
				if(obj.image){
					$('#common-contact-btn').removeClass('on');
					$('#common-contact-btn').removeClass('flaticon-shapes');
					$('#common-contact-btn').addClass('flaticon-microphone');
					_$items[obj.id].append(String.format(_imageHtml,obj.image));
				}
				array.push(_$items[obj.id]);
			}
		}
		_$itembox.append(array);
		arr = obj = $item = null;
	}


	/**
	 * 电话回播
	 */
	function _makeCall(){
		setTimeout(function(){
			webManage.getDialog().open('makeCall');
		},0);
		setTimeout(_hide,0);
	}
	
	/**
	 * 绑定事件
	 * @param {String} event 名称
	 * @param {Function} 处理方法
	 */
	function _bind(event,handler){
		if(typeof event !== 'string'){
			alert('event 参数格式错误！');
			return;
		}
		if(typeof handler !== 'function'){
			alert('handler 参数格式错误！');
			return;
		}
		
		if(!_event[event]){
			_event[event] = [];
		}
		_event[event].push(handler);
	}

	/**
	 * 解绑定事件
	 * @param {String} event 名称
	 * @param {Function} 处理方法
	 */
	function _unbind(event,handler){
		if(typeof event !== 'string'){
			alert('event 参数格式错误！');
			return;
		}
		if(typeof handler !== 'function'){
			alert('handler 参数格式错误！');
			return;
		}
		
		if(_event[event]){
			_event[event] = null;
		}
	}
	
	/**
	 * 绑定事件
	 * @param {String} event 名称
	 */
	function _trigger(event){
		if(typeof event !== 'string'){
			alert('event 参数格式错误！');
			return;
		}
		var array = _event[event];
		console.log(_event,event,array)
		if(!array)return;
		
		for(var i = 0,l=array.length;i<l;i++){
			array[i]();
		}
	}
	
	/**
	 * 隐藏
	 */
	function _hide(){
		if($('body').hasClass(_showClassName)){
			$('body').removeClass(_showClassName);
		}
		_trigger('hide');
	}
	
	/**
	 * 显示
	 */
	function _show(){
		if(!$('body').hasClass(_showClassName)){
			$('body').addClass(_showClassName);
		}
		_trigger('show');
	}
	
}