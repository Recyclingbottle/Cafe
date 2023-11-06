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
        console.error('order.js MySQL 연결 오류:', err);
    } else {
        console.log('order.js MySQL 연결 성공');
    }
});

// 주문 페이지 렌더링
router.get('/', (req, res) => {
    const query = "SELECT * FROM menu";
    
    connection.query(query, (err, result) => {
        if (err) throw err;
        
        // result를 order.ejs 파일에 메뉴 목록으로 전달
        res.render('order', { menu: result });
    });
});

// 주문 처리
router.post('/process', (req, res) => {
    const { orderer, items } = req.body; // items는 메뉴 번호와 수량의 배열 ex) [{menu_no: 1, quantity: 2}, {menu_no: 3, quantity: 1}]
    const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
	
    // orders 테이블에 주문 정보 저장
    const insertOrder = "INSERT INTO orders (orderer, total_amount, order_status) VALUES (?, ?, 'ordered')";
    
    connection.query(insertOrder, [orderer, totalAmount], (err, result) => {
        if (err) throw err;

        const orderId = result.insertId;

        // order_details 테이블에 주문 상세 정보 저장
        items.forEach(item => {
            const insertDetail = "INSERT INTO order_details (order_no, menu_no, quantity) VALUES (?, ?, ?)";
            
            connection.query(insertDetail, [orderId, item.menu_no, item.quantity], (err) => {
                if (err) throw err;
            });
        });

        res.json({ success: true, message: "주문이 성공적으로 처리되었습니다." });
    });
});

module.exports = router;
