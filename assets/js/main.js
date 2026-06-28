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
            preloader.style.transition = "opacity 0.9s ease, visibility 0.9s ease";

            const preloaderVideo = preloader.querySelector(".preloader-video");
            if (preloaderVideo) {
                preloaderVideo.style.width = "100%";
                preloaderVideo.style.height = "100%";
                preloaderVideo.style.objectFit = "cover";
                preloaderVideo.style.display = "block";
                preloaderVideo.style.pointerEvents = "none";
            }

            let fallback = preloader.querySelector('.preloader-fallback');
            if (!fallback) {
                fallback = document.createElement('div');
                fallback.className = 'preloader-fallback';
                fallback.style.display = 'none';
                fallback.style.pointerEvents = 'none';
                fallback.innerHTML = '<img src="assets/images/logo/logo.png" alt="logo" />';
                preloader.appendChild(fallback);
            }

            // Create a stronger image-based preloader (used on iOS/when video fails)
            let imgPre = preloader.querySelector('.preloader-image');
            if (!imgPre) {
                imgPre = document.createElement('div');
                imgPre.className = 'preloader-image';
                imgPre.style.display = 'none';
                imgPre.style.pointerEvents = 'none';
                // We'll try multiple candidate logo files (handles case-sensitive deploys)
                imgPre.innerHTML = '<img src="assets/images/logo/logo.png" alt="logo" />';
                preloader.appendChild(imgPre);
            }
            // set up image retry logic to handle missing files on production (case-sensitivity)
            try {
                const imgEl = imgPre.querySelector('img');
                const candidates = [
                    'assets/images/logo/logo.png',
                    'assets/images/logo/logo-two.png',
                    'assets/images/logo/logo-four.png',
                    'assets/images/logo/footer-logo.png'
                ];
                imgEl.dataset.candidateIndex = imgEl.dataset.candidateIndex || 0;
                imgEl.onerror = function () {
                    try {
                        const idx = Number(imgEl.dataset.candidateIndex) + 1;
                        if (idx < candidates.length) {
                            imgEl.dataset.candidateIndex = idx;
                            imgEl.src = candidates[idx];
                            reportPreloaderIssue('logo not found, trying ' + candidates[idx]);
                        } else {
                            reportPreloaderIssue('all logo candidates failed to load');
                        }
                    } catch (e) { console.warn(e); }
                };
                imgEl.onload = function () {
                    reportPreloaderIssue('logo loaded: ' + (imgEl.src || '').split('/').pop());
                };
            } catch (e) { /* ignore */ }

            return preloader;
        };

        const initVideoPreloader = () => {
            const preloader = ensureVideoPreloader();
            if (!preloader) return;
            const preloaderVideo = preloader.querySelector(".preloader-video");

            // Debug helper: show a brief overlay and console message when preloader issues occur
            const reportPreloaderIssue = (message) => {
                try {
                    console.warn('Preloader:', message);
                    let dbg = document.querySelector('.preloader-debug');
                    if (!dbg) {
                        dbg = document.createElement('div');
                        dbg.className = 'preloader-debug';
                        dbg.style.position = 'fixed';
                        dbg.style.left = '12px';
                        dbg.style.bottom = '12px';
                        dbg.style.zIndex = '99999';
                        dbg.style.padding = '8px 12px';
                        dbg.style.background = 'rgba(0,0,0,0.7)';
                        dbg.style.color = '#fff';
                        dbg.style.fontSize = '12px';
                        dbg.style.borderRadius = '6px';
                        dbg.style.maxWidth = '60vw';
                        dbg.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';
                        dbg.style.opacity = '0';
                        dbg.style.transition = 'opacity 0.35s ease';
                        document.body.appendChild(dbg);
                    }
                    dbg.textContent = message;
                    dbg.style.opacity = '1';
                    setTimeout(() => { try { dbg.style.opacity = '0'; } catch (e) {} }, 5000);
                } catch (e) { /* ignore */ }
            };

            document.documentElement.classList.add("preloader-active");
            document.body.style.overflow = "hidden";

            // Ensure the preloader remains visible for a short, minimum duration
            const MIN_PRELOADER_MS = 1800; // minimum time to show preloader (ms)
            let preloaderShownAt = performance.now();

            let isPreloaderHidden = false;
            let pageLoaded = document.readyState === "complete";
            let videoCompleted = !preloaderVideo;

            let hidePreloader = () => {
                if (isPreloaderHidden) return;
                const elapsed = performance.now() - preloaderShownAt;
                if (elapsed < MIN_PRELOADER_MS) {
                    // schedule to hide after minimum display time
                    setTimeout(hidePreloader, Math.ceil(MIN_PRELOADER_MS - elapsed));
                    return;
                }
                isPreloaderHidden = true;
                preloader.style.opacity = "0";
                preloader.style.visibility = "hidden";
                setTimeout(() => {
                    preloader.style.display = "none";
                    preloader.style.zIndex = "-1";
                    document.documentElement.classList.remove("preloader-active");
                    document.body.style.overflow = "";
                }, 700);
            };

            const tryHidePreloader = () => {
                if (pageLoaded && videoCompleted) {
                    hidePreloader();
                }
            };

            if (isIOSDevice && preloaderVideo) {
                // Ensure inline playback hints are present
                preloaderVideo.setAttribute('playsinline', '');
                preloaderVideo.setAttribute('webkit-playsinline', '');
                preloaderVideo.setAttribute('muted', '');
                preloaderVideo.muted = true;
                preloaderVideo.loop = true;
                preloaderVideo.style.opacity = '1';
                preloaderVideo.style.position = 'absolute';
                preloaderVideo.style.top = '0';
                preloaderVideo.style.left = '0';
                preloaderVideo.style.width = '100%';
                preloaderVideo.style.height = '100%';
                preloaderVideo.style.objectFit = 'cover';
                preloaderVideo.style.pointerEvents = 'none';

                // Create canvas overlay to draw first frame (works around native overlays on some iOS models)
                const canvasClass = 'preloader-fallback-canvas';
                let canvas = preloader.querySelector('.' + canvasClass);
                if (!canvas) {
                    canvas = document.createElement('canvas');
                    canvas.className = canvasClass;
                    canvas.style.display = 'none';
                    canvas.style.opacity = '0';
                    canvas.style.transition = 'opacity 0.6s ease';
                    canvas.style.width = 'min(80vw, 420px)';
                    canvas.style.height = 'auto';
                    canvas.style.maxHeight = '100vh';
                    canvas.style.zIndex = 11;
                    preloader.appendChild(canvas);
                }

                const ctx = canvas.getContext && canvas.getContext('2d');

                // image fallback element (already created by ensureVideoPreloader)
                const fallback = preloader.querySelector('.preloader-fallback');
                // stable image preloader element for iOS/production
                const imgPreEl = preloader.querySelector('.preloader-image');

                // Try to play and draw a frame — if drawing succeeds we show canvas, otherwise show image fallback
                const tryDrawOnce = () => {
                    if (!ctx) return false;
                    try {
                        const rect = preloader.getBoundingClientRect();
                        const dpr = window.devicePixelRatio || 1;
                        const w = Math.max(1, Math.floor(Math.min(rect.width, window.innerWidth) * dpr));
                        const h = Math.max(1, Math.floor(Math.min(rect.height, window.innerHeight) * dpr));
                        canvas.width = w;
                        canvas.height = h;
                        ctx.drawImage(preloaderVideo, 0, 0, w, h);
                        // sample a pixel to ensure video frame drew
                        const data = ctx.getImageData(Math.floor(w / 2), Math.floor(h / 2), 1, 1).data;
                        const visible = (data[0] + data[1] + data[2] + data[3]) > 0;
                        if (visible) {
                            canvas.style.display = 'block';
                            // fade in canvas
                            setTimeout(() => { try { canvas.style.opacity = '1'; } catch(e){} }, 20);
                            if (fallback) {
                                fallback.style.opacity = '0';
                                // hide fallback after fade
                                setTimeout(() => { try { fallback.style.display = 'none'; } catch(e){} }, 220);
                            }
                            videoCompleted = true;
                            tryHidePreloader();
                            return true;
                        }
                    } catch (e) {
                        // drawing may throw if video not allowed; ignore
                    }
                    return false;
                };

                // Attempt to play and draw after short delay
                const playPromise = preloaderVideo.play();
                // Give video a bit more time to present animation before falling back
                const scheduleTry = () => {
                    setTimeout(() => {
                                if (!tryDrawOnce()) {
                                    // If drawing failed, show stable image preloader instead of the video/fallback
                                    if (imgPreEl) {
                                        imgPreEl.style.display = 'flex';
                                        imgPreEl.style.opacity = '0';
                                        imgPreEl.style.transition = 'opacity 0.6s ease, transform 0.7s ease';
                                        setTimeout(() => { try { imgPreEl.style.opacity = '1'; imgPreEl.style.transform = 'scale(1)'; } catch(e){} }, 20);
                                    }
                                    reportPreloaderIssue('canvas draw failed; showing image preloader');
                                    videoCompleted = true;
                                    tryHidePreloader();
                                }
                    }, 1000);
                };

                if (playPromise && typeof playPromise.then === 'function') {
                    playPromise.then(() => scheduleTry()).catch((err) => {
                        // Autoplay blocked or play() failed — show stable image preloader instead
                        reportPreloaderIssue('video.play() rejected: ' + (err && err.message ? err.message : String(err)));
                        if (imgPreEl) {
                            imgPreEl.style.display = 'flex';
                            imgPreEl.style.opacity = '0';
                            imgPreEl.style.transition = 'opacity 0.6s ease, transform 0.7s ease';
                            setTimeout(() => { try { imgPreEl.style.opacity = '1'; imgPreEl.style.transform = 'scale(1)'; } catch(e){} }, 20);
                        }
                        videoCompleted = true;
                        tryHidePreloader();
                    });
                } else {
                    scheduleTry();
                }
            }

            if (!pageLoaded) {
                window.addEventListener("load", () => {
                    pageLoaded = true;
                    tryHidePreloader();
                }, { once: true });
            }

            if (preloaderVideo) {
                preloaderVideo.muted = true;
                if (!isIOSDevice) {
                    preloaderVideo.loop = false;
                }
                preloaderVideo.currentTime = 0;

                if (!isIOSDevice) {
                    preloaderVideo.addEventListener("ended", () => {
                        videoCompleted = true;
                        tryHidePreloader();
                    }, { once: true });
                }

                // Hide immediately if video fails to load (network error, missing file, codec).
                preloaderVideo.addEventListener("error", () => {
                    reportPreloaderIssue('video element error event (network/codec)');
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