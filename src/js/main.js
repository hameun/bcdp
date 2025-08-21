var windowWidth;
var windowHeight;
var windowScrollTopFix;
var aside;
$(function(){
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    aside = document.querySelector('.aside');
    // console.log('ready');
    /** 기본 로드될 함수 */
    ui_navi();
    fn_asideFixed();
    ui_glassBg();
    fn_tabs();

    fn_iptClear();
    fn_iptIsFocus();
    fn_passwordMask();
    fn_fileInput();
    fn_selectbox();
    fn_selectIpt();
    
    fn_insightSlider(); // [AI인사이트] 메인슬라이더
    fn_exquestionSwipe(); // [AI검색] 예시 질문

    fn_marketList(); // [데이터마켓] 리스트 스타일 변경
    fn_marketPayItemFold(); // [데이터마켓] 결제하기
    fn_marketSlider();
    fn_accordion();//아코디언
    fn_filter();

    window.addEventListener('scroll', function(e){
        windowWidth = window.innerWidth;
        fn_tabSticky();
    });
    window.addEventListener('resize', function(e){
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        fn_asideFixed();
        fn_tabSticky();
    });
});

function fn_exquestionSwipe(){
    const slider = document.querySelector('.exquestion-type.swiper-container');
    if (!slider) return false;

    const swiper = new Swiper(slider, {
        slidesPerView: 'auto',
        spaceBetween: 16,
        freemode: true
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
    if ( tab.classList.contains('is-static') || tab.classList.contains('is-sticky') ) {
        if( tabY <= 0 ) {
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

    selects.forEach(function(select){
        $(select).selectmenu({
            position: {
                of: select.parentElement,
                at: "left bottom",
                my: "left top+8"
            },
            create: function( event, ui ) {
                $(this).selectmenu('widget').find('.ui-selectmenu-text').addClass('placeholder');

            },
            open: function( event ) {
                const selectModal = $('#' + event.target.id + '-menu')[0];
                if ( $(selectModal.children).hasClass('selected') ) return false;
                $(selectModal.firstChild).addClass('selected');
                touchClose(selectModal);
            },
            change: function( event, ui ) {
                $(event.currentTarget).siblings().removeClass('selected');
                $(event.currentTarget).addClass('selected');
                $(this).selectmenu('widget').find('.ui-selectmenu-text').removeClass('placeholder');
            }
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
                    $(select).selectmenu( "close" );
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
            });
        }
    });
};

/** 네비게이션 */
function ui_navi(){
    const foldBtn = aside.querySelector('.icon-menufold');
    foldBtn.addEventListener('click', function(){
        aside.classList.toggle('is-fold');
    });

    const header = document.querySelector('header.header');
    const openBtn = header.querySelector('.icon-menu');
    const closeBtn = aside.querySelector('.icon-menuclose');
    openBtn.addEventListener('click', function(){
        aside.classList.toggle('is-open');
    });
    closeBtn.addEventListener('click', function(){
        aside.classList.toggle('is-open');
    });

    const mypageBtn = aside.querySelector('.icon-mypage');
    const mypageMenu = aside.querySelector('.mypage-menu');
    if (mypageBtn) {
        mypageBtn.addEventListener('mouseover', function(){
            mypageMenu.classList.add('is-open');
        });
        mypageMenu.addEventListener('mouseleave', function(){
            mypageMenu.classList.remove('is-open');
        });
    }

    const historyBtn = aside.querySelector('.icon-history');
    const historyModal = document.getElementById('modalHistory');
    if (historyBtn) {
        historyBtn.addEventListener('mouseover', function(){
            historyModal.classList.remove('modal-hidden');
        });
    }

    const historyModalCloseBtn = historyModal.querySelector('.modal-close');
    if (historyModalCloseBtn) {
        historyModalCloseBtn.addEventListener('click', function(){
            // fn_modalPopClose(historyModal);
            historyModal.classList.add('modal-hidden');
        });
    }
}

/** 백그라운드 적용 */
function ui_glassBg(){
    const filepath = this.location.pathname;
    const filename = filepath.substring(filepath.lastIndexOf('/') + 1).split(".")[0];
    const glassBgPages = ["UT01", "UT01M", "AS01MAIN"];
    for ( glassBgPage of glassBgPages ) {
        if (filename == glassBgPage) {
            const body = document.getElementsByTagName('body')[0];
            body.classList.add('has-glassbg');
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
    };
};

/** 비밀번호 마스킹 */
function fn_passwordMask(){
    const maskBtns = document.querySelectorAll('.ipt-mask');
    if (!maskBtns.length) return false;
    // console.log(maskBtns.length);
    
    maskBtns.forEach(function(maskBtn){
        maskBtn.addEventListener('click', function(){
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
    const iptClear = document.querySelectorAll('.ipt-clear');
    if (!iptClear.length) return false;
    // console.log(iptClear.length);

    iptClear.forEach(function(btn){
        btn.addEventListener('click', function(e){
            e.preventDefault();
            let input = e.target.closest('.util-box').previousElementSibling;
            input.value = "";
            input.focus();
        })
    });
};

/** 파일열기 */
function fn_fileInput (){
    const fileInputs = document.querySelectorAll('input[type="file"]');
    if (!fileInputs) return false;
    fileInputs.forEach(function(fileInput){
        fileInput.addEventListener('change', function(){
            const _this = this;
            _this.nextElementSibling.value = _this.value;
        });
    });
}

/** 모달팝업 [8월 중순 삭제예정] */
function fn_modal(_data) {
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
        
        // const modalClose = isOpenedModal.querySelector('.modal-close');
        // modalClose.addEventListener('click', function(){
        //     const _this = this;
        //     fn_modalClose(_remove, _this);
        // });

        // const modalButton1 = isOpenedModal.querySelector('.button-box-medium .button-p');
        // modalButton1.addEventListener('click', function(){
        //     const _this = this;
        //     fn_modalClose(_remove, _this);
        // });

        // const modalButton2 = isOpenedModal.querySelector('.button-box-medium .button-s');
        // if (modalButton2) {
        //     modalButton2.addEventListener('click', function(){
        //         const _this = this;
        //         fn_modalClose(_remove, _this);
        //     });
        // }

        // const modalButton3 = isOpenedModal.querySelector('.button-box-medium .button-q');
        // if (modalButton3) {
        //     modalButton3.addEventListener('click', function(){
        //         const _this = this;
        //         fn_modalClose(_remove, _this);
        //     });
        // }
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


    // 모달 사이즈
    // if ( data.type == '' || data.type == 'alert' || data.type === undefined ) {
    //     const textTag = document.createElement('p');

    //     textTag.innerHTML  = data.message || '';

    //     messegeBox.appendChild(textTag);
    //     pop.append(messegeBox, buttonBox);
    // } else if (data.type == 'large') {

    //     if ( !data.path ) {
    //         messegeBox.innerHTML = data.message || '';
    //     } else {
    //         const xhr = new XMLHttpRequest();
    //         xhr.open("GET", data.path, true); //옵션 :: 전송방식, 경로, 비동기사용여부
    //         xhr.send();
    //         xhr.onload = function(){
    //             messegeBox.innerHTML = xhr.responseText;

    //             if ( data.onloadAction ) {
    //                 function onloadAction(){
    //                     new Function(data.onloadAction)();
    //                 };
    //                 onloadAction();
    //             }
    //         }
    //     }
    //     pop.classList.add('modal-large');
    //     setCloseButton();
    // }
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
/** 모달팝업 닫기 [8월 중순 삭제예정] */
function fn_modalClose(_remove, _this){
    const modal = _this.closest('.pop-modal');
    if (_remove) {
        modal.remove();
    } else {
        modal.classList.add('modal-hidden');
    }
}; // fn_modalClose

/** 모달팝업 */
function fn_modalPopOpen(_this, _isFull, _hasDim){
    const modal = document.getElementById(_this);
    modal.classList.remove('modal-hidden');
    if (_isFull === true) {
        modal.classList.add('is-full');
    }
    if (_hasDim === false) {
        modal.classList.add('no-dim');
    }

    const modalButtons = modal.querySelectorAll('.button-box-medium button:not(.maintain-modal), .modal-close, .modal-close-text');
    modalButtons.forEach(function(modalButton){
        modalButton.addEventListener('click', function(){
            fn_modalPopClose(modal);
        });
    });
    
    windowScrollTopFix = window.scrollY;
    document.body.style.top = `-${windowScrollTopFix}px`;
    document.body.classList.add('is-fixed');
}
function fn_modalPopClose(_this){
    if ( typeof _this == 'string' ) {
        _this = document.getElementById(_this);
    }
    _this.classList.add('modal-hidden');

    document.body.style.removeProperty('top');
    document.body.classList.remove('is-fixed');
    window.scrollTo(0,windowScrollTopFix);
};

/** 팝오버 [작업중] */
function fn_popOver(_e,_message){
    console.log(_e);
    const posX = _e.target.offsetLeft + 'px';
    const posY = _e.target.offsetTop + 'px';
    const popoverHtml = document.createElement("div");
    popoverHtml.classList = "pop-popover";
    popoverHtml.style.position = "absolute";
    popoverHtml.style.top = posY;
    popoverHtml.style.left = posX;

    const pop = document.createElement("div");
    pop.classList = "popover";
    pop.setAttribute('tabindex', 0);
    const messege = document.createElement("p");
    messege.innerText = _message;
    const buttonClose = document.createElement('button');
    buttonClose.classList = 'popover-close';
    buttonClose.type = "button";
    buttonClose.innerText = '닫기';

    popoverHtml.appendChild(pop);
    pop.append(messege, buttonClose);

    document.querySelector('main.container').appendChild(popoverHtml);
    pop.focus();
    
    buttonClose.addEventListener('click', function(){
        fn_popOverClose();
    });
    
}
function fn_popOverClose(){
    const popoverHtml = document.querySelector('.pop-popover');
    popoverHtml.remove();
}; // fn_popOverClose

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
        slidesPerView: 3,
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

// 결제하기 상품정보 숨기기
function fn_marketPayItemFold(){
    const marketPay = document.querySelector('.pay-items');
    if (!marketPay) return false;
    
    const marketItemBtns = marketPay.querySelectorAll('.item-header button');
    marketItemBtns.forEach(function(marketItemBtn){
        marketItemBtn.addEventListener('click', function(){
            const isFold = marketItemBtn.classList.contains('icon-up');
            console.log(isFold);

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
    const slider = document.querySelector('.compare-slider');
    if (!slider) return false;

    const sliderTabBox = slider.previousElementSibling;
    const sliderTabLinks = sliderTabBox.querySelectorAll('a');
    const sliderTabs = sliderTabBox.querySelectorAll('li');
    const sliderPrev = slider.querySelector('.prev');
    const sliderNext = slider.querySelector('.next');
                
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
                currentIndex = swiper.activeIndex;
                swiper.el.previousElementSibling.querySelector('li.is-on').classList.remove('is-on');
                sliderTabs[currentIndex].classList.add('is-on');
                
            }
        }
    });
    const sliderPage = slider.querySelectorAll('.swiper-pagination > span');
    let currentIndex = 0;
    //  탭을 클릭했을때 슬라이드 이동
    sliderTabLinks.forEach(function(sliderTabLink){
        sliderTabLink.addEventListener('click', function(e){
            e.preventDefault;
            e.stopPropagation;
            for ( let i = 0; i < sliderTabs.length; i++ ) {
                if ( sliderTabs[i] == this.parentElement ) {
                    currentIndex = i;
                }
            }
            sliderPage[currentIndex].click();
        });
    });
    
    // 좌우 버튼 클릭했을때 슬라이드 이동
    sliderPrev.addEventListener('click touch', function(){
        if (!currentIndex) return false;
        sliderTabs[currentIndex].classList.remove('is-on');
        sliderTabs[currentIndex-1].classList.add('is-on');
        currentIndex--;
    });
    sliderNext.addEventListener('click touch', function(){
        console.log(currentIndex);
        if (currentIndex == sliderTabs.length-1) return false;
        sliderTabs[currentIndex].classList.remove('is-on');
        sliderTabs[currentIndex+1].classList.add('is-on');
        currentIndex++;
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
    const nav = document.querySelector('.analysis-nav');
    if (!nav) return false;

    const navMenus = nav.querySelectorAll('.area, .industry');
    navMenus.forEach(function(navMenu){
        const list = navMenu.nextElementSibling;
        navMenu.addEventListener('click', function(e){
            e.preventDefault();
            const current = this.parentElement;
            const currentClassName = 'is-current';
            const prev = current.parentElement.querySelector('.'+currentClassName);
            prev.classList.remove(currentClassName);
            current.classList.add(currentClassName);
            if ( windowWidth > 767 ) {
                list.classList.add('is-open');
            }
        });
        list.addEventListener('mouseleave', function(){
            if ( windowWidth > 767 ) {
                list.classList.remove('is-open');
            }
        });
    });
    
};
/** //상권분석 */

/** 로그인/회원가입 */
// 약관동의
function fn_agreeTerms(_id){
    if (!_id) { return false; }

    const nextButton = _id;
    const agreeBox = document.querySelector('.agree-box');
    const agreeAll = agreeBox.querySelector('.agree-all input');
    const terms = agreeBox.querySelectorAll('.agree-list >li > label >input');
    const optionalTerms = agreeBox.querySelectorAll('.agree-list >li.has-sub');
    const optionalTermsItems = agreeBox.querySelectorAll('.agree-list-sub input');
    let _optionalCheckedLength = 0;
    let _checkedLength = 0;

    // 선택약관
    for ( optionalTerm of optionalTerms ) {
        const optionalTermsTitle = optionalTerm.querySelector('& >label input');
        // 선택약관 타이틀

        optionalTermsTitle.addEventListener('click', function(){
            const _this = this;
            const _subTerms = _this.closest('.has-sub');
            const _thisTerms =_subTerms.querySelectorAll('.agree-list-sub input');
        
            for ( _thisTerm of _thisTerms ) {
                if ( _this.checked ) {
                    _optionalCheckedLength = _thisTerms.length;
                    _checkedLength + _thisTerms.length;
                } else {
                    _optionalCheckedLength = 0;
                    _checkedLength - _thisTerms.length;
                }
                _thisTerm.checked = _this.checked;
            }

            if ( _this.checked ) {
                _subTerms.classList.remove('is-unchecked');
            } else {
                _subTerms.classList.add('is-unchecked');
            }
            
        });

        // 선택약관 서브항목
        const _optionalTerms = optionalTerm.querySelectorAll('.agree-list-sub input');
        for ( _optionalTerm of _optionalTerms ) {
            _optionalTerm.addEventListener('click', function(){
                const _this = this;
                const _subTerms = _this.closest('.has-sub');
                const _thisTermsTitle = _subTerms.querySelector('& >label input');

                if ( _this.checked ) {
                    ++_optionalCheckedLength;
                } else {
                    --_optionalCheckedLength;
                }

                if ( _optionalCheckedLength > 0 ) {
                    _thisTermsTitle.checked = true;
                    _subTerms.classList.remove('is-unchecked');
                    if (_optionalCheckedLength === _optionalTerms.length) {
                        ++_checkedLength;
                    }
                } else {
                    _thisTermsTitle.checked = false;
                    _subTerms.classList.add('is-unchecked');
                    if (_optionalCheckedLength === 0) {
                        --_checkedLength;
                    }
                }

                if ( terms.length === _checkedLength ) {
                    agreeAll.checked = true;
                } else {
                    agreeAll.checked = false;
                }
                
            });
        }

        // 선택약관 약관보기
        // const optionalTermsLink = optionalTerm.querySelector('& > .agreement-open');
        // optionalTermsLink.addEventListener('click', function(){
        //     const _this = this;
        //     const _subTerms = _this.closest('.has-sub');
        //     _subTerms.classList.toggle('is-unchecked');
        // });
    }
    
    // 필수약관
    for ( term of terms ) {
        term.addEventListener('click', function(){
            let _this = this;
            if ( _this.checked ) {
                ++_checkedLength;
            } else {
                --_checkedLength;
                agreeAll.checked = _this.checked;
            }
            if ( terms.length === _checkedLength ) {
                agreeAll.checked = true;
            }
        });
    };

    // 전체동의
    agreeAll.addEventListener('click', function(){
        let _this = this;
        for ( term of terms ) {
            term.checked = _this.checked;
        };
        for (optionalTermsItem  of optionalTermsItems) {
            optionalTermsItem.checked = _this.checked;
        }

        if ( _this.checked ) {
            _checkedLength = terms.length;
            _optionalCheckedLength = optionalTermsItems.length;
            for(optionalTerm of optionalTerms) {
                optionalTerm.classList.remove('is-unchecked');
            }
        } else {
            _checkedLength = 0;
            _optionalCheckedLength = 0;
            for(optionalTerm of optionalTerms) {
                optionalTerm.classList.add('is-unchecked');
            }
        }
    });    
};
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
    btnFilter.style.display = 'none';

    // 모바일 사이즈일 때 header z-index 초기화
    if (window.innerWidth <= 768) {
      header.style.zIndex = 'auto';
      button.style.zIndex = '9';
    }
  });

  // 필터 닫기 버튼 클릭
  btnClose.addEventListener('click', function () {
    filterContent.style.display = 'none';
    btnFilter.style.display = 'block';

    // 모바일 사이즈일 때 header z-index 20으로 복원
    if (window.innerWidth <= 768) {
      header.style.zIndex = '20';
      button.style.zIndex = '99';
    }
  });
}

/** 아코디언 */
function fn_accordion() {
  const items = document.querySelectorAll('.page-polio .accordion-item');
  if (!items) { return false; }

  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const toggleText = header.querySelector('button');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      if (isActive) {
        // 이미 열려있으면 -> 닫기
        item.classList.remove('active');
        toggleText.textContent = '상세화면 열기';
      } else {
        // 다른 아이템 닫기
        items.forEach(i => {
          i.classList.remove('active');
          const textEl = i.querySelector('.accordion-header button');
          if (textEl) textEl.textContent = '상세화면 열기';
        });

        // 현재 클릭한 항목 열기
        item.classList.add('active');
        toggleText.textContent = '상세화면 닫기';
      }
    });
  });
};
/** //아코디언 */

