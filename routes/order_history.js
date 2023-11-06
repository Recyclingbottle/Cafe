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
		console.error('order_histoty.js MySQL 연결 오류:', err);
	} else {
		console.log('order_histoty.js MySQL 연결 성공');
	}
});

// 주문 요약 정보 조회 API
router.get('/orderSummaries', (req, res) => {
	const sql = `
        SELECT
            o.order_no,
            o.orderer,
            o.order_date,
            o.total_amount,
            o.order_status,
            GROUP_CONCAT(m.name) as menu_names,
            COUNT(od.menu_no) as menu_count
        FROM
            orders o
        JOIN
            order_details od ON o.order_no = od.order_no
        JOIN
            menu m ON m.no = od.menu_no
        GROUP BY o.order_no;
    `;

	connection.query(sql, (err, results) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		const summaries = results.map((result) => {
			const primaryMenu = result.menu_names.split(',')[0];
			const menuText =
				result.menu_count > 1 ? `${primaryMenu} 외 ${result.menu_count - 1}` : primaryMenu;
			return {
				orderNo: result.order_no,
				productName: menuText,
				totalAmount: result.total_amount,
				orderer: result.orderer,
				orderDate: result.order_date,
				orderStatus: result.order_status,
			};
		});

		res.json(summaries);
	});
});

// 특정 주문의 상세 정보 조회 API
router.get('/orderDetails/:orderNo', (req, res) => {
	const orderNo = req.params.orderNo;
	const sql = `
				SELECT 
			o.order_no,
			o.orderer,
			o.order_date,
			o.total_amount,
			o.order_status,
			m.no as menu_no,
			m.name as menu_name,
			m.price as menu_price,
			od.quantity
		FROM orders o
		JOIN order_details od ON o.order_no = od.order_no
		JOIN menu m ON m.no = od.menu_no
		WHERE o.order_no = ?;
    `;

	connection.query(sql, [orderNo], (err, results) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		// 주문 상세 정보를 클라이언트에게 반환
		res.json(results);
	});
});

// 주문 완료 엔드포인트
router.post('/complete/:orderNo', (req, res) => {
    const orderNo = req.params.orderNo;
    
    // 주문 상태를 "completed"로 업데이트하는 SQL 쿼리
    const updateOrderStatusSql = `
        UPDATE orders
        SET order_status = 'completed'
        WHERE order_no = ?;
    `;

    connection.query(updateOrderStatusSql, [orderNo], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.affectedRows === 1) {
            res.json({ success: true, message: '주문이 완료되었습니다.' });
        } else {
            res.json({ success: false, message: '주문 상태를 업데이트할 수 없습니다.' });
        }
    });
});

// 주문 취소 엔드포인트
router.post('/cancel/:orderNo', (req, res) => {
    const orderNo = req.params.orderNo;

    // 주문 상태를 "cancelled"로 업데이트하는 SQL 쿼리
    const updateOrderStatusSql = `
        UPDATE orders
        SET order_status = 'cancelled'
        WHERE order_no = ?;
    `;

    connection.query(updateOrderStatusSql, [orderNo], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.affectedRows === 1) {
            res.json({ success: true, message: '주문이 취소되었습니다.' });
        } else {
            res.json({ success: false, message: '주문 상태를 업데이트할 수 없습니다.' });
        }
    });
});

// 주문 내역 페이지 렌더링
router.get('/', (req, res) => {
	res.render('order_history'); // order_history.ejs 파일을 렌더링하면서 JavaScript를 통해 주문 요약 API를 호출하여 데이터를 가져와 화면에 보여줍니다.
});

module.exports = router;