/* ===== SECTION: link.js ===== */
/* PS1.3.64 · M.Claude.3.4.1 · NỐI THẺ THÓI QUEN (xếp chồng thói quen).
   Luật đã chốt 24/11/2026 (claude/ps1.3.63-noi-the-de-xuat.md):
   - Mở tính năng + Bài 6 khi có 1 thẻ hằng ngày đạt bậc Vững tay. Lưu S.lk = {on: ngày mở, ask: {}, full: {}}.
   - Neo = thẻ hằng ngày từ Vững tay trở lên, hoặc thẻ Thành nếp / Đang duy trì. Thẻ “khi gặp dịp” không nối.
   - Liên kết lưu ở thẻ sau: S.habits[id].after = mã thẻ neo. Mỗi neo kéo 1 thẻ, chuỗi tối đa 3 thẻ, tối đa 2 chuỗi đang rèn.
   - Luật v2 (ngày, bậc, Lửa) giữ nguyên cho từng thẻ. Không thêm điểm, không phạt kép.
   Chữ đã duyệt: 02-Duyet-text/PS1.3.63-Noi-the-duyet-chu.xlsx (mã RT.*). Sửa chữ: sửa ở LK_T, LK_NEXT, LK_B6. */
var LK_T={
  unT:'Mở khóa: Nối thẻ thói quen',                                   /* RT.unlock.title */
  unShin:'[Tên] ơi, thẻ “[Tên thẻ]” đã Vững tay. Giờ thói quen làm neo được: kéo thêm một thói quen mới muốn rèn đi cùng.', /* RT.unlock.shin */
  unB1:'Học Bài 6', unB2:'Để sau', unToast:'Bài 6 đã mở trong Thư viện › Bài học.',
  lesH:'Bài học rèn thói quen',                                        /* RT.les.strip.h */
  lock:'Mở khi có một thẻ Vững tay',                                   /* RT.les.b6.lock */
  lockToast:'Bài 6 mở khi bạn có một thẻ hằng ngày đạt bậc Vững tay (14 ngày).',
  b2app3:'Khi có thẻ đạt bậc Vững tay, chính thẻ đó cũng làm tín hiệu được. Bài 6 sẽ chỉ cách.',
  btn:'Nối thói quen mới',                                             /* RT.link.btn */
  sheetT:'Nối sau “[Tên thẻ neo]”',
  sheetSub:'Chọn một thói quen nhỏ, làm ngay sau thói quen này, ở cùng chỗ.',
  sheetSug:'Shin gợi ý', sheetOwn:'Thẻ tự tạo', sheetLib:'Chọn trong Thư viện',
  sheetNone:'Shin chưa có gợi ý cho thẻ này. Chọn trong Thư viện một thói quen làm được ngay sau nó nhé.',
  pickAnchor:'Chọn thẻ làm neo',                                       /* MỚI, chưa có trong Excel */
  whenGrp:'Sau thẻ của bạn',
  badge:'Nối sau: [Tên thẻ neo]',
  linkToast:'Đã nối “[Thẻ mới]” sau “[Thẻ neo]”.',
  join:'rồi', jointAria:'Cả chuỗi đã làm hôm nay',
  pdfLink:'Nối sau: [Tên thẻ neo]',                                     /* RT.pdf.link (đã duyệt, dùng từ PS1.3.65) */
  fullToast:'Trọn chuỗi! Thói quen cũ đã kéo được thói quen mới.',
  ciAll:'Cả chuỗi đã làm', ciNote:'Ghi chú chung cho cả chuỗi',
  hintNoAnchor:'Hôm nay thiếu neo cũng không sao. Thói quen mới vẫn làm lúc khác được.',
  hintNoNew:'Neo xong rồi. Lần sau, làm thói quen mới ngay khi vừa xong neo nhé.',
  editSec:'Nối thẻ', editInfo:'Thẻ này nối sau “[Tên thẻ neo]”.', editBtn:'Tháo nối',
  editConfirm:'Tháo nối hai thẻ? Mỗi thẻ vẫn giữ ngày và bậc của mình.', editYes:'Tháo nối', editNo:'Giữ nguyên', editToast:'Đã tháo nối.',
  limDip:'Thẻ “khi gặp dịp” không làm neo được, vì không diễn ra đều mỗi ngày.',
  limLv:'Thẻ cần đạt bậc Vững tay mới làm neo được. Còn [n] ngày nữa.',
  limOne:'Thẻ này đã kéo một thói quen rồi. Mỗi neo chỉ kéo một thói quen.',
  limTwo:'Bạn đang rèn 2 chuỗi. Giữ vững 2 chuỗi này trước nhé.',
  limThree:'Chuỗi đã đủ 3 thẻ.',
  limFull:'Tay bạn đã đủ 5 thẻ. Chuyển một thẻ Thành nếp sang duy trì để có chỗ.',
  orphan:'Thẻ neo “[Thẻ neo]” đang tạm dừng. Nối “[Thẻ mới]” vào thẻ khác, hay để riêng?', orphanB1:'Chọn neo khác', orphanB2:'Để riêng',
  next3:'“[Thẻ mới]” cũng Vững tay rồi. Muốn nối thêm thói quen thứ ba?', next3B1:'Nối thêm', next3B2:'Để sau',
  master:'“[Thẻ mới]” đã Thành nếp! Chuyển cả chuỗi sang Đang duy trì để có chỗ cho thói quen mới?', masterB1:'Chuyển cả chuỗi', masterB2:'Để sau',
  keepTag:'Chuỗi', wk:'nối sau: [Tên thẻ neo]'
};
/* Gợi ý theo neo: [mã thẻ sau, vế Khi…]. 'tc:docsach' = mở màn tự tạo điền sẵn (thư viện chưa có thẻ đọc sách). */
var LK_NEXT={
  som:[['5phut','đến lớp sớm, ngồi chờ vào học'],['chao','đến cổng trường sớm']],
  chao:[['5s','chào xong, về chỗ ngồi']],
  '5s':[['anuong','gấp chăn, cất đồ xong']],
  '5phut':[['memo','học xong 5 phút']],
  anuong:[['vandong','uống xong ly nước buổi sáng']],
  chitieu:[['ngu','ghi xong chi tiêu buổi tối']],
  ngu:[['tc:docsach','cất điện thoại xong, lên giường'],['camxuc','cất điện thoại xong, lên giường']]
};
var LK_CUSTOM={docsach:{name:'Đọc 1 trang sách',act:'đọc 1 trang sách',icon:'sach'}};

/* ---------- Bài 6 ---------- */
var LK_B6={id:'b6', n:6, t:'Thói quen cũ kéo một thói quen mới', icon:'tia', g:4, kind:'link',
  c1:'<div class="hw__k">Ý chính</div><p class="lsbig">Thói quen đã vững là chỗ dựa tốt nhất cho thói quen mới.</p>'+
     '<p>Có thói quen bạn đã làm đều đủ lâu, gần như không cần ai nhắc. Đó là một cái neo.</p>'+
     '<p>Gắn thói quen mới <b>ngay sau</b> thói quen đó, ở <b>cùng chỗ</b>. Xong thói quen cũ là nhớ ra thói quen mới. Thói quen cũ cũng được giữ tiếp.</p>'+
     '<div class="pair"><div><small>TÁCH RỜI</small>Uống nước lúc vừa dậy. Còn squat thì “lúc nào rảnh”.</div><div class="ok"><small>NỐI LIỀN</small>Uống xong ly nước buổi sáng, làm luôn 10 cái squat cạnh giường.</div></div>'+
     '<div class="lsq">Thói quen nào bạn đã làm đều mỗi ngày, gần như không cần nghĩ?</div>',
  dlg:[['s',5,'smile','Hồi ở trường, anh tập đi học sớm 5 phút, mấy tuần là quen. Nhưng đến lớp sớm thì anh lại ngồi lướt điện thoại.'],
       ['shin','think','Rồi anh làm gì với 5 phút đó?'],
       ['s',5,'hi','Anh nối luôn: đến lớp là mở 5 từ vựng. Ôn xong thì nói một câu có từ vừa ôn với bạn ngồi cạnh. Sang Nhật, giờ nghỉ ca anh vẫn giữ nếp đó.'],
       ['shin','cheer','Vậy thói quen cũ không bị bỏ, mà còn kéo thói quen mới đi cùng!']],
  app:['Thẻ hằng ngày đạt bậc Vững tay sẽ làm neo được. Mở thẻ đó, chạm “Nối thói quen mới”. Hoặc chọn neo ở vế “Khi…” lúc thêm thẻ.',
       'Hai thẻ nối hiện liền nhau ở Hôm nay. Mỗi thẻ vẫn tính ngày, tính bậc riêng: hôm nào lỡ neo, bạn vẫn làm thói quen mới lúc khác được.'],
  todo:'Hôm nay: chọn một thẻ Vững tay làm neo, nối thêm một thói quen thật nhỏ ngay sau nó.', go:['link','Nối thẻ ngay']};
var LK_EX={lead:'Mỗi thói quen cũ, nối thói quen nào ngay sau là hợp nhất?',
  rows:[{neo:'Đến lớp sớm 5 phút', o:['Ôn 5 từ vựng lúc chờ vào học','Ghi 1 dòng chi tiêu trong ngày','Cắm sạc điện thoại xa giường'], ok:0, why:'Có sẵn 5 phút chờ, ngay tại lớp.'},
        {neo:'Uống 1 ly nước khi vừa thức dậy', o:['Nói 1 câu tiếng Nhật với thầy cô','Làm 10 cái squat cạnh giường','Ghi 1 điều mình để ý thấy trên đường về'], ok:1, why:'Cùng lúc vừa dậy, cùng chỗ, không cần chuẩn bị gì.'},
        {neo:'Cắm sạc điện thoại xa giường', o:['Chào bác bảo vệ ở cổng trường','Ôn 5 từ lúc chờ xe buýt','Lên giường, đọc 1 trang sách'], ok:2, why:'Điện thoại đã xa, tay rảnh, sách để sẵn đầu giường.'}],
  bad:'Việc này diễn ra lúc khác, chỗ khác.', done:'Thói quen mới hợp nhất khi làm ngay sau thói quen cũ, ở cùng chỗ.',
  wLbl:'Viết thử một cặp nối của bạn', wPh:'Khi cắm sạc xa giường xong, mình sẽ đọc 1 trang sách'};
LMAP.b6=LK_B6;
/* PS1.3.65: hình Bài 6 (how-visual.js › LV.b6): Hiểu sau đoạn đầu, cặp hình trước .pair; Senpai và Trong app do lsDialog/lsApp tự ghép. */
(function(){var V=window.HOW_VISUAL&&HOW_VISUAL.lessons&&HOW_VISUAL.lessons.b6;if(!V||LK_B6._hv)return;LK_B6._hv=1;var c=LK_B6.c1,i=c.indexOf('</p>');
 if(V.hieu&&i>0)c=c.slice(0,i+4)+V.hieu()+c.slice(i+4);
 if(V.pair)c=c.replace('<div class="pair">',V.pair()+'<div class="pair">');
 LK_B6.c1=c;})();
if(LMAP.b2&&LMAP.b2.app&&LMAP.b2.app.indexOf(LK_T.b2app3)<0)LMAP.b2.app.push(LK_T.b2app3);

/* ---------- Dữ liệu, điều kiện ---------- */
var LKC=null, LK_PEND=null;
function lkS(){if(!S.lk||typeof S.lk!=='object')S.lk={};S.lk.ask=S.lk.ask||{};S.lk.full=S.lk.full||{};return S.lk;}
function lkOn(){return !!(S&&S.lk&&S.lk.on);}
function lkName(id){return HMAP[id]?sname(id):'';}
function lkAfter(id){var u=H(id);return u&&u.after&&u.after!==id&&H(u.after)&&HMAP[u.after]?u.after:'';}
function lkFollower(id){var ks=Object.keys(S.habits||{});for(var i=0;i<ks.length;i++){var k=ks[i];if(k!==id&&HMAP[k]&&S.habits[k]&&S.habits[k].after===id)return k;}return '';}
function lkChain(id){var r=id,seen={},g=0;while(lkAfter(r)&&!seen[r]&&g++<6){seen[r]=1;r=lkAfter(r);}var out=[r],c=r;g=0;while((c=lkFollower(c))&&out.indexOf(c)<0&&g++<6)out.push(c);return out;}
function lkChains(){var res=[],done={};Object.keys(S.habits||{}).forEach(function(id){if(!HMAP[id]||done[id]||(!lkAfter(id)&&!lkFollower(id)))return;var c=lkChain(id);c.forEach(function(x){done[x]=1;});if(c.length>1)res.push(c);});return res;}
function lkTraining(id){var u=H(id);return !!u&&!u.master&&u.status!=='keep';}
function lkActiveChains(){return lkChains().filter(function(c){return c.some(lkTraining);});}
function lkDaily(id){return !!HMAP[id]&&id!=='__new'&&!isDip(id);}
function lkLive(id){var u=H(id);return !!u&&!!HMAP[id]&&u.status!=='pause'&&(S.slots.indexOf(id)>=0||u.status==='keep');}
function lkStrong(id){var u=H(id);return !!u&&lkDaily(id)&&((u.lv||1)>=3||!!u.master||u.status==='keep');}
/* Lý do thẻ chưa làm neo được ('' = làm neo được) */
function lkWhy(id){
  if(!lkDaily(id))return LK_T.limDip;
  if(!lkStrong(id)){var n=Math.max(1,needFor(id,2)-r2Count(id));return LK_T.limLv.replace('[n]',n);}
  if(lkFollower(id))return LK_T.limOne;
  var c=lkChain(id);if(c.length>=3)return LK_T.limThree;
  if(c.length<2&&lkActiveChains().length>=2)return LK_T.limTwo;
  return '';
}
function lkAnchors(){return Object.keys(S.habits||{}).filter(function(id){return lkLive(id)&&!lkWhy(id);});}
function lkAct(id){var u=H(id);return String((u&&u.act)||(HMAP[id]&&HMAP[id].act)||'').trim();}
function lkKhi(anchor,next){var l=LK_NEXT[anchor]||[];for(var i=0;i<l.length;i++){if(l[i][0]===next)return l[i][1];}return 'vừa '+lkAct(anchor)+' xong';}
function lkEligibleAny(){return Object.keys(S.habits||{}).some(function(id){var u=H(id);return lkDaily(id)&&((u.lv||1)>=3||!!u.master);});}
function lkFirstStrong(){var ks=Object.keys(S.habits||{}).filter(function(id){var u=H(id);return lkDaily(id)&&((u.lv||1)>=3||!!u.master);});ks.sort(function(a,b){return String(H(b).lvSince||'').localeCompare(String(H(a).lvSince||''));});return ks[0]||'';}
function lkFill(t,map){Object.keys(map).forEach(function(k){t=t.split(k).join(map[k]);});return t;}
function lkEmblem(id){return '<span class="flow-emblem">'+(typeof m3HabitBadge==='function'?m3HabitBadge(id):'')+'</span>';}
function lkGroup(id){return typeof m3HabitGroup==='function'?m3HabitGroup(id):((HMAP[id]&&HMAP[id].g)||1);}
function lkIc(n){var p={link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',unlink:'<path d="M18.8 13.4l1.7-1.7a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M5.2 10.6l-1.7 1.7a5 5 0 0 0 7 7l1.7-1.7"/><path d="M8 2v3M2 8h3M16 22v-3M22 16h-3"/>',lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',bulb:'<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"/>',all:'<path d="M2 12l5 5L18 6"/><path d="M12 16l1 1 9-9"/>',down:'<path d="M12 5v14M5 12l7 7 7-7"/>',lib:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5V21h16"/>'}[n]||'';return '<svg class="lk-ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';}
function lkBadge(){var b=window.HOW_VISUAL&&HOW_VISUAL.link&&HOW_VISUAL.link.badge;return b?'<div class="lk-badge">'+b()+'</div>':'<span class="lk-pop-ic" aria-hidden="true">'+lkIc('link')+'</span>';}
function lkBold(name){return '<b>'+esc(name)+'</b>';}

/* ---------- Mở khóa ---------- */
function lkCheck(fromRecord){
  if(!S)return;
  if(lkOn()||!lkEligibleAny())return;
  var L=lkS();L.on=dk();save(true);
  var a=lkFirstStrong();
  if(fromRecord){R2_QUEUE.push({lk:'unlock',id:a});clearTimeout(R2_FLUSH_T);R2_FLUSH_T=setTimeout(r2Flush,700);}
  else setTimeout(function(){if(!OV&&!(typeof NBOPEN!=='undefined'&&NBOPEN))lkPop({lk:'unlock',id:a});else{R2_QUEUE.push({lk:'unlock',id:a});}},1400);
}
function lkPop(a){
  if(a.lk==='unlock'){
    openMini('<div class="center lk-pop">'+lkBadge()+'<h2 style="margin:8px 0 4px">'+esc(LK_T.unT)+'</h2></div>'+
      say('shin','cheer',lkFill(esc(LK_T.unShin),{'[Tên]':lkBold(S.name||'Bạn'),'[Tên thẻ]':esc(a.id&&HMAP[a.id]?sname(a.id):'')}))+
      '<div class="stack" style="margin-top:12px"><button class="btn btn--wide" data-act="lkLes">'+esc(LK_T.unB1)+'</button><button class="btn btn--ghost btn--wide" data-act="lkLater">'+esc(LK_T.unB2)+'</button></div>');
    fanfare();return;
  }
  if(a.lk==='next3'){
    openMini('<div class="center"><span style="display:inline-block">'+hico(a.id,'lg')+'</span></div>'+
      say('shin','proud',esc(lkFill(LK_T.next3,{'[Thẻ mới]':sname(a.id)})))+
      '<div class="stack" style="margin-top:12px"><button class="btn btn--wide" data-act="lkLink" data-v="'+a.id+'">'+esc(LK_T.next3B1)+'</button><button class="btn btn--ghost btn--wide" data-act="close">'+esc(LK_T.next3B2)+'</button></div>');
    return;
  }
}
var lkFlush0=r2Flush;
r2Flush=function(){
  if(R2_QUEUE.length&&R2_QUEUE[0].lk){if(OV||(typeof NBOPEN!=='undefined'&&NBOPEN))return;var a=R2_QUEUE.shift();if(a.lk==='next3'&&(!H(a.id)||lkWhy(a.id))){r2Flush();return;}lkPop(a);return;}
  return lkFlush0.apply(this,arguments);
};
var lkWR0=writeRecord;
writeRecord=function(id,d,m,note,why){
  var out=lkWR0.apply(this,arguments);
  if(out&&S){try{
    var ups=(out.r2&&out.r2.ups)||[],queued=false;
    if(lkOn())ups.forEach(function(a){if(a.lv===3&&lkAfter(a.id)&&!lkWhy(a.id)){R2_QUEUE.push({lk:'next3',id:a.id});queued=true;}});
    if(queued){clearTimeout(R2_FLUSH_T);R2_FLUSH_T=setTimeout(r2Flush,700);}
    lkCheck(true);
  }catch(e){}}
  return out;
};
/* Thẻ cuối chuỗi Thành nếp → hỏi chuyển cả chuỗi sang Đang duy trì */
var lkMaster0=masterShow;
masterShow=function(id){
  var c=lkChain(id);
  if(c.length<2||lkFollower(id)||!lkAfter(id))return lkMaster0.apply(this,arguments);
  var mv=c.filter(function(x){var u=H(x);return u&&u.master&&u.status!=='keep';});
  if(mv.length<2)return lkMaster0.apply(this,arguments);
  openMini('<div class="center"><span style="display:inline-block">'+hico(id,'lg')+'</span><h2 style="margin:10px 0 4px">Thẻ đã Thành nếp!</h2></div>'+
    say('shin','proud',esc(lkFill(LK_T.master,{'[Thẻ mới]':sname(id)})))+
    '<div class="stack" style="margin-top:12px"><button class="btn btn--wide" data-act="lkKeepAll" data-v="'+mv.join(',')+'">'+esc(LK_T.masterB1)+'</button><button class="btn btn--ghost btn--wide" data-act="close">'+esc(LK_T.masterB2)+'</button></div>');
  fanfare();
};

/* ---------- Tạo nối ---------- */
function lkOpenLink(anchor){
  var why=lkWhy(anchor);if(why){toast(why,4500);return;}
  if(OV)closeOv(true);
  openMini('');lkDrawLink(anchor);
}
function lkDrawLink(anchor){
  var list=(LK_NEXT[anchor]||[]).filter(function(p){var x=p[0];if(x.indexOf('tc:')===0)return true;if(!HMAP[x]||isDip(x))return false;var u=H(x);if(!u)return true;return u.status!=='keep'&&!u.master&&!lkAfter(x)&&!lkFollower(x);});
  var h=f2Head(lkFill(LK_T.sheetT,{'[Tên thẻ neo]':sname(anchor)}),'')+'<div class="f2-body lk-link"><p class="lk-sub">'+esc(LK_T.sheetSub)+'</p>';
  if(list.length){
    h+='<div class="lk-sug-h">'+lkIc('bulb')+esc(LK_T.sheetSug)+'</div><div class="lk-sug">';
    list.forEach(function(p){var x=p[0],cu=x.indexOf('tc:')===0,c=cu?LK_CUSTOM[x.slice(3)]:null,name=cu?c.name:hname(x),act=cu?c.act:(H(x)?lkAct(x):HMAP[x].act);
      h+='<button class="lk-sug-row" data-act="lkPickSug" data-v="'+anchor+'|'+x+'">'+(cu?'<span class="flow-emblem lk-own-ic">'+mi('menu_book')+'</span>':lkEmblem(x))+
        '<span class="lk-sug-t"><b>'+esc(name)+(cu?' <em>'+esc(LK_T.sheetOwn)+'</em>':'')+'</b><small>Khi '+esc(p[1])+', mình sẽ '+esc(act)+'.</small></span>'+mi('chevron_right')+'</button>';});
    h+='</div>';
  } else h+='<p class="lk-none">'+esc(LK_T.sheetNone)+'</p>';
  h+='<button class="btn btn--ghost btn--wide lk-libbtn" data-act="lkLib" data-v="'+anchor+'">'+lkIc('lib')+esc(LK_T.sheetLib)+'</button></div>';
  f2Mount('record',h,false);
  var sh=OV&&$('.sheet',OV);if(sh)sh.classList.add('lk-sheet');
}
function lkGoK(){if(!ST)return;var k=ST.steps.indexOf('k');if(k>=0&&ST.edit){ST.i=k;drawStart();}}
function lkPreset(anchor){if(!ST)return;if(ST.cust?ST.rhy==='p':isDip(ST.id))return;ST.after=anchor;ST.anchor=lkKhi(anchor,ST.cust?'':ST.id);ST.custom=ST.custom||{};ST.custom.k=false;drawStart();}
function lkPickSug(anchor,x){
  LK_PEND=null;
  if(x.indexOf('tc:')===0){var c=LK_CUSTOM[x.slice(3)];closeOv(true);openCustom();if(ST&&ST.cust&&!ST.edit){ST.name=c.name;ST.act=c.act;ST.icon=c.icon;lkPreset(anchor);ST.anchor=lkKhi(anchor,x);drawStart();}return;}
  var u=H(x);
  if(u){closeOv(true);if(S.custom[x])openCustom(x);else openStart(x,true);if(ST){lkPreset(anchor);ST.anchor=lkKhi(anchor,x);lkGoK();drawStart();}return;}
  if(S.slots.indexOf(null)<0){toast(LK_T.limFull,4500);return;}
  closeOv(true);openStart(x,false);if(ST&&ST.id===x)lkPreset(anchor);
}
function lkFromLesson(){
  var a=lkAnchors();
  if(!a.length){var s=lkFirstStrong();toast(s?lkWhy(s)||LK_T.lockToast:LK_T.lockToast,4500);PG=0;render();return;}
  if(a.length===1){lkOpenLink(a[0]);return;}
  openMini('');
  var h=f2Head(LK_T.pickAnchor,'')+'<div class="f2-body lk-link"><div class="lk-sug">'+a.map(function(id){return '<button class="lk-sug-row" data-act="lkLink" data-v="'+id+'">'+lkEmblem(id)+'<span class="lk-sug-t"><b>'+esc(hname(id))+'</b><small>'+esc(lkAct(id))+'</small></span>'+mi('chevron_right')+'</button>';}).join('')+'</div></div>';
  f2Mount('record',h,false);var sh=OV&&$('.sheet',OV);if(sh)sh.classList.add('lk-sheet');
}
/* Từ Thư viện: thẻ chọn tiếp theo được nối sẵn vào neo */
var lkOS0=openStart;
openStart=function(id,edit){var r=lkOS0.apply(this,arguments);if(edit&&ST&&ST.id===id&&lkAfter(id)&&lkLive(lkAfter(id)))ST.after=lkAfter(id);if(LK_PEND&&!edit&&ST&&ST.id===id&&Date.now()-LK_PEND.t<600000){var a=LK_PEND.a;LK_PEND=null;lkPreset(a);}return r;};
var lkOC0=openCustom;
openCustom=function(id){var r=lkOC0.apply(this,arguments);if(id&&ST&&ST.id===id&&lkAfter(id)&&lkLive(lkAfter(id)))ST.after=lkAfter(id);if(LK_PEND&&!id&&ST&&ST.cust&&Date.now()-LK_PEND.t<600000){var a=LK_PEND.a;LK_PEND=null;lkPreset(a);}return r;};

/* Bước “Khi…”: nhóm “Sau thẻ của bạn” + mục Tháo nối khi sửa */
var lkDS0=drawStart;
drawStart=function(){var r=lkDS0.apply(this,arguments);try{lkStartUI();}catch(e){if(window.console)console.warn(e);}return r;};
function lkStartUI(){
  if(!ST||!OV||ST.steps[ST.i]!=='k'||!lkOn())return;
  var sheet=$('.sheet',OV),q=sheet&&$('.qlab',sheet);if(!q)return;
  var me=ST.cust&&!ST.edit?'':ST.id,dip=ST.cust?ST.rhy==='p':isDip(ST.id);
  var mine=me?lkChain(me):[];
  var c=dip?[]:lkAnchors().filter(function(a){return a!==me&&mine.indexOf(a)<0&&a!==ST.after;});
  if(ST.after&&H(ST.after))c.unshift(ST.after);
  var box='';
  if(c.length)box+='<div class="lk-when"><div class="lk-when-lab">'+lkIc('link')+esc(LK_T.whenGrp)+'</div><div>'+c.map(function(a){var t=lkKhi(a,me);return '<button class="chp'+(ST.after===a?' on':'')+'" data-act="lkWhen" data-v="'+a+'">'+esc(t)+'</button>';}).join('')+'</div></div>';
  if(ST.edit&&me&&lkAfter(me)&&ST.after===lkAfter(me))box+='<div class="lk-edit" id="lkEdit"><div class="lk-when-lab">'+lkIc('link')+esc(LK_T.editSec)+'</div><p>'+esc(lkFill(LK_T.editInfo,{'[Tên thẻ neo]':sname(lkAfter(me))}))+'</p><button class="btn btn--ghost btn--sm" data-act="lkUnlink">'+lkIc('unlink')+esc(LK_T.editBtn)+'</button></div>';
  if(!box)return;
  var chips=q.nextElementSibling,anchorEl=chips;var cnt=$('#stCnt',sheet);if(cnt&&cnt.parentNode===q.parentNode)anchorEl=cnt;
  (anchorEl||q).insertAdjacentHTML('afterend',box);
  if(ST.after){var add=$('.chp--add',chips);if(add)add.classList.remove('on');}
}
var lkStNext0=stNext;
stNext=function(){
  if(!ST)return lkStNext0.apply(this,arguments);
  var last=ST.i>=ST.steps.length-1,aft=ST.after,clr=ST.lkClr,cust=ST.cust,edit=ST.edit,id=ST.id,seq=S.cseq||0;
  if(last&&ST.steps[ST.i]==='k'){}/* chặn ở stState như cũ */
  var r=lkStNext0.apply(this,arguments);
  if(!last)return r;
  var nid=cust&&!edit?((S.cseq||0)>seq?'u'+S.cseq:''):id,u=nid&&H(nid);
  if(!u)return r;
  if(aft&&H(aft)&&aft!==nid&&lkDaily(nid)){
    if(u.after!==aft){u.after=aft;save(true);toast(lkFill(LK_T.linkToast,{'[Thẻ mới]':sname(nid),'[Thẻ neo]':sname(aft)}),4500);setTimeout(refreshAll,30);}
  } else if(edit&&clr&&u.after){delete u.after;save(true);setTimeout(refreshAll,30);}
  return r;
};

/* ---------- Hôm nay: khối chuỗi ---------- */
function lkMark(d,id){return mark(d,id)||'';}
/* Khớp nối chỉ chạy hiệu ứng lần đầu sáng trong phiên (không lặp mỗi lần vẽ lại). Lần mở app đầu tiên: ghi nhận sẵn các khớp đã sáng. */
var LK_LIT=null;
function lkLitInit(d){if(LK_LIT)return;LK_LIT={};lkShowChains().forEach(function(c){for(var i=1;i<c.length;i++){if(/^[yp]$/.test(lkMark(d,c[i-1]))&&/^[yp]$/.test(lkMark(d,c[i])))LK_LIT[d+'|'+c[i-1]+'>'+c[i]]=1;}});}
function lkBlock(c,d){lkLitInit(d);
  var all=c.every(function(id){return lkMark(d,id)==='y';}),done=c.every(function(id){return !!lkMark(d,id);}),title=c.map(lkName).join(' → ');
  var h='<section class="lk-chain'+(all?' lk-full':'')+'" aria-label="'+esc(title)+'"><div class="lk-rows">';
  c.forEach(function(id,i){
    if(i){var on=/^[yp]$/.test(lkMark(d,c[i-1]))&&/^[yp]$/.test(lkMark(d,id)),lk=d+'|'+c[i-1]+'>'+id,lit=on&&!LK_LIT[lk];if(on)LK_LIT[lk]=1;
      h+='<div class="lk-join'+(on?' on':'')+(lit?' lit':'')+'"><i aria-hidden="true"></i><em class="lk-knot" aria-hidden="true"></em><span>'+esc(LK_T.join)+'</span></div>';}
    var m=lkMark(d,id),u=H(id);
    h+='<div class="lk-row flow-group-'+lkGroup(id)+'"><button class="flow-card-entry" data-act="flowFront" data-v="'+id+'" aria-label="Xem thẻ '+esc(hname(id))+'">'+lkEmblem(id)+'</button>'+
       '<button class="lk-main" data-act="lkCI" data-v="'+c[0]+'"><b>'+esc(hname(id))+'</b><small class="'+(m?'evening-result state-'+m:'')+'">'+esc(m?RECORD_LABEL[m]:'Khi '+((u&&u.anchor)||''))+'</small></button></div>';
  });
  h+='</div><button class="lk-plus" data-act="lkCI" data-v="'+c[0]+'" aria-label="Ghi nhận chuỗi '+esc(title)+'">'+mi(done?'edit':'add')+'</button>'+(all?'<span class="lk-sr">'+esc(LK_T.jointAria)+'</span>':'')+'</section>';
  return h;
}
function lkShowChains(){return lkChains().map(function(c){var a=c[0];if(!lkLive(a))return [];var out=[];for(var i=0;i<c.length;i++){if(!lkLive(c[i]))break;out.push(c[i]);}return out;}).filter(function(c){return c.length>1;});}
function lkToday(){
  var page=$('.m3-page-today');if(!page||!lkOn()||$('.lk-list',page))return;
  var chains=lkShowChains();if(!chains.length)return;var d=dk();
  chains.forEach(function(c){c.forEach(function(id){
    page.querySelectorAll('[data-flow-swipe="'+id+'"],[data-v^="'+id+'|"]').forEach(function(el){if(el.closest('.lk-list'))return;var box=el.closest('.growth-swipe-shell')||el.closest('.flow-today-row')||el.closest('.keep31-row');if(box&&box.parentNode)box.parentNode.removeChild(box);});
  });});
  var det=$('details.evening-done',page);
  if(det){var n=det.querySelectorAll('.flow-today-row').length;if(!n)det.parentNode.removeChild(det);else{var sp=det.querySelectorAll('summary span')[1];if(sp)sp.textContent=sp.textContent.replace(/\d+\s*$/,String(n));}}
  var html='<div class="lk-list">'+chains.map(function(c){return lkBlock(c,d);}).join('')+'</div>';
  var tb=$('.flow-today-toolbar',page);
  if(tb)tb.insertAdjacentHTML('afterend',html);else page.insertAdjacentHTML('afterbegin',html);
}
function lkWeek(){
  var page=$('.m3-page-week');if(!page||!lkOn())return;
  page.querySelectorAll('.flow-week-title[data-v]').forEach(function(b){var id=b.getAttribute('data-v'),a=lkAfter(id),sm=$('small',b);if(!a||!sm||$('.lk-wk',sm))return;sm.insertAdjacentHTML('beforeend','<span class="lk-wk"> · '+esc(lkFill(LK_T.wk,{'[Tên thẻ neo]':sname(a)}))+'</span>');});
}
/* Neo bị tạm dừng / cất khỏi tay → hỏi một lần */
function lkOrphans(){
  if(!lkOn()||OV||PG!==0)return;var L=lkS(),hit=null;
  Object.keys(S.habits||{}).some(function(id){var u=H(id);if(!u||!u.after||!HMAP[id]||!lkLive(id))return false;var a=u.after,key=a+'|'+(H(a)?H(a).status:'x');if(H(a)&&lkLive(a))return false;if(L.ask[id]===key)return false;hit={id:id,a:a,key:key};return true;});
  if(!hit)return;L.ask[hit.id]=hit.key;save(true);
  setTimeout(function(){if(OV)return;openMini('<div class="center"><span style="display:inline-block">'+hico(hit.id,'lg')+'</span></div>'+
    say('shin','think',esc(lkFill(LK_T.orphan,{'[Thẻ neo]':HMAP[hit.a]?sname(hit.a):'','[Thẻ mới]':sname(hit.id)})))+
    '<div class="stack" style="margin-top:12px"><button class="btn btn--wide" data-act="lkOrphanPick" data-v="'+hit.id+'">'+esc(LK_T.orphanB1)+'</button><button class="btn btn--ghost btn--wide" data-act="lkOrphanSolo" data-v="'+hit.id+'">'+esc(LK_T.orphanB2)+'</button></div>');},700);
}
var lkRP0=renderPage;
renderPage=function(){var r=lkRP0.apply(this,arguments);try{if(S){if(PG===0)lkToday();else if(PG===1)lkWeek();lkOrphans();}}catch(e){if(window.console)console.warn(e);}return r;};

/* Thẻ: nút “Nối thói quen mới” (neo) hoặc dòng “Nối sau: …” (thẻ sau) */
var lkDC0=drawCard;
drawCard=function(){var r=lkDC0.apply(this,arguments);try{lkCardUI();}catch(e){}return r;};
function lkCardUI(){
  if(!lkOn()||typeof CARD==='undefined'||!CARD||CARD.tab==='journal'||!OV)return;
  var id=CARD.id,an=$('.band-anchor',OV);if(!an||$('.lk-card',OV))return;var h='';
  if(lkAfter(id))h+='<p class="lk-card lk-badge">'+lkIc('link')+esc(lkFill(LK_T.badge,{'[Tên thẻ neo]':sname(lkAfter(id))}))+'</p>';
  if(lkLive(id)&&!lkWhy(id))h+='<button class="lk-card lk-card-btn" data-act="lkLink" data-v="'+id+'">'+lkIc('link')+esc(LK_T.btn)+'</button>';
  if(h)an.insertAdjacentHTML('beforeend',h);
}

/* ---------- Đóng dấu cả chuỗi ---------- */
function lkOpenCI(root,day){
  day=day||dk();var c=lkChain(root).filter(lkLive);if(c.length<2){openNote(root,day);return;}
  var ans={},txt='';c.forEach(function(id){ans[id]=mark(day,id)||'';var n=(S.notes[day]||{})[id];if(n&&!txt)txt=n;});
  LKC={ids:c,day:day,ans:ans,text:txt};
  if(OV)closeOv(true);openMini('');lkDrawCI();
}
function lkReady(){return !!LKC&&LKC.ids.every(function(id){return !!LKC.ans[id];})&&!!String(LKC.text||'').trim();}
function lkHint(){if(!LKC)return '';var c=LKC.ids;for(var i=1;i<c.length;i++){var a=LKC.ans[c[i-1]],b=LKC.ans[c[i]];if(a==='n')return LK_T.hintNoAnchor;if((a==='y'||a==='p')&&b==='n')return LK_T.hintNoNew;}return '';}
function lkDrawCI(){
  if(!LKC||!OV)return;var c=LKC.ids,hint=lkHint();
  var h=f2Head(c.map(lkName).join(' → '),LKC.day===dk()?'Hôm nay':treeDate30(LKC.day))+'<div class="f2-body lk-ci">';
  c.forEach(function(id,i){if(i)h+='<div class="lk-ci-join" aria-hidden="true"><i></i><span>'+esc(LK_T.join)+'</span></div>';h+='<div class="lk-ci-item">'+f2Identity(id)+recordOptions29(id,LKC.ans[id],'lkAns')+'</div>';});
  h+='<button class="f2-text-button lk-all" data-act="lkAll">'+lkIc('all')+esc(LK_T.ciAll)+'</button>';
  if(hint)h+='<div class="lk-hint">'+say('shin','think',esc(hint))+'</div>';
  h+='<div class="f2-note-field"><label class="lbl" for="lkIn">'+esc(LK_T.ciNote)+' <small>· Bắt buộc</small></label><textarea class="inp" id="lkIn" data-in="lkNote" rows="3" required aria-required="true" aria-describedby="lkReq" placeholder="Ghi lại một điều cụ thể">'+esc(LKC.text)+'</textarea><p class="f2-error" id="lkReq" role="alert" hidden>Viết một ghi chú ngắn trước khi lưu nhé.</p></div></div>';
  h+='<footer class="sbar f2-footer f2-record-footer"><button class="f2-text-button" data-act="close">Để sau</button><button class="btn" id="lkGo" data-act="lkSave"'+(lkReady()?'':' disabled')+'>'+mi('check')+'Lưu ghi nhận</button></footer>';
  f2Mount('record',h,true);var sh=OV&&$('.sheet',OV);if(sh)sh.classList.add('lk-sheet');
}
function lkSave(){
  if(!LKC)return;if(!String(LKC.text||'').trim()){var er=$('#lkReq');if(er)er.hidden=false;var i=$('#lkIn');if(i)i.focus();return;}
  if(!lkReady())return;
  var c=LKC.ids,d=LKC.day,t=LKC.text;c.forEach(function(id){writeRecord(id,d,LKC.ans[id],t,'');});
  var all=c.every(function(id){return mark(d,id)==='y';}),L=lkS(),key=d+'|'+c[0];
  LKC=null;closeOv(true);refreshAll();
  if(all&&!L.full[key]){L.full[key]=1;save(true);fanfare();toast(LK_T.fullToast,4500);}
  else toast('Đã lưu · '+esc(c.map(lkName).join(' → ')),3500);
}
/* Ghi chú chuỗi cũng không cho dán */
var lkNoPaste0=noPaste36;
noPaste36=function(t){return lkNoPaste0(t)||!!(t&&t.closest&&t.closest('[data-in="lkNote"]'));};
document.addEventListener('input',function(e){var k=e.target&&e.target.getAttribute&&e.target.getAttribute('data-in');if(k!=='lkNote'||!LKC)return;LKC.text=e.target.value;var b=$('#lkGo');if(b)b.disabled=!lkReady();if(String(LKC.text).trim()){var er=$('#lkReq');if(er)er.hidden=true;}});

/* ---------- Bài 6 trong Thư viện và bài luyện ---------- */
var lkLesList0=lesList38;
lesList38=function(){var h=lkLesList0.apply(this,arguments),L=LK_B6,ok=!!S.les[L.id],row;
  if(lkOn())row='<button type="button" class="row38" data-act="lsOpen" data-v="b6"><span class="num38'+(ok?' ok':'')+'">'+(ok?check38():L.n)+'</span><span class="row38-t"><b>'+esc(L.t)+'</b><small>Bài '+L.n+' · '+(ok?'Đã học':'4 thẻ ngắn')+'</small></span>'+chev38()+'</button>';
  else row='<button type="button" class="row38 lk-locked" data-act="lkLockToast"><span class="num38">'+lkIc('lock')+'</span><span class="row38-t"><b>'+esc(L.t)+'</b><small>Bài '+L.n+' · '+esc(LK_T.lock)+'</small></span></button>';
  var i=h.lastIndexOf('</div>');return i<0?h+row:h.slice(0,i)+row+h.slice(i);};
var lkLesTab0=lesTab38;
lesTab38=function(){return lkLesTab0.apply(this,arguments).replace('<h2 class="h38">5 bài nền tảng</h2>','<h2 class="h38">'+esc(LK_T.lesH)+'</h2>');};
var lkInter0=lsInter;
lsInter=function(){
  var L=LMAP[LS.id];if(!L||L.kind!=='link')return lkInter0.apply(this,arguments);
  var st=LS.st;st.p=st.p||{};var all=true,h='<p class="small muted" style="margin:0 0 8px">'+esc(LK_EX.lead)+'</p>';
  LK_EX.rows.forEach(function(r,i){var p=st.p[i];if(p!==r.ok)all=false;
    h+='<div class="cuer lk-ex"><b>'+esc(r.neo)+' <span class="lk-ex-arrow" aria-hidden="true">'+lkIc('down')+'</span></b><div>'+r.o.map(function(o,j){var cls=p===j?(j===r.ok?' on good':' bad'):'';return '<button class="chp'+cls+'" data-act="ls" data-v="lk|'+i+'|'+j+'"'+(p===r.ok?' aria-disabled="true"':'')+'>'+esc(o)+'</button>';}).join('')+'</div>'+
      (p==null?'':p===r.ok?'<small class="lk-ex-why">'+mi('check_circle')+esc(r.why)+'</small>':'<div class="out out--bad"><b>Thử lại nhé.</b>'+esc(LK_EX.bad)+'</div><button class="btn btn--gold btn--sm invite" data-act="ls" data-v="lkR|'+i+'">'+ic('redo')+'Thử chọn lại</button>')+'</div>';});
  if(all)h+='<div class="out out--good"><b>Đúng rồi!</b>'+esc(LK_EX.done)+'</div>'+lsWrite(LK_EX.wLbl,LK_EX.wPh);
  return h;
};
var lkAct0=lsAct;
lsAct=function(v){
  var p=String(v).split('|');if(!LS||(p[0]!=='lk'&&p[0]!=='lkR'))return lkAct0.apply(this,arguments);
  var st=LS.st;st.p=st.p||{};
  if(p[0]==='lk'){if(st.p[+p[1]]===LK_EX.rows[+p[1]].ok)return;st.p[+p[1]]=+p[2];if(+p[2]===LK_EX.rows[+p[1]].ok&&LK_EX.rows.every(function(r,i){return st.p[i]===r.ok;}))ting();}
  else delete st.p[+p[1]];
  lsRe();
};
var lkLsGo0=lsGo;
lsGo=function(v){
  if(v!=='link')return lkLsGo0.apply(this,arguments);
  var L=LS&&LMAP[LS.id];if(L&&!S.les[L.id]){S.les[L.id]={d:dk(),w:(LS.w||'').trim()};save(true);}
  closeOv(true);LS=null;render();setTimeout(lkFromLesson,250);
};

/* ---------- Nút ---------- */
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('[data-act]');if(!b)return;var a=b.getAttribute('data-act'),v=b.getAttribute('data-v')||'';
  if(a==='stPick'&&ST&&/^k\|/.test(v)&&ST.after){ST.after=null;ST.lkClr=1;return;}
  if(a.indexOf('lk')!==0||a==='lkNote')return;
  e.preventDefault();e.stopImmediatePropagation();
  if(a==='lkCI')lkOpenCI(v);
  else if(a==='lkAns'){if(!LKC)return;var q=v.split('|');LKC.ans[q[0]]=q[1];lkDrawCI();}
  else if(a==='lkAll'){if(!LKC)return;LKC.ids.forEach(function(id){LKC.ans[id]='y';});lkDrawCI();}
  else if(a==='lkSave')lkSave();
  else if(a==='lkLes'){closeOv(true);setTimeout(function(){openLesson('b6');},120);}
  else if(a==='lkLater'){closeOv(true);toast(LK_T.unToast,4000);}
  else if(a==='lkLockToast')toast(LK_T.lockToast,4500);
  else if(a==='lkLink')lkOpenLink(v);
  else if(a==='lkPickSug'){var q2=v.split('|');lkPickSug(q2[0],q2.slice(1).join('|'));}
  else if(a==='lkLib'){LK_PEND={a:v,t:Date.now()};closeOv(true);openStore(true);}
  else if(a==='lkWhen'){if(!ST)return;ST.after=v;ST.lkClr=0;ST.anchor=lkKhi(v,ST.cust&&!ST.edit?'':ST.id);ST.custom=ST.custom||{};ST.custom.k=false;drawStart();}
  else if(a==='lkUnlink'){var box=$('#lkEdit');if(box)box.innerHTML='<p>'+esc(LK_T.editConfirm)+'</p><div class="lk-edit-btns"><button class="btn btn--sm" data-act="lkUnlinkYes">'+esc(LK_T.editYes)+'</button><button class="btn btn--ghost btn--sm" data-act="lkUnlinkNo">'+esc(LK_T.editNo)+'</button></div>';}
  else if(a==='lkUnlinkNo'){drawStart();}
  else if(a==='lkUnlinkYes'){if(!ST)return;var u=H(ST.id);if(u)delete u.after;ST.after=null;save(true);toast(LK_T.editToast);drawStart();}
  else if(a==='lkKeepAll'){v.split(',').forEach(function(id){var uu=H(id);if(!uu)return;var i=S.slots.indexOf(id);if(i>=0)S.slots[i]=null;uu.status='keep';});save(true);closeOv(true);render();toast('Thẻ đã sang mục Đang duy trì. Khung này trống cho thẻ mới.',4500);}
  else if(a==='lkOrphanPick'){closeOv(true);if(S.custom[v])openCustom(v);else openStart(v,true);lkGoK();}
  else if(a==='lkOrphanSolo'){var u2=H(v);if(u2)delete u2.after;save(true);closeOv(true);render();}
},true);

/* ---------- Demo: một chuỗi buổi tối (Ngủ đủ giấc → Đọc 1 trang sách) ---------- */
var lkDemo0=buildDemo;
buildDemo=function(){var s=lkDemo0.apply(this,arguments),t=dk();try{
  s.lk={on:addD(t,-6),ask:{},full:{}};
  /* PS1.3.65: bài học demo thiếu ngày (d) làm In nhật ký báo lỗi; thêm ngày minh họa */
  if(s.les)Object.keys(s.les).forEach(function(k,i){var l=s.les[k];if(l&&typeof l==='object'&&!l.d)l.d=addD(t,-20+i*2);});
  if(s.custom&&s.custom.u1&&s.habits&&s.habits.u1&&s.habits.ngu){
    s.custom.u1.name='Đọc 1 trang sách';s.custom.u1.icon='sach';s.custom.u1.g=5;s.custom.u1.act='đọc 1 trang sách';s.custom.u1.why='Để mỗi tối học thêm một điều nhỏ, ngủ cũng dễ hơn.';
    s.habits.u1.act='đọc 1 trang sách';s.habits.u1.anchor='cất điện thoại xong, lên giường';s.habits.u1.who='người ham học hỏi';s.habits.u1.after='ngu';
  }}catch(e){}return s;};

/* Mở app: học viên cũ đã có thẻ Vững tay thì mở khóa và báo một lần */
setTimeout(function(){try{if(S&&!DEMO)lkCheck(false);}catch(e){}},2500);

/* ---------- PS1.3.65 · Nhật ký PDF cho thầy cô: dòng “Nối sau: …” (RT.pdf.link) + Bài 6 trong bảng bài học ---------- */
var lkPrint0=buildPrint;
buildPrint=function(){lkPrint0.apply(this,arguments);try{
  var box=$('#printArea');if(!box)return;
  var all=S.order.filter(function(id){return S.habits[id];}),hs=box.querySelectorAll('.habit');
  all.forEach(function(id,i){var a=lkAfter(id),p=hs[i]&&hs[i].querySelector('p');if(!a||!p)return;
    var br=p.querySelectorAll('br')[1],line=document.createElement('span'),t=esc(lkFill(LK_T.pdfLink,{'[Tên thẻ neo]':hname(a)}));
    if(br){line.innerHTML=t+'<br>';br.parentNode.insertBefore(line,br.nextSibling);}else{line.innerHTML='<br>'+t;p.appendChild(line);}});
  var L=S.les&&S.les.b6;if(L){var row='<tr><td style="width:34%">Bài 6. '+esc(LK_B6.t)+'</td><td>'+(L.d?dm(L.d):'')+(L.w?' · '+esc(L.w):'')+'</td></tr>',hd=[].filter.call(box.querySelectorAll('h2'),function(h){return h.textContent==='Bài học rèn thói quen';})[0];
    if(hd&&hd.nextElementSibling&&hd.nextElementSibling.tagName==='TABLE')hd.nextElementSibling.insertAdjacentHTML('beforeend',row);
    else{var w=[].filter.call(box.querySelectorAll('h2'),function(h){return h.textContent==='Thắng nhỏ mỗi tuần';})[0],html='<h2>Bài học rèn thói quen</h2><table>'+row+'</table>';if(w)w.insertAdjacentHTML('beforebegin',html);else{var st=box.querySelector('.stats');if(st)st.insertAdjacentHTML('beforebegin',html);else box.insertAdjacentHTML('beforeend',html);}}}
}catch(e){}};

/* ---------- PS1.3.66 · Check-in tối gom theo chuỗi ----------
   Các thẻ cùng chuỗi đang chờ trong Check-in gộp thành MỘT bước: chọn kết quả từng thẻ, nút “Cả chuỗi đã làm”, một ghi chú chung (chép vào mọi thẻ).
   Không đổi cách lưu: ciFinish vẫn lưu từng thẻ như cũ. Thẻ sau bị rút khỏi CI.wizard.ids; nhóm ở CI.lkG {thẻ đứng đầu: [các thẻ theo thứ tự chuỗi]}. */
function lkCiGroup(){
  if(!CI||!CI.wizard||CI.done||!lkOn())return;var w=CI.wizard,G={};
  lkShowChains().forEach(function(c){
    var inW=c.filter(function(id){return w.ids.indexOf(id)>=0;});if(!inW.length)return;
    /* thẻ neo Đang duy trì chưa ghi hôm nay: hiện cùng chuỗi (không bắt buộc, như mục “Rèn thêm nếu muốn”) */
    var m=c.filter(function(id){return w.ids.indexOf(id)>=0||(CI.keeps.indexOf(id)>=0&&!CI.base[id]);});if(m.length<2)return;
    var lead=inW.slice().sort(function(a,b){return w.ids.indexOf(a)-w.ids.indexOf(b);})[0];
    m.forEach(function(id){if(id===lead)return;var k=w.ids.indexOf(id);if(k<0)return;w.ids.splice(k,1);if(k<w.index)w.index--;});
    G[lead]=m;});
  CI.lkG=G;
}
function lkCiMembers(){var id=ci40Current();return id&&CI.lkG&&CI.lkG[id]?CI.lkG[id]:null;}
function lkCiAns(id){return ci40Answer(id);}
function lkCiOpt(id){return ci40IsKeep(id)&&CI.wizard.ids.indexOf(id)<0;}
function lkCiNote(m){return String(CI.notes[m[0]]||'').trim()?CI.notes[m[0]]:(m.map(function(id){return CI.notes[id];}).filter(function(t){return String(t||'').trim();})[0]||'');}
function lkCiHint(m){for(var i=1;i<m.length;i++){var a=lkCiAns(m[i-1]),b=lkCiAns(m[i]);if(a==='n')return LK_T.hintNoAnchor;if((a==='y'||a==='p')&&b==='n')return LK_T.hintNoNew;}return '';}
function lkCiOpts(id,a){return ci40IsKeep(id)?'<div class="record-options f2-options ci40-keep-option"><button class="record-option state-y" data-act="ci40Answer" data-v="'+id+'|y" aria-pressed="'+(a==='y')+'">'+mi('check_circle')+'<span>Đã làm</span></button></div>':recordOptions29(id,a,'ci40Answer');}
var lkCiReady0=ci40Ready;
ci40Ready=function(){var m=lkCiMembers();if(!m)return lkCiReady0.apply(this,arguments);return m.every(function(id){return lkCiOpt(id)||!!lkCiAns(id);})&&!!String(lkCiNote(m)).trim();};
var lkCiDraw0=drawCI;
drawCI=function(){
  if(!CI||CI.done||(typeof CI40_OPENING!=='undefined'&&CI40_OPENING)||!CI.wizard){lkCiDraw0.apply(this,arguments);return;}
  lkCiGroup();var m=lkCiMembers();if(!m){lkCiDraw0.apply(this,arguments);return;}
  CI.growthQuestion=CI.growthQuestion||(S.ci[CI.date]||{}).question||((S.ciDrafts[CI.date]||{}).question)||growthQuestion(CI.date);
  var w=CI.wizard,i=w.index,total=w.ids.length+2,lead=m[0],u=H(lead)||{},note=lkCiNote(m),hint=lkCiHint(m);
  m.forEach(function(id){CI.notes[id]=note;});
  var h=ci40Top(CI.date===dk()?'Check-in hôm nay':'Check-in · '+dm(CI.date),i,total,i>0)+'<div class="ci40-scroll">'+ci40Hero(m.map(lkName).join(' → '),'Khi '+(u.anchor||'đến lúc đã chọn'),m3HabitIcon(lead))+'<div class="ci40-body lk-ci lk-ci40">';
  m.forEach(function(id,k){if(k)h+='<div class="lk-ci-join" aria-hidden="true"><i></i><span>'+esc(LK_T.join)+'</span></div>';h+='<div class="lk-ci-item">'+f2Identity(id)+lkCiOpts(id,lkCiAns(id))+'</div>';});
  h+='<button class="f2-text-button lk-all" data-act="ci40LkAll">'+lkIc('all')+esc(LK_T.ciAll)+'</button>';
  if(hint)h+='<div class="lk-hint">'+say('shin','think',esc(hint))+'</div>';
  h+='<div class="f2-note-field"><label class="lbl" for="ci-note-'+lead+'">'+esc(LK_T.ciNote)+' <small>· Bắt buộc</small></label><textarea class="inp" id="ci-note-'+lead+'" data-in="ciNote29" data-id="'+lead+'" data-lk="'+m.join(',')+'" rows="3" required aria-required="true" placeholder="Ghi lại một điều cụ thể">'+esc(note)+'</textarea></div>';
  h+='<p class="ci40-error" role="alert" hidden></p>'+ci40Extras()+'</div></div>'+ci40Footer();
  ci40Mount('checkin',h,true);
};
/* Ghi chú chung: chép sang mọi thẻ trong chuỗi (sau bộ xử lý gốc ciNote29). */
document.addEventListener('input',function(e){var t=e.target;if(!CI||CI.done||!t.matches||!t.matches('[data-in=ciNote29][data-lk]'))return;
  t.getAttribute('data-lk').split(',').forEach(function(id){CI.notes[id]=t.value;if(id!==t.dataset.id&&typeof markSource16==='function')markSource16(id,CI.date,'typed');});stashCI29();var b=$('#ci40Go');if(b)b.disabled=!ci40Ready();});
/* Tiếp tục / Bỏ qua / Cả chuỗi đã làm ở bước chuỗi: chặn trước bộ xử lý ci40 gốc (bắt ở window). */
window.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('[data-act]');if(!b||!CI||CI.done||!CI.wizard)return;var act=b.dataset.act,m=lkCiMembers();if(!m||!/^ci40(Next|Skip|LkAll)$/.test(act))return;
  e.preventDefault();e.stopImmediatePropagation();ci40RememberOpen();
  if(act==='ci40LkAll'){m.forEach(function(id){if(ci40IsKeep(id))CI.keep[id]=true;else{CI.ans[id]='y';delete CI.skip[id];if(CI.base[id])CI.edit[id]=true;}delete CI.wizard.deferred[id];delete CI.wizard.preserved[id];});stashCI29();drawCI();return;}
  if(act==='ci40Next'){if(!ci40Ready())return;m.forEach(function(id){if(!lkCiOpt(id)||lkCiAns(id))ci40Activate(id);});ci40Go(CI.wizard.index+1);return;}
  if(act==='ci40Skip'){m.forEach(ci40Defer);ci40Go(CI.wizard.index+1);}
},true);
