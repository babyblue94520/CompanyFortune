/**
 * 资料管理
 * 
 */
function StoreService(){
	var that = this;
	//资料储存体
	var _store = {};
	//处理集合  _handler[name] = Array
	var _handler = {};
	//方法处理计时器
	var _triggerTimer = {};
	//处理状态
	var _triggerState = {};
	//状态
	that.state = {
		UPDATE:'UPDATE',
		DELETE:'DELETE'
	};
	
	that.set = _set;
	that.get = _get;
	that.remove = _remove;
	that.bind = _bind;
	that.unbind = _unbind;
	
	that.getHandlerCount = function(){
		var c = 0 ;
		for(var h in _handler){
			c+=_handler[h].length;
			console.log(h,_handler[h].length,_handler[h]);
		}
		return c;
	}
	
	/**
	 * 绑定资料
	 * @param {String} name store名称
	 * @param {Function} handler 传入 {state:UPDATE/DELETE,data:data}
	 * @param {Boolean} autorun 绑定时，是否执行
	 * @return {Function} handler 回传方法
	 */
	function _bind(name,handler,run){
		if(typeof name !== 'string'){
//			alert('name 传入资料格式错误，必须为String！');
			console.log('bind name 传入资料格式错误，必须为String！',name);
			return;
		}
		if(typeof handler !== 'function'){
//			alert('handler 传入资料格式错误，必须为Function！');
			console.log('bind handler 传入资料格式错误，必须为Function！',handler);
			return;
		}
		
		if(!_handler[name])_handler[name] = [];
		
		_handler[name].push(handler);
		
		//绑定时，是否执行
		if((run==undefined)||run){
			handler.apply(null,[{state:that.state.UPDATE,data:_store[name]}]);
		}
		return handler;
	}
	
	/**
	 * 移除资料绑定
	 * 
	 * @param {String} name store名称
	 * @param {Function} handler 
	 */
	function _unbind(name,handler){
		if(typeof name !== 'string'){
			alert('unbind name 传入资料格式错误，必须为String！')
		}
		if(typeof handler !== 'function'){
			alert('unbind handler 传入资料格式错误，必须为Function！')
		}
		var handlerArray = _handler[name];
		if(!handlerArray)return;
		
		//中断
//		_stopTrigger(name);
		handlerArray[handlerArray.indexOf(handler)] = false;
		handlerArray = null;
		//重新开始
//		_trigger.apply(that,[_triggerState[name],name]);
	}
	
	
	/**
	 * 写入资料
	 * @param {String} name 资料名称
	 * @param {Object} data 资料
	 * 
	 */
	function _set(name,data){
		console.log(name,data)
		if(typeof name !== 'string'){
			alert('set name 传入资料格式错误，必须为String！')
		}
		if(data){
			if(_store[name]===data)return;
			_store[name] = data;
			_trigger.apply(that,[that.state.UPDATE,name]);
		}else if(_store[name]&&!data){
			_remove(name);
		}else{
			_trigger.apply(that,[that.state.UPDATE,name]);
		}
	}

	/**
	 * 取得资料
	 * 注意资料的更新
	 * @param {String} name 资料名称
	 * @return 
	 */
	function _get(name){
		return _store[name];
	}
	
	
	/**
	 * 移除资料
	 * @param {String} name 资料名称
	 */
	function _remove(name){
		if(typeof name !== 'string'){
			alert('remove name 传入资料格式错误，必须为String！')
		}
		delete _store[name];
		_trigger.apply(that,[that.state.DELETE,name]);
	}
	
	/**
	 * 
	 * @param {String} state 状态
	 * @param {String} name 资料名称
	 */
	function _trigger(state,name){
		if(!_handler[name])return;

		//中断
		_stopTrigger(name);
		//记录状态
		_triggerState[name] = state;
		
		var store = {
			state:state,
			data:_store[name]
		};

		var i = 0,l = _handler[name].length;
		
		_triggerTimer[name] = setTimeout(_triggerTimeout,0);
		
		//延迟执行，为了中断处理
		function _triggerTimeout(){
			if(i>=l){
				_triggerTimer[name] = false;
				//清除false
				while(_handler[name].indexOf(false)!=-1){
					_handler[name].splice(_handler[name].indexOf(false),1);
				}
			}else if(_handler[name][i]){
				_handler[name][i++].apply(null,[store]);
				_triggerTimer[name] = setTimeout(_triggerTimeout,0);
			}else{
				i++;
				_triggerTimer[name] = setTimeout(_triggerTimeout,0);
			}
		}
	}
	
	/**
	 * 终止处理
	 */
	function _stopTrigger(name){
		if(_triggerTimer[name]){
			clearTimeout(_triggerTimer[name]);
			_triggerTimer[name] = false;
		}
	}
}
