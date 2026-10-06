/* ============================================================
   SONY VENICE 2 – main.js
   [수정 가이드] 기능별로 구역이 나뉘어 있습니다. 불필요한 기능은 해당 구역만 삭제하세요.
   ============================================================ */
(function () {
  'use strict';

  /* ===== 0. JS 동작 표시 =====
     html에 .js 클래스를 붙이면 CSS의 등장 효과(.reveal)가 활성화됩니다. */
  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== 1. 헤더: 스크롤 시 배경 + 모바일 메뉴 토글 ===== */
  var header = document.getElementById('header');
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');

  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);          // 접근성 상태 갱신
  });
  nav.addEventListener('click', function (e) {             // 메뉴 항목 클릭 시 닫기
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ===== 2. 패럴랙스 =====
     .parallax 요소에 data-speed(0~1)만큼 스크롤 속도 차이를 줍니다.
     값이 클수록 배경이 더 많이 뒤처져 깊이감이 커집니다. */
  var layers = document.querySelectorAll('.parallax');
  var ticking = false;

  function onScroll() {
    header.classList.toggle('solid', window.scrollY > 40);
    if (!reduceMotion) {
      layers.forEach(function (el) {
        var box = el.parentElement.getBoundingClientRect();
        if (box.bottom < 0 || box.top > window.innerHeight) return;  // 화면 밖이면 계산 생략
        var speed = parseFloat(el.dataset.speed) || 0.3;
        el.style.transform = 'translate3d(0,' + (-box.top * speed).toFixed(1) + 'px,0)';
      });
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {          // 성능을 위해 프레임당 1회만 실행
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ===== 3. 스크롤 등장 효과 + 스펙 숫자 카운트업 =====
     .reveal 요소가 화면에 보이면 .in 클래스를 추가(CSS가 페이드/슬라이드 처리).
     요소 안에 data-count 가 있으면 숫자가 0에서 목표값까지 올라갑니다. */
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || 0, 10);           // 소수점 자릿수
    if (reduceMotion) { el.textContent = target.toFixed(dec); return; }
    var start = null, dur = 1400;
    (function step(t) {
      start = start || t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(dec);  // ease-out
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(en.target);                             // 한 번만 실행
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ===== 4. 제품 핫스팟 (호버 / 터치 / 키보드 포커스) =====
     핫스팟의 data-title, data-desc 내용을 툴팁에 표시합니다. */
  var tooltip = document.getElementById('tooltip');
  var spots = document.querySelectorAll('.hotspot');

  function showTip(spot) {
    tooltip.querySelector('b').textContent = spot.dataset.title;
    tooltip.querySelector('span').textContent = spot.dataset.desc;
    tooltip.classList.add('on');
  }
  function hideTip() { tooltip.classList.remove('on'); }

  spots.forEach(function (spot) {
    spot.addEventListener('mouseenter', function () { showTip(spot); });
    spot.addEventListener('mouseleave', hideTip);
    spot.addEventListener('focus', function () { showTip(spot); });
    spot.addEventListener('blur', hideTip);
    spot.addEventListener('click', function () { showTip(spot); });  // 모바일 터치용
  });

  /* ===== 5. Before / After 비교 슬라이더 =====
     range 입력값(0~100)을 CSS 변수 --pos 로 전달 → 원본 이미지를 잘라 보여줍니다. */
  var box = document.getElementById('compare-box');
  var range = document.getElementById('compareRange');
  function setPos() { box.style.setProperty('--pos', range.value + '%'); }
  range.addEventListener('input', setPos);
  setPos();

  /* ===== 6. 이미지 로드 실패 대비 =====
     외부 이미지가 열리지 않으면 어두운 배경으로 대체해 레이아웃이 깨지지 않게 합니다. */
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.visibility = 'hidden';
      if (img.parentElement) img.parentElement.style.background = '#1A1A1A';
    });
  });
/* ===== 7. 점 세개 마우스 호버 ===== */  
const productImage = document.getElementById("productImage");
const hotspots = document.querySelectorAll(".hotspot");

const defaultImage = productImage.src;

hotspots.forEach((hotspot) => {

  hotspot.addEventListener("mouseenter", () => {
    const image = hotspot.dataset.image;

    if (image) {
      productImage.src = image;
    }
  });

  hotspot.addEventListener("mouseleave", () => {
    productImage.src = defaultImage;
  });

});


})();
