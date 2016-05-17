/**
 * 
 */

function ComboBox(conf){
	var that = this;
	var _conf = {
		appendId:'',
		cls:'',
		valueName:'',
		displayName:'',
		datas:'',
		onChange:false
	};
	$.extend(_conf,conf);
	
	var _optionHtml = '<option value="{0}">{1}</option>';
	var _$el;
	var _items;
	var _selRecord;
	var _records;
	
	
	that.getJq = function(){
		return _$el;
	};
	
	that.getEl = function(){
		return _$el.get(0);
	};
	
	that.getValue = function(){
		return _$el.val();
	};
	
	that.setValue = function(value){
		_$el.val(value);
		_$el.trigger('change');
	};
	
	that.disableAllItem = function(){
		for(var i = 0;i<_items.length;i++){
			$(_items[i]).attr('disabled',true);
		}
	};
	
	that.enableAllItem = function(){
		for(var i = 0;i<_items.length;i++){
			$(_items[i]).attr('disabled',false);
		}
	};
	
	that.disableItemByValue = function(value){
		for(var i = 0;i<_items.length;i++){
			if(_items[i].value==value){
				$(_items[i]).attr('disabled',true);
				if(_$el.val()==value){
					_$el.val('');
				}
				return;
			}
		}
	};
	
	that.enableItemByValue = function(value){
		for(var i = 0;i<_items.length;i++){
			if(_items[i].value==value){
				$(_items[i]).attr('disabled',false);
				return;
			}
		}
	};
	
	that.loadData = function(datas){
		_conf.datas = datas;
		_$el.html(_createOptHtml());
		_items = _$el.children();
	};
	
	that.getRecord = function(){
		if(_records){
			return _records[that.getValue()];
		}else{
			return null;
		}
	};
	
	function _init(){
		if($('#'+_conf.appendId).length>0){
			_$el = $('#'+_conf.appendId);
			_$el.change(_onChange);
			that.$el = _$el;
			
			that.loadData(_conf.datas);
			_items = _$el.children();
		}else{
			alert(String.format('{0} element not exit',_conf.appendId));
		}
	}
	
	function _onChange(e){
		if(_conf.onChange){
			_conf.onChange(e);
		}
	}
	
	function _createOptHtml(){
		_records = {};
		var ops = '';
		for(var i = 0 ;i<_conf.datas.length;i++){
			var v = _conf.datas[i][_conf.valueName];
			_records[_conf.datas[i][_conf.valueName]] = _conf.datas[i];
			ops+=String.format(_optionHtml,_conf.datas[i][_conf.valueName],_conf.datas[i][_conf.displayName]);
		}
		return ops;
	}
	_init();
}