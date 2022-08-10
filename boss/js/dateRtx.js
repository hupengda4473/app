/* 
 * 日期插件
 * 滑动选取日期（年，月，日）
 * V1.1
 */
(function ($) {
    $.fn.dateRtx = function (options, Ycallback, Ncallback) {
        //插件默认选项
        var that = $(this);
        var docType = $(this).is('input');
        var datetime = false;
        var nowdate = new Date();
        var indexY = 1, indexM = 1, indexD = 1;
        var indexH = 1, indexI = 1, indexS = 0;
        var yearScroll = null, monthScroll = null, dayScroll = null;
        var HourScroll = null, MinuteScroll = null, SecondScroll = null;
        $.fn.dateRtx.defaultOptions = {
            beginyear: 2000,                 //日期--年--份开始
            endyear: 2020,                   //日期--年--份结束
            beginmonth: 1,                   //日期--月--份结束
            endmonth: 12,                    //日期--月--份结束
            beginday: 1,                     //日期--日--份结束
            endday: 31,                      //日期--日--份结束
            beginhour: 2000,
            endhour: 2020,
            beginminute: 1,
            endminute: 12,
            beginsecond: 1,
            endsecond: 31,
            curdate: false,                   //打开日期是否定位到当前日期
            theme: "date",                    //控件样式（1：日期，2：日期+时间）
            mode: null,                       //操作模式（滑动模式）
            event: "click",                    //打开日期插件默认方式为点击后后弹出日期
            show: true,
            showFuture: true
        };
        //用户选项覆盖插件默认选项
        var opts = $.extend(true, {}, $.fn.dateRtx.defaultOptions, options);
        var initY = parseInt((nowdate.getFullYear() - opts.beginyear));
        var initM = parseInt(nowdate.getMonth() + "") + 1;
        var initD = parseInt(nowdate.getDate() + "");
        //var initH = parseInt(nowdate.getHours());
        var initH = parseInt((nowdate.getYear() + "").substr(1, 2));
        //var initI = parseInt(nowdate.getMinutes());
        var initI = parseInt(nowdate.getMonth() + "") + 1 + 1;
        //var initS = parseInt(nowdate.getYear());
        var initS = parseInt(nowdate.getDate() + "") + 1;
        if (opts.theme === "datetime") {
            datetime = true;
        }
        if (!opts.show) {
            that.unbind('click');
        }
        /*www.sucaijiayuan.com*/
        else {
            //绑定事件（默认事件为获取焦点）
            that.bind(opts.event, function () {
                if (opts.showFuture) {
                    var date = new Date();
                    opts.endyear = date.getFullYear();
                    opts.endmonth = date.getMonth() + 1;
                    opts.endday = date.getDate();
                }
                if (that.data('start')) {
                    var startTimeStr = that.data('start');
                    var endTimeStr = that.data('end');
                    initY = parseInt(startTimeStr.split('-')[0].substr(1, 3));
                    //initM = parseInt(startTimeStr.split('-')[1]);
                    initM = parseInt(endTimeStr.split('-')[0]);
                    initD = parseInt(startTimeStr.split('-')[2]);
                }
                if (that.data('end')) {
                    var endTimeStr = that.data('end');
                    initH = parseInt(endTimeStr.split('-')[0].substr(1, 3));
                    initI = parseInt(endTimeStr.split('-')[1]);
                    initS = parseInt(endTimeStr.split('-')[2]);
                }

                createUL();      //动态生成控件显示的日期
                init_iScrll();   //初始化iscrll
                extendOptions(); //显示控件
                that.blur();
                if (datetime) {
                    showdatetime();
                    // refreshTime();
                }
                refreshDate();
                bindButton();
            })
        }
        function refreshDate() {
            yearScroll.refresh();
            monthScroll.refresh();
            // dayScroll.refresh();

            resetInitDete();
            yearScroll.scrollTo(0, initY * 96, 100, true);
            monthScroll.scrollTo(0, initM * 96 - 96, 100, true);
            // dayScroll.scrollTo(0, initD * 96 - 96, 100, true);
        }

        function refreshTime() {
            HourScroll.refresh();
            MinuteScroll.refresh();
            SecondScroll.refresh();
            /*if(initH>11){    //判断当前时间是上午还是下午
             SecondScroll.scrollTo(0, initD*96 - 96, 100, true);   //显示“下午”
             initH=initH-12;
             }*/
            HourScroll.scrollTo(0, initH * 96, 100, true);
            MinuteScroll.scrollTo(0, initI * 96 - 96, 100, true);
            SecondScroll.scrollTo(0, initS * 96 - 96, 100, true);
            initH = parseInt(nowdate.getHours());
        }

        function resetIndex() {
            indexY = 1;
            indexM = 1;
            indexD = 1;
        }

        function resetInitDete() {
            if (opts.curdate) {
                return false;
            }
            else if (that.val() === "") {
                return false;
            }
            initY = parseInt(that.val().substr(2, 2));
            initM = parseInt(that.val().substr(5, 2));
            initD = parseInt(that.val().substr(8, 2));
        }

        function bindButton() {
            resetIndex();
            $("#dateconfirm").unbind('click').click(function () {
                var yearwrapper = $('#datescrollRtx').find('#yearwrapper');
                var monthwrapper = $('#datescrollRtx').find('#monthwrapper');
                var daywrapper = $('#daywrapper');
                var Hourwrapper = $('#Hourwrapper');
                var Minutewrapper = $('#Minutewrapper');
                var Secondwrapper = $('#Secondwrapper');
                /*var datestr = yearwrapper.find("ul li:eq(" + indexY + ")").html().substr(0, yearwrapper.find("ul li:eq(" + indexY + ")").html().length - 1) + "-" +
                 monthwrapper.find("ul li:eq(" + indexM + ")").html().substr(0, monthwrapper.find("ul li:eq(" + indexM + ")").html().length - 1) + "-" +
                 daywrapper.find("ul li:eq(" + Math.round(indexD) + ")").html().substr(0, daywrapper.find("ul li:eq(" + Math.round(indexD) + ")").html().length - 1);*/
                var datestr = yearwrapper.find("ul li:eq(" + indexY + ")").html().substr(0, yearwrapper.find("ul li:eq(" + indexY + ")").html().length) + "-" +
                    monthwrapper.find("ul li:eq(" + indexM + ")").html().substr(0, monthwrapper.find("ul li:eq(" + indexM + ")").html().length);
                /*if (datetime) {
                 /!*if(Math.round(indexS)===1){//下午
                 $("#Hourwrapper ul li:eq("+indexH+")").html(parseInt($("#Hourwrapper ul li:eq("+indexH+")").html().substr(0,$("#Hourwrapper ul li:eq("+indexH+")").html().length-1))+12)
                 }else{
                 $("#Hourwrapper ul li:eq("+indexH+")").html(parseInt($("#Hourwrapper ul li:eq("+indexH+")").html().substr(0,$("#Hourwrapper ul li:eq("+indexH+")").html().length-1)))
                 }*!/
                 datestr += " " + Hourwrapper.find("ul li:eq(" + indexH + ")").html().substr(0, Hourwrapper.find("ul li:eq(" + indexH + ")").html().length - 1) + "-" +
                 Minutewrapper.find("ul li:eq(" + indexI + ")").html().substr(0, Minutewrapper.find("ul li:eq(" + indexI + ")").html().length - 1) + "-" +
                 Secondwrapper.find("ul li:eq("+indexS+")").html().substr(0,Secondwrapper.find("ul li:eq("+indexS+")").html().length-1);
                 indexS = 0;
                 console.log('datestr2',datestr);

                 }*/

                if (Ycallback === undefined) {
                    if (docType) {
                        that.val(datestr);
                    } else {
                        that.html(datestr);
                    }
                } else {
                    Ycallback(datestr);
                }
                $("#datePage").hide();
                $("#dateshadow").hide();
            });
            $("#datecancle").click(function () {
                $("#datePage").hide();
                $("#dateshadow").hide();
                if (Ncallback) {
                    Ncallback();
                }
            });
        }

        function extendOptions() {
            $("#datePage").show();
            $("#dateshadow").show();
        }

        //日期滑动
        function init_iScrll() {
            var yearwrapper = $('#datescrollRtx').find('#yearwrapper');
            var monthwrapper = $('#datescrollRtx').find('#monthwrapper');
            // var daywrapper = $('#daywrapper');
            yearScroll = new iScroll("yearwrapper", {
                snap: "li", vScrollbar: false,
                onScrollEnd: function () {
                    var showYear = Math.round((this.y / 96) * (-1) + opts.beginyear);
                    if (opts.showFuture) {
                        indexY = Math.round((this.y / 96) * (-1) + 1);
                        opts.endmonth = checkMonths(showYear);
                        monthwrapper.find("ul").html(createMONTH_UL());
                        monthScroll.refresh();
                        indexM = Math.round((monthScroll.y / 96) * (-1) + 1);
                        opts.endday = checkdays(showYear, indexM);
                        /*daywrapper.find("ul").html(createDAY_UL());
                         dayScroll.refresh();*/
                    } else {
                        indexM = Math.round((monthScroll.y / 96) * (-1) + 1);
                        opts.endday = checkdays(showYear, indexM);
                        /*daywrapper.find("ul").html(createDAY_UL());
                         dayScroll.refresh();*/
                    }
                }
            });
            monthScroll = new iScroll("monthwrapper", {
                snap: "li", vScrollbar: false,
                onScrollEnd: function () {
                    var showYear = Math.round((yearScroll.y / 96) * (-1) + opts.beginyear);
                    if (opts.showFuture) {
                        indexY = Math.round((yearScroll.y / 96) * (-1) + 1);
                        indexM = Math.round((this.y / 96) * (-1) + 1);
                        opts.endday = checkdays(showYear, indexM);
                        /*daywrapper.find("ul").html(createDAY_UL());
                         dayScroll.refresh();*/
                    } else {
                        indexM = Math.round((this.y / 96) * (-1) + 1);
                        opts.endday = checkdays(showYear, indexM);
                        /*daywrapper.find("ul").html(createDAY_UL());
                         dayScroll.refresh();*/
                    }
                }
            });
            /*dayScroll = new iScroll("daywrapper", {
             snap: "li", vScrollbar: false,
             onScrollEnd: function () {
             indexD = (this.y / 96) * (-1) + 1;
             }
             });*/
        }

        function showdatetime() {
            addTimeStyle();
            $("#datescroll_datetime").show();
            // $("#Hourwrapper").find('ul').html(createHOURS_UL());
            // $("#Minutewrapper").find('ul').html(createMINUTE_UL());
            // $('#Secondwrapper').find("ul").html(createSECOND_UL());
            // init_iScroll_datetime();
        }

        //日期+时间滑动
        function init_iScroll_datetime() {
            var Hourwrapper = $('#Hourwrapper');
            var Minutewrapper = $('#Minutewrapper');
            var Secondwrapper = $('#Secondwrapper');
            HourScroll = new iScroll("Hourwrapper", {
                snap: "li", vScrollbar: false,
                onScrollEnd: function () {
                    indexH = Math.round((this.y / 96) * (-1)) + 1;
                    var strH = Hourwrapper.find("ul li:eq(" + indexH + ")").html().substr(0, Hourwrapper.find("ul li:eq(" + indexH + ")").html().length);
                    var strI = Minutewrapper.find("ul li:eq(" + indexI + ")").html().substr(0, Minutewrapper.find("ul li:eq(" + indexI + ")").html().length);
                    opts.endsecond = checkdays(strH, strI);
                    Secondwrapper.find("ul").html(createSECOND_UL());
                    SecondScroll.refresh();
                }
            });
            MinuteScroll = new iScroll("Minutewrapper", {
                snap: "li", vScrollbar: false,
                onScrollEnd: function () {
                    indexI = Math.round((this.y / 96) * (-1)) + 1;
                    var strH = Hourwrapper.find("ul li:eq(" + indexH + ")").html().substr(0, Hourwrapper.find("ul li:eq(" + indexH + ")").html().length);
                    var strI = Minutewrapper.find("ul li:eq(" + indexI + ")").html().substr(0, Minutewrapper.find("ul li:eq(" + indexI + ")").html().length);
                    opts.endsecond = checkdays(strH, strI);
                    Secondwrapper.find("ul").html(createSECOND_UL());
                    SecondScroll.refresh();
                }
            });
            SecondScroll = new iScroll("Secondwrapper", {
                snap: "li", vScrollbar: false,
                onScrollEnd: function () {
                    indexS = Math.round((this.y / 96) * (-1)) + 1;
                }
            })
        }

        function checkMonths(year) {
            var new_year = ++year;    //取当前的年份
            var new_date = new Date(new_year, 0, 1);                //取当年中的第一月

            return (new Date(new_date.setMonth(new_date.getMonth() - 1)) < new Date() ? (new_date.getMonth() + 1) : (new Date().getMonth() + 1));//获取当月最后一月的月份
        }

        function checkdays(year, month) {
            var new_year = year;    //取当前的年份
            var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
            if (month > 12)            //如果当前大于12月，则年份转到下一年
            {
                new_month -= 12;        //月份减
                new_year++;            //年份增
            }
            var new_date = new Date(new_year, new_month, 1);                //取当年当月中的第一天
            return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();//获取当月最后一天日期
        }

        function createUL() {
            CreateDateUI();
            $('#datescrollRtx').find("#yearwrapper").find('ul').html(createYEAR_UL());
            $('#datescrollRtx').find("#monthwrapper").find('ul').html(createMONTH_UL());
            $('#datescrollRtx').find("#daywrapper").find('ul').html(createDAY_UL());
        }

        function CreateDateUI() {
            var str = '' +
                '<div id="dateshadow"></div>' +
                '<div id="datePage" class="page">' +
                '<section>' +
                '<div id="datetitle"><h1 class="language" data-language="Please_select_date">请选择日期</h1></div>' +
                '<div id="datemark"><a id="markyear"></a><a id="markmonth"></a><a id="markday"></a></div>' +
                // '<div id="timemark"><a id="markhour"></a><a id="markminut"></a><a id="marksecond"></a></div>' +
                '<div id="datescrollRtx">' +
                '<div id="yearwrapper" style="height:288px">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="monthwrapper" style="height:288px">' +
                '<ul></ul>' +
                '</div>' +
                // '<div id="daywrapper">' +
                // '<ul></ul>' +
                // '</div>' +
                '</div>' +
                /*'<div id="datescroll_datetime">' +
                 '<div id="Hourwrapper">' +
                 '<ul></ul>' +
                 '</div>' +
                 '<div id="Minutewrapper">' +
                 '<ul></ul>' +
                 '</div>' +
                 '<div id="Secondwrapper">' +
                 '<ul></ul>' +
                 '</div>' +
                 '</div>' +*/
                '</section>' +
                '<footer id="dateFooter">' +
                '<div id="setcancle">' +
                '<ul>' +
                '<li id="dateconfirm" class="language" data-language="yes">确定</li>' +
                '<li id="datecancle" class="language" data-language="cancel">取消</li>' +
                '</ul>' +
                '</div>' +
                '</footer>' +
                '</div>';
                var datePlugin = $('#datePlugin');
            datePlugin.html('').append($(str));
            Language.setLanguage(datePlugin);
        }

        function addTimeStyle() {
            var datePage = $('#datePage');
            // datePage.css("height", "818px");
            datePage.css("height", "720px");
            datePage.css("top", "112px");
            var yearwrapper = $('#datescrollRtx').find('#yearwrapper');
            yearwrapper.css("position", "absolute");
            yearwrapper.css("bottom", "423px");
            // yearwrapper.css("bottom", "135px");
            var monthwrapper = $('#datescrollRtx').find('#monthwrapper');
            monthwrapper.css("position", "absolute");
            monthwrapper.css("bottom", "423px");
            // monthwrapper.css("bottom", "135px");
            // var daywrapper = $('#datescrollRtx').find('#daywrapper');
            // daywrapper.css("position", "absolute");
            // daywrapper.css("bottom", "423px");
            // daywrapper.css("bottom", "135px");
        }

        //创建 --年-- 列表
        function createYEAR_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginyear; i <= opts.endyear; i++) {
                str += '<li>' + i + '</li>'
            }
            return str + "<li>&nbsp;</li>";
        }

        //创建 --月-- 列表
        function createMONTH_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginmonth; i <= opts.endmonth; i++) {
                if (i < 10) {
                    i = "0" + i
                }
                str += '<li>' + i + '</li>'
            }
            return str + "<li>&nbsp;</li>";
        }

        //创建 --日-- 列表
        function createDAY_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginday; i <= opts.endday; i++) {
                if (i < 10) {
                    i = "0" + i
                }
                str += '<li>' + i + '</li>'
            }
            return str + "<li>&nbsp;</li>";
        }

        //创建 --时-- 列表
        function createHOURS_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginhour; i <= opts.endhour; i++) {
                if (i < 10) {
                    i = "0" + i
                }
                str += '<li>' + i + '</li>'
            }
            return str + "<li>&nbsp;</li>";
        }

        //创建 --分-- 列表
        function createMINUTE_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginminute; i <= opts.endminute; i++) {
                if (i < 10) {
                    i = "0" + i
                }
                str += '<li>' + i + '</li>'
            }
            return str + "<li>&nbsp;</li>";
        }

        //创建 --秒-- 列表
        function createSECOND_UL() {
            /*var str="<li>&nbsp;</li>";
             str+="<li>上午</li><li>下午</li>"
             return str+"<li>&nbsp;</li>";;*/
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginsecond; i <= opts.endsecond; i++) {
                if (i < 10) {
                    i = "0" + i
                }
                str += '<li>' + i + '</li>'
            }
            return str + "<li>&nbsp;</li>";
        }
    }
})(jQuery);  
