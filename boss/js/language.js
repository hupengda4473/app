/**
 * Created by xwp on 2015/12/11.
 */
var Language = function () {
    var currency_zh = '$', currency_en = '$';
    var list = {};
    var refreshList = function () {
        list = {
            loading: ['正在努力加载中···', 'Loading···'],
            load: ['载入中···', 'Loading···'],
            netWrong: ['网络链接错误，请检查设置。', 'NO Internet Connection Error.'],
        };
    };
    refreshList();
    var inputList = {
        unit: ['单位', 'Unit'],
    };
    var NUMBER = 0;

    function setLanguage(language, obj) {
        var parentDom = $('body');
        if (obj && obj.length && obj.length > 0) {
            parentDom = obj;
        }
        parentDom.find('.language').each(function () {
            if ($(this).data('language')) {
                if (list[$(this).data('language')]) {
                    $(this).html(list[$(this).data('language')][language]);
                }
            }
        });
        parentDom.find('.languageI').each(function () {
            if ($(this).data('language')) {
                if (inputList[$(this).data('language')]) {
                    $(this).attr('placeholder', inputList[$(this).data('language')][language]);
                }
            }
        });
    }

    //get后台设置货币符号
    var getCurrencySymbol = function (fun, fun_) {
        if (OrderingSystem.getMoneySymbol) {
            var options = {};
            options.successFunction = function (data) {
                if (debug) {
                    console.log('get货币符号设置', data);
                }
                if (data.data[0] && data.data[0].value && data.data[0].value != 'default') {
                    currency_zh = data.data[0].value;
                    currency_en = data.data[0].value;
                }
                refreshList();
                if (fun) {
                    fun();
                }
            };
            options.errorFunction = fun_;
            OrderingSystem.getMoneySymbol(options);
        } else {
            if (fun) {
                fun();
            }
        }
    };
    return {
        Chinese: function () {
            setLanguage(0);
        },
        English: function () {
            setLanguage(1);
        },
        setLanguageDynamic: function (number) {
            NUMBER = number;
            localStorage.setItem('language', number);
            var backstage = (number == 0) ? 'zh' : 'en';
            setLanguage(NUMBER);//前端设置语言
            OrderingSystem.setLanguage(backstage);//后台设置语言
        },
        setLanguageInit: function (fun) {
            var array = ['zh', 'en'];
            if (localStorage.getItem('language')) {
                NUMBER = localStorage.getItem('language');
            }
            OrderingSystem.setLanguage(array[NUMBER]);
            setLanguage(NUMBER);
            if (fun) {
                fun()
            }
        },
        setLanguage: function (obj) {
            if (localStorage.getItem('language')) {
                NUMBER = localStorage.getItem('language');
            }
            setLanguage(NUMBER, obj);
        },
        /*删除语言设置*/deleteLanguage: function (obj) {
            obj.removeClass('language');
        },
        /*添加语言设置*/addLanguage: function (obj) {
            obj.addClass('language');
        },
        getCurrencySymbol: function (fun, fun_) {
            getCurrencySymbol(fun, fun_);
        }
    }
}();
