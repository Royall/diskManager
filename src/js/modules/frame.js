/**
 * Created by Yangz on 2016/3/1.
 */
define([
    'jquery',
    'underscore',
    "controls/Common",
    "text!../../template/head.html",
    "text!../../template/sidemenu.html",
    'controls/Dialog',
    'i18n/' + global.language
], function ($, _, Common, template, sideTemp, Dialog, Lang) {

    if (!window.global) {
        return {
            init: function () {
            }
        }
    }

    if (!window.global.corpList || (window.global.corpList && !window.global.corpList.length)) {
        window.global.corpList = [{
            "corpId": 0,
            "domain": "",
            "name": "",
            "outDate": 0,
            "pageIndex": 0,
            "pageSize": 0,
            "status": 0,
            "storage": 0,
            "userLimit": 0
        }]
    }

    return {
        init: function () {
            this.renderSidebar();
            this.renderHead();
            this.initEvents();
            this.initStyle();
        },
        ui: {
            companyUl: '#company-ul',
            companySelect: '#company-select',
            userInfo: '#userInfo'
        },
        initEvents: function () {
            var me = this;

            $(me.ui.companyUl).find('li a').on('click', function () {
                var corpId = $(this).data('corpid');
                if (corpId == me.model.corpId) {
                    return
                }
                var urlObj = Common.parseURL(location.href);
                location.href = urlObj.file + '?corpId=' + corpId;
                return false;
            });

            $(me.ui.companySelect).on('click', function () {
                $(me.ui.companyUl).toggle();
            });

            $(me.ui.userInfo).on('click', function () {
                me.showInfo();
            });

            $(window).off('resize.frame').on('resize.frame', this.initStyle);

        },
        model: {
            corpId: Common.getCorpId(),
            corpList: window.global.corpList
        },
        renderHead: function () {
            var me = this;
            var nowCorp = Common.getCorpData();
            try {
                var data = _.extend({
                    logoUrl:[Common.getUrlByName('getCorpLogo'),'&corpId=',me.model.corpId].join('')
                }, window.global.user, {
                    corpName: nowCorp.name,
                    corpList: me.model.corpList,
                    logoutUrl: window.global.logoutUrl || 'javascript:;'
                });

                var tpl = Common.getTemplate(template, '#head-tpl');
                var html = Common.tpl2Html(tpl, data);
                $(".topHead").html(html);
                $(me.ui.companySelect).find('.fake_slt_txt').text(nowCorp.name);

            } catch (e) {
                Dialog.alert(Lang.common.sysTips, Lang.common.getComInfoFail, function () {
                    location.href = global.logoutUrl;
                });
            }


        },
        showInfo: function () {
            var nowCorp = _.extend({}, Common.getCorpData());

            nowCorp.outDate = Common.getOutDate(nowCorp.outDate);
            nowCorp.storage = Common.formatStorageUnit(nowCorp.storage);
            nowCorp.userLimit = nowCorp.userLimit + Lang.setting.userUnit;
            nowCorp.status = Common.getStatus(nowCorp.status);

            var userData = _.extend({
                name: '',
                email: '',
                mobile: ''
            }, global.user);

            var data = {
                userData: userData,
                corpData: nowCorp
            };

            var tpl = Common.getTemplate(template, '#userInfo-tpl');
            var html = Common.tpl2Html(tpl, data);

            Dialog.pop({
                title: Lang.head.uncInfo,
                content: html,
                width: 400
            });

        },
        renderSidebar: function () {
            var corpId = this.model.corpId || this.model.corpList[0].corpId;

            var html = Common.tpl2Html(sideTemp, {moduleName:window.moduleName,corpId:corpId});
            $(".sidebar").html(html);

        },
        initStyle: function () {
            var headH = $('.topHead').height();
            var windowH = $(window).height();
            var mainH = windowH - headH;
            var minH = 360;
            (mainH < minH) && (mainH = minH);
            global.height = mainH;
            var listH = mainH - 120 - 55;
            var tdH = parseInt(listH / 10, 10);
            var styleHtml = [
                '.wrapper,.sidebar,.subSiderBar,.rightContainer{height:', mainH, 'px}'
                //'#depart-wrap{height:', (mainH - 100), 'px}',
                //'.usermanager .tableList td,.setting .tableList td{line-height:', tdH - 12 - 2, 'px}'
            ];
            Common.addStyle('frame', styleHtml.join(''));
        }
    };

});