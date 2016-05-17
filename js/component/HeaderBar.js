/**
 * 
 */
function HeaderBar(){
	var that = this;
	
	var _ROLE = false;
	var _InputFocus = false;
	
	var _headerHtml = [
		'<header class="common-header">',
	    '</header>'
	].join('');
	
	var _headerItemHtml = [
		'<div class="{0} {1}">{2}</div>'
	].join('');

	var _headerItems = {
		'logo':{id:'logo',text:'算命-公司行號',icon:'',className:'left-button logo'},
		'menu':{id:'menu',text:'',icon:'flaticon-interface-1',className:'right-button'}
	};

	var _menuBox;
	
	
	var _customHeaderItemAuth = ['logout','logo','contact','menu'];
	var _agentHeaderItemAuth = ['logout','logo','contact','menu'];
	var _defultHeaderItemAuth = ['login','logo','contact','menu'];
	
	
	var _event = {};
	var _$body;
	var _$scrollWrap;
	var _delay = 200;

	that.bind = _bind;
	that.unbind = _unbind;
	that.scrollHide = _scrollHide;
	that.scrollHide = _scrollHide;
	that.hide = _hide;
	that.show = _show;
	that.onHide = false;
	that.onShow = false;
	that.defHeight = 0;
	
	function _init(){
		_$body = $('body');
		if(_$body.find('header[class="common-header"]').length>0){
			return;
		}
		_$body.append(_headerHtml);
		that.$el = _$body.find('header[class="common-header"]');
		that.defHeight = that.$el.height();
		
		//绑定资料异动
		manage.getStoreManage().bind(StoreDataName.UserInfo,function(store){
			if(store.data){
				_ROLE = store.data.role;
			}else{
				_ROLE = false;
			}
			_renderItem();
			that.defHeight = that.$el.height();
		});
		//绑定资料异动
		manage.getStoreManage().bind(StoreDataName.InputFocus,function(store){
			if(store.data){
				_InputFocus = store.data;
			}else{
				_InputFocus = store.data;
			}
		});
		
		_menuBox = new MenuBox();
		
	}
	
	

	//产生header item
	function _renderItem(){
		that.$el.empty();
		var itemArray = new Array();
		var itemAuth = _getItemAuth();
		var obj,$item;
		for(var i = 0,l = itemAuth.length;i<l;i++){
			obj = _headerItems[itemAuth[i]];
			if(obj){
				$item = $(String.format(_headerItemHtml,obj.className,obj.icon,obj.text));
				$item.bind('click',{itemObj:obj},_getClickEvent);
				itemArray.push($item);
			}
		}
		that.$el.append(itemArray);
		itemArray = itemAuth = obj = $item = null;
	}
	
	//取得item显示权限
	function _getItemAuth(){
		if(_ROLE=='MONEY_CUSTOMER')
			return _customHeaderItemAuth;
		if(_ROLE=='AGENT')
			return _agentHeaderItemAuth;
		return _defultHeaderItemAuth;
	}
	
	//设定按钮事件
	function _getClickEvent(e){
		switch (e.data.itemObj.id){
			case 'login':
				manage.getDialog().open('login',['index']);
				break;
			case 'logout':
				manage.getDialog().open('logout');
				break;
			case 'register':
				manage.getDialog().open('register');
				break;
			case 'logo':
				manage.loadView('index');
				break;
			case 'contact':
				break;
			case 'menu':
				if(_menuBox.isShow()){
					_menuBox.hide();
				}else{
					_menuBox.show();
				}
				break;
			default:
		}
	}
	
	/**
	 * 滑动时隐藏
	 * @param {Boolean} hide 
	 * 
	 */
	function _scrollHide(hide){
		_$scrollWrap = _$body.find('>.main-wrap');
		if(hide){
			_$body.bind('scroll',_onScroll);
		}else{
			_$body.unbind('scroll',_onScroll);
		}
	}
	
	/**
	 * 计算往上滑动显示
	 */
	var _currentTop = 0;
	function _onScroll(e){
		if(_InputFocus)return;
		delayAction('headerOnScorll',_delay,function(){
			if(_$body.find('>.main-wrap').position().top<=0){
				_show();
				return;
			}
			if(_$body.find('>.main-wrap').position().top>_currentTop){
				_show();
			}else{
				_hide();
			}
			_currentTop = _$body.find('>.main-wrap').position().top;
		});
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
			_event[event] = new Array();
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
		if(!array)return;
		
		for(var i = 0,l=array.length;i<l;i++){
			array[i]();
		}
	}
	
	/**
	 * 隐藏
	 */
	function _hide(){
		that.$el.css('top',-that.defHeight);
		_trigger('hide');
	}
	
	/**
	 * 显示
	 */
	function _show(){
		that.$el.css('top',0);
		_trigger('show');
	}
	
	_init();
}