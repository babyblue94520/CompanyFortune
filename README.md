# CompanyFortune [新 your-name](https://github.com/babyblue94520/your-name)
## 算命
### 網址：https://babyblue94520.github.io/your-name/dist/
#### 前言

    因為要成公司，需要算一個運勢不錯的公司名稱，透過算命師得到名稱組合的公式，如果靠人工的方式很難找到一個運勢好又喜歡的名稱，於是開發這個系統來幫助自己算公司名稱~~
    
#### 功能以下：

1. #### 首頁：

  就說明一下。
  
2. #### 算-公司行號：

  * 公司行號運勢：
  
    輸入公司名稱，運算公司的運勢。
  * 智慧算名：
    
    根據負責人的五行，尋找公司行號最好的組合。
   
  * 筆畫運勢：
    
    名稱的總筆畫代表的五行跟運勢表。
  
3. #### 算-個人名稱：

  等我哪天找算命師算名字的時候再補上這個功能。
  
#### 架構：

  整個架構是SPA的架構，指導入了JQuery跟MUI CSS framework，這個架構是我在前公司開發行動版網頁時，開發出來的，因為當時的團隊只會JQuery，需求又急又趕，只好用大家都會的技術一步一步建構這個架構。
  
#### 注：

1. 目前可以運算4百多萬組名稱，不過我也不知道怎樣呈現，所以暫時只呈現1千組，改天我想到，在寫個詭異的分頁好了。
2. 因為本身沒有租用雲端服務器，利用github架設靜態網頁，所以將資料轉成JS data Object，第一次載入會比較久。
