介紹
===
這是一個幫助使用者學習背誦英文單字的網站，特點在於通過針對錯誤題目反覆複習、並且與他人對戰來強化弱點與增加趣味性。主要分成三個功能 : Words Review、Test、Battle。可至 https://kimery.store/user.html 體驗線上版本。

### Word Review
使用者可以選擇想要觀看的章節，按下search，可以顯示出該章節的所有單字，包錢中文註釋、詞性、例句、相似字。點選紅色愛心可以加入favorite，category選擇favorite則可以看到所有收藏單字。


### Test
使用者可以針對各個章節進行測驗。測驗類別有英翻中、中翻英、或是混合題兩種類別；可以選擇該章節所有單字或是隨機選擇20個單字。測驗模式給分標準:
若答案錯誤，單字會重新加入題目一次，玩家最多有三次機會反覆作答錯誤的題目。
第一次即答對 :得到該題100%分數，
第二次答對 :得到該題50%分數，
第三次即答對 :得到該題10%分數，
三次接答錯無法獲得該題分數。
(英翻中 :完整輸入其中一個中文意思即算正確)
使用者測驗結束之後使用者可以透過檢是作答紀錄來檢視自己的作答情況和反覆錯的單字。  
![test3](https://github.com/user-attachments/assets/881de3ca-c9bb-4566-966f-1716ed4c134d)



### Battle
這是一個模仿知名手機遊戲知識王的功能。可以選擇測驗的種類與章節，一旦有另一人選定相同的範圍即開始進入戰鬥。競技模式給分標準:
單字出自該章節全部的單字，中英字義以章節內容為主，個單字僅出題一次，
每題答對分數依據提交答案的時間遞減，越早提交答案分數越高；答錯則無法獲得該題分數。
(英翻中 :完整輸入其中一個中文意思即算正確)。透過這種分是增加趣味性。  

    
![battle (2)](https://github.com/user-attachments/assets/e9d46e45-91f3-4793-ad7c-700f1577baad)



使用技術
===
**Node.js** : 用於建置後端伺服器。   
**html、css、js** : 前端基礎架構。  
**Bootstrap** : 用於前端畫面優化。  
**AWS 相關服務** : EC2:部屬程式服務、管理AWS相關應用；DRS: 作為關聯式資料庫存放資料。    
**Nginx** : 用於流量分流、反向代理。    
**Docker** : 建立image上傳至dockerhub。    
**Github Action** : 在CI/CD層面建立github push之後，自動化建立、更新Dockerhub 上的image，並從ec2自動拉取image。  
**Google OAuth2.0** : 提供使用者google 帳號登入的便捷登入方式。  
**Socket** : 建立前端與後端伺服器之間的即時通訊，提供使用者在test與Battle中即時的互動與反饋。  
**JWT** : 使用輕便的JWT作為使用者的令牌，配合cookie的儲存，可以識別使用者的身分。  

安裝
===  
1. 複製至本地端<code>git clone https://github.com/chi-white/wordspicker.git</code>    
2. 移動至wordspicker內，把資料夾內所有host變數改為"http://localhost:3000"  
3. 安裝所有相依套件<code> npm install </code>  
4. 啟動路由<code>nodemon router.js</code>
5. 打開瀏覽器，訪問 http://localhost:3000

   ![image](https://github.com/user-attachments/assets/43fd902f-de45-4dd0-b44e-2e581c994cf3)


配置
===
詳見.env_example    

申請AWS RDS並將獲得的user name和密碼填入。
<code>
RDS_USER= AWS RDS user name
RDS_PASSWORD= AWS RDS password
</code>  

jwt 密鑰  
<code>JWT_SECRETKEY= jwt secret key</code>  

至Google Cloud Platform "API與服務" 申請 "憑證" 中的網頁應用程的用戶端ID，填入用戶端ID與密碼
<code>
GOOGLE_CLIENT_ID= google gcp authentication client id
GOOGLE_CLIENT_SECRET= google gcp authentication client secret
</code>  

檔案結構
===
**.github/workflows/aws.yaml** :github action 指令檔，負責上傳新版docker image以及在ec2拉新版code  
**database** : 負責連接RDS，.sql為建置sql的架構  
**router.js** : 管理所有api後端路由  
**Dockerfile** : 建立Docker image  
**Docker-compose.yaml** : 建立wordspicker前後端+nginx應用  
**.env** : 隱密性環境變數，請參考.env_example  
以下五個檔案，其中的view為bootstrap、js、css、html組成的靜態前端頁面；model直接與資料庫溝通；controller為前端與資料庫之間的邏輯操作  
**user** : 使用者登入頁面，googlepassport檔案為google Oauth2.0的權限驗證  
**main** : 登入之後的主頁面   
**practiceMode** : 管理Words Review頁面   
**testMode** : 管理test頁面  
**doublegame** : 管理Battle頁面  
**token** : 管理身分識別，權限驗證









