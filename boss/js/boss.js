/**
 * 接口请求时间记录（重复请求时，防止页面刷新混乱）
 * */
var requestTimeMarkObj = {
  showTodayChartTime: null,                           //今日流水页
};
var clickArea;
var historyList = [];
var bossJS = function () {
  var lastPage_record = null;
  var slidingList = {};
  clickArea = {
    /**
     * 返回按钮
     * */backButton: function () {
      backFunction();
    },
    /**
     * 报错弹出层，点击确认
     * */errorPopupLayerTrue: function () {
      $('.errorPopupLayer').fadeOut();
    },
    /**
     * 更新特殊弹窗，取消按钮
     * */specialUpdatePromptLayerCancelBtn: function () {
      var specialUpdatePromptLayer = $('.specialUpdatePromptLayer');
      specialUpdatePromptLayer.fadeOut();
      var updatePromptLayer = $('.updatePromptLayer');
      updatePromptLayer.fadeOut();
    },
    /**
     * 弹窗提示，取消按钮
     * */errorPopupLayerTwoBtnCancelBtn: function () {
      var errorPopupLayerTwoBtn = $('.errorPopupLayerTwoBtn');
      errorPopupLayerTwoBtn.hide();
    },
    /**
     * 导航按钮,餐厅
     * */restaurantBtn: function () {
      /*var mainIndexPage = $('#mainIndexPage');
       mainIndexPage.find('.refreshRemind').hide();
       showPage(mainIndexPage);*/
      var shopStatePage = $('#shopStatePage');
      shopStatePage.find('.refreshRemind').hide();
      bossJS.showPage(shopStatePage);
    },
    /**
     * 导航按钮,发现
     * */findBtn: function () {
      bossJS.showPage($('#discoveryPage'));
    },
    /**
     * 导航按钮,服务
     * */serviceBtn: function () {
      bossJS.showPage($('#servicePage'));
    },
    /**
     * 导航按钮,账户
     * */accountBtn: function () {
      bossJS.showPage($('#accountPage'));
    },
    /**
     * 登陆页，登陆按钮
     * */mainRegisterPageRegisterBtn: function () {
      // $("input").blur();
      bossJS.showLoadingPage_section('#mainRegisterPage');
      bossJS.hideLoadingPage_section('#mainRegisterPage');
      bossJS.showErrorFunction('模拟登录成功');
      let shopStatePage = $('#shopStatePage');
      showPage(shopStatePage);
    },
    /**
     * 登陆页，记住密码按钮
     * */mainRegisterPageRememberPwdBox: function (obj) {
      if (obj.closest('.rememberPwdBox').find('.checkIco').hasClass('active')) {
        obj.closest('.rememberPwdBox').find('.checkIco').removeClass('active')
      } else {
        obj.closest('.rememberPwdBox').find('.checkIco').addClass('active')
      }
    },
    /**
     * 登陆页，点击右上角选择服务器
     * */mainRegisterPageAreaBtn: function (obj) {
      let mainRegisterPage = $('#mainRegisterPage');
      mainRegisterPage.find('.maskLayerStyle').fadeIn();
      mainRegisterPage.find('.chooseAreaPopupLayer').fadeIn();
    },
    /**
     * 登陆页，选择服务器
     * */mainRegisterPageAreaInfo: function (obj) {
      let mainRegisterPage = $('#mainRegisterPage');
      mainRegisterPage.find('.maskLayerStyle').fadeOut();
      mainRegisterPage.find('.chooseAreaPopupLayer').fadeOut();
    },
    /**
     * 登陆页，点击萌布
     * */mainRegisterPageMaskLayerStyle: function () {
      let mainRegisterPage = $('#mainRegisterPage');
      mainRegisterPage.find('.maskLayerStyle').fadeOut();
      mainRegisterPage.find('.chooseAreaPopupLayer').fadeOut();
      mainRegisterPage.find('.setLanguagePopupLayer').fadeOut();
    },
    /**
     * 首页，异常订单
     * */subAbnormalOrderPage: function () {
      var subAbnormalOrderPage = $('#subAbnormalOrderPage');
      showPage(subAbnormalOrderPage);
      var start = timeJS.getTimeFormLocal(0);
      var end = timeJS.getTimeFormLocal(0);
      subAbnormalOrderPage.find('.dataBtn').data('start', start).data('end', end);
      subAbnormalOrderPage.find('.date').html(timeJS.getTimeStrFormLocal(0) + '——' + timeJS.getTimeStrFormLocal(0));
    },
    /**
     * 首页，异常订单
     * */mainIndexPageMarkingWrongOrders: function () {
      var markWrongListPage = $('#markWrongListPage');
      bossJS.showPage(markWrongListPage);
      markWrongListPage.find('.kdsBtn').data('time', privateToolsJS.time.getDateStr(new Date().getTime()).substring(0, 10));
      markWrongListPage.find('.kdsBtn span').html(privateToolsJS.time.getDateStr(new Date().getTime()).substring(0, 10));
      markWrongListPage.find('.captionDate').html(privateToolsJS.time.getDateStr(new Date().getTime()).substring(0, 10));
    },
  };
  /*记录浏览历史，给页面的返回按钮，和手机自带的返回按钮，可以返回到上一页*/
  var history_record = function (e) {
    /************用于防止push 进重复页面 *****/
    if (e && e != lastPage_record) {
      //TODO:记得打开
      //history.pushState({label:e});
      lastPage_record = e;
      //alert("PUSHED:"+e);
    }
    history.pushState({label: e}, "");
  };
  /*显示登陆页*/
  var showMainRegisterPage = function () {
    $('.noNetPopupLayer').hide();
    var mainRegisterPage = $('#mainRegisterPage');
    historyList = [];
    showPage(mainRegisterPage);
    mainRegisterPage.find('.maskLayerStyle').hide();
    mainRegisterPage.find('.pwdWrongPopupLayer').hide();
    mainRegisterPage.find('.setLanguagePopupLayer').hide();
    mainRegisterPage.find('.checkIco ').removeClass('active');
  };
  /**
   * 显示页面
   * */
  var showPage = function (obj, option) {
    // Language.setLanguage(obj);
    var record = null;
    if (option) {
      record = option.record
    }
    if (!record) {
      var key = "";
      for (var i = historyList.length - 1; i >= 0; i--) {
        if (historyList[i] == obj.attr('id')) {
          key = i;
          break;
        }
      }
      if (key != "") {
        historyList.splice(key, historyList.length - key);
      }
      historyList.push(obj[0].id);
      history_record(obj.attr('id'));
    }
    $('.waitPopupLayer').hide();
    $('.main-page').hide();
    obj.show();
    if (!option) {
      obj.find('.slideBox').scrollTop(0);
    }
    //弹性滑动
    /*switch (bossJS.getPageNow()) {
        case 'withholdingWaterPage':
            bossJS.slidingInertia($('#withholdingWaterPage').find('.withholdingWaterPageCont'), true);
            break;
    }*/
  };
  /*给页面所有带有data-function的节点添加事件*/
  var bindEvent = function () {
    var falg = false;
    //原料拖动用的坐标
    var coordinate = {
      x: 0,
      y: 0,
      dom: null,
      top: 0
    };
    $(document).addClass('test').on('touchstart touchmove touchend', function (ev) {//给document添加点击事件代理
      switch (event.type) {
        case 'touchstart':
          falg = false;
          //原料拖动排序
          if (getPageNow() === 'takeInventoryPage' && $(ev.target).hasClass('sortIco')) {
            coordinate.x = ev.originalEvent.changedTouches[0].clientX * 1;
            coordinate.y = ev.originalEvent.changedTouches[0].clientY * 1;
            coordinate.dom = $(ev.target);
            coordinate.top = parseInt(($(ev.target).closest('li').css('top') === 'auto' ? 0 : $(ev.target).closest('li').css('top')) || 0);
            $(ev.target).closest('li').css('z-index', 2).siblings().css('z-index', 1);
          } else {
            coordinate = {
              x: 0,
              y: 0,
              dom: null,
              top: 0
            };
          }
          break;
        case 'touchmove':
          falg = true;
          //分组管理滑动排序
          if (coordinate.dom) {
            var moveFirstPointY = ev.originalEvent.changedTouches[0].clientY * 1;
            purchasingJS.groupManagementPageMCETouchMove(coordinate.dom.closest('li'), (coordinate.top + moveFirstPointY - coordinate.y));
          }
          break;
        case 'touchend':
          if (!falg) {
            /*if (ev.target.localName !== 'input' && ev.target.localName !== 'textarea') {
                if (document.activeElement) {
                    document.activeElement.blur();
                }
            }*/
            if ($(ev.target).closest('.jsInputBox').length <= 0) {
              if (document.activeElement) {
                document.activeElement.blur();
              }
            } else {
              if (ev.target.localName === 'input' || ev.target.localName === 'textarea') {
                $(ev.target).focus();
              }
            }
            if ($(ev.target).closest('.chooseOptionsCont').length <= 0) {
              var chooseOptionsLayer = $('.chooseOptionsLayer:visible');
              if (chooseOptionsLayer.length > 0) {
                chooseOptionsLayer.hide();
                $('#' + bossJS.getPageNow()).find('.filterBox .filterOption').removeClass('active');
                return
              }
            }
            if ($(ev.target).closest('.shopListBox').length <= 0) {
              var shopListLayer = $('.shopListLayer:visible');
              if (shopListLayer.length > 0) {
                shopListLayer.hide();
                return
              }
            }
            for (a in clickArea) {
              if ($(ev.target).data('function') == a) {
                clickArea[a]($(ev.target), ev);
              }
            }
          }
          //横向滑动
          if ($(ev.target).closest('.horizontalScrollBox').length > 0) {
            var width = $(ev.target).closest('.horizontalScrollBox').find('.horizontalScrollBody').width();
            var scrollLeft = $(ev.target).closest('.horizontalScrollBox').scrollLeft();
            if (scrollLeft < (width - 720) / 2) {
              $(ev.target).closest('.horizontalScrollBox').stop().animate({scrollLeft: 0}, 200);
            } else {
              $(ev.target).closest('.horizontalScrollBox').siblings().stop().animate({scrollLeft: 0}, 200);
              $(ev.target).closest('.horizontalScrollBox').stop().animate({scrollLeft: (width - 720)}, 200);
            }
          }
          //分组管理滑动排序
          if (coordinate.dom) {
            var endPointY = ev.originalEvent.changedTouches[0].clientY * 1;
            purchasingJS.groupManagementPageMCETouchEnd(coordinate.dom.closest('li'), (coordinate.top + endPointY - coordinate.y));
          }
          break;
      }
    });
    $(function () {
      FastClick.attach(document.body);
    });
  };
  /**
   * input事件
   * */
  var inputEvent = function () {
    $('#takeInventoryPage').on('input', 'input', function () {
      this.value = this.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      this.value = this.value.replace(/^\./g, ""); //验证第一个字符是数字而不是
      this.value = this.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
      this.value = this.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      this.value = this.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    });
  };
  /**
   * 防止input事件穿透
   * */
  var eventsThrough = function () {
    var inputClick = false;
    $(document).on('touchstart touchmove touchend', 'input', function (ev) {//给document添加点击事件代理
      switch (event.type) {
        case 'touchstart':
          inputClick = false;
          break;
        case 'touchmove':
          inputClick = true;
          break;
        case 'touchend':
          if (!inputClick) {
            $(ev.target).removeAttr('readonly').focus();
          }
          break;
      }
    });
    var textAreaClick = false;
    $(document).on('touchstart touchmove touchend', 'textarea', function (ev) {//给document添加点击事件代理
      switch (event.type) {
        case 'touchstart':
          textAreaClick = false;
          break;
        case 'touchmove':
          textAreaClick = true;
          break;
        case 'touchend':
          if (!textAreaClick) {
            $(ev.target).removeAttr('readonly').focus();
          }
          break;
      }
    });
    //控制穿透问题
    $(document).on('blur', 'input', function () {
      var _this = $(this);
      _this.attr('readonly', 'readonly');
    });
    $(document).on('blur', 'textarea', function () {
      var _this = $(this);
      _this.attr('readonly', 'readonly');
    });
    $('input').blur();
    $('textarea').blur();
  };
  /*取出cookie*/
  function getCookie(c_name) {
    if (document.cookie.length > 0) {
      var c_start = document.cookie.indexOf(c_name + "=");
      var c_end = null;
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start, c_end))
      }
    }
    return ""
  }
  var setCookie = function (name, value, seconds) {
    seconds = seconds || 0;   //seconds有值就直接赋值，没有为0，这个根php不一样。
    var expires = "";
    if (seconds != 0) {      //设置cookie生存时间
      var date = new Date();
      date.setTime(date.getTime() + (seconds * 1000));
      expires = "; expires=" + date.toGMTString();
    }
    var array = window.location.hostname.split(".");
    document.cookie = name + "=" + escape(value) + expires + "; path=/" + "; domain=" + array[array.length - 2] + "." + array[array.length - 1];   //转码并赋值
  };
  /**
   * 裁图
   * */
  var imgCut = function (option) {
    $(option.container).photoClip({
      size: option.size,
      outputSize: option.outputSize,
      file: option.file,
      view: "",
      ok: option.ok,
      loadStart: function () {
        if (debug) {
          console.log("照片读取中");
        }
        option.loadStart();
      },
      loadComplete: function () {
        if (debug) {
          console.log("照片读取完成");
        }
        option.loadComplete();
      },
      clipFinish: function (dataURL) {
        option.clipFinish(dataURL)
      }
    });
  };
  /**
   * 初始化裁图
   * */
  var initCutImg = function () {
    var options_icon = {
      container: '#clipArea_box_ico',
      size: [520, 520],
      outputSize: [129, 129],
      file: "#subImgCutForLogoPageIco",
      ok: "#subImgCutForLogoPageTrueBtn",
      loadStart: function () {
        $('.waitPopupLayer').show();
      },
      loadComplete: function () {
        $('.waitPopupLayer').hide();
        bossJS.showPage($('#subImgCutForLogoPage'));
      },
      clipFinish: function (data) {
        var options = {};
        options.bossId = userInfo.id;
        options.base64ImageString = data;
        $('.waitPopupLayer').show();
        options.successFunction = function (data) {
          $('.waitPopupLayer').show();
          if (debug) {
            console.log('修改邮箱 返回', data);
          }
          if (data.error) {
            bossJS.showErrorFunction(data.errmsg[0]);
          } else {
            userInfo = data.data;
          }
        };
        cloudSystem.updateBossImage(options);
      }
    };
  };
  /*添加弹性滑动(必须在页面显示完之后)*/
  var slidingInertia = function (obj, options) {
    var slideUp = false;
    if (options) {
      slideUp = options;
    }
    if (obj) {
      var id = obj.attr('class');
      if (obj.parent('div').attr('id') != id + 'slidingBox') {
        var height = obj.height();
        obj.before('<div class = "slidingBox" id="' + id + 'slidingBox" style="overflow:hidden;width:100%;height:' + height + 'px;"></div>');
        obj.appendTo('#' + id + 'slidingBox');
        obj.css('height', 'auto');
        slidingList[id + 'slidingBox'] = null;
        slidingList[id + 'slidingBox'] = new IScroll_page('#' + id + 'slidingBox', {
          probeType: 3,
          mouseWheel: true
        });
        if (!$('.' + id).find('.refresh')[0]) {
          $('.' + id).prepend('<div class="refresh"><div class="ico"></div></div>');
          $('.' + id).css({
            'margin-top': '-145px'
          });
        }
        if (slideUp) {
          if (!$('.' + id).find('.refresh')[1]) {
            $('.' + id).append('<div class="refresh"><div class="ico"></div></div>');
            $('.' + id).css({
              'margin-bottom': '-145px'
            });
          }
        }
        var slidingType = "";
        var endY = 0;
        var yBool = 0;
        var H = 0;
        var h = 0;
        slidingList[id + 'slidingBox'].on("scroll", function () {
          var y = (this.y).toFixed(0);
          if (slidingType == 'slideDown') {
            if (endY > 145) {
              if (y > 145) {
                this.maxScrollY = this.wrapperHeight * (1) - this.scrollerHeight * (1);
                return "";
              } else if (y <= 145 && y > 0) {
                $('.' + id).css({
                  'margin-top': y * (-1)
                });
                this.maxScrollY = this.wrapperHeight * (1) - this.scrollerHeight * (1) - 145;
                $('.' + id).find('.refresh')[0].remove();
                $('.' + id).prepend('<div class="refresh refreshing"><div class="ico"></div></div>');
                var refreshFunction = getPageNow();
                if (refreshing) {
                  refreshing = false;
                  refreshFunctionList[refreshFunction](function () {
                    $('.' + id).find('.refresh')[0].remove();
                    $('.' + id).prepend('<div class="refresh success"><div class="ico active"></div></div>');
                    setTimeout(function () {
                      endY = 0;
                      slidingList[id + 'slidingBox'].maxScrollY = slidingList[id + 'slidingBox'].wrapperHeight * (1) - slidingList[id + 'slidingBox'].scrollerHeight * (1);
                      $('.' + id).animate({
                        'margin-top': '-145px'
                      }, 410, function () {
                        $('.' + id).find('.refresh').remove();
                        slidingList[id + 'slidingBox'].refresh();
                        if (!$('.' + id).find('.refresh')[0]) {
                          $('.' + id).prepend('<div class="refresh"><div class="ico"></div></div>');
                          $('.' + id).css({
                            'margin-top': '-145px'
                          });
                          if (slideUp) {
                            $('.' + id).append('<div class="refresh"><div class="ico"></div></div>');
                            $('.' + id).css({
                              'margin-bottom': '-145px'
                            });
                          }
                        }
                        refreshing = true;
                      });
                    }, 1000);
                  });
                }
                return "";
              }
            } else {
              this.isAnimating = true;
              if (y > 145) {
                $('.' + id).find('.refresh .ico').removeClass('rotateStart').addClass('rotateEnd');
              } else {
                $('.' + id).find('.refresh .ico').removeClass('rotateEnd').addClass('rotateStart');
              }
            }
          } else if (slidingType == 'slideUp') {
            if (endY < yBool) {
              if (y < yBool) {
                this.maxScrollY = this.wrapperHeight * (1) - this.scrollerHeight * (1);
                return "";
              } else if (y >= yBool && y < h) {
                $('.' + id).css({
                  'margin-top': (yBool - y + 16) + (-145)
                });
                this.maxScrollY = this.wrapperHeight * (1) - this.scrollerHeight * (1) - 145;
                $('.' + id).find('.refresh')[1].remove();
                $('.' + id).append('<div class="refresh refreshing"><div class="ico"></div></div>');
                var loadFunction = getPageNow();
                if (refreshing) {
                  refreshing = false;
                  loadFunctionList[loadFunction](function () {
                    $('.' + id).find('.refresh')[1].remove();
                    $('.' + id).append('<div class="refresh success"><div class="ico active"></div></div>');
                    setTimeout(function () {
                      endY = 0;
                      slidingList[id + 'slidingBox'].maxScrollY = slidingList[id + 'slidingBox'].wrapperHeight * (1) - slidingList[id + 'slidingBox'].scrollerHeight * (1);
                      $('.' + id).animate({
                        //'margin-top': '-290px'
                      }, 410, function () {
                        $('.' + id).find('.refresh').remove();
                        slidingList[id + 'slidingBox'].refresh();
                        if (!$('.' + id).find('.refresh')[0]) {
                          $('.' + id).prepend('<div class="refresh"><div class="ico"></div></div>');
                          $('.' + id).css({
                            'margin-top': '-145px'
                          });
                          if (slideUp) {
                            $('.' + id).append('<div class="refresh"><div class="ico"></div></div>');
                            $('.' + id).css({
                              'margin-bottom': '-145px'
                            });
                          }
                        }
                        refreshing = true;
                      });
                    }, 1000);
                  });
                }
                return "";
              }
            } else {
              this.isAnimating = true;
              if (y < yBool) {
                $('.' + id).find('.refresh .ico').removeClass('rotateEnd').addClass('rotateStart');
              } else {
                $('.' + id).find('.refresh .ico').removeClass('rotateStart').addClass('rotateEnd');
              }
            }
          }
        });
        slidingList[id + 'slidingBox'].on("slideDown", function () {
          slidingType = 'slideDown';
          endY = this.y;
          //console.log('slideDown', endY);
        });
        if (slideUp) {
          slidingList[id + 'slidingBox'].on("slideUp", function () {
            slidingType = 'slideUp';
            endY = this.y;
            h = $('.' + id).height();
            H = $('#' + id + "slidingBox").height();
            yBool = h - H;
            yBool = (yBool - 145) * (-1);
          });
        }
      } else {
        $('.' + id).find('.refresh').remove();
        slidingList[id + 'slidingBox'].refresh();
        slidingList[id + 'slidingBox'].scrollTo(0, 0);
        if (!$('.' + id).find('.refresh')[0]) {
          $('.' + id).prepend('<div class="refresh"><div class="ico"></div></div>');
          $('.' + id).css({
            'margin-top': '-145px'
          });
        }
        if (slideUp) {
          if (!$('.' + id).find('.refresh')[1]) {
            $('.' + id).append('<div class="refresh"><div class="ico"></div></div>');
            $('.' + id).css({
              'margin-bottom': '-145px'
            });
          }
        }
        refreshing = true;
      }
    }
  };//
  /*手机自带的返回按钮*/
  var backwardEventHandle = function () {
    window.onpopstate = function () {
      backFunction();
    }
  };
  /*获得当前显示的页面*/
  var getPageNow = function () {
    var pageId = "";
    $('.main-page').each(function () {
      var page = $(this);
      if (page.css('display') == "block") {
        pageId = page.attr('id');
        return false
      }
    });
    return pageId
  };
  /**
   * 统一报错
   * */
  var showErrorFunction = function (str) {
    var errorPopupLayer = $('.errorPopupLayer');
    errorPopupLayer.find('.title').html(str);
    Language.setLanguage(errorPopupLayer);
    errorPopupLayer.show();
    var h = errorPopupLayer.find('.errorMaskLayerCont').height();
    errorPopupLayer.find('.errorMaskLayerCont').css('margin-top', '-' + h / 2 + 'px');
  };
  /**
   * 弹窗提示 两个按钮
   * */
  var showErrorPopupLayerTwoBtn = function (str, fun) {
    var errorPopupLayerTwoBtn = $('.errorPopupLayerTwoBtn');
    errorPopupLayerTwoBtn.find('.cont').html('').append('<span>' + str + '</span>');
    Language.setLanguage(errorPopupLayerTwoBtn);
    errorPopupLayerTwoBtn.show();
    var h = errorPopupLayerTwoBtn.find('.errorBox').height();
    errorPopupLayerTwoBtn.find('.errorBox').css('margin-top', '-' + h / 2 + 'px');
    errorPopupLayerTwoBtn.find('.true').off('click').on('click', function () {
      errorPopupLayerTwoBtn.fadeOut();
      if (fun) {
        fun();
      }
    });
  };
  /**
   * 通用小黑条提示
   * */
  var showOrdinaryBlackBar = function (str) {
    var blackBarPage = $('<div class="blackBarPage" style="display:none;">\n' +
            '    <div class="SuccessfulHints">修改成功~</div>\n' +
            '</div>');
    blackBarPage.find('.SuccessfulHints').html('').append(str);
    // Language.setLanguage(blackBarPage);
    $('body').append(blackBarPage);
    blackBarPage.fadeIn();
    setTimeout(function () {
      blackBarPage.fadeOut();
      setTimeout(function () {
        blackBarPage.remove();
      }, 200);
    }, 1618)
  };
  /**
   * 返回方法
   * */
  var backFunction = function () {
    if (historyList.length < 2) {
      return console.log('没有更早的记录了！');
    }
    if (historyList[historyList.length - 1] === 'workSheetSubmitPage') {
      return
    }
    historyList.pop();
    showPage($('#' + historyList[historyList.length - 1]), {record: true});
    //选店页刷新页面
    if (bossJS.getPageNow() === 'chooseABranchPage') {
      mineJS.getBossById({'id': userInfo.id}, function (data) {
        userInfo = data;
        mineJS.refreshChooseABranchPage();
      });
    }
  };
  /**
   * 显示等待页（部分刷新）
   *  @param parentStr 插入等待页的位置
   *  @param parentCenter 是否相对与父级居中（默认是相对于屏幕居中）可以不传
   * */
  var showLoadingPage_section = function (parentStr, parentCenter) {
    if (hideLoadingPageTimeoutObj[parentStr]) {
      clearTimeout(hideLoadingPageTimeoutObj[parentStr]);
    }
    var parentDom = $(parentStr);
    if (parentDom.find('.waitPopupLayer_section').length > 0 && parentDom.find('.waitPopupLayer_section:first').css('display') === 'block') {
      return
    }
    var windowHeight = document.body.clientHeight;
    var waitDom = $('<div class="waitPopupLayer_section" style="display: block;">' +
            '               <div class="imgBox">' +
            '                   <img src="images/waitLogo.gif" alt="wait" class="waitLogo" />' +
            '                   <p class="wait language" data-language="loading">正在努力加载中···</p>' +
            '               </div>' +
            '           </div>');
    Language.setLanguage(waitDom);
    var overflowSet = parentDom.data('overflow') || parentDom.css('overflow');
    parentDom.data('overflow', overflowSet);
    waitDom.css({
      background: 'rgba(255, 255, 255, 0.7)',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      "z-index": 999999
    });
    if (parentCenter) {
      waitDom.find('.imgBox').css({
        width: "100%",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)"
      });
    } else {
      waitDom.find('.imgBox').css({
        width: "100%",
        position: "fixed",
        top: (windowHeight - 178 - 96) / 2 + 'px',
      });
    }
    waitDom.find('.waitLogo').css({
      display: 'block',
      margin: '0 auto'
    });
    waitDom.find('.wait').css({
      "width": "100%",
      "height": "96px",
      "line-height": "96px",
      "text-align": "center",
      "font-size": "2.4em",
      "color": "#000",
    });
    parentDom.css({
      position: 'relative',
      overflow: 'hidden'
    }).scrollTop(0);
    parentDom.find('.waitPopupLayer_section').remove();
    parentDom.append(waitDom);
  };
  /**
   * 显示等待页（部分刷新）
   * */
  var hideLoadingPageTimeoutObj = {};
  var hideLoadingPage_section = function (parentStr) {
    hideLoadingPageTimeoutObj[parentStr] = setTimeout(function () {
      var parentDom = $(parentStr);
      var overflowSet = parentDom.data('overflow');
      if (overflowSet) {
        parentDom.css('overflow', overflowSet);
      }
      parentDom.find('.waitPopupLayer_section').remove();
    }, 10);
  };
  /**封装函数******************************************************************************/
  return {
    init: function () {
      var goFun = function () {
        showMainRegisterPage()
        backwardEventHandle();//手机自带的返回按钮
        bindEvent();//给页面所有带有data-function的节点添加事件
        inputEvent();
        initCutImg();
      };
      goFun();
    },
    showPage: function (obj) {
      showPage(obj);
    },
    getPageNow: function () {
      return getPageNow();
    },
    slidingInertia: function (obj, options) {
      slidingInertia(obj, options);
    },
    getCookie: function (name) {
      return getCookie(name);
    },
    setCookie: function (name, value, seconds) {
      setCookie(name, value, seconds);
    },

    showErrorFunction: function (str) {
      showErrorFunction(str);
    },
    showErrorPopupLayerTwoBtn: function (str, fun) {
      showErrorPopupLayerTwoBtn(str, fun);
    },
    showOrdinaryBlackBar: function (str) {
      showOrdinaryBlackBar(str);
    },
    backFunction: function () {
      backFunction();
    },
    showLoadingPage_section: function (parentStr, parentCenter) {
      showLoadingPage_section(parentStr, parentCenter);
    },
    hideLoadingPage_section: function (parentStr) {
      hideLoadingPage_section(parentStr);
    },
  }
}();