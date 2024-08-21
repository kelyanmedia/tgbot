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
}
