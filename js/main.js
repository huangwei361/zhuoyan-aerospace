/* =========================================================
   逐焰航天 · 官网交互脚本 v1.0
   - i18n 中英切换（内容存 localStorage）
   - 导航滚动状态 / 移动端菜单 / 当前区块高亮
   - Hero 视差 / 滚动揭示动效
   ========================================================= */

(function () {
  "use strict";

  /* ------------------------------------------------------------
     i18n 文案表
     ------------------------------------------------------------ */
  var I18N = {
    zh: {
      "nav.missions": "三大使命",
      "nav.engine": "发动机",
      "nav.data": "卫星与数据",
      "nav.port": "航天港",
      "nav.roadmap": "路线图",
      "nav.careers": "招贤",
      "nav.contact": "联系",

      "hero.tag": "COMPANY BROCHURE · 2026",
      "hero.title1": "从一台发动机",
      "hero.title2": "到一整套基础设施",
      "hero.lead":
        "以液氧甲烷发动机、标准化卫星平台与行业数据服务，构建高频、可复用、可持续的天地运输网络。",
      "hero.cta1": "了解三大使命",
      "hero.cta2": "联系我们",
      "hero.s1": "首版发动机推力",
      "hero.s2": "海平面比冲",
      "hero.s3": "重复点火",
      "hero.s4": "公司宣传册",

      "m.eyebrow": "THREE MISSIONS",
      "m.title": "三条线，一个目标：<em>把发射变成日常</em>",
      "m.lead":
        "火箭、卫星、数据互为条件。没有高频发射，卫星运力无从谈起；没有在轨数据，发射能力无法变现；三者闭合，公司才成为基础设施。",
      "m.c1t": "重型可复用运载",
      "m.c1d":
        "从 150 kN 液氧甲烷验证机起步，沿同一工程血脉迭代到全尺寸可复用入轨火箭。每代继承上一代的推力室、涡轮泵、阀门、试验规程与数据资产。",
      "m.c1m1": "可复用",
      "m.c1m2": "液氧甲烷",
      "m.c2t": "轨道与深空基础设施",
      "m.c2d":
        "低轨星座是现金牛与能力验证场，月面中转与火面货运是十年后的第二曲线。三段式路径，每一站都建立在前一站的工程资产之上。",
      "m.c3t": "中国超级航天港",
      "m.c3d":
        "紧贴海岸、远离居民、能源充沛、轨道适配。旧工业骨架改造成新工业港口，多发射台支撑高频运营。",
      "m.c3m1": "主港候选",
      "m.c3m2": "次港",
      "m.c3m3": "高频发射",

      "e.eyebrow": "BLUE FLAME-1",
      "e.title": "蓝焰-1 液氧甲烷发动机",
      "e.p1":
        "100—300 kN 级可重复点火液氧甲烷验证机。再生冷却推力室、燃气发生器循环涡轮泵、硬件与软件双重紧急关机。",
      "e.p2":
        "第一年目标不是造出最强火箭，而是拿到公开、可复现、可对比的工程数据：燃烧稳定、推力调节、连续点火、遥测、安全联锁与寿命。",
      "e.k1": "海平面推力",
      "e.k2": "燃烧室压力",
      "e.k3": "推进剂",
      "e.k4": "比冲（海平面）",
      "e.k5": "重复点火",
      "e.k6": "推力调节",
      "e.k7": "单次燃烧",
      "e.k8": "整机重量",

      "d.eyebrow": "SATELLITE & DATA",
      "d.title": "把太空数据，<em>变成行业决策</em>",
      "d.lead":
        "100—200 kg 级模块化平台，太阳同步轨道，X 频段下行。9—12 个月交付，可搭载多光谱、高光谱或 SAR 载荷。",
      "d.e2": "PLATFORM",
      "d.t2": "标准化平台 + 模块化载荷",
      "d.p2":
        "首期与国内高校、院所的成熟平台合作，不自研大平台。首颗验证星可通过采购、合作或拼车发射获得在轨能力，把研发资源留给真正需要自研的部分。",
      "d.k1": "平台质量",
      "d.k2": "轨道",
      "d.k3": "设计寿命",
      "d.k4": "数据下行",
      "d.k5": "载荷",
      "d.k6": "交付方式",
      "d.e3": "EIGHT VERTICALS · 八大行业",

      "p.eyebrow": "SPACEPORT",
      "p.title": "中国超级航天港",
      "p.lead":
        "发射场是高频运营与重资产结合的护城河。一旦建成，是后来者难以复制的先发优势。",
      "p.e2": "FOUR HARD CONSTRAINTS",
      "p.t2": "选址的四项硬约束",
      "p.p2": "任何一项不满足，都不是“差一点”，而是不可行。这四条决定了候选地的排序。",
      "p.f1t": "紧贴海岸",
      "p.f1d": "故障弹道必须能进入无人海域，远离航线、渔场与岛屿。",
      "p.f2t": "远离居民",
      "p.f2d": "起飞噪音能震碎几公里外的玻璃，需 ≥ 10 km 人口缓冲。",
      "p.f3t": "能源充沛",
      "p.f3d": "甲烷燃料、液化、储存、回收、翻修与基地供电都是耗电大户。",
      "p.f4t": "轨道适配",
      "p.f4d": "太阳同步、低倾角与极地轨道，每一类载荷都挑剔轨道倾角。",

      "r.eyebrow": "ROADMAP",
      "r.title": "三年，从一台发动机<br/><em>到一整套基础设施</em>",
      "r.lead":
        "Year 01 解决“能不能造”，Year 02 解决“能不能持续造”，Year 03 解决“造出来能不能赚钱”。",
      "r.y1t": "造出一台能多次点火的发动机",
      "r.y1a": "团队组建 8—12 人",
      "r.y1b": "设计冻结 PDR / CDR",
      "r.y1c": "单组件 + 子系统试验",
      "r.y1d": "首次热试车 + 重复点火",
      "r.y1e": "首颗卫星合作签约",
      "r.y2t": "建出高频发射的工程体系",
      "r.y2a": "长程试验 100 s",
      "r.y2b": "多次复推 ≥ 5 次",
      "r.y2c": "试车台 · 危化品 · 数据闭环",
      "r.y2d": "试验合作方长期绑定",
      "r.y2e": "航天港选址与环评启动",
      "r.y3t": "把基础设施变成现金流",
      "r.y3a": "验证星在轨演示",
      "r.y3b": "数据 SaaS 商业化",
      "r.y3c": "5—10 颗商业卫星",
      "r.y3d": "航天港首座试验台建成",
      "r.y3e": "A 轮融资完成",

      "j.eyebrow": "JOIN US",
      "j.title": "和一群修路的人共事",
      "j.p":
        "所有核心岗位须实际全职，并签署《股东协议》《保密协议》《竞业限制协议》。期权池 10%—15%，分四期授予，四年归属。",
      "j.j1t": "推进系统主任工程师",
      "j.j1d": "液氧甲烷 · 涡轮泵 · 试验",
      "j.j2t": "试验运营负责人",
      "j.j2d": "试车台 · 危化品 · 空域协调",
      "j.j3t": "航电 · 飞控负责人",
      "j.j3d": "FPGA · 嵌入式 · 遥测",
      "j.j4t": "结构 · 热防护负责人",
      "j.j4d": "贮箱 · 箭体 · 复合材料",
      "j.j5t": "制造 · 供应链负责人",
      "j.j5d": "工艺 · 质量 · 供应商",
      "j.j6t": "商业 · 卫星业务负责人",
      "j.j6d": "客户拓展 · 数据产品 · 订阅",

      "c.eyebrow": "CONTACT",
      "c.title": "联系我们",
      "c.lead": "欢迎投资人、行业伙伴、潜在联合创始人投递合作意向。",
      "c.f1": "称呼",
      "c.f2": "机构 / 公司",
      "c.f3": "邮箱",
      "c.f4": "合作类型",
      "c.f5": "留言",
      "c.o1": "投资",
      "c.o2": "技术与供应链合作",
      "c.o3": "数据采购",
      "c.o4": "加入团队",
      "c.o5": "政府与园区对接",
      "c.submit": "发送",
      "c.note": "本站为静态页面，表单需接入第三方表单服务后才能实际收信。",
      "c.l2": "电话",
      "c.l3": "地址",
      "c.v3": "北京市 · 海淀区 · 中关村",

      "f.legal":
        "逐焰航天处于筹备阶段。网站所载参数、预算与时间表均为规划量级，不构成要约或承诺。公司注册、发射许可、卫星频率使用与危险化学品相关审批尚未完成。"
    },

    en: {
      "nav.missions": "Missions",
      "nav.engine": "Engine",
      "nav.data": "Satellite & Data",
      "nav.port": "Spaceport",
      "nav.roadmap": "Roadmap",
      "nav.careers": "Careers",
      "nav.contact": "Contact",

      "hero.tag": "COMPANY BROCHURE · 2026",
      "hero.title1": "From one engine",
      "hero.title2": "To an entire infrastructure",
      "hero.lead":
        "Liquid oxygen–methane engines, standardized satellite platforms and industry data services — building a high-frequency, reusable, sustainable network for moving payloads to and from space.",
      "hero.cta1": "Explore the missions",
      "hero.cta2": "Get in touch",
      "hero.s1": "First-stage thrust",
      "hero.s2": "Sea-level Isp",
      "hero.s3": "Re-ignitions",
      "hero.s4": "Brochure pages",

      "m.eyebrow": "THREE MISSIONS",
      "m.title": "Three lines, one goal: <em>make launching routine</em>",
      "m.lead":
        "Rockets, satellites and data are mutually dependent. Without frequent launch there is no orbital capacity; without in-orbit data, launch capability cannot be monetized. Only when all three close the loop does the company become infrastructure.",
      "m.c1t": "Heavy reusable launch",
      "m.c1d":
        "Starting from a 150 kN liquid oxygen–methane demonstrator and iterating along one engineering lineage to fully reusable orbital launch. Each generation inherits the previous one's thrust chamber, turbopump, valves, test procedures and data assets.",
      "m.c1m1": "Reusable",
      "m.c1m2": "LOX / LCH4",
      "m.c2t": "Orbital & deep-space infrastructure",
      "m.c2d":
        "A LEO constellation is both the cash engine and the proving ground; lunar relay and Mars cargo are the second curve a decade out. Each stage stands on the engineering assets of the last.",
      "m.c3t": "China's super spaceport",
      "m.c3d":
        "Hard against the coast, far from people, energy-rich, orbit-compatible. Legacy industrial fabric converted into a new industrial port, with multiple pads supporting high-frequency operations.",
      "m.c3m1": "Primary candidate",
      "m.c3m2": "Secondary",
      "m.c3m3": "High-frequency",

      "e.eyebrow": "BLUE FLAME-1",
      "e.title": "Blue Flame-1 LOX/methane engine",
      "e.p1":
        "A 100—300 kN re-ignitable methalox demonstrator: regenerative-cooled thrust chamber, gas-generator-cycle turbopump, and hardware-plus-software emergency shutdown.",
      "e.p2":
        "The first year's goal is not the most powerful engine — it is public, reproducible, comparable engineering data: combustion stability, thrust modulation, repeated ignition, telemetry, safety interlocks and life.",
      "e.k1": "Sea-level thrust",
      "e.k2": "Chamber pressure",
      "e.k3": "Propellant",
      "e.k4": "Specific impulse (SL)",
      "e.k5": "Re-ignition",
      "e.k6": "Thrust modulation",
      "e.k7": "Burn duration",
      "e.k8": "Unit mass",

      "d.eyebrow": "SATELLITE & DATA",
      "d.title": "Turn orbital data <em>into industry decisions</em>",
      "d.lead":
        "A 100—200 kg modular platform in sun-synchronous orbit with X-band downlink. Delivered in 9—12 months, carrying multispectral, hyperspectral or SAR payloads.",
      "d.e2": "PLATFORM",
      "d.t2": "Standardized bus, modular payload",
      "d.p2":
        "In the first phase we partner with mature domestic university and institute platforms rather than developing a large bus ourselves. The first demonstrator reaches orbit by procurement, cooperation or rideshare, keeping scarce R&D capacity on what genuinely must be ours.",
      "d.k1": "Bus mass",
      "d.k2": "Orbit",
      "d.k3": "Design life",
      "d.k4": "Downlink",
      "d.k5": "Payloads",
      "d.k6": "Delivery",
      "d.e3": "EIGHT VERTICALS",

      "p.eyebrow": "SPACEPORT",
      "p.title": "China's super spaceport",
      "p.lead":
        "A launch site is where high-frequency operations meet heavy assets. Once built, it is a first-mover advantage that competitors find hard to replicate.",
      "p.e2": "FOUR HARD CONSTRAINTS",
      "p.t2": "Four constraints on siting",
      "p.p2":
        "Failing any one of them is not a matter of degree — it is infeasible. These four decide the ranking of candidate sites.",
      "p.f1t": "Hard against the coast",
      "p.f1d": "A failed trajectory must reach open water, clear of shipping lanes, fishing grounds and islands.",
      "p.f2t": "Far from people",
      "p.f2d": "Liftoff noise shatters glass kilometres away; a population buffer of 10 km or more is required.",
      "p.f3t": "Energy-rich",
      "p.f3d": "Methane liquefaction, storage, recovery, refurbishment and base power are all energy-hungry.",
      "p.f4t": "Orbit-compatible",
      "p.f4d": "Sun-synchronous, low-inclination and polar orbits — every payload class has its inclination demands.",

      "r.eyebrow": "ROADMAP",
      "r.title": "Three years: from one engine<br/><em>to a complete infrastructure</em>",
      "r.lead":
        "Year 01 answers “can we build it”, Year 02 “can we build it repeatedly”, Year 03 “can we make money from it”.",
      "r.y1t": "Build an engine that re-ignites",
      "r.y1a": "Assemble a team of 8—12",
      "r.y1b": "Freeze design: PDR / CDR",
      "r.y1c": "Component + subsystem tests",
      "r.y1d": "First hot fire + re-ignition",
      "r.y1e": "Sign the first satellite partner",
      "r.y2t": "Build a high-frequency launch system",
      "r.y2a": "100 s long-duration burn",
      "r.y2b": "5+ repeat firings",
      "r.y2c": "Test stand, propellant, data loop",
      "r.y2d": "Long-term test partners",
      "r.y2e": "Spaceport siting and EIA",
      "r.y3t": "Turn infrastructure into cash flow",
      "r.y3a": "Demonstrator in orbit",
      "r.y3b": "Data SaaS commercialization",
      "r.y3c": "5—10 commercial satellites",
      "r.y3d": "First spaceport test stand",
      "r.y3e": "Series A closed",

      "j.eyebrow": "JOIN US",
      "j.title": "Work with people who build the road",
      "j.p":
        "All core roles require full-time commitment and signed shareholder, confidentiality and non-compete agreements. The option pool is 10%—15%, granted in four tranches over four years.",
      "j.j1t": "Head of Propulsion",
      "j.j1d": "Methalox · turbopump · testing",
      "j.j2t": "Head of Test Operations",
      "j.j2d": "Test stand · hazardous materials · airspace",
      "j.j3t": "Head of Avionics & GNC",
      "j.j3d": "FPGA · embedded · telemetry",
      "j.j4t": "Head of Structures & TPS",
      "j.j4d": "Tanks · airframe · composites",
      "j.j5t": "Head of Manufacturing & Supply",
      "j.j5d": "Process · quality · suppliers",
      "j.j6t": "Head of Business & Satellite",
      "j.j6d": "Customers · data products · subscriptions",

      "c.eyebrow": "CONTACT",
      "c.title": "Get in touch",
      "c.lead":
        "We welcome investors, industry partners and prospective co-founders.",
      "c.f1": "Name",
      "c.f2": "Organization",
      "c.f3": "Email",
      "c.f4": "Topic",
      "c.f5": "Message",
      "c.o1": "Investment",
      "c.o2": "Technical or supply partnership",
      "c.o3": "Data purchase",
      "c.o4": "Joining the team",
      "c.o5": "Government or park liaison",
      "c.submit": "Send",
      "c.note":
        "This site is static; the form needs a third-party form service before it can actually receive mail.",
      "c.l2": "Phone",
      "c.l3": "Address",
      "c.v3": "Zhongguancun, Haidian, Beijing",

      "f.legal":
        "Zhuoyan Aerospace is in its preparatory stage. All parameters, budgets and schedules on this site are planning estimates and constitute neither an offer nor a commitment. Company registration, launch licensing, satellite frequency use and hazardous-chemicals approvals are not yet complete."
    }
  };

  /* ------------------------------------------------------------
     工具
     ------------------------------------------------------------ */
  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };
  var STORAGE_KEY = "zhuoyan-lang";

  /* ------------------------------------------------------------
     i18n
     ------------------------------------------------------------ */
  function applyLang(lang) {
    var dict = I18N[lang] || I18N.zh;

    // 中文直接写在 HTML 里；切英文时用字典覆盖，切回中文时用 zh 字典还原
    // （中英键名一一对应，所以同一个 key 即可）
    $$("[data-i18n-en]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-en");
      if (!key) return;
      if (lang === "en") {
        if (dict[key] !== undefined) el.innerHTML = dict[key];
      } else {
        if (I18N.zh[key] !== undefined) el.innerHTML = I18N.zh[key];
      }
    });

    document.documentElement.setAttribute("lang", lang === "en" ? "en" : "zh-CN");

    $$(".lang-switch__btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* 隐私模式下忽略 */
    }
  }

  function initLang() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* noop */
    }
    if (!saved) {
      saved = (navigator.language || "zh").toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
    }
    applyLang(saved);

    $$(".lang-switch__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
      });
    });
  }

  /* ------------------------------------------------------------
     导航
     ------------------------------------------------------------ */
  function initNav() {
    var nav = $("#nav");
    var toggle = $("#navToggle");
    var links = $("#navLinks");

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    $$(".nav__link").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    // 滚动状态
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // 当前区块高亮
    var sections = $$("main section[id]");
    var navLinks = $$(".nav__link");
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }

  /* ------------------------------------------------------------
     Hero 视差
     ------------------------------------------------------------ */
  function initParallax() {
    var bg = $("#heroBg");
    if (!bg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var ticking = false;
    var update = function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        bg.style.transform = "translateY(" + y * 0.28 + "px)";
      }
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------
     滚动揭示
     ------------------------------------------------------------ */
  function initReveal() {
    var items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------
     表单（静态站：提示需接后端）
     ------------------------------------------------------------ */
  function initForm() {
    var form = $("#contactForm");
    if (!form) return;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var email = $("#fEmail").value.trim();
      var name = $("#fName").value.trim();
      var msg = $("#fMsg").value.trim();

      if (!name || !email || !msg) {
        alert("请填写称呼、邮箱与留言。");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("邮箱格式不正确。");
        return;
      }

      var topic = $("#fTopic").value;
      var subject = encodeURIComponent("[逐焰航天] " + topic + " · " + name);
      var body = encodeURIComponent(
        "称呼：" + name + "\n机构：" + $("#fOrg").value + "\n邮箱：" + email +
        "\n类型：" + topic + "\n\n" + msg
      );
      window.location.href = "mailto:info@zhuoyan-aerospace.com?subject=" + subject + "&body=" + body;
    });
  }

  /* ------------------------------------------------------------
     启动
     ------------------------------------------------------------ */
  function boot() {
    initLang();
    initNav();
    initParallax();
    initReveal();
    initForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
