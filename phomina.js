var Phonita = /** @class */ (function () {
	function Phonita(rawString) {
		this.alphabet = [];
		if (typeof rawString === "string") {
			this.loadFromRawString(rawString);
		}
	}
	Phonita.prototype.maxLatin = function () {
		return this.alphabet
			.map(function (_a) {
				var latin = _a.latin;
				return latin.length;
			})
			.sort(function (a, b) {
				return b - a;
			})[0];
	};
	Phonita.prototype.appendLetters = function (raw, latin) {
		this.alphabet.push({
			latin: latin,
			raw: raw,
		});
	};
	Phonita.prototype.loadFromRawString = function (rawString) {
		var _this = this;
		rawString
			.split("\n")
			.map(function (item) {
				return item.trim();
			})
			.filter(function (item) {
				return (
					item.length > 0 && !item.startsWith("//") && !item.startsWith("#")
				);
			})
			.forEach(function (item) {
				var _a = item.split("="),
					raw = _a[0],
					latin = _a[1];
				if (latin) {
					_this.appendLetters(raw, latin);
				}
			});
	};
	Phonita.prototype.hasKey = function (s) {
		return this.alphabet
			.map(function (_a) {
				var latin = _a.latin;
				return latin;
			})
			.includes(s.toLocaleLowerCase());
	};
	Phonita.prototype.sliceMatcher = function (s) {
		var n = s.length;
		for (var i = n; i > 0; i--) {
			var slice = s.slice(0, i);
			for (var _i = 0, _a = this.alphabet; _i < _a.length; _i++) {
				var _b = _a[_i],
					raw = _b.raw,
					latin = _b.latin;
				if (latin === slice) {
					return {
						val: raw,
						step: latin.length,
					};
				}
			}
		}
		return {
			val: s.slice(0, 1),
			step: 1,
		};
	};
	Phonita.prototype.parseWord = function (s) {
		var k = 0;
		var n = s.length;
		var l = this.maxLatin();
		s = s.toLocaleLowerCase();
		var ret = "";
		while (true) {
			var _a = this.sliceMatcher(s.slice(k, k + l)),
				val = _a.val,
				step = _a.step;
			k += step;
			ret += val;
			if (k >= n) {
				break;
			}
		}
		return ret;
	};
	Phonita.prototype.parse = function (s) {
		if (s.length < 2) {
			return this.parseWord(s);
		}
		var list = s.split("");
		var box = [];
		var ret = "";
		var str = list[0];
		var flag = this.hasKey(str);
		for (var _i = 0, _a = list.slice(1); _i < _a.length; _i++) {
			var char = _a[_i];
			var charFlag = this.hasKey(char);
			if (flag === charFlag) {
				str += char;
			} else {
				box.push({ flag: flag, str: str });
				flag = charFlag;
				str = char;
			}
		}
		if (str.length > 0) {
			box.push({ flag: flag, str: str });
		}
		for (var _b = 0, box_1 = box; _b < box_1.length; _b++) {
			var _c = box_1[_b],
				flag_1 = _c.flag,
				str_1 = _c.str;
			ret += flag_1 ? this.parseWord(str_1) : str_1;
		}
		return ret;
	};
	Phonita.useInternalDictionary = function () {
		return new Phonita(`
Ʌ=a
ɅꞍ=ia

O=o
OꞍ=or

I=i
IꞍ=ie

П=u
ПꞍ=iu

Э=e
ЭꞍ=er

Є=ae
ЄꞍ=ei

Ә=au
ӘꞍ=ao

Ƃ=b
Г=p
М=m
ꟻ=f
Ф=ff

Ɵ=d
T=t
Ʈ=tt
И=n

Ꞁ=l
Ɯ=ll 

З=g
Ʞ=k
Ǝ=h
Ӈ=hh

ЗꞍ=j
ꞰꞍ=q
ƎꞍ=x


Ƶ=z
Ԑ=c
С=s
X=ss
Ɥ=r
Ш=rr

ƵꞍ=zh
ԐꞍ=ch
СꞍ=sh
ШꞍ=rh 

V=v
VꞍ=vr

Ƞ=ng

Ⱶ=wi
Ո=wn
ⵡ=wu
Н=w
Ӈ=ww
У=y
=^
        `);
	};
	return Phonita;
})();

var phonita = Phonita.useInternalDictionary();

function renderText(s, token = "::") {
	if (s.startsWith(token)) {
		return {
			text: phonita.parse(s.slice(2)),
			flag: 2,
		};
	} else if (s.startsWith("‹ " + token)) {
		return {
			text: "‹ " + phonita.parse(s.slice(4)),
			flag: 4,
		};
	} else {
		return {
			text: s,
			flag: 0,
		};
	}
}

function renderDOM(e, force = false) {
	const t = renderText(e.innerText);

	if (force) {
		e.innerText = phonita.parse(t.text);
		e.style.fontFamily = `Times New Roman, serif`;
		return;
	}

	if (t.flag === 0) {
		return;
	}

	e.innerText = t.text;

	e.style.fontFamily = `Times New Roman, serif`;
}

function renderPht(e) {
	const text = e.innerText;
	const el = typeof e.firstChild !== "string" ? e.firstChild : e;

	if (el.style) {
		el.style.fontFamily = `Times New Roman, serif`;
		el.innerText = phonita.parse(text);
	} else {
		el.parentElement.style.fontFamily = `Times New Roman, serif`;
		el.parentElement.innerText = phonita.parse(text);
	}
}

window.$phonita = {
	renderDOM,
	renderPht,
	renderText,
	internalApp() {},
};
