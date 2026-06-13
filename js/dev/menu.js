import { n as bodyLockToggle, r as bodyUnlock, t as bodyLockStatus } from "./app.min.js";
//#region src/components/layout/menu/menu.js
function menuInit() {
	document.addEventListener("click", function(e) {
		if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
			bodyLockToggle();
			document.documentElement.toggleAttribute("data-fls-menu-open");
		} else if (e.target.closest(".menu__link")) {
			bodyUnlock();
			document.documentElement.removeAttribute("data-fls-menu-open");
		}
	});
}
document.querySelector("[data-fls-menu]") && window.addEventListener("load", menuInit);
//#endregion
