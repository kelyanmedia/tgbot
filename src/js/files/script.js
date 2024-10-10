// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js"
// Підключення списку активних модулів
import { flsModules } from "./modules.js"

window.addEventListener("load", pageLoad)

function pageLoad() {
  const htmlTag = document.documentElement

  document.addEventListener("click", e => {
    const targetElement = e.target

    if (targetElement.closest(".referal__copy")) {
      const button = targetElement.closest(".referal__copy")

      const textToCopy = button.getAttribute("data-copy")

      // Создание временного текстового элемента для копирования
      const textarea = document.createElement("textarea")
      textarea.value = textToCopy
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)

      // Добавление класса done к кнопке
      button.classList.add("done")
    }
  })

  const inputs = document.querySelectorAll(".sms__input")

  if (inputs.length > 0) {
    // Фокус на первое поле
    inputs[0].focus()

    inputs.forEach((input, index) => {
      // Ограничение на ввод только цифр
      input.addEventListener("keypress", event => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault()
        }
      })

      input.addEventListener("input", event => {
        const value = event.target.value.replace(/[^0-9]/g, "")

        if (value.length > 1) {
          // Разбиваем введенное значение на отдельные цифры
          const chars = value.split("")
          chars.forEach((char, i) => {
            if (inputs[index + i]) {
              inputs[index + i].value = char
            }
          })
          // Фокус на следующее поле после вставки всех цифр
          inputs[Math.min(index + chars.length, inputs.length - 1)].focus()
        } else if (value.length === 1 && index < inputs.length - 1) {
          inputs[index + 1].focus()
        } else if (value.length === 0 && index > 0) {
          inputs[index - 1].focus()
        }
      })

      // Поддержка удаления символа при нажатии Backspace
      input.addEventListener("keydown", event => {
        if (event.key === "Backspace" && input.value === "" && index > 0) {
          inputs[index - 1].focus()
        }
      })

      // Обработка вставки кода из буфера обмена
      // Обработка вставки кода из буфера обмена
      input.addEventListener("paste", event => {
        event.preventDefault()
        const pasteData = event.clipboardData.getData("text").replace(/[^0-9]/g, "")

        if (pasteData.length === 0) return // Прекращаем выполнение, если вставка не содержит цифр

        // Ограничиваем вставку до количества полей
        const chars = pasteData.split("")
        chars.slice(0, inputs.length).forEach((char, i) => {
          inputs[i].value = char
        })

        inputs[Math.min(chars.length - 1, inputs.length - 1)].focus()
      })
    })
  }

  // ======================================================

  const cardNumber = document.getElementById("CardNumber")
  const expiryDate = document.getElementById("expiryDate")
  const cvv = document.getElementById("cvv")

  if (cardNumber) {
    const validateCardNumber = number => {
      //Check if the number contains only numeric value
      //and is of between 13 to 19 digits
      const regex = new RegExp("^[0-9]{13,19}$")
      if (!regex.test(number)) {
        return false
      }

      return luhnCheck(number)
    }

    const luhnCheck = val => {
      let checksum = 0 // running checksum total
      let j = 1 // takes value of 1 or 2

      // Process each digit one by one starting from the last
      for (let i = val.length - 1; i >= 0; i--) {
        let calc = 0
        // Extract the next digit and multiply by 1 or 2 on alternative digits.
        calc = Number(val.charAt(i)) * j

        // If the result is in two digits add 1 to the checksum total
        if (calc > 9) {
          checksum = checksum + 1
          calc = calc - 10
        }

        // Add the units element to the checksum total
        checksum = checksum + calc

        // Switch the value of j
        if (j == 1) {
          j = 2
        } else {
          j = 1
        }
      }

      //Check if it is divisible by 10 or not.
      return checksum % 10 == 0
    }

    const errorText = "Такой карты не существует!"

    function formatCardNumber(value) {
      return value
        .replace(/\D/g, "") // Удаляем все символы, кроме цифр
        .replace(/(.{4})/g, "$1 ") // Добавляем пробел после каждых 4 символов
        .trim() // Убираем пробелы в конце
    }

    function formatExpiryDate(value) {
      return value
        .replace(/\D/g, "") // Удаляем все нецифровые символы
        .replace(/(.{2})/, "$1/") // Добавляем слэш после двух символов
        .slice(0, 5) // Ограничиваем длину до 5 символов (MM/YY)
    }

    // Основная логика для обработки ввода и форматирования
    cardNumber.addEventListener("input", function (e) {
      let cardNumberValue = cardNumber.value.replace(/\D/g, "") // Очищаем от нецифровых символов

      // Ограничиваем длину до 16 цифр
      if (cardNumberValue.length > 16) {
        cardNumberValue = cardNumberValue.slice(0, 16)
      }

      // Сохраняем текущую позицию курсора
      let cursorPosition = cardNumber.selectionStart

      // Количество цифр до форматирования
      let unformattedDigits = cardNumber.value.slice(0, cursorPosition).replace(/\D/g, "").length

      // Форматируем значение
      cardNumber.value = formatCardNumber(cardNumberValue)

      // Восстанавливаем курсор с учетом пробелов
      let formattedValueUpToCursor = formatCardNumber(cardNumberValue.slice(0, unformattedDigits))
      cardNumber.setSelectionRange(formattedValueUpToCursor.length, formattedValueUpToCursor.length)

      // Проверка длины номера карты без пробелов
      if (cardNumberValue.length === 16) {
        const cardType = validateCardNumber(cardNumberValue) // Вызов функции валидации номера карты

        if (cardType) {
          document.getElementById("CardType").textContent = ""
          cardNumber.classList.remove("invalid")
          cardNumber.classList.add("valid")

          expiryDate.focus()
        } else {
          cardNumber.classList.remove("valid")
          cardNumber.classList.add("invalid")
          document.getElementById("CardType").textContent = errorText
        }
      }
    })

    // Убираем кастомную обработку события вставки
    cardNumber.addEventListener("paste", function (e) {
      e.preventDefault() // Предотвращаем стандартное поведение

      let pastedData = (e.clipboardData || window.clipboardData).getData("text")

      // Оставляем только цифры
      pastedData = pastedData.replace(/\D/g, "")

      // Получаем текущее значение без пробелов
      let currentData = cardNumber.value.replace(/\D/g, "")

      // Объединяем текущее значение и вставленное
      let combinedData = currentData + pastedData

      // Ограничиваем итоговую строку до 16 цифр
      if (combinedData.length > 16) {
        combinedData = combinedData.slice(0, 16)
      }

      // Форматируем результат
      cardNumber.value = formatCardNumber(combinedData)

      // Устанавливаем курсор в конец вставленных данных
      cardNumber.setSelectionRange(cardNumber.value.length, cardNumber.value.length)

      const cardNumberValue = cardNumber.value.replace(/\D/g, "")

      if (cardNumberValue.length === 16) {
        const cardType = validateCardNumber(cardNumberValue) // Вызов функции валидации номера карты

        if (cardType) {
          document.getElementById("CardType").textContent = ""
          cardNumber.classList.remove("invalid")
          cardNumber.classList.add("valid")

          expiryDate.focus()
        } else {
          cardNumber.classList.remove("valid")
          cardNumber.classList.add("invalid")
          document.getElementById("CardType").textContent = errorText
        }
      }
    })

    // Обработчик ввода для поля даты
    expiryDate.addEventListener("input", function (e) {
      expiryDate.value = formatExpiryDate(expiryDate.value)
      if (expiryDate.value.length === 5) {
        // Если дата введена в формате MM/YY, перемещаем фокус на поле CVV
        cvv.focus()
      }
    })

    // Обработка события вставки для поля даты
    expiryDate.addEventListener("paste", function (e) {
      setTimeout(function () {
        // Ждем завершения вставки, затем форматируем значение
        let pastedValue = expiryDate.value.replace(/\D/g, "") // Очищаем от нецифровых символов
        expiryDate.value = formatExpiryDate(pastedValue)
      }, 0) // Используем setTimeout, чтобы дождаться завершения вставки
    })

    // Обработка события удаления символов в поле даты
    expiryDate.addEventListener("input", function () {
      const currentValue = expiryDate.value
      const hasSlash = currentValue.includes("/")

      // Удаляем слэш, если он есть, и курсор перемещаем
      if (currentValue.length === 3 && hasSlash) {
        expiryDate.value = currentValue.replace("/", "")
        expiryDate.setSelectionRange(2, 2) // Перемещение курсора на позицию месяца
      }
    })

    // Обработка вставки для поля CVV
    cvv.addEventListener("paste", function (e) {
      e.preventDefault() // Отменяем стандартное поведение вставки

      // Получаем данные из буфера обмена
      let pastedData = (e.clipboardData || window.clipboardData).getData("text")

      // Оставляем только цифры
      pastedData = pastedData.replace(/\D/g, "")

      // Вставляем отформатированные данные
      cvv.value = pastedData.slice(0, 3) // Ограничиваем до 3 цифр
    })

    // Запрет ввода любых символов, кроме цифр для CVV
    cvv.addEventListener("keypress", function (e) {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault()
      }
    })
  }
}
