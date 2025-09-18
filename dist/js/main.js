var windowWidth = $(window).width();
var windowScrollTop = $(window).scrollTop();
var windowHeight;
var windowScrollTopFix;
var aside;
var lastTrigger = null;

$(function(){
    windowWidth = $(window).width();
    windowHeight = window.innerHeight;
    aside = document.querySelector('.aside');

    /** 기본 로드될 함수 */
    ui_navi();
    ui_glassBg();

    fn_main();
    fn_asideFixed();
    fn_tabs();

    fn_iptClear();
    fn_iptIsFocus();
    fn_passwordMask();
    fn_fileInput();
    fn_selectbox();
    fn_selectIpt();
    fn_tabSticky();
    // fn_popover();

    fn_paymentHistoryItemFold();
    fn_questionHistoryItemFold();
    
    fn_insightSlider(); // [AI인사이트] 메인슬라이더
    fn_exquestionSwipe(); // [AI검색] 예시 질문

    fn_marketList(); // [데이터마켓] 리스트 스타일 변경
    fn_marketPayItemFold(); // [데이터마켓] 결제하기
    fn_marketSlider();
    fn_accordion();//아코디언
    fn_filter();
    fn_totalSearch();

   
    window.addEventListener('scroll', function(e){
        windowWidth = $(window).width();
        windowScrollTop = $(window).scrollTop();
        fn_tabSticky();
    });
    window.addEventListener('resize', function(e){
        windowWidth = $(window).width();
        windowHeight = window.innerHeight;
        fn_asideFixed();
        fn_tabSticky();
    });
});

function fn_main(){
    function active($wrap){
        var menuWidth = $('.navigation').outerWidth() || 0;
        var center = (window.innerWidth / 2) + (menuWidth / 2);
        var closest = null;
        var minDist = Infinity;

        $wrap.find('.exquestion-list .exquestion-item').each(function(){
            var rect = this.getBoundingClientRect();
            var spanCenter = rect.left + rect.width / 2;
            var dist = Math.abs(spanCenter - center);

            if (dist < minDist) {
                minDist = dist;
                closest = this;
            }
        });

        if (!closest) return;

        $wrap.find('.exquestion-list .exquestion-item').removeClass("active");

        var $spans = $wrap.find('.exquestion-list .exquestion-item');
        var idx = $spans.index(closest);

        $spans.eq(idx).addClass("active");
        $spans.eq((idx-1 + $spans.length) % $spans.length).addClass("active");
        $spans.eq((idx+1) % $spans.length).addClass("active");
    }

    // setInterval(function(){
    //     $(".flow-text").each(function(){
    //         active($(this));
    //     });
    // }, 300)
    function loop() {
        $(".flow-text").each(function(){
            active($(this));
        });
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}
function fn_exquestionSwipe(){
    const slider = document.querySelector('.exquestion-type.swiper-container');
    if (!slider) return false;

    const swiper = new Swiper(slider, {
        slidesPerView: 'auto',
        spaceBetween: 12,
        slideToClickedSlide : true
    });

    const exquestions = document.querySelectorAll('.exquestion-type .swiper-slide');
    exquestions.forEach(function(exquestion){
        
        exquestion.addEventListener('click', function(){
            // exquestion.classList.remove('is-active');
            const prev = this.closest('.titles').querySelector('.is-active');
            prev.classList.remove('is-active');
            this.classList.add('is-active');
        });
    });
}

function fn_asideFixed(){
    if (!aside) return false;

    if (windowHeight < 650 && innerWidth > 1023) {
        aside.classList.add('fixed');
    } else {
        aside.classList.remove('fixed');
    }
}

function fn_tabSticky(){
    const tab = document.querySelector('.tab-box');
    if (!tab) return false;
    let tabY  = tab.getBoundingClientRect().y;
    let fixTop = windowWidth < 1024 ? 60 : 32;
    if ( tab.classList.contains('is-static') || tab.classList.contains('is-sticky') ) {
        if( tabY <= fixTop ) {
            tab.classList.remove('is-static');
            tab.classList.add('is-sticky');
        } else {
            tab.classList.remove('is-sticky');
            tab.classList.add('is-static');
        }
    };
}

/** 셀렉트박스 */
// 필요시 각 페이지에서 사용
function fn_selectbox(){
    const selects = document.querySelectorAll(".page-select select");
    if (!selects.length) return false;
    selects.forEach(function(select){
        $(select).selectmenu({
            width: 160,
            position: {
                of: select.parentElement,
                at: "right bottom",
                my: "right top+8"
            },
            open: function( event ) {
                $(event.target.id).toggleClass('open');
                const menu = $('#' + event.target.id + '-menu')[0];
                if ( $(menu.children).hasClass('selected') ) return false;
                $(menu.firstChild).addClass('selected');
            },
            change: function( event ) {
                $(event.currentTarget).siblings().removeClass('selected');
                $(event.currentTarget).addClass('selected');
            }
        });
    })
}

function fn_selectIpt(){
    const selects = document.querySelectorAll(".input-box select");
    if (!selects.length) return false;
    
    // const isBottom = false;
    // const posAt = isBottom ? 'left top' : 'left bottom';
    // const posMy = isBottom ? 'left bottom-8' : 'left top+8';
    selects.forEach(function(select){
        $(select).selectmenu({
            position: {
                of: select.parentElement,
                at: "left bottom",
                my: "left top+8"
                // at: posAt,
                // my: posMy
            },
            create: function( event, ui ) {
                $(this).selectmenu('widget').find('.ui-selectmenu-text').addClass('placeholder');

            },
            // open: function( event ) {
            //     const selectModal = $('#' + event.target.id + '-menu')[0];
            //     if ( $(selectModal.children).hasClass('selected') ) return false;
            //     $(selectModal.firstChild).addClass('selected');
            //     touchClose(selectModal);
            // },
            // change: function( event, ui ) {
            //     $(event.currentTarget).siblings().removeClass('selected');
            //     $(event.currentTarget).addClass('selected');
            //     $(this).selectmenu('widget').find('.ui-selectmenu-text').removeClass('placeholder');
            // }
        });

        function touchClose(_selectModal){
            let startY = 0;
            let endY = 0;
            const _threshold = 70;
            const selectModal = _selectModal;
            $(selectModal).on('touchstart', e => {
                startY = e.touches[0].clientY;
            });
            $(selectModal).on('touchmove', e => {
                endY = e.touches[0].clientY;
            });
            $(selectModal).on('touchend', e => {
                const distance = endY - startY;
                if ( distance > _threshold ) {
                   selects.selectmenu( "close" );
                }
            });
        }

    });
}

/** 로딩 */
function onLoading(_target){
    const loading = document.createElement('div');
    loading.classList.add('loading');
    const dot = '<i class="dot dot1"></i><i class="dot dot2"></i><i class="dot dot3"></i>';
    loading.insertAdjacentHTML('beforeend', dot);
    const loadingArea = document.querySelector(_target);
    loadingArea.appendChild(loading);
}
function removeLoading(_target, _removeTime){
    const loading = document.querySelector(_target).querySelector('.loading');
    loading.classList.add('remove');

    setTimeout(function(){
        loading.remove();
    },_removeTime);
};

/** 탭 기본 */
function fn_tabs(){
    const tabs = document.querySelectorAll('.tab-box');
    if (!tabs) return false;

    tabs.forEach(function(tab){
        const tabLinks = tab.querySelectorAll('li a');

        for ( tabLink of tabLinks ) {
            tabLink.addEventListener('click', function(e){
                e.preventDefault();
                const _this = this;
                const current = _this.parentElement;
                const currentClassName = 'is-on';
                const prev = current.parentElement.querySelector('.'+currentClassName);
                prev.classList.remove(currentClassName);
                current.classList.add(currentClassName);

                const currentTabId = _this.getAttribute('href');
                const currentTabContentId = currentTabId.substr(1);
                const currentTabContent = document.getElementById(currentTabContentId);
                const prevTabId = prev.firstChild.getAttribute('href');
                const prevTabContentId = prevTabId.substr(1);
                const prevTabContent = document.getElementById(prevTabContentId);

                // 현재 탭 앵커기능이 있는 페이지 : 데이터 마켓
                const isAnchor = document.querySelector('.datamarket-contents');
                // if (tab.classList.contains('is-static') || tab.classList.contains('is-sticky')) {
                // console.log(currentTabContent);
                if ( isAnchor ) {
                    if (tab.classList.contains('is-static') || tab.classList.contains('is-sticky')) {
                        const targetY = currentTabContent.getBoundingClientRect().y;
                        window.scrollTo({
                            top: targetY + window.pageYOffset - 120, // PC : 32px(패딩값) + 88px(탭높이)
                            behavior: 'smooth'
                        });
                    } else {
                        if ( !currentTabContent || !prevTabContent) {
                            return false;
                        } else {
                            prevTabContent.style.display = 'none';
                            prevTabContent.tabindex = '-1';
                            currentTabContent.style.display = 'block';
                            currentTabContent.tabindex = '0';
                        }
                    }
                } else {
                    if ( !currentTabContent || !prevTabContent) {
                        return false;
                    } else {
                        prevTabContent.style.display = 'none';
                        prevTabContent.tabindex = '-1';
                        currentTabContent.style.display = 'block';
                        currentTabContent.tabindex = '0';
                    }
                }
            });
        }
    });
};

/** 네비게이션 */
function ui_navi(){
    const foldBtn = aside.querySelector('.icon-menufold');
    if (foldBtn) {
        foldBtn.addEventListener('click', function(e){
            e.preventDefault();
            aside.classList.toggle('is-fold');
        });
    }

    const header = document.querySelector('header.header');
    const openBtn = header.querySelector('.icon-menu');
    const closeBtn = aside.querySelector('.icon-menuclose');
    openBtn.addEventListener('click', function(e){
        e.preventDefault();
        aside.classList.toggle('is-open');
    });
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e){
            e.preventDefault();
            aside.classList.toggle('is-open');
        });
    }

    const mypageBtn = aside.querySelector('.icon-mypage');
    const mypageMenu = aside.querySelector('.mypage-menu');
    if (mypageBtn) {
        mypageBtn.addEventListener('mouseover', function(){
            mypageMenu.classList.add('is-open');
            $('.wrap').css({'z-index':10}); // ai 검색 데이터만들기 팝업 가려짐으로 임시 적용
        });
        mypageMenu.addEventListener('mouseleave', function(){
            mypageMenu.classList.remove('is-open');
            $('.wrap').css({'z-index':1}); // ai 검색 데이터만들기 팝업 가려짐으로 임시 적용
        });
    }

    const historyBtn = aside.querySelector('.icon-history');
    const historyModal = document.getElementById('modalHistory');

    if (historyBtn) {
        const historyModalCloseBtn = historyModal.querySelector('.modal-close');
        historyBtn.addEventListener('mouseover', function(){
            historyModal.classList.remove('modal-hidden');
        });
        historyModalCloseBtn.addEventListener('click', function(){
            // fn_modalPopClose(historyModal);
            historyModal.classList.add('modal-hidden');
        });
    }
    modalHistory.addEventListener('mouseleave', function(){
        historyModal.classList.add('modal-hidden');
    });
    
    const aisearchBtn = document.querySelector('.pop-aiside-button');
    const aisideModal = document.getElementById('modalAiSide');
    if (aisearchBtn) {
        $('.container').addClass('has-aiside')
        aisearchBtn.addEventListener('click', function(){
            fn_modalPopOpen('modalAiSide', true);
        });
    }
}

/** 백그라운드 적용 */
function ui_glassBg(){
    const main = $('.page-login, .page-main');
    if ( !main.length ) return false;

    $('body').addClass('is-main');
    const bodyBg = document.createElement('div');
    bodyBg.id = 'bg';
    document.body.appendChild(bodyBg);

    const lottieScript = document.createElement('script');
    lottieScript.type = "text/javascript";
    lottieScript.src = "../js/lottie.min.js";

    document.body.appendChild(lottieScript);
    lottieScript.onload = function() {
        lottie();
        
        function lottie(){
            const animation = bodymovin.loadAnimation({
                container: document.getElementById('bg'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '../images/bg_gradient.json'
            });
        }
    };
};

/** 비밀번호 마스킹 */
function fn_passwordMask(){
    const maskBtns = document.querySelectorAll('.ipt-mask');
    if (!maskBtns.length) return false;
    // console.log(maskBtns.length);
    
    maskBtns.forEach(function(maskBtn){
        maskBtn.addEventListener('click', function(e){
            e.preventDefault();
            toggle(this);
        });
    });

    function toggle(e){
        const button = e;
        const input = button.closest('.util-box').previousElementSibling;
        const _option = {
            text: ['비밀번호 숨기기', '비밀번호 보기'],
            maskon: ['text', 'password']
        }

        const _val = input.type == 'password' ? 0 : 1;
        button.classList.toggle('off');
        button.innerHTML = '<i>'+ _option.text[_val] +'</i>';
        input.setAttribute( 'type' , _option.maskon[_val] );
        input.focus();
    }   
}

/** 인풋 포커스 확인 */
function fn_iptIsFocus (){
    const inputs = document.querySelectorAll('.input-box');
    if (!inputs.length) return false;
    // console.log(inputs.length);

    inputs.forEach(function(input){
        input.addEventListener('focusin', function(e){
            fn_inputBoxFoceseIn(this);
        });
        input.addEventListener('focusout', function(){
            fn_inputBoxFocesOut(this);
        });
    });

    function fn_inputBoxFoceseIn(e){
        let box = e.closest('.input-box');
        box.classList.toggle('is-focusin');
    }
    function fn_inputBoxFocesOut(e){
        let box = e.closest('.input-box');
        box.classList.toggle('is-focusin');
    }
};


/** 인풋값 삭제 */
function fn_iptClear(){
    // const iptClear = document.querySelectorAll('.ipt-clear');
    const iptClear = $('.ipt-clear');
    if (!iptClear.length) return false;
    // console.log(iptClear.length);

    // iptClear.forEach(function(btn){
    //     btn.addEventListener('click', function(e){
    //         e.preventDefault();
    //         let input = e.target.closest('.util-box').previousElementSibling;
    //         input.value = "";
    //         input.focus();
    //     })
    // });
    iptClear.on('click', function(e){
        e.preventDefault();
        let input = $(e.target).closest('.input-box').find('input');
        input.val('');
        input.focus();
    });
};

/** 파일열기 */
function fn_fileInput (){
    // const fileInputs = document.querySelectorAll('input[type="file"]');
    const fileInputs = $('.input-box input[type="file"]');
    if (!fileInputs) return false;
    // fileInputs.forEach(function(fileInput){
    //     fileInput.addEventListener('change', function(){
    //         const _this = this;
    //         const filePath = _this.nextElementSibling;
    //         if ( filePath ) filePath.value = _this.value;
    //     });
    // });
    fileInputs.on('change', function(){
        const _this = this;
        const filePath = _this.nextElementSibling;
        if ( filePath ) filePath.value = _this.value;
        filePath.value = _this.value;
    });
}

/** 모달팝업 [8월 중순 삭제예정] */ /* [2025.09.15] 삭제테스트 */
function _fn_modal(_data) {
    const data = _data;
    const modalId = _data.modalId;
    let isOpenedModal = document.getElementById(modalId);
    
    let _remove = true;
    const modalHtml = document.createElement("div");
    modalHtml.classList = "pop-modal";

    // 닫기 후 삭제하지 않는 모달인 경우
    if ( modalId !== undefined ) {
        modalHtml.id = modalId;
        _remove = false;
    }

    if (isOpenedModal !== null) {
        isOpenedModal.classList.remove('modal-hidden');
        const modalCloses = isOpenedModal.querySelectorAll('.modal-close, .button-box-medium button');
        modalCloses.forEach(function(modalClose){
            modalClose.addEventListener('click', function(){
                const _this = this;
                fn_modalClose(_remove, _this);
            });
        });
        return false;
    }
    
    const pop = document.createElement("div");
    pop.classList = "modal";
    pop.setAttribute('tabindex', 0);
    const messegeBox = document.createElement("div");
    messegeBox.classList = "message-box";
    const buttonBox = document.createElement("div");
    buttonBox.classList = "button-box-medium";
    const buttonPrimary = document.createElement('button');
    buttonPrimary.classList = 'button-p close-modal';
    buttonPrimary.type = "button";
    buttonPrimary.innerText = _data.button1 || '확인';

    // 버튼2 있는 경우
    if ( _data.button2 !== undefined ) {
        const buttonSecondary = document.createElement('button');
        buttonSecondary.classList = 'button-s';
        buttonSecondary.type = "button";
        buttonSecondary.innerText =  _data.button2 === true || _data.button2.length == 0 ? '취소' : _data.button2;
        buttonSecondary.addEventListener('click', function(){
            const _this = this;
            if ( data.button2Action ) {
                function buttonAction(){
                    new Function(data.button2Action)();
                }
                buttonAction(modalId);
            };
            fn_modalClose(_remove, _this);
        });

        buttonBox.appendChild(buttonSecondary);
    };

    // 버튼3 있는 경우
    if ( _data.button3 !== undefined ) {
        const buttonTertiary = document.createElement('button');
        buttonTertiary.classList = 'button-q';
        buttonTertiary.type = "button";
        buttonTertiary.innerText =  _data.button3 === true || _data.button3.length == 0 ? '취소' : _data.button3;
        buttonTertiary.addEventListener('click', function(){
            const _this = this;
            if ( data.button3Action ) {
                function buttonAction(){
                    new Function(data.button3Action)();
                }
                buttonAction(modalId);
            };
            fn_modalClose(_remove, _this);
        });

        buttonBox.appendChild(buttonTertiary);
    };

    modalHtml.appendChild(pop);
    buttonBox.appendChild(buttonPrimary);

    // 서브타이틀
    if ((data.title == undefined || data.title == '')) { // 헤더 없는 경우
        pop.append(messegeBox, buttonBox);
        
    } else if (Array.isArray(data.title)) { // 배열 
        const header = document.createElement('div');
        header.classList = "modal-header";
        header.innerText = data.title[0];
        pop.append(header);

        // 배열인 경우
        if ( data.title.length > 1 ) {
            // 서브타이틀 있을 때
            const description = document.createElement('div');
            description.classList = "modal-description";
            description.innerText = data.title[1];

            pop.append(description);
        }
        pop.append(messegeBox, buttonBox);
    } else if ( typeof data.title == "string" ) { // 스트링
        const header = document.createElement('div');
        header.classList = "modal-header";
        header.innerText = data.title;

        pop.append(header, messegeBox, buttonBox);
    }
    if (data.type == 'large') {
        if ( !data.path ) {
            messegeBox.innerHTML = data.message || '';
        } else {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", data.path, true); //옵션 :: 전송방식, 경로, 비동기사용여부
            xhr.send();
            xhr.onload = function(){
                messegeBox.innerHTML = xhr.responseText;

                if ( data.onloadAction ) {
                    function onloadAction(){
                        new Function(data.onloadAction)();
                    };
                    onloadAction();
                }
            }
        }
        pop.classList.add('modal-large');
        setCloseButton();
    } else {
        const textTag = document.createElement('p');

        textTag.innerHTML  = data.message || '';

        messegeBox.appendChild(textTag);
        if (data.type == 'confirm') {
            buttonBox.classList.add('col-3');
        } 
        pop.append(messegeBox, buttonBox);
    };

    if ( data.closebtn == true ) { // 닫기버튼 있을떄
        setCloseButton();
    };

    buttonPrimary.addEventListener('click', function(){
        const _this = this;
        if ( data.button1Action ) {
            function buttonAction(modalId){
                new Function(data.button1Action)();
            };
            buttonAction(modalId);
        }
        fn_modalClose(_remove, _this);
    });
    
    // html 추가
    document.body.appendChild(modalHtml);
    pop.focus();

    if ( data.onloadAction ) {
        function onloadAction(){
            new Function(data.onloadAction)();
        };
        onloadAction();
    }

    function setCloseButton(){ // 닫기버튼
        const buttonClose = document.createElement('button');
        buttonClose.classList = 'modal-close';
        buttonClose.type = "button";
        buttonClose.innerText = '닫기';
        pop.append(buttonClose);

        buttonClose.addEventListener('click', function(){
            const _this = this;
            fn_modalClose(_remove, this);
        });
    };
}
/** 모달팝업 닫기 [8월 중순 삭제예정] */ /* [2025.09.15] 삭제테스트 */
function _fn_modalClose(_remove, _this){
    const modal = _this.closest('.pop-modal');
    if (_remove) {
        modal.remove();
    } else {
        modal.classList.add('modal-hidden');
    }
}; // fn_modalClose

/** 모달팝업 */
var lastFocusElement = null;
function fn_modalPopOpen(_modalId, _isFull, _hasDim){
    // const modal = document.getElementById(_modalId);
    const modal2 = $('#'+ _modalId);
    // const modalPop = modal2.firstElementChild;
    const modalPop2 = modal2.find('> .modal');

    // modal.classList.remove('modal-hidden');
    modal2.removeClass('modal-hidden');
    if (_isFull === true) {
        // modal.classList.add('is-full');
        modal2.addClass('is-full');
    }
    if (_hasDim === false) {
        // modal.classList.add('no-dim');
        modal2.addClass('no-dim');
    }

    // focus 방지
    lastFocusElement = $(document.activeElement);
    // console.log(lastFocusElement);

    function fn_focusAbleElments() {
        return modal2.find('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
    }
    // console.log(lastFocusElement);
    // console.log(fn_focusAbleElments());
    
    function fn_keyTrap (e) {
        if (e.key === "Escape") {
            // console.log("Escape");
            fn_modalPopClose(_modalId);
            return;
        }
        if (e.key === "Tab") {
            // console.log("Tab");
            const focusAbleElments = fn_focusAbleElments();
            const focusAbleFirst = focusAbleElments.first()[0];
            const focusAbleLast = focusAbleElments.last()[0];

            if (e.shiftKey) {
                if (document.activeElement === focusAbleFirst) {
                    e.preventDefault();
                    // $(last).focus();
                    // console.log("focusAbleFirst");
                }
            } else {
                if ( document.activeElement === focusAbleLast ) {
                    e.preventDefault();
                    // $(first).focus();
                    // console.log("focusAbleLast");
                }
            }
        }
    }

    modal2.on("keydown",fn_keyTrap);

    // const modalButtons = modal.querySelectorAll('.button-box-medium button:not(.maintain-modal), .modal-close, .modal-close-text');
    const modalButtons = $(modal2).find('.button-box-medium button:not(.maintain-modal), .modal-close, .modal-close-text');
    // modalButtons.forEach(function(modalButton){
    //     modalButton.addEventListener('click', function(){
    //         fn_modalPopClose(modal);
    //     });
    // });
    $(modalButtons).on('click', function(){
        // console.log(1);
        fn_modalPopClose(_modalId);
    });
    
    windowScrollTopFix = window.scrollY;
    document.body.style.top = `-${windowScrollTopFix}px`;
    document.body.classList.add('is-fixed');
    
    modalPop2.focus();
}
function fn_modalPopClose(_this){
    if ( typeof _this == 'string' ) {
        _this = document.getElementById(_this);
    }
    _this.classList.add('modal-hidden');

    document.body.style.removeProperty('top');
    document.body.classList.remove('is-fixed');
    window.scrollTo(0,windowScrollTopFix);
    lastFocusElement.focus();
};
/** 팝오버 [작업중] */
function fn_popover(){
    var pop = $("#popover");
    $(".info").on("mouseenter focus", function(){
        var _this = $(this);
        console.log(_this);
        var pos = _this.data("tip-position") || "top";
        var text = _this.data("tip");
        pop.text(text).attr("data-pos", pos).show();
        
        var rect = this.getBoundingClientRect();
        var popRect = pop[0].getBoundingClientRect();

        var top, left;
        switch(pos){
            case "top-left":
                top = rect.top + window.scrollY - popRect.height - 8;
                left = rect.left - popRect.width - 8;
                break;
            case "top":
                top = rect.top + window.scrollY - popRect.height - 8;
                left = rect.left + window.scrollX + (rect.width - popRect.width)/2;
                break;
            case "top-right":
                top = rect.top + window.scrollY - popRect.height;
                left = rect.right + window.scrollX - popRect.width - 8;
                break;
            case "middle-left":
                top = rect.top + window.scrollY + (rect.height - popRect.height)/2;
                left = rect.left - popRect.width - 8;
                break;
            case "middle-right":
                top = rect.top + window.scrollY + (rect.height - popRect.height)/2;
                left = rect.right + 8;
                break;
            case "bottom-left":
                top = rect.bottom + 8;
                left = rect.left - popRect.width - 8;
                break;
            case "bottom":
                top = rect.bottom + 8;
                left = rect.left + window.scrollX + (rect.width - popRect.width)/2;
                break;
            case "bottom-right":
                top = rect.bottom + 8;
                left = rect.right + 8;
                break;
        }

        if (left < 8) left = 8;
        if (left + popRect.width > window.innerWidth - 8) {
            left = window.innerWidth - popRect.width - 8;
        }

        if (top < 8) top = 8;
        if (top + popRect.height > window.innerHeight - 8) {
            left = window.innerHeight - popRect.height - 8;
        }

        pop.css({ top: top +"px" , left: left + "px" });
    });

    $(".info").on("mouseleave blur", function(){
        // pop.hidePopover();
    });
}
function fn_tooltipOpen(_tooltipId) {
    const tooltip = $('#'+ _tooltipId);

    tooltip.removeClass('tooltip-hidden');
    
    windowScrollTopFix = window.scrollY;
    document.body.style.top = `-${windowScrollTopFix}px`;
    document.body.classList.add('is-fixed');

    const tooltipBtn = tooltip.find('.tooltip-close');

    tooltipBtn.on('click', function(){
        tooltip.addClass('tooltip-hidden');

        document.body.style.removeProperty('top');
        document.body.classList.remove('is-fixed');
        window.scrollTo(0,windowScrollTopFix);
    });
}

/** 토스트 */
function fn_toast(_message, _type){
    const toast = document.createElement("div");
    toast.classList.add('toast-message');
    const message = document.createElement('p');
    message.innerText = _message;
    toast.append(message);

    document.body.appendChild(toast);

    if (_type === 1) {
        message.classList.add('pass');
    } else if (_type === 2) {
        message.classList.add('error');
    }

    setTimeout(function(){
        toast.classList.add('on');
        removeToast();
    }, 50);

    function removeToast(){
        setTimeout(function(){
            toast.classList.remove('on');
            setTimeout(function(){
                toast.remove();
            }, 1000);
        }, 2500);
    }
}

/*************
페이지 별 기능
**************/
/** AI검색 */
function fn_bannerSlider(_popId){
    const pop = document.getElementById(_popId);
    const slider = pop.querySelector('.banner-slider');
    const swiper = new Swiper(slider, {
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            el: pop.querySelector(".swiper-pagination"),
            clickable: true,
        },
    });

}
function fn_faqAccodion(_popId){
    const pop = document.getElementById(_popId);
    const accordion = pop.querySelector('.faq-list');
    $( accordion ).accordion({
        active: false,
        collapsible: true,
        header:".item-title",
        heightStyle:"auto"
    });
}
function fn_aisearchAccordion(_accordion1Id){
    const accordion = document.getElementById(_accordion1Id);
    $( `#${_accordion1Id}` ).accordion({
        active: false,
        collapsible: true,
        header:"h3",
        heightStyle:"auto"
    });
}
function fn_aisearchSlider(_sliderId){
    const slider = document.getElementById(_sliderId);
    const swiper = new Swiper(`#${_sliderId} .aisearch-slider`, {
        
        slidesPerView: "auto",
        // slidesPerView: 3,
        spaceBetween: 12,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        speed: 600,
        navigation: {
            nextEl: slider.querySelector(".next"),
            prevEl: slider.querySelector(".prev")
        },
        pagination: {
            el: slider.querySelector(".swiper-pagination"),
            clickable: true,
        },
    });
}
/** 데이터마켓 */
// 리스트 스타일 변경
function fn_marketList(){
    const marketContent = document.querySelector('.datamarket-contents');
    if (!marketContent) return false;

    const dataList = marketContent.querySelector('.data-list >ul');
    const listBtns = marketContent.querySelectorAll('.list-type button');
    listBtns.forEach(function(prevListBtn){

        prevListBtn.addEventListener('click', function(){
            prevListBtn.classList.remove('is-show');

            const prevListNames = prevListBtn.classList;
            let prevListType;
            for ( var i = 0; i < prevListNames.length ; i++ ) {
                if (prevListNames[i].indexOf('type-') != -1) {
                    prevListType = prevListNames[i].split('type-')[1];
                }
            }
            dataList.classList.remove(prevListType);
            
            const currentListBtn = prevListBtn.previousElementSibling || prevListBtn.nextElementSibling;
            currentListBtn.classList.add('is-show');

            const currentlistNames = currentListBtn.classList;
            let currentListType;
            for ( var i = 0; i < currentlistNames.length ; i++ ) {
                if (currentlistNames[i].indexOf('type-') != -1) {
                    currentListType = currentlistNames[i].split('type-')[1];
                }
            }
            dataList.classList.add(currentListType);
        });
    });
}

// 상세 슬라이드
function fn_marketSlider(){
    const slider = document.querySelector('.data-recommend-slider');
    if (!slider) return false;

    const swiper = new Swiper('.data-recommend-slider', {
        // slidesPerView: 3,
        slidesPerView: "auto",
        spaceBetween: 20,
        navigation: {
            nextEl: ".next",
            prevEl: ".prev"
        },
        pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
}

// 문의내역 내용 접기/펼치기
function fn_questionHistoryItemFold(){
    const questionItems = document.querySelectorAll('.myquestion-item');
    if (!questionItems.length) return false;
    
    questionItems.forEach(function(questionItem){
        questionItem.querySelector('.item-header').addEventListener('click', function(e){
            e.preventDefault();
            const icon = questionItem.querySelector('.icon-up, .icon-down');
            const isFold = icon.classList.contains('icon-up');

            if ( isFold ) {
                icon.classList.remove('icon-up');
                icon.classList.add('icon-down');
                icon.innerText = '상세내용 펼치기';
                this.nextElementSibling.classList.add('is-fold');
            } else {
                icon.classList.remove('icon-down');
                icon.classList.add('icon-up');
                icon.innerText = '상세내용 접기';
                this.nextElementSibling.classList.remove('is-fold');
            }
        });
    })
}

// 결제내역 상품정보 접기/펼치기
function fn_paymentHistoryItemFold(){
    const paymentItems = document.querySelectorAll('.payment-history .pay-items');
    if (!paymentItems.length) return false;
    
    paymentItems.forEach(function(paymentItem){
        paymentItem.querySelector('.number-order').addEventListener('click', function(e){
            e.preventDefault();
            const icon = paymentItem.querySelector('.icon-up, .icon-down');
            const isFold = icon.classList.contains('icon-up');

            if ( isFold ) {
                icon.classList.remove('icon-up');
                icon.classList.add('icon-down');
                icon.innerText = '상세내용 펼치기';
                paymentItem.classList.add('is-fold');
            } else {
                icon.classList.remove('icon-down');
                icon.classList.add('icon-up');
                icon.innerText = '상세내용 접기';
                paymentItem.classList.remove('is-fold');
            }
        });
    })
}

// 결제하기 상품정보 접기/펼치기
function fn_marketPayItemFold(){
    const marketPay = document.querySelector('.pay-items');
    if (!marketPay) return false;
    
    const marketItemBtns = marketPay.querySelectorAll('.item-header button');
    marketItemBtns.forEach(function(marketItemBtn){
        marketItemBtn.addEventListener('click', function(){
            const isFold = marketItemBtn.classList.contains('icon-up');

            if ( isFold ) {
                marketItemBtn.classList.remove('icon-up');
                marketItemBtn.classList.add('icon-down');
                marketItemBtn.innerText = '상세내용 펼치기';
            } else {
                marketItemBtn.classList.remove('icon-down');
                marketItemBtn.classList.add('icon-up');
                marketItemBtn.innerText = '상세내용 접기';
            }

            const itemGroup = marketItemBtn.closest('.item-group');
            const itemContents = itemGroup.querySelectorAll('.item-body, .item-bottom');
            itemContents.forEach(function(itemContent){
                itemContent.classList.toggle('is-fold');
            });
        });
    })
}
/** //데이터마켓 */

/** AI인사이트 */
// 리스트 슬리이드
function fn_insightSlider(){
    const slider = document.querySelector('.insight-slider');
    if (!slider) return false;

    const swiper = new Swiper(".insight-slider", {
        pagination: {
            clickable: true,
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: ".next",
            prevEl: ".prev"
        },
        on: {
            transitionEnd: function(swiper){
                currentIndex = swiper.activeIndex;
                swiper.el.nextElementSibling.querySelector('.info-slide.current').classList.remove('current');
                swiper.el.nextElementSibling.querySelectorAll('.info-slide')[currentIndex].classList.add('current');
            }
        }
    });
}
/** //AI인사이트 */

/** 상권분석 */
// 핵심지표 슬라이드
function fn_tabsCompareSlider(){
    const slider = $('.compare-slider-wrap');
    if (!slider) return false;

    const sliderTabBox = $('.cont-compare .tab-box');
    const sliderTabLinks = sliderTabBox.find('a');
    const sliderTabs = sliderTabBox.find('li');
                
    const swiper = new Swiper(".compare-slider", {
        pagination: {
            clickable: true,
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: ".next",
            prevEl: ".prev",
        },
        on: {
            transitionEnd: function(swiper){
                const currentIndex = swiper.activeIndex;
                sliderTabBox.find('li.is-on').removeClass('is-on');
                sliderTabs.eq(currentIndex).addClass('is-on');
            }
        }
    });
    //  탭을 클릭했을때 슬라이드 이동
    sliderTabLinks.on('click', function(e){
        e.preventDefault;
        e.stopPropagation;
        const _idx = $(this).parent().index();
        swiper.slideTo(_idx);
    });
}

// 지표설명보기
function fn_cardToBack(){
    const btn = document.querySelector('.show-explanation');
    if (!btn) return false;
    
    let _toBackCount = 0;
    let _toBack = false;
    const targetElements = document.querySelectorAll('.explanation-slider .card');
    const btnText = ['지표 수치 보기', '지표 설명 보기'];
    btn.addEventListener('click', function(){
        targetElements.forEach(function(targetElement){
            if ( _toBack ) {
                _toBackCount = 0;
                btn.innerText = btnText[1];
                targetElement.classList.remove('to-back');
            } else {
                _toBackCount = targetElements.length;
                btn.innerText = btnText[0];
                targetElement.classList.add('to-back');
            }
        });
        if ( _toBack ) {
            _toBack = false;
        } else {
            _toBack = true;
        }
    });
    
    targetElements.forEach(function(targetElement){
        targetElement.addEventListener('click', function(){
            if (this.classList.contains('to-back')) {
                _toBackCount--;
            } else {
                _toBackCount++;
            }
            
            if ( _toBackCount === targetElements.length ) {
                btn.innerText = btnText[0];
                _toBack = true;
            } else if ( _toBackCount === 0 ) {
                btn.innerText = btnText[1];
                _toBack = false;
            }
            this.classList.toggle('to-back');
            
        });
    });
};

// 지표설명보기 모바일슬라이드
function fn_explanationSlider(){
    const slider = document.querySelector('.explanation-slider');
    if (!slider) return false;

    var swiper = new Swiper('.explanation-slider', {
        pagination: {
            clickable: true,
            el: '.swiper-pagination',
        },
        slidesPerView: 1,
        spaceBetween: 24,
        breakpoints: {
            768: {
                slidesPerView: 'auto',
                spaceBetween: 0,
                enabled: false
            }
        }
    });
}

// 하단내비
function fn_analysisNav(){
    const nav = $('.analysis-nav');
    if (!nav) return false;


    const navMenuArea = nav.find('.area');
    const navMenuAreaList = nav.find('.area-list');
    const navMenuIndustry = nav.find('.industry');
    const navMenuIndustryList = nav.find('.industry-list');
    var _isLayerClose = true;

    navMenuArea.on('click', function(){
        const _this = $(this);
        if ( windowWidth < 768 ) return false;
        _this.addClass('is-current');
        _this.next().removeClass('is-current');
        navMenuAreaList.addClass('is-open');
        navMenuIndustryList.removeClass('is-open');
        _isLayerClose = false;
    });
    navMenuIndustry.on('click', function(){
        const _this = $(this);
        if ( windowWidth < 768 ) return false;
        _this.addClass('is-current');
        _this.prev().removeClass('is-current');
        navMenuAreaList.removeClass('is-open');
        navMenuIndustryList.addClass('is-open');
        _isLayerClose = false;
    });
        

    // 닫기
    // navMenuAreaList.on('mouseleave', function(){
    //     const _this = $(this);
    //     closeLayer(_this, navMenuArea);
    // });
    // navMenuIndustryList.on('mouseleave', function(){
    //     const _this = $(this);
    //     closeLayer(_this, navMenuIndustry);
    // });
    
    function closeLayer (_this, _thisBtn) {
        _this.removeClass('is-open');
        _thisBtn.removeClass('is-current');
        _isLayerClose = true;
    }

    $(document).on('click', function(e){
        if ( !_isLayerClose ) {
            const _target = $(e.target);
            if ( _target.hasClass('area') || _target.hasClass('industry') ) {
                e.stopPropagation();
            } else {
                closeLayer(navMenuAreaList, navMenuArea);
                closeLayer(navMenuIndustryList, navMenuIndustry);
            }
        }
    });
};
/** //상권분석 */

/** 로그인/회원가입 */
// 약관동의 [2025.09.11] 페이지로 이동
// function fn_agreeTerms(_id){ 
// };
/** //로그인/회원가입 */

/** 필터 */
function fn_filter() {
  const btnFilter = document.querySelector('.btn-icon-filter'); // 필터 열기 버튼
  if (!btnFilter) { return false; }

  const filterContent = document.querySelector('.filter_box'); // 필터 영역
  const btnClose = document.querySelector('.filter-close'); // 필터 닫기 버튼
  const header = document.querySelector('.header'); // 헤더 요소
  const button = document.querySelector('.page-polio .content-head-btn .button-box-small'); 

  // 처음에는 filter-content 숨기기
  filterContent.style.display = 'none';

  // 필터 열기 버튼 클릭
  btnFilter.addEventListener('click', function () {
    filterContent.style.display = 'flex';
    // btnFilter.style.display = 'none';

    // 모바일 사이즈일 때 header z-index 초기화
    if (window.innerWidth <= 768) {
      header.style.zIndex = 'auto';
      button.style.zIndex = '9';
    }
  });

  // 필터 닫기 버튼 클릭
  btnClose.addEventListener('click', function () {
    filterContent.style.display = 'none';
    // btnFilter.style.display = 'block';

    // 모바일 사이즈일 때 header z-index 20으로 복원
    if (window.innerWidth <= 768) {
      header.style.zIndex = '20';
      button.style.zIndex = '99';
    }
  });
}

/** 아코디언 */
function fn_accordion() {
  const items = $('.accordion-item'); //데이터 폴리오에서 전체 펼침 가능으로 변경
  if (!items) { return false; }
    items.find('.accordion-header').on('click', function(){
        $(this).parent().toggleClass('active');
    });
};
/** //아코디언 */

//통합검색
function fn_totalSearch() {
  const iconSearch = document.querySelector('.icon-search, .icon-searchclose');
  const totalSearch = document.querySelector('.totalSearch');
  const statebar = document.querySelector('.statebar');
  if (!iconSearch) return false;
  function showTotalSearch() {
    if (window.innerWidth <= 1023) {
      totalSearch.style.display = 'flex'; // 모바일에서는 flex
    } else {
      totalSearch.style.display = 'block'; // 데스크탑에서는 block
    }
    iconSearch.classList.remove('icon-search');
    iconSearch.classList.add('icon-searchclose');
    iconSearch.textContent = '닫기';
  }

  function hideTotalSearch() {
    totalSearch.style.display = 'none';
    iconSearch.classList.remove('icon-searchclose');
    iconSearch.classList.add('icon-search');
    iconSearch.textContent = '통합검색';
  }

  function isMobile() {
    return window.innerWidth <= 768;
  }

  iconSearch.addEventListener('click', function(e) {
    e.preventDefault();
    if (iconSearch.classList.contains('icon-search')) {
      showTotalSearch();
      if (isMobile() && statebar) {
        statebar.style.display = 'none';
      }
    } else {
      hideTotalSearch();
      if (isMobile() && statebar) {
        statebar.style.display = '';
      }
    }
  });

  const textClose = document.querySelector('.totalSearch .text-close');
  if (textClose) {
    textClose.addEventListener('click', function(e) {
      e.preventDefault();
      hideTotalSearch();
      if (isMobile() && statebar) {
        statebar.style.display = '';
      }
    });
  }
}