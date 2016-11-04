/**
 * 使用 CSS Animation 设计的跑马灯
 */
function CSSMarquee(config){
	var that = this;
	var _config = {
		id:false,
		speed:60
	};
	
	$.extend(_config,config)
	var _$marquee = false;
	var _$content = false;
	
	that.start = _start;
	that.stop = _stop;
	
	function _init(){
		if(_$marquee)return;
			
		_$marquee = $('#'+_config.id);
		if(!_$marquee[0]){
			alert('Element 不存在！');
			return;
		}
		
		_$content = _$marquee.find('.marquee-content');
		if(_$marquee.hasClass('top')){
			var height = _$marquee.height()>_$content.height()?_$marquee.height():_$content.height();
			_$content.css('padding-top',_$marquee.height());
			_$content.css('animation-duration',((height*_config.speed)/1000)+'s');
		}else{
			var width = _$marquee.width()>_$content.width()?_$marquee.width():_$content.width();
			_$content.css('padding-left',_$marquee.width());
			_$content.css('animation-duration',((width*_config.speed)/1000)+'s');
		}
	}
	
	function _start(){
		_$marquee.removeClass('stop');
	}
	
	function _stop(){
		_$marquee.addClass('stop');
	}
	
	_init();
}