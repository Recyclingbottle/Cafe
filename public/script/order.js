let cart = [];

function addToCart(no, name, price) {
	const existingItem = cart.find((item) => item.no === no);
	if (existingItem) {
		existingItem.quantity++;
	} else {
		cart.push({ no, name, price, quantity: 1 });
	}
	renderCart();
}

function renderCart() {
	const cartList = document.getElementById('cart-list');
	cartList.innerHTML = '';

	cart.forEach((item) => {
		const listItem = document.createElement('li');
		listItem.innerHTML = `
                    ${item.name} - ${item.price}원 x <span class="quantity">
                        <button onclick="decreaseQuantity('${item.no}')">-</button>
                        ${item.quantity}
                        <button onclick="increaseQuantity('${item.no}')">+</button>
                    </span>
                    <button onclick="removeFromCart('${item.no}')">취소</button>
                `;
		cartList.appendChild(listItem);
	});
}

function increaseQuantity(no) {
	const item = cart.find((i) => i.no === no);
	item.quantity++;
	renderCart();
}

function decreaseQuantity(no) {
	const item = cart.find((i) => i.no === no);
	item.quantity--;
	if (item.quantity === 0) {
		removeFromCart(no);
	} else {
		renderCart();
	}
}

function removeFromCart(no) {
	cart = cart.filter((i) => i.no !== no);
	renderCart();
}
document.getElementById('cart-order-btn').addEventListener('click', () => {
	const orderer = document.getElementById('orderer-name').value;

	if (!orderer) {
		alert('주문자 이름을 입력해주세요.');
		return;
	}

	if (cart.length === 0) {
		alert('장바구니가 비어 있습니다.');
		return;
	}

	const orderData = {
		orderer: orderer,
		items: cart.map((item) => ({
			menu_no: item.no,
			quantity: item.quantity,
			price: item.price,
		})),
	};

	console.log(orderData);
	fetch('/order/process', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(orderData),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				alert(data.message);
				cart = [];
				renderCart();
			} else {
				alert('주문 처리 중 오류가 발생했습니다.');
			}
		})
		.catch((error) => {
			console.error('Error:', error);
			alert('주문 처리 중 오류가 발생했습니다.');
		});
});