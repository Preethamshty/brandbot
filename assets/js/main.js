/***************************************************
==================== JS INDEX ======================
****************************************************

01. PreLoader Js
02. Sidebar Navmenu Js
03. magnific Popupu Js
04. Add Attribute For Bg Image Js
05. about scroll rotate Js
06. odometer counter Js
07. Search Bar Js
08. Sticky Js
09. Offcanvas Sidebar js
10. Floating Progress js
11. knob progress js
12. Pricing js
13. interactive gallery imgae change js
14. Mouse Custom Cursor  js
****************************************************/


(function ($) {
    "use strict";


        ////////////////////////////////////////////////////
        // 01. PreLoader Js
        const isIOSDevice =
            /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

        const ensureVideoPreloader = () => {
            const preloader = document.querySelector(".preloader");
            if (!preloader) return null;

            const hasVideo = !!preloader.querySelector(".preloader-video");
            if (!hasVideo && !isIOSDevice) {
                preloader.innerHTML = `
                    <video class="preloader-video" autoplay muted playsinline preload="auto">
                        <source src="assets/videos/Loading_Page.mp4" type="video/mp4">
                    </video>
                `;
            }
            if (isIOSDevice) {
                preloader.style.background = "#000";
            }

            preloader.style.background = "#000";
            preloader.style.display = "flex";
            preloader.style.alignItems = "center";
            preloader.style.justifyContent = "center";
            preloader.style.opacity = "1";
            preloader.style.visibility = "visible";
            preloader.style.transition = "opacity 0.45s ease, visibility 0.45s ease";

            const preloaderVideo = preloader.querySelector(".preloader-video");
            if (preloaderVideo) {
                preloaderVideo.style.width = "100%";
                preloaderVideo.style.height = "100%";
                preloaderVideo.style.objectFit = "cover";
                preloaderVideo.style.display = "block";
                preloaderVideo.style.pointerEvents = "none";
            }

            return preloader;
        };

        const initVideoPreloader = () => {
            const preloader = ensureVideoPreloader();
            if (!preloader) return;
            const preloaderVideo = preloader.querySelector(".preloader-video");

            document.documentElement.classList.add("preloader-active");
            document.body.style.overflow = "hidden";

            let isPreloaderHidden = false;
            let pageLoaded = document.readyState === "complete";
            let videoCompleted = !preloaderVideo;

            const hidePreloader = () => {
                if (isPreloaderHidden) return;
                isPreloaderHidden = true;
                preloader.style.opacity = "0";
                preloader.style.visibility = "hidden";
                setTimeout(() => {
                    preloader.style.display = "none";
                    preloader.style.zIndex = "-1";
                    document.documentElement.classList.remove("preloader-active");
                    document.body.style.overflow = "";
                }, 500);
            };

            const tryHidePreloader = () => {
                if (pageLoaded && videoCompleted) {
                    hidePreloader();
                }
            };

            // iOS Safari shows a native play-button overlay on video elements even when
            // muted + playsinline + autoplay are set. pointer-events:none cannot suppress
            // it. Fix: on iOS, hide the video entirely and fade out on page load / hard cap.
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
            if (isIOS && preloaderVideo) {
                preloaderVideo.style.display = "none";
                preloaderVideo.pause();
                videoCompleted = true;
                if (!pageLoaded) {
                    window.addEventListener("load", () => {
                        pageLoaded = true;
                        hidePreloader();
                    }, { once: true });
                }
                setTimeout(() => { pageLoaded = true; videoCompleted = true; hidePreloader(); }, 3000);
                tryHidePreloader();
                return;
            }

            if (!pageLoaded) {
                window.addEventListener("load", () => {
                    pageLoaded = true;
                    tryHidePreloader();
                }, { once: true });
            }

            if (preloaderVideo) {
                preloaderVideo.muted = true;
                preloaderVideo.loop = false;
                preloaderVideo.currentTime = 0;

                preloaderVideo.addEventListener("ended", () => {
                    videoCompleted = true;
                    tryHidePreloader();
                }, { once: true });

                // Hide immediately if video fails to load (network error, missing file, codec).
                preloaderVideo.addEventListener("error", () => {
                    videoCompleted = true;
                    tryHidePreloader();
                }, { once: true });

                // Hide if video stalls for more than 3 s (slow connection, buffering stuck).
                preloaderVideo.addEventListener("stalled", () => {
                    setTimeout(() => {
                        if (!videoCompleted) {
                            videoCompleted = true;
                            tryHidePreloader();
                        }
                    }, 3000);
                }, { once: true });

                const playPromise = preloaderVideo.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(() => {
                        // If autoplay is blocked, don't block page access.
                        videoCompleted = true;
                        tryHidePreloader();
                    });
                }

                // iOS Safari sometimes resolves play() without actually playing (autoplay blocked
                // silently). Check 1.5 s after calling play() — if still paused, at time 0, or
                // not loaded enough, bail out immediately.
                setTimeout(() => {
                    if (!videoCompleted && (preloaderVideo.paused || preloaderVideo.readyState < 2 || preloaderVideo.currentTime === 0)) {
                        videoCompleted = true;
                        pageLoaded = true;
                        hidePreloader();
                    }
                }, 1500);

                // Hard cap: force-hide after 4 s no matter what — call hidePreloader() directly
                // so it cannot be blocked by pageLoaded being false (e.g. video download stalling
                // window "load" event on iOS).
                setTimeout(() => {
                    pageLoaded = true;
                    videoCompleted = true;
                    hidePreloader();
                }, 4000);
            }

            tryHidePreloader();
        };

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initVideoPreloader, { once: true });
        } else {
            initVideoPreloader();
        }

	////////////////////////////////////////////////////
	// 02. Sidebar Navmenu Js
    $(document).ready(function () {
        function toggleSubMenu() {
            if ($(".sidebar-navmenu").length) {
                $(".has-submenu")
                    .off("click")
                    .on("click", function () {
                        $(this)
                            .toggleClass("active")
                            .siblings(".has-submenu")
                            .removeClass("active")
                            .find(".nav-submenu")
                            .slideUp(300);
                        $(this).find(".nav-submenu").stop(true, true).slideToggle(300);
                    });
            } else {
                if ($(window).width() <= 991) {
                    $(".has-submenu")
                        .off("click")
                        .on("click", function () {
                            $(this)
                                .toggleClass("active")
                                .siblings(".has-submenu")
                                .removeClass("active")
                                .find(".nav-submenu")
                                .slideUp(300);
                            $(this).find(".nav-submenu").stop(true, true).slideToggle(300);
                        });
                } else {
                    $(".has-submenu").off("click");
                }
            }
        }
        toggleSubMenu();
        $(window).resize(function () {
            if (!$(".sidebar-navmenu").length) {
                toggleSubMenu();
            }
        });



        // ============== sidebar navmenu toggle button Js Start =======================
        $(".sidebar-navmenu-toggle-button").on("click", function () {
            $(".sidebar-navmenu").toggleClass("active");
            $(".body-overlay").addClass("apply");
        });

        $(".sidebar-navmenu-close-button, .body-overlay").on("click", function () {
            $(".sidebar-navmenu").removeClass("active");
            $(".body-overlay").removeClass("apply");
        });

        // ============== sidebar navmenu toggle button Js End =======================





        // ===================== Scroll Back to Top Js Start ======================
        function back_to_top() {
            var btn = $('#back_to_top');
            var btn_wrapper = $('.back-to-top-wrapper');
            // Detect scroll
            $(window).on('scroll', function () {
                if ($(this).scrollTop() > 300) {
                    btn_wrapper.addClass('back-to-top-btn-show');
                } else {
                    btn_wrapper.removeClass('back-to-top-btn-show');
                }
            });
            // Smooth scroll to top
            btn.on('click', function (e) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: 0
                }, 300);
            });
        }
        // Init
        back_to_top();

        // ===================== Scroll Back to Top Js End ======================

        // ========================== add active class to navbar menu current page Js Start =====================
        function dynamicActiveMenuClass(selector) {
            let FileName = window.location.pathname.split("/").reverse()[0];

            // If we are at the root path ("/" or no file name), keep the activePage class on the Home item
            if (FileName === "" || FileName === "index.html") {
                // Keep the activePage class on the Home link
                selector
                    .find("li.nav-menu__item.has-submenu")
                    .eq(0)
                    .addClass("activePage");
            } else {
                // Remove activePage class from all items first
                selector.find("li").removeClass("activePage");

                // Add activePage class to the correct li based on the current URL
                selector.find("li").each(function () {
                    let anchor = $(this).find("a");
                    if ($(anchor).attr("href") == FileName) {
                        $(this).addClass("activePage");
                    }
                });

                // If any li has activePage element, add class to its parent li
                selector.children("li").each(function () {
                    if ($(this).find(".activePage").length) {
                        $(this).addClass("activePage");
                    }
                });
            }
        }

        if ($("ul").length) {
            dynamicActiveMenuClass($("ul"));
        }
        // ========================== add active class to navbar menu current page Js End =====================

        // ========================== Settings Panel Js Start =====================
        $(".settings-button").on("click", function () {
            $(".settings-panel").toggleClass("active");
            $(this).toggleClass("active");
        });

        $(document).on(
            "click",
            ".settings-panel__buttons .settings-panel__button",
            function () {
                $(this).siblings().removeClass("active");
                $(this).addClass("active");
            }
        );

        // Cursor start
        $(".cursor-animate").on("click", function () {
            $("body").removeClass("remove-animate-cursor");
        });

        $(".cursor-default").on("click", function () {
            $("body").addClass("remove-animate-cursor");
        });
        // Cursor end

        // Direction start
        $(".direction-ltr").on("click", function () {
            $("html").attr("dir", "ltr");
        });

        $(".direction-rtl").on("click", function () {
            $("html").attr("dir", "rtl");
        });
        // Direction end
        // ========================== Settings Panel Js End =====================

        // ********************* Toast Notification Js start *********************
        function toastMessage(messageType, messageTitle, messageText, messageIcon) {
            let $toastContainer = $("#toast-container");

            let $toast = $("<div>", {
                class: `toast-message ${messageType}`,
                html: `
                <div class="toast-message__content">
                    <span class="toast-message__icon">
                    <i class="${messageIcon}"></i>
                    </span>
                    <div class="flex-grow-1">
                    <div class="d-flex align-items-start justify-content-between mb-1">
                        <h6 class="toast-message__title">${messageTitle}</h6>
                        <button type="button" class="toast-message__close">
                        <i class="ph-bold ph-x"></i>
                        </button>
                    </div>
                    <span class="toast-message__text">${messageText}</span>
                    </div>
                </div>
                <div class="progress__bar"></div>
                `,
            });

            $toastContainer.append($toast);

            setTimeout(() => {
                $toast.addClass("active");
            }, 50);

            let totalDuration = 3500;
            let startTime = Date.now();
            let remainingTime = totalDuration;
            let toastTimeout = setTimeout(hideToast, remainingTime);

            function hideToast() {
                $toast.removeClass("active");
                setTimeout(() => {
                    $toast.remove();
                }, 500);
            }

            // Remove Toast on Close Button Click
            $toast.find(".toast-message__close").on("click", function () {
                $toast.removeClass("active");
                setTimeout(() => {
                    $toast.remove();
                }, 500);
            });

            // Pause Timeout on Hover
            $toast.on("mouseenter", function () {
                remainingTime -= Date.now() - startTime;
                clearTimeout(toastTimeout);
            });

            // Resume Timeout on Mouse Leave
            $toast.on("mouseleave", function () {
                startTime = Date.now();
                toastTimeout = setTimeout(hideToast, remainingTime);
            });
        }
        // ********************* Toast Notification Js End *********************


        // ========================= Delete Item Js start ===================
        $(document).on("click", ".delete-button", function () {
            $(this).closest(".delete-item").addClass("d-none");

            toastMessage(
                "danger",
                "Deleted",
                "You deleted successfully!",
                "ph-bold ph-trash"
            );
        });
        // ========================= Delete Item Js End ===================

        // ========================= Form Submit Js Start ===================
        // Prevent placeholder forms from navigating to "#".
        $(document).on("submit", "form[action='#']", function (e) {
            e.preventDefault();
        });

        $(document).on("submit", ".form-submit", function (e) {
            const action = ($(this).attr("action") || "").trim();
            const shouldSubmitToServer = action !== "" && action !== "#";

            // Keep demo behavior only for placeholder forms.
            if (!shouldSubmitToServer) {
                e.preventDefault();
                $("input").val("");
                $("textarea").val("");
                toastMessage(
                    "success",
                    "Success",
                    "Form submitted successfully!",
                    "ph-fill ph-check-circle"
                );
            }
        });
        // ========================= Form Submit Js End ===================

        // ================== Password Show Hide Js Start ==========
        $(".toggle-password").on("click", function () {
            $(this).toggleClass("active");
            var input = $($(this).attr("id"));
            if (input.attr("type") == "password") {
                input.attr("type", "text");
                $(this).removeClass("ph-bold ph-eye-closed");
                $(this).addClass("ph-bold ph-eye");
            } else {
                input.attr("type", "password");
                $(this).addClass("ph-bold ph-eye-closed");
            }
        });
        // ========================= Password Show Hide Js End ===========================

        // ========================= AOS Js Start ===========================
        AOS.init({
            once: true,
            disable: isIOSDevice,
        });
        // ========================= AOS Js End ===========================

    });



    ////////////////////////////////////////////////////
	// 03. magnific Popupu Js
    $('.open-popup').magnificPopup({
        type: 'iframe',
        removalDelay: 300,
        mainClass: 'mfp-fade',
    });



    ////////////////////////////////////////////////////
	// 04. Add Attribute For Bg Image Js
    $(".bg-img").each(function () {
        var img = $(this).data("background-image");
        if (img) {
            $(this).css("background-image", "url('" + img + "')");
        }
    });


    ////////////////////////////////////////////////////
	// 05. about scroll rotate Js
    let reloadClassName = document.getElementById("reload");
    const headerElement = document.querySelector(".header");

    if (isIOSDevice) {
        document.querySelectorAll(".mouseCursor").forEach((cursorEl) => {
            cursorEl.style.display = "none";
        });
    }

    if (reloadClassName !== null || headerElement !== null) {
        let scrollTicking = false;

        function updateScrollEffects() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (reloadClassName !== null) {
                reloadClassName.style.transform = `rotate(${scrollTop / 6}deg)`;
            }

            if (headerElement !== null) {
                headerElement.classList.toggle("fixed-header", scrollTop >= 260);
            }

            scrollTicking = false;
        }

        window.addEventListener(
            "scroll",
            function () {
                if (!scrollTicking) {
                    scrollTicking = true;
                    window.requestAnimationFrame(updateScrollEffects);
                }
            },
            { passive: true }
        );
    }


    ////////////////////////////////////////////////////
	// 06. odometer counter Js
    if ($(".odometer").length > 0) {
        $(".odometer").waypoint(
            function () {
                var odo = $(".odometer");
                odo.each(function () {
                    var countNumber = $(this).attr("data-count");
                    $(this).html(countNumber);
                });
            }, {
                offset: "80%",
                triggerOnce: true,
            }
        );
    }


    ////////////////////////////////////////////////////
	// 07. Search Bar Js
    $(".open-search").on("click", function () {
        $(".search_popup").addClass("search-opened");
        $(".search-popup-overlay").addClass("search-popup-overlay-open");
    });
    $(".search_close_btn").on("click", function () {
        $(".search_popup").removeClass("search-opened");
        $(".search-popup-overlay").removeClass("search-popup-overlay-open");
    });
    $(".search-popup-overlay").on("click", function () {
        $(".search_popup").removeClass("search-opened");
        $(this).removeClass("search-popup-overlay-open");
    });



    ////////////////////////////////////////////////////
	// 08. Sticky Js
    if (!isIOSDevice) {
        $(window).on("scroll", function () {
            if ($(window).scrollTop() >= 260) {
                $(".header").addClass("fixed-header");
            } else {
                $(".header").removeClass("fixed-header");
            }
        });
    }


    ////////////////////////////////////////////////////
	// 08. Sticky Js for iOS
    if (isIOSDevice) {
        const iosHeader = document.querySelector('.header');
        let iosScrollTicking = false;

        function updateIosStickyHeader() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (iosHeader) {
                iosHeader.classList.toggle('fixed-header', scrollTop >= 260);
            }
            iosScrollTicking = false;
        }

        window.addEventListener(
            'scroll',
            function () {
                if (!iosScrollTicking) {
                    iosScrollTicking = true;
                    window.requestAnimationFrame(updateIosStickyHeader);
                }
            },
            { passive: true }
        );
    }


    ////////////////////////////////////////////////////
	// 09. Offcanvas Sidebar js
    $(".tw-menu-bar").on("click", function () {
        $(".twoffcanvas").addClass("opened");
        $(".body-overlay").addClass("apply");
    });
    $(".close-btn").on("click", function () {
        $(".twoffcanvas").removeClass("opened");
        $(".body-overlay").removeClass("apply");
    });
    $(".body-overlay").on("click", function () {
        $(".twoffcanvas").removeClass("opened");
        $(".body-overlay").removeClass("apply");
    });



    ////////////////////////////////////////////////////
	// 10. Floating Progress js
    const progressContainers = document.querySelectorAll('.progress-container');
    function setPercentage(progressContainer) {
        const percentage = progressContainer.getAttribute('data-percentage') + '%';
        const progressEl = progressContainer.querySelector('.progress');
        const percentageEl = progressContainer.querySelector('.percentage');
        progressEl.style.width = percentage;
        percentageEl.innerText = percentage;
        percentageEl.style.insetInlineStart = percentage;
    }
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressContainer = entry.target;
                setPercentage(progressContainer);
                progressContainer.querySelector('.progress').classList.remove('active');
                progressContainer.querySelector('.percentage').classList.remove('active');
                observer.unobserve(progressContainer);
            }
        });
    }, {
        threshold: 0.5
    });
    progressContainers.forEach(progressContainer => {
        observer.observe(progressContainer);
    });



    ////////////////////////////////////////////////////
	// 11. knob progress js
    if (typeof ($.fn.knob) !== 'undefined') {
        $('.knob').each(function () {
            var $this = $(this);
            var knobVal = $this.attr('data-rel');

            $this.knob({
                'draw': function () {
                    $(this.i).val(this.cv + '%');
                }
            });
            gsap.fromTo($({
                val: 0
            }), {
                val: 0
            }, {
                val: knobVal,
                duration: 2,
                ease: "power1.out",
                scrollTrigger: {
                    trigger: $this,
                    start: "top 80%",
                    once: true,
                },
                onUpdate: function () {
                    $this.val(Math.ceil(this.targets()[0].val)).trigger('change');
                }
            });
        });
    }


    ////////////////////////////////////////////////////
	// 12. Pricing js
    function tabtable_active() {
        var e = document.getElementById("filt-monthly"),
            d = document.getElementById("filt-yearly"),
            t = document.getElementById("switcher"),
            m = document.getElementById("monthly"),
            y = document.getElementById("hourly");

        e.addEventListener("click", function () {
            t.checked = false;
            e.classList.add("pricing-ip-active");
            d.classList.remove("pricing-ip-active");
            m.classList.remove("hide");
            y.classList.add("hide");
        });
        d.addEventListener("click", function () {
            t.checked = true;
            d.classList.add("pricing-ip-active");
            e.classList.remove("pricing-ip-active");
            m.classList.add("hide");
            y.classList.remove("hide");
        });
        t.addEventListener("click", function () {
            d.classList.toggle("pricing-ip-active");
            e.classList.toggle("pricing-ip-active");
            m.classList.toggle("hide");
            y.classList.toggle("hide");
        })
    }
    if ($('#filt-monthly').length > 0) {
        tabtable_active();
    }



    ////////////////////////////////////////////////////
	// 13. interactive gallery imgae change js
    $('.interactive-gallery-list-wrap .interactive-gallery-list-item').on("mouseenter", function () {
        $('#interactive-gallery-thumb').removeClass().addClass($(this).attr('rel'));
        $(this).addClass('active').siblings().removeClass('active');
    });





    ////////////////////////////////////////////////////
	// 14. Mouse Custom Cursor  js
    function itCursor() {
        var myCursor = jQuery(".mouseCursor");
        if (myCursor.length) {
            if ($("body")) {
                const e = document.querySelector(".cursor-inner"),
                    t = document.querySelector(".cursor-outer");
                let n,
                    i = 0,
                    o = !1;
                (window.onmousemove = function (s) {
                    o ||
                        (t.style.transform =
                            "translate(" + s.clientX + "px, " + s.clientY + "px)"),
                        (e.style.transform =
                            "translate(" + s.clientX + "px, " + s.clientY + "px)"),
                        (n = s.clientY),
                        (i = s.clientX);
                }),
                $("body").on("mouseenter", "button, a, .cursor-pointer", function () {
                        e.classList.add("active"), t.classList.add("active");
                    }),
                    $("body").on("mouseleave", "button, a, .cursor-pointer", function () {
                        ($(this).is("a", "button") &&
                            $(this).closest(".cursor-pointer").length) ||
                        (e.classList.remove("active"),
                            t.classList.remove("active"));
                    }),
                    (e.style.visibility = "visible"),
                    (t.style.visibility = "visible");
            }
        }
    }

    if (!isIOSDevice) {
        itCursor();
        $(".tw-cursor-point-area").on("mouseenter", function () {
            $(".mouseCursor").addClass("cursor-big");
        });
        $(".tw-cursor-point-area").on("mouseleave", function () {
            $(".mouseCursor").removeClass("cursor-big");
        });
    } else {
        $(".mouseCursor").css("display", "none");
    }

})(jQuery);