* WebManage.js

    整個架構的核心，因為是SPA架構，所以只會在index.html實例化一次。
    
    * 動態頁面的載入。
    
    * 所有ajax的請求。
    
    * 提供所有共同service(後端的訪問、資料同步中心)。
    
    * 頁面訪問權限。
    
    * 其他方法提供和控制。
    
* JsThread.js

    為了能在處理大量運算時，CSS動畫不會停頓，而將Worker打包起來，易於使用。
    
	```js
	new JsThread({
		arguments:[全域參數],
		run:function(){執行...},
		callback:function(){返回...}
	});
	```
* services/StoreService.js

    因為SPA架構下，為了能實現資料更新後，同步更新所有View，看過redux的概念，但是又無法將整個開發環境帶進團隊，只好自己設計類似的架構。
    
    ```js
    	var storeService = new StoreService();
	var input = document.getElementById('input');
    	var content = document.getElementById('content');
    	input.onkeyup = function(){
		storeService.set('input',this.value);
    	};
    	storeService.bind('input',function(store){
		content.innerHTML = store.data;
    	});
    ```
