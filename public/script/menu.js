function resetFormFields() {
	const originalValues = {
		name: '',
		ice_or_hot: 'ice',
		category: '에이드',
		price: '',
		created_by: '',
	};

	document.getElementById('editName').value = originalValues.name;
	document.getElementById('editIceOrHot').value = originalValues.ice_or_hot;
	document.getElementById('editCategory').value = originalValues.category;
	document.getElementById('editPrice').value = originalValues.price;
	document.getElementById('editCreatedBy').value = originalValues.created_by;
}

function updateProduct(productId) {
	const editProductForm = document.getElementById('editProductForm');
	editProductForm.style.display = 'block';

	function sendUpdateRequest(productId, editedProduct) {
		fetch(`/menu/edit/${productId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(editedProduct),
		})
			.then((response) => {
				if (response.ok) {
					console.log('상품 수정 완료');
					editProductForm.style.display = 'none';
					resetFormFields();
					window.location.reload();
				} else {
					console.error('상품 수정 실패');
				}
			})
			.catch((error) => {
				console.error('상품 수정 오류:', error);
			});
	}

	fetch(`/menu/edit/${productId}`)
		.then((response) => response.json())
		.then((data) => {
			const { name, ice_or_hot, category, price, created_by } = data.product;
			console.log(name, ice_or_hot, category, price, created_by);
			document.getElementById('editName').value = name;
			document.getElementById('editIceOrHot').value = ice_or_hot;
			document.getElementById('editCategory').value = category;
			document.getElementById('editPrice').value = price;
			document.getElementById('editCreatedBy').value = created_by;
			document.getElementById('editForm').addEventListener('submit', (event) => {
				event.preventDefault();
				const editedProduct = {
					name: document.getElementById('editName').value,
					ice_or_hot: document.getElementById('editIceOrHot').value,
					category: document.getElementById('editCategory').value,
					price: document.getElementById('editPrice').value,
					created_by: document.getElementById('editCreatedBy').value,
				};
				sendUpdateRequest(productId, editedProduct);
			});
		})
		.catch((error) => {
			console.error('상품 정보를 가져오는 중 오류 발생:', error);
		});
}

document.querySelectorAll('.edit-button').forEach((button) => {
	button.addEventListener('click', (event) => {
		const productId = event.target.getAttribute('data-product-id');
		updateProduct(productId);
	});
});

function deleteProduct(productId) {
	if (confirm('정말로 이 상품을 삭제하시겠습니까?')) {
		fetch(`/menu/delete/${productId}`, {
			method: 'DELETE',
		})
			.then((response) => {
				if (response.ok) {
					window.location.reload();
				} else {
					console.error('상품 삭제 실패');
				}
			})
			.catch((error) => {
				console.error('상품 삭제 오류:', error);
			});
	}
}

document.querySelectorAll('.delete-button').forEach((button) => {
	button.addEventListener('click', (event) => {
		const productId = event.target.getAttribute('data-product-id');
		deleteProduct(productId);
	});
});

document.getElementById('cancelEdit').addEventListener('click', () => {
	const editProductForm = document.getElementById('editProductForm');
	editProductForm.style.display = 'none';
	resetFormFields();
});

document.addEventListener('DOMContentLoaded', () => {
	const searchOption = document.getElementById('searchOption');
	searchOption.value = 'name';
	updateSearchField();
});

document.getElementById('searchOption').addEventListener('change', updateSearchField);

function updateSearchField() {
	const searchOption = document.getElementById('searchOption').value;
	const searchField = document.getElementById('searchField');

	while (searchField.firstChild) {
		searchField.removeChild(searchField.firstChild);
	}

	if (searchOption === 'name' || searchOption === 'created_by') {
		const inputField = document.createElement('input');
		inputField.type = 'text';
		inputField.id = searchOption;
		inputField.name = searchOption;
		searchField.appendChild(inputField);
	} else if (searchOption === 'created_at') {
		const dateField = document.createElement('input');
		dateField.type = 'date';
		dateField.id = searchOption;
		dateField.name = searchOption;
		searchField.appendChild(dateField);
	}
}

function showAddProductForm() {
	const addProductFormDiv = document.getElementById('addProductForm');
	addProductFormDiv.style.display = 'block';
}

document.getElementById('toggleAddForm').addEventListener('click', showAddProductForm);

document.getElementById('addProductForm').addEventListener('submit', function (event) {
	event.preventDefault();

	const name = document.getElementById('name').value;
	const ice_or_hot = document.getElementById('ice_or_hot').value;
	const category = document.getElementById('category').value;
	const price = document.getElementById('price').value;
	const created_by = document.getElementById('created_by').value;

	const formData = {
		name: name,
		ice_or_hot: ice_or_hot,
		category: category,
		price: price,
		created_by: created_by,
	};

	fetch('/menu/add', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(formData),
	})
		.then((response) => {
			if (response.ok) {
				const addProductFormDiv = document.getElementById('addProductForm');
				addProductFormDiv.style.display = 'none';
				window.location.pathname = '/menu/';
			} else {
				console.error('상품 추가 실패');
			}
		})
		.catch((error) => {
			console.error('상품 추가 오류:', error);
		});
});

document.getElementById('cancelAdd').addEventListener('click', () => {
	const addProductForm = document.getElementById('addProductForm');
	addProductForm.style.display = 'none';
});