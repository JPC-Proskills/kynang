/* =========================================================
   PROSKILLS · ẢNH ĐẠI DIỆN (hub/avatar.js) · PS1.3.36, PS1.3.62
   - PS1.3.60: 12 gương mặt (FC, mã g…) đứng đầu bảng chọn, rồi 12 hình vui (AV). PS1.3.61: vẽ lại nét mảnh, đa dạng mặt/mắt/biểu cảm. PS1.3.62: mắt 1 nét cho gf1, gf2, gf5; tóc gm5 như gm2
   - 12 hình vẽ tự làm (SVG phẳng, nền tròn màu nhạt) hoặc chữ cái + màu.
   - Lưu ở PS.prefs().av: 'i:<mã hình>' hoặc 'c:<số màu>' (mặc định chữ cái màu vàng như trước).
   - PSAvatar.html(size)    → ảnh đại diện (dùng ở thanh trên trang chủ)
   - PSAvatar.rowHTML()      → mục "Ảnh đại diện" trong Cài đặt trang chủ (opts.extra của PS.settingsHTML)
   - PSAvatar.wire(rootEl)   → gắn chạm chọn; đổi xong gọi PS.setPref('av', …) → sự kiện ps:change 'av'
   Thêm hình mới: thêm một dòng vào AV (giữ mã cũ, vì học viên đã chọn theo mã). ES5.
   ========================================================= */
(function (W) {
  'use strict';
  var K = '#2B2A33';
  function eyes(x1, x2, y, r) { return '<circle cx="' + x1 + '" cy="' + y + '" r="' + r + '" fill="' + K + '"/><circle cx="' + x2 + '" cy="' + y + '" r="' + r + '" fill="' + K + '"/><circle cx="' + (x1 + r * .35) + '" cy="' + (y - r * .4) + '" r="' + (r * .38) + '" fill="#fff"/><circle cx="' + (x2 + r * .35) + '" cy="' + (y - r * .4) + '" r="' + (r * .38) + '" fill="#fff"/>'; }
  function blush(x1, x2, y, c) { return '<ellipse cx="' + x1 + '" cy="' + y + '" rx="4.6" ry="2.8" fill="' + (c || '#FF8FA3') + '" opacity=".55"/><ellipse cx="' + x2 + '" cy="' + y + '" rx="4.6" ry="2.8" fill="' + (c || '#FF8FA3') + '" opacity=".55"/>'; }
  function smile(x, y, w) { return '<path d="M' + (x - w) + ' ' + y + 'q' + w + ' ' + (w * .9) + ' ' + (2 * w) + ' 0" stroke="' + K + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>'; }

  /* [mã, tên, màu nền, hình (hệ 96×96)] */
  var AV = [
    ['cao', 'Cáo', '#FFE4CF',
      '<path d="M22 30L30 62H66L74 30L58 42H38Z" fill="#EE8436"/>' +
      '<path d="M24 28l12 16-11 4z" fill="#EE8436"/><path d="M72 28L60 44l11 4z" fill="#EE8436"/>' +
      '<path d="M27 33l7 9-6 2z" fill="#5B3A2A" opacity=".55"/><path d="M69 33l-7 9 6 2z" fill="#5B3A2A" opacity=".55"/>' +
      '<path d="M22 50Q24 74 48 80Q72 74 74 50Q64 40 48 40Q32 40 22 50Z" fill="#F29646"/>' +
      '<path d="M28 58Q36 54 48 64Q60 54 68 58Q66 76 48 80Q30 76 28 58Z" fill="#FFF6EC"/>' +
      eyes(38, 58, 55, 3.6) + '<path d="M44.5 64h7l-3.5 3.6z" fill="' + K + '"/>' + smile(45, 69, 3) + blush(31, 65, 62)],
    ['gautruc', 'Gấu trúc', '#DDF2E6',
      '<circle cx="26" cy="32" r="10" fill="#33343D"/><circle cx="70" cy="32" r="10" fill="#33343D"/>' +
      '<ellipse cx="48" cy="54" rx="29" ry="26" fill="#fff"/>' +
      '<ellipse cx="36.5" cy="52" rx="7.5" ry="9.5" fill="#33343D" transform="rotate(28 36.5 52)"/><ellipse cx="59.5" cy="52" rx="7.5" ry="9.5" fill="#33343D" transform="rotate(-28 59.5 52)"/>' +
      '<circle cx="37.5" cy="51" r="3" fill="#fff"/><circle cx="58.5" cy="51" r="3" fill="#fff"/><circle cx="38" cy="51.5" r="1.6" fill="' + K + '"/><circle cx="58" cy="51.5" r="1.6" fill="' + K + '"/>' +
      '<ellipse cx="48" cy="63" rx="4.2" ry="3" fill="#33343D"/>' + smile(45, 68, 3) + blush(29, 67, 64) +
      '<path d="M66 20q6-6 10 0q-4 2-10 0z" fill="#58B47E"/><path d="M71 20l-2-6" stroke="#3E9463" stroke-width="2" stroke-linecap="round"/>'],
    ['cavoi', 'Cá voi', '#D7E8FF',
      '<path d="M48 18v10M42 22l6 6 6-6" stroke="#7FB6F2" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M16 58Q16 34 46 34Q74 34 76 54L86 44Q90 56 82 64Q76 76 50 76Q16 76 16 58Z" fill="#4D86D6"/>' +
      '<path d="M20 62Q30 72 52 72Q70 72 77 63Q66 66 48 66Q30 66 20 62Z" fill="#CFE3FF"/>' +
      eyes(32, 54, 52, 3.4) + smile(40, 58, 3.2) + blush(26, 62, 59, '#FF9FB6') +
      '<path d="M10 82q8-5 16 0t16 0t16 0t16 0t16 0" stroke="#9CC6F5" stroke-width="3" fill="none" stroke-linecap="round"/>'],
    ['cu', 'Cú', '#EDE3FF',
      '<path d="M24 30l10 10M72 30L62 40" stroke="#7A5440" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M22 46Q22 26 48 26Q74 26 74 46V66Q74 82 48 82Q22 82 22 66Z" fill="#9C6E52"/>' +
      '<ellipse cx="48" cy="70" rx="15" ry="11" fill="#E8CDB0"/>' +
      '<path d="M40 68l2.5 2.5 2.5-2.5M51 68l2.5 2.5 2.5-2.5M45.5 74l2.5 2.5 2.5-2.5" stroke="#B48A6A" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M22 56q-6 8 0 18M74 56q6 8 0 18" stroke="#7A5440" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<circle cx="37" cy="44" r="10" fill="#FFF7EA"/><circle cx="59" cy="44" r="10" fill="#FFF7EA"/>' + eyes(37, 59, 44, 4.6) +
      '<path d="M44.5 51h7l-3.5 5z" fill="#F2A33A"/>'],
    ['ech', 'Ếch', '#E6F6CC',
      '<circle cx="33" cy="34" r="11" fill="#5DB54A"/><circle cx="63" cy="34" r="11" fill="#5DB54A"/>' +
      '<ellipse cx="48" cy="58" rx="31" ry="22" fill="#6CC456"/>' +
      '<circle cx="33" cy="33" r="7" fill="#fff"/><circle cx="63" cy="33" r="7" fill="#fff"/>' + eyes(34, 64, 33.5, 3.6) +
      '<path d="M32 58q16 13 32 0" stroke="' + K + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      '<path d="M44 63q4 6 8 0z" fill="#F07C8E"/>' + blush(26, 70, 55, '#FF8B8B') +
      '<circle cx="44" cy="47" r="1.3" fill="#3E8E35"/><circle cx="52" cy="47" r="1.3" fill="#3E8E35"/>'],
    ['bachtuoc', 'Bạch tuộc', '#FFE1EA',
      '<path d="M26 60q-6 10-14 10M36 64q-4 12-12 16M48 66v16M60 64q4 12 12 16M70 60q6 10 14 10" stroke="#EE7A9B" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M20 52Q20 18 48 18Q76 18 76 52Q76 66 48 66Q20 66 20 52Z" fill="#F28AA8"/>' +
      '<ellipse cx="38" cy="28" rx="6" ry="3.5" fill="#fff" opacity=".45" transform="rotate(-25 38 28)"/>' +
      eyes(38, 58, 46, 3.6) + smile(45, 54, 3) + blush(30, 66, 53, '#E0506F') +
      '<circle cx="62" cy="30" r="2" fill="#FFC2D3"/><circle cx="68" cy="38" r="1.4" fill="#FFC2D3"/>'],
    ['phusi', 'Núi Phú Sĩ', '#D8ECFF',
      '<circle cx="68" cy="28" r="10" fill="#F26A5A"/>' +
      '<path d="M8 76L38 34Q48 30 58 34L88 76Z" fill="#5876B4"/>' +
      '<path d="M30 45L38 34Q48 30 58 34L66 45L60 50L54 45L48 51L42 45L36 50Z" fill="#fff"/>' +
      '<path d="M22 30q6-4 12 0M14 40q5-3 10 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>' +
      '<rect x="0" y="74" width="96" height="22" fill="#7BC27F"/><path d="M0 76q12-5 24 0t24 0t24 0t24 0" fill="#8ED092"/>'],
    ['tenlua', 'Tên lửa', '#2F3A6E',
      '<circle cx="20" cy="22" r="1.8" fill="#FFE59A"/><circle cx="76" cy="16" r="1.4" fill="#fff"/><circle cx="80" cy="60" r="1.8" fill="#FFE59A"/><circle cx="16" cy="66" r="1.3" fill="#fff"/>' +
      '<path d="M70 32l1.6 3.6 3.6 1.6-3.6 1.6-1.6 3.6-1.6-3.6-3.6-1.6 3.6-1.6z" fill="#FFE59A"/>' +
      '<g transform="rotate(35 48 48)"><path d="M40 70q8 18 16 0z" fill="#FFB547"/><path d="M43 70q5 11 10 0z" fill="#FFE59A"/>' +
      '<path d="M38 56L28 70H40ZM58 56L68 70H56Z" fill="#E8574A"/>' +
      '<path d="M48 14Q62 28 60 56L58 70H38L36 56Q34 28 48 14Z" fill="#F4F6FB"/>' +
      '<path d="M48 14Q55 20 58 30H38Q41 20 48 14Z" fill="#E8574A"/>' +
      '<circle cx="48" cy="44" r="7" fill="#7FC4F4" stroke="#C9D4E8" stroke-width="3"/><path d="M45 41a4 4 0 0 1 4-2" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>'],
    ['xuongrong', 'Xương rồng', '#FFF0C8',
      '<path d="M30 52q-10 0-10-10v-6q0-4 4-4t4 4v6q0 2 2 2" fill="none" stroke="#4FA36B" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M66 46q10 0 10-10v-4q0-4-4-4t-4 4v4q0 2-2 2" fill="none" stroke="#4FA36B" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<rect x="32" y="22" width="32" height="46" rx="16" fill="#5BB176"/>' +
      '<path d="M40 30v4M56 30v4M48 26v4M38 60v3M58 60v3" stroke="#3E8656" stroke-width="2" stroke-linecap="round"/>' +
      '<circle cx="48" cy="18" r="5" fill="#F27BA0"/><circle cx="48" cy="18" r="2" fill="#FFD6E2"/>' +
      eyes(42, 54, 44, 2.8) + smile(45.5, 50, 2.5) + blush(37, 59, 49) +
      '<path d="M28 66H68L64 86H32Z" fill="#D9774A"/><rect x="26" y="64" width="44" height="8" rx="3" fill="#E58A5C"/>'],
    ['comnam', 'Cơm nắm', '#FFE7DE',
      '<path d="M48 16Q56 16 72 46Q84 70 72 76Q48 84 24 76Q12 70 24 46Q40 16 48 16Z" fill="#fff"/>' +
      '<path d="M30 60H66V80Q48 84 30 80Z" fill="#2F3D38"/><path d="M34 64h4M58 64h4" stroke="#47584F" stroke-width="2" stroke-linecap="round"/>' +
      eyes(40, 56, 46, 3.2) + smile(45, 52, 3) + blush(33, 63, 52) +
      '<circle cx="36" cy="30" r="1.6" fill="#EDEDED"/><circle cx="60" cy="36" r="1.4" fill="#EDEDED"/>'],
    ['tainghe', 'Âm nhạc', '#E7E1FF',
      '<path d="M22 56V48Q22 22 48 22Q74 22 74 48V56" stroke="#6B5BD2" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<rect x="14" y="50" width="18" height="26" rx="8" fill="#7C6CE0"/><rect x="64" y="50" width="18" height="26" rx="8" fill="#7C6CE0"/>' +
      '<rect x="19" y="55" width="8" height="16" rx="4" fill="#B3A8F5"/><rect x="69" y="55" width="8" height="16" rx="4" fill="#B3A8F5"/>' +
      '<path d="M44 66V44l14-4v20" stroke="#F06C9B" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<ellipse cx="40.5" cy="66" rx="4.6" ry="3.6" fill="#F06C9B"/><ellipse cx="54.5" cy="60" rx="4.6" ry="3.6" fill="#F06C9B"/>'],
    ['bongda', 'Bóng đá', '#D5F2EC',
      '<path d="M14 40h12M10 50h14M16 60h10" stroke="#7CCAB8" stroke-width="3.4" stroke-linecap="round"/>' +
      '<defs><clipPath id="avball"><circle cx="54" cy="50" r="26"/></clipPath></defs><circle cx="54" cy="50" r="26" fill="#fff"/>' +
      '<g clip-path="url(#avball)" fill="#33343D"><path d="M54.0 41.5L62.1 47.4L59.0 56.9L49.0 56.9L45.9 47.4Z"/><path d="M54.0 34.5L45.9 28.6L49.0 19.1L59.0 19.1L62.1 28.6ZM68.7 45.2L71.8 35.7L81.8 35.7L84.9 45.2L76.8 51.1ZM63.1 62.5L73.1 62.5L76.2 72.0L68.1 77.9L60.0 72.0ZM44.9 62.5L48.0 72.0L39.9 77.9L31.8 72.0L34.9 62.5ZM39.3 45.2L31.2 51.1L23.1 45.2L26.2 35.7L36.2 35.7Z"/>' +
      '<path d="M54 41.5V34.5M62.1 47.4L68.7 45.2M59 56.9L63.1 62.5M49 56.9L44.9 62.5M45.9 47.4L39.3 45.2M62.1 28.6L71.8 35.7M76.8 51.1L73.1 62.5M60 72H48M34.9 62.5L31.2 51.1M36.2 35.7L45.9 28.6" stroke="#33343D" stroke-width="2"/></g>' +
      '<circle cx="54" cy="50" r="25" fill="none" stroke="#C9E4DE" stroke-width="2"/>']
  ];
  /* PS1.3.61 · 12 gương mặt nét mảnh đen trắng (tự vẽ, hệ 96×96): nam/nữ, nhiều khuôn mặt (oval, V, vuông, tròn, dài), nhiều kiểu mắt và biểu cảm. Mã 'g…' giữ cố định. */
  var FC = (function () {
    var K = '#2B2A33';
    var SW = 1.4, FW = 1.35;
    var S = ' fill="#fff" stroke="' + K + '" stroke-width="' + SW + '" stroke-linejoin="round" stroke-linecap="round"';
    var L = ' fill="none" stroke="' + K + '" stroke-width="' + FW + '" stroke-linecap="round" stroke-linejoin="round"';
    var H = ' fill="' + K + '"', HB = ' fill="#5E3A2C"';
    function p(d, a) { return '<path d="' + d + '"' + a + '/>'; }
    function c(x, y, r, a) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '"' + a + '/>'; }
    /* áo */
    function body(t) {
      var s = p('M8 100C9 86 18 80 32 78L41 76H55L64 78C78 80 87 86 88 100Z', S);
      if (t === 'polo') s += p('M41 76L48 85L55 76', L) + p('M41 76l-4 8.5 7.5-1.8M55 76l4 8.5-7.5-1.8', S);
      else if (t === 'hood') s += p('M31 79Q48 93 65 79', L);
      else if (t === 'v') s += p('M41.5 76.5L48 84L54.5 76.5', L);
      else s += p('M41.5 77Q48 82.5 54.5 77', L);
      return s;
    }
    var NECK = p('M42 63V77.5Q48 80.5 54 77.5V63', S);
    /* khuôn mặt: [đường viền, nửa bề ngang] */
    var FACE = {
      oval: ['M31 46C31 33 38.5 27 48 27S65 33 65 46C65 60 57.5 71 48 71S31 60 31 46Z', 17],
      v: ['M31 45C31 32.5 38.5 27 48 27S65 32.5 65 45C65 55 61.5 61.5 56 67C52.5 70.5 50.5 72 48 72S43.5 70.5 40 67C34.5 61.5 31 55 31 45Z', 17],
      sq: ['M30.5 44C30.5 32 38 27 48 27S65.5 32 65.5 44V55.5C65.5 62.5 61.5 67 56.5 69.5C53.5 71 51 71.6 48 71.6S42.5 71 39.5 69.5C34.5 67 30.5 62.5 30.5 55.5Z', 17.5],
      round: ['M29.5 48C29.5 34 37.5 27.5 48 27.5S66.5 34 66.5 48C66.5 62 58.5 70.5 48 70.5S29.5 62 29.5 48Z', 18.5],
      long: ['M32 45C32 32 39 26 48 26S64 32 64 45C64 60 57 73 48 73S32 60 32 45Z', 16]
    };
    function ears(w) { var a = 48 - w + .6, b = 48 + w - .6; return p('M' + a + ' 48.5Q' + (a - 5.5) + ' 46.5 ' + (a - 5.5) + ' 52.5Q' + (a - 5.5) + ' 58.5 ' + (a + .8) + ' 58.5', S) + p('M' + b + ' 48.5Q' + (b + 5.5) + ' 46.5 ' + (b + 5.5) + ' 52.5Q' + (b + 5.5) + ' 58.5 ' + (b - .8) + ' 58.5', S); }
    /* mắt (tâm 41 và 55, y 50) */
    function both(f) { return f(41, 1) + f(55, -1); }
    var EYE = {
      dot: both(function (x) { return c(x, 50, 1.9, H); }),
      oval: both(function (x) { return '<ellipse cx="' + x + '" cy="50" rx="1.6" ry="2.5"' + H + '/>'; }),
      almond: both(function (x) { return p('M' + (x - 3.6) + ' 50.2Q' + x + ' 46 ' + (x + 3.6) + ' 50.2Q' + x + ' 53.6 ' + (x - 3.6) + ' 50.2Z', L) + c(x, 49.9, 1.5, H); }),
      lash: both(function (x, s) { return p('M' + (x - 3.6) + ' 50.2Q' + x + ' 46.8 ' + (x + 3.6) + ' 50.2', L) + c(x, 50.3, 1.6, H) + p('M' + (x - 3.4 * s) + ' 49.6l' + (-1.6 * s) + ' -1.2', L); }),
      happy: both(function (x) { return p('M' + (x - 3) + ' 51Q' + x + ' 47 ' + (x + 3) + ' 51', L); }),
      down: both(function (x) { return p('M' + (x - 3) + ' 49.5Q' + x + ' 52.5 ' + (x + 3) + ' 49.5', L); }),
      sleepy: both(function (x) { return p('M' + (x - 3.2) + ' 49.6H' + (x + 3.2), L) + p('M' + (x - 2) + ' 49.8A2 2 0 0 0 ' + (x + 2) + ' 49.8Z', H); }),
      wide: both(function (x) { return c(x, 49.8, 3.2, L) + c(x, 50.2, 1.5, H); }),
      side: both(function (x) { return p('M' + (x - 3.6) + ' 50.2Q' + x + ' 46 ' + (x + 3.6) + ' 50.2Q' + x + ' 53.6 ' + (x - 3.6) + ' 50.2Z', L) + c(x + 1.6, 49.2, 1.4, H); }),
      big: both(function (x) { return c(x, 50, 2.6, H); }),
      up: both(function (x) { return c(x + 1, 48.6, 1.8, H); }),
      wink: c(41, 50, 1.9, H) + p('M52 51Q55 47 58 51', L),
      spark: both(function (x) { return c(x, 50, 2.5, H) + c(x + .9, 49, .8, ' fill="#fff"'); })
    };
    var BROW = {
      arch: p('M37.5 44.2Q41 41.6 44.5 43.4M51.5 43.4Q55 41.6 58.5 44.2', L),
      flat: p('M37.5 43.8H44.5M51.5 43.8H58.5', L),
      high: p('M37.5 42.6Q41 40 44.5 41.8M51.5 41.8Q55 40 58.5 42.6', L),
      one: p('M37.5 44.2H44.5M51.5 41.8Q55 39.6 58.5 42', L),
      worry: p('M37.5 43.4Q41 43.6 44.5 41.8M51.5 41.8Q55 43.6 58.5 43.4', L),
      firm: p('M37.5 42.8L44.5 44M51.5 44L58.5 42.8', L),
      thick: p('M37.5 43.8Q41 42 44.5 43.4', ' fill="none" stroke="' + K + '" stroke-width="2.2" stroke-linecap="round"') + p('M51.5 43.4Q55 42 58.5 43.8', ' fill="none" stroke="' + K + '" stroke-width="2.2" stroke-linecap="round"')
    };
    var NOSE = {
      hook: p('M48.6 52.5Q46 57 49.6 58', L),
      l: p('M48 52.5V57.5H50', L),
      dot: p('M46.6 57.2Q48 58.4 49.4 57.2', L),
      curve: p('M49.5 52Q51 56 47.6 57.6', L)
    };
    var MOUTH = {
      smile: p('M43.2 63Q48 67 52.8 63', L),
      soft: p('M45 63.6Q48 65.4 51 63.6', L),
      flat: p('M45 64H51', L),
      laugh: p('M42 62H54Q53.5 69.5 48 69.5T42 62Z', H) + p('M44.8 67.4Q48 65.6 51.2 67.4Q50 69.2 48 69.2T44.8 67.4Z', ' fill="#F28AA0"'),
      grin: p('M42.2 62.2H53.8Q53 68.6 48 68.6T42.2 62.2Z', ' fill="#fff" stroke="' + K + '" stroke-width="' + FW + '" stroke-linejoin="round"') + p('M43 64H53', ' stroke="' + K + '" stroke-width="1"'),
      o: '<ellipse cx="48" cy="64.6" rx="2.6" ry="3.2"' + H + '/>',
      smirk: p('M44.5 64.4Q49 65.4 53 62.4', L),
      wavy: p('M44 64.2Q45.5 62.8 47 64.2T50 64.2T53 64.2', L),
      side: p('M46 64.4Q49.5 64.8 52 63.2', L),
      tiny: p('M46.6 63.8Q48 64.8 49.4 63.8', L)
    };
    var GL = ' fill="none" stroke="' + K + '" stroke-width="' + FW + '" stroke-linecap="round"';
    var GLASS = {
      round: c(41, 50, 5.8, GL) + c(55, 50, 5.8, GL) + p('M46.8 49.6H49.2M35.2 49L31.5 47.8M60.8 49L64.5 47.8', GL),
      rect: '<rect x="34.2" y="45.8" width="12.6" height="8.8" rx="2.6"' + GL + '/><rect x="49.2" y="45.8" width="12.6" height="8.8" rx="2.6"' + GL + '/>' + p('M46.8 49.6H49.2M34.2 48.6L31 47.6M61.8 48.6L65 47.6', GL),
      sun: p('M33.6 46.4H46.6V50.4Q46.6 55.2 40.6 55.2Q34.4 55.2 33.6 50.4Z', H) + p('M49.4 46.4H62.4V50.4Q61.6 55.2 55.4 55.2Q49.4 55.2 49.4 50.4Z', H) + p('M46.6 47.6H49.4M33.6 47L30.8 46.4M62.4 47L65.2 46.4', ' fill="none" stroke="' + K + '" stroke-width="' + FW + '" stroke-linecap="round"') + p('M36 48.4L39 48.4M51.8 48.4L54.8 48.4', ' stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity=".7"')
    };
    function face(o) {
      var f = FACE[o.shape || 'oval'];
      var g = body(o.shirt) + (o.back || '') + NECK + (o.noEars ? '' : ears(f[1])) + p(f[0], S) + (o.front || '') +
        (o.glass === 'sun' ? '' : BROW[o.brow || 'arch'] + EYE[o.eye || 'dot']) + NOSE[o.nose || 'hook'] + MOUTH[o.mouth || 'smile'] + (o.glass ? GLASS[o.glass] : '') + (o.extra || '');
      return '<g transform="translate(-13.4 -11) scale(1.28)">' + g + '</g>';
    }
    var F = [
      ['gm1', 'Nam cười lớn', '#FFE3C8', face({ shape: 'sq', shirt: 'tee', eye: 'happy', brow: 'high', mouth: 'laugh', nose: 'l',
        front: p('M29.5 47C27 33 33 23.5 45 22.5C50 19.5 58 20 62 24C68 27.5 69 37 66.5 47C65 41 62.5 37.5 59 35.5C55 38.5 46 39.5 38 37.5C34 40 31.5 43 29.5 47Z', H) })],
      ['gf1', 'Nữ tóc dài', '#FFDDE6', face({ shape: 'v', noEars: 1, shirt: 'v', eye: 'oval', brow: 'arch', mouth: 'soft', nose: 'dot',
        back: p('M27.5 47C25.5 31 34.5 22.5 48 22.5S70.5 31 68.5 47L71 86Q61 90 55.5 80H40.5Q35 90 25 86Z', H),
        front: p('M30.5 48C29.5 34 37.5 25.5 48 25.5S66.5 33 66 47C60 43 54 37 50 30C46 37 38.5 43 30.5 48Z', H) })],
      ['gm2', 'Nam kính tròn', '#D9E9FF', face({ shape: 'round', shirt: 'polo', eye: 'dot', brow: 'one', mouth: 'side', nose: 'hook', glass: 'round',
        front: p('M29 47C27.5 31 36 23.5 48 23.5C60 23.5 69 30 67 47C65 39 61 35 56 33.5C49 37 40 37.5 33 39.5C31 41.5 29.8 44 29 47Z', H) })],
      ['gf2', 'Nữ đuôi ngựa', '#E2F5D5', face({ shape: 'oval', shirt: 'tee', eye: 'big', brow: 'high', mouth: 'o', nose: 'dot',
        back: p('M62 30C74 28 80 40 77 54C75 64 79 70 82 74C72 76 66 66 66 56Z', HB),
        front: p('M30.5 47C29 33 37 25 48 25S67.5 32 65.5 46C63 38 57 33.5 50 32.5C43 33 36 38 30.5 47Z', HB) + '<rect x="62" y="28" width="6" height="7" rx="2" fill="#F26B8A" transform="rotate(-20 65 31.5)"/>' })],
      ['gf3', 'Nữ kính, suy nghĩ', '#EDE3FF', face({ shape: 'v', noEars: 1, shirt: 'polo', eye: 'up', brow: 'worry', mouth: 'wavy', nose: 'l', glass: 'rect',
        back: p('M27.5 46C26 30 35 23 48 23S70 30 68.5 46L70 66Q64 70 58 66H38Q32 70 26 66Z', H),
        front: p('M30 47C29 31 37 25 48 25S67.5 31 66 47L64.5 41.5H31.5Z', H) })],
      ['gm3', 'Nam quyết tâm', '#D3F0EA', face({ shape: 'sq', shirt: 'polo', eye: 'oval', brow: 'firm', mouth: 'soft', nose: 'curve',
        front: p('M30.4 44C30.5 32 38 26 48 26S65.6 32 65.6 44C63 38.5 60 36.5 56 36C50 37 44 37 40 36C35.5 36.5 32.5 39 30.4 44Z', H) })],
      ['gf4', 'Nữ búi tóc', '#FFF0C2', face({ shape: 'round', shirt: 'tee', eye: 'wink', brow: 'arch', mouth: 'smile', nose: 'dot',
        back: c(48, 19.5, 8.5, H),
        front: p('M29.8 47C29 33 37.5 25 48 25S67 33 66.2 47C63.5 39 59 34 54 32.5C50 34 41 34.5 36 37C33.5 40 31 43 29.8 47Z', H) + p('M41 24.5Q48 28 55 24.5', ' fill="none" stroke="#F2A33A" stroke-width="3" stroke-linecap="round"') })],
      ['gm4', 'Nam tóc xoăn', '#FFE1D6', face({ shape: 'long', shirt: 'hood', eye: 'sleepy', brow: 'flat', mouth: 'smile', nose: 'hook',
        front: '<g' + H + '><circle cx="34.5" cy="36" r="6"/><circle cx="40" cy="29" r="6.5"/><circle cx="48" cy="26" r="7"/><circle cx="56.5" cy="28.5" r="6.5"/><circle cx="61.5" cy="35.5" r="6"/><circle cx="33" cy="43" r="3.6"/><circle cx="63" cy="43" r="3.6"/><circle cx="44" cy="34" r="4"/><circle cx="52" cy="34" r="4"/></g>' })],
      ['gf5', 'Nữ tóc tém', '#D5ECFF', face({ shape: 'v', shirt: 'polo', eye: 'happy', brow: 'arch', mouth: 'smirk', nose: 'curve',
        front: p('M29.5 56C26 34 35 24 48.5 24C60 24 69.5 31 66.5 50C65 42 62.5 38 59 36C53 41 42 42 36 39.5C33 43 31 49 29.5 56Z', H) + '<rect x="56" y="33" width="9" height="3.4" rx="1.7" fill="#F2B93A" transform="rotate(-28 60.5 34.7)"/>' })],
      ['gm5', 'Nam ngại ngùng', '#E6F4CF', face({ shape: 'oval', shirt: 'tee', eye: 'down', brow: 'worry', mouth: 'tiny', nose: 'dot',
        front: p('M29 47C27.5 31 36 23.5 48 23.5C60 23.5 69 30 67 47C65 39 61 35 56 33.5C49 37 40 37.5 33 39.5C31 41.5 29.8 44 29 47Z', H) })],
      ['gf6', 'Nữ băng đô', '#FFE3EE', face({ shape: 'oval', noEars: 1, shirt: 'tee', eye: 'spark', brow: 'high', mouth: 'grin', nose: 'dot',
        back: p('M28 44C25 30 35 22.5 48 22.5S71 30 68 44C71 50 67 54 70 60C73 66 68 70 70 76C64 80 58 76 56 72H40C38 76 32 80 26 76C28 70 23 66 26 60C29 54 25 50 28 44Z', HB),
        front: p('M30.5 49C29 34 37.5 26 48 26S67 34 65.5 49C63 41 58 36.5 52 35C47 38 38 41 30.5 49Z', HB) + p('M31.5 37Q48 22 64.5 37', ' fill="none" stroke="#7DB8F2" stroke-width="3.2" stroke-linecap="round"') })],
      ['gm6', 'Nam kính đen', '#E5E7EC', face({ shape: 'sq', shirt: 'v', mouth: 'grin', nose: 'l', glass: 'sun',
        front: p('M29.5 47C27.5 31 36 23 48 23S69 30.5 66.5 47C65 41 63 37.5 60 35.5L36 33.5C33 37 31 42 29.5 47Z', H) })]
    ];
    return F;
  })();
  /* màu cho kiểu chữ cái: [nền, chữ] — màu đầu tiên giữ đúng màu cũ */
  var COLS = [['#FFE08F', '#6A4A00'], ['#CFE2FF', '#1F4FA8'], ['#CDEFD9', '#1D6B40'], ['#FFD6DF', '#A3264A'], ['#E4DBFF', '#5136B0'], ['#FFDCC2', '#9A4B12'], ['#CDEFF0', '#126C70'], ['#E5E7EC', '#3D4350']];
  var MAP = {}; FC.concat(AV).forEach(function (a) { MAP[a[0]] = a; });
  function esc(s) { return W.PS ? PS.esc(s) : String(s); }
  function cur() {
    var v = String((W.PS && PS.prefs().av) || 'c:0'), k = v.slice(2);
    if (v.charAt(0) === 'i' && MAP[k]) return { t: 'i', k: k };
    var n = +k; return { t: 'c', k: (n >= 0 && n < COLS.length) ? n : 0 };
  }
  function letter() {
    var p = (W.PS && PS.profile()) || {}, w = String(p.name || '').trim().split(/\s+/);
    return (w[w.length - 1] || '?').charAt(0).toUpperCase();
  }
  function iconSVG(k, sz) {
    var a = MAP[k]; if (!a) return '';
    return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 96 96" aria-hidden="true"><defs><clipPath id="avc-' + k + '"><circle cx="48" cy="48" r="48"/></clipPath></defs>' +
      '<g clip-path="url(#avc-' + k + ')"><rect width="96" height="96" fill="' + a[2] + '"/>' + a[3] + '</g></svg>';
  }
  function html(sz) {
    var c = cur(); sz = sz || 40;
    if (c.t === 'i') return '<span class="ps-av ps-av--i" style="width:' + sz + 'px;height:' + sz + 'px">' + iconSVG(c.k, sz) + '</span>';
    var col = COLS[c.k];
    return '<span class="ps-av" style="width:' + sz + 'px;height:' + sz + 'px;background:' + col[0] + ';color:' + col[1] + ';font-size:' + Math.round(sz * .44) + 'px">' + esc(letter()) + '</span>';
  }
  function status() { var c = cur(); return c.t === 'i' ? esc(MAP[c.k][1]) : 'Chữ cái'; }
  function body() {
    var c = cur(), L = esc(letter());
    function grid(list, lab) {
      return '<div class="avp" role="radiogroup" aria-label="' + lab + '">' + list.map(function (a) {
        var on = c.t === 'i' && c.k === a[0];
        return '<button type="button" class="avp__b' + (on ? ' on' : '') + '" data-av="i:' + a[0] + '" role="radio" aria-checked="' + on + '" aria-label="' + esc(a[1]) + '">' + iconSVG(a[0], 52) + '</button>';
      }).join('') + '</div>';
    }
    return '<p class="ps-small">Chọn gương mặt giống bạn, một hình bạn thích, hoặc chữ cái đầu tên với màu bạn chọn.</p>' +
      '<p class="avp__h">Gương mặt</p>' + grid(FC, 'Gương mặt') +
      '<p class="avp__h">Hình vui</p>' + grid(AV, 'Hình vui') +
      '<p class="avp__h">Chữ cái và màu</p><div class="avp avp--c" role="radiogroup" aria-label="Chữ cái và màu">' + COLS.map(function (col, i) {
        var on = c.t === 'c' && c.k === i;
        return '<button type="button" class="avp__b avp__l' + (on ? ' on' : '') + '" data-av="c:' + i + '" role="radio" aria-checked="' + on + '" aria-label="Chữ cái, màu ' + (i + 1) + '" style="background:' + col[0] + ';color:' + col[1] + '">' + L + '</button>';
      }).join('') + '</div>';
  }
  function rowHTML() { return { k: 'av', ic: 'smile', title: 'Ảnh đại diện', status: status(), body: body() }; }
  function wire(root) {
    if (!root || root.__avWired) return; root.__avWired = 1;
    root.addEventListener('click', function (e) {
      var b = PS.closest(e.target, '[data-av]'); if (!b || !root.contains(b)) return;
      PS.setPref('av', b.getAttribute('data-av'));
      var row = root.querySelector('.ps-srow[data-k="av"]');
      if (row) { row.querySelector('.ps-srow__b').innerHTML = body(); row.querySelector('.ps-srow__st').innerHTML = status(); }
      var top = document.querySelector('.hbar__av'); if (top) top.innerHTML = html(40);
      PS.toast('Đã đổi ảnh đại diện.');
    });
  }
  W.PSAvatar = { html: html, rowHTML: rowHTML, wire: wire, list: AV, faces: FC, icon: iconSVG, cur: cur, cols: COLS, letter: letter, map: MAP, body: body }; /* PS1.3.57: cur/cols/letter/map/body cho cờ CD02 */
})(window);
