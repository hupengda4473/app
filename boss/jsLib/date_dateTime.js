/* 
 * 日期插件
 * 滑动选取日期（年，月，日）
 * V1.1
 */
(function ($) {
    $.fn.dateTime = function (options, Ycallback, Ncallback) {
        //插件默认选项
        var that = $(this).closest(".dateParent").find('.dateShow');
        var docType = $(this).is('input');
        var datetime = false;
        var onlyDate = false;
        var onlyTime = false;
        var nowdate = new Date();
        var indexY = 1, indexM = 1, indexD = 1;
        var indexH = 1, indexI = 1, indexS = 0;
        var initY = parseInt((nowdate.getFullYear() - 1800 + ""));
        var initM = parseInt(nowdate.getMonth() + "") + 1;
        var initD = parseInt(nowdate.getDate() + "");
        var initH = parseInt(nowdate.getHours());
        var initI = parseInt(nowdate.getMinutes());
        var initS = parseInt(nowdate.getYear());
        var yearScroll = null, monthScroll = null, dayScroll = null;
        var HourScroll = null, MinuteScroll = null, SecondScroll = null;
        $.fn.date.defaultOptions = {
            beginyear: 1800,                 //日期--年--份开始
            endyear: 2020,                   //日期--年--份结束
            beginmonth: 1,                   //日期--月--份结束
            endmonth: 12,                    //日期--月--份结束
            beginday: 1,                     //日期--日--份结束
            endday: 31,                      //日期--日--份结束
            beginhour: 0,
            endhour: 23,
            beginminute: 0,
            endminute: 59,
            beginsecond: 0,
            endsecond: 59,
            curdate: false,                   //打开日期是否定位到当前日期
            theme: "date",                    //控件样式（1：日期，2：日期+时间）
            mode: null,                       //操作模式（滑动模式）
            event: "click",                    //打开日期插件默认方式为点击后后弹出日期
            show: true,
            showFuture: true
        };
        //用户选项覆盖插件默认选项   
        var opts = $.extend(true, {}, $.fn.date.defaultOptions, options);
        if (opts.theme === "datetime") {
            datetime = true;
            $("#datemark_dateTime").show();
            $("#timemark_dateTime").show();
        } else if (opts.theme === "date") {
            onlyDate = true;
            $("#datemark_dateTime").show();
            $("#timemark_dateTime").hide();
        } else if (opts.theme === "time") {
            onlyTime = true;
            $("#datemark_dateTime").hide();
            $("#timemark_dateTime").show();
        }
        if (!opts.show) {
            that.unbind('click');
        }
        /*www.sucaijiayuan.com*/
        else {
            //绑定事件（默认事件为获取焦点）
            var click = false;
            that.closest(".dateParent").on('touchstart touchmove touchend', function (ev) {//给document添加点击事件代理
                switch (event.type) {
                    case 'touchstart':
                        click = false;
                        break;
                    case 'touchmove':
                        click = true;
                        break;
                    case 'touchend':
                        if (!click) {
                            if (opts.showFuture) {
                                var date = new Date();
                                opts.endyear = date.getFullYear();
                                opts.endmonth = date.getMonth() + 1;
                                opts.endday = date.getDate();
                            }
                            var getNowShowDate = function () {
                                var date = new Date();
                                var value = '';
                                if (docType) {
                                    value = $(ev.target).closest('.dateParent').find('.dateShow').val();
                                } else {
                                    value = $(ev.target).closest('.dateParent').find('.dateShow').html();
                                }
                                if (value != '未设置' && value != '选择提醒时间' && value != '') {
                                    var dateStr = value.split(' ');
                                    var dateArr = [];
                                    var timeArr = [];
                                    if (dateStr[0]) {
                                        if (dateStr[0].split('-')[1]) {
                                            dateArr = dateStr[0].split('-');
                                        }
                                        if (dateStr[0].split(':')[1]) {
                                            timeArr = dateStr[0].split(':');
                                        }
                                    }
                                    if (dateStr[1]) {
                                        timeArr = dateStr[1].split(':');
                                    }
                                    date = new Date(dateArr[0] || 0, (dateArr[1] - 1) || 0, dateArr[2] || 0, timeArr[0] || 0, timeArr[1] || 0);
                                }
                                return date
                            };
                            initY = parseInt((getNowShowDate().getFullYear() - 1800 + ""));
                            initM = parseInt(getNowShowDate().getMonth() + "") + 1;
                            initD = parseInt(getNowShowDate().getDate() + "");
                            initH = parseInt(getNowShowDate().getHours());
                            initI = parseInt(getNowShowDate().getMinutes());
                            createUL();      //动态生成控件显示的日期
                            init_iScrll();   //初始化iscrll
                            extendOptions(); //显示控件
                            that.blur();
                            showdatetime();
                            refreshDate();
                            refreshTime();
                            if (datetime) {
                                $('#datescroll_dateTime').show();
                                $('#datescroll_datetime_dateTime').show();
                            } else if (onlyDate) {
                                $('#datescroll_dateTime').show();
                                $('#datescroll_datetime_dateTime').hide();
                            } else if (onlyTime) {
                                $('#datescroll_dateTime').hide();
                                $('#datescroll_datetime_dateTime').show();
                            }
                            bindButton();
                        }
                        break;
                }
            });
        }
        function refreshDate() {
            yearScroll.refresh();
            monthScroll.refresh();
            dayScroll.refresh();

            resetInitDete();
            yearScroll.scrollTo(0, initY * 96, 100, true);
            monthScroll.scrollTo(0, initM * 96 - 96, 100, true);
            dayScroll.scrollTo(0, initD * 96 - 96, 100, true);
        }

        function refreshTime() {
            HourScroll.refresh();
            MinuteScroll.refresh();
            //SecondScroll.refresh();
            /*if(initH>11){    //判断当前时间是上午还是下午
             SecondScroll.scrollTo(0, initD*96 - 96, 100, true);   //显示“下午”
             initH=initH-12;
             }*/
            HourScroll.scrollTo(0, initH * 96, 100, true);
            MinuteScroll.scrollTo(0, initI * 96, 100, true);
            //SecondScroll.scrollTo(0, initI*96, 100, true);
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
            initY = parseInt(that.val().substr(0, 4) - 1800);
            initM = parseInt(that.val().substr(5, 2));
            initD = parseInt(that.val().substr(8, 2));
        }

        function bindButton() {
            resetIndex();
            var dateconfirmClick = false;
            $("#dateconfirm_dateTime").off('.dateconfirm').on('touchstart.dateconfirm touchmove.dateconfirm touchend.dateconfirm', function (ev) {//给document添加点击事件代理
                switch (event.type) {
                    case 'touchstart':
                        dateconfirmClick = false;
                        break;
                    case 'touchmove':
                        dateconfirmClick = true;
                        break;
                    case 'touchend':
                        if (!dateconfirmClick) {
                            var yearwrapper = $('#yearwrapper_dateTime');
                            var monthwrapper = $('#monthwrapper_dateTime');
                            var daywrapper = $('#daywrapper_dateTime');
                            var Hourwrapper = $('#Hourwrapper_dateTime');
                            var Minutewrapper = $('#Minutewrapper_dateTime');
                            var datestr = '';
                            if (datetime) {
                                /*if(Math.round(indexS)===1){//下午
                                 $("#Hourwrapper ul li:eq("+indexH+")").html(parseInt($("#Hourwrapper ul li:eq("+indexH+")").html().substr(0,$("#Hourwrapper ul li:eq("+indexH+")").html().length-1))+12)
                                 }else{
                                 $("#Hourwrapper ul li:eq("+indexH+")").html(parseInt($("#Hourwrapper ul li:eq("+indexH+")").html().substr(0,$("#Hourwrapper ul li:eq("+indexH+")").html().length-1)))
                                 }*/
                                datestr = yearwrapper.find("ul li:eq(" + indexY + ")").html().substr(0, yearwrapper.find("ul li:eq(" + indexY + ")").html().length) + "-" +
                                    monthwrapper.find("ul li:eq(" + indexM + ")").html().substr(0, monthwrapper.find("ul li:eq(" + indexM + ")").html().length) + "-" +
                                    daywrapper.find("ul li:eq(" + Math.round(indexD) + ")").html().substr(0, daywrapper.find("ul li:eq(" + Math.round(indexD) + ")").html().length);
                                datestr += " " + Hourwrapper.find("ul li:eq(" + indexH + ")").html().substr(0, Hourwrapper.find("ul li:eq(" + indexH + ")").html().length) + ":" +
                                    Minutewrapper.find("ul li:eq(" + indexI + ")").html().substr(0, Minutewrapper.find("ul li:eq(" + indexI + ")").html().length)/* + ":" +
                                 $("#Secondwrapper ul li:eq("+indexS+")").html().substr(0,$("#Secondwrapper ul li:eq("+indexS+")").html().length-1)*/;
                                indexS = 0;
                            } else if (onlyDate) {
                                datestr = yearwrapper.find("ul li:eq(" + indexY + ")").html().substr(0, yearwrapper.find("ul li:eq(" + indexY + ")").html().length) + "-" +
                                    monthwrapper.find("ul li:eq(" + indexM + ")").html().substr(0, monthwrapper.find("ul li:eq(" + indexM + ")").html().length) + "-" +
                                    daywrapper.find("ul li:eq(" + Math.round(indexD) + ")").html().substr(0, daywrapper.find("ul li:eq(" + Math.round(indexD) + ")").html().length);
                            } else if (onlyTime) {
                                datestr += " " + Hourwrapper.find("ul li:eq(" + indexH + ")").html().substr(0, Hourwrapper.find("ul li:eq(" + indexH + ")").html().length) + ":" +
                                    Minutewrapper.find("ul li:eq(" + indexI + ")").html().substr(0, Minutewrapper.find("ul li:eq(" + indexI + ")").html().length)/* + ":" +
                                 $("#Secondwrapper ul li:eq("+indexS+")").html().substr(0,$("#Secondwrapper ul li:eq("+indexS+")").html().length-1)*/;
                            }
                            if (Ycallback === undefined) {
                                if (docType) {
                                    that.val(datestr).trigger('input');
                                } else {
                                    that.html(datestr);
                                }
                                $("#datePage_dateTime").hide();
                                $("#dateshadow_dateTime").hide();
                            } else {
                                Ycallback(datestr, function () {
                                    $("#datePage_dateTime").hide();
                                    $("#dateshadow_dateTime").hide();
                                });
                            }
                        }
                        break;
                }
            });
            /*$("#dateconfirm").unbind('click').click(function () {
             var yearwrapper = $('#yearwrapper');
             var monthwrapper = $('#monthwrapper');
             var daywrapper = $('#daywrapper');
             var Hourwrapper = $('#Hourwrapper');
             var Minutewrapper = $('#Minutewrapper');
             var datestr = yearwrapper.find("ul li:eq(" + indexY + ")").html().substr(0, yearwrapper.find("ul li:eq(" + indexY + ")").html().length - 1) + "-" +
             monthwrapper.find("ul li:eq(" + indexM + ")").html().substr(0, monthwrapper.find("ul li:eq(" + indexM + ")").html().length - 1) + "-" +
             daywrapper.find("ul li:eq(" + Math.round(indexD) + ")").html().substr(0, daywrapper.find("ul li:eq(" + Math.round(indexD) + ")").html().length - 1);
             if (datetime) {
             /!*if(Math.round(indexS)===1){//下午
             $("#Hourwrapper ul li:eq("+indexH+")").html(parseInt($("#Hourwrapper ul li:eq("+indexH+")").html().substr(0,$("#Hourwrapper ul li:eq("+indexH+")").html().length-1))+12)
             }else{
             $("#Hourwrapper ul li:eq("+indexH+")").html(parseInt($("#Hourwrapper ul li:eq("+indexH+")").html().substr(0,$("#Hourwrapper ul li:eq("+indexH+")").html().length-1)))
             }*!/
             datestr += " " + Hourwrapper.find("ul li:eq(" + indexH + ")").html().substr(0, Hourwrapper.find("ul li:eq(" + indexH + ")").html().length - 1) + ":" +
             Minutewrapper.find("ul li:eq(" + indexI + ")").html().substr(0, Minutewrapper.find("ul li:eq(" + indexI + ")").html().length - 1)/!* + ":" +
             $("#Secondwrapper ul li:eq("+indexS+")").html().substr(0,$("#Secondwrapper ul li:eq("+indexS+")").html().length-1)*!/;
             indexS = 0;
             }
             if (Ycallback === undefined) {
             if (docType) {
             that.val(datestr);
             } else {
             that.html(datestr);
             }
             $("#datePage").hide();
             $("#dateshadow").hide();
             } else {
             Ycallback(datestr,function(){
             $("#datePage").hide();
             $("#dateshadow").hide();
             });
             }
             });*/

            //绑定事件（默认事件为获取焦点）
            var datecancleClick = false;
            $("#datecancle_dateTime").on('touchstart touchmove touchend', function (ev) {//给document添加点击事件代理
                switch (event.type) {
                    case 'touchstart':
                        datecancleClick = false;
                        break;
                    case 'touchmove':
                        datecancleClick = true;
                        break;
                    case 'touchend':
                        if (!datecancleClick) {
                            $("#datePage_dateTime").hide();
                            $("#dateshadow_dateTime").hide();
                        }
                        break;
                }
            });
            /*$("#datecancle").click(function () {
             $("#datePage").hide();
             $("#dateshadow").hide();
             //Ncallback(false);
             });*/
        }

        function extendOptions() {
            $("#datePage_dateTime").show();
            $("#dateshadow_dateTime").show();
        }

        //日期滑动
        function init_iScrll() {
            var yearwrapper = $('#yearwrapper_dateTime');
            var monthwrapper = $('#monthwrapper_dateTime');
            var daywrapper = $('#daywrapper_dateTime');
            //var strY = yearwrapper.find("ul li:eq(" + indexY + ")").html().substr(0, yearwrapper.find("ul li:eq(" + indexY + ")").html().length);
            //var strM = monthwrapper.find("ul li:eq(" + indexM + ")").html().substr(0, monthwrapper.find("ul li:eq(" + indexM + ")").html().length);
            yearScroll = new iScroll("yearwrapper_dateTime", {
                snap: "li", vScrollbar: false,
                onScrollEnd: function () {
                    var showYear = Math.round((this.y / 96) * (-1) + opts.beginyear);
                    indexY = Math.round((this.y / 96) * (-1) + 1);
                    if (opts.showFuture) {
                        opts.endmonth = checkMonths(showYear);
                        monthwrapper.find("ul").html(createMONTH_UL());
                        monthScroll.refresh();
                        indexM = Math.round((monthScroll.y / 96) * (-1) + 1);
                        opts.endday = checkdays(showYear, indexM);
                        daywrapper.find("ul").html(createDAY_UL());
                        dayScroll.refresh();
                    } else {
                        indexM = Math.round((monthScroll.y / 96) * (-1) + 1);
                        opts.endday = checkdays(showYear, indexM);
                        daywrapper.find("ul").html(createDAY_UL());
                        dayScroll.refresh();
                    }
                    /*indexY = (this.y / 96) * (-1) + 1;
                     opts.endday = checkdays(strY, strM);
                     $("#daywrapper_dateTime").find('ul').html(createDAY_UL());
                     dayScroll.refresh();*/
                }
            });
            monthScroll = new iScroll("monthwrapper_dateTime", {
                snap: "li", vScrollbar: false,
                onScrollEnd: function () {
                    var showYear = Math.round((yearScroll.y / 96) * (-1) + opts.beginyear);
                    if (opts.showFuture) {
                        indexY = Math.round((yearScroll.y / 96) * (-1) + 1);
                        indexM = Math.round((this.y / 96) * (-1) + 1);
                        opts.endday = checkdays(showYear, indexM);
                        daywrapper.find("ul").html(createDAY_UL());
                        dayScroll.refresh();
                    } else {
                        indexM = Math.round((this.y / 96) * (-1) + 1);
                        opts.endday = checkdays(showYear, indexM);
                        daywrapper.find("ul").html(createDAY_UL());
                        dayScroll.refresh();
                    }
                    /*indexM = (this.y / 96) * (-1) + 1;
                     opts.endday = checkdays(strY, strM);
                     $("#daywrapper_dateTime").find('ul').html(createDAY_UL());
                     dayScroll.refresh();*/
                }
            });
            dayScroll = new iScroll("daywrapper_dateTime", {
                snap: "li", vScrollbar: false,
                onScrollEnd: function () {
                    var aakdjlg = this;
                    setTimeout(function () {
                        indexD = Math.round((aakdjlg.y / 96) * (-1) + 1);
                    }, 50);
                    /*indexD = (this.y / 96) * (-1) + 1;*/
                }
            });
        }

        function showdatetime() {
            init_iScroll_datetime();
            addTimeStyle();
            $("#timemark_dateTime").show();
            $("#datescroll_datetime_dateTime").show();
            $("#Hourwrapper_dateTime").find('ul').html(createHOURS_UL());
            $("#Minutewrapper_dateTime").find('ul').html(createMINUTE_UL());
            //$("#Secondwrapper ul").html(createSECOND_UL());
        }

        //日期+时间滑动
        function init_iScroll_datetime() {
            HourScroll = new iScroll("Hourwrapper_dateTime", {
                snap: "li", vScrollbar: false,
                onScrollEnd: function () {
                    indexH = Math.round((this.y / 96) * (-1)) + 1;
                    HourScroll.refresh();
                }
            });
            MinuteScroll = new iScroll("Minutewrapper_dateTime", {
                snap: "li", vScrollbar: false,
                onScrollEnd: function () {
                    indexI = Math.round((this.y / 96) * (-1)) + 1;
                    HourScroll.refresh();
                }
            });
            /*SecondScroll = new iScroll("Secondwrapper",{snap:"li",vScrollbar:false,
             onScrollEnd:function () {
             indexS = Math.round((this.y/96)*(-1)) + 1;
             HourScroll.refresh();
             }})*/
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
            //return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();//获取当月最后一天日期
            if (opts.showFuture) {
                return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24) < new Date() ? new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate() : new Date().getDate());//获取当月最后一天日期
            } else {
                return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate());//获取当月最后一天日期
            }
        }

        function createUL() {
            CreateDateUI();
            $("#yearwrapper_dateTime").find('ul').html(createYEAR_UL());
            $("#monthwrapper_dateTime").find('ul').html(createMONTH_UL());
            $("#daywrapper_dateTime").find('ul').html(createDAY_UL());
        }

        function CreateDateUI() {
            var title = '<span class="language" data-language="Please_select_date">请选择日期</span>';
            if (opts.theme === 'date') {
                title = '<span class="language" data-language="Please_select_date">请选择日期</span>';
            } else if (opts.theme === 'time') {
                title = '<span class="language" data-language="Please_select_time">请选择时间</span>';
            } else if (opts.theme === 'datetime') {
                title = '<span class="language" data-language="Please_select_time">请选择时间</span>';
            }
            var str = '' +
                '<div id="dateshadow_dateTime"></div>' +
                '<div id="datePage_dateTime" class="page_dateTime">' +
                '<section>' +
                '<div id="datetitle_dateTime"><h1>' + title + '</h1></div>' +
                '<div id="datescroll_dateTime">' +
                '<div id="datemark_dateTime"><a id="markyear_dateTime"></a><a id="markmonth_dateTime"></a><a id="markday_dateTime"></a></div>' +
                '<div id="yearwrapper_dateTime">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="monthwrapper_dateTime">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="daywrapper_dateTime">' +
                '<ul></ul>' +
                '</div>' +
                '</div>' +
                '<div id="datescroll_datetime_dateTime">' +
                '<div id="timemark_dateTime"><a id="markhour_dateTime"></a><a id="markminut_dateTime"></a><a id="marksecond_dateTime"></a></div>' +
                '<div id="Hourwrapper_dateTime">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="Minutewrapper_dateTime">' +
                '<ul></ul>' +
                '</div>' +
                /*'<div id="Secondwrapper">'+
                 '<ul></ul>'+
                 '</div>'+*/
                '</div>' +
                '</section>' +
                '<footer id="dateFooter_dateTime">' +
                '<div id="setcancle_dateTime">' +
                '<ul>' +
                '<li id="dateconfirm_dateTime" class="language" data-language="yes">确定</li>' +
                '<li id="datecancle_dateTime" class="language" data-language="cancel">取消</li>' +
                '</ul>' +
                '</div>' +
                '</footer>' +
                '</div>';
            $("#datePlugin_dateTime").html('').append(str);
            Language.setLanguage();
        }

        function addTimeStyle() {
            var datePage = $('#datePage_dateTime');
            datePage.css("height", "auto");
            datePage.css("top", "112px");
            var yearwrapper = $('#yearwrapper_dateTime');
            yearwrapper.css("position", "absolute");
            yearwrapper.css("bottom", "0");
            var monthwrapper = $('#monthwrapper_dateTime');
            monthwrapper.css("position", "absolute");
            monthwrapper.css("bottom", "0");
            var daywrapper = $('#daywrapper_dateTime');
            daywrapper.css("position", "absolute");
            daywrapper.css("bottom", "0");
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
            $("#daywrapper_dateTime").find('ul').html("");
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
