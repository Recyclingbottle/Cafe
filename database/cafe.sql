-- 테이블 제거 (이미 테이블이 존재한다면)
DROP TABLE IF EXISTS order_details;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu;

-- 테이블 생성 (UTF-8로 설정)
CREATE TABLE menu (
  no INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  ice_or_hot ENUM('ice', 'hot') NOT NULL,
  category ENUM('아메리카노', '카페라떼', '에이드', '스무디', '프라푸치노') NOT NULL,
  price INT NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 예시 데이터 삽입 (한국어로 변경)
INSERT INTO menu (name, ice_or_hot, category, price, created_by, created_at)
VALUES
  ('아메리카노', 'ice', '아메리카노', 3000, '홍길동', NOW()),
  ('카페라떼', 'hot', '카페라떼', 3500, '이몽룡', NOW()),
  ('레몬 에이드', 'ice', '에이드', 4000, '성춘향', NOW()),
  ('딸기 스무디', 'ice', '스무디', 4500, '변사또', NOW()),
  ('카라멜 프라푸치노', 'ice', '프라푸치노', 5000, '허준', NOW()),
  ('카페 아메리카노', 'hot', '아메리카노', 3500, '이순신', NOW()),
  ('카페 모카', 'hot', '카페라떼', 4000, '김유신', NOW()),
  ('라즈베리 에이드', 'ice', '에이드', 4500, '신사임당', NOW()),
  ('망고 스무디', 'ice', '스무디', 5000, '강감찬', NOW());
  
INSERT INTO menu (name, ice_or_hot, category, price, created_by, created_at)
VALUES
  ('아이스 그린 티 라떼', 'ice', '카페라떼', 4500, '홍길동', '2023-09-07 00:00:00');


-- 전체 데이터 조회
SELECT * FROM menu;

-- oders 테이블이 있다면 제거 
DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
    order_no INT AUTO_INCREMENT PRIMARY KEY,
    orderer VARCHAR(255) NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount INT NOT NULL,
    order_status ENUM('ordered', 'cancelled', 'completed') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- orders 테이블 예시 데이터 삽입
INSERT INTO orders (orderer, total_amount, order_status)
VALUES
  ('박보검', 7500, 'ordered'),
  ('이민호', 8500, 'ordered'),
  ('송중기', 4000, 'cancelled'),
  ('전지현', 5000, 'completed');

-- order_details 테이블 있다면 제거 
DROP TABLE IF EXISTS order_details;
-- order_details 테이블 생성
CREATE TABLE order_details (
    no INT AUTO_INCREMENT PRIMARY KEY,
    order_no INT,
    menu_no INT,
    quantity INT NOT NULL,
    FOREIGN KEY (order_no) REFERENCES orders(order_no),
    FOREIGN KEY (menu_no) REFERENCES menu(no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- order_details 테이블 예시 데이터 삽입
INSERT INTO order_details (order_no, menu_no, quantity)
VALUES
  (1, 1, 1),
  (1, 7, 1);
INSERT INTO order_details (order_no, menu_no, quantity)
VALUES
  (2, 3, 1),
  (2, 9, 1);
INSERT INTO order_details (order_no, menu_no, quantity)
VALUES
  (3, 1, 1);
INSERT INTO order_details (order_no, menu_no, quantity)
VALUES
  (4, 5, 1);
SELECT * FROM orders;
SELECT * FROM order_details;

SELECT 
    o.order_no,
    o.orderer,
    o.order_date,
    o.total_amount,
    o.order_status,
    od.menu_no,
    od.quantity
FROM
    orders o
JOIN 
    order_details od ON o.order_no = od.order_no;
