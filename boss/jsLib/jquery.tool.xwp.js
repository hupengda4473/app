/**
 * Created by XieWeiPing on 2017/8/31.
 * Edit by XieWeiPing on 2018/6/11.
 */
var privateToolsJS = function () {
    var _array = function () {
        /**
         * 数组排序（针对对象中的某个键）（一层）
         * */
        var arrayJsonSortFromSmallToBig_first = function (array, name) {
            function creatJsonSort(key) {
                return function (object1, object2) {
                    var value1 = null;
                    var value2 = null;
                    if (parseInt(object1[key])) {
                        value1 = parseInt(object1[key]);
                    }
                    if (parseInt(object2[key])) {
                        value2 = parseInt(object2[key]);
                    }
                    if (value1 < value2) {
                        return -1;
                    } else if (value1 > value2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            }

            array.sort(creatJsonSort(name));
        };
        /**
         * 数组排序（针对对象中的某个键）（两层）
         * */
        var arrayJsonSortFromSmallToBig_second = function (array, name1, name2) {
            function creatJsonSort(key1, key2) {
                return function (object1, object2) {
                    var value1 = null;
                    var value2 = null;
                    if (parseInt(object1[key1][key2])) {
                        value1 = parseInt(object1[key1][key2]);
                    }
                    if (parseInt(object2[key1][key2])) {
                        value2 = parseInt(object2[key1][key2]);
                    }
                    if (value1 < value2) {
                        return -1;
                    } else if (value1 > value2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            }

            array.sort(creatJsonSort(name1, name2));
        };
        return {
            /**
             * 数组排序（针对对象中的某个键）
             * */
            arrayJsonSortFromSmallToBig_first: function (array, key) {
                arrayJsonSortFromSmallToBig_first(array, key);
            },
            /**
             * 数组排序（针对对象中的某个键）（两层）
             * */
            arrayJsonSortFromSmallToBig_second: function (array, key1, key2) {
                arrayJsonSortFromSmallToBig_second(array, key1, key2);
            }
        }
    }();
    var _time = function () {
        /**
         * 获得完整时间字符串
         * */
        var getFullTimeStr = function (sec) {
            var date = new Date(sec);
            return date.getFullYear() + '-' +
                ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' +
                (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' +
                (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' +
                (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        };
        /**
         * 获得日期字符串
         * */
        var getDateStr = function (sec) {
            var date = new Date(sec);
            return date.getFullYear() + '-' +
                ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' +
                (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        };
        /**
         * 获得日期字符串(2018-03-19 12:59:59)
         * */
        var getDate = function (timeStr) {
            var arr = timeStr.split(/[- :]/);
            var date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
            return date.getTime();
        };
        return {
            /**
             * 获得完整时间字符串
             * */
            getFullTimeStr: function (date) {
                return getFullTimeStr(date);
            },
            getDateStr: function (date) {
                return getDateStr(date);
            },
            getDate: function (timeStr) {
                return getDate(timeStr);
            }
        }
    }();
    return {
        array: _array,
        time: _time
    }
}();