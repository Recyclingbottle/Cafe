const express = require('express');
const router = express.Router();

// 메인 페이지 렌더링
router.get('/', (req, res) => {
    res.render('main'); // main.ejs 파일을 렌더링
});

// 다른 메인 페이지 관련 라우트 또는 미들웨어 추가...

module.exports = router;
