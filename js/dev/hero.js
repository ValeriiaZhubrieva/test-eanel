//#region src/components/custom/hero/hero.js
var mockupScenarios = [
	{
		badQuery: {
			en: "slmarphone charger",
			ua: "смартфон зарядка"
		},
		fixedQuery: {
			en: "smartphone charger",
			ua: "смартфон зарядка"
		},
		fixLabel: {
			en: "Typo fixed ✓",
			ua: "Помилку виправлено ✓"
		},
		fixHint: {
			en: "eanell.ai fixed: slmarphone → smartphone",
			ua: "eanell.ai виправив: slmarphone → smartphone"
		},
		products: [
			{
				en: "Anker USB-C 65W",
				ua: "Anker USB-C 65W",
				price: "€29",
				logo: "/assets/img/logos/anker.svg",
				bg: "#01a8e2"
			},
			{
				en: "Belkin Wireless",
				ua: "Belkin Wireless",
				price: "€39",
				logo: "/assets/img/logos/belkin_logo_notm.svg",
				bg: "#000000"
			},
			{
				en: "Baseus Car Mount",
				ua: "Baseus для авто",
				price: "€19",
				logo: "/assets/img/logos/baseus.svg",
				bg: "#282828"
			}
		]
	},
	{
		badQuery: {
			en: "nivea face crem",
			ua: "нивея крем обличя"
		},
		fixedQuery: {
			en: "Nivea face cream",
			ua: "Nivea крем для обличчя"
		},
		fixLabel: {
			en: "Transliterated ✓",
			ua: "Транслітеровано ✓"
		},
		fixHint: {
			en: "eanell.ai found: нивея = Nivea",
			ua: "eanell.ai знайшов: нивея = Nivea"
		},
		products: [
			{
				en: "Nivea Day Cream",
				ua: "Nivea Денний крем",
				price: "€12",
				logo: "/assets/img/logos/nivea.svg",
				bg: "#003366"
			},
			{
				en: "L'Oréal Serum",
				ua: "L'Oréal Сироватка",
				price: "€24",
				logo: "/assets/img/logos/loreal-paris-black-logo.svg",
				bg: "#fca5a5"
			},
			{
				en: "Vichy Eye Cream",
				ua: "Vichy Крем для очей",
				price: "€18",
				logo: "/assets/img/logos/vichy.svg",
				bg: "#9b8cf5"
			}
		]
	},
	{
		badQuery: {
			en: "floor lamp wooden",
			ua: "лампи підлогової дерев"
		},
		fixedQuery: {
			en: "wooden floor lamp",
			ua: "підлогова лампа дерево"
		},
		fixLabel: {
			en: "Morphology fixed ✓",
			ua: "Морфологію виправлено ✓"
		},
		fixHint: {
			en: "eanell.ai fixed word order & forms",
			ua: "eanell.ai виправив порядок і відмінки"
		},
		products: [
			{
				en: "IKEA Floor Lamp",
				ua: "IKEA Підлогова лампа",
				price: "€89",
				logo: "/assets/img/logos/ikea.svg",
				bg: "#0058a3"
			},
			{
				en: "H&M Home Lamp",
				ua: "H&M Home Лампа",
				price: "€59",
				logo: "/assets/img/logos/hm.svg",
				bg: "#e50010"
			},
			{
				en: "Zara Home Light",
				ua: "Zara Home Світло",
				price: "€120",
				logo: "/assets/img/logos/zarahome.svg",
				bg: "#f0f0ee"
			}
		]
	},
	{
		badQuery: {
			en: "workout mat gym",
			ua: "килимок тренуваня спорт"
		},
		fixedQuery: {
			en: "yoga mat · exercise mat",
			ua: "йога килимок · спортивний"
		},
		fixLabel: {
			en: "Synonyms matched ✓",
			ua: "Синоніми знайдено ✓"
		},
		fixHint: {
			en: "eanell.ai matched 3 synonym variants",
			ua: "eanell.ai знайшов 3 синоніми"
		},
		products: [
			{
				en: "Nike Yoga Mat",
				ua: "Nike Йога килимок",
				price: "€45",
				logo: "/assets/img/logos/nike.svg",
				bg: "#111111"
			},
			{
				en: "Adidas Gym Mat",
				ua: "Adidas Килимок",
				price: "€55",
				logo: "/assets/img/logos/adidas.svg",
				bg: "#000000"
			},
			{
				en: "Decathlon Mat",
				ua: "Decathlon Килимок",
				price: "€22",
				logo: "/assets/img/logos/decathlon-1.svg",
				bg: "#0082c3"
			}
		]
	}
];
var mockupActiveTab = 0;
var mockupTabTimer = null;
var mockupProgTimer = null;
var currentLang = "en";
var isMockupRunning = true;
var currentSceneToken = { cancelled: false };
var mockupTexts = {
	en: {
		status_no_ai: "No AI Search",
		status_std: "Standard search engine",
		without_label: "Without eanell.ai",
		lost_sub: "revenue lost / day",
		earn_sub: "revenue recovered / day",
		ai_off: "eanell.ai off",
		ai_on: "eanell.ai on",
		tab0: "Typos",
		tab1: "Transliteration",
		tab2: "Morphology",
		tab3: "Synonyms"
	},
	ua: {
		status_no_ai: "Без AI Пошуку",
		status_std: "Звичайний пошук",
		without_label: "Без eanell.ai",
		lost_sub: "втрачений дохід / день",
		earn_sub: "відновлений дохід / день",
		ai_off: "eanell.ai вимкнено",
		ai_on: "eanell.ai увімкнено",
		tab0: "Помилки",
		tab1: "Транслітерація",
		tab2: "Морфологія",
		tab3: "Синоніми"
	}
};
function initMockup(lang = "en") {
	currentLang = lang;
	setupMockupEventListeners();
	updateMockupTexts();
	setTimeout(() => runMockupScene(0), 800);
}
window.setMockupLang = function(lang) {
	currentLang = lang;
	updateMockupTexts();
};
function updateMockupTexts() {
	const t = mockupTexts[currentLang];
	if (!t) return;
	const statusText = document.querySelector("[data-mockup=\"status-text\"]");
	const statusRight = document.querySelector("[data-mockup=\"status-right\"]");
	const withoutLabel = document.querySelector("[data-mockup=\"without-label\"]");
	const lostSub = document.querySelector("[data-mockup=\"lost-sub\"]");
	const earnSub = document.querySelector("[data-mockup=\"earn-sub\"]");
	const aiText = document.querySelector("[data-mockup=\"ai-text\"]");
	const tabs = document.querySelectorAll("[data-mockup=\"tab-label\"]");
	if (statusText) statusText.textContent = t.status_no_ai;
	if (statusRight) statusRight.textContent = t.status_std;
	if (withoutLabel) withoutLabel.textContent = t.without_label;
	if (lostSub) lostSub.textContent = t.lost_sub;
	if (earnSub) earnSub.textContent = t.earn_sub;
	if (aiText) aiText.textContent = t.ai_off;
	tabs.forEach((tab, idx) => {
		if (t["tab" + idx]) tab.textContent = t["tab" + idx];
	});
}
function setupMockupEventListeners() {
	document.querySelectorAll("[data-mockup=\"tab-btn\"]").forEach((tab, idx) => {
		tab.removeEventListener("click", () => window.switchMockupTab(idx));
		tab.addEventListener("click", () => window.switchMockupTab(idx));
	});
}
window.switchMockupTab = function(idx) {
	if (idx === mockupActiveTab) return;
	currentSceneToken.cancelled = true;
	currentSceneToken = { cancelled: false };
	clearTimeout(mockupTabTimer);
	if (mockupProgTimer) cancelAnimationFrame(mockupProgTimer);
	for (let i = 0; i < 4; i++) {
		const fill = document.getElementById(`mockup-prog-${i}`);
		if (fill) {
			fill.style.transition = "none";
			fill.style.width = "0%";
		}
		const tab = document.getElementById(`mockup-tab-${i}`);
		if (tab) tab.classList.remove("active");
	}
	const activeTabEl = document.getElementById(`mockup-tab-${idx}`);
	if (activeTabEl) activeTabEl.classList.add("active");
	mockupActiveTab = idx;
	const productsEl = document.querySelector("[data-mockup=\"products\"]");
	const rowWith = document.querySelector("[data-mockup=\"row-with\"]");
	if (productsEl) productsEl.style.opacity = "0";
	if (rowWith) rowWith.style.opacity = "0";
	const queryEl = document.querySelector("[data-mockup=\"query\"]");
	const badgeEl = document.querySelector("[data-mockup=\"badge\"]");
	if (queryEl) queryEl.textContent = "";
	if (badgeEl) {
		badgeEl.style.opacity = "0";
		badgeEl.textContent = "";
	}
	setMockupSearchColor("error");
	setTimeout(() => runMockupScene(idx), 80);
};
function setMockupSearchColor(mode) {
	const inputEl = document.querySelector("[data-mockup=\"search-input\"]");
	const iconCircle = document.querySelector("[data-mockup=\"icon-circle\"]");
	const iconLine = document.querySelector("[data-mockup=\"icon-line\"]");
	const colors = {
		active: "var(--color-cyan-47)",
		error: "var(--color-red-82)",
		default: "var(--color-grey-88)"
	};
	const color = colors[mode] || colors.default;
	if (inputEl) inputEl.style.borderColor = color;
	if (iconCircle) iconCircle.setAttribute("stroke", mode === "active" ? "var(--color-cyan-47)" : "var(--color-red-51)");
	if (iconLine) iconLine.setAttribute("stroke", mode === "active" ? "var(--color-cyan-47)" : "var(--color-red-51)");
}
function typeMockupText(el, text, speed, token) {
	return new Promise((resolve) => {
		if (!el) {
			resolve();
			return;
		}
		el.textContent = "";
		let i = 0;
		function type() {
			if (token.cancelled || !isMockupRunning) {
				resolve();
				return;
			}
			el.textContent = text.slice(0, i + 1);
			i++;
			if (i < text.length) setTimeout(type, speed);
			else setTimeout(resolve, 150);
		}
		type();
	});
}
function eraseMockupText(el, token) {
	return new Promise((resolve) => {
		if (!el) {
			resolve();
			return;
		}
		function erase() {
			if (token.cancelled || !isMockupRunning) {
				resolve();
				return;
			}
			const text = el.textContent;
			if (!text.length) {
				setTimeout(resolve, 80);
				return;
			}
			el.textContent = text.slice(0, -1);
			setTimeout(erase, 28);
		}
		erase();
	});
}
function countUpMockup(el, from, to, duration, formatter, token) {
	return new Promise((resolve) => {
		if (!el) {
			resolve();
			return;
		}
		const steps = 40;
		const inc = (to - from) / steps;
		const delay = duration / steps;
		let current = from;
		function step() {
			if (token.cancelled || !isMockupRunning) {
				resolve();
				return;
			}
			current = Math.min(current + inc, to);
			el.textContent = formatter(Math.round(current));
			if (current < to) setTimeout(step, delay);
			else resolve();
		}
		step();
	});
}
function startMockupProgress(idx, duration, onComplete) {
	const fill = document.getElementById(`mockup-prog-${idx}`);
	if (!fill) return;
	fill.style.transition = "none";
	fill.style.width = "0%";
	const start = performance.now();
	function tick(now) {
		if (!isMockupRunning) return;
		const pct = Math.min(100, (now - start) / duration * 100);
		fill.style.width = pct + "%";
		if (pct < 100) mockupProgTimer = requestAnimationFrame(tick);
		else if (onComplete) onComplete();
	}
	mockupProgTimer = requestAnimationFrame(tick);
}
async function runMockupScene(idx) {
	const sc = mockupScenarios[idx];
	if (!sc) return;
	const token = currentSceneToken;
	const t = mockupTexts[currentLang];
	const lang = currentLang;
	const queryEl = document.querySelector("[data-mockup=\"query\"]");
	const badgeEl = document.querySelector("[data-mockup=\"badge\"]");
	const lostCounter = document.querySelector("[data-mockup=\"lost-counter\"]");
	const earnCounter = document.querySelector("[data-mockup=\"earn-counter\"]");
	const rowWith = document.querySelector("[data-mockup=\"row-with\"]");
	const statusBar = document.querySelector("[data-mockup=\"status-bar\"]");
	const statusDot = document.querySelector("[data-mockup=\"status-dot\"]");
	const statusText = document.querySelector("[data-mockup=\"status-text\"]");
	const statusRight = document.querySelector("[data-mockup=\"status-right\"]");
	const aiSwitch = document.querySelector("[data-mockup=\"ai-switch\"]");
	const aiDot = document.querySelector("[data-mockup=\"ai-dot\"]");
	const aiText = document.querySelector("[data-mockup=\"ai-text\"]");
	const productsEl = document.querySelector("[data-mockup=\"products\"]");
	if (!queryEl) return;
	const total = sc.products.reduce((sum, p) => sum + parseInt(p.price.replace("€", "")), 0);
	const dailyLoss = Math.round(total * 28);
	const dailyEarn = Math.round(total * 24);
	queryEl.textContent = "";
	if (badgeEl) {
		badgeEl.style.opacity = "0";
		badgeEl.textContent = "";
	}
	if (lostCounter) lostCounter.textContent = "-€0";
	if (earnCounter) earnCounter.textContent = "+€0";
	if (rowWith) rowWith.style.opacity = "0";
	if (productsEl) productsEl.style.opacity = "0";
	setMockupSearchColor("error");
	if (statusBar) statusBar.style.background = "#fef2f2";
	if (statusDot) statusDot.style.background = "var(--color-red-51)";
	if (statusText) {
		statusText.textContent = t.status_no_ai;
		statusText.style.color = "var(--color-red-51)";
	}
	if (statusRight) statusRight.textContent = t.status_std;
	if (aiSwitch) {
		aiSwitch.style.background = "var(--color-grey-97)";
		aiSwitch.style.borderColor = "var(--color-grey-88)";
	}
	if (aiDot) aiDot.style.background = "var(--color-grey-88)";
	if (aiText) {
		aiText.style.color = "var(--color-grey-61)";
		aiText.textContent = t.ai_off;
	}
	await typeMockupText(queryEl, sc.badQuery[lang] || sc.badQuery.en, 80, token);
	if (token.cancelled || !isMockupRunning) return;
	await new Promise((r) => setTimeout(r, 400));
	if (token.cancelled || !isMockupRunning) return;
	await countUpMockup(lostCounter, 0, dailyLoss, 1200, (v) => "-€" + v, token);
	if (token.cancelled || !isMockupRunning) return;
	await new Promise((r) => setTimeout(r, 900));
	if (token.cancelled || !isMockupRunning) return;
	if (statusBar) statusBar.style.background = "var(--color-grey-95)";
	if (statusDot) statusDot.style.background = "#27ae60";
	if (statusText) {
		statusText.style.color = "var(--color-cyan-39)";
		statusText.textContent = "eanell.ai";
	}
	if (statusRight) statusRight.textContent = "AI-powered search";
	if (aiSwitch) {
		aiSwitch.style.background = "var(--color-grey-95)";
		aiSwitch.style.borderColor = "var(--color-cyan-47)";
	}
	if (aiDot) aiDot.style.background = "var(--color-cyan-47)";
	if (aiText) {
		aiText.style.color = "var(--color-cyan-39)";
		aiText.textContent = t.ai_on;
	}
	setMockupSearchColor("active");
	await eraseMockupText(queryEl, token);
	if (token.cancelled || !isMockupRunning) return;
	await typeMockupText(queryEl, sc.fixedQuery[lang] || sc.fixedQuery.en, 50, token);
	if (token.cancelled || !isMockupRunning) return;
	if (badgeEl) {
		badgeEl.textContent = sc.fixLabel[lang] || sc.fixLabel.en;
		badgeEl.style.opacity = "1";
	}
	if (rowWith) rowWith.style.opacity = "1";
	await new Promise((r) => setTimeout(r, 300));
	if (token.cancelled || !isMockupRunning) return;
	await countUpMockup(earnCounter, 0, dailyEarn, 1200, (v) => "+€" + v, token);
	if (token.cancelled || !isMockupRunning) return;
	sc.products.forEach((product, i) => {
		const nameEl = document.getElementById(`mockup-p${i + 1}-name`);
		const priceEl = document.getElementById(`mockup-p${i + 1}-price`);
		const photoEl = document.getElementById(`mockup-p${i + 1}-photo`);
		const imgWrap = document.getElementById(`mockup-p${i + 1}-img`);
		if (nameEl) nameEl.textContent = product[lang] || product.en;
		if (priceEl) {
			priceEl.textContent = product.price;
			priceEl.className = `mockup__product-price mockup__product-price--${i === 1 ? "rose" : "teal"}`;
		}
		if (photoEl && product.logo) {
			if (imgWrap) imgWrap.style.background = product.bg || "var(--color-grey-97)";
			photoEl.src = product.logo;
			photoEl.style.display = "block";
			photoEl.onerror = function() {
				this.style.display = "none";
				if (imgWrap) imgWrap.style.background = "var(--color-grey-97)";
			};
		}
	});
	if (productsEl) productsEl.style.opacity = "1";
	if (token.cancelled || !isMockupRunning) return;
	await new Promise((r) => setTimeout(r, 500));
	if (token.cancelled || !isMockupRunning) return;
	startMockupProgress(idx, 3e3, () => {
		if (token.cancelled || !isMockupRunning) return;
		const nextIdx = (idx + 1) % mockupScenarios.length;
		window.switchMockupTab(nextIdx);
	});
}
window.stopMockupAnimation = function() {
	isMockupRunning = false;
};
window.startMockupAnimation = function() {
	isMockupRunning = true;
	window.switchMockupTab(0);
};
window.initMockup = initMockup;
//#endregion
