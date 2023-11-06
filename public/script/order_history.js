document.addEventListener('DOMContentLoaded', function () {
	fetch('/order/history/orderSummaries')
		.then((response) => response.json())
		.then((orders) => {
			const ordersElement = document.getElementById('orders');

			orders.forEach((order, index) => {
				const row = `
                            <tr data-order-no="${order.orderNo}" onclick="showOrderDetail(${
					order.orderNo
				})">
                                <td>${index + 1}</td>
                                <td>${order.orderNo}</td>
                                <td>${order.productName}</td>
                                <td>${order.totalAmount}</td>
                                <td>${order.orderer}</td>
                                <td>${formatDate(order.orderDate)}</td>
                                <td>${order.orderStatus}</td>
                            </tr>
                        `;
				ordersElement.insertAdjacentHTML('beforeend', row);
			});
		});
});

function showOrderDetail(orderNo) {
	fetch(`/order/history/orderDetails/${orderNo}`)
		.then((response) => response.json())
		.then((details) => {
			let detailHTML = '';
			let totalAmount = 0;

			details.forEach((detail) => {
				totalAmount += detail.menu_price * detail.quantity;

				if (!detailHTML) {
					detailHTML += `
                    <h2>주문 상세 정보</h2>
                    <p><strong>주문번호:</strong> ${detail.order_no} | 
                    <strong>주문자:</strong> ${detail.orderer} | 
                    <strong>주문일자:</strong> ${formatDate(detail.order_date)} | 
                    <strong>주문상태:</strong> ${detail.order_status} | 
                    <strong>총 주문 금액:</strong> ${detail.total_amount}</p>
                `;

					detailHTML += `
                    <table>
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>상품명</th>
                                <th>수량</th>
                                <th>금액</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
				}

				detailHTML += `
                <tr>
                    <td>${detail.menu_no}</td>
                    <td>${detail.menu_name}</td>
                    <td>${detail.quantity}</td>
                    <td>${detail.menu_price * detail.quantity}</td>
                </tr>
            `;
			});

			detailHTML += `
                </tbody>
            </table>
        `;

			detailHTML += `
            <p><strong>총합:</strong> ${totalAmount}</p>
            <button id="paymentButton">결제완료</button>
            <button id="cancelButton">주문취소</button>
        `;

			document.getElementById('orderDetail').innerHTML = detailHTML;

			const paymentButton = document.getElementById('paymentButton');
			const cancelButton = document.getElementById('cancelButton');

			paymentButton.addEventListener('click', () => {
				if (details[0].order_status === 'ordered') {
					fetch(`/order/history/complete/${orderNo}`, {
						method: 'POST',
					})
						.then((response) => response.json())
						.then((result) => {
							if (result.success) {
								alert('주문이 완료되었습니다.');
								location.reload();
							} else {
								alert('주문이 이미 완료되었거나 취소된 주문입니다.');
							}
						})
						.catch((error) => {
							console.error('Error:', error);
						});
				} else {
					alert('이미 완료된 주문이거나 취소된 주문입니다.');
				}
			});

			cancelButton.addEventListener('click', () => {
				if (details[0].order_status === 'ordered') {
					fetch(`/order/history/cancel/${orderNo}`, {
						method: 'POST',
					})
						.then((response) => response.json())
						.then((result) => {
							if (result.success) {
								alert('주문이 취소되었습니다.');
								location.reload();
							} else {
								alert('주문이 이미 완료되었거나 취소된 주문입니다.');
							}
						})
						.catch((error) => {
							console.error('Error:', error);
						});
				} else {
					alert('이미 완료된 주문이거나 취소된 주문입니다.');
				}
			});
		});
}

function formatDate(isoString) {
	const date = new Date(isoString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}