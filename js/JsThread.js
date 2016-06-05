

/**
 * Created by Clare on 2016/6/5.
 * @param {Object} conf {arguments:[],run:false,callback:false}
 *
 */
function JsThread(conf){
    var that = this;
    var _arguments = conf.arguments||[];
    var _run = conf.run||false;
    var _callback = conf.callback||false;
    var _worker = false;

    that.start = _start;
    that.stop = _stop;

    //執行
    function _start(){
        if(!_run)return;
        _worker = _createWorker();

    }
    //停止
    function _stop(){
        if(_worker){
            _worker.terminate();
            _worker = null;
        }
        if(_callback)_callback({status:'stop',data:false});
    }
    //回傳
    function _onMessage(e){
        _worker = null;
        if(_callback)_callback({status:'finish',data:e.data});
    }
    //建立worker
    function _createWorker(){
        if(!_run)return;

        var script = document.createElement('script');
        script.type = 'javascript/worker';
        script.innerHTML ='postMessage(('+_run.toString()+').apply(null,'+JSON.stringify(_arguments)+'));';
        var blob = new Blob([script.textContent], { type: "text/javascript" });
        var w = new Worker(window.URL.createObjectURL(blob));
        w.onmessage =_onMessage;
        return w;
    }
}