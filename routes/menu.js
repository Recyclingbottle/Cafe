const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// MySQL 연결 설정
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'asdf1234!',
    database: 'cafe',
});

// MySQL 연결
connection.connect((err) => {
    if (err) {
        console.error('menu.js MySQL 연결 오류:', err);
    } else {
        console.log('menu.js MySQL 연결 성공');
    }
});

// 메뉴 관리 페이지 렌더링
router.get('/', (req, res) => {
    // 데이터베이스에서 모든 상품 목록 조회
    connection.query('SELECT * FROM menu', (err, rows) => {
        if (err) {
            console.error('상품 조회 오류:', err);
            res.status(500).send('상품 조회 오류');
        } else {
            // menu.ejs 파일을 렌더링하면서 상품 목록 데이터 전달
            res.render('menu', { products: rows });
        }
    });
});

// 상품 등록 POST 요청 처리
router.post('/add', (req, res) => {
    const { name, ice_or_hot, category, price, created_by } = req.body;

    // 상품 정보를 데이터베이스에 추가
    connection.query(
        'INSERT INTO menu (name, ice_or_hot, category, price, created_by, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [name, ice_or_hot, category, price, created_by],
        (err) => {
            if (err) {
                console.error('상품 등록 오류:', err);
                res.status(500).send('상품 등록 오류');
            } else {
                // 등록이 성공하면 메뉴 관리 페이지로 리다이렉트
                res.redirect('/menu');
            }
        }
    );
});

// 상품 수정 페이지를 JSON으로 응답
router.get('/edit/:id', (req, res) => {
    const productId = req.params.id;

    // 데이터베이스에서 해당 상품 정보 조회
    connection.query('SELECT * FROM menu WHERE no = ?', [productId], (err, rows) => {
        if (err) {
            console.error('상품 조회 오류:', err);
            res.status(500).json({ error: '상품 조회 오류' });
        } else {
            // 상품 정보를 JSON으로 응답
            res.json({ product: rows[0] });
        }
    });
});

// 상품 수정 PUT 요청 처리
router.put('/edit/:id', (req, res) => {
    const productId = req.params.id;
    const { name, ice_or_hot, category, price, created_by } = req.body;

    // 상품 정보를 데이터베이스에서 업데이트
    connection.query(
        'UPDATE menu SET name=?, ice_or_hot=?, category=?, price=?, created_by=? WHERE no = ?',
        [name, ice_or_hot, category, price, created_by, productId],
        (err) => {
            if (err) {
                console.error('상품 수정 오류:', err);
                res.status(500).send('상품 수정 오류');
            } else {
                // 수정이 성공하면 상태 코드 204(No Content)로 응답
                res.status(204).send();
            }
        }
    );
});

// 상품 삭제 DELETE 요청 처리
router.delete('/delete/:id', (req, res) => {
    const productId = req.params.id;

    // 상품 정보를 데이터베이스에서 삭제
    connection.query('DELETE FROM menu WHERE no = ?', [productId], (err) => {
        if (err) {
            console.error('상품 삭제 오류:', err);
            res.status(500).send('상품 삭제 오류');
        } else {
            // 삭제가 성공하면 상태 코드 204(No Content)로 응답
            res.status(204).send();
        }
    });
});

// 검색 POST 요청 처리
router.post('/search', (req, res) => {
    const { name, created_by, created_at } = req.body;

    let query = 'SELECT * FROM menu WHERE 1'; // 기본 쿼리

    // 검색어가 있을 경우 조건을 추가
    if (name) {
        query += ` AND name LIKE '%${name}%'`;
    }
    if (created_by) {
        query += ` AND created_by LIKE '%${created_by}%'`;
    }
    if (created_at) {
        query += ` AND DATE(created_at) = '${created_at}'`;
    }

    // 데이터베이스에서 검색
    connection.query(query, (err, rows) => {
        if (err) {
            console.error('검색 오류:', err);
            res.status(500).send('검색 오류');
        } else {
            // 검색 결과를 화면에 표시
            res.render('menu', { products: rows });
        }
    });
});

// MySQL 연결 종료
process.on('SIGINT', () => {
    connection.end();
    process.exit();
});

module.exports = router;
