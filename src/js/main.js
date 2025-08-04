let windowWidth;
let windowHeight;
let aside;
window.addEventListener('load', function(){
    windowWidth = this.innerWidth;
    windowHeight = this.innerHeight;
    aside = document.querySelector('.aside');
    console.log('loaded');
    /** 기본 로드될 함수 */
    ui_glassBg();
    fn_iptClear();
    fn_iptIsFocus();
    fn_passwordMask();
    fn_tabs();
    fn_fileInput();
    fn_aside();
    fn_selectbox();

    fn_marketSlider();
    fn_insightSlider();
}); // end window.onload

window.addEventListener('scroll', function(){
    windowWidth = this.innerWidth;
    windowHeight = this.innerHeight;
});
window.addEventListener('resize', function(){
    windowWidth = this.innerWidth;
    windowHeight = this.innerHeight;
    fn_aside();
});

function fn_aside(){
    if (windowHeight < 650 && innerWidth > 1023) {
        aside.classList.add('fixed');
    } else {
        aside.classList.remove('fixed');
    }
}

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

// 데이터마켓 슬라이드
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

// AI인사이트 슬라이드
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

/** 데이터파트너 */

/** 상권분석 페이지 */
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
    const targetElements = document.querySelectorAll('.detail-list .card');
    btn.addEventListener('click', function(){
        targetElements.forEach(function(targetElement){
            targetElement.classList.toggle('to-back');
        });
    });
};

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
/** //상권분석 페이지 */


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


function fn_inputBoxFoceseIn(e){
    let box = e.closest('.input-box');
    box.classList.toggle('is-focusin');
}
function fn_inputBoxFocesOut(e){
    let box = e.closest('.input-box');
    box.classList.toggle('is-focusin');
}

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

                if (tab.classList.contains('is-static')) return false;

                const currentTabId = _this.getAttribute('href');
                const currentTabContentId = currentTabId.substr(1);
                const currentTabContent = document.getElementById(currentTabContentId);
                
                const prevTabId = prev.firstChild.getAttribute('href');
                const prevTabContentId = prevTabId.substr(1);
                const prevTabContent = document.getElementById(prevTabContentId);
                if ( !currentTabContent || !prevTabContent) {
                    return false;
                } else {
                    prevTabContent.style.display = 'none';
                    prevTabContent.tabindex = '-1';
                    currentTabContent.style.display = 'block';
                    currentTabContent.tabindex = '0';
                }
            });
        }
    });
};

/** 백그라운드 적용 */
function ui_glassBg(){
    const filepath = this.location.pathname;
    const filename = filepath.substring(filepath.lastIndexOf('/') + 1).split(".")[0];
    const glassBgPages = ["UT01", "UT01M"];
    for ( glassBgPage of glassBgPages ) {
        if (filename == glassBgPage) {
            const body = document.getElementsByTagName('body')[0];
            body.classList.add('has-glassbg');
            const bodyBg = document.createElement('div');
            bodyBg.id = 'bg';
            document.body.appendChild(bodyBg);

            // const bgData = document.createElement('script');
            // bgData.type = "module";
            // bgData.src = "../images/bg_gradient.js";
            // document.body.appendChild(bgData);

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
};

/** 인풋값 삭제 */
function fn_iptClear(){
    const iptClear = document.querySelectorAll('.ipt-clear');
    if (!iptClear.length) return false;
    // console.log(iptClear.length);

    iptClear.forEach(function(btn){
        btn.addEventListener('click', function(e){
            let input = e.target.closest('.util-box').previousElementSibling;
            input.value = "";
            input.focus();
        })
    });
};

/** 약관동의 */
function fn_agreeTerms(_id){
    if (!_id) { return false; }

    const nextButton = _id;
    const agreeBox = document.querySelector('.agree-box');
    const agreeAll = agreeBox.querySelector('.agree-all input');
    const terms = agreeBox.querySelectorAll('.agree-list >li:not(.has-sub) input');
    const optionalTerms = agreeBox.querySelectorAll('.agree-list >li.has-sub');
    let _requiredCheckedLength = 0;
    // 선택약관
    for ( optionalTerm of optionalTerms ) {
        let _optionalCheckedLength = 0;
        const optionalTermsTitle = optionalTerm.querySelector('& >label input');

        // 선택약관 타이틀
        optionalTermsTitle.addEventListener('click', function(){
            const _this = this;
            const _subTerms = _this.closest('.has-sub');
            const _thisTerms =_subTerms.querySelectorAll('.agree-list-sub input');

            for ( _thisTerm of _thisTerms ) {
                if ( _this.checked ) {
                    _optionalCheckedLength = _thisTerms.length;
                } else {
                    _optionalCheckedLength = 0;
                }
                _thisTerm.checked = _this.checked;
            }

            if ( _this.checked ) {
                _subTerms.classList.remove('is-unchecked');
            } else {
                _subTerms.classList.add('is-unchecked');
            }
            
        });
        const optionalTermsLink = optionalTerm.querySelector('& > .agreement-open');
        optionalTermsLink.addEventListener('click', function(){
            // optionalTermsTitle.click();
            const _this = this;
            const _subTerms = _this.closest('.has-sub');
            _subTerms.classList.toggle('is-unchecked');
        });

        // 선택약관 서브항목
        const _optionalTerms = optionalTerm.querySelectorAll('.agree-list-sub input');
        for ( _optionalTerm of _optionalTerms ) {
            _optionalTerm.addEventListener('click', function(){
                const _this = this;
                const _subTerms = _this.closest('.has-sub');
                const _thisTermsTitle = _subTerms.querySelector('& >label input');
                _optionalCheckedLength = _this.checked ? ++_optionalCheckedLength : --_optionalCheckedLength;

                if ( _optionalCheckedLength > 0 ) {
                    _thisTermsTitle.checked = true;
                    _subTerms.classList.remove('is-unchecked');
                } else {
                    _thisTermsTitle.checked = false;
                    _subTerms.classList.add('is-unchecked');
                }
            });
        }
    }
    
    // 필수약관
    for ( term of terms ) {
        term.addEventListener('click', function(){
            let _this = this;
            if ( _this.checked ) {
                ++_requiredCheckedLength;
            } else {
                --_requiredCheckedLength;
                agreeAll.checked = _this.checked;
            }
            
            if ( terms.length === _requiredCheckedLength ) {
                agreeAll.checked = true;
                nextButton.disabled = false;
            } else {
                nextButton.disabled = true;
            }
        });
    };

    // 전체동의
    agreeAll.addEventListener('click', function(){
        let _this = this;
        for ( term of terms ) {
            term.checked = _this.checked;
        };
        _requiredCheckedLength = _this.checked ? terms.length : 0;
        
        for ( optionalTerm of optionalTerms ) {
            const optionalTermsTitle = optionalTerm.querySelector('& >label input');
            if ( _this.checked !== optionalTermsTitle.checked ) {
                optionalTermsTitle.click();
            }
        }

        if ( _this.checked ) {
            nextButton.disabled = false;
        } else {
            nextButton.disabled = true;
        }
    });    
};

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
let windowScrollTopFix;
function fn_modalPopOpen(_this){
    const modal = document.getElementById(_this);
    modal.classList.remove('modal-hidden');

    const modalButtons = modal.querySelectorAll('.button-box-medium button, .modal-close');
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


function fn_toast(_message, _type){
    const toast = document.createElement("div");
    toast.classList.add('toast-message');
    const message = document.createElement('p');
    message.innerText = _message;
    toast.append(message);

    document.body.appendChild(toast);

    if (_type === 1) {
        message.classList.add('pass');
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