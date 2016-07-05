$(function () {

    
    initNav();
    initScene1();
    initScene2();
    

    // 顯示圖片載入狀況的進度
    

    // Scene 1: 圖片序列的動畫
    function initScene1 () {

        var
            // 圖片container與當中所有圖片的jQuery物件
            $container       = $('#scene-1 .image-sequence'),
            $images          = $container.find('img'),

            //圖片總數與目前顯示圖片的index
            frameLength      = $images.length,
            currentFrame     = 0,

            // 動畫執行中會用到的數值
            counter          = 0, // 動畫執行狀況的counter
            velocity         = 0, // 動畫的速度

            // 動畫的timer (初始為空)
            timer            = null,

            // 圖片畫面比例 (width / height)
            imageAspectRatio = 864 / 486;

        // container上觸發滑鼠滾輪事件後執行處理
        $container.on('mousewheel', function (event, delta) {
            // 對應滾輪方向計算速度
            if (delta < 0) {
                velocity += 1.5;
            } else if (delta > 0) {
                velocity -= 1.5;
            }
            // 呼叫動畫的開始函數
            startAnimation();
        });

        // 動畫的開始函數
        function startAnimation () {
            // 如果沒有執行的動畫，則執行動畫
            if (!timer) {
                // 每1/60 秒更新一次
                timer = setInterval(animateSequence, 1000 / 30);
            }
        }

        // 動畫的結束函數
        function stopAnimation () {
            clearInterval(timer);
            timer = null;
        }

        // 動畫函數
        function animateSequence () {

            // 下個顯示圖片的index
            var nextFrame;

            // 將速度乘上摩擦係數，讓每次呼叫的值越來越小
            velocity *= 0.9;

            // 檢驗速度，若值在0±0.00001的範圍則視為0並將其停止
            if (-0.00001 < velocity && velocity < 0.00001) {
                stopAnimation();
            } else {
                // 其他狀況則加總counter與velocity
                // カ並將counter的數值範圍限制在圖片數的範圍中
                counter = (counter + velocity) % frameLength;
            }

            // 將counter的數值取整數以表示該影格(frame)
            nextFrame = Math.floor(counter);
            if (currentFrame !== nextFrame) {
                $images.eq(nextFrame).show();
                $images.eq(currentFrame).hide();
                currentFrame = nextFrame;
            }
        }

        // 在container中維持圖片畫面比例並配置於整個顯示區域
        // 每次視窗大小有所改變則連動調整
        $(window).on('resize', function () {

            // 取得視窗寬度、高度
            var $window = $(this),
                windowWidth = $window.width(),
                windowHeight = $window.height();

            // 比較圖片與視窗的圖片畫面比例
            // 調整container的大小與位置
            if (imageAspectRatio > windowWidth / windowHeight) {
                $container.css({
                    width: windowHeight * imageAspectRatio,
                    height: '100%',
                    top: 0,
                    left: (windowWidth - windowHeight * imageAspectRatio) / 2
                });
            } else {
                $container.css({
                    width: '100%',
                    height: windowWidth / imageAspectRatio,
                    top: (windowHeight - windowWidth / imageAspectRatio) / 2,
                    left: 0
                });
            }
        });

        // 初始時觸發視窗resize事件以進行調整
        $(window).trigger('resize');
    }

    // 顯示Scene 2
    function initScene2 () {
        $('#scene-2-content').css({ right: '-50%' });
    }

    // Scene 2 (2): 圖形描繪
    function activateScene2 () {

        var $content = $('#scene-2-content'),
            $charts = $content.find('.chart');

        // 內容從右側出現顯示
        $content.stop(true).animate({
            right: 0
        }, 1200, 'easeInOutQuint');

        // 各圓的處理
        $charts.each(function(){
            var $chart = $(this),
                // 保存遮罩、設定角度為0
                $circleLeft = $chart.find('.left .circle-mask-inner')
                    .css({ transform: 'rotate(0)' }),
                $circleRight = $chart.find('.right .circle-mask-inner')
                    .css({ transform: 'rotate(0)' }),
                // 取得百分比
                $percentNumber = $chart.find('.percent-number'),
                percentData = $percentNumber.text();

            // 設定百分比顯示為0
            $percentNumber.text(0);

            // 角度的動畫
            $({ percent: 0 }).delay(1000).animate({ percent: percentData }, {
                duration: 1500, 
                progress: function () {
                    var now = this.percent,
                        deg = now * 360 / 100,
                        degRight = Math.min(Math.max(deg, 0), 180),
                        degLeft  = Math.min(Math.max(deg - 180, 0), 180);
                    $circleRight.css({ transform: 'rotate(' + degRight + 'deg)' });
                    $circleLeft.css({ transform: 'rotate(' + degLeft + 'deg)' });
                    $percentNumber.text(Math.floor(now));
                }
            });
        });
    }

    
    // 瀏覽列初始化
    function initNav () {

        var $pageMain = $("#page-main"),
            $nav = $('#nav'),
            $navItem = $nav.find('li'),
            currentScene = 0;

        updateNav();

        $nav.on('click', 'a', function (event) {
            event.preventDefault();
            var i = $(this).closest($navItem).index();
            if (i === currentScene) {
                return;
            }
            if (i === 1) {
                initScene2();
            }
            currentScene = i;
            $pageMain.
                stop(true).
                animate({ top: - 100 * i + '%' }, 1200, 'easeInOutQuint', function () {
                    if (i === 1) {
                        activateScene2(); // Scene 2 
                    } else {
                        initScene2();
                    }
                });
            updateNav();
        });

        function updateNav () {
            $navItem.
                removeClass('active').
                eq(currentScene).addClass('active');
        }

    }

     var duration = 300;

    // buttons2 ----------------------------------------
    $('#buttons2 button').each(function(index){
        //var pos = Math.random() * 80 - 40;
        var pos = index * 40 - 40;
        $(this).css('top', pos);
    })
    .on('mouseover', function(){
        var $btn = $(this).stop(true).animate({
            backgroundColor: '#faee00',
            color: '#000'
        }, duration);
        $btn.find('img:first-child').stop(true).animate({opacity: 0}, duration);
        $btn.find('img:nth-child(2)').stop(true).animate({opacity: 1}, duration);
    })
    .on('mouseout', function(){
        var $btn = $(this).stop(true).animate({
            backgroundColor: '#fff',
            color: '#01b169',
        }, duration);
        $btn.find('img:first-child').stop(true).animate({opacity: 1}, duration);
        $btn.find('img:nth-child(2)').stop(true).animate({opacity: 0}, duration);
    });


});
