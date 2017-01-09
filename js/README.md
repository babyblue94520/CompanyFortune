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
	
* component/*.js
	
