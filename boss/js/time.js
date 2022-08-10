var timeJS = function () {
    /**
     * 显示 h m s 时间
     * */
    var showHmsTime = function (time) {
        var hmsTime = Math.floor(time / 3600) + 'h' +
            Math.floor((time % 3600) / 60) + 'm' +
            Math.floor((time % 3600) % 60) + 's';
        return hmsTime;
    };
    /**
     * 显示 m s 时间
     * */
    var showMsTime = function (time) {
        var msTime = Math.floor(time / 60) + 'm' +
            Math.floor(time % 60) + 's';
        return msTime;
    };
    /**
     * 获取当前日期 年 月 日
     * */
    var getNowDate = function () {
        var date = new Date();
        date.setDate(date.getDate());
        var time = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
        return time;
    };
    /**
     * 获取 y-m-d 时间1
     * */
    var getYmdTime = function (time) {
        var ymdTime = time.getFullYear() + '-' +
            ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1)) + '-' +
            (time.getDate() < 10 ? '0' + time.getDate() : time.getDate());
        return ymdTime;
    };
    /**
     * 获取 y-m-d 时间2
     * */var getTimeFormLocal = function (AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;//获取当前月份的日期
        var d = dd.getDate();
        return y + "-" + (m<10? '0'+m:m) + "-" + (d<10? '0'+d:d);
    };
    /**
     * 获取 y/m/d 时间3
     * */var getYmTwoTime = function (time) {
        var ymTwoTime = time.getFullYear() + '/' +
            ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1));
        return ymTwoTime;
    };
    /**
     * 获得 y.m.d 时间
     * */var getTimeStrFormLocal = function (AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;//获取当前月份的日期
        var d = dd.getDate();
        return y + "." + (m<10? '0'+m:m) + "." + (d<10? '0'+d:d);
    };
    /**
     * 获取 y-m-d h:m:s 时间
     * */var getTimeSecondFormLocal = function (timeStr) {
        var time = new Date(timeStr * 1000);
        var ymdTime = time.getFullYear() + '-' +
            ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1)) + '-' +
            (time.getDate() < 10 ? '0' + time.getDate() : time.getDate()) + '&nbsp;' +
            (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':' +
            (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' +
            (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds());
        return ymdTime;
    };
    /**
     * 获取 m-d h:m 时间
     * */
    var getMdhmTime = function (timeStr) {
        var time = new Date(timeStr * 1000);
        var mdhmTime = ((time.getMonth() + 1)) + '.' + time.getDate() + '&nbsp;' +
            (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':' +
            (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes());
        return mdhmTime;
    };
    /**
     * 获取 y.m 时间
     * */var getYmTime = function (timeStr) {
        var time = new Date(timeStr);
        var ymTime = time.getFullYear() + '.' +
            ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1));
        return ymTime;
    };
    /**
     * 获取 m.d 时间
     * */var getMdTime = function (timeStr) {
        var time = new Date(timeStr);
        var mdTime = (time.getMonth() + 1) + '.' + time.getDate();
        return mdTime;
    };
    return {
        /**
         * 显示 h m s 时间
         * */showHmsTime: function (time) {
            return showHmsTime(time);
        },
        /**
         * 显示 m s 时间
         * */showMsTime: function (time) {
            return showMsTime(time);
        },
        /**
         * 获取当前日期 年 月 日
         * */getNowDate: function () {
            return getNowDate();
        },
        /**
         * 获取 y-m-d 时间1
         * */getYmdTime: function (time) {
            return getYmdTime(time);
        },
        /**
         * 获取 y-m-d 时间2
         * */getTimeFormLocal: function (AddDayCount) {
            return getTimeFormLocal(AddDayCount);
        },
        /**
         * 获得 y.m.d 时间
         * */getTimeStrFormLocal: function (AddDayCount) {
            return getTimeStrFormLocal(AddDayCount);
        },
        /**
         * 获取 y-m-d h:m:s 时间
         * */getTimeSecondFormLocal: function (time) {
            return getTimeSecondFormLocal(time);
        },
        /**
         * 获取 m-d h:m 时间
         * */
        getMdhmTime: function (timeStr) {
            return getMdhmTime(timeStr);
        },
        /**
         * 获取 y-m 时间
         * */getYmTime: function (timeStr) {
            return getYmTime(timeStr);
        },
        /**
         * 获取 m-d 时间
         * */getMdTime: function (timeStr) {
            return getMdTime(timeStr);
        },
        /**
         * 获取 y/m/d 时间3
         * */getYmTwoTime: function (time) {
            return getYmTwoTime(time);
        },
    }

}();