(function () {
	var s = 70;
	var th = 300;
	var div = document.createElement("div");

	div.appendChild(document.createElement("span"));

	document.body.onscroll = function () {
		if (
			document.documentElement.scrollTop >= th &&
			document.body.clientWidth > 500
		) {
			div.style.display = "flex";
		} else {
			div.style.display = "none";
		}
	};

	div.onclick = function () {
		var timer = requestAnimationFrame(function fn() {
			var oTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (oTop > 0) {
				document.body.scrollTop = document.documentElement.scrollTop = oTop - s;
				timer = requestAnimationFrame(fn);
			} else {
				div.style.display = "none";
				cancelAnimationFrame(timer);
			}
		});
	};

	div.id = "back-top";
	document.body.appendChild(div);
})();

(function () {
	function initTitle() {
		if (
			document.querySelector("#header a").innerText.includes("404") ||
			document.querySelector(".mobile-header-logo a").innerText.includes("404")
		) {
			return;
		}
		for (let nav of window.$ZOLA_CONFIG.navs) {
			if (location.pathname.includes(nav)) {
				nav = nav.toLocaleUpperCase();
				document.querySelector("#header a").innerText = nav;
				document.querySelector(".mobile-header-logo a").innerText = nav;
				document.title = nav;
				break;
			}
		}
	}

	function initFooterYear() {
		document.getElementById("footer-year").innerText = new Date().getFullYear();
	}

	function initImageBox() {
		var imglist = document.getElementsByTagName("img");

		for (let i = 0; i < imglist.length; i++) {
			var img = imglist[i];
			var newAddr = document.createElement("a");
			newAddr.href = img.src;
			newAddr.setAttribute("data-fslightbox", "");
			newAddr.setAttribute("data-type", "image");
			img.parentNode.replaceChild(newAddr, img);
			newAddr.appendChild(img);
		}
	}

	if (window.$phonita) {
		window.$phonita.internalApp = function () {
			function queryList(selectors) {
				const res = [];
				for (const selector of selectors) {
					for (const item of document.querySelectorAll(selector)) {
						res.push(item);
					}
				}

				return res;
			}

			queryList([
				"article.post h1.post__title a",
				".taxonomy__item__title a",
				"div.post__summary p",
				"div.post-content p",
				"div.post-content h1",
				"div.post__summary h1",
				"div.post-content h2",
				"div.post-content h3",
				"div.post-nav a",
			]).forEach((e) => {
				renderDOM(e);
			});

			document.querySelectorAll("pht").forEach((e) => {
				renderPht(e);
			});
		};

		window.onload = window.$phonita.internalApp;
	}

	initTitle();
	initFooterYear();

	initImageBox();
})();

function initMobile() {
	var $mobileNav = document.getElementById("mobile-navbar");
	var $mobileNavIcon = document.querySelector(".mobile-navbar-icon");

	var slideout = new Slideout({
		panel: document.getElementById("mobile-panel"),
		menu: document.getElementById("mobile-menu"),
		padding: 180,
		tolerance: 70,
	});
	slideout.disableTouch();

	$mobileNavIcon.addEventListener("click", function () {
		slideout.toggle();
	});

	slideout.on("beforeopen", function () {
		$mobileNav.classList.add("fixed-open");
		$mobileNavIcon.classList.add("icon-click");
		$mobileNavIcon.classList.remove("icon-out");
	});

	slideout.on("beforeclose", function () {
		$mobileNav.classList.remove("fixed-open");
		$mobileNavIcon.classList.add("icon-out");
		$mobileNavIcon.classList.remove("icon-click");
	});

	document
		.getElementById("mobile-panel")
		.addEventListener("touchend", function () {
			slideout.isOpen() && $mobileNavIcon.click();
		});
}
function initToc() {
	var $toclink = document.querySelectorAll(".toc-link");
	var $headerlink = document.querySelectorAll(
		".post-content h1 , .post-content h2"
	);
	var $tocLinkLis = document.querySelectorAll(".post-toc-content li");

	var searchActiveTocIndex = function (array, target) {
		if (!array.length) {
			return -1;
		}

		target += 30;
		for (let i = 0; i < array.length - 1; i++) {
			if (target > array[i].offsetTop && target <= array[i + 1].offsetTop)
				return i;
		}
		if (target > array[array.length - 1].offsetTop) return array.length - 1;
		return -1;
	};

	document.addEventListener("scroll", function () {
		var scrollTop =
			document.body.scrollTop | document.documentElement.scrollTop;
		var activeTocIndex = searchActiveTocIndex($headerlink, scrollTop);

		$toclink.forEach(function (el) {
			el.classList.remove("active");
		});
		$tocLinkLis.forEach(function (el) {
			el.classList.remove("has-active");
		});

		if ($toclink.length && activeTocIndex !== -1) {
			$toclink[activeTocIndex].classList.add("active");
			let ancestor = $toclink[activeTocIndex].parentNode;
			while (ancestor.tagName !== "NAV") {
				ancestor.classList.add("has-active");
				ancestor = ancestor.parentNode.parentNode;
			}
		}
	});
}

if (
	document.readyState === "complete" ||
	(document.readyState !== "loading" && !document.documentElement.doScroll)
) {
	initMobile();
	initToc();
} else {
	document.addEventListener("DOMContentLoaded", initMobile);
	document.addEventListener("DOMContentLoaded", initToc);
}
