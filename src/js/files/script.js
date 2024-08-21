// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js"
// Підключення списку активних модулів
import { flsModules } from "./modules.js"

window.addEventListener("load", pageLoad)

function pageLoad() {
  const htmlTag = document.documentElement

  // document.addEventListener('click', e => {
  //     const targetElement = e.target

  //     if (targetElement.closest('.class')) {
  //         console.log('1');
  //     }
  // })

  const inputs = document.querySelectorAll(".sms__input")

  if (inputs) {
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
        const value = event.target.value
        if (!/^[0-9]*$/.test(value)) {
          event.target.value = value.replace(/[^0-9]/g, "")
        }
        if (value.length === 1 && index < inputs.length - 1) {
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
      input.addEventListener("paste", event => {
        event.preventDefault()
        let pasteData = event.clipboardData
          .getData("text")
          .replace(/[^0-9]/g, "")
          .split("")

        // Ограничение на длину вставляемого кода
        if (pasteData.length > inputs.length) {
          pasteData = pasteData.slice(0, inputs.length)
        }

        pasteData.forEach((char, i) => {
          inputs[i].value = char
        })

        // Фокус на последнем заполненном поле
        if (pasteData.length > 0) {
          inputs[pasteData.length - 1].focus()
        }
      })
    })
  }
}
