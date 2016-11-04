/**
 * loading 
 */

function Loader(conf){
	var _this = this;
	var _conf = {
		text:'加载中'
	};
	$.extend(_conf,conf);
	
	var _loadHtml = [
	'<div class="loader">',
	'	<div class="loader-block">',
	'		<div class="loading"></div>',
	'		<div class="text"></div>',
	'	</div>',
	'</div>'].join('');
	
	var _$loader = false;
	var _$text;
	var _openCount = 0;
	
	if(!_$loader){
		_$loader = $(_loadHtml);
		_$text = _$loader.find('.text');
		$('body').append(_$loader);
	}
	
	/**
	 * open loading
	 * 
	 */
	_this.open = function(msg,zIndex){
		if(zIndex){
			_$loader.css('z-index',zIndex);
		}
	    if(msg){
	    	_$text.html(msg);
	    }else{
	    	_$text.html(_conf.text);
	    }
	    _$loader.addClass('show');
	    $('body').addClass('loader-hidden');
	    _openCount++;
	};
	
	/**
	 * open close
	 */
	_this.close = function(){
		if(--_openCount!=0)return;
		_$loader.css('z-index','');
	    _$loader.removeClass('show');
	    $('body').removeClass('loader-hidden');
	};
	
}