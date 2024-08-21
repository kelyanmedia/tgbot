/* Маски для полей (в работе) */

// Подключение функционала "Чертогов Фрилансера"
// Подключение списка активных модулей
import { flsModules } from "../modules.js";

// Подключение модуля
import "inputmask/dist/inputmask.min.js";

const inputMasks = document.querySelectorAll('[data-phone]');
if (inputMasks.length) {
	flsModules.inputmask = Inputmask({
		"mask": "+\\9\\98 (99) 999-99-99",
  		showMaskOnHover: false
	}).mask(inputMasks);
}