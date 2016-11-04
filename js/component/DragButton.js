/**
 * 
 */
function DragButton(id){
	var _el;
	var _isDrag = false;
	var _deviationX = 0;
	var _deviationY = 0;
	var _X = 0;
	var _Y = 0;
	var _minX = 0;
	var _maxX = 0;
	var _minY = 0;
	var _maxY = 0;
	var _defPadding = 5;
	
	function _init(){
		_el = document.querySelector('#'+id);
		_isDrag = false;
		_deviationX = 0;
		_deviationY = 0;
		_X = 0;
		_Y = 0;
		
		_minX = _defPadding;
		_maxX = window.innerWidth-_defPadding-_el.clientWidth;
		_minY = _defPadding;
		_maxY = window.innerHeight-_defPadding-_el.clientHeight;
		_el.style.left = _maxX+'px';
		_el.style.top = _maxY+'px';
		
		
		removeEventListener();
		if(_isMobile()){
			addTouchListener();
		}else{
			addMouseListener();
		}
	}
	
	function removeEventListener(){
		_el.removeEventListener('touchstart',_touchstart);
		_el.removeEventListener('touchend', _touchend);
		window.removeEventListener('touchmove', _touchmove);
		_el.removeEventListener('mousedown',_mousedown);
		_el.removeEventListener('mouseup', _mouseup);
		window.removeEventListener('mousemove', _mousemove);
		
	}
	
	function addTouchListener(){
		_el.addEventListener('touchstart',_touchstart);
		_el.addEventListener('touchend', _touchend);
		window.addEventListener('touchmove', _touchmove);
	}
	
	function addMouseListener(){
		_el.addEventListener('mousedown',_mousedown);
		window.addEventListener('mouseup', _mouseup);
		window.addEventListener('mousemove', _mousemove);
	}
	
	function _mousedown(e){
		_deviationX = e.clientX  - _el.offsetLeft;
		_deviationY = e.clientY - _el.offsetTop;
		_isDrag = true;
//		e.preventDefault();
	}
	
	function _mouseup(e){
		_isDrag = false;
//		e.preventDefault();
	}
	
	function _mousemove(e){
		if (!_isDrag) return;
		_X = e.clientX - _deviationX;
		_Y = e.clientY - _deviationY;
		

		if(_X<_minY){
				_el.style.left = _minX+'px';
			}else if(_X>_maxX){
				_el.style.left = _maxX+'px';
			}else{
				_el.style.left = _X+'px';
			}
			
			
			if(_Y<_minY){
				_el.style.top = _minY+'px';
			}else if(_Y>_maxY){
				_el.style.top = _maxY+'px';
			}else{
				_el.style.top = _Y+'px';
			}
			e.preventDefault();
		}
		
		function _touchstart(e){
			_deviationX = e.touches[0].clientX  - _el.offsetLeft;
			_deviationY = e.touches[0].clientY - _el.offsetTop;
			_isDrag = true;
//			e.preventDefault();
		}
		
		function _touchend(e){
			_isDrag = false;
//			e.preventDefault();
		}
		
		function _touchmove(e){
			if (!_isDrag) return;

			_X = e.touches[0].clientX - _deviationX;
			_Y = e.touches[0].clientY - _deviationY;

			if(_X<_minY){
				_el.style.left = _minX+'px';
			}else if(_X>_maxX){
				_el.style.left = _maxX+'px';
			}else{
				_el.style.left = _X+'px';
			}
			
			
			if(_Y<_minY){
				_el.style.top = _minY+'px';
			}else if(_Y>_maxY){
				_el.style.top = _maxY+'px';
			}else{
				_el.style.top = _Y+'px';
			}

			e.preventDefault();
		}
		
		function _isMobile(){
			return (/AppleWebKit.*Mobile/i.test(navigator.userAgent) 
				|| /Android/i.test(navigator.userAgent) 
				|| /BlackBerry/i.test(navigator.userAgent) 
				|| /IEMobile/i.test(navigator.userAgent) 
				|| (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent)));
		}
		
		window.addEventListener('resize',function(){
			delayAction('touch',300,_init);
		});
		
		_init();
	}