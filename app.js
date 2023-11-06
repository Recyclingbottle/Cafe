const express = require('express');
const bodyParser = require('body-parser'); // body-parser 미들웨어 추가
const app = express();

// EJS 템플릿 엔진 설정
app.set('view engine', 'ejs');

// 템플릿 파일이 저장된 디렉토리 설정 (옵션)
app.set('views', __dirname + '/views');

// Express 애플리케이션 설정 및 라우트 등 추가 코드

const port = process.env.PORT || 3000;



// 미들웨어 설정
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 라우트 설정
const mainRoutes = require('./routes/main');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');
const orderHistoryRoutes = require('./routes/order_history');

app.use('/', mainRoutes);
app.use('/menu', menuRoutes);
app.use('/order', orderRoutes);
app.use('/order/history', orderHistoryRoutes); 

// 서버 시작
app.listen(port, () => {
  console.log(`서버 시작 포트 : ${port}`);
});
