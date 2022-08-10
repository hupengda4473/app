var mineJS = function () {
  /**
   * 主要方法 开始---------------------------------------------------------------------------------------------
   * */
  /**
   * 登陆页，注册按钮
   * */
  var mainRegisterPageRegistered = function () {
    refreshRegisterPage();
    bossJS.showPage($('#registerPage'));
  };
  /**
   * 主要方法 结束---------------------------------------------------------------------------------------------
   * */
  /**
   * 数据刷新 开始---------------------------------------------------------------------------------------------
   * */
  /**
   * 获得一个boss用户
   * */
  var getBossById = function (id, fun) {
    var options = {
      id: id
    };
    var timeStr = new Date().getTime();
    requestTimeMarkObj.SubscribeToDetailsPageTime = timeStr;
    bossJS.showLoadingPage_section('#SubscribeToDetailsPage .withdrawingFlowDetailsPageCont');
    options.successFunction = function (data) {
      if (requestTimeMarkObj.SubscribeToDetailsPageTime !== timeStr) {
        return
      }
      bossJS.hideLoadingPage_section('#SubscribeToDetailsPage .withdrawingFlowDetailsPageCont');
      if (data.error) {
        bossJS.showErrorFunction(data.errmsg[0]);
      } else {
        if (fun) {
          fun(data.data);
        }
      }
    };
    options.errorFunction = function () {
      if (requestTimeMarkObj.SubscribeToDetailsPageTime !== timeStr) {
        return
      }
      bossJS.hideLoadingPage_section('#SubscribeToDetailsPage .withdrawingFlowDetailsPageCont');
      bossJS.showOrdinaryBlackBar('<span class="language" data-language="Network_connection_is_not_good_please_try_again">网络连接不好，请重试</span>');
    };
    cloudSystem.getBossById(options);
  };
  /**
   * 数据刷新 结束---------------------------------------------------------------------------------------------
   * */
  /**
   * 页面刷新 开始---------------------------------------------------------------------------------------------
   * */
  /**
   * 刷新注册页
   * */
  var refreshRegisterPage = function () {
    var registerPage = $('#registerPage');
    registerPage.find('.areaName').html('<span class="language" data-language="Australia" data-function="toChooseCountryRegion">澳大利亚</span>');
    registerPage.find('.areaNumber').html('+61').data('area', 61);
    registerPage.find('input').val('');
    Language.setLanguage(registerPage);
  };
  /**
   * 页面刷新 结束---------------------------------------------------------------------------------------------
   * */
  /**
   * 封装方法 开始---------------------------------------------------------------------------------------------
   * */
  /**
   * 封装方法 结束---------------------------------------------------------------------------------------------
   * */
  return {
    /**
     * 登陆页，注册按钮
     * */mainRegisterPageRegistered: function () {
      mainRegisterPageRegistered();
    },
  }
}();