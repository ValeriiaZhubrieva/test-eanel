//#region src/js/common/functions.js
function getHash() {
	if (location.hash) return location.hash.replace("#", "");
}
var bodyLockStatus = true;
var bodyLockToggle = (delay = 500) => {
	if (document.documentElement.hasAttribute("data-fls-scrolllock")) bodyUnlock(delay);
	else bodyLock(delay);
};
var bodyUnlock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
		setTimeout(() => {
			lockPaddingElements.forEach((lockPaddingElement) => {
				lockPaddingElement.style.paddingRight = "";
			});
			document.body.style.paddingRight = "";
			document.documentElement.removeAttribute("data-fls-scrolllock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function() {
			bodyLockStatus = true;
		}, delay);
	}
};
var bodyLock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
		const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
		lockPaddingElements.forEach((lockPaddingElement) => {
			lockPaddingElement.style.paddingRight = lockPaddingValue;
		});
		document.body.style.paddingRight = lockPaddingValue;
		document.documentElement.setAttribute("data-fls-scrolllock", "");
		bodyLockStatus = false;
		setTimeout(function() {
			bodyLockStatus = true;
		}, delay);
	}
};
var gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
	const targetBlockElement = document.querySelector(targetBlock);
	if (targetBlockElement) {
		let headerItem = "";
		let headerItemHeight = 0;
		if (noHeader) {
			headerItem = "header.header";
			const headerElement = document.querySelector(headerItem);
			if (!headerElement.classList.contains("--header-scroll")) {
				headerElement.style.cssText = `transition-duration: 0s;`;
				headerElement.classList.add("--header-scroll");
				headerItemHeight = headerElement.offsetHeight;
				headerElement.classList.remove("--header-scroll");
				setTimeout(() => {
					headerElement.style.cssText = ``;
				}, 0);
			} else headerItemHeight = headerElement.offsetHeight;
		}
		if (document.documentElement.hasAttribute("data-fls-menu-open")) {
			bodyUnlock();
			document.documentElement.removeAttribute("data-fls-menu-open");
		}
		let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
		targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
		targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
		window.scrollTo({
			top: targetBlockElementPosition,
			behavior: "smooth"
		});
	}
};
//#endregion
//#region src/js/app.js
var topPositionBlocks = document.querySelectorAll("[data-top-position]");
if (topPositionBlocks.length) {
	const header = document.querySelector("header");
	const headerOffsetEl = header?.querySelector("[data-header-offset]");
	let ticking = false;
	function setVar(el, name, value) {
		if (!el._vars) el._vars = {};
		if (el._vars[name] === value) return;
		el.style.setProperty(name, value);
		el._vars[name] = value;
	}
	function updateTopPositions() {
		const headerHeight = header ? header.offsetHeight : 0;
		const headerOffsetHeight = headerOffsetEl ? headerOffsetEl.offsetHeight : 0;
		const measurements = [];
		topPositionBlocks.forEach((block) => {
			const blockRect = block.getBoundingClientRect();
			let navData = null;
			if (block.hasAttribute("data-top-position-nav")) {
				const blockNav = block.querySelector("[data-top-position-navblock]");
				if (blockNav) navData = {
					el: blockNav,
					height: blockNav.getBoundingClientRect().height
				};
			}
			measurements.push({
				block,
				topPosition: Math.max(headerHeight, blockRect.top),
				left: blockRect.left,
				width: blockRect.width,
				nav: navData
			});
		});
		measurements.forEach(({ block, topPosition, left, width, nav }) => {
			setVar(block, "--top-position", `${topPosition}px`);
			setVar(block, "--header-height", `${headerHeight}px`);
			if (headerOffsetHeight) setVar(block, "--header-offset-height", `${headerOffsetHeight}px`);
			if (nav) {
				setVar(nav.el, "--nav-left", `${left}px`);
				setVar(nav.el, "--nav-width", `${width}px`);
				setVar(block, "--nav-height", `${nav.height}px`);
			}
		});
	}
	function onScroll() {
		if (!ticking) {
			requestAnimationFrame(() => {
				updateTopPositions();
				ticking = false;
			});
			ticking = true;
		}
	}
	function runAfterLayout() {
		requestAnimationFrame(() => {
			requestAnimationFrame(updateTopPositions);
		});
	}
	runAfterLayout();
	window.addEventListener("load", runAfterLayout);
	if (document.fonts) document.fonts.ready.then(runAfterLayout);
	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", runAfterLayout);
	if ("ResizeObserver" in window) {
		const observer = new ResizeObserver(runAfterLayout);
		if (header) observer.observe(header);
		if (headerOffsetEl) observer.observe(headerOffsetEl);
	}
}
window.customMiniSelect = function() {
	const selParents = document.querySelectorAll("[data-sel-block]");
	if (!selParents.length) return;
	selParents.forEach((selBlock) => {
		const isSearch = selBlock.hasAttribute("data-sel-block-search");
		const selDropdownButton = selBlock.querySelector("[data-sel-block-current]");
		const selDropdownValueSpan = selDropdownButton.querySelector("[data-sel-block-value]");
		const selDropdownInput = selDropdownButton.querySelector("[data-sel-block-input]");
		const selOptions = selBlock.querySelectorAll("[data-sel-block-btn]");
		const selCloseBtns = selBlock.querySelectorAll("[data-sel-block-close]");
		const selDropdown = selBlock.querySelector("[data-sel-block-dropdown]");
		const placeholderText = selBlock.getAttribute("data-sel-block-placeholder");
		let isOpen = false;
		function checkDropdownOverflow() {
			selDropdown.style.setProperty("--dropdown-shift", `0px`);
			const rect = selDropdown.getBoundingClientRect();
			let shift = 0;
			if (rect.right > window.innerWidth) shift = window.innerWidth - rect.right - 8;
			if (rect.left + shift < 0) shift += -rect.left + 8;
			selDropdown.style.setProperty("--dropdown-shift", `${shift}px`);
		}
		function checkAndSetPlaceholder() {
			if (!placeholderText) return;
			if (!Array.from(selOptions).some((o) => o.classList.contains("is-active"))) {
				selBlock.classList.add("is-placeholder");
				if (selDropdownValueSpan) selDropdownValueSpan.innerHTML = placeholderText;
			} else selBlock.classList.remove("is-placeholder");
		}
		function filterOptions(query) {
			const value = query.toLowerCase().trim();
			selOptions.forEach((option) => {
				const text = option.textContent.toLowerCase();
				option.style.display = text.includes(value) ? "" : "none";
			});
		}
		function resetFilter() {
			selOptions.forEach((option) => {
				option.style.display = "";
			});
		}
		checkAndSetPlaceholder();
		function closeDropdown() {
			selBlock.classList.remove("sel-open");
			setTimeout(() => {
				selBlock.classList.remove("is-out-left", "is-out-right");
			}, 300);
			isOpen = false;
			document.removeEventListener("click", handleDocumentClick);
			if (isSearch && selDropdownInput) resetFilter();
		}
		function handleDocumentClick(e) {
			if (!selBlock.contains(e.target)) closeDropdown();
		}
		selCloseBtns.forEach((btn) => {
			btn.addEventListener("click", closeDropdown);
		});
		selDropdownButton.addEventListener("click", (e) => {
			if (isSearch && e.target === selDropdownInput && isOpen) return;
			if (!isOpen) isOpen = true;
			else isOpen = false;
			const parentWithAttr = selBlock.closest("[data-one-sel-block]");
			if (parentWithAttr && isOpen) parentWithAttr.querySelectorAll("[data-sel-block]").forEach((block) => {
				if (block !== selBlock) block.classList.remove("sel-open");
			});
			selBlock.classList.toggle("sel-open", isOpen);
			if (isOpen) {
				document.addEventListener("click", handleDocumentClick);
				requestAnimationFrame(() => {
					checkDropdownOverflow();
				});
			} else closeDropdown();
		});
		if (isSearch && selDropdownInput) {
			selDropdownInput.addEventListener("input", (e) => {
				const value = e.target.value.trim();
				if (isOpen) filterOptions(value);
				if (value === "") {
					selOptions.forEach((o) => o.classList.remove("is-active"));
					checkAndSetPlaceholder();
				}
			});
			selDropdownInput.addEventListener("focus", () => {
				if (isOpen) {
					selDropdownInput.value = "";
					resetFilter();
					selOptions.forEach((o) => o.classList.remove("is-active"));
					checkAndSetPlaceholder();
				}
			});
		}
		selOptions.forEach((item) => {
			item.addEventListener("click", () => {
				if (selDropdownInput) {
					selDropdownInput.value = item.textContent.replace(/\s+/g, " ").trim();
					if (typeof initInputEffects === "function") initInputEffects();
				} else if (selDropdownValueSpan) selDropdownValueSpan.innerHTML = item.innerHTML;
				selOptions.forEach((o) => o.classList.toggle("is-active", o === item));
				closeDropdown();
				checkAndSetPlaceholder();
			});
		});
	});
};
customMiniSelect();
window.closeAllDropdowns = function(container, except = null) {
	container.querySelectorAll("[data-drop-block].is-active").forEach((drop) => {
		if (drop !== except) {
			drop.classList.remove("is-active");
			const dropBtn = drop.querySelector("[data-drop-toggle]");
			if (dropBtn) dropBtn.classList.remove("is-active");
		}
	});
};
window.initDropdowns = function() {
	const blocks = document.querySelectorAll("[data-drop-block]");
	if (!blocks.length) return;
	blocks.forEach((block) => {
		const btn = block.querySelector("[data-drop-toggle]");
		if (!btn) return;
		btn.addEventListener("click", (e) => {
			const parent = block.closest("[data-drop-block-one]");
			const isActive = block.classList.contains("is-active");
			if (parent) if (isActive) {
				block.classList.remove("is-active");
				btn.classList.remove("is-active");
			} else {
				window.closeAllDropdowns(parent, block);
				requestAnimationFrame(() => {
					block.classList.add("is-active");
					btn.classList.add("is-active");
				});
			}
			else {
				block.classList.toggle("is-active");
				btn.classList.toggle("is-active");
			}
		});
	});
	document.addEventListener("click", (e) => {
		document.querySelectorAll("[data-drop-block].is-active").forEach((block) => {
			if (!block.contains(e.target)) {
				block.classList.remove("is-active");
				const btn = block.querySelector("[data-drop-toggle]");
				if (btn) btn.classList.remove("is-active");
			}
		});
	});
};
initDropdowns();
window.initVideoBlocks = function() {
	document.querySelectorAll(".video-block").forEach((block) => {
		const video = block.querySelector(".video-block__video");
		const playBtn = block.querySelector(".video-block__play");
		if (!video || !playBtn) return;
		playBtn.addEventListener("click", () => {
			video.controls = true;
			video.play();
		});
		video.addEventListener("play", () => {
			block.classList.add("is-playing");
		});
		video.addEventListener("ended", () => {
			video.currentTime = 0;
			video.controls = false;
			block.classList.remove("is-playing");
		});
	});
};
initVideoBlocks();
var toggleActiveBtns = document.querySelectorAll("[data-toggle-active]");
if (toggleActiveBtns.length) toggleActiveBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		btn.classList.toggle("is-active");
	});
});
//#endregion
export { gotoBlock as a, getHash as i, bodyLockToggle as n, bodyUnlock as r, bodyLockStatus as t };
