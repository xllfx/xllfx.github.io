/* ============================================================
   导航站主脚本（一糖模式）
   顶栏：左菜单(可下拉) + 右搜索/主题
   侧栏：快捷项 + 一级分类(可展开二级)
   主体：一级区块 + 二级 pills 点击切换
   ============================================================ */
(function () {
    'use strict';

    var SITE_ = (typeof SITE !== 'undefined') ? SITE : { name: '我的导航' };
    var CATS  = (typeof CATEGORIES !== 'undefined') ? CATEGORIES : [];
    var MENU  = (typeof TOP_MENU !== 'undefined') ? TOP_MENU : [];
    var QUICK = (typeof SIDE_QUICK !== 'undefined') ? SIDE_QUICK : [];
    var HITO  = (typeof HITOKOTO !== 'undefined') ? HITOKOTO : '';
    // 静态句子库：优先用 HITOKOTO_LIST，空则回退单句
    var HITO_LIST = (typeof HITOKOTO_LIST !== 'undefined' && HITOKOTO_LIST && HITOKOTO_LIST.length)
        ? HITOKOTO_LIST.slice() : (HITO ? [HITO] : []);
    var HITO_MS = (typeof HITOKOTO_INTERVAL !== 'undefined') ? (HITOKOTO_INTERVAL|0) : 20000;
    var GROUPS= (typeof SEARCH_GROUPS !== 'undefined') ? SEARCH_GROUPS : [];

    /* ---------- 多语言 ----------
   词典以「中文原文」为 key，按语言码取对应列；没配置的回退简体中文。
   站点名属专有名词，默认不翻译（可在 CAT_I18N 里自行补）。 */
    var LANGS_ = (typeof LANGS    !=='undefined' && LANGS && LANGS.length) ? LANGS : [];
    var UI_    = (typeof UI_I18N  !=='undefined') ? UI_I18N   : {};
    var CAT_   = (typeof CAT_I18N !=='undefined') ? CAT_I18N  : {};
    var ENG_   = (typeof ENG_I18N !=='undefined') ? ENG_I18N  : {};
    var CITY_  = (typeof CITY_I18N!=='undefined') ? CITY_I18N : {};
    var DESC_  = (typeof DESC_I18N!=='undefined') ? DESC_I18N : {};
    var SITEX_ = (typeof SITE_I18N!=='undefined') ? SITE_I18N : {};
    var HITOX_ = (typeof HITO_I18N!=='undefined') ? HITO_I18N : {};

    var WIN_BOUND=false;
    var LANG_KEY='nav-lang';
    var curLang='zh';
    (function(){
        try{ var v=localStorage.getItem(LANG_KEY); if(v) curLang=v; }catch(e){}
        // 语言裁剪后，旧浏览器可能残留已删除的语言码（如 ja/de）——校验并回退
        var ok=false;
        for(var i=0;i<LANGS_.length;i++){ if(LANGS_[i].code===curLang){ ok=true; break; } }
        if(!ok){ curLang='zh'; try{ localStorage.setItem(LANG_KEY,'zh'); }catch(e){} }
    })();

    function pick(dict,key,fb){
        if(!dict||!key) return fb;
        var row=dict[key]; if(!row) return fb;
        // 回退链：当前语言 → 英文 → 简体中文 → 原文
        // （新增站点只补了英文时，切到其他语言也能显示英文而不是中文）
        var v=row[curLang];
        if(v===undefined||v===null||v==='') v=row['en'];
        if(v===undefined||v===null||v==='') v=row['zh'];
        return (v===undefined||v===null||v==='')?fb:v;
    }
    function t(key,vars){                       // 界面文案，支持 {xxx} 占位符
        var str=pick(UI_,key,key);
        if(vars) for(var k in vars) str=str.split('{'+k+'}').join(vars[k]);
        return str;
    }
    function cn(o,f){ return o?pick(CAT_,o[f],o[f]):''; }          // 分类/分组/菜单名
    function en(o,f){ return o?pick(ENG_,o[f],o[f]):''; }          // 搜索引擎名
    function dn(x){ return pick(DESC_,x,x); }                      // 站点简介
    function sn(f){ return pick(SITEX_,f,(typeof SITE_!=='undefined'?SITE_[f]:'')); }
    function cityN(x){ return pick(CITY_,x,x); }                   // 时钟城市
    function hitoList(){                                           // 各语言一言库
        var l=HITOX_[curLang];
        if(l&&l.length) return l;
        return HITO_LIST.length?HITO_LIST:(HITO?[HITO]:[]);
    }

    function $(id){ return document.getElementById(id); }
    var el = {
        sideLogo:$('side-logo'), sideLogoTxt:$('side-logo-txt'), sideMenu:$('side-menu'),
        sidebar:$('sidebar'), mask:$('side-mask'), sideClose:$('side-close'),
        mobileMenu:$('mobile-menu'), topMenu:$('top-menu'), hitokoto:$('hitokoto'),
        searchBtn:$('search-btn'), themeBtn:$('theme-btn'), themeBtn2:$('theme-btn2'),
        themeIco:$('theme-ico'), sType:$('s-type'), sEngines:$('s-engines'),
        searchForm:$('search-form'), searchText:$('search-text'),
        sections:$('sections'), empty:$('empty'), foot:$('foot'),
        header:$('header'), toTop:$('to-top'), modal:$('site-search'),
        innerSearch:$('inner-search'), innerResult:$('inner-result'), innerClose:$('inner-close')
    };

    /* ---------- 工具 ---------- */
    function esc(s){
        return String(s==null?'':s).replace(/[&<>"']/g,function(c){
            return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
        });
    }
    function hostOf(u){ try{ return new URL(u).hostname.replace(/^www\./,''); }catch(e){ return ''; } }
    /* 卡片自定义标签：tags:['编程','教程'] → <span class="url-tags"><i>#编程</i><i>#教程</i></span>
       未配置或空数组时不输出任何节点，避免渲染空容器 */
    function tagsHtml(tags){
        if(!tags || !tags.length) return '';
        var out='';
        for(var i=0;i<tags.length;i++){
            var t=String(tags[i]==null?'':tags[i]).trim();
            if(!t) continue;
            out+='<i>#'+esc(t)+'</i>';
        }
        return out ? '<span class="url-tags">'+out+'</span>' : '';
    }
    /* 取三语值：字符串直接用；{zh,zh-TW,en} 对象按当前语言取，缺则回退 en→zh */
    function pickI18n(v){
        if(v==null) return '';
        if(typeof v==='string') return v;
        if(typeof v==='object'){
            if(v[curLang]!=null) return v[curLang];
            if(v.en!=null) return v.en;
            if(v.zh!=null) return v.zh;
        }
        return '';
    }
    /* 卡片版本号 / 更新日期（参考小雷工具箱卡片元信息）
       可选字段：站点加 ver:'v2.12.4' 或 date:'2025-09-20' 即显示
       未配置或 SITE.showMeta===false 时不渲染任何节点 */
    function verHtml(v){
        if(!v || SITE_.showMeta===false) return '';
        return '<i class="url-ver">'+esc(v)+'</i>';
    }
    function dateHtml(v){
        if(!v || SITE_.showMeta===false) return '';
        return '<span class="url-date">'+esc(v)+'</span>';
    }
    function hueOf(s){ var h=0,t=String(s||''); for(var i=0;i<t.length;i++) h=(h*31+t.charCodeAt(i))%360; return h; }
    function placeholder(name){
        var ch=String(name||'?').trim().charAt(0).toUpperCase()||'?';
        return 'data:image/svg+xml,'+encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">'+
            '<rect width="80" height="80" rx="40" fill="hsl('+hueOf(name)+',56%,50%)"/>'+
            '<text x="50%" y="50%" dy=".36em" text-anchor="middle" font-family="sans-serif" '+
            'font-size="36" font-weight="700" fill="#fff">'+esc(ch)+'</text></svg>');
    }
    function iconHtml(v){
        if(v && /^(https?:|\.\/|ico\/|images\/)/.test(v))
            return '<img src="'+esc(v)+'" alt="" loading="lazy" decoding="async">';
        return esc(v||'');
    }

    /* ---------- 图标 ---------- */
    var TIMEOUT=4000;
    function loadIcon(img,url,name){
        var host=hostOf(url);
        if(!host){ img.src=placeholder(name); return; }
        var srcs=['ico/'+host+'.png',
                  'https://api.iowen.cn/favicon/'+host+'.png',
                  'https://t3.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url='+encodeURIComponent(url),
                  'https://favicon.im/'+host,
                  'https://icons.duckduckgo.com/ip3/'+host+'.ico'];
        var i=0; img.src=placeholder(name);
        (function next(){
            if(i>=srcs.length){ img.src=placeholder(name); return; }
            var src=srcs[i++], done=false, probe=new Image();
            var tm=setTimeout(function(){ if(!done){done=true;probe.src='';next();} },TIMEOUT);
            probe.onload=function(){
                if(done)return;
                if(probe.naturalWidth<8){ done=true;clearTimeout(tm);next();return; }
                done=true;clearTimeout(tm);img.src=src;
            };
            probe.onerror=function(){ if(done)return; done=true;clearTimeout(tm);next(); };
            probe.src=src;
        })();
    }

    /* ---------- 品牌 / 菜单 / 页脚 ---------- */
    function renderBrand(){
        document.title=sn('name')+' - '+t('title_suffix');
        el.sideLogoTxt.textContent=sn('name');
        var bt=$('brand-txt'); if(bt) bt.textContent=sn('name');
        if(SITE_.logo){
            if(/^(https?:|\.\/|ico\/|images\/)/.test(SITE_.logo))
                el.sideLogo.innerHTML='<img src="'+esc(SITE_.logo)+'" alt="">';
            else el.sideLogo.textContent=SITE_.logo;
        }
        initHitokoto();
    }

    // 顶栏：支持下拉子菜单
    function renderTopMenu(){
        if(!MENU.length){ el.topMenu.style.display='none'; return; }
        el.topMenu.innerHTML=MENU.map(function(m,i){
            var has=(m.children&&m.children.length);
            var sub=has?('<ul class="sub-menu">'+m.children.map(function(c){
                return '<li><a href="'+esc(c.url)+'">'+esc(cn(c,'name'))+'</a></li>';
            }).join('')+'</ul>'):'';
            return '<li class="menu-item'+(has?' has-children':'')+'">'+
                   '<a href="'+esc(m.url)+'" data-mi="'+i+'">'+esc(cn(m,'name'))+'</a>'+sub+'</li>';
        }).join('');
        // 子菜单：hover 展开（CSS），键盘 focus 也展开
        el.topMenu.querySelectorAll('.has-children > a').forEach(function(a){
            a.addEventListener('click',function(e){
                if(a.getAttribute('href')==='#'){
                    e.preventDefault();
                    var li=a.parentElement;
                    li.classList.toggle('open');
                }
            });
        });
        document.addEventListener('click',function(e){
            if(!e.target.closest('.menu-item')) {
                el.topMenu.querySelectorAll('.open').forEach(function(x){x.classList.remove('open');});
            }
        });
    }

    function renderFoot(){
        var h='<div>'+esc(sn('footer')||'')+'</div>';
        if(SITE_.icp) h+='<div style="margin-top:4px"><a href="https://beian.miit.gov.cn" target="_blank" rel="noopener">'+esc(SITE_.icp)+'</a></div>';
        el.foot.innerHTML=h;
    }

    /* ---------- 超级搜索 ---------- */
    var curGroup=0, curEngine=0, sTypeBuilt=false, engineBuiltFor=-1;
    function renderSearch(){
        if(!GROUPS.length){ el.sType.style.display='none'; el.sEngines.style.display='none'; return; }
        /* 类目按钮只构建一次：每次点击都重建 innerHTML 会丢掉横向滚动位置，
           导致首个类目（如「常用」）被滑出视野后回不来 */
        if(!sTypeBuilt){
            el.sType.innerHTML=GROUPS.map(function(g,i){
                return '<button data-g="'+i+'"'+(i===curGroup?' class="on"':'')+'>'+esc(cn(g,'name'))+'</button>';
            }).join('');
            el.sType.querySelectorAll('button').forEach(function(b){
                b.addEventListener('click',function(){
                    curGroup=+b.getAttribute('data-g'); curEngine=0; renderSearch();
                    /* 仅在按钮被切边时滚动最小距离，不会把前面的类目推出视野 */
                    b.scrollIntoView({block:'nearest',inline:'nearest'});
                });
            });
            sTypeBuilt=true;
        }
        el.sType.querySelectorAll('button').forEach(function(b){
            b.classList.toggle('on', +b.getAttribute('data-g')===curGroup);
        });
        var items=GROUPS[curGroup].items||[];
        /* 引擎列表仅在切换类目时重建，重建后回到最左，保证第一个引擎可见 */
        if(engineBuiltFor!==curGroup){
            el.sEngines.innerHTML=items.map(function(e,i){
                return '<button data-e="'+i+'"'+(i===curEngine?' class="on"':'')+'>'+esc(en(e,'name'))+'</button>';
            }).join('');
            el.sEngines.querySelectorAll('button').forEach(function(b){
                b.addEventListener('click',function(){
                    curEngine=+b.getAttribute('data-e'); renderSearch();
                    b.scrollIntoView({block:'nearest',inline:'nearest'});
                });
            });
            el.sEngines.scrollLeft=0;
            engineBuiltFor=curGroup;
        }
        el.sEngines.querySelectorAll('button').forEach(function(b){
            b.classList.toggle('on', +b.getAttribute('data-e')===curEngine);
        });
        el.searchText.placeholder=t('search_in',{name:en(items[curEngine],'name')});
    }

    /* ---------- 主体：一级区块 + 二级 pills ---------- */
    var FLAT=[];
    /* 气泡三角对齐：把小尖角对准卡片里图标的水平中心。
       定义为外层函数，「加载更多」显示新卡片后可直接复用。 */
    function placeTips(){
        el.sections.querySelectorAll('.card').forEach(function(card){
            var ico=card.querySelector('.url-img');
            if(!ico) return;
            var cr=card.getBoundingClientRect(), ir=ico.getBoundingClientRect();
            // 拿不到真实布局（如无渲染环境）时不要写死成 0，交给 CSS 的 50% 兜底
            if(!cr.width||!ir.width) return;
            var x=ir.left+ir.width/2-cr.left;
            if(x<12||x>cr.width-12) return;      // 越界则维持居中
            var d=card.querySelector('.url-desc');
            if(d) d.style.setProperty('--tip-x', Math.round(x)+'px');
        });
    }

    function renderSections(){
        FLAT.length=0;                 // 切换语言会重渲染，不清空会导致搜索结果翻倍
        var html='';
        CATS.forEach(function(c,ci){
            var groups=(c.groups||[]).filter(function(g){ return (g.sites||[]).length; });
            if(!groups.length) return;
            var total=groups.reduce(function(a,g){ return a+g.sites.length; },0);
            var sid='sec-'+ci;

            html+='<section class="sec" id="'+sid+'" data-cat="'+esc(c.name)+'">';
            html+=  '<div class="sec-head">';
            html+=    '<span class="sec-ico">'+iconHtml(c.icon)+'</span>';
            html+=    '<h2 class="sec-title">'+esc(cn(c,'name'))+'</h2>';
            html+=    '<span class="sec-count">'+total+'</span>';
            // 二级 pills：紧挨一级标题（一糖模式），只有一个分组时不显示
            if(groups.length>1){
                html+=  '<span class="sec-sep" aria-hidden="true"></span>';
                html+=  '<div class="pills" role="tablist">';
                groups.forEach(function(g,gi){
                    html+='<button class="pill'+(gi===0?' on':'')+'" role="tab"'+
                          ' data-sec="'+sid+'" data-g="'+gi+'" aria-selected="'+(gi===0)+'">'+esc(cn(g,'name'))+'</button>';
                });
                html+=  '</div>';
            }
            html+=    '<div class="flex-fill"></div>';
            html+=  '</div>';

            html+=  '<div class="tab-content">';
            groups.forEach(function(g,gi){
                var pid=sid+'-pane-'+gi;
                html+='<div class="pane'+(gi===0?' active':'')+'" id="'+pid+'"><div class="grid">';
                (g.sites||[]).forEach(function(s){
                    FLAT.push({name:s.name,url:s.url,desc:dn(s.desc)||'',cat:c.name,sub:g.name||''});
                    html+='<a class="card" href="'+esc(s.url)+'" target="_blank" rel="noopener"'+
                            ' data-n="'+esc(s.name)+'" data-d="'+esc(dn(s.desc)||'')+'">';
                    html+=  '<span class="url-img"></span>';
                    html+=  '<span class="url-info">'+
                              '<span class="url-line">'+
                                '<span class="url-name">'+esc(s.name)+'</span>'+
                                verHtml(s.ver)+
                                tagsHtml(s.tags)+
                              '</span>'+
                              '<span class="url-desc">'+
                                '<span class="url-desc-t">'+esc(dn(s.desc)||hostOf(s.url))+'</span>'+
                                dateHtml(s.date)+
                              '</span>'+
                            '</span>';
                    html+='</a>';
                });
                html+='</div></div>';
            });
            html+=  '</div></section>';
        });
        el.sections.innerHTML=html;

        // 气泡三角对齐：布局稳定后量一次
        if('requestAnimationFrame' in window) requestAnimationFrame(placeTips);
        if(!WIN_BOUND){ WIN_BOUND=true; window.addEventListener('resize',placeTips); window.addEventListener('resize',onResizeLoadMore); }

        // pills 点击切换
        el.sections.querySelectorAll('.pill').forEach(function(p){
            p.addEventListener('click',function(){
                var sec=p.getAttribute('data-sec'), gi=p.getAttribute('data-g');
                var box=document.getElementById(sec);
                if(!box) return;
                box.querySelectorAll('.pill').forEach(function(x){
                    var on=x===p; x.classList.toggle('on',on); x.setAttribute('aria-selected',on);
                });
                box.querySelectorAll('.pane').forEach(function(x,i){
                    x.classList.toggle('active', String(i)===String(gi));
                });
            });
        });

        // 图标
        el.sections.querySelectorAll('.card').forEach(function(card){
            var box=card.querySelector('.url-img');
            var img=document.createElement('img');
            img.alt=''; img.loading='lazy'; img.decoding='async';
            box.appendChild(img);
            loadIcon(img, card.getAttribute('href'), card.getAttribute('data-n'));
            // 图标同色模糊光晕（参考益族网 blur-img-bg 手法）
            img.addEventListener('load', function(){
                if(img.src.indexOf('data:image/svg+xml')===0) return;
                box.style.backgroundImage='url('+img.src+')';
                box.classList.add('glow');
            });
        });

        initLoadMore();
    }

    /* ---------- 加载更多 ----------
       每个二级类目（pane）默认只显示 step 个，其余隐藏，
       底部放「加载更多」按钮，点一次多显示 step 个，全部显示后按钮消失。
       手机端（<=1000px）用 SITE.loadMoreStep（默认 10）；
       桌面端用 SITE.loadMoreStepDesktop（默认 20）—— 屏幕宽、一行 3~5 个，
       20 个约 4~7 行，再长就该收一收。
       任一项设为 0 表示该端不做分批（全部直接显示）。 */
    function loadStep(){
        var narrow=window.innerWidth<=1000;
        var v=narrow?SITE_.loadMoreStep:SITE_.loadMoreStepDesktop;
        return (v===undefined||v===null)?(narrow?10:20):(v|0);
    }
    var lastNarrow=null;
    function resetLoadMore(){
        el.sections.querySelectorAll('.card.more-hidden').forEach(function(c){ c.classList.remove('more-hidden'); });
        el.sections.querySelectorAll('.load-more').forEach(function(b){ b.remove(); });
    }
    function initLoadMore(){
        var narrow=window.innerWidth<=1000;
        lastNarrow=narrow;
        resetLoadMore();
        var step=loadStep();
        if(step<=0) return;
        el.sections.querySelectorAll('.pane').forEach(function(pane){
            var cards=[].slice.call(pane.querySelectorAll('.card'));
            if(cards.length<=step) return;
            for(var i=step;i<cards.length;i++) cards[i].classList.add('more-hidden');
            var shown=step;
            var btn=document.createElement('button');
            btn.type='button';
            btn.className='load-more';
            function label(){
                btn.textContent=t('load_more',{n:cards.length-shown});
            }
            label();
            btn.addEventListener('click',function(){
                var end=Math.min(shown+step, cards.length);
                for(var k=shown;k<end;k++) cards[k].classList.remove('more-hidden');
                shown=end;
                if(shown>=cards.length) btn.remove();
                else label();
                // 新显示的卡片需要重新计算气泡小尖角位置
                if('requestAnimationFrame' in window) requestAnimationFrame(placeTips);
            });
            pane.appendChild(btn);
        });
    }
    // 跨断点（手机 ↔ 桌面）时阈值不同，需要按新阈值重新分批
    function onResizeLoadMore(){
        var narrow=window.innerWidth<=1000;
        if(narrow===lastNarrow) return;
        initLoadMore();
    }

    /* ---------- 顶栏一言（静态句子库，随机 + 定时轮换）---------- */
    function initHitokoto(){
        var LIST=hitoList();
        if(!el.hitokoto || !LIST.length){ if(el.hitokoto) el.hitokoto.hidden=true; return; }
        var i=Math.floor(Math.random()*LIST.length);
        function show(){
            var t=LIST[i % LIST.length];
            el.hitokoto.textContent=t;
            el.hitokoto.title=sn('slogan')||t;
            // 重新触发淡入
            el.hitokoto.classList.remove('on');
            void el.hitokoto.offsetWidth;      // 强制回流以重启动画
            el.hitokoto.classList.add('on');
        }
        show();
        if(HITO_MS>0 && LIST.length>1){
            if(initHitokoto.timer) clearInterval(initHitokoto.timer);
            initHitokoto.timer=setInterval(function(){ i++; show(); }, HITO_MS);
        }
    }

    /* ---------- 世界时钟 ----------
       参考一为导航 io-world-clock：横向排列多个时区，逐秒刷新。
       纯前端实现（Intl.DateTimeFormat 指定 timeZone），不依赖任何接口，
       静态站 / GitHub Pages 上同样可用。 */
    var TZ_FALLBACK=null;
    function localTZ(){
        if(TZ_FALLBACK) return TZ_FALLBACK;
        try{ TZ_FALLBACK=Intl.DateTimeFormat().resolvedOptions().timeZone; }catch(e){ TZ_FALLBACK='Asia/Shanghai'; }
        return TZ_FALLBACK;
    }
    // 参考图格式：09-25 09:15:19（MM-DD HH:MM:SS）
    function fmtZone(tz, withSec){
        try{
            var now=new Date();
            var d=new Intl.DateTimeFormat('en-CA',{month:'2-digit',day:'2-digit',timeZone:tz}).format(now);
            var o={hour:'2-digit',minute:'2-digit',hour12:false,timeZone:tz};
            if(withSec) o.second='2-digit';
            var t=new Intl.DateTimeFormat('en-GB',o).format(now);
            return d+' '+t;
        }catch(e){ return '-- --:--'; }
    }
    /* ---------- 顶部渐变横幅（参考小雷工具箱）----------
       主区域顶部的推荐位：蓝紫渐变背景 + 标题/描述/按钮。
       enabled:false 时隐藏；title/desc/btn 支持字符串或 {zh,zh-TW,en} 三语对象。 */
    function renderBanner(){
        var box=document.getElementById('promo-banner');
        if(!box) return;
        var cfg=SITE_.banner;
        if(!cfg || cfg.enabled===false){ box.hidden=true; box.innerHTML=''; return; }
        var title=pickI18n(cfg.title), desc=pickI18n(cfg.desc), btn=pickI18n(cfg.btn);
        if(!title && !desc){ box.hidden=true; box.innerHTML=''; return; }
        box.hidden=false;
        if(cfg.from&&cfg.to){
            box.style.setProperty('--banner-from',cfg.from);
            box.style.setProperty('--banner-to',cfg.to);
        }
        var h='<span class="promo-bg" aria-hidden="true"></span>'+
              '<span class="promo-txt">'+
                (title?'<span class="promo-title">'+esc(title)+'</span>':'')+
                (desc?'<span class="promo-desc">'+esc(desc)+'</span>':'')+
              '</span>';
        if(cfg.url&&btn)
            h+='<a class="promo-btn" href="'+esc(cfg.url)+'" target="_blank" rel="noopener">'+esc(btn)+'</a>';
        box.innerHTML=h;
    }

    function renderClock(){
        var box=document.getElementById('clock-box');
        if(!box) return;
        var cfg=(typeof SITE_!=='undefined' && SITE_.clock)?SITE_.clock:null;
        if(!cfg || cfg.enabled===false){ box.hidden=true; return; }
        var zones=(cfg.zones||[]).filter(function(z){ return z && z.tz; });
        if(!zones.length){ box.hidden=true; return; }
        var withSec=cfg.showSeconds!==false;

        box.hidden=false;
        var html='<span class="clock-ico" aria-hidden="true">🕐</span><div class="clock-list" id="clock-list"></div>';
        box.innerHTML=html;
        var list=document.getElementById('clock-list');
        var h='';
        zones.forEach(function(z){
            h+='<div class="clock-item" data-tz="'+esc(z.tz)+'">'+
                 '<span class="clock-flag">'+(z.flag||'🌐')+'</span>'+
                 '<span class="clock-city">'+esc((z.city&&cityN(z.city))||z.tz)+'</span>'+
                 '<span class="clock-time">-- --:--</span>'+
               '</div>';
        });
        list.innerHTML=h;

        var items=[].slice.call(list.querySelectorAll('.clock-item'));
        function tick(){
            items.forEach(function(it){
                var t=it.querySelector('.clock-time');
                if(t) t.textContent=fmtZone(it.getAttribute('data-tz'),withSec);
            });
        }
        tick();
        if(renderClock.timer) clearInterval(renderClock.timer);
        renderClock.timer=setInterval(tick,1000);
    }

    // 精选五宫格（益族网 slide_2_mkbox 风格）
    function renderFeatured(){
        var F=(typeof FEATURED!=='undefined')?FEATURED:[];
        var box=$('feat-box');
        if(!box) return;
        if(!F.length){ box.style.display='none'; return; }
        box.innerHTML='<div class="feat-grid">'+F.map(function(f,i){
            return '<a class="feat-item" href="'+esc(f.url)+'" target="_blank" rel="noopener" data-n="'+esc(f.name)+'">'+
                     '<span class="feat-ico"><img alt="" loading="lazy" decoding="async"></span>'+
                     '<span class="feat-txt">'+
                       '<span class="feat-name">'+esc(f.name)+
                         (f.badge?'<em class="feat-badge b'+(i%5)+'">'+esc(f.badge)+'</em>':'')+
                       '</span>'+
                       '<span class="feat-desc">'+esc(dn(f.desc)||hostOf(f.url))+'</span>'+
                     '</span>'+
                   '</a>';
        }).join('')+'</div>';
        box.querySelectorAll('.feat-item').forEach(function(a){
            var img=a.querySelector('.feat-ico img');
            loadIcon(img, a.getAttribute('href'), a.getAttribute('data-n'));
        });
    }

    function catCount(c){
        var n=0; (c.groups||[]).forEach(function(g){ n+=(g.sites||[]).length; }); return n;
    }

    /* ---------- 侧栏：快捷项 + 一级(可展开二级) ---------- */
    function renderSideMenu(){
        var html='';
        // 快捷项
        QUICK.forEach(function(q){
            var ext=/^https?:/.test(q.url);
            html+='<a class="side-cat quick" href="'+esc(q.url)+'"'+(ext?' target="_blank" rel="noopener"':'')+'>'+
                    '<span class="side-ico">'+iconHtml(q.icon)+'</span>'+
                    '<span class="side-txt">'+esc(cn(q,'name'))+'</span>'+
                  '</a>';
        });
        // 一级分类
        CATS.forEach(function(c,i){
            var subs=(c.groups||[]).filter(function(g){ return (g.sites||[]).length && g.name; });
            var hasSub=subs.length>0;
            html+='<div class="side-group" data-c="'+i+'">';
            html+=  '<button class="side-cat cat-main" data-c="'+i+'" aria-expanded="false">'+
                      '<span class="side-ico">'+iconHtml(c.icon)+'</span>'+
                      '<span class="side-txt">'+esc(cn(c,'name'))+'</span>'+
                      '<span class="side-num">'+catCount(c)+'</span>'+
                      (hasSub?'<i class="side-arrow" aria-hidden="true">›</i>':'')+
                    '</button>';
            if(hasSub){
                html+='<div class="side-subs">';
                subs.forEach(function(g,gi){
                    var gn=cn(g,'name');
                    html+= '<button class="side-sub" data-c="'+i+'" data-gname="'+esc(gn)+'">'+
                             '<span class="side-sub-dot"></span>'+
                             '<span class="side-txt">'+esc(gn)+'</span>'+
                             '<span class="side-num">'+(g.sites||[]).length+'</span>'+
                           '</button>';
                });
                html+='</div>';
            }
            html+='</div>';
        });
        el.sideMenu.innerHTML=html;

        // 一级：展开/收起二级 + 滚动定位
        el.sideMenu.querySelectorAll('.cat-main').forEach(function(b){
            b.addEventListener('click',function(){
                var wrap=b.parentElement;
                var subs=wrap.querySelector('.side-subs');
                var i=b.getAttribute('data-c');
                    // 桌面端：二级由 hover 浮出；手机端：不显示二级。
                // 两种情况点击一级都是直接定位到该分类。
                lockSpy();
                scrollToCat(i);
                setActive(i);
                if(window.innerWidth<=1000) closeDrawer();
            });
        });
        // 二级：滚动 + 激活对应 pill
        el.sideMenu.querySelectorAll('.side-sub').forEach(function(b){
            b.addEventListener('click',function(){
                var i=b.getAttribute('data-c');
                var gname=b.getAttribute('data-gname');
                lockSpy();
                scrollToCat(i);
                activatePill(i,gname);
                setActive(i,b);
                if(window.innerWidth<=1000) closeDrawer();
            });
        });
    }
    /* ---------- 二级浮出面板（桌面端：鼠标移到一级上，从右侧浮出） ----------
       用 fixed + JS 定位：侧栏有 overflow 裁切，absolute 会被剪掉。
       带延迟关闭 + 透明桥接，避免鼠标移向面板途中面板消失。 */
    var subHideTimer=null;
    function placeSub(group){
        var subs=group.querySelector('.side-subs');
        if(!subs) return null;
        var r=group.getBoundingClientRect();
        subs.style.left='0px'; subs.style.top='0px';
        subs.classList.add('show');                 // 先显示（display:grid）才能量到尺寸
        var h=subs.offsetHeight, wd=subs.offsetWidth;
        var top=r.top-4;
        // 底部超出视口则上移
        if(top+h>window.innerHeight-12) top=Math.max(12, window.innerHeight-12-h);
        var left=r.right+8;
        // 右侧超出视口则翻到左侧显示
        if(left+wd>window.innerWidth-12 && r.left-8-wd>12) left=r.left-8-wd;
        subs.style.left=left+'px';
        subs.style.top=top+'px';
        return subs;
    }
    function showSub(group){
        clearTimeout(subHideTimer);
        hideAllSubs(group);
        placeSub(group);
        var m=group.querySelector('.cat-main');
        if(m) m.setAttribute('aria-expanded','true');
    }
    function hideAllSubs(except){
        el.sideMenu.querySelectorAll('.side-subs.show').forEach(function(p){
            if(p.parentElement===except) return;
            p.classList.remove('show');
        });
        el.sideMenu.querySelectorAll('.cat-main[aria-expanded="true"]').forEach(function(m){
            if(m.parentElement===except) return;
            var has=m.parentElement.querySelector('.side-subs.show');
            if(!has) m.setAttribute('aria-expanded','false');
        });
    }
    function initSubFlyout(){
        // 触屏不启用（无 hover）；窄屏也不启用（CSS 已隐藏二级）
        if(window.matchMedia('(hover:none)').matches) return;
        el.sideMenu.querySelectorAll('.side-group').forEach(function(group){
            if(!group.querySelector('.side-subs')) return;
            group.addEventListener('mouseenter',function(){ showSub(group); });
            group.addEventListener('mouseleave',function(e){
                // 移向面板本身不算离开
                if(e.relatedTarget && group.contains(e.relatedTarget)) return;
                clearTimeout(subHideTimer);
                subHideTimer=setTimeout(function(){
                    var p=group.querySelector('.side-subs');
                    if(p) p.classList.remove('show');
                    var m=group.querySelector('.cat-main');
                    if(m) m.setAttribute('aria-expanded','false');
                },130);
            });
            // 面板自身：进入时取消关闭
            var subs=group.querySelector('.side-subs');
            subs.addEventListener('mouseenter',function(){ clearTimeout(subHideTimer); });
            subs.addEventListener('mouseleave',function(){
                clearTimeout(subHideTimer);
                subHideTimer=setTimeout(function(){
                    subs.classList.remove('show');
                    var m=group.querySelector('.cat-main');
                    if(m) m.setAttribute('aria-expanded','false');
                },130);
            });
            // 键盘可达
            group.addEventListener('focusin',function(){ showSub(group); });
        });
        // 滚动/缩放时面板位置会失效，直接收起（只绑一次，切换语言重渲染时不重复累积）
        if(!initSubFlyout._win){
            initSubFlyout._win=true;
            window.addEventListener('scroll',function(){
                if(document.querySelector('.side-subs.show')){
                    clearTimeout(subHideTimer);
                    el.sideMenu.querySelectorAll('.side-subs.show').forEach(function(p){ p.classList.remove('show'); });
                }
            },{passive:true});
            window.addEventListener('resize',function(){
                el.sideMenu.querySelectorAll('.side-subs.show').forEach(function(p){ p.classList.remove('show'); });
            });
        }
    }

    function scrollToCat(i){
        var first=document.getElementById('sec-'+i);
        if(!first) return;
        var top=first.getBoundingClientRect().top+window.pageYOffset-
                (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h'))||62)-34;
        window.scrollTo({top:top,behavior:'smooth'});
    }
    function activatePill(ci,gname){
        var box=document.getElementById('sec-'+ci);
        if(!box) return;
        var pills=[].slice.call(box.querySelectorAll('.pill'));
        var idx=pills.findIndex(function(p){ return p.textContent.trim()===gname; });
        if(idx<0) return;
        pills.forEach(function(p,i){ var on=i===idx; p.classList.toggle('on',on); p.setAttribute('aria-selected',on); });
        box.querySelectorAll('.pane').forEach(function(x,i){ x.classList.toggle('active',i===idx); });
    }
    // 点击后短暂屏蔽滚动监听：否则滚动过去后 IntersectionObserver
    // 会把高亮改成「当前停在视口里的那个分类」，覆盖掉刚点的
    var spyLockUntil=0;
    function lockSpy(ms){ spyLockUntil=Date.now()+(ms||900); }

    function setActive(i,subBtn){
        el.sideMenu.querySelectorAll('.cat-main').forEach(function(b){
            b.classList.toggle('on', b.getAttribute('data-c')===String(i));
        });
        el.sideMenu.querySelectorAll('.side-sub').forEach(function(b){
            b.classList.toggle('on', b===subBtn);
        });
    }

    /* ---------- 滚动高亮 ---------- */
    var spyObs=null;
    function initSpy(){
        var mains=[].slice.call(el.sideMenu.querySelectorAll('.cat-main'));
        if(!mains.length||!('IntersectionObserver' in window)) return;
        if(spyObs) spyObs.disconnect();
        var obs=new IntersectionObserver(function(es){
            if(Date.now()<spyLockUntil) return;      // 点击后短暂屏蔽
            es.forEach(function(en){
                if(!en.isIntersecting) return;
                var cat=en.target.getAttribute('data-cat');
                var idx=CATS.findIndex(function(c){return c.name===cat;});
                if(idx<0) return;
                setActive(idx);
            });
        },{rootMargin:'-18% 0px -72% 0px',threshold:0});
        spyObs=obs;
        document.querySelectorAll('.sec').forEach(function(s){ obs.observe(s); });
    }

    /* ---------- 搜索 ---------- */
    function doEngineSearch(){
        var q=el.searchText.value.trim();
        if(!q){ el.searchText.focus(); return; }
        var g=GROUPS[curGroup]; if(!g) return;
        var e=(g.items||[])[curEngine]; if(!e) return;
        window.open(e.tpl.replace('{q}',encodeURIComponent(q)),'_blank','noopener');
    }
    function innerSearch(){
        var q=el.innerSearch.value.trim().toLowerCase();
        if(!q){ el.innerResult.innerHTML='<div class="res-none">输入关键词开始搜索</div>'; return; }
        var hits=FLAT.filter(function(s){
            return (s.name+' '+s.desc+' '+s.cat+' '+s.sub+' '+hostOf(s.url)).toLowerCase().indexOf(q)!==-1;
        }).slice(0,40);
        if(!hits.length){ el.innerResult.innerHTML='<div class="res-none">没有找到匹配的网站</div>'; return; }
        el.innerResult.innerHTML=hits.map(function(s){
            return '<a class="res-item" href="'+esc(s.url)+'" target="_blank" rel="noopener">'+
                     '<span class="res-ico">'+esc(s.name.charAt(0))+'</span>'+
                     '<span class="res-txt"><span class="res-name">'+esc(s.name)+'</span>'+
                     '<span class="res-cat">'+esc(s.cat)+(s.sub?' · '+esc(s.sub):'')+'</span></span>'+
                   '</a>';
        }).join('');
    }
    function openModal(){ el.modal.hidden=false; el.innerSearch.value=''; innerSearch(); el.innerSearch.focus(); }
    function closeModal(){ el.modal.hidden=true; }

    /* ---------- 主题 ---------- */
    function paint(t){
        document.documentElement.setAttribute('data-theme',t);
        var ico=(t==='light')?'☀️':'🌙';
        if(el.themeIco) el.themeIco.textContent=ico;
        if(el.themeBtn2) el.themeBtn2.textContent=ico;
        try{ localStorage.setItem('nav-theme',t); }catch(e){}
    }
    function toggleTheme(){
        var c=document.documentElement.getAttribute('data-theme');
        paint(c==='light'?'dark':'light');
    }

    /* ---------- 侧栏抽屉（仅手机端） ---------- */
    var lastFocus=null;
    function openDrawer(){
        lastFocus=document.activeElement;
        el.sidebar.classList.add('on'); el.mask.classList.add('on');
        el.mobileMenu.setAttribute('aria-expanded','true');
        document.body.style.overflow='hidden';
    }
    function closeDrawer(){
        if(!el.sidebar.classList.contains('on')) return;
        el.sidebar.classList.remove('on'); el.mask.classList.remove('on');
        el.mobileMenu.setAttribute('aria-expanded','false');
        document.body.style.overflow='';
        if(lastFocus&&lastFocus.focus) lastFocus.focus({preventScroll:true});
    }

    function onScroll(){
        var y=window.pageYOffset;
        el.header.classList.toggle('scrolled',y>8);
        el.toTop.hidden=y<400;
    }

    /* ---------- 绑定 ---------- */
    function bind(){
        el.searchForm.addEventListener('submit',function(e){ e.preventDefault(); doEngineSearch(); });
        el.searchBtn.addEventListener('click',openModal);
        el.innerClose.addEventListener('click',closeModal);
        el.innerSearch.addEventListener('input',innerSearch);
        el.modal.addEventListener('click',function(e){ if(e.target===el.modal) closeModal(); });
        if(el.themeBtn) el.themeBtn.addEventListener('click',toggleTheme);
        if(el.themeBtn2) el.themeBtn2.addEventListener('click',toggleTheme);
        el.mobileMenu.addEventListener('click',function(){
            el.sidebar.classList.contains('on')?closeDrawer():openDrawer();
        });
        el.sideClose.addEventListener('click',closeDrawer);
        el.mask.addEventListener('click',closeDrawer);
        el.toTop.addEventListener('click',function(){ window.scrollTo({top:0,behavior:'smooth'}); });
        var lbtn=$('lang-btn');
        if(lbtn) lbtn.addEventListener('click',function(e){
            e.stopPropagation();
            var pn=$('lang-panel');
            if(pn && !pn.hidden) closeLangPanel(); else openLangPanel();
        });
        document.addEventListener('click',function(e){
            if(!(e.target.closest&&e.target.closest('#lang-wrap'))) closeLangPanel();
        });
        document.addEventListener('keydown',function(e){
            if(e.key==='Escape'){ closeModal(); closeDrawer(); closeLangPanel(); }
            if(e.key==='/'&&document.activeElement!==el.searchText&&el.modal.hidden){
                e.preventDefault(); openModal();
            }
        });
        window.addEventListener('scroll',onScroll,{passive:true});
    }

    /* ---------- 语言切换（右下角悬浮按钮 + 面板） ---------- */
    function renderLangPanel(){
        var wrap=$('lang-wrap'), panel=$('lang-panel'), btn=$('lang-btn');
        if(!wrap) return;
        if(!LANGS_.length){ wrap.style.display='none'; return; }
        if(!panel||!btn) return;
        panel.innerHTML=LANGS_.map(function(l){
            return '<button type="button" class="lang-item'+(l.code===curLang?' on':'')+
                   '" data-code="'+esc(l.code)+'">'+
                     '<span class="lang-region">'+esc(l.region)+'</span>'+
                     '<span class="lang-label">'+esc(l.label)+'</span>'+
                     (l.code===curLang?'<i class="lang-check" aria-hidden="true">✓</i>':'')+
                   '</button>';
        }).join('');
        btn.title=t('lang_btn');
        btn.setAttribute('aria-label',t('lang_btn'));
        panel.querySelectorAll('.lang-item').forEach(function(b){
            b.addEventListener('click',function(){
                var code=b.getAttribute('data-code');
                if(code===curLang){ closeLangPanel(); return; }
                applyLang(code);
            });
        });
    }
    function openLangPanel(){
        var panel=$('lang-panel'), btn=$('lang-btn');
        if(!panel) return;
        panel.hidden=false;
        if(btn) btn.setAttribute('aria-expanded','true');
    }
    function closeLangPanel(){
        var panel=$('lang-panel'), btn=$('lang-btn');
        if(!panel) return;
        panel.hidden=true;
        if(btn) btn.setAttribute('aria-expanded','false');
    }
    // index.html 里的静态文案（无障碍标签、placeholder 等）也要跟着切
    function applyStaticI18n(){
        var sk=document.querySelector('.skip-link'); if(sk) sk.textContent=t('skip');
        if(el.mobileMenu) el.mobileMenu.setAttribute('aria-label',t('open_menu'));
        if(el.sideClose)  el.sideClose.setAttribute('aria-label',t('close_menu'));
        if(el.searchBtn)  el.searchBtn.setAttribute('aria-label',t('site_search'));
        if(el.themeBtn2)  el.themeBtn2.setAttribute('aria-label',t('toggle_theme'));
        if(el.toTop)      el.toTop.setAttribute('aria-label',t('to_top'));
        var tt=(el.themeBtn?el.themeBtn.querySelector('span'):null); if(tt) tt.textContent=t('theme');
        var inp=$('inner-search'); if(inp) inp.placeholder=t('inner_ph');
        if(el.empty) el.empty.textContent=t('empty');
        document.documentElement.setAttribute('lang',curLang);
    }
    function applyLang(code){
        try{ localStorage.setItem(LANG_KEY,code); }catch(e){}
        curLang=code;
        closeLangPanel();
        var y=window.scrollY||window.pageYOffset||0;   // 保持滚动位置
        renderBrand(); renderTopMenu(); renderFoot();
        renderSearch(); renderBanner(); renderClock(); renderFeatured();
        renderSections(); renderSideMenu();
        initLoadMore(); initSpy(); initSubFlyout();
        applyStaticI18n(); renderLangPanel();
        if('requestAnimationFrame' in window) requestAnimationFrame(placeTips);
        window.scrollTo(0,y);
    }

    /* ---------- 启动 ---------- */
    renderBrand(); renderTopMenu(); renderFoot();
    renderSearch(); renderBanner(); renderClock(); renderFeatured(); renderSections(); renderSideMenu();
    applyStaticI18n(); renderLangPanel();
    paint(document.documentElement.getAttribute('data-theme')||'dark');
    // 卡片简介显示模式：always 一直显示 / fade 悬停淡入 / pop 悬停浮层
    if(SITE_.descMode==='pop') document.body.classList.add('desc-pop');
    else if(SITE_.descMode==='fade') document.body.classList.add('desc-fade');
    initSpy(); bind(); initSubFlyout(); onScroll();
})();
