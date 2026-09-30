// ===============================
// Минимальный JavaScript для КР №1:
// открытие/закрытие модального окна и проверка форм заявки.
// ===============================

// Элементы модального окна (есть только на главной странице).
const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button[data-product]');
const selectedProductInput = document.getElementById('selected-product');
const selectedProductName = document.getElementById('selected-product-name');
const closeButtons = document.querySelectorAll('#close-order-dialog, [data-close-dialog]');

// Сообщение об успешной отправке.
const successMessage = document.getElementById('success-message');

if (orderDialog) {
  // Кнопка «Заказать»: запоминаем товар и открываем окно.
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product;

      selectedProductInput.value = productName;
      selectedProductName.textContent = productName;

      orderDialog.showModal();
    });
  });

  // Кнопки «×» и «Отмена» закрывают окно.
  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      orderDialog.close();
    });
  });

  // Клик по затемнённому фону тоже закрывает окно.
  orderDialog.addEventListener('click', (event) => {
    if (event.target === orderDialog) {
      orderDialog.close();
    }
  });
}

// Показываем сообщение об успехе и прячем его через 5 секунд.
function showSuccessMessage() {
  if (!successMessage) {
    return;
  }

  successMessage.hidden = false;

  setTimeout(() => {
    successMessage.hidden = true;
  }, 5000);
}

// Если пришли со страницы товара (например, order.html?product=tulips),
// сразу выбираем этот товар в форме заявки.
const productSelect = document.getElementById('page-product');
const productFromUrl = new URLSearchParams(window.location.search).get('product');

if (productSelect && productFromUrl) {
  productSelect.value = productFromUrl;
}

// Проверка всех форм заявки на странице.
const orderForms = document.querySelectorAll('.order-form');

orderForms.forEach((form) => {
  // Когда пользователь исправляет поле, убираем красную подсветку.
  form.addEventListener('input', (event) => {
    event.target.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', (event) => {
    // Backend пока не подключён, поэтому отменяем стандартную отправку.
    event.preventDefault();

    const formElements = Array.from(form.elements);

    // Сбрасываем старые отметки об ошибках.
    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    // Проверяем встроенные HTML-ограничения (required, type, pattern).
    if (!form.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });

      form.reportValidity();
      return;
    }

    form.reset();

    if (orderDialog && orderDialog.contains(form)) {
      orderDialog.close();
    }

    showSuccessMessage();
  });
});
