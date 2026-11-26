/* =========================================================
   PROSKILLS · TRANG CHỦ (hub.js)
   Màn hình: Chào mừng + nhập thông tin (lần đầu) → Trang chủ
   PS1.3.28: thanh trên (chuỗi ngày; PS1.3.58: ảnh đại diện = ô Sổ tay ở thanh đáy, mở Cài đặt) → lời chào → khối Shin Routine (nút Check-in mở routine/?ci=1#checkin)
             → Lịch học → Khóa học (XP, Insight, phút hôm nay + băng chuyền thẻ kiểu labs.google: KC, kcLayout, kcGo) → Hướng dẫn
   PS1.3.54: trang chủ chia 3 thẻ ở thanh đáy (TAB): Hôm nay (lời chào, khối Shin, Học tiếp) · Khóa học (3 ô số, băng chuyền, Hướng dẫn) · Lịch học.
             Thẻ đang xem nhớ trong phiên (sessionStorage ps.tab); nút Back Android ở thẻ 2, 3 về Hôm nay.
   Cửa Rèn luyện (PS1.3.25): mở Proskills mà hôm nay chưa đóng dấu Shin Routine thì vào thẳng routine/ (mỗi phiên một lần)
   Lớp phủ: Cổng mật khẩu module · Cài đặt (thẻ chuẩn của lõi)
   Không chứa nội dung bài học. Danh sách module đọc từ config.js.
   ========================================================= */
(function (W, D) {
  'use strict';
  var PS = W.PS, CFG = PS.cfg, esc = PS.esc, icon = PS.icon;
  var APP = D.getElementById('app');
  var QS = (function () { var o = {}; (location.search || '').replace(/^\?/, '').split('&').forEach(function (p) { if (!p) return; var kv = p.split('='); o[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || ''); }); return o; })();
  var SHOW_HIDDEN = QS.thu === '1';
  var WANT = QS.m || '';
  /* bỏ ?m= khỏi địa chỉ để nút Back không mở lại cổng */
  if (WANT) { try { history.replaceState(null, '', location.pathname + (SHOW_HIDDEN ? '?thu=1' : '')); } catch (e) {} }
  var noMotion = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Logo Proskills (PS1.3.67): chữ O lá xanh 2C4, bản không nền (icons/logo.svg, viewBox sát hình); icon app = nền đồi nghiêng 2C4 */
  function logo(sz) {
    sz = sz || 40;
    return '<img class="hub-logo" src="' + PS.url('icons/logo.svg') + '" width="' + sz + '" height="' + sz + '" alt="">';
  }
  function visibleMods() { return PS.modules().filter(function (m) { return m.kind !== 'routine' && (m.state !== 'hidden' || SHOW_HIDDEN); }); }

  /* ---------------- Shin Routine: thẻ Rèn luyện hôm nay + cửa Rèn luyện ---------------- */
  function routineMod() { var m = PS.mod('routine'); return m && m.state === 'ready' ? m : null; }
  function routineInfo() {
    var s = PS.summary('routine'), x = (s && s.extra) || null, t = PS.today();
    return { x: x, isT: !!(x && x.day === t), rec: !!(x && x.day === t && x.rec) };
  }
  /* Vào thẳng Rèn luyện khi: có hồ sơ, hôm nay chưa đóng dấu, còn thẻ cần ghi nhận, phiên này chưa vào lần nào */
  function doorNeeded() {
    var m = routineMod(); if (!m || !m.door) return false;
    if (PS.needProfile() || WANT || QS.lich || SHOW_HIDDEN) return false;
    var t = PS.today();
    try { if (W.sessionStorage.getItem('ps.door') === t) return false; } catch (e) { return false; }
    var r = routineInfo();
    if (r.rec || (r.x && r.x.need === false)) return false;
    return true;
  }
  var MARK = { y: 'Đã làm', p: 'Một phần', n: 'Chưa làm', x: 'Không có dịp' };
  /* PS1.3.28: tên gọi = 2 chữ cuối (Nguyễn Thị Quỳnh Anh → Quỳnh Anh); họ tên 2 chữ thì lấy chữ cuối */
  function shortName() {
    var n = String(PS.profile().name || '').trim().split(/\s+/);
    if (!n[0]) return 'bạn';
    return n.length >= 3 ? n.slice(-2).join(' ') : n[n.length - 1];
  }
  /* PS1.3.28: khối Shin Routine đứng đầu trang chủ; nút Check-in mở thẳng check-in hôm nay (routine/#checkin) */
  function ciInfo(r) {
    var x = r.x, done = !!(r.isT && (x.ci || (x.ci === undefined && x.rec)));
    return { done: done, time: (x && x.ciTime) || '21:00' };
  }
  function routineHTML() {
    var m = routineMod(); if (!m) return '';
    var r = routineInfo(), x = r.x || {}, n = x.active || 0, nm = '<b>' + esc(shortName()) + '</b>', ci = ciInfo(r), bub, md;
    /* PS1.3.36: Shin là gà lớn dần (core/shin.js); biểu cảm theo tình trạng hôm nay */
    var lk = W.PSShin ? W.PSShin.look() : null;
    if (!x.habits) { bub = 'Chào ' + nm + '! Mình là Shin' + (lk && lk.stg === 0 ? ', đang còn trong trứng. Ghi nhận đều, mình sẽ nở' : '') + '. Cùng rèn thói quen tốt nhé.'; md = 'hi'; }
    else if (ci.done) { bub = 'Check-in xong rồi. Giữ nhịp nhé ' + nm + '!'; md = 'cheer'; }
    else if (!n) { bub = 'Chưa có thẻ đang rèn. Chọn thêm thẻ nhé ' + nm + '.'; md = 'curious'; }
    else { bub = 'Hôm nay chưa check-in đó ' + nm + '. 30 giây thôi!'; md = 'waiting'; }
    var chips = (x.cards && x.cards.length) ? '<div class="shn__chips">' + x.cards.map(function (c) {
      var mk = r.isT && c.m ? c.m : '';
      return '<span class="rt-chip rt-chip--' + (mk || 'none') + '" title="' + esc(MARK[mk] || 'Chưa ghi nhận') + '"><i aria-hidden="true"></i>' + esc(c.n) + '</span>';
    }).join('') + '</div>' : '';
    var btn = ci.done ?
      '<button type="button" class="shn__ci shn__ci--done" data-act="ci">' + icon('check', 20, 2.6) + '<span>Đã check-in hôm nay</span></button>' :
      '<button type="button" class="shn__ci" data-act="ci" aria-label="Check-in lúc ' + esc(ci.time) + '">' +
        '<svg class="ps-ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>' +
        '<span>Check-in</span><small>' + esc(ci.time) + '</small></button>';
    return '<section class="shn" style="--i:1"><div class="shn__card" data-act="mod" data-id="routine" role="link" tabindex="0" aria-label="Mở Shin Routine">' +
      '<small class="shn__k">RÈN LUYỆN CÙNG SHIN</small>' +
      '<h2 class="shn__t">' + (ci.done ? 'Lửa vẫn cháy!' : 'Giữ lửa hôm nay') + '<svg class="shn__sw" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true"><path d="M3 7C55 2 140 1.5 197 5.5"/></svg></h2>' +
      '<div class="shn__row">' + (lk ? '<span class="shn__shin shn__shin--g">' + W.PSShin.svg(md, { stg: lk.stg, fit: lk.fit, days: lk.days }) + '</span>' : '<img class="shn__shin" src="' + PS.url('routine/icon-192.png') + '" width="56" height="56" alt="">') + '<p class="shn__bub">' + bub + '</p></div>' +
      chips + btn + '</div></section>';
  }
  function goCheckin() {
    D.body.classList.add('leaving');
    try { W.sessionStorage.setItem('ps.nav', 'routine'); } catch (e) {} /* PS1.3.55: ‹ Proskills của Shin quay lại đúng trang chủ */
    setTimeout(function () { W.location.href = PS.url('routine/index.html') + '?ci=1#checkin'; }, noMotion ? 0 : 160);
  }

  /* ---------------- Chào mừng + thông tin ---------------- */
  function vWelcome() {
    var p = PS.profile();
    var paths = (CFG.PATHS || []).map(function (x) { return '<option' + (p.path === x ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('');
    return '<section class="onb enter">' +
      '<div class="onb__brand" style="--i:0">' + logo(64) + '<div><small>' + esc(CFG.ORG) + '</small><h1>' + esc(CFG.APP) + '</h1></div></div>' +
      '<p class="onb__lead" style="--i:1">Nơi bạn học các khóa kỹ năng trước khi sang Nhật. Nhập thông tin <b>một lần</b>, dùng cho mọi khóa học.</p>' +
      '<div class="card onb__form" style="--i:2"><div class="ps-form">' +
      '<label>Họ và tên<input class="ps-inp" id="fName" maxlength="40" autocomplete="name" placeholder="Ví dụ: Nguyễn Văn An" value="' + esc(p.name) + '"></label>' +
      '<div class="ps-row2"><label>Năm sinh<input class="ps-inp" id="fBy" inputmode="numeric" maxlength="4" placeholder="2005" value="' + esc(p.by) + '"></label>' +
      '<label>Mã học viên<input class="ps-inp" id="fSid" maxlength="30" placeholder="Nếu đã có" value="' + esc(p.sid) + '"></label></div>' +
      '<div class="ps-row2"><label>Lớp<input class="ps-inp" id="fCls" maxlength="20" placeholder="Ví dụ: E696" value="' + esc(p.cls) + '"></label>' +
      '<label>Diện<select class="ps-inp" id="fPath"><option value="">Chọn diện</option>' + paths + '</select></label></div>' +
      '<label>Thầy cô hướng dẫn' + PS.teacherSelect('id="fT"') + '</label>' +
      '</div><p class="ps-small">Họ tên, năm sinh, mã học viên ít khi đổi. Lớp, diện, thầy cô đổi được bất cứ lúc nào trong Cài đặt.</p>' +
      '<p class="onb__err" id="fErr" role="alert"></p>' +
      '<button type="button" class="ps-btn hub-wide" data-act="onbGo">Vào ' + esc(CFG.APP) + ' ' + icon('next', 18) + '</button></div>' +
      '<button type="button" class="ps-link onb__restore" style="--i:3" data-act="restore">' + icon('upload', 16) + ' Đã học trên máy khác? Khôi phục từ bản sao lưu</button>' +
      '</section>';
  }
  function onbGo() {
    var n = D.getElementById('fName').value.trim(), y = D.getElementById('fBy').value.trim(), s = D.getElementById('fSid').value.trim(),
      c = D.getElementById('fCls').value.trim(), pa = D.getElementById('fPath').value, t = D.getElementById('fT').value, err = '';
    if (n.split(/\s+/).length < 2) err = 'Nhập đủ họ và tên nhé.';
    else if (!PS.checkYear(y)) err = 'Năm sinh gồm 4 số, ví dụ 2005.';
    else if (!c) err = 'Nhập lớp của bạn nhé.';
    var e = D.getElementById('fErr'); e.textContent = err;
    if (err) return;
    PS.setProfile({ name: n, by: y, sid: s, cls: c, path: pa, teacher: t });
    PS.toast('Chào <b>' + esc(shortName()) + '</b>! Chọn khóa học để bắt đầu nhé.');
    render(true);
    if (WANT) { var w = WANT; WANT = ''; setTimeout(function () { openMod(w); }, 400); }
  }

  /* ---------------- Trang chủ ---------------- */
  function greet() {
    var h = new Date().getHours();
    return h < 11 ? 'Chào buổi sáng' : (h < 14 ? 'Chào buổi trưa' : (h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'));
  }
  function modState(m) {
    var s = PS.summary(m.id) || {}, total = s.total || m.total || 0, done = s.done || 0;
    var pct = total ? Math.min(100, Math.round(done / total * 100)) : 0;
    var st = m.state === 'soon' ? 'soon' : (!PS.isUnlocked(m.id) ? 'lock' : (done === 0 && !s.xp ? 'new' : (pct >= 100 ? 'done' : 'go')));
    return { s: s, total: total, done: done, pct: pct, st: st };
  }
  /* pha màu thẻ khóa học (không dùng color-mix để chạy trên máy cũ) */
  function mix(a, b, t) {
    function rgb(h) { h = String(h).replace('#', ''); if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2); var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
    var x = rgb(a), y = rgb(b), o = '#';
    for (var j = 0; j < 3; j++) { var v = Math.round(x[j] + (y[j] - x[j]) * t).toString(16); o += v.length < 2 ? '0' + v : v; }
    return o;
  }
  /* ---------------- PS1.3.28 · Khóa học: thẻ dọc có tranh, xếp quạt, vuốt ngang (kiểu labs.google) ---------------- */
  var ART = {
    cd01: '<svg viewBox="0 0 240 150" aria-hidden="true"><g class="kc-float"><rect x="22" y="34" width="196" height="88" rx="14" fill="#fff"/><path d="M168 34v88" stroke="#EBD9A6" stroke-width="2" stroke-dasharray="5 5"/><circle cx="168" cy="34" r="7" fill="#FFE29A"/><circle cx="168" cy="122" r="7" fill="#FFDA85"/>' +
      '<text x="38" y="70" font-family="Nunito,sans-serif" font-weight="900" font-size="22" fill="#2C5BC4">JPC → 日本</text><text x="38" y="94" font-family="Be Vietnam Pro,sans-serif" font-size="10.5" fill="#7A7F8C">Vé hành trình của bạn</text>' +
      '<circle cx="194" cy="78" r="15" fill="#2C5BC4"/><path d="m187 78 5 5 9-9" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '<g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"><path d="M30 18l6 8M50 12l2 9M212 16l-6 8"/></g></svg>',
    tk: '<svg viewBox="0 0 240 150" aria-hidden="true"><circle cx="168" cy="44" r="20" fill="#FF8A7A"/><path d="M28 126 96 52l26 22 22-18 70 70z" fill="#4E63E0"/><path d="m96 52-16 17 10 2 6-6 7 6 9-1z" fill="#fff"/><path d="m144 56-9 7 6 1 3-3 4 3 5-1z" fill="#fff" opacity=".9"/>' +
      '<g class="kc-float"><path d="M40 98h44" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/><path d="M150 26h34" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".75"/></g><path d="M20 132c40-10 80 6 120-2s60-8 82 0" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="2 8" stroke-linecap="round"/></svg>',
    tc01: '<svg viewBox="0 0 240 150" aria-hidden="true"><g class="kc-float"><g transform="rotate(-16 120 76)"><rect x="56" y="70" width="128" height="12" rx="6" fill="#2E7D55"/><rect x="62" y="44" width="20" height="64" rx="8" fill="#348A5F"/><rect x="44" y="54" width="16" height="44" rx="7" fill="#4FA77A"/><rect x="158" y="44" width="20" height="64" rx="8" fill="#348A5F"/><rect x="180" y="54" width="16" height="44" rx="7" fill="#4FA77A"/></g></g>' +
      '<path d="M178 104l20 32h-40z" fill="#fff"/><rect x="170" y="122" width="16" height="14" rx="2" fill="#2F3B35"/><circle cx="46" cy="30" r="9" fill="#fff" opacity=".8"/><circle cx="208" cy="28" r="5" fill="#fff" opacity=".8"/></svg>',
    /* PS1.3.54: thuyền buồm + la bàn, nền đất nung theo màu CD02 */
    cd02: '<svg viewBox="0 0 240 150" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"><path d="M26 22l6 8M46 14l2 9"/></g>' +
      '<g class="kc-float kc-float--b"><circle cx="192" cy="40" r="20" fill="#fff"/><circle cx="192" cy="40" r="20" fill="none" stroke="#C15F3C" stroke-width="3.5"/><path d="m200 30-5 12-11 6 5-12z" fill="#C15F3C"/><circle cx="192" cy="40" r="2.6" fill="#fff"/></g>' +
      '<g class="kc-float"><path d="M120 30v70" stroke="#7A3E26" stroke-width="3.4" stroke-linecap="round"/><path d="M120 28l14 4.5-14 4.5z" fill="#E9A15B"/><path d="M124 40c18 14 30 32 34 54h-34z" fill="#fff"/><path d="M116 48c-12 12-20 28-22 46h22z" fill="#fff" opacity=".92"/>' +
      '<path d="M66 100h108l-15 20H81z" fill="#C15F3C"/><path d="M66 100h108l-3 4H69z" fill="#9E4A2C"/><circle cx="100" cy="110" r="3" fill="#F6E6DD"/><circle cx="114" cy="110" r="3" fill="#F6E6DD"/></g>' +
      '<path d="M30 128c10-6 20-6 30 0s20 6 30 0 20-6 30 0 20 6 30 0 20-6 30 0 20 6 30 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".85"/><path d="M48 142c10-5 20-5 30 0s20 5 30 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/></svg>'
  };
  var ART_BG = { cd01: 'linear-gradient(160deg,#FFEDB5,#FFD27A)', tk: 'linear-gradient(160deg,#E6E4FF,#C9C6FF)', tc01: 'linear-gradient(160deg,#DDF5E6,#B4E6C8)', cd02: 'linear-gradient(160deg,#F7E7DC,#E7BFA5)' };
  function num(n) { return String(n || 0).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function artHTML(m) {
    return ART[m.id] || '<svg viewBox="0 0 240 150" aria-hidden="true"><circle class="kc-float" cx="120" cy="75" r="46" fill="#fff"/></svg><span class="kc__bigic">' + icon(m.icon, 54, 1.8) + '</span>';
  }
  function kcardHTML(m) {
    var k = modState(m), mc = m.color || '#24307A';
    var cta = { soon: 'Sắp ra mắt', lock: icon('lock', 15) + ' Mở khóa', 'new': 'Bắt đầu ' + icon('next', 15, 2.4), go: 'Học tiếp ' + icon('next', 15, 2.4), done: 'Ôn lại ' + icon('next', 15, 2.4) }[k.st];
    var meta = k.st === 'soon' ? '<span class="kc__note">Đang xây dựng</span>' :
      (k.st === 'lock' ? '<span class="kc__note">' + icon('info', 14) + ' Thầy cô cho mật khẩu khi bắt đầu khóa tại lớp</span>' :
        '<div class="kc__bar"><i style="width:' + k.pct + '%"></i></div>');
    var info = (k.st === 'go' || k.st === 'new' || k.st === 'done') ? '<span>' + k.done + (k.total ? '/' + k.total : '') + ' hoạt động</span>' : '<span></span>';
    return '<article class="kc__card kc--' + k.st + '" data-act="mod" data-id="' + esc(m.id) + '" style="--mc:' + esc(mc) + ';--md:' + mix(mc, '#0B1233', 0.28) + ';--mt:' + mix(mc, '#FFFFFF', 0.88) + ';--ma:' + mix(mc, '#FFFFFF', 0.8) + '">' +
      '<div class="kc__art"' + (ART_BG[m.id] ? ' style="background:' + ART_BG[m.id] + '"' : '') + '>' + artHTML(m) + (k.st === 'done' ? '<span class="kc__stamp">' + icon('check', 14, 3) + ' Hoàn thành</span>' : '') + '</div>' +
      '<div class="kc__body"><span class="kc__code">' + esc(m.code) + (m.state === 'hidden' ? ' · ẩn' : '') + '</span>' +
      '<h3>' + esc(m.title) + '</h3><p>' + esc(m.sub) + '</p>' + meta +
      '<div class="kc__ft">' + info + '<b class="kc__go">' + cta + '</b></div></div></article>';
  }
  /* thứ tự thẻ: khóa học được trước, khóa sắp ra mắt sau cùng */
  function carMods() {
    var a = visibleMods(), r = [], s = [];
    a.forEach(function (m) { (m.state === 'soon' ? s : r).push(m); });
    return r.concat(s);
  }
  function carouselHTML(mods) {
    if (!mods.length) return '';
    return '<section class="kc" style="--i:5" aria-roledescription="carousel" aria-label="Khóa học của bạn">' +
      '<span class="kc__blob kc__blob--a" aria-hidden="true"></span><span class="kc__blob kc__blob--b" aria-hidden="true"></span>' +
      '<div class="kc__stage" id="kcStage">' + mods.map(kcardHTML).join('') + '</div>' +
      (mods.length > 1 ? '<div class="kc__nav"><button type="button" class="kc__arr" data-act="kcPrev" aria-label="Khóa trước">' + icon('back', 20, 2.4) + '</button>' +
        '<button type="button" class="kc__arr" data-act="kcNext" aria-label="Khóa sau">' + icon('next', 20, 2.4) + '</button></div>' : '') +
      '</section>';
  }

  /* băng chuyền: vị trí thẻ tính theo khoảng cách d tới thẻ giữa; vòng tròn khi có từ 4 thẻ */
  var KC = { i: -1, st: null, n: 0, loop: false, dir: 1 };
  function kcStart(mods) {
    var st = D.getElementById('kcStage'); KC.st = st; if (!st) return;
    KC.n = mods.length; KC.loop = KC.n >= 4;
    if (KC.i < 0 || KC.i >= KC.n) {
      var pick = -1;
      try { var sv = W.sessionStorage.getItem('ps.kc'); if (sv) mods.forEach(function (m, j) { if (m.id === sv) pick = j; }); } catch (e) {}
      if (pick < 0) mods.forEach(function (m, j) { if (pick < 0 && modState(m).st === 'go') pick = j; });
      if (pick < 0) mods.forEach(function (m, j) { if (pick < 0 && modState(m).st === 'new') pick = j; });
      KC.i = pick < 0 ? 0 : pick;
    }
    kcLayout(0, true);
    kcWire(st);
  }
  function kcNorm(d) {
    if (!KC.loop) return d;
    var h = KC.n / 2;
    if (KC.dir >= 0) { while (d < -h) d += KC.n; while (d >= h) d -= KC.n; }
    else { while (d <= -h) d += KC.n; while (d > h) d -= KC.n; }
    return d;
  }
  function kcPlace(c, d) {
    var a = Math.abs(d), w = KC.st.offsetWidth, cw = c.offsetWidth || 262;
    var step = w < 600 ? cw * 0.9 : cw + Math.max(14, Math.min(44, w * 0.04));
    var ty = Math.min(a, 2) * 22, rot = d * 6, sc = 1 - Math.min(a, 2) * 0.05;
    var op = a <= 1 ? 1 : Math.max(0, 1 - (a - 1) / 0.55);
    var tf = 'translate(' + (d * step).toFixed(1) + 'px,' + ty.toFixed(1) + 'px) rotate(' + rot.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
    c.style.webkitTransform = tf; c.style.transform = tf; c.style.opacity = op.toFixed(3);
    c.style.zIndex = String(20 - Math.round(a * 4));
    c.style.visibility = op < 0.01 ? 'hidden' : 'visible';
  }
  /* frac: phần thẻ đang kéo (dương = kéo sang thẻ sau); instant: không chuyển động */
  function kcLayout(frac, instant) {
    var st = KC.st; if (!st) return;
    var cs = st.children, i, c, d, jump = [];
    for (i = 0; i < cs.length; i++) {
      c = cs[i]; d = kcNorm(i - KC.i - frac);
      if (!KC.loop) d = i - KC.i - frac;
      var old = c._d;
      if (!instant && old !== undefined && Math.abs(d - old) > 1.5) jump.push([c, d]);
      else {
        c.style.transition = instant ? 'none' : '';
        kcPlace(c, d);
      }
      c._d = d;
      var on = Math.round(d) === 0 && Math.abs(d) < 0.5;
      if (on) c.classList.add('is-on'); else c.classList.remove('is-on');
      c.setAttribute('aria-hidden', Math.abs(d) > 1.2 ? 'true' : 'false');
    }
    /* thẻ vòng lại: đặt sẵn ngoài mép (ẩn) rồi trượt vào, không bay ngang qua màn hình */
    jump.forEach(function (j) { j[0].style.transition = 'none'; kcPlace(j[0], j[1] + (KC.dir >= 0 ? 1 : -1)); });
    if (jump.length) {
      void st.offsetWidth;
      jump.forEach(function (j) { j[0].style.transition = ''; kcPlace(j[0], j[1]); });
    }
    var nav = st.parentNode.querySelector('.kc__nav');
    if (nav && !KC.loop) {
      nav.children[0].disabled = KC.i <= 0;
      nav.children[1].disabled = KC.i >= KC.n - 1;
    }
  }
  function kcGo(to) {
    if (!KC.st) return;
    if (!KC.loop) to = Math.max(0, Math.min(KC.n - 1, to));
    if (to === KC.i) { kcLayout(0, false); return; }
    KC.dir = to > KC.i ? 1 : -1;
    KC.i = ((to % KC.n) + KC.n) % KC.n;
    kcLayout(0, false);
    try { var c = KC.st.children[KC.i]; if (c) W.sessionStorage.setItem('ps.kc', c.getAttribute('data-id')); } catch (e) {}
  }
  function kcWire(st) {
    var x0 = 0, y0 = 0, dx = 0, axis = '', down = false, moved = false, cw = 1, t0 = 0;
    function start(x, y) { down = true; moved = false; axis = ''; x0 = x; y0 = y; dx = 0; t0 = Date.now(); cw = (st.children[0] && st.children[0].offsetWidth) || 262; }
    function move(x, y, ev) {
      if (!down) return;
      var mx = x - x0, my = y - y0;
      if (!axis) { if (Math.abs(mx) < 7 && Math.abs(my) < 7) return; axis = Math.abs(mx) > Math.abs(my) ? 'x' : 'y'; }
      if (axis !== 'x') return;
      if (ev && ev.cancelable) ev.preventDefault();
      moved = true; dx = mx;
      var f = -dx / (cw + 30);
      if (!KC.loop) { var lo = -KC.i, hi = KC.n - 1 - KC.i; if (f < lo) f = lo + (f - lo) * 0.3; if (f > hi) f = hi + (f - hi) * 0.3; }
      KC.dir = f >= 0 ? 1 : -1;
      kcLayout(f, true);
    }
    function end() {
      if (!down) return; down = false;
      if (axis !== 'x') return;
      var f = -dx / (cw + 30), v = dx / Math.max(1, Date.now() - t0), s = Math.round(f);
      if (s === 0 && Math.abs(v) > 0.35) s = v < 0 ? 1 : -1;
      if (s > 1) s = 1; if (s < -1) s = -1;
      /* giữ vị trí đang kéo làm điểm xuất phát rồi trượt về chỗ */
      var cs = st.children; for (var i = 0; i < cs.length; i++) cs[i]._d = kcNorm(i - KC.i - f);
      if (s) kcGo(KC.i + s); else kcLayout(0, false);
    }
    if (W.PointerEvent) {
      st.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse' && e.button !== 0) return; start(e.clientX, e.clientY); });
      st.addEventListener('pointermove', function (e) { move(e.clientX, e.clientY, e); });
      st.addEventListener('pointerup', end); st.addEventListener('pointercancel', end);
      st.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') end(); });
    } else {
      st.addEventListener('touchstart', function (e) { var t = e.touches[0]; start(t.clientX, t.clientY); }, { passive: true });
      st.addEventListener('touchmove', function (e) { var t = e.touches[0]; move(t.clientX, t.clientY, e); }, { passive: false });
      st.addEventListener('touchend', end); st.addEventListener('touchcancel', end);
    }
    /* chạm thẻ bên cạnh: đưa thẻ đó vào giữa; vừa kéo xong: không mở khóa học */
    st.addEventListener('click', function (e) {
      if (moved) { moved = false; e.preventDefault(); e.stopPropagation(); return; }
      var c = PS.closest(e.target, '.kc__card'); if (!c) return;
      if (!c.classList.contains('is-on')) {
        e.preventDefault(); e.stopPropagation();
        var d = Math.round(c._d || 0); if (d) kcGo(KC.i + d);
      }
    }, true);
    st.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.keyCode === 39) { e.preventDefault(); kcGo(KC.i + 1); }
      else if (e.key === 'ArrowLeft' || e.keyCode === 37) { e.preventDefault(); kcGo(KC.i - 1); }
    });
  }
  var kcRT = null;
  W.addEventListener('resize', function () { clearTimeout(kcRT); kcRT = setTimeout(function () { if (KC.st && D.body.contains(KC.st)) kcLayout(0, true); }, 120); });

  function nudge() {
    var t = PS.totals(), lb = PS.prefs().lastBackup || 0;
    if (!PS.storageOK) return '<div class="nudge nudge--warn">' + icon('info', 18) + '<p>Trình duyệt này đang chặn lưu bài. Hãy mở bằng Chrome hoặc Safari, hoặc tải sao lưu trước khi tắt.</p></div>';
    if (t.done > 0 && Date.now() - lb > 7 * 864e5) return '<div class="nudge">' + icon('shield', 18) + '<p>' + (lb ? 'Đã hơn 7 ngày bạn chưa sao lưu.' : 'Bạn chưa sao lưu bài làm lần nào.') + ' Một tập tin giữ bài của mọi khóa.</p><button type="button" class="ps-btn ps-btn--sm ps-btn--go" data-act="backup">Tải sao lưu</button></div>';
    return '';
  }
  /* PS1.4.0 · Gửi hồ sơ cho thầy cô: một tập tin JSON cho mọi khóa và Shin Routine (PS.sendReport trong core.js) */
  function hsrHTML() {
    if (!PS.sendReport) return '';
    var lr = PS.prefs().lastReport;
    return '<section class="hsr"><span class="hsr__ic">' + icon('send', 22) + '</span><div class="hsr__t"><b>Gửi hồ sơ cho thầy cô</b><small>' +
      (lr ? 'Đã gửi ' + PS.fmtDate(lr).slice(0, 5) + ' · ' : '') + 'Một tập tin cho mọi khóa và Shin Routine</small></div>' +
      '<button type="button" class="ps-btn ps-btn--sm" data-act="hsSend">Gửi</button></section>';
  }
  /* ---------------- PS1.3.54 · Trang chủ 3 thẻ (thanh đáy) ---------------- */
  var TABS = [['today', 'Hôm nay'], ['course', 'Khóa học'], ['lich', 'Lịch học']];
  var TAB = 'today', TABPUSH = 0;
  try { var t0 = W.sessionStorage.getItem('ps.tab'); if (t0 === 'course' || t0 === 'lich') TAB = t0; } catch (e) {}
  if (QS.lich) TAB = 'lich';
  var TAB_IC = {
    today: '<svg class="ps-ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>',
    course: '<svg class="ps-ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="13" height="15" rx="3"/><path d="M8 3h10a3 3 0 0 1 3 3v11"/></svg>',
    lich: '<svg class="ps-ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>'
  };
  /* PS1.3.58: ô thứ 4 = ảnh đại diện “Sổ tay” (mở Cài đặt), cùng vị trí với ô Sổ tay trong các khóa và Shin */
  function navAvHTML() {
    var h = W.PSAvatar ? W.PSAvatar.html(30) : '<span class="ps-av" style="width:30px;height:30px;background:#FFE08F;color:#6A4A00;font-size:14px">' + esc(shortName().split(' ').pop().charAt(0).toUpperCase()) + '</span>';
    return h.replace(/avc-/g, 'psnavc-');
  }
  function navHTML() {
    return '<nav class="bnav" aria-label="Trang chủ">' + TABS.map(function (t) {
      var on = TAB === t[0];
      return '<button type="button" class="bnav__b' + (on ? ' is-on' : '') + '" data-act="tab" data-t="' + t[0] + '"' + (on ? ' aria-current="page"' : '') + '><span class="bnav__i">' + TAB_IC[t[0]] + '</span><small>' + t[1] + '</small></button>';
    }).join('') + '<button type="button" class="bnav__b bnav__nb" data-act="settings" aria-label="Sổ tay: hồ sơ và cài đặt"><span class="bnav__i"><span class="psnav__avw"><span class="psnav__av">' + navAvHTML() + '</span></span></span><small>Sổ tay</small></button></nav>';
  }
  function setTab(t, fromBack) {
    if (t === TAB) { if (!fromBack) W.scrollTo(0, 0); return; }
    var prev = TAB; TAB = t;
    try { W.sessionStorage.setItem('ps.tab', t); } catch (e) {}
    if (!fromBack) {
      if (prev === 'today' && t !== 'today') { try { history.pushState({ psTab: 1 }, ''); TABPUSH = 1; } catch (e) {} }
      else if (t === 'today' && TABPUSH) { TABPUSH = 0; try { history.back(); } catch (e) {} }
    }
    render(false); W.scrollTo(0, 0);
    var c = D.querySelector('.tabc'); if (c && !noMotion) { c.classList.remove('tabin'); void c.offsetWidth; c.classList.add('tabin'); }
  }
  /* Học tiếp (ý 24): khóa vừa học (PS.prefs().lastMod), nếu chưa có thì khóa đang học dở, rồi khóa mới.
     Khi khóa báo extra.next {t: 'Bến 3 · …'} (PS1.3.55) thì hiện đúng hoạt động kế tiếp. */
  function contMods() {
    var a = visibleMods().filter(function (m) { return m.state === 'ready'; }), last = PS.prefs().lastMod, first = null, more = null;
    a.forEach(function (m) { if (m.id === last && modState(m).st !== 'done') first = m; });
    if (!first) a.forEach(function (m) { if (!first && modState(m).st === 'go') first = m; });
    if (!first) a.forEach(function (m) { if (!first && (modState(m).st === 'new' || modState(m).st === 'lock')) first = m; });
    if (!first && a.length) first = a[0];
    if (first) a.forEach(function (m) { if (!more && m !== first && modState(m).st === 'go') more = m; });
    return { m: first, more: more };
  }
  function contHTML() {
    var c = contMods(), m = c.m; if (!m) return '';
    var k = modState(m), mc = m.color || '#24307A', x = (k.s && k.s.extra) || {}, nx = x.next && x.next.t ? esc(x.next.t) : '', ng = x.next && x.next.go && k.st === 'go' ? String(x.next.go) : '';
    var sub = nx || (k.st === 'lock' ? 'Thầy cô cho mật khẩu khi bắt đầu khóa tại lớp' : (k.st === 'new' ? esc(m.sub || '') : 'Đã xong ' + k.done + (k.total ? '/' + k.total : '') + ' hoạt động'));
    var btn = { 'new': 'Bắt đầu', lock: 'Mở khóa', go: 'Học tiếp', done: 'Ôn lại' }[k.st] || 'Học tiếp';
    var more = c.more ? '<button type="button" class="ct__more" data-act="mod" data-id="' + esc(c.more.id) + '"><i style="background:' + esc(c.more.color || '#24307A') + '"></i><span>Cũng đang học: <b>' + esc(c.more.code) + ' · ' + esc(c.more.title) + '</b></span>' + icon('next', 15) + '</button>' : '';
    return '<section class="ct" style="--i:2;--mc:' + esc(mc) + ';--md:' + mix(mc, '#0B1233', 0.28) + ';--mt:' + mix(mc, '#FFFFFF', 0.88) + '">' +
      '<div class="ct__card" data-act="mod" data-id="' + esc(m.id) + '"' + (ng ? ' data-go="' + esc(ng) + '"' : '') + ' role="link" tabindex="0" aria-label="' + btn + ' ' + esc(m.title) + '">' +
      '<div class="ct__row"><span class="ct__art"' + (ART_BG[m.id] ? ' style="background:' + ART_BG[m.id] + '"' : '') + '>' + artHTML(m) + '</span>' +
      '<span class="ct__tx"><span class="ct__code">' + esc(m.code) + '</span><b>' + esc(m.title) + '</b><small>' + sub + '</small></span></div>' +
      (k.st === 'go' || k.st === 'done' ? '<span class="ct__bar"><i style="width:' + k.pct + '%"></i></span>' : '') +
      '<span class="ct__go">' + (k.st === 'lock' ? icon('lock', 18, 2.4) : '') + '<span>' + btn + '</span>' + icon('next', 18, 2.6) + '</span></div>' + more + '</section>';
  }
  function vHome() {
    var t = PS.totals(), nm = shortName();
    var head = '<header class="hbar"><div class="hbar__brand">' + logo(32) + '<b>' + esc(CFG.APP) + '</b></div>' +
      '<div class="hbar__btns"><button type="button" class="hbar__btn hub-install" data-pwa="install" aria-label="Cài ứng dụng">' + icon('phone', 19) + '<span data-pwa-label>Cài ứng dụng</span></button>' +
      '<span class="hbar__fire" title="Chuỗi ngày học" aria-label="Chuỗi ' + t.streak + ' ngày">' + icon('flame', 16) + '<b>' + t.streak + '</b> ngày</span>' +
      '</div></header>' + /* PS1.3.58: ảnh đại diện chuyển xuống ô Sổ tay ở thanh đáy */
      '<div class="hdeco" aria-hidden="true"><i class="hd hd--a">' + icon('bulb', 64, 1.6) + '</i><i class="hd hd--b">' + icon('rail', 58, 1.6) + '</i><i class="hd hd--c">' + icon('star', 46, 1.6) + '</i><i class="hd hd--d">' + icon('dumbbell', 52, 1.8) + '</i></div>';
    var body;
    if (TAB === 'course') {
      body = '<div class="wrap wrap--top enter">' + '<div style="--i:0">' + nudge() + '</div>' +
        '<h1 class="sec sec--top" style="--i:0">Khóa học của bạn</h1>' +
        '<div class="kstats" style="--i:1"><div class="ks"><b>' + num(t.xp) + '</b><small>Tổng XP</small></div><div class="ks"><b>' + num(t.ins) + '</b><small>Insight</small></div><div class="ks"><b>' + t.todayMin + ' phút</b><small>Hôm nay</small></div></div>' +
        '</div>' +
        '<div class="enter">' + carouselHTML(carMods()) + '</div>' +
        '<div class="wrap enter">' + hsrHTML() + guidesHTML() +
        '<footer class="hfoot">' + esc(CFG.ORG) + '<br>' + esc(CFG.APP) + ' ' + esc(CFG.APP_VER) + ' · Bài làm lưu trên máy này</footer></div>';
    } else if (TAB === 'lich') {
      body = '<div class="wrap wrap--top enter"><div class="tabh" style="--i:0"><h1 class="sec sec--top">Lịch học</h1>' +
        (W.PSLich && W.PSLich.count && W.PSLich.count() ? '<button type="button" class="lc-edit" data-act="lcOpen">' + icon('edit', 15) + ' Sửa</button>' : '') + '</div>' +
        '<div class="tab-lich" style="--i:1">' + (W.PSLich ? W.PSLich.cardHTML() : '') + '</div></div>';
    } else {
      body = '<div class="wrap wrap--top enter">' +
        '<h1 class="hi" style="--i:0"><span>' + greet() + ',</span> ' + esc(nm) + '</h1>' +
        routineHTML() + contHTML() + '</div>';
    }
    return head + '<div class="tabc tabc--' + TAB + '">' + body + '</div>' + navHTML();
  }

  /* thẻ hướng dẫn (cao bằng nửa thẻ khóa): CFG.GUIDES */
  function guidesHTML() {
    var g = CFG.GUIDES || []; if (!g.length) return '';
    return '<div class="glist" style="--i:7">' + g.map(function (x) {
      var mc = x.color || '#24307A', soon = x.state !== 'ready';
      var tag = soon ? 'div' : 'a href="' + esc(PS.url(x.href || '')) + '"';
      return '<' + tag + ' class="gcard' + (soon ? ' gcard--soon' : '') + '" style="--mc:' + esc(mc) + ';--ml:' + mix(mc, '#FFFFFF', 0.18) + ';--md:' + mix(mc, '#0B1233', 0.28) + ';--mt:' + mix(mc, '#FFFFFF', 0.9) + '">' +
        '<span class="gcard__ic">' + icon(x.icon, 24, 2) + '</span><span class="gcard__tx"><span class="mcard__code">' + esc(x.code || 'HƯỚNG DẪN') + '</span><b>' + esc(x.title) + '</b><small>' + esc(x.sub) + '</small></span>' +
        (soon ? '<span class="gcard__soon">Sắp có</span>' : icon('next', 18)) + '</' + (soon ? 'div' : 'a') + '>';
    }).join('') + '</div>';
  }

  /* ---------------- Cổng mật khẩu ---------------- */
  var gateErr = 0;
  function openMod(id, q) { /* q: mã hoạt động (Học tiếp, ý 24) */
    var m = PS.mod(id); if (!m) return;
    if (m.state === 'soon') { PS.toast('Khóa <b>' + esc(m.title) + '</b> đang được xây dựng.'); return; }
    if (PS.isUnlocked(id)) { go(id, q); return; }
    gateErr = 0;
    PS.dialog({
      icon: 'lock', title: 'Mở khóa ' + esc(m.title),
      html: '<p>Trả lời câu hỏi thầy cô đọc trên lớp:</p><p class="gate__q">' + esc(m.gateQ || 'Mật khẩu của khóa học là gì?') + '</p>' +
        '<input class="ps-inp" id="gateIn" maxlength="30" autocomplete="off" autocapitalize="off" placeholder="Câu trả lời"><p class="gate__err" id="gateErr" role="alert"></p>',
      onOpen: function (ov) {
        var inp = ov.querySelector('#gateIn');
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.keyCode === 13) { e.preventDefault(); ov.querySelector('[data-psdlg="0"]').click(); } });
      },
      buttons: [
        { t: 'Mở khóa', cls: 'ps-btn--go', fn: function (ov) {
          var v = ov.querySelector('#gateIn').value;
          if (PS.tryPass(id, v)) { PS.toast('Đã mở khóa <b>' + esc(m.title) + '</b>!'); setTimeout(function () { go(id); }, 500); return true; }
          gateErr++;
          var box = ov.querySelector('.ps-ov__box'); box.classList.remove('shake'); void box.offsetWidth; if (!noMotion) box.classList.add('shake');
          ov.querySelector('#gateErr').textContent = gateErr > 1 ? 'Thử lại nhé. Nếu chưa nhớ, hỏi thầy cô đang hướng dẫn lớp mình.' : 'Thử lại nhé.';
          return false;
        } },
        { t: 'Để sau', cls: 'ps-btn--soft' }
      ]
    });
  }
  function go(id, q) {
    if (!PS.isUnlocked(id)) return;
    var m = PS.mod(id) || {};
    if (m.kind !== 'routine') PS.setPref('lastMod', id);
    /* PS1.3.34: hiện ngay màn "Đang mở" theo màu khóa, rồi mới chuyển trang (khóa lớn tải lâu vẫn thấy phản hồi tức thì) */
    if (!D.querySelector('.ps-going')) {
      var o = D.createElement('div'); o.className = 'ps-going'; o.setAttribute('role', 'status');
      o.style.setProperty('--gc', m.color || '#0F4D98');
      o.innerHTML = '<div><small>ĐANG MỞ</small>' + esc(m.title || '') + '</div><i aria-hidden="true"><b></b><b></b><b></b></i>';
      D.body.appendChild(o);
    }
    setTimeout(function () { PS.open(id, q); }, noMotion ? 0 : 60);
  }

  /* ---------------- Cài đặt ---------------- */
  function openSettings() {
    var ov = D.createElement('div'); ov.className = 'sheet'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Cài đặt');
    ov.innerHTML = '<div class="sheet__in"><div class="sheet__top"><h2>Cài đặt</h2><button type="button" class="sheet__x" data-act="closeSet" aria-label="Đóng">' + icon('close', 20) + '</button></div><div id="setBody">' + PS.settingsHTML({ ctx: 'hub', extra: W.PSAvatar ? [W.PSAvatar.rowHTML()] : [] }) + '</div></div>';
    D.body.appendChild(ov); D.body.classList.add('ps-lock');
    PS.wireSettings(ov.querySelector('#setBody'), { ctx: 'hub' });
    if (W.PSAvatar) W.PSAvatar.wire(ov.querySelector('#setBody')); /* PS1.3.36: ảnh đại diện */
    W.PSSheetPush();
  }
  function closeSettings(fromBack) { var s = D.querySelector('.sheet'); if (s) s.parentNode.removeChild(s); D.body.classList.remove('ps-lock'); if (!fromBack) W.PSSheetDone(); render(false); }

  /* PS1.3.34 · nút Back (Android, cử chỉ vuốt) đóng tấm Cài đặt / Lịch học thay vì thoát ứng dụng */
  var SHEET = 0;
  W.PSSheetPush = function () { if (SHEET) return; try { history.pushState({ psSheet: 1 }, ''); SHEET = 1; } catch (e) {} };
  W.PSSheetDone = function () { if (!SHEET) return; SHEET = 0; try { history.back(); } catch (e) {} };
  W.addEventListener('popstate', function () {
    if (!SHEET) { if (TABPUSH && !D.querySelector('.sheet')) { TABPUSH = 0; setTab('today', true); } return; }
    SHEET = 0;
    Array.prototype.forEach.call(D.querySelectorAll('.ps-ov'), function (o) { o.parentNode.removeChild(o); });
    if (D.querySelector('.sheet--lc') && W.PSLich && W.PSLich.close) { W.PSLich.close(true); return; }
    if (D.querySelector('.sheet')) closeSettings(true);
  });

  /* ---------------- vẽ, sự kiện ---------------- */
  function render(enter) {
    APP.innerHTML = PS.needProfile() ? vWelcome() : vHome();
    if (!PS.needProfile() && TAB === 'course') kcStart(carMods());
    D.body.classList.toggle('has-bnav', !PS.needProfile());
    if (!enter || noMotion) Array.prototype.forEach.call(APP.querySelectorAll('.enter'), function (e) { e.classList.remove('enter'); });
    if (PS.pwaRefresh) PS.pwaRefresh();
  }
  D.addEventListener('click', function (e) {
    var b = PS.closest(e.target, '[data-act]'); if (!b) return;
    var a = b.getAttribute('data-act');
    if (a === 'onbGo') onbGo();
    else if (a === 'mod') openMod(b.getAttribute('data-id'), b.getAttribute('data-go'));
    else if (a === 'ci') goCheckin();
    else if (a === 'tab') setTab(b.getAttribute('data-t'));
    else if (a === 'kcPrev') kcGo(KC.i - 1);
    else if (a === 'kcNext') kcGo(KC.i + 1);
    else if (a === 'settings') openSettings();
    else if (a === 'closeSet') closeSettings();
    else if (a === 'hsSend') { if (PS.sendReport()) render(false); }
    else if (a === 'backup') PS.backup();
    else if (a === 'restore') PS.restorePick();
  });
  D.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.keyCode === 13) && e.target && e.target.classList && e.target.classList.contains('shn__card')) { e.preventDefault(); openMod('routine'); return; }
    if ((e.key === 'Enter' || e.keyCode === 13) && e.target && e.target.classList && e.target.classList.contains('ct__card')) { e.preventDefault(); openMod(e.target.getAttribute('data-id'), e.target.getAttribute('data-go')); return; }
    if ((e.key === 'Enter' || e.keyCode === 13) && PS.closest(e.target, '.onb__form') && e.target.tagName === 'INPUT') { e.preventDefault(); onbGo(); }
    if ((e.key === 'Escape' || e.keyCode === 27) && D.querySelector('.sheet:not(.sheet--lc)') && !D.querySelector('.ps-ov')) closeSettings();
  });
  W.addEventListener('ps:change', function (e) { if (e.detail && (e.detail.field === 'backup') && !D.querySelector('.sheet')) render(false); });
  var hbT = null;
  W.addEventListener('scroll', function () {
    if (hbT) return;
    hbT = setTimeout(function () { hbT = null; var hb = D.querySelector('.hbar'); if (hb) { if ((W.pageYOffset || 0) > 8) hb.classList.add('is-scrolled'); else hb.classList.remove('is-scrolled'); } }, 60);
  }, { passive: true });
  W.addEventListener('pageshow', function (e) { if (e.persisted) { D.body.classList.remove('leaving'); var g = D.querySelector('.ps-going'); if (g) g.parentNode.removeChild(g); render(false); } });

  W.PSHubRender = function () { if (!PS.needProfile()) render(false); };
  /* trạng thái lịch học (Đang học, Còn … phút) tự cập nhật mỗi phút */
  setInterval(function () {
    var c = D.querySelector('.lc'); if (!c || !W.PSLich || D.hidden) return;
    var t = D.createElement('div'); t.innerHTML = W.PSLich.cardHTML(); var n = t.firstChild; if (n) { n.style.cssText = c.style.cssText; c.parentNode.replaceChild(n, c); }
  }, 60000);
  if (doorNeeded()) {
    try { W.sessionStorage.setItem('ps.door', PS.today()); } catch (e) {}
    W.location.replace(PS.url('routine/index.html') + '?door=1');
    return;
  }

  /* ---------------- PS1.3.67 · Intro 2C4: đồi nghiêng nhô lên, vòng O tự vẽ, lá lớn rồi lá nhỏ nảy mầm, logo bay về thanh trên ----------------
     (thay intro PS1.3.34 nền xanh dương). Chỉ lần mở đầu tiên trong ngày (ps.intro = ngày). Không chạy khi mở bằng liên kết sâu (?lich, ?go, ?m, ?thu).
     index.html tô nền xanh mầm trước (lớp html.ps-intro) để không chớp trang chủ. Chạm để bỏ qua. Giảm chuyển động: hiện tĩnh rồi mờ đi.
     Vòng O bắt đầu vẽ ở góc 210° (nằm trọn dưới lá lớn, không lộ mối nối). Hình lá lấy từ icons/logo.svg (vẽ lại bằng vector từ logo gốc, cùng viewBox 71 71 370 370 để logo bay về khớp cỡ). */
  function introNeeded() {
    if (QS.lich || QS.go || WANT || SHOW_HIDDEN) return false;
    try { return W.localStorage.getItem('ps.intro') !== PS.today(); } catch (e) { return false; }
  }
  function intro() {
    var ov = D.createElement('div'); ov.className = 'pi' + (noMotion ? ' pi--still' : ''); ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML = '<div class="pi__hill"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="piHg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E4F3DF"/><stop offset="1" stop-color="#CDE9C4"/></linearGradient></defs>' +
      '<ellipse cx="58" cy="150" rx="120" ry="125" transform="rotate(-9 58 150)" fill="url(#piHg)"/></svg></div>' +
      '<div class="pi__logo"><svg viewBox="71 71 370 370"><path class="pi__ring" d="M136.8 187A136.95 136.95 0 1 1 374 324A136.95 136.95 0 1 1 136.8 187"/>' +
      '<path class="pi__lf pi__lf2" fill="#4FB057" d="M257.1 349.5C258.1 349.0 258.2 349.0 258.9 349.4C259.9 349.9 262.4 349.8 264.1 349.2C265.1 348.9 266.1 348.8 268.1 348.8C270.1 348.8 271.0 348.6 272.0 348.2C272.7 348.0 273.8 347.8 274.4 347.8C274.9 347.8 276.1 347.5 277.0 347.2C277.9 347.0 278.7 346.8 279.0 346.8C279.2 346.8 280.3 346.4 281.5 346.0C283.5 345.3 283.7 345.1 285.3 343.4C288.6 339.9 292.0 334.3 294.1 329.1C294.4 328.3 294.9 327.1 295.2 326.4C296.7 322.7 298.4 316.7 298.8 314.1C298.9 312.9 299.4 310.4 299.8 308.6C300.2 306.8 300.6 304.5 300.6 303.5C300.7 302.5 300.9 300.7 301.1 299.5C301.6 296.6 302.1 290.1 302.0 287.3C302.0 285.8 302.1 284.5 302.3 283.8C302.8 282.4 303.1 279.5 303.1 276.4C303.1 275.1 303.3 273.6 303.4 273.0C303.9 271.0 304.3 268.9 304.5 266.4C304.7 265.0 304.9 263.3 305.1 262.5C305.3 261.7 305.5 260.3 305.6 259.4C305.7 258.4 305.9 257.1 306.1 256.4C306.3 255.7 306.5 254.7 306.6 254.1C307.1 251.0 310.5 238.7 311.5 236.1C311.8 235.4 312.3 234.1 312.6 233.1C312.9 232.2 313.5 230.8 313.8 230.0C314.2 229.2 314.8 227.8 315.2 226.9C316.2 224.3 318.8 219.0 320.1 217.2C322.7 213.4 323.2 211.2 321.3 211.2C320.6 211.3 315.1 213.2 308.9 215.6C302.6 218.1 302.2 218.3 297.3 220.7C285.5 226.3 277.4 232.1 269.7 240.4C266.5 243.8 265.5 245.0 262.6 249.4C259.5 254.0 259.0 254.7 258.6 256.0C258.4 256.7 258.1 257.3 257.9 257.4C257.8 257.5 257.2 257.0 256.5 256.3L255.3 254.9 L254.9 255.6C254.4 256.3 254.4 256.3 256.0 260.3C258.2 266.0 260.0 271.8 260.9 275.8C261.1 276.6 261.4 277.9 261.6 278.4C261.8 279.0 262.0 280.0 262.0 280.5C262.0 281.0 262.2 282.2 262.5 283.0C262.8 284.0 263.0 285.3 263.0 286.5C263.0 287.6 263.2 289.1 263.5 290.1C264.0 291.7 264.0 292.6 264.0 301.8C264.0 310.8 264.0 311.9 263.5 313.8C263.2 314.9 263.0 316.7 263.0 317.7C263.0 318.7 262.8 320.0 262.5 321.0C262.2 321.9 262.0 323.0 262.0 323.6C262.0 324.2 261.8 325.4 261.5 326.2C261.2 327.1 261.0 328.1 261.0 328.3C261.0 328.6 260.8 329.6 260.5 330.5C260.3 331.4 259.8 333.0 259.5 334.1C258.6 337.2 256.6 343.2 255.3 346.4C254.7 348.0 254.6 349.1 255.1 349.6C255.6 350.1 255.8 350.1 257.1 349.5Z"/>' +
      '<g class="pi__lf pi__lf1"><path fill="#008A45" d="M255.5 349.7C256.1 349.2 257.0 347.6 257.0 347.1C257.0 346.8 257.2 346.3 257.5 345.9C257.8 345.5 258.0 344.9 258.0 344.7C258.0 344.4 258.2 343.8 258.5 343.2C258.8 342.7 259.0 342.0 259.0 341.7C259.0 341.4 259.2 340.8 259.5 340.4C259.8 340.0 260.0 339.4 260.0 339.1C260.0 338.7 260.2 338.0 260.5 337.5C260.8 337.0 261.0 336.2 261.0 335.8C261.0 335.4 261.2 334.7 261.5 334.1C261.8 333.6 262.0 332.8 262.0 332.3C262.0 331.9 262.2 331.0 262.5 330.5C262.8 330.0 263.0 329.1 263.0 328.5C263.0 328.0 263.2 326.9 263.5 326.2C263.8 325.5 264.0 324.4 264.0 323.6C264.0 322.9 264.2 321.7 264.5 321.0C264.8 320.1 265.0 319.1 265.0 317.8C265.0 316.6 265.2 315.0 265.5 313.9C266.0 312.1 266.0 311.1 266.0 301.9C266.0 292.6 266.0 291.7 265.5 290.1C265.2 289.0 265.0 287.6 265.0 286.4C265.0 285.0 264.8 284.0 264.5 283.1C264.2 282.3 264.0 281.2 264.0 280.5C264.0 279.8 263.8 278.7 263.5 278.0C263.2 277.3 263.0 276.3 263.0 275.9C263.0 275.4 262.8 274.5 262.5 274.0C262.2 273.5 262.0 272.6 262.0 272.1C262.0 271.6 261.8 270.8 261.5 270.2C261.2 269.7 261.0 269.0 261.0 268.8C261.0 268.5 260.8 267.8 260.5 267.2C260.2 266.7 260.0 266.0 260.0 265.7C260.0 265.5 259.8 264.8 259.5 264.3C259.3 263.8 258.9 263.0 258.8 262.6C258.1 260.5 257.9 260.0 256.9 257.9C252.3 248.2 249.5 243.1 245.3 236.8C242.9 233.1 239.5 228.6 234.6 222.7C232.1 219.7 224.1 211.4 220.9 208.4C214.4 202.5 206.5 196.1 201.1 192.4C200.2 191.7 198.8 190.8 198.1 190.3C197.5 189.8 196.1 188.9 195.0 188.2C194.0 187.5 192.7 186.5 192.1 186.0C191.5 185.5 190.8 184.9 190.4 184.7C190.0 184.5 188.7 183.7 187.5 183.0C181.4 179.3 176.0 176.3 168.4 172.5C162.7 169.7 161.4 169.1 158.2 167.8C157.2 167.3 155.9 166.7 155.4 166.5C152.5 165.3 145.4 162.5 141.1 161.0C139.5 160.4 137.6 159.8 136.9 159.5C134.1 158.5 127.9 156.6 123.9 155.5C116.1 153.4 112.4 152.5 109.5 152.2C108.2 152.1 106.6 151.8 105.9 151.6C105.2 151.4 104.3 151.3 103.9 151.2C103.4 151.2 102.3 151.0 101.2 150.8C100.2 150.5 98.6 150.2 97.6 150.1C96.7 150.0 95.3 149.8 94.6 149.6C93.9 149.4 92.2 149.2 90.8 149.2C89.3 149.1 87.7 148.9 87.2 148.7C86.2 148.4 78.4 147.9 77.9 148.2C77.2 148.4 77.3 148.9 78.7 152.1C79.5 153.8 81.4 158.4 81.9 159.6C82.3 160.4 82.6 161.3 82.8 161.6C82.9 161.9 83.1 162.6 83.3 163.1C83.5 163.7 83.9 164.7 84.2 165.5C84.6 166.3 85.0 167.3 85.2 167.9C85.4 168.4 85.7 169.2 85.9 169.7C86.1 170.1 86.3 170.5 86.3 170.6C86.3 170.7 86.4 171.2 86.6 171.6C87.0 172.4 87.9 174.9 88.5 176.5C89.0 177.9 89.7 179.7 90.4 181.6C90.7 182.6 91.2 184.0 91.4 184.8C92.2 187.5 92.5 188.5 94.1 193.1C95.0 195.7 97.9 204.4 100.6 212.4C103.3 220.3 106.4 229.5 107.5 232.8C108.6 236.0 109.7 239.2 110.0 240.0C110.3 240.8 110.9 242.7 111.5 244.2C112.1 245.8 112.7 247.6 112.9 248.1C113.0 248.7 113.4 249.5 113.6 250.0C114.0 251.0 114.5 252.2 115.4 254.6C116.0 256.4 116.3 257.1 117.6 260.2C118.3 261.8 118.5 262.5 119.4 264.3C119.6 264.8 120.1 265.9 120.5 266.9C121.9 270.3 126.7 279.9 128.4 282.9C132.3 289.8 136.7 296.5 140.3 300.7C141.0 301.6 142.1 303.0 142.7 303.8C144.5 306.3 154.2 315.7 158.2 318.9C160.3 320.6 162.4 322.3 163.0 322.7C166.0 324.8 166.9 325.5 168.6 326.6C169.6 327.2 171.3 328.3 172.4 328.9C173.5 329.6 175.2 330.6 176.1 331.2C177.7 332.1 189.0 337.8 189.4 337.8C189.5 337.8 192.1 338.8 193.6 339.5C194.2 339.7 195.2 340.1 200.5 341.9C202.4 342.5 204.2 343.1 204.6 343.3C205.0 343.4 206.1 343.7 207.0 343.9C207.8 344.1 208.8 344.4 209.0 344.5C209.3 344.7 210.1 344.9 210.7 345.0C211.3 345.1 212.6 345.4 213.5 345.6C216.5 346.4 217.1 346.5 218.8 346.8C219.6 346.9 220.8 347.1 221.4 347.3C221.9 347.4 223.1 347.6 224.0 347.8C224.9 347.9 226.2 348.1 226.9 348.3C227.6 348.4 229.2 348.6 230.5 348.8C231.8 348.9 233.8 349.1 234.9 349.3C238.8 349.8 240.2 349.9 247.6 350.0C253.3 350.0 255.2 349.9 255.5 349.7Z"/><path fill="#006737" d="M256.2 348.2C256.4 347.9 256.8 347.0 257.5 345.0C257.7 344.5 258.0 343.7 258.3 343.2C258.5 342.7 258.8 342.0 258.8 341.8C258.8 341.5 259.0 340.8 259.2 340.2C259.5 339.7 259.8 339.0 259.8 338.8C259.8 338.5 260.0 337.8 260.2 337.2C260.5 336.7 260.8 336.0 260.8 335.6C260.8 335.2 261.0 334.4 261.2 333.9C261.5 333.3 261.7 332.5 261.7 332.1C261.7 331.6 262.0 330.8 262.2 330.2C262.5 329.7 262.8 328.8 262.8 328.3C262.8 327.7 263.0 326.7 263.2 326.0C263.5 325.3 263.8 324.1 263.8 323.4C263.8 322.6 264.0 321.5 264.2 320.8C264.5 320.0 264.7 318.7 264.8 316.8C264.9 315.2 265.1 313.3 265.4 312.6C265.7 311.6 265.7 309.8 265.7 301.9C265.7 293.2 265.7 292.2 265.2 290.5C265.0 289.4 264.8 287.9 264.8 286.7C264.8 285.5 264.6 284.3 264.2 283.4C264.0 282.6 263.8 281.4 263.8 280.7C263.8 280.1 263.5 278.9 263.2 278.2C263.0 277.6 262.7 276.6 262.7 276.1C262.7 275.5 262.5 274.7 262.2 274.1C262.0 273.6 261.8 272.8 261.8 272.3C261.8 271.9 261.5 271.0 261.2 270.5C261.0 270.0 260.8 269.3 260.8 269.0C260.8 268.7 260.5 268.0 260.2 267.5C260.0 267.0 259.8 266.3 259.8 266.0C259.8 265.7 259.5 265.0 259.3 264.4C259.0 263.9 258.7 263.0 258.5 262.5C257.8 260.4 257.4 259.6 256.5 257.7C255.9 256.5 255.5 255.5 255.5 255.4C255.5 255.1 252.1 248.3 250.2 245.1C246.9 239.2 241.2 230.9 237.1 226.1C236.3 225.1 235.3 223.9 234.9 223.3C233.5 221.4 224.3 211.8 220.4 208.3C212.7 201.2 204.5 194.8 195.0 188.3C193.7 187.5 191.9 186.2 191.0 185.6C188.6 183.9 181.0 179.5 176.5 177.0C173.5 175.4 163.8 170.5 162.2 169.9C161.6 169.6 160.1 168.9 158.8 168.3C157.5 167.7 156.4 167.2 156.3 167.2C156.2 167.2 155.7 167.0 155.1 166.8C154.6 166.5 154.0 166.3 153.9 166.3C153.8 166.3 153.2 166.0 152.5 165.7C151.0 165.0 145.7 163.0 140.9 161.3C136.1 159.5 127.4 156.8 123.4 155.8C122.4 155.5 120.7 155.0 119.7 154.8C114.3 153.3 110.8 152.6 108.4 152.3C107.3 152.1 105.8 151.8 105.1 151.6C104.5 151.4 103.5 151.2 103.0 151.2C102.5 151.2 101.3 151.0 100.3 150.7C99.2 150.5 97.8 150.2 97.1 150.2C96.4 150.2 95.3 150.1 94.7 149.9C94.1 149.6 92.2 149.4 90.4 149.3C88.6 149.1 86.8 148.9 86.3 148.8C85.0 148.4 82.2 148.2 81.8 148.5C81.1 149.0 81.5 149.2 88.8 153.1C94.1 155.9 99.9 159.5 108.1 165.1C112.2 167.9 124.5 177.4 127.5 180.1C128.1 180.7 129.7 182.0 131.0 183.1C143.3 193.6 161.4 212.1 174.7 227.7C182.5 237.0 194.8 252.5 199.6 259.4C200.1 260.1 200.9 261.2 201.4 261.9C201.9 262.6 202.5 263.4 202.7 263.8C202.9 264.1 203.5 264.8 203.9 265.4C204.4 265.9 205.2 267.1 205.8 268.0C206.4 268.9 207.3 270.2 207.8 270.8C211.9 276.8 221.6 291.3 224.6 296.2C225.0 296.8 225.7 298.0 226.2 298.8C226.7 299.5 227.5 300.7 227.9 301.5C228.4 302.3 229.1 303.3 229.4 303.8C229.7 304.2 230.3 305.3 230.8 306.1C231.3 306.9 233.3 310.2 235.2 313.4C237.1 316.6 240.8 322.9 243.4 327.5C248.2 336.0 249.4 338.1 253.7 346.0C255.0 348.5 255.6 348.9 256.2 348.2Z"/></g></svg></div>' +
      '<div class="pi__word"><b>' + esc(CFG.APP) + '</b><small>Khoa Kỹ năng · JPC</small></div>';
    D.body.appendChild(ov); D.documentElement.classList.remove('ps-intro');
    try { W.localStorage.setItem('ps.intro', PS.today()); } catch (e) {}
    var done = false, tm;
    void ov.offsetWidth; ov.classList.add('go');
    tm = setTimeout(function () { fin(false); }, noMotion ? 450 : 1650);
    ov.addEventListener('click', function () { fin(true); });
    function rm() { if (ov.parentNode) ov.parentNode.removeChild(ov); }
    function replay() { Array.prototype.forEach.call(APP.querySelectorAll('.enter'), function (e) { e.classList.remove('enter'); void e.offsetWidth; e.classList.add('enter'); }); }
    function fin(skip) {
      if (done) return; done = true; clearTimeout(tm);
      var lg = ov.querySelector('.pi__logo'), tg = D.querySelector('.hbar__brand .hub-logo') || D.querySelector('.onb__brand .hub-logo');
      ov.classList.add('out'); if (!noMotion) replay();
      if (skip || noMotion || !tg) { ov.style.opacity = '0'; setTimeout(rm, 300); return; }
      var a = lg.getBoundingClientRect(), b = tg.getBoundingClientRect();
      var sc = b.width / a.width * 1.02, dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + a.height / 2);
      tg.style.opacity = '0';
      lg.classList.add('fly'); lg.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sc + ')';
      setTimeout(function () { tg.style.opacity = ''; ov.style.opacity = '0'; }, 540);
      setTimeout(rm, 760);
    }
  }

  /* PS1.3.54: tải sẵn mọi khóa chuyển sang core/pwa.js (PS.warmAll), kèm trạng thái ở Cài đặt › Học được khi không có internet */
  var INTRO = introNeeded();
  if (!INTRO) D.documentElement.classList.remove('ps-intro');
  if (INTRO) intro();
  render(true);
  setTimeout(function () { if (PS.warmAll) PS.warmAll(false); }, 4000);
  /* lối tắt "Học tiếp" trên biểu tượng app (manifest shortcuts): ?go=last mở khóa học gần nhất */
  if (QS.go === 'last' && !PS.needProfile()) {
    try { history.replaceState(null, '', location.pathname); } catch (e) {}
    var lm = PS.mod(PS.prefs().lastMod || '');
    if (lm && lm.state === 'ready' && PS.isUnlocked(lm.id)) go(lm.id); else PS.toast('Chọn một khóa học để bắt đầu nhé.');
  }
  /* ?lich=1 mở tấm Lịch học; ?lich=nhac mở phần giờ tự học (link từ các khóa) */
  if (QS.lich && !PS.needProfile() && W.PSLich) { try { history.replaceState(null, '', location.pathname); } catch (e) {} setTimeout(function () { W.PSLich.open(QS.lich === 'nhac' ? 'nhac' : '', W.PSHubRender); }, 300); }
  /* Đến từ module chưa đủ điều kiện (?m=id): hỏi thông tin trước, rồi mở cổng */
  if (WANT && !PS.needProfile()) { var w0 = WANT; WANT = ''; setTimeout(function () { openMod(w0); }, 350); }
})(window, document);
