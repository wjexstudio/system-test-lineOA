const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
const orderForm = document.getElementById('order-form');

// URL Apps Script ที่จะโหลดรายการผัก
const productsURL = 'https://script.google.com/macros/s/XXXXXXX/exec?action=getProducts';
// URL Apps Script ที่จะรับออเดอร์
const submitURL = 'https://script.google.com/macros/s/XXXXXXX/exec';

fetch(productsURL)
  .then(res => res.json())
  .then(products => {
    products.forEach((item, index) => {
      const div = document.createElement('div');
      div.innerHTML = `
        <label>${item.name} (${item.price} บาท): </label>
        <input type="number" name="${item.name}" price="${item.price}" min="0" value="0"><br><br>
      `;
      orderForm.appendChild(div);
    });
  });

document.getElementById('submit-btn').addEventListener('click', () => {
  const inputs = orderForm.querySelectorAll('input');
  const orderItems = [];

  inputs.forEach(input => {
    const qty = parseInt(input.value);
    if (qty > 0) {
      orderItems.push({ name: input.name, quantity: qty, price: input.price });
    }
  });

  if (orderItems.length === 0) {
    document.getElementById('response').innerText = "กรุณาใส่จำนวนผักที่ต้องการ";
    return;
  }

  const orderData = {
    userId,
    order: orderItems
  };

  fetch(submitURL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });

  document.getElementById('response').innerText = "ส่งออเดอร์เรียบร้อยแล้ว!";
  orderForm.reset();
});

// อย่าลืมกลับมาอัพเดต productsURL และ submitURL หลังจาก Deploy Google App Script แล้ว
