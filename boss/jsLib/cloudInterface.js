/**
 * Created by IntelliJ IDEA.
 * User: GuoDapeng
 * Date: 15/7/18
 * Time: 下午7:27
 */

//必须引用下面的文件
//"/intern/jQuery/jquery-2.1.1.js",
//"/intern/jQuery/jquery.json.js",
//"/intern/jQuery/jquery.ajaxRequest.js"

var cloudSystem = function () {
    //获得url中参数的方法
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r   = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    function in_array(needle, haystack) {
        var i = 0, n = haystack.length;

        for (; i < n; ++i)
            if (haystack[i] === needle)
                return true;

        return false;
    }

    var schema  = getQueryString("schema");
    var webTest = !in_array(schema, ["cordova", "electron"]);//web调试

    var ip = "www.ochifan.com";
    if (webTest) {
        ip = document.domain;
    }

    //  URL 请求地址
    var home = "http://" + ip + "/product/";
    var domainName = "http://ch.ochifan.com/product/server/"; //用于微信分享的链接，要用域名
    var path = "Wind/php/index.php";
    var url  = home + path;

    var homeStorageKey = "cloudSystemUrlHome";

    function info() {
        //URL 请求地址
        var homeStr = localStorage.getItem(homeStorageKey);
        if (homeStr) {
            home = homeStr;
            url  = home + path;
        } else {
            home = "http://www.ochifan.com/product/";
            url  = home + path;
        }
    }

    info();

    /**
     * 发送请求
     */
    var request = function (out, successFunction, errorFunction, completeFunction) {
        // url = 'http://cs.ochifan.com/product/Wind/php/index.php';
        var request = new AjaxRequest(url, JSON.stringify(out), function (data, textStatus) {
            if (data.error) {
                console.error("server logic error:", data, "caused by:", out);
            }
            successFunction(data, textStatus);
        }, function (XMLHttpRequest, textStatus, errorThrown) {
            if (typeof errorFunction === "undefined") {
                console.error("AjaxRequestError:", "XMLHttpRequest:", XMLHttpRequest, "textStatus:", textStatus, "errorThrown:", errorThrown);
            } else {
                errorFunction(XMLHttpRequest, textStatus, errorThrown);
            }
        }, function (XMLHttpRequest, textStatus) {
            if (typeof completeFunction === "undefined") {
                console.info("AjaxRequestComplete:", "XMLHttpRequest:", XMLHttpRequest, "textStatus:", textStatus);
            } else {
                completeFunction(XMLHttpRequest, textStatus);
            }
        });
        request.doAjax();
    };

    // /**
    //  * 上传文件
    //  */
    // var ajaxFileUpload = function (id, successFunction, errorFunction) {
    //     $.ajaxFileUpload
    //     (
    //         {
    //             url          : url + "?controller=file&action=setImage",
    //             secureuri    : false,
    //             fileElementId: id,
    //             dataType     : "json",//echo 一定是json字符串
    //             beforeSend   : function () {
    //                 $("#loading").show();
    //             },
    //             complete     : function () {
    //                 $("#loading").hide();
    //             },
    //             success      : successFunction,
    //             error        : function (XMLHttpRequest, textStatus) {
    //                 if (typeof errorFunction === "undefined") {
    //
    //                 } else {
    //                     errorFunction(data, status, e);
    //                 }
    //             }
    //         }
    //     );
    //     return false;
    // };

    /**
     * 接口方法
     */
    return {
        /**
         * 设置 HomePath
         * @param urlValue
         */
        setHomePath: function (urlValue) {
            localStorage.setItem(homeStorageKey, urlValue);
            info();
            return true;
        },

        /**
         * 读 HomePath
         */
        getHomePath: function () {
            return home;
        },
        getUrl: function () {
            return url;
        },

        getHomePath_localStorage: function () {
            return localStorage.getItem(homeStorageKey);
        },

        /**
         * 设置 domainName
         * @param name
         */
        setDomainName: function (name) {
            domainName = name;
        },

        /**
         * 获得域名的地址(用于分享)
         * */
        getDomainName: function () {
            return domainName;
        },

        /**
         * 为了消除一些警告
         * @param successFunction
         * @param errorFunction
         * @param completeFunction
         */
        getPath: function (successFunction, errorFunction, completeFunction) {
            options.successFunction  = successFunction;
            options.errorFunction    = errorFunction;
            options.completeFunction = completeFunction;

            home.getWindPath(options);
        },

        home: function (successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : [],
                "controller": "home",
                "action"    : "home"
            };
            request(out, successFunction, errorFunction, completeFunction)
        },

        setCookie: function (options) {
            var out = {
                "params"    : {
                    "key"  : options.key,
                    "value": options.value
                },
                "controller": "home",
                "action"    : "setCookie"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        getWindPath: function (options) {
            var out = {
                "params"    : {},
                "controller": "home",
                "action"    : "getWindPath"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        getServerPath: function (options) {
            var out = {
                "params"    : {},
                "controller": "home",
                "action"    : "getServerPath"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /***********************************
         * 员工管理
         ***********************************/

        /**
         * 根据员工编号修改员工名字
         */
        setStaffNameByStaffNo: function (staffNo, name, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "StaffNo": staffNo,
                    "Name"   : name
                },
                "controller": "staff",
                "action"    : "setStaffNameByStaffNo"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 根据员工id修改员工名字
         */
        setStaffNameById: function (staffId, name, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "staffId": staffId,
                    "Name"   : name
                },
                "controller": "staff",
                "action"    : "setStaffNameByStaffId"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 获得员工列表
         */
        getStaffList: function (successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {},
                "controller": "staff",
                "action"    : "getStaffList"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /***********************************
         * 管理用户组
         ***********************************/

        /**
         * 新建用户组，并指定用户等级
         */
        newLoginGroup: function (loginGroup, permissionGrade, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "loginGroup"     : loginGroup,
                    "permissionGrade": permissionGrade
                },
                "controller": "loginGroupAuth",
                "action"    : "newLoginGroup"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 根据用户组修改用户组等级
         */
        setLoginGroupPermissionGradeByName: function (loginGroup, permissionGrade, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "loginGroup"     : loginGroup,
                    "permissionGrade": permissionGrade
                },
                "controller": "loginGroupAuth",
                "action"    : "setLoginGroupPermissionGradeByName"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 获得用户组列表
         */
        getLoginGroupAuthList: function (successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {},
                "controller": "loginGroupAuth",
                "action"    : "getLoginGroupAuthList"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /***********************************
         * 登入的操作
         ***********************************/

        /**
         * 登录
         */
        signIn: function (user, pwd, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "user": user,
                    "pass": pwd
                },
                "controller": "login",
                "action"    : "signIn"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 添加用户
         */
        addUser: function (user, pwd, group, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "User"    : user,
                    "PassWord": pwd,
                    "Group"   : group
                },
                "controller": "login",
                "action"    : "addUser"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 删除用户
         */
        deleteUser: function (userId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "UserId": userId
                },
                "controller": "login",
                "action"    : "deleteUser"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 修改用户组
         */
        setUserGroup: function (userId, group, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "UserId": userId,
                    "Group" : group
                },
                "controller": "login",
                "action"    : "setUserGroup"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 获得所有用户
         */
        getUserList: function (successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {},
                "controller": "login",
                "action"    : "getUserList"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        bossAppLogin: function (options) {
            var out = {
                "params"    : {
                    "restaurantId": options.restaurantId
                },
                "controller": "login",
                "action"    : "bossAppLogin"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /***********************************
         * 注册 CB
         ***********************************/

        /**
         * 注册新店家
         */
        newCloudNode: function (obj, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : obj,
                "controller": "cloudNode",
                "action"    : "newCloudNode"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 更新云端店家的名字
         */
        cloudNodeUpdateNewName: function (oldName, newName, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "NewName": newName,
                    "OldName": oldName
                },
                "controller": "cloudNode",
                "action"    : "cloudNodeUpdateNewName"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 更新云端店家的 key
         */
        cloudNodeUpdateNewKey: function (name, newKey, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "Name"  : name,
                    "NewKey": newKey
                },
                "controller": "cloudNode",
                "action"    : "cloudNodeUpdateNewKey"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 更新云端店家的 Serial
         */
        cloudNodeUpdateNewSerial: function (name, newSerial, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "Name"     : name,
                    "NewSerial": newSerial
                },
                "controller": "cloudNode",
                "action"    : "cloudNodeUpdateNewSerial"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 更新云端店家为上线
         */
        cloudNodeUpdateDisableToOnline: function (name, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "Name"   : name,
                    "Disable": false
                },
                "controller": "cloudNode",
                "action"    : "cloudNodeUpdateDisable"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 更新云端店家为下线
         */
        cloudNodeUpdateDisableOffline: function (name, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "Name"   : name,
                    "Disable": true
                },
                "controller": "cloudNode",
                "action"    : "cloudNodeUpdateDisable"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * cs.members
         */
        csMembers: function (successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {},
                "controller": "cloudNode",
                "action"    : "csMembers"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * cs.status
         */
        csStatus: function (successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {},
                "controller": "cloudNode",
                "action"    : "csStatus"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        getCmidList: function (successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {},
                "controller": "cloudNode",
                "action"    : "getCmidList"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        getRestaurantByRId: function (options) {
            var out = {
                "params"    : {
                    "restaurantId": options.restaurantId
                },
                "controller": "cloudNode",
                "action"    : "getRestaurantByRId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        setRestaurantDetailByRId: function (options) {
            var out = {
                "params"    : {
                    "restaurantId": options.restaurantId,
                    "desc": options.desc
                },
                "controller": "cloudNode",
                "action"    : "setRestaurantDetailByRId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        setRestaurantCompanyByRId: function (options) {
            var out = {
                "params"    : {
                    "restaurantId": options.restaurantId,
                    "company": options.company
                },
                "controller": "cloudNode",
                "action"    : "setRestaurantCompanyByRId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        setRestaurantCoordsByRId: function (options) {
            var out = {
                "params"    : {
                    "restaurantId": options.restaurantId,
                    "coords": options.coords
                },
                "controller": "cloudNode",
                "action"    : "setRestaurantCoordsByRId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        setRestaurantBillToByRId: function (options) {
            var out = {
                "params"    : {
                    "restaurantId": options.restaurantId,
                    "billTo": options.billTo
                },
                "controller": "cloudNode",
                "action"    : "setRestaurantBillToByRId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        getRestaurantDetailList: function (options) {
            var out = {
                "params"    : {},
                "controller": "cloudNode",
                "action"    : "getRestaurantDetailList"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        getCmidByRId: function (rId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RId": rId
                },
                "controller": "cloudNode",
                "action"    : "getCmidByRId"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        getRestaurantList: function (options) {
            var out = {
                "params"    : {},
                "controller": "cloudNode",
                "action"    : "getRestaurantList"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /***********************************
         * 注册 CB
         ***********************************/
        printerTest: function (printer_sn, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "printer_sn": printer_sn
                },
                "controller": "printer",
                "action"    : "printerTest"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        add_print: function (printer_sn, printNumber, content, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "printer_sn" : printer_sn,
                    "printNumber": printNumber,
                    "content"    : content
                },
                "controller": "printer",
                "action"    : "add_print"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        query_print: function (printer_sn, serialNumber, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "printer_sn"  : printer_sn,
                    "serialNumber": serialNumber
                },
                "controller": "printer",
                "action"    : "query_print"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        query_printer: function (printer_sn, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "printer_sn": printer_sn
                },
                "controller": "printer",
                "action"    : "query_printer"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },
        /***********************************
         * 短信供应商的操作
         ***********************************/

        /**
         * 创建新的供应商
         */
        newOperator: function (operator, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "name"        : operator.name, //供应商名字
                    "OperatorTag" : operator.OperatorTag, //运营商代号
                    "sign"        : operator.sign, //签名：【云易科技】
                    "uid"         : operator.uid,
                    "pass"        : operator.pass,
                    "smsCountLeft": operator.smsCountLeft //剩余条数，用来智能发短信
                },
                "controller": "smsOperator",
                "action"    : "newOperator"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 添加短信模板
         */
        addOperator: function (templete, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "OperatorTag": templete.OperatorTag,//运营商代号
                    "TempleteTag": templete.templeteTag,
                    "TempleteId" : templete.templeteId //模板短信
                },
                "controller": "smsOperator",
                "action"    : "addOperator"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 创建供应商充值记录
         */
        newOperatorTrans: function (operatorTrans, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "OperatorId": operatorTrans.OperatorId, //充值的供应商 _id
                    "amount"    : operatorTrans.amount, //充值金额
                    "count"     : operatorTrans.count //充值条数
                },
                "controller": "smsOperator",
                "action"    : "newOperatorTrans"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 获得运营商名字代号和id列表
         */
        getOperatorIdAndTagAndSignSmsCountLeftList: function (successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {},
                "controller": "smsOperator",
                "action"    : "getOperatorIdAndTagAndSignSmsCountLeftList"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        getOperatorList: function (successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {},
                "controller": "smsOperator",
                "action"    : "getOperatorList"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 查询余额
         */
        getAccountBalanceByTag: function (operatorTag, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "OperatorTag": operatorTag
                },
                "controller": "smsOperator",
                "action"    : "getAccountBalanceByTag"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 修改 uid，类似与用户名
         */
        setUid: function (operatorId, uid, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "OperatorId": operatorId,
                    "uid"       : uid
                },
                "controller": "smsOperator",
                "action"    : "setUid"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 修改短信平台的 pass，类似与密码
         */
        setPass: function (operatorId, pass, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "OperatorId": operatorId,
                    "pass"      : pass
                },
                "controller": "smsOperator",
                "action"    : "setPass"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 修改短信签名
         */
        setSign: function (operatorId, sign, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "OperatorId": operatorId,
                    "sign"      : sign
                },
                "controller": "smsOperator",
                "action"    : "setSign"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 修改短信验证码模板运营商id
         */
        setTempleteId: function (operatorTag, templeteTag, templeteId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "OperatorTag": operatorTag,
                    "templeteTag": templeteTag,
                    "templeteId" : templeteId
                },
                "controller": "smsOperator",
                "action"    : "setTempleteId"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 修改剩余短信的数目
         */
        setSmsCountLeft: function (operatorId, smsCountLeft, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "OperatorId"  : operatorId,
                    "smsCountLeft": smsCountLeft
                },
                "controller": "smsOperator",
                "action"    : "setSmsCountLeft"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 获得运营商模板列表
         */
        getTempleteListByOperatorTag: function (OperatorTag, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "OperatorTag": OperatorTag
                },
                "controller": "smsOperator",
                "action"    : "getTempleteListByOperatorTag"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 测试自写短信
         */
        sendTestSMS: function (rid, mob, text, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": rid,
                    "mobile"      : mob,
                    "text"        : text
                },
                "controller": "smsOperator",
                "action"    : "sendTestSMS"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /***********************************
         * 微信公众号的操作
         ***********************************/

        initWeiXinUser: function (restaurantId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId
                },
                "controller": "weiXinThePublic",
                "action"    : "initWeiXinUser"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 添加微信公众号
         */
        newWeiXinThePublic: function (obj, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RId"           : obj["RId"],//店家 id，云易内部号
                    "notifyMobile"  : obj["notifyMobile"],//短信通知的电话
                    "wxName"        : obj["wxName"],//微信公众号的名字
                    "AppId"         : obj["AppId"],//微信公众号 id
                    "AppSecret"     : obj["AppSecret"],//微信公众号key，类似于密码
                    "Token"         : obj["Token"],//微信公众号的口令一样的东西，用来验证服务器资源
                    "EncodingAESKey": obj["EncodingAESKey"],//微信公众号的加密key
                    "FromUserName"  : obj["FromUserName"]//开发者微信号
                },
                "controller": "weiXinThePublic",
                "action"    : "newWeiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 通过 id 逻辑删除微信公众号
         */
        deleteWeiXinThePublicById: function (id, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "id": id
                },
                "controller": "weiXinThePublic",
                "action"    : "deleteWeiXinThePublicById"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 修改 微信号名字
         */
        weiXinThePublic_setNameById: function (restaurantId, name, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "Name"        : name
                },
                "controller": "weiXinThePublic",
                "action"    : "setNameById"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 修改 AppId
         */
        weiXinThePublic_setAppIdById: function (restaurantId, appId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "AppId"       : appId
                },
                "controller": "weiXinThePublic",
                "action"    : "setAppIdById"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 修改 AppSecret
         */
        weiXinThePublic_setAppSecretById: function (restaurantId, appSecret, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "AppSecret"   : appSecret
                },
                "controller": "weiXinThePublic",
                "action"    : "setAppSecretById"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 修改 Token
         */
        weiXinThePublic_setTokenById: function (restaurantId, token, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "Token"       : token
                },
                "controller": "weiXinThePublic",
                "action"    : "setTokenById"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 修改 EncodingAESKey
         */
        weiXinThePublic_setEncodingAESKeyById: function (restaurantId, encodingAESKey, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId"  : restaurantId,
                    "EncodingAESKey": encodingAESKey
                },
                "controller": "weiXinThePublic",
                "action"    : "setEncodingAESKeyById"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 修改 notifyMobile
         */
        weiXinThePublic_setNotifyMobileById: function (restaurantId, notifyMobile, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "NotifyMobile": notifyMobile
                },
                "controller": "weiXinThePublic",
                "action"    : "setNotifyMobileById"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 获得微信公众号
         */
        getWeiXinThePublicByRestaurantId: function (restaurantId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId
                },
                "controller": "weiXinThePublic",
                "action"    : "getWeiXinThePublicByRestaurantId"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 获得微信公众号列表
         */
        getWeiXinThePublicList: function (successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {},
                "controller": "weiXinThePublic",
                "action"    : "getWeiXinThePublicList"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 获得这个微信公众号接到的消息
         */
        getWeiXinThePublicMsgListByWeiXinThePublicId: function (restaurantId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId
                },
                "controller": "weiXinThePublic",
                "action"    : "getWeiXinThePublicMsgListByWeiXinThePublicId"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 获得关注微信用户列表
         */
        getWeiXinThePublicUserList: function (restaurantId, nextOpenId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "nextOpenId"  : nextOpenId
                },
                "controller": "weiXinThePublic",
                "action"    : "getWeiXinThePublicUserList"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 创建微信公众号的用户分组
         */
        groupsCreate_weiXinThePublic: function (restaurantId, group, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "group"       : group
                },
                "controller": "weiXinThePublic",
                "action"    : "groupsCreate_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 获得微信公众号的用户分组列表
         */
        getGroupList_weiXinThePublic: function (restaurantId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId
                },
                "controller": "weiXinThePublic",
                "action"    : "getGroupList_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 获得用户所在的分组
         */
        getGroupByOpenID_weiXinThePublic: function (restaurantId, openID, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "OpenID"      : openID
                },
                "controller": "weiXinThePublic",
                "action"    : "getGroupByOpenID_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 修改用户组名字
         */
        groupsUpdate_weiXinThePublic: function (restaurantId, groupId, groupName, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "groupId"     : groupId,
                    "groupName"   : groupName
                },
                "controller": "weiXinThePublic",
                "action"    : "groupsUpdate_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 将用户移动到一个分组
         */
        openToGroup_weiXinThePublic: function (restaurantId, openId, to_groupid, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "openId"      : openId,
                    "to_groupid"  : to_groupid
                },
                "controller": "weiXinThePublic",
                "action"    : "openToGroup_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 设置用户备注
         */
        updateUserRemark_weiXinThePublic: function (restaurantId, openId, remark, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "openId"      : openId,
                    "remark"      : remark
                },
                "controller": "weiXinThePublic",
                "action"    : "updateUserRemark_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        getUserInfo_weiXinThePublic: function (restaurantId, openId, lang, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "openId"      : openId,
                    "lang"        : lang
                },
                "controller": "weiXinThePublic",
                "action"    : "getUserInfo_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 设置行业
         */
        setIndustry_weiXinThePublic: function (restaurantId, industry, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "industry"    : industry
                },
                "controller": "weiXinThePublic",
                "action"    : "setIndustry_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 获得模板
         */
        getTemplate_weiXinThePublic: function (restaurantId, templateIdShort, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId"     : restaurantId,
                    "template_id_short": templateIdShort
                },
                "controller": "weiXinThePublic",
                "action"    : "getTemplate_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        sendTemplate_weiXinThePublic: function (restaurantId, templateIdShort, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId"     : restaurantId,
                    "template_id_short": templateIdShort
                },
                "controller": "weiXinThePublic",
                "action"    : "sendTemplate_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 向一个关注着发送一个 text 消息
         */
        sendTextMessage: function (restaurantId, openId, text, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "openId"      : openId,
                    "text"        : text
                },
                "controller": "weiXinThePublic",
                "action"    : "sendTextMessage"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 向一个关注着发送一个 image 消息
         */
        sendImageMessage: function (restaurantId, openId, mediaId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "openId"      : openId,
                    "media_id"    : mediaId
                },
                "controller": "weiXinThePublic",
                "action"    : "sendImageMessage"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 向一个关注着发送一个 voice 消息
         */
        sendVoiceMessage: function (restaurantId, openId, mediaId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "openId"      : openId,
                    "media_id"    : mediaId
                },
                "controller": "weiXinThePublic",
                "action"    : "sendVoiceMessage"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 向一个关注着发送一个 video 消息
         */
        sendVideoMessage: function (restaurantId, openId, mediaId, thumbMediaId, title, description, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId"  : restaurantId,
                    "openId"        : openId,
                    "media_id"      : mediaId,
                    "thumb_media_id": thumbMediaId,
                    "title"         : title,
                    "description"   : description
                },
                "controller": "weiXinThePublic",
                "action"    : "sendVideoMessage"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 向一个关注着发送一个 music 消息
         */
        sendMusicMessage: function (restaurantId, openId, title, description, musicurl, hqmusicurl, thumbMediaId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId"  : restaurantId,
                    "openId"        : openId,
                    "title"         : title,
                    "description"   : description,
                    "musicurl"      : musicurl,
                    "hqmusicurl"    : hqmusicurl,
                    "thumb_media_id": thumbMediaId
                },
                "controller": "weiXinThePublic",
                "action"    : "sendMusicMessage"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 向一个关注着发送一个 news 消息
         */
        sendNewsMessage: function (restaurantId, openId, articlesArray, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "openId"      : openId,
                    "articles"    : articlesArray
                },
                "controller": "weiXinThePublic",
                "action"    : "sendNewsMessage"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        mediaUploadNews: function (restaurantId, articlesArray, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "articles"    : articlesArray
                },
                "controller": "weiXinThePublic",
                "action"    : "mediaUploadNews"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        massSendall_mpnews: function (restaurantId, media_id, is_to_all, group_id, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "media_id"    : media_id,
                    "is_to_all"   : is_to_all,
                    "group_id"    : group_id
                },
                "controller": "weiXinThePublic",
                "action"    : "massSendall_mpnews"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        massSendall_text: function (restaurantId, text, is_to_all, group_id, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "text"        : text,
                    "is_to_all"   : is_to_all,
                    "group_id"    : group_id
                },
                "controller": "weiXinThePublic",
                "action"    : "massSendall_text"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 上传图片
         */
        uploadImage_weiXinThePublic: function (restaurantId, fileId, successFunction, errorFunction) {
            $.ajaxFileUpload(
                {
                    url          : url + "?controller=weiXinThePublic&action=uploadImage_weiXinThePublic&RId=" + restaurantId,
                    secureuri    : false,
                    fileElementId: fileId,
                    dataType     : "json",//echo 一定是json字符串
                    beforeSend   : function () {
                        $("#loading").show();
                    },
                    complete     : function () {
                        $("#loading").hide();
                    },
                    success      : successFunction,
                    error        : function (data, status, e) {
                        if (typeof errorFunction === "undefined") {

                        } else {
                            errorFunction(data, status, e);
                        }
                    }
                });
        },

        /**
         * 上传语音
         */
        uploadVoice_weiXinThePublic: function (restaurantId, fileId, successFunction, errorFunction) {
            $.ajaxFileUpload(
                {
                    url          : url + "?controller=weiXinThePublic&action=uploadVoice_weiXinThePublic&RId=" + restaurantId,
                    secureuri    : false,
                    fileElementId: fileId,
                    dataType     : "json",//echo 一定是json字符串
                    beforeSend   : function () {
                        $("#loading").show();
                    },
                    complete     : function () {
                        $("#loading").hide();
                    },
                    success      : successFunction,
                    error        : function (data, status, e) {
                        if (typeof errorFunction === "undefined") {

                        } else {
                            errorFunction(data, status, e);
                        }
                    }
                });
        },

        /**
         * 上传视频
         */
        uploadVideo_weiXinThePublic: function (restaurantId, fileId, successFunction, errorFunction) {
            $.ajaxFileUpload(
                {
                    url          : url + "?controller=weiXinThePublic&action=uploadVideo_weiXinThePublic&RId=" + restaurantId,
                    secureuri    : false,
                    fileElementId: fileId,
                    dataType     : "json",//echo 一定是json字符串
                    beforeSend   : function () {
                        $("#loading").show();
                    },
                    complete     : function () {
                        $("#loading").hide();
                    },
                    success      : successFunction,
                    error        : function (data, status, e) {
                        if (typeof errorFunction === "undefined") {

                        } else {
                            errorFunction(data, status, e);
                        }
                    }
                });
        },

        /**
         * 上传缩略图
         */
        uploadThumb_weiXinThePublic: function (restaurantId, fileId, successFunction, errorFunction) {
            $.ajaxFileUpload(
                {
                    url          : url + "?controller=weiXinThePublic&action=uploadThumb_weiXinThePublic&RId=" + restaurantId,
                    secureuri    : false,
                    fileElementId: fileId,
                    dataType     : "json",//echo 一定是json字符串
                    beforeSend   : function () {
                        $("#loading").show();
                    },
                    complete     : function () {
                        $("#loading").hide();
                    },
                    success      : successFunction,
                    error        : function (data, status, e) {
                        if (typeof errorFunction === "undefined") {

                        } else {
                            errorFunction(data, status, e);
                        }
                    }
                });
        },

        /**
         * 下载媒体文件
         */
        mediaGet_weiXinThePublic: function (restaurantId, mediaId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "mediaId"     : mediaId
                },
                "controller": "weiXinThePublic",
                "action"    : "mediaGet_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 设置自定义菜单
         */
        menuCreate_weiXinThePublic: function (restaurantId, menuCreate, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "menuCreate"  : menuCreate
                },
                "controller": "weiXinThePublic",
                "action"    : "menuCreate_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 获得自定义菜单
         */
        menuGet_weiXinThePublic: function (restaurantId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId
                },
                "controller": "weiXinThePublic",
                "action"    : "menuGet_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 删除自定义菜单
         */
        menuDelete_weiXinThePublic: function (restaurantId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId
                },
                "controller": "weiXinThePublic",
                "action"    : "menuDelete_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        temporaryQrcodeCreate_weiXinThePublic: function (restaurantId, expire_seconds, scene_id, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId"  : restaurantId,
                    "expire_seconds": expire_seconds,
                    "scene_id"      : scene_id
                },
                "controller": "weiXinThePublic",
                "action"    : "temporaryQrcodeCreate_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        permanentQrcodeCreate_weiXinThePublic: function (restaurantId, scene_id, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "scene_id"    : scene_id
                },
                "controller": "weiXinThePublic",
                "action"    : "permanentQrcodeCreate_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        showQrcode: function (ticket, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "ticket": ticket
                },
                "controller": "weiXinThePublic",
                "action"    : "showQrcode"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        getUrl_weiXinThePublic: function (restaurantId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId
                },
                "controller": "weiXinThePublic",
                "action"    : "getUrl_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        getEncodingAESKey_weiXinThePublic: function (successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {},
                "controller": "weiXinThePublic",
                "action"    : "getEncodingAESKey_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        shorturl_weiXinThePublic: function (restaurantId, url, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "url"         : url
                },
                "controller": "weiXinThePublic",
                "action"    : "shorturl_weiXinThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        recordShare: function (options) {
            var out = {
                "params"    : {
                    title   : options.title,
                    linkType: options.linkType,
                    link    : options.link,
                    openId  : options.openId
                },
                "controller": "weiXinThePublic",
                "action"    : "recordShare"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        getShareRecord: function (options) {
            var out = {
                "params"    : {
                    linkType: options.linkType,
                    openId  : options.openId
                },
                "controller": "weiXinThePublic",
                "action"    : "getShareRecord"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        getShareRecordList: function (options) {
            var out = {
                "params"    : {},
                "controller": "weiXinThePublic",
                "action"    : "getShareRecordList"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /***********************************
         * 微信支付的操作
         ***********************************/

        /**
         * 添加微信公众号
         */
        newWeiXinPayThePublic: function (obj, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "notifyMobile"  : obj["notifyMobile"],//短信通知的电话
                    "wxName"        : obj["wxName"],//微信公众号的名字
                    "AppId"         : obj["AppId"],//微信公众号 id
                    "AppSecret"     : obj["AppSecret"],//微信公众号key，类似于密码
                    "Token"         : obj["Token"],//微信公众号的口令一样的东西，用来验证服务器资源
                    "EncodingAESKey": obj["EncodingAESKey"],//微信公众号的加密key
                    "mchId"         : obj["mchId"],//微信支付商户号
                    "paySecret"     : obj["paySecret"]//微信支付的key，类似与密码
                },
                "controller": "weiXinPay",
                "action"    : "newWeiXinPayThePublic"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 指定店家微信支付
         */
        addWeiXinPayCh: function (restaurantId, weiXinPayCh, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,   //短信通知的电话
                    "weiXinPayCh" : weiXinPayCh     //微信公众号的名字
                },
                "controller": "weiXinPay",
                "action"    : "addWeiXinPayCh"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        weiXinPay_setNameById: function (weiXinPayId, name, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "weiXinPayId": weiXinPayId,
                    "Name"       : name
                },
                "controller": "weiXinPay",
                "action"    : "setNameById"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        weiXinPay_setAppIdById: function (weiXinPayId, appId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "weiXinPayId": weiXinPayId,
                    "AppId"      : appId
                },
                "controller": "weiXinPay",
                "action"    : "setAppIdById"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        weiXinPay_setAppSecretById: function (weiXinPayId, appSecret, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "weiXinPayId": weiXinPayId,
                    "AppSecret"  : appSecret
                },
                "controller": "weiXinPay",
                "action"    : "setAppSecretById"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        weiXinPay_setTokenById: function (weiXinPayId, token, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "weiXinPayId": weiXinPayId,
                    "Token"      : token
                },
                "controller": "weiXinPay",
                "action"    : "setTokenById"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        weiXinPay_setEncodingAESKeyById: function (weiXinPayId, encodingAESKey, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "weiXinPayId"   : weiXinPayId,
                    "EncodingAESKey": encodingAESKey
                },
                "controller": "weiXinPay",
                "action"    : "setEncodingAESKeyById"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        weiXinPay_setNotifyMobileById: function (weiXinPayId, notifyMobile, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "weiXinPayId" : weiXinPayId,
                    "NotifyMobile": notifyMobile
                },
                "controller": "weiXinPay",
                "action"    : "setNotifyMobileById"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        weiXinPay_setMchIdById: function (weiXinPayId, mchId, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "weiXinPayId": weiXinPayId,
                    "MchId"      : mchId
                },
                "controller": "weiXinPay",
                "action"    : "setMchIdById"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        weiXinPay_setPaySecretById: function (weiXinPayId, paySecret, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "weiXinPayId": weiXinPayId,
                    "paySecret"  : paySecret
                },
                "controller": "weiXinPay",
                "action"    : "setPaySecretById"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        WeiXinPay_getWeiXinPayThePublicList: function (successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {},
                "controller": "weiXinPay",
                "action"    : "getWeiXinPayThePublicList"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 获得初始化 JSAPI 的数据
         */
        weiXinPay_getJSAPIConfig: function (restaurantId, payURL, jsApiList, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "payURL"      : payURL,
                    "jsApiList"   : jsApiList
                },
                "controller": "weiXinPay",
                "action"    : "getJSAPIConfig"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        // /**
        //  * 获得 JSAPI 需要的订单
        //  */
        // weiXinPay_getChooseWXPayData: function (restaurantId, orderId, openId, amount, successFunction, errorFunction, completeFunction) {
        //     var out = {
        //         "params"    : {
        //             "RestaurantId": restaurantId,
        //             "OrderId"     : orderId,
        //             "openId"      : openId,
        //             "amount"      : amount
        //         },
        //         "controller": "weiXinPay",
        //         "action"    : "getChooseWXPayData"
        //     };
        //     request(out, successFunction, errorFunction, completeFunction);
        // },

        /**
         * 获得 订单是否支付成功的结果
         */
        weiXinPay_getPackageByOutTradeNo: function (restaurantId, out_trade_no, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "out_trade_no": out_trade_no
                },
                "controller": "weiXinPay",
                "action"    : "getPackageByOutTradeNo"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        /**
         * 获得 NATIVE 需要的订单
         */
        getWxPayNativeData: function (restaurantId, orderId, amount, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "OrderId"     : orderId,
                    "amount"      : amount
                },
                "controller": "weiXinPay",
                "action"    : "getWxPayNativeData"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        payOrderQuery: function (restaurantId, out_trade_no, successFunction, errorFunction, completeFunction) {
            var out = {
                "params"    : {
                    "RestaurantId": restaurantId,
                    "out_trade_no": out_trade_no
                },
                "controller": "weiXinPay",
                "action"    : "payOrderQuery"
            };
            request(out, successFunction, errorFunction, completeFunction);
        },

        getWeiXinJSAPInfoByOutTradeNoId: function (options) {
            var out = {
                "params"    : {
                    "out_trade_no": options.out_trade_no,
                    "openId"      : options.openId,
                    "payURL"      : location.href,
                    "jsApiList"   : ["chooseWXPay"]
                },
                "controller": "weiXinPay",
                "action"    : "getWeiXinJSAPInfoByOutTradeNoId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /***********************************
         * 微信支付的操作
         ***********************************/

        restaurantStatistics: function (options) {
            var out = {
                "params"    : {},
                "controller": "statistics",
                "action"    : "restaurantStatistics"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /***********************************
         * 店家 boss 的管理
         ***********************************/

        newRestaurantBossUser: function (options) {
            var out = {
                "params"    : {
                    name: options.name,
                    pass: options.pass
                },
                "controller": "restaurantBoss",
                "action"    : "newRestaurantBossUser"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        deleteRestaurantBossUser: function (options) {
            var out = {
                "params"    : {
                    id: options.id
                },
                "controller": "restaurantBoss",
                "action"    : "deleteRestaurantBossUser"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        getRestaurantBossUserList: function (options) {
            var out = {
                "params"    : {},
                "controller": "restaurantBoss",
                "action"    : "getRestaurantBossUserList"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        addRestaurantToRestaurantBoss: function (options) {
            var out = {
                "params"    : {
                    restaurantBossId: options.restaurantBossId,
                    restaurantId    : options.restaurantId
                },
                "controller": "restaurantBoss",
                "action"    : "addRestaurantToRestaurantBoss"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        subtractRestaurantToRestaurantBoss: function (options) {
            var out = {
                "params"    : {
                    restaurantBossId: options.restaurantBossId,
                    restaurantId    : options.restaurantId
                },
                "controller": "restaurantBoss",
                "action"    : "subtractRestaurantToRestaurantBoss"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        loginRestaurantBoss: function (options) {
            var out = {
                "params"    : {
                    name: options.name,
                    pass: options.pass
                },
                "controller": "restaurantBoss",
                "action"    : "loginRestaurantBoss"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        getRestaurantBossPage: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId
                },
                "controller": "restaurantBoss",
                "action"    : "getRestaurantBossPage"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询店家系统错误
         * @param options
         */
        getRestaurantErrorLog: function (options) {
            var out = {
                "params"    : {
                    id   : options.id,
                    start: options.start,
                    end  : options.end
                },
                "controller": "restaurantError",
                "action"    : "getRestaurantErrorLog"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 更新店家证书
         * @param options
         */
        updateCertificateByRestaurantId: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId
                },
                "controller": "certificate",
                "action"    : "updateCertificateByRestaurantId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查看店家证书
         * @param options
         */
        getCertificateByRestaurantId: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId
                },
                "controller": "certificate",
                "action"    : "getCertificateByRestaurantId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 设置客服联系方式
         * @param options
         */
        addServiceContact: function (options) {
            var out = {
                "params"    : {
                    type   : options.type,
                    contact: options.contact
                },
                "controller": "serviceContact",
                "action"    : "addServiceContact"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 读取客服联系方式
         * @param options
         */
        getServiceContact: function (options) {
            var out = {
                "params"    : {
                    type: options.type
                },
                "controller": "serviceContact",
                "action"    : "getServiceContact"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 读取客服联系方式
         * @param options
         */
        updateServiceContact: function (options) {
            var out = {
                "params"    : {
                    id     : options.id,
                    type   : options.type,
                    contact: options.contact
                },
                "controller": "serviceContact",
                "action"    : "updateServiceContact"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 读取客服联系方式
         * @param options
         */
        deleteServiceContact: function (options) {
            var out = {
                "params"    : {
                    id: options.id
                },
                "controller": "serviceContact",
                "action"    : "deleteServiceContact"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 获得工单类型
         * @param options
         */
        getWorkOrderType: function (options) {
            var out = {
                "params"    : {},
                "controller": "workOrder",
                "action"    : "getWorkOrderType"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询工单
         * @param options
         */
        getWorkOrder: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId,
                    status      : options.status,
                    payStatus   : options.payStatus
                },
                "controller": "workOrder",
                "action"    : "getWorkOrder"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询工单
         * @param options
         */
        getWorkOrderById: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId,
                    id          : options.id
                },
                "controller": "workOrder",
                "action"    : "getWorkOrderById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 创建工单
         * @param options
         */
        addWorkOrder: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId,
                    bossId      : options.bossId,
                    type        : options.type,
                    desc        : options.desc
                },
                "controller": "workOrder",
                "action"    : "addWorkOrder"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 修改工单
         * @param options
         */
        setWorkOrderStatus: function (options) {
            var out = {
                "params"    : {
                    status: options.status,
                    id    : options.id
                },
                "controller": "workOrder",
                "action"    : "setWorkOrderStatus"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 添加服务
         * @param options
         */
        addService: function (options) {
            var out = {
                "params"    : {
                    name    : options.name,
                    desc    : options.desc,
                    amount  : options.amount,
                    currency: options.currency,
                },
                "controller": "service",
                "action"    : "addService"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询服务
         * @param options
         */
        getServiceByRestaurantId: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId
                },
                "controller": "service",
                "action"    : "getServiceByRestaurantId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询服务
         * @param options
         */
        getAllService: function (options) {
            var out = {
                "params"    : {},
                "controller": "service",
                "action"    : "getAllService"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 删除工单
         * @param options
         */
        deleteService: function (options) {
            var out = {
                "params"    : {
                    id: options.id
                },
                "controller": "service",
                "action"    : "deleteService"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 购买工单
         * @param options
         */
        buyServiceGetOrderURl: function (options) {
            var out = {
                "params"    : {
                    id          : options.id,
                    restaurantId: options.restaurantId,
                    payType     : options.payType,
                    bossId      : options.bossId
                },
                "controller": "service",
                "action"    : "buyServiceGetOrderURl"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 添加信息
         * @param options
         */
        addMessage   : function (options) {
            var out = {
                "params"    : {
                    title  : options.title,
                    content: options.content,
                    desc   : options.desc,
                    type   : options.type
                },
                "controller": "message",
                "action"    : "addMessage"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查询信息
         * @param options
         */
        getAllMessage: function (options) {
            var out = {
                "params"    : {},
                "controller": "message",
                "action"    : "getAllMessage"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询信息
         * @param options
         */
        getMessageById: function (options) {
            var out = {
                "params"    : {
                    id: options.id
                },
                "controller": "message",
                "action"    : "getMessageById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询信息
         * @param options
         */
        getMessageByBossId: function (options) {
            var out = {
                "params"    : {
                    bossId: options.bossId
                },
                "controller": "message",
                "action"    : "getMessageByBossId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 添加信息
         * @param options
         */
        deleteMessageById: function (options) {
            var out = {
                "params"    : {
                    id: options.id
                },
                "controller": "message",
                "action"    : "deleteMessageById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 发信息
         * @param options
         */
        sendMessageToRestaurantId: function (options) {
            var out = {
                "params"    : {
                    id         : options.id,
                    bossIdArray: options.bossIdArray
                },
                "controller": "message",
                "action"    : "sendMessageToRestaurantId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 注册
         * @param options
         */
        sendRegisteredSMS: function (options) {
            var out = {
                "params"    : {
                    mobile    : options.mobile,
                    mobileCode: options.mobileCode
                },
                "controller": "register",
                "action"    : "sendRegisteredSMS"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 验证注册
         * @param options
         */
        verifiedRegisteredSMS: function (options) {
            var out = {
                "params"    : {
                    mobile    : options.mobile,
                    mobileCode: options.mobileCode,
                    email     : options.email,
                    code      : options.code,
                    pass      : options.pass
                },
                "controller": "register",
                "action"    : "verifiedRegisteredSMS"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 修改boss
         * @param options
         */
        updateBossPass: function (options) {
            var out = {
                "params"    : {
                    bossId : options.bossId,
                    newPass: options.newPass,
                    oldPass: options.oldPass
                },
                "controller": "register",
                "action"    : "updateBossPass"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询boss
         * @param options
         */
        getBossById: function (options) {
            var out = {
                "params"    : {
                    id: options.id
                },
                "controller": "register",
                "action"    : "getBossById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询boss
         * @param options
         */
        getAllBoss: function (options) {
            var out = {
                "params"    : {},
                "controller": "register",
                "action"    : "getAllBoss"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 修改boss
         * @param options
         */
        updateBossInfo: function (options) {
            var out = {
                "params"    : {
                    bossId  : options.bossId,
                    language: options.language,
                    email   : options.email,
                    role    : options.role
                },
                "controller": "register",
                "action"    : "updateBossInfo"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 修改boss
         * @param options
         */
        bossLogin: function (options) {
            var out = {
                "params"    : {
                    mobile    : options.mobile,
                    mobileCode: options.mobileCode,
                    pass      : options.pass
                },
                "controller": "register",
                "action"    : "bossLogin"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 重置密码
         * @param options
         */
        sendResetPassSMS: function (options) {
            var out = {
                "params"    : {
                    mobile    : options.mobile,
                    mobileCode: options.mobileCode
                },
                "controller": "register",
                "action"    : "sendResetPassSMS"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 重置密码
         * @param options
         */
        verifiedResetPassSMS: function (options) {
            var out = {
                "params"    : {
                    mobile    : options.mobile,
                    mobileCode: options.mobileCode,
                    code      : options.code,
                    pass      : options.pass
                },
                "controller": "register",
                "action"    : "verifiedResetPassSMS"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 重置密码
         * @param options
         */
        sendQuickLoginSms: function (options) {
            var out = {
                "params"    : {
                    mobile    : options.mobile,
                    mobileCode: options.mobileCode
                },
                "controller": "register",
                "action"    : "sendQuickLoginSms"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 重置密码
         * @param options
         */
        verifiedQuickLoginSms: function (options) {
            var out = {
                "params"    : {
                    mobile    : options.mobile,
                    mobileCode: options.mobileCode,
                    code      : options.code
                },
                "controller": "register",
                "action"    : "verifiedQuickLoginSms"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 重置密码
         * @param options
         */
        addRestaurantToBoss: function (options) {
            var out = {
                "params"    : {
                    bossId      : options.bossId,
                    restaurantId: options.restaurantId
                },
                "controller": "register",
                "action"    : "addRestaurantToBoss"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 重置密码
         * @param options
         */
        subtractRestaurantToBoss: function (options) {
            var out = {
                "params"    : {
                    bossId      : options.bossId,
                    restaurantId: options.restaurantId
                },
                "controller": "register",
                "action"    : "subtractRestaurantToBoss"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 生成二维码
         * @param options
         */
        addScanQRCode: function (options) {
            var out = {
                "params"    : {},
                "controller": "scan",
                "action"    : "addScanQRCode"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 扫码
         * @param options
         */
        scanQRCode: function (options) {
            var out = {
                "params"    : {
                    bossId: options.bossId,
                    codeId: options.codeId,
                    role: options.role,
                    add_time: options.add_time,
                },
                "controller": "scan",
                "action"    : "scanQRCode"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询扫码
         * @param options
         */
        getScanQRCode: function (options) {
            var out = {
                "params"    : {
                    bossId: options.bossId,
                    codeId: options.codeId
                },
                "controller": "scan",
                "action"    : "getScanQRCode"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 轮序二维码
         * @param options
         */
        getScanQRCodeById: function (options) {
            var out = {
                "params"    : {
                    codeId: options.codeId
                },
                "controller": "scan",
                "action"    : "getScanQRCodeById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 添加银行卡
         * @param options
         */
        addCreditCard: function (options) {
            var out = {
                "params"    : {
                    bossId      : options.bossId,
                    firstName   : options.firstName,
                    lastName    : options.lastName,
                    mobile      : options.mobile,
                    mobileCode  : options.mobileCode,
                    email       : options.email,
                    cardType    : options.cardType,
                    month       : options.month,
                    year        : options.year,
                    securityCode: options.securityCode,
                    cardNumber  : options.cardNumber,
                    default     : options.default
                },
                "controller": "creditCard",
                "action"    : "addCreditCard"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 添加银行卡
         * @param options
         */
        addRestaurantCreditCard: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId,
                    firstName   : options.firstName,
                    lastName    : options.lastName,
                    mobile      : options.mobile,
                    mobileCode  : options.mobileCode,
                    email       : options.email,
                    cardType    : options.cardType,
                    month       : options.month,
                    year        : options.year,
                    securityCode: options.securityCode,
                    cardNumber  : options.cardNumber,
                    default     : options.default
                },
                "controller": "creditCard",
                "action"    : "addRestaurantCreditCard"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 添加app银行卡
         * @param options
         */
        addAppCreditCard: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId,
                    firstName   : options.firstName,
                    lastName    : options.lastName,
                    mobile      : options.mobile,
                    mobileCode  : options.mobileCode,
                    email       : options.email,
                    cardType    : options.cardType,
                    month       : options.month,
                    year        : options.year,
                    securityCode: options.securityCode,
                    cardNumber  : options.cardNumber
                },
                "controller": "appCreditCard",
                "action"    : "addAppCreditCard"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 添加二维码
         * @param options
         */
        updateCreditCard: function (options) {
            var out = {
                "params"    : {
                    id          : options.id,
                    bossId      : options.bossId,
                    firstName   : options.firstName,
                    lastName    : options.lastName,
                    mobile      : options.mobile,
                    mobileCode  : options.mobileCode,
                    email       : options.email,
                    cardType    : options.cardType,
                    month       : options.month,
                    year        : options.year,
                    securityCode: options.securityCode,
                    cardNumber  : options.cardNumber,
                    default     : options.default
                },
                "controller": "creditCard",
                "action"    : "updateCreditCard"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 删除银行卡
         * @param options
         */
        deleteCreditCard: function (options) {
            var out = {
                "params"    : {
                    id    : options.id,
                    bossId: options.bossId
                },
                "controller": "creditCard",
                "action"    : "deleteCreditCard"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 删除银行卡
         * @param options
         */
        deleteCreditCardByRestaurantId: function (options) {
            var out = {
                "params"    : {
                    id    : options.id,
                    restaurantId: options.restaurantId
                },
                "controller": "creditCard",
                "action"    : "deleteCreditCardByRestaurantId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 修改店家银行卡
         * @param options
         */
        updateRestaurantCreditCardById: function (options) {
            var out = {
                "params"    : {
                    id          : options.id,
                    restaurantId: options.restaurantId,
                    firstName   : options.firstName,
                    lastName    : options.lastName,
                    mobile      : options.mobile,
                    mobileCode  : options.mobileCode,
                    email       : options.email,
                    cardType    : options.cardType,
                    month       : options.month,
                    year        : options.year,
                    securityCode: options.securityCode,
                    cardNumber  : options.cardNumber,
                    default     : options.default
                },
                "controller": "creditCard",
                "action"    : "updateRestaurantCreditCardById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 修改APP银行卡
         * @param options
         */
        updateAppCreditCard: function (options) {
            var out = {
                "params"    : {
                    id          : options.id,
                    firstName   : options.firstName,
                    lastName    : options.lastName,
                    mobile      : options.mobile,
                    mobileCode  : options.mobileCode,
                    email       : options.email,
                    cardType    : options.cardType,
                    month       : options.month,
                    year        : options.year,
                    securityCode: options.securityCode,
                    cardNumber  : options.cardNumber
                },
                "controller": "appCreditCard",
                "action"    : "updateAppCreditCard"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 银行卡数据更新20190420
         * @param options
         */
        creditCardUpdate20190420: function (options) {
            var out = {
                "params"    : {},
                "controller": "creditCard",
                "action"    : "creditCardUpdate20190420"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 删除银行卡
         * @param options
         */
        deleteCreditCardArray: function (options) {
            var out = {
                "params"    : {
                    idArray   : options.idArray,
                    bossId: options.bossId
                },
                "controller": "creditCard",
                "action"    : "deleteCreditCardArray"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询银行卡
         * @param options
         */
        getCreditCardByBossId: function (options) {
            var out = {
                "params"    : {
                    bossId: options.bossId,
                    getRestaurantDefaultCard: options.getRestaurantDefaultCard
                },
                "controller": "creditCard",
                "action"    : "getCreditCardByBossId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询银行卡
         * @param options
         */
        getCreditCardByRestaurantId: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId,
                },
                "controller": "creditCard",
                "action"    : "getCreditCardByRestaurantId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查询app银行卡
         * @param options
         */
        getAppCreditCardByAppId: function (options) {
            var out = {
                "params"    : {
                    appId: options.appId,
                },
                "controller": "appCreditCard",
                "action"    : "getAppCreditCardByAppId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查询app银行卡
         * @param options
         */
        getAppCreditCardById: function (options) {
            var out = {
                "params"    : {
                    id: options.id,
                },
                "controller": "appCreditCard",
                "action"    : "getAppCreditCardById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 删除app银行卡
         * @param options
         */
        deleteAppCreditCardById: function (options) {
            var out = {
                "params"    : {
                    id: options.id,
                },
                "controller": "appCreditCard",
                "action"    : "deleteAppCreditCardById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 添加二维码
         * @param options
         */
        updateBossImage: function (options) {
            var out = {
                "params"    : {
                    bossId           : options.bossId,
                    base64ImageString: options.base64ImageString
                },
                "controller": "register",
                "action"    : "updateBossImage"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 查询经营情况
         * @param options
         */
        businessSituationByDateRange: function (options) {
            var out = {
                "params"    : {
                    bossId      : options.bossId,
                    restaurantId: options.restaurantId,
                    startTime   : options.startTime,
                    endTime     : options.endTime,
                    email       : options.email
                },
                "controller": "register",
                "action"    : "businessSituationByDateRange"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 查询经营情况
         * @param options
         */
        getBossBusinessSituationByDateRange: function (options) {
            var out = {
                "params"    : {
                    bossId      : options.bossId,
                    startTime   : options.startTime,
                    endTime     : options.endTime
                },
                "controller": "register",
                "action"    : "getBossBusinessSituationByDateRange"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 查询打卡情况
         * @param options
         */
        getBossPunchInTimeOverOutTimeIntervalByDateRange: function (options) {
            var out = {
                "params"    : {
                    bossId      : options.bossId,
                    restaurantId: options.restaurantId,
                    startTime   : options.startTime,
                    endTime     : options.endTime
                },
                "controller": "staff",
                "action"    : "getBossPunchInTimeOverOutTimeIntervalByDateRange"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 获得每天的支付流水，包含了会员充值和消费
         * @param options
         */
        getDailyTransByDateRange: function (options) {
            var out = {
                "params"    : {
                    bossId      : options.bossId,
                    restaurantId: options.restaurantId,
                    startTime   : options.startTime,
                    endTime     : options.endTime,
                    email       : options.email
                },
                "controller": "register",
                "action"    : "getDailyTransByDateRange"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 获得每天的累加流水
         * @param options
         */
        getDailyTransTotalByDateRange: function (options) {
            var out = {
                "params"    : {
                    bossId      : options.bossId,
                    restaurantId: options.restaurantId,
                    startTime   : options.startTime,
                    endTime     : options.endTime,
                    email       : options.email
                },
                "controller": "register",
                "action"    : "getDailyTransTotalByDateRange"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 获得每天的lineItem流水
         * @param options
         */
        getDailyLineItemTotalByDateRange: function (options) {
            var out = {
                "params"    : {
                    bossId      : options.bossId,
                    restaurantId: options.restaurantId,
                    startTime   : options.startTime,
                    endTime     : options.endTime,
                    email       : options.email
                },
                "controller": "register",
                "action"    : "getDailyLineItemTotalByDateRange"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },



        /**
         * 获得分享设置
         * @param options
         */
        getShareAddress: function (options) {
            var out = {
                "params"    : {},
                "controller": "share",
                "action"    : "getShareAddress"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 添加分享码
         * @param options
         */
        addShareCode: function (options) {
            var out = {
                "params"    : {
                    bossId      : options.bossId,
                    restaurantId: options.restaurantId,
                    code        : options.code,
                    type        : options.type
                },
                "controller": "share",
                "action"    : "addShareCode"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 获得分享码
         * @param options
         */
        getShareCode: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId,
                    type        : options.type
                },
                "controller": "share",
                "action"    : "getShareCode"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 删除分享码
         * @param options
         */
        deleteShareCode: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId,
                    idList      : options.idList
                },
                "controller": "share",
                "action"    : "deleteShareCode"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 校验分享码
         * @param options
         */
        getShareCodeByCode: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId,
                    code        : options.code
                },
                "controller": "share",
                "action"    : "getShareCodeByCode"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 创建工单
         * @param options
         */
        sendEmailMessage: function (options) {
            var out = {
                "params"    : {
                    bossId      : options.bossId,
                    content     : options.content
                },
                "controller": "register",
                "action"    : "sendEmailMessage"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 补全店家地址
         * @param options
         */
        setRestaurantAddress: function (options) {
            var out = {
                "params"    : {
                    restaurantId : options.restaurantId,
                    lng          : options.lng,
                    lat          : options.lat,
                    type         : options.type,
                    country      : options.country,
                    province     : options.province,
                    city         : options.city,
                    address      : options.address,
                    door         : options.door,
                    district     : options.district,
                    street       : options.street,
                    street_number: options.street_number
                },
                "controller": "register",
                "action"    : "setRestaurantAddress"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 补全dinersApp信息
         * @param options
         */
        setDinersAppInfo: function (options) {
            var out = {
                "params"    : {
                    restaurantId : options.restaurantId,
                    appId        : options.appId,
                    shopId       : options.shopId,
                    address      : options.address,
                    wechatAddress: options.wechatAddress,
                    url          : options.url

                },
                "controller": "register",
                "action"    : "setDinersAppInfo"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 上传图片
         * @param options
         */
        setDinersImage: function (options) {
            var out = {
                "params"    : {
                    restaurantId : options.restaurantId,
                    base64ImageString        : options.base64ImageString,
                },
                "controller": "diners",
                "action"    : "setDinersImage"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询dinersApp信息
         * @param options
         */
        getDinersAppInfoByRId: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId,
                },
                "controller": "register",
                "action"    : "getDinersAppInfoByRId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查询dinersApp信息
         * @param options
         */
        getDinersListByRId: function (options) {
            var out = {
                "params"    : {
                    restaurantId          : options.restaurantId,
                    sex                   : options.sex,
                    minIntegration        : options.minIntegration,
                    maxIntegration        : options.maxIntegration,
                    minTime               : options.minTime,
                    maxTime               : options.maxTime,
                    minTimeIntegration    : options.minTimeIntegration,
                    maxTimeIntegration    : options.maxTimeIntegration,
                    groupId               : options.groupId,
                    dinersId              : options.dinersId,
                    getPopularCp          : options.getPopularCp,
                    getRecentlyIntegration: options.getRecentlyIntegration,
                    getLastOrderTime      : options.getLastOrderTime,
                    couponId              : options.couponId,
                    page                  : options.page,
                    listRows              : options.listRows,
                },
                "controller": "diners",
                "action"    : "getDinersListByRId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查询dinersApp信息
         * @param options
         */
        sendSmsByDinersId: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                    dinersId            : options.dinersId,
                    content             : options.content,
                },
                "controller": "diners",
                "action"    : "sendSmsByDinersId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查询dinersApp信息
         * @param options
         */
        sendSmsByDinersOption: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                    sex                 : options.sex,
                    minIntegration      : options.minIntegration,
                    maxIntegration      : options.maxIntegration,
                    minTime             : options.minTime,
                    maxTime             : options.maxTime,
                    minTimeIntegration  : options.minTimeIntegration,
                    maxTimeIntegration  : options.maxTimeIntegration,
                    groupId             : options.groupId,
                    content             : options.content,
                },
                "controller": "diners",
                "action"    : "sendSmsByDinersOption"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询dinersApp信息
         * @param options
         */
        findDinersIntegrationItem: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                    dinersId            : options.dinersId,
                },
                "controller": "diners",
                "action"    : "findDinersIntegrationItem"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         *查询所有食客会员等级
         * @param options
         */
        getAllGroup: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                },
                "controller": "diners",
                "action"    : "getAllGroup"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 添加会员等级
         * @param options
         */
        addGroup: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                    name                : options.name,
                    pName               : options.pName,
                    priority            : options.priority,
                    default             : options.default,
                },
                "controller": "diners",
                "action"    : "addGroup"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 修改会员等级
         * @param options
         */
        updateGroup: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                    name                : options.name,
                    pName               : options.pName,
                    id                  : options.id,
                    default             : options.default,
                },
                "controller": "diners",
                "action"    : "updateGroup"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 修改会员等级排序
         * @param options
         */
        sortGroup: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                    sort                : options.sort,
                },
                "controller": "diners",
                "action"    : "sortGroup"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 删除会员等级
         * @param options
         */
        deleteGroup: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                    groupId             : options.groupId,
                },
                "controller": "diners",
                "action"    : "deleteGroup"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 修改食客店铺信息
         * @param options
         */
        updateShop: function (options) {
            var out = {
                "params"    : {
                    restaurantId  : options.restaurantId,
                    name          : options.name,
                    status        : options.status,
                    desc          : options.desc,
                    cardTheme     : options.cardTheme,
                    integration   : options.integration,
                    version       : options.version,
                    integrationKey: options.integrationKey,
                    serverShopId  : options.serverShopId,
                    publicKey     : options.publicKey,
                    privateKey    : options.privateKey,
                    contact       : options.contact,
                    address_detail: options.address_detail,
                    sms_name      : options.sms_name,
                    anonymous     : options.anonymous
                },
                "controller": "diners",
                "action"    : "updateShop"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 修改食客app信息
         * @param options
         */
        updateApp: function (options) {
            var out = {
                "params"    : {
                    restaurantId  : options.restaurantId,
                    status        : options.status,
                    name          : options.name,
                    pass          : options.pass,
                    jiguang_key   : options.jiguang_key,
                    jiguang_secret: options.jiguang_secret,
                    android_link  : options.android_link,
                    ios_link      : options.ios_link,
                    google_link   : options.google_link,
                    language      : options.language,
                    cardBack      : options.cardBack,
                    color         : options.color,
                    terms_of_law  : options.terms_of_law,
                    terms_of_gain : options.terms_of_gain,
                    card_page     : options.card_page,
                    dinersPageDoc : options.dinersPageDoc,
                    dinersPagePic : options.dinersPagePic,
                },
                "controller": "diners",
                "action"    : "updateApp"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询店铺信息
         * @param options
         */
        findShopById: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                },
                "controller": "diners",
                "action"    : "findShopById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 添加消息
         * @param options
         */
        dinersAddMessage: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                    name                : options.name,
                    content             : options.content,
                    type                : options.type,
                    desc                : options.desc,
                    base64ImageString   : options.base64ImageString,
                },
                "controller": "diners",
                "action"    : "addMessage"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 修改消息
         * @param options
         */
        updateMessage: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                    name                : options.name,
                    content             : options.content,
                    messageId           : options.messageId,
                    desc                : options.desc,
                    base64ImageString   : options.base64ImageString,
                },
                "controller": "diners",
                "action"    : "updateMessage"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查询消息
         * @param options
         */
        findMessage: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                },
                "controller": "diners",
                "action"    : "findMessage"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查询单条消息
         * @param options
         */
        findMessageById: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                    messageId           : options.messageId,
                },
                "controller": "diners",
                "action"    : "findMessageById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 发送消息
         * @param options
         */
        sendMessage: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                    messageId           : options.messageId,
                    dinersArray         : options.dinersArray,
                },
                "controller": "diners",
                "action"    : "sendMessage"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 设置注册发放礼物
         * @param options
         */
        setRegisterGifts: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId,
                    integration : options.integration,
                    couponId    : options.couponId
                },
                "controller": "diners",
                "action"    : "setRegisterGifts"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 获得注册发放礼物
         * @param options
         */
        getRegisterGifts: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                },
                "controller": "diners",
                "action"    : "getRegisterGifts"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 更新食客信息
         * @param options
         */
        updateDinersInfo: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId,
                    dinersId    : options.dinersId,
                    country     : options.country,
                    postCode    : options.postCode
                },
                "controller": "diners",
                "action"    : "updateDinersInfo"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 记录登陆信息
         * @param options
         */
        addBossLogInfo: function (options) {
            var out = {
                "params"    : {
                    bossId: options.bossId,
                    type: options.type,
                    version: options.version,
                    platform: options.platform
                },
                "controller": "register",
                "action"    : "addBossLogInfo"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询登陆信息
         * @param options
         */
        getBossLogInfo: function (options) {
            var out = {
                "params"    : {
                    bossId: options.bossId,
                    type: options.type
                },
                "controller": "register",
                "action"    : "getBossLogInfo"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 设置boss权限
         * @param options
         */
        addBossRole: function (options) {
            var out = {
                "params"    : {
                    bossId: options.bossId,
                    role: options.role,
                    add_time: options.add_time,
                },
                "controller": "register",
                "action"    : "addBossRole"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 设置boss权限
         * @param options
         */
        getBossRole: function (options) {
            var out = {
                "params"    : {
                    id: options.id,
                },
                "controller": "register",
                "action"    : "getBossRole"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 测试支付
         * @param options
         */
        braintreeTest1: function (options) {
            var out = {
                "params"    : {
                    amount        : options.amount,
                    number        : options.number,
                    expirationDate: options.expirationDate,
                    cvv           : options.cvv
                },
                "controller": "braintree",
                "action"    : "braintreeTest1"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 创建注册费订单
         * @param options
         */
        createRegisterPaymentOrder: function (options) {
            var out = {
                "params"    : {
                    bossId        : options.bossId,
                },
                "controller": "ezcOrder",
                "action"    : "createRegisterPaymentOrder"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 支付注册费（brainTree）
         * @param options
         */
        registerPaymentBrainTree: function (options) {
            var out = {
                "params"    : {
                    orderId       : options.orderId,
                    creditCardId  : options.creditCardId
                },
                "controller": "ezcOrder",
                "action"    : "registerPaymentBrainTree"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 支付工单费（brainTree）
         * @param options
         */
        workOrderPaymentBrainTree: function (options) {
            var out = {
                "params"    : {
                    orderId       : options.orderId,
                    creditCardId  : options.creditCardId
                },
                "controller": "ezcOrder",
                "action"    : "workOrderPaymentBrainTree"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 支付服务费（brainTree）
         * @param options
         */
        servicePaymentBrainTree: function (options) {
            var out = {
                "params"    : {
                    orderId       : options.orderId,
                    creditCardId  : options.creditCardId
                },
                "controller": "ezcOrder",
                "action"    : "servicePaymentBrainTree"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 支付订阅费（brainTree）
         * @param options
         */
        subscribePaymentBrainTree: function (options) {
            var out = {
                "params"    : {
                    orderId       : options.orderId,
                    creditCardId  : options.creditCardId
                },
                "controller": "ezcOrder",
                "action"    : "subscribePaymentBrainTree"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 修改订阅绑定银行卡
         * @param options
         */
        updateBossSubscribeCreditCard: function (options) {
            var out = {
                "params"    : {
                    id            : options.id,
                    creditCardId  : options.creditCardId
                },
                "controller": "subscribe",
                "action"    : "updateBossSubscribeCreditCard"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 创建服务订单
         * @param options
         */
        bossAddService: function (options) {
            var out = {
                "params"    : {
                    id          : options.id,
                    restaurantId: options.restaurantId,
                    bossId      : options.bossId
                },
                "controller": "service",
                "action"    : "bossAddService"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 添加订阅
         * @param options
         */
        addSubscribe: function (options) {
            var out = {
                "params"    : {
                    name    : options.name,
                    desc    : options.desc,
                    amount  : options.amount,
                    currency: options.currency,
                    type    : options.type,
                    time    : options.time,
                    timeUnit: options.timeUnit,
                    subscribe: options.subscribe
                },
                "controller": "subscribe",
                "action"    : "addSubscribe"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 删除订阅
         * @param options
         */
        deleteSubscribe: function (options) {
            var out = {
                "params"    : {
                    id: options.id
                },
                "controller": "subscribe",
                "action"    : "deleteSubscribe"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询订阅
         * @param options
         */
        getAllSubscribe: function (options) {
            var out = {
                "params"    : {},
                "controller": "subscribe",
                "action"    : "getAllSubscribe"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询订阅
         * @param options
         */
        getSubscribeByRestaurantId: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId
                },
                "controller": "subscribe",
                "action"    : "getSubscribeByRestaurantId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询订阅
         * @param options
         */
        bossAddSubscribe: function (options) {
            var out = {
                "params"    : {
                    id          : options.id,
                    restaurantId: options.restaurantId,
                    bossId      : options.bossId
                },
                "controller": "subscribe",
                "action"    : "bossAddSubscribe"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询订阅金额
         * @param options
         */
        getBossAddSubscribePrice: function (options) {
            var out = {
                "params"    : {
                    id          : options.id,
                    restaurantId: options.restaurantId,
                    bossId      : options.bossId
                },
                "controller": "subscribe",
                "action"    : "getBossAddSubscribePrice"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询订阅
         * @param options
         */
        bossAddCustomSubscribe: function (options) {
            var out = {
                "params"    : {
                    subscribe   : options.subscribe,
                    restaurantId: options.restaurantId,
                    bossId      : options.bossId
                },
                "controller": "subscribe",
                "action"    : "bossAddCustomSubscribe"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 取消订阅
         * @param options
         */
        cancelSubscribe: function (options) {
            var out = {
                "params"    : {
                    id          : options.id
                },
                "controller": "subscribe",
                "action"    : "cancelSubscribe"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 自动订阅
         * @param options
         */
        autoSubscribe: function (options) {
            var out = {
                "params"    : {
                    restaurantId: options.restaurantId,
                },
                "controller": "subscribe",
                "action"    : "autoSubscribe"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询本月需要自动订阅的店
         * @param options
         */
        getAutoSubscribeRestaurant: function (options) {
            var out = {
                "params"    : {},
                "controller": "subscribe",
                "action"    : "getAutoSubscribeRestaurant"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 自动订阅
         * @param options
         */
        updateRestaurantCreditCard: function (options) {
            var out = {
                "params"    : {
                    id          : options.id,
                    restaurantId: options.restaurantId,
                    bossId: options.bossId
                },
                "controller": "creditCard",
                "action"    : "updateRestaurantCreditCard"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 查询订单
         * @param options
         */
        getOrderByOptions: function (options) {
            var out = {
                "params"    : options,
                "controller": "ezcOrder",
                "action"    : "getOrderByOptions"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 获得所有APP
         * @param options
         */
        getAllApp: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "getAllApp"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 获得一段时间食客APP的用户
         * @param options
         */
        getSomeDiners: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "getSomeDiners"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 获得一段时间食客APP的用户
         * @param options
         */
        getSomeDinersAddress: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "getSomeDinersAddress"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 设置请求地址
         * @param options
         */
        setServerRequestInfo: function (options) {
            var out = {
                "params"    : options,
                "controller": "request",
                "action"    : "setServerRequestInfo"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 获得kds状态列表
         * @param options
         */
        getKdsInfoByRId: function (options) {
            var out = {
                "params"    : options,
                "controller": "request",
                "action"    : "getKdsInfoByRId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 获得打印机状态列表
         * @param options
         */
        getPrinterInfoByRId: function (options) {
            var out = {
                "params"    : options,
                "controller": "request",
                "action"    : "getPrinterInfoByRId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 更新请求信息
         * @param options
         */
        updateServerRequestInfo: function (options) {
            var out = {
                "params"    : options,
                "controller": "request",
                "action"    : "updateServerRequestInfo"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 更新请求信息
         * @param options
         */
        getServerRequestInfo: function (options) {
            var out = {
                "params"    : options,
                "controller": "request",
                "action"    : "getServerRequestInfo"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 更改注册状态
         * @param options
         */
        changeRegisterPaymentStatus: function (options) {
            var out = {
                "params"    : options,
                "controller": "ezcOrder",
                "action"    : "changeRegisterPaymentStatus"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 开通关闭错单功能
         * @param options
         */
        changeRegisterWrongOrderStatus: function (options) {
            var out = {
                "params"    : options,
                "controller": "register",
                "action"    : "changeRegisterWrongOrderStatus"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 开通关闭邀请功能
         * @param options
         */
        changeRegisterInvitationStatus: function (options) {
            var out = {
                "params"    : options,
                "controller": "register",
                "action"    : "changeRegisterInvitationStatus"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 开通关闭错单功能
         * @param options
         */
        changeBossWrongOrderStatus: function (options) {
            var out = {
                "params"    : options,
                "controller": "register",
                "action"    : "changeBossWrongOrderStatus"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 开通关闭邀请功能
         * @param options
         */
        changeBossInvitationStatus: function (options) {
            var out = {
                "params"    : options,
                "controller": "register",
                "action"    : "changeBossInvitationStatus"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 数据更新
         * @param options
         */
        updateData20190304: function (options) {
            var out = {
                "params"    : options,
                "controller": "register",
                "action"    : "updateData20190304"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 更改boss状态
         * @param options
         */
        setBossStatus: function (options) {
            var out = {
                "params"    : options,
                "controller": "register",
                "action"    : "setBossStatus"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询发送信息情况
         * @param options
         */
        getBossSmsRecords: function (options) {
            var out = {
                "params"    : options,
                "controller": "register",
                "action"    : "getBossSmsRecords"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 删除食客app的主体boss账号
         * @param options
         */
        deleteDinersBossById: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "deleteDinersBossById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询食客app短信情况
         * @param options
         */
        getDinersSmsRecords: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "getDinersSmsRecords"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询食客app短信情况
         * @param options
         */
        getDinersSmsRecordsByRestaurantId: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "getDinersSmsRecordsByRestaurantId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询食客app短信情况
         * @param options
         */
        getDinersSmsCountByRestaurantId: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "getDinersSmsCountByRestaurantId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询食客app短信情况
         * @param options
         */
        sendDinersSmsCountByRestaurantId: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "sendDinersSmsCountByRestaurantId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询食客app的主体boss账号
         * @param options
         */
        getDinersBoss: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "getDinersBoss"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 设置食客app的主体boss账号
         * @param options
         */
        setDinersBoss: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "setDinersBoss"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 设置食客短信价格
         * @param options
         */
        setDinersSmsPrice: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "setDinersSmsPrice"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 设置食客短信价格
         * @param options
         */
        getDinersSmsPrice: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "getDinersSmsPrice"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 生成食客短信订单
         * @param options
         */
        addDinersSmsOrder: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "addDinersSmsOrder"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 生成食客短信订单
         * @param options
         */
        getDinersSmsTrans: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "getDinersSmsTrans"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 生成食客短信订单
         * @param options
         */
        getAppCreditCardByRid: function (options) {
            var out = {
                "params"    : options,
                "controller": "appCreditCard",
                "action"    : "getAppCreditCardByRid"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 支付食客短信价格
         * @param options
         */
        dinersSmsPaymentBrainTree: function (options) {
            var out = {
                "params"    : options,
                "controller": "ezcOrder",
                "action"    : "dinersSmsPaymentBrainTree"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 设置微信支付
         * @param options
         */
        setWeChatPayChannel: function (options) {
            var out = {
                "params"    : options,
                "controller": "wechatChannel",
                "action"    : "setWeChatPayChannel"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 读取微信支付
         * @param options
         */
        getWeChatPayChannel: function (options) {
            var out = {
                "params"    : options,
                "controller": "wechatChannel",
                "action"    : "getWeChatPayChannel"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 扫码支付
         * @param options
         */
        prePay_Wechat_scan: function (options) {
            var out = {
                "params"    : options,
                "controller": "ezcPay",
                "action"    : "prePay_Wechat_scan"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 积分支付
         * @param options
         */
        prePay_Integral: function (options) {
            var out = {
                "params"    : options,
                "controller": "ezcPay",
                "action"    : "prePay_Integral"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 确认支付结果
         * @param options
         */
        getWindPrePayTransById: function (options) {
            var out = {
                "params"    : options,
                "controller": "ezcPay",
                "action"    : "getWindPrePayTransById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * RoyalPay创建二维码订单
         * @param options
         */
        createQrCodeOrder_RoyalPay: function (options) {
            var out = {
                "params"    : options,
                "controller": "royalPay",
                "action"    : "createQrCodeOrder_RoyalPay"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * RoyalPay创建扫码订单
         * @param options
         */
        createMicroPayOrder_RoyalPay: function (options) {
            var out = {
                "params"    : options,
                "controller": "royalPay",
                "action"    : "createMicroPayOrder_RoyalPay"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * OmiPay创建二维码订单
         * @param options
         */
        createQrCodeOrder_OmiPay: function (options) {
            var out = {
                "params"    : options,
                "controller": "omiPay",
                "action"    : "createQrCodeOrder_OmiPay"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * suPay创建二维码订单
         * @param options
         */
        createQrCodeOrder_suPay: function (options) {
            var out = {
                "params"    : options,
                "controller": "suPay",
                "action"    : "createQrCodeOrder_suPay"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 修改订阅
         * @param options
         */
        updateSubscribeAndOrder: function (options) {
            var out = {
                "params"    : options,
                "controller": "subscribe",
                "action"    : "updateSubscribeAndOrder"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 重新发送通知
         * @param options
         */
        sendOrderEmailAndSms: function (options) {
            var out = {
                "params"    : options,
                "controller": "ezcOrder",
                "action"    : "sendOrderEmailAndSms"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 下载invoice
         * @param options
         */
        downloadOrderInvoiceByOrderId: function (options) {
            var out = {
                "params"    : options,
                "controller": "ezcOrder",
                "action"    : "downloadOrderInvoiceByOrderId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 创建新版本
         * @param options
         */
        addVersion: function (options) {
            var out = {
                "params"    : options,
                "controller": "version",
                "action"    : "addVersion"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 查询新版本
         * @param options
         */
        getVersion: function (options) {
            var out = {
                "params"    : options,
                "controller": "version",
                "action"    : "getVersion"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 更新新版本
         * @param options
         */
        updateVersion: function (options) {
            var out = {
                "params"    : options,
                "controller": "version",
                "action"    : "updateVersion"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 删除新版本
         * @param options
         */
        deleteVersion: function (options) {
            var out = {
                "params"    : options,
                "controller": "version",
                "action"    : "deleteVersion"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 下载订单
         * @param options
         */
        downloadEzcOrderEmail: function (options) {
            var out = {
                "params"    : options,
                "controller": "ezcOrder",
                "action"    : "downloadEzcOrderEmail"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 注册邀请
         * @param options
         */
        addRegisterInvitation: function (options) {
            var out = {
                "params"    : options,
                "controller": "register",
                "action"    : "addRegisterInvitation"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询注册邀请
         * @param options
         */
        getRegisterInvitationByOptions: function (options) {
            var out = {
                "params"    : options,
                "controller": "register",
                "action"    : "getRegisterInvitationByOptions"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 添加订单
         * @param options
         */
        bossAddInvitation: function (options) {
            var out = {
                "params"    : options,
                "controller": "register",
                "action"    : "bossAddInvitation"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 支付邀请费（brainTree）
         * @param options
         */
        invitationPaymentBrainTree: function (options) {
            var out = {
                "params"    : {
                    orderId       : options.orderId,
                    creditCardId  : options.creditCardId
                },
                "controller": "ezcOrder",
                "action"    : "invitationPaymentBrainTree"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 重发邀请短信邮件
         * @param options
         */
        reSendInvitationEmailAndSms: function (options) {
            var out = {
                "params"    : {
                    invitationId       : options.invitationId
                },
                "controller": "ezcOrder",
                "action"    : "reSendInvitationEmailAndSms"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 移除邀请
         * @param options
         */
        deleteInvitationById: function (options) {
            var out = {
                "params"    : {
                    invitationId       : options.invitationId
                },
                "controller": "register",
                "action"    : "deleteInvitationById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 邀请注册
         * @param options
         */
        invitationRegister: function (options) {
            var out = {
                "params"    : {
                    invitationId: options.invitationId,
                    email       : options.email,
                    pass        : options.pass
                },
                "controller": "register",
                "action"    : "invitationRegister"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询采购商
         * @param options
         */
        getPurchaseItemById: function (options) {
            var out = {
                "params": {
                    id      : options.id
                },
                "controller": "purchase",
                "action"    : "getPurchaseItemById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询采购商产品
         * @param options
         */
        getPurchaseById: function (options) {
            var out = {
                "params": {
                    id      : options.id
                },
                "controller": "purchase",
                "action"    : "getPurchaseById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询采购商产品
         * @param options
         */
        getPurchaseItemByPurchaseId: function (options) {
            var out = {
                "params": {
                    purchaseId      : options.purchaseId,
                    sort            : options.sort,
                },
                "controller": "purchase",
                "action"    : "getPurchaseItemByPurchaseId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查询采购商产品
         * @param options
         */
        getPurchaseItemPrice: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "getPurchaseItemPrice"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 采购商产品关联原料
         * @param options
         */
        setPurchaseItemCpMaterialGroup: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "setPurchaseItemCpMaterialGroup"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 采购关联原料添加restaurant_id
         * @param options
         */
        changeItemMaterialGroupRestaurant: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "changeItemMaterialGroupRestaurant"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询采购商
         * @param options
         */
        getPurchaseList: function (options) {
            var out = {
                "params": {
                    restaurantId      : options.restaurantId,
                    getItem           : options.getItem
                },
                "controller": "purchase",
                "action"    : "getPurchaseList"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 批量修改采购商状态
         * @param options
         */
        changePurchaseType: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "changePurchaseType"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 添加央厨
         * @param options
         */
        addCenterPurchase: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "addCenterPurchase"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 修改央厨
         * @param options
         */
        updateCenterPurchase: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "updateCenterPurchase"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 央厨登录
         * @param options
         */
        loginCenterPurchase: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "loginCenterPurchase"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 央厨修改密码
         * @param options
         */
        setCenterPurchasePassword: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "setCenterPurchasePassword"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 获取供应商/央厨列表
         * @param options
         */
        getAllPurchaseList: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "getAllPurchaseList"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 获取供应商/央厨列表
         * @param options
         */
        getStorageTotalPriceByRid: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "getStorageTotalPriceByRid"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 复制供应商和产品
         * @param options
         */
        copyPurchaseAndItem: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "copyPurchaseAndItem"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 获得店铺列表
         * @param options
         */
        getPurchaseRestaurantList: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "getRestaurantList"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 获得boss列表
         * @param options
         */
        getBossList: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "getBossList"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 创建采购商
         * @param options
         */
        addPurchase: function (options) {
            var out = {
                "params": {
                    bossId      : options.bossId,
                    restaurantId: options.restaurantId,
                    name        : options.name,
                    logo        : options.logo,
                    email       : options.email,
                    tel         : options.tel,
                    fax         : options.fax,
                    abn         : options.abn,
                    address     : options.address,
                    check       : options.check
                },
                "controller": "purchase",
                "action"    : "addPurchase"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 修改采购商
         * @param options
         */
        updatePurchase: function (options) {
            var out = {
                "params": {
                    id          : options.id,
                    name        : options.name,
                    logo        : options.logo,
                    email       : options.email,
                    tel         : options.tel,
                    fax         : options.fax,
                    abn         : options.abn,
                    address     : options.address,
                    check       : options.check
                },
                "controller": "purchase",
                "action"    : "updatePurchase"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 删除采购商
         * @param options
         */
        deletePurchase: function (options) {
            var out = {
                "params": {
                    id          : options.id
                },
                "controller": "purchase",
                "action"    : "deletePurchase"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 删除采购商
         * @param options
         */
        deletePurchaseArray: function (options) {
            var out = {
                "params": {
                    idArray          : options.idArray
                },
                "controller": "purchase",
                "action"    : "deletePurchaseArray"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 添加采购商产品
         * @param options
         */
        addPurchaseItem: function (options) {
            var out = {
                "params": {
                    purchaseId          : options.purchaseId,
                    name                : options.name,
                    price               : options.price,
                    unit                : options.unit,
                    sort                : options.sort,
                    materialGroup       : options.materialGroup,
                    special_price       : options.special_price,
                    show                : options.show,
                },
                "controller": "purchase",
                "action"    : "addPurchaseItem"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 修改采购商产品
         * @param options
         */
        updatePurchaseItem: function (options) {
            var out = {
                "params": {
                    id                  : options.id,
                    name                : options.name,
                    price               : options.price,
                    unit                : options.unit,
                    sort                : options.sort,
                    special_price       : options.special_price,
                    show                : options.show,
                },
                "controller": "purchase",
                "action"    : "updatePurchaseItem"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 修改采购商产品
         * @param options
         */
        updatePurchaseItemArray: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "updatePurchaseItemArray"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 修改采购商产品
         * @param options
         */
        updatePurchaseItemPriceArray: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "updatePurchaseItemPriceArray"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 修改采购商产品
         * @param options
         */
        updatePurchaseItemShowArray: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "updatePurchaseItemShowArray"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 添加采购商产品
         * @param options
         */
        addPurchaseItemArray: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "addPurchaseItemArray"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 删除采购商
         * @param options
         */
        deletePurchaseItem: function (options) {
            var out = {
                "params": {
                    id: options.id
                },
                "controller": "purchase",
                "action"    : "deletePurchaseItem"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 删除采购商
         * @param options
         */
        deletePurchaseItemArray: function (options) {
            var out = {
                "params": {
                    idArray          : options.idArray
                },
                "controller": "purchase",
                "action"    : "deletePurchaseItemArray"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 添加采购单
         * @param options
         */
        addPurchaseOrder: function (options) {
            var out = {
                "params": {
                    purchaseId      : options.purchaseId,
                    restaurantId    : options.restaurantId,
                    bossId          : options.bossId,
                    check           : options.check,
                    delivery_date   : options.delivery_date,
                    remark          : options.remark,
                    code            : options.code,
                    lineItem        : options.lineItem
                },
                "controller": "purchase",
                "action"    : "addPurchaseOrder"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询采购单
         * @param options
         */
        getPurchaseOrderByOptions: function (options) {
            var out = {
                "params": {
                    purchaseId         : options.purchaseId,
                    orderId            : options.orderId,
                    bossId             : options.bossId,
                    restaurantId       : options.restaurantId,
                    start              : options.start,
                    end                : options.end,
                    id                 : options.id,
                    status             : options.status,
                    storage_status     : options.storage_status,
                    delivery_date_start: options.delivery_date_start,
                    delivery_date_end  : options.delivery_date_end,
                },
                "controller": "purchase",
                "action"    : "getPurchaseOrderByOptions"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查询采购单
         * @param options
         */
        getPurchaseOrderItemByOptions: function (options) {
            var out = {
                "params": {
                    purchaseId         : options.purchaseId,
                    orderId            : options.orderId,
                    bossId             : options.bossId,
                    restaurantId       : options.restaurantId,
                    start              : options.start,
                    end                : options.end,
                    id                 : options.id,
                    status             : options.status,
                    storage_status     : options.storage_status,
                    delivery_date_start: options.delivery_date_start,
                    delivery_date_end  : options.delivery_date_end,
                    hasItem            : options.hasItem,
                },
                "controller": "purchase",
                "action"    : "getPurchaseOrderItemByOptions"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查询央厨采购单
         * @param options
         */
        getCenterPurchaseOrderByOptions: function (options) {
            var out = {
                "params": {
                    purchaseId         : options.purchaseId,
                    orderId            : options.orderId,
                    bossId             : options.bossId,
                    restaurantId       : options.restaurantId,
                    start              : options.start,
                    end                : options.end,
                    id                 : options.id,
                    status             : options.status,
                    storage_status     : options.storage_status,
                    delivery_date_start: options.delivery_date_start,
                    delivery_date_end  : options.delivery_date_end,
                    hasItem            : options.hasItem,
                },
                "controller": "purchase",
                "action"    : "getCenterPurchaseOrderByOptions"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询采购单
         * @param options
         */
        sendPurchaseOrderEmail: function (options) {
            var out = {
                "params": {
                    orderId     : options.orderId
                },
                "controller": "purchase",
                "action"    : "sendPurchaseOrderEmail"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 修改采购单
         * @param options
         */
        updatePurchaseOrderLineItem: function (options) {
            var out = {
                "params": {
                    id              : options.id,
                    bossId          : options.bossId,
                    status          : options.status,
                    lineItem        : options.lineItem,
                    delivery_date   : options.delivery_date,
                    remark          : options.remark,
                },
                "controller": "purchase",
                "action"    : "updatePurchaseOrderLineItem"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 采购单出库
         * @param options
         */
        editPurchaseOrderOutbound: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "editPurchaseOrderOutbound"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 修改采购单
         * @param options
         */
        purchaseLoginForNow: function (options) {
            var out = {
                "params": {
                    account          : options.account,
                    password          : options.password
                },
                "controller": "purchase",
                "action"    : "purchaseLoginForNow"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询优惠券
         * @param options
         */
        findCouponByShopId: function (options) {
            var out = {
                "params"    : {
                    restaurantId : options.restaurantId,
                    show         : options.show,
                    getDinersCoupon : options.getDinersCoupon
                },
                "controller": "diners",
                "action"    : "findCouponByShopId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 添加优惠券
         * @param options
         */
        addCoupon: function (options) {
            var out = {
                "params"    : {
                    restaurantId    : options.restaurantId,
                    name            : options.name,
                    type            : options.type,
                    value           : options.value,
                    startTime       : options.startTime,
                    endTime         : options.endTime,
                    limit           : options.limit,
                    dinersLimit     : options.dinersLimit,
                    ratio           : options.ratio,
                    ratioValue      : options.ratioValue,
                    desc            : options.desc,
                    status          : options.status,
                },
                "controller": "diners",
                "action"    : "addCoupon"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询优惠券订单
         * @param options
         */
        getOrderByDinersCouponId: function (options) {
            var out = {
                "params"    : {
                    restaurantId   : options.restaurantId,
                    dinersCouponId : options.dinersCouponId,
                },
                "controller": "diners",
                "action"    : "getOrderByDinersCouponId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查询优惠券订单
         * @param options
         */
        grantCouponToDiners: function (options) {
            var out = {
                "params"    : {
                    restaurantId    : options.restaurantId,
                    dinersId        : options.dinersId,
                    couponId        : options.couponId,
                },
                "controller": "diners",
                "action"    : "grantCouponToDiners"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 优惠券上下架
         * @param options
         */
        updateCouponById: function (options) {
            var out = {
                "params"    : {
                    restaurantId    : options.restaurantId,
                    couponId        : options.couponId,
                    status          : options.status,
                },
                "controller": "diners",
                "action"    : "updateCouponById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 优惠券 是否显示
         * @param options
         */
        updateCouponShowById: function (options) {
            var out = {
                "params"    : {
                    restaurantId    : options.restaurantId,
                    couponId        : options.couponId,
                    show            : options.show,
                },
                "controller": "diners",
                "action"    : "updateCouponShowById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 优惠券 图片
         * @param options
         */
        updateCouponPicById: function (options) {
            var out = {
                "params"    : {
                    restaurantId    : options.restaurantId,
                    couponId        : options.couponId,
                    pic             : options.pic
                },
                "controller": "diners",
                "action"    : "updateCouponPicById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 优惠券 描述
         * @param options
         */
        updateCouponDescById: function (options) {
            var out = {
                "params"    : {
                    restaurantId    : options.restaurantId,
                    couponId        : options.couponId,
                    desc            : options.desc
                },
                "controller": "diners",
                "action"    : "updateCouponDescById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查询食客优惠劵
         * @param options
         */
        findDinerCouponByUserId: function (options) {
            var out = {
                "params"    : {
                    restaurantId    : options.restaurantId,
                    dinersId        : options.dinersId,
                },
                "controller": "diners",
                "action"    : "findDinerCouponByUserId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 添加采购入库单
         * @param options
         */
        addPurchaseStorage: function (options) {
            var out = {
                "params": {
                    purchaseId      : options.purchaseId,
                    bossId          : options.bossId,
                    restaurantId    : options.restaurantId,
                    remark          : options.remark,
                    photo           : options.photo,
                    lineItem        : options.lineItem,
                    storageTime     : options.storageTime
                },
                "controller": "purchase",
                "action"    : "addPurchaseStorage"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 添加采购入库单
         * @param options
         */
        addPurchaseStorageByMaterial: function (options) {
            var out = {
                "params": {
                    purchaseId      : options.purchaseId,
                    bossId          : options.bossId,
                    restaurantId    : options.restaurantId,
                    remark          : options.remark,
                    photo           : options.photo,
                    materialGroup   : options.materialGroup,
                    storageTime     : options.storageTime
                },
                "controller": "purchase",
                "action"    : "addPurchaseStorageByMaterial"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询采购单
         * @param options
         */
        getPurchaseStorageByOptions: function (options) {
            var out = {
                "params": {
                    purchaseId          : options.purchaseId,
                    purchaseOrderId     : options.purchaseOrderId,
                    bossId              : options.bossId,
                    restaurantId        : options.restaurantId,
                    start               : options.start,
                    end                 : options.end,
                    id                  : options.id,
                    status              : options.status
                },
                "controller": "purchase",
                "action"    : "getPurchaseStorageByOptions"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 修改采购单
         * @param options
         */
        updatePurchaseStorage: function (options) {
            var out = {
                "params": {
                    id              : options.id,
                    status          : options.status,
                    lineItem        : options.lineItem,
                    photo           : options.photo,
                    remark          : options.remark,
                    storageTime     : options.storageTime,
                },
                "controller": "purchase",
                "action"    : "updatePurchaseStorage"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 添加采购账单
         * @param options
         */
        addPurchaseStatement: function (options) {
            var out = {
                "params": {
                    purchaseId          : options.purchaseId,
                    bossId              : options.bossId,
                    restaurantId        : options.restaurantId,
                    start               : options.start,
                    end                 : options.end,
                    desc                : options.desc,
                    purchaseStorageArray: options.purchaseStorageArray
                },
                "controller": "purchase",
                "action"    : "addPurchaseStatement"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询采购单
         * @param options
         */
        sendPurchaseStatementEmail: function (options) {
            var out = {
                "params": {
                    id     : options.id
                },
                "controller": "purchase",
                "action"    : "sendPurchaseStatementEmail"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询采购账单
         * @param options
         */
        getPurchaseStatementByOptions: function (options) {
            var out = {
                "params": {
                    purchaseId          : options.purchaseId,
                    bossId              : options.bossId,
                    restaurantId        : options.restaurantId,
                    start               : options.start,
                    end                 : options.end,
                    income_status       : options.income_status,
                    id                  : options.id
                },
                "controller": "purchase",
                "action"    : "getPurchaseStatementByOptions"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查询采购账单
         * @param options
         */
        editPurchaseStatementById: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "editPurchaseStatementById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 更新采购账单
         * @param options
         */
        editPurchaseStatementAll: function (options) {
            var out = {
                "params": options,
                "controller": "purchase",
                "action"    : "editPurchaseStatementAll"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 获得短信条数
         * @param options
         */
        getSmsCountByRId: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "getSmsCountByRId"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 设置版本总开关
         * @param options
         */
        setVersionSwitch: function (options) {
            var out = {
                "params"    : options,
                "controller": "version",
                "action"    : "setVersionSwitch"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 读取版本总开关
         * @param options
         */
        getVersionSwitch: function (options) {
            var out = {
                "params"    : options,
                "controller": "version",
                "action"    : "getVersionSwitch"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 设置是否发送短信和邮件
         * @param options
         */
        setOrderEmailAndSms: function (options) {
            var out = {
                "params"    : options,
                "controller": "ezcOrder",
                "action"    : "setOrderEmailAndSms"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 读取是否发送短信和邮件
         * @param options
         */
        getOrderEmailAndSms: function (options) {
            var out = {
                "params"    : options,
                "controller": "ezcOrder",
                "action"    : "getOrderEmailAndSms"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 设置是否发送短信和邮件
         * @param options
         */
        getSmsOrderEmailAndSms: function (options) {
            var out = {
                "params"    : options,
                "controller": "ezcOrder",
                "action"    : "getSmsOrderEmailAndSms"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 读取是否发送短信和邮件
         * @param options
         */
        setSmsOrderEmailAndSms: function (options) {
            var out = {
                "params"    : options,
                "controller": "ezcOrder",
                "action"    : "setSmsOrderEmailAndSms"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 获得版本可用状态
         * @param options
         */
        getVersionStatus: function (options) {
            var out = {
                "params"    : options,
                "controller": "version",
                "action"    : "getVersionStatus"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 大数据获得一段时间支付流水的和
         * @param options
         */
        getTransTotal_bigData: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getTransTotal_bigData"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 大数据获得一段时间人数的和
         * @param options
         */
        getOrderPersonCountTotal_bigData: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getOrderPersonCountTotal_bigData"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 获得一段时间点餐的数量和
         * @param options
         */
        getLineItemTotal_bigData: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getLineItemTotal_bigData"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 获得流水一段时间每个指定时段的流水平均值
         * @param options
         */
        getTransByTimeRangeOfDailyDateRange_bigData: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getTransByTimeRangeOfDailyDateRange_bigData"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 获得订单数量和人数
         * @param options
         */
        getOrderPersonCountByDateRange_bigData: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getOrderPersonCountByDateRange_bigData"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 获得支付类型数量
         * @param options
         */
        getPayTypeCount: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getPayTypeCount"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 获得菜品数量
         * @param options
         */
        getLineItemByTime: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getLineItemByTime"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 获得菜品数量并存文件
         * @param options
         */
        getLineItemByTimeSaveTxt: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getLineItemByTimeSaveTxt"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 获得菜品数量并存文件
         * @param options
         */
        getLineItemByTimeTxt: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getLineItemByTimeTxt"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 获得所有店的流水和
         * @param options
         */
        getRestaurantTrans_bigData: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getRestaurantTrans_bigData"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 缓存数据
         * @param options
         */
        saveEveryDayData_bigData: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "saveEveryDayData_bigData"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 缓存数据
         * @param options
         */
        saveEveryMonthData_bigData: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "saveEveryMonthData_bigData"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询缓存的数据
         * @param options
         */
        getEveryDayData_bigData: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getEveryDayData_bigData"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询缓存的数据
         * @param options
         */
        getEveryMonthData_bigData: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getEveryMonthData_bigData"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 初始化缓存
         * @param options
         */
        initEveryDayData_bigData: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "initEveryDayData_bigData"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 初始化缓存
         * @param options
         */
        initEveryMonthData_bigData: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "initEveryMonthData_bigData"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },


        /**
         * 设置时间减多少秒
         * @param options
         */
        setBigDataDelay: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "setBigDataDelay"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 读取时间减多少秒
         * @param options
         */
        getBigDataDelay: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getBigDataDelay"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 获取有问题的订单
         * @param options
         */
        getErrorOrder: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getErrorOrder"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 获取有问题的优惠券
         * @param options
         */
        getTokenList: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getTokenList"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 获取有问题的优惠券
         * @param options
         */
        getErrorTokenOrder: function (options) {
            var out = {
                "params"    : options,
                "controller": "bigData",
                "action"    : "getErrorTokenOrder"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 云端通过手机号快速添加食客用户
         * @param options
         */
        windQuickRegisterByMobile: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "windQuickRegisterByMobile"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 云端给线下会员发送绑定线上食客的分享码
         * @param options
         */
        windSendMemberMobileDinersIdSmsMsg: function (options) {
            var out = {
                "params"    : options,
                "controller": "diners",
                "action"    : "windSendMemberMobileDinersIdSmsMsg"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询优惠券订单
         * @param options
         */
        grantCouponToDinersByOptions: function (options) {
            var out = {
                "params"    : {
                    restaurantId          : options.restaurantId,
                    couponId              : options.couponId,
                    sex                   : options.sex,
                    minIntegration        : options.minIntegration,
                    maxIntegration        : options.maxIntegration,
                    minTime               : options.minTime,
                    maxTime               : options.maxTime,
                    minTimeIntegration    : options.minTimeIntegration,
                    maxTimeIntegration    : options.maxTimeIntegration,
                    groupId               : options.groupId,
                },
                "controller": "diners",
                "action"    : "grantCouponToDinersByOptions"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询dinersApp信息
         * @param options
         */
        testSendSmsByDinersOption: function (options) {
            var out = {
                "params"    : {
                    restaurantId        : options.restaurantId,
                    sex                 : options.sex,
                    minIntegration      : options.minIntegration,
                    maxIntegration      : options.maxIntegration,
                    minTime             : options.minTime,
                    maxTime             : options.maxTime,
                    minTimeIntegration  : options.minTimeIntegration,
                    maxTimeIntegration  : options.maxTimeIntegration,
                    groupId             : options.groupId,
                    content             : options.content,
                    disableDinersArray  : options.disableDinersArray
                },
                "controller": "diners",
                "action"    : "testSendSmsByDinersOption"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },

        /**
         * 查询优惠券订单
         * @param options
         */
        testGrantCouponToDinersByOptions: function (options) {
            var out = {
                "params"    : {
                    restaurantId          : options.restaurantId,
                    couponId              : options.couponId,
                    sex                   : options.sex,
                    minIntegration        : options.minIntegration,
                    maxIntegration        : options.maxIntegration,
                    minTime               : options.minTime,
                    maxTime               : options.maxTime,
                    minTimeIntegration    : options.minTimeIntegration,
                    maxTimeIntegration    : options.maxTimeIntegration,
                    groupId               : options.groupId,
                    getPopularCp          : options.getPopularCp,
                    getRecentlyIntegration: options.getRecentlyIntegration,
                    getLastOrderTime      : options.getLastOrderTime,
                    disableDinersArray    : options.disableDinersArray
                },
                "controller": "diners",
                "action"    : "testGrantCouponToDinersByOptions"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
        /**
         * 查询优惠券
         * @param options
         */
        findCouponById: function (options) {
            var out = {
                "params"    : {
                    restaurantId : options.restaurantId,
                    id           : options.id,
                },
                "controller": "diners",
                "action"    : "findCouponById"
            };
            request(out, options.successFunction, options.errorFunction, options.completeFunction);
        },
    }

}();