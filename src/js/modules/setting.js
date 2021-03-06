/**
 * Created by Yangz on 2016/3/1.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    "validate",
    "controls/Common",
    "controls/List",
    'controls/Ajax',
    "controls/Pager",
    "controls/Dialog",
    "text!../../template/setting.html",
    'i18n/' + global.language,
    "dropkick",
    'CryptoJS',
    'WebUploader'
], function ($, _, Backbone, validate, Common, List, Ajax, Pager, Dialog, tpl, Lang, dropkick, CryptoJS, WebUploader) {

    window.global = window.global || {user: {}, corpList: {}};

    var sLang = Lang.setting,
        cLang = Lang.common;

    var Module = {
        nowModule: {},
        callModule: function (module) {
            var param = Array.prototype.slice.call(arguments, 0);
            param.shift();
            var nowModuleDestroyFn = this.nowModule.destroy;
            var newModuleInitFn = module.init;
            if (newModuleInitFn && _.isFunction(newModuleInitFn)) {
                nowModuleDestroyFn && _.isFunction(nowModuleDestroyFn) && nowModuleDestroyFn.apply(this.nowModule);
                this.nowModule = module;
                newModuleInitFn.apply(module, param);
            }
        }
    };


    var Setting = {
        el: '.mainContent',
        model: {
            corpId: Common.getCorpId(),
            corpData: Common.getCorpData()
        },
        init: function () {
            this.render();
            Backbone.history.start();
        },
        render: function () {
            var t = Common.getTemplate(tpl, '#setting-tpl');
            $(this.el).html(Common.tpl2Html(t, {}));
            Common.placeholder();
        }
    };

    //网盘设置-企业管理
    Setting.companyManage = {
        el: '#companyManage',

        init: function () {
            //this.listCompany.init();
            Module.callModule(this.listCompany);
            $('.secMenu li[data-id=companyManage]').show();
            this.initEvents();
            this.isInitialized = true;

        },

        initEvents: function () {
            if (this.isInitialized) {
                return
            }
            var me = this;
            $(this.el).find('.opera_back a').on('click', function () {
                //me.init();
                Module.callModule(me);
            });

            var seaInput = $('.seaInput');
            seaInput.on('keyup', function (e) {
                if (e.keyCode == 13) {
                    if (seaInput.val()) {
                        me.listCompany.getData(1);
                    } else {
                        Dialog.tips(sLang.typeKeyword);
                    }
                } else if (((e.ctrlKey && e.keyCode == 88) || e.keyCode == 8 || e.keyCode == 46) && seaInput.val() == '') {
                    Module.callModule(me);
                }
            })
                .on('blur', function () {
                    seaInput.val('')
                });
        },

        //网盘设置-企业管理-企业列表
        listCompany: {
            el: "#listCompany",
            ui: {
                companyType: '#company-type',
                companyBtn: '#company-btn',
                companyAdd: '#company-add'
            },
            init: function () {

                $(this.el).show().siblings().hide();
                this.initSelect();
                this.initEvents();
                this.initList();
                this.initBtn();
                this.initStyle();
                this.pageNo = 1;
                this.pageSize = 20;
                this.isInitialized = true;

                $('.searchBox').show();


                this.getData(0);

                $(window).off('resize.setting').on('resize.setting', this.initStyle);

                //this.renderList();
            },

            initSelect: function () {
                if (this.isInitialized) {
                    return
                }
                $(this.ui.companyType).dropkick();
            },

            initEvents: function () {
                var me = this;
                if (this.isInitialized) {
                    return
                }
                //筛选企业
                $(this.ui.companyType).on('change', function () {
                    var status = $(this).val();
                    me.pageNo = 1;
                    me.getData(0, status);
                });

                //暂停企业
                $(this.ui.companyBtn).on('click', function () {
                    var selected = me.list.getSelected();
                    if (!selected.length) {
                        Dialog.tips(sLang.selectCompany);
                        return;
                    }

                    Dialog.confirm(cLang.tips, sLang.confirmLock, function () {
                        me.updateCorpStatus(selected);
                    });

                });

                //添加企业
                $(this.ui.companyAdd).on('click', function () {
                    Module.callModule(Setting.companyManage.addCompany);
                    //Setting.companyManage.addCompany.init();
                });
            },

            initList: function () {
                var me = this;
                var conf = {
                    container: '#company-list',
                    data: [],
                    hasCheckBtn: true,
                    key: 'corpId',
                    columns: [
                        {
                            columnId: 'name',
                            columnName: sLang.companyName,
                            titleStyle: '',
                            titleAttr: 'width="20%"',
                            callback: function (value) {
                                return ['<span class="tf"><a data-action="showDetail" href="javascript:;" title="', value, '">', value, '</a></span>'].join('')
                            },
                            action: 'showDetail',
                            onClick: $.proxy(me.showDetail, me)
                        },
                        {
                            columnId: 'domain',
                            columnName: sLang.domain,
                            titleStyle: '',
                            titleAttr: 'width="15%"',
                            callback: function () {
                                return ""
                            }
                        },
                        {
                            columnId: 'status',
                            columnName: sLang.status,
                            titleStyle: '',
                            titleAttr: 'width="10%"',
                            callback: function (v) {
                                return Common.getStatus(v);
                            }
                        },
                        {
                            columnId: 'expireDate',
                            columnName: sLang.timeout,
                            titleStyle: '',
                            titleAttr: 'width="15%"',
                            callback: function (v,data) {
                                // return '<span'+ (data.status==1?' class="red"':'')+'>'+Common.getOutDate(v)+'</span>';
                                return '<span'+ (data.isExpired?' class="red"':'')+'>'+(v?v.split(' ')[0]:Lang.setting.forever)+'</span>';
                            }
                        },
                        {
                            columnId: 'storage',
                            columnName: sLang.space,
                            titleStyle: '',
                            titleAttr: 'width="15%"',
                            callback: function (v) {
                                return Common.formatStorageUnit(v);
                            }
                        },
                        {
                            columnId: 'userLimit',
                            columnName: sLang.userLimit,
                            titleStyle: '',
                            titleAttr: 'width="10%"',
                            callback: function (v) {
                                return v + sLang.userUnit;
                            }
                        }
                    ],
                    operate: {
                        columnName: cLang.operate,
                        titleStyle: '',
                        titleAttr: 'width="15%"',
                        list: [
                            {name: cLang.edit, action: 'edit', className: 'mr_10', onClick: $.proxy(me.edit, me)},
                            {
                                name: Lang.sideBar.logManager,
                                action: 'logManage',
                                className: 'mr_10',
                                onClick: $.proxy(me.logManage, me)
                            },
                            {name: cLang.del, action: 'del', className: 'mr_10', onClick: $.proxy(me.del, me)}
                        ]
                    }
                };

                this.list = this.list || new List(conf);
            },

            initBtn: function () {
                var role = global.user.role;
                if (role != 'root') {
                    $('#company-add').hide();
                }
            },

            initStyle: function () {

                var h = global.height - 49 - 49 - 44 - 10;
                var str = '.tableBox{height:' + h + 'px}';
                Common.addStyle('setting', str);
            },

            /**
             * 获取请求列表的参数，
             * @param type 获取参数的类型, 0 :分页列表 , 1：按名字搜索的列表
             */
            getRequestUrl: function (type) {

                return Common.getUrlByName('listCorp');

                //if(!type){
                //    url=[url,'&pageNo=',this.pageNo,'&pageSize=',this.pageSize].join('');
                //}
            },

            /**
             * 获取列表数据
             * @param type 0-分页列表 ，1-搜索
             * @param status  根据企业状态查询列表入参
             */
            getData: function (type, status) {
                var me = this;
                var url = this.getRequestUrl(type),
                    opts;

                var keyword = $('.seaInput').val();

                var sta = $('#company-type').val();

                //是否搜索
                if (type) {

                    opts = {
                        url: url,
                        data: {
                            name: keyword,
                            domain: keyword,
                            status: sta
                        },
                        success: function (data) {

                            //$(me.el).show().siblings().hide();
                            me.listData = data || [];
                            me.getDataByPage(1);
                        },
                        fail: function (data) {
                            Dialog.tips(Common.mergeErrMsg(cLang.searchFail, data));
                            //me.renderList();
                        }
                    };

                } else {
                    opts = {
                        url: url,
                        data: {status: -1},
                        success: function (data) {
                            me.listData = data || [];
                            me.getDataByPage(me.pageNo);
                            //me.renderList(data);
                        },
                        fail: function (data) {
                            Dialog.tips(Common.mergeErrMsg(sLang.listFail, data));
                            //me.renderList();
                        }
                    };
                    if (status !== undefined) {
                        _.extend(opts, {
                            data: {status: status}
                        });
                    }
                    var v = keyword;
                    if (v && v != Lang.setting.searchByNnD) {
                        opts.data.name = v;
                        opts.data.domain = v;
                    }
                }
                opts.data.status = sta;
                Ajax.request(opts);
            },

            getDataByPage: function (pageNo) {

                var me = this;
                var start = (pageNo - 1) * this.pageSize;
                var data = this.listData.concat().splice(start, this.pageSize);

                var dataObj = {
                    corpList: data,
                    pageNo: pageNo,
                    pageSize: me.pageSize,
                    total: this.listData.length
                };

                this.renderList(dataObj);
            },

            renderList: function (data) {

                var me = this;
                this.list.setData(data.corpList);

                this.pager = new Pager({
                    el: '.company-list-pager',
                    pageNo: data.pageNo,
                    total: data.total,
                    pageSize: data.pageSize,
                    onclick: function (page) {
                        me.pageNo = page;
                        me.getDataByPage(page);
                    }
                });

            },

            showDetail: function (data, el) {
                //Setting.companyManage.showCompany.init(data.corpId);
                Module.callModule(Setting.companyManage.showCompany, data.corpId);
            },

            edit: function (data, el) {
                //Setting.companyManage.editCompany.init(data.corpId);
                Module.callModule(Setting.companyManage.editCompany, data.corpId);
            },

            del: function (data, el) {


                if (data.status != 1) {
                    Dialog.alert(sLang.cantDelCompany);
                    return;
                }

                var content = [
                    '<table width="100%" class="mt_20 mb_20 tipsTable">',
                    '<tbody>',
                    '<tr>',
                    '<td align="right" width="60"><i class="i-tips"></i></td>',
                    '<td><div style="padding:0 15px 0 10px">', Common.stringFormat(sLang.confirmDelCompany, data.name), '</div></td>',
                    '</tr>',
                    '</tbody>',
                    '</table>'
                ].join('');

                Dialog.pop({
                    title: cLang.warn,
                    content: content,
                    width: '430',
                    btn: [
                        {
                            text: cLang.ok,
                            removePop: 1,
                            callback: function () {

                                var opts = {
                                    url: Common.getUrlByName('delCorp'),
                                    data: {
                                        corpId: data.corpId
                                    },
                                    success: function (d) {

                                        Dialog.tips(sLang.delCompanySuc);
                                        el.parent().remove();


                                        _.delay(function () {

                                            //是否删除的当前选择的企业
                                            var u = Common.parseURL(location.href);
                                            if (u.params && u.params.corpId == data.corpId) {
                                                location.href = u.path;
                                            } else {
                                                location.reload();
                                            }

                                        }, 2000);

                                    },
                                    fail: function (data) {
                                        Dialog.tips(Common.mergeErrMsg(sLang.delCompanyFail, data));
                                    }
                                };

                                Ajax.request(opts);

                            },
                            cls: 'a-sopop-cancel'
                        },
                        {text: cLang.cancel, removePop: true}
                    ]
                });

            },

            userManage: function (data, el) {
                location.href = window.modules.userManager + '.do?corpId=' + data.corpId;
            },

            logManage: function (data, el) {
                location.href = window.modules.log + '.do?corpId=' + data.corpId;
            },

            updateCorpStatus: function (selected) {
                var corpIds = _.map(selected, function (v) {
                    return v.corpId;
                });

                var opts = {
                    url: Common.getUrlByName('updateCorp'),
                    data: {
                        corpIds: corpIds,
                        status: 1
                    },
                    success: function (data) {
                        Dialog.tips(sLang.editStatusSuc);
                        Module.callModule(Setting.companyManage.listCompany);
                        //Setting.companyManage.listCompany.init();
                    },
                    fail: function (data) {
                        Dialog.tips(Common.mergeErrMsg(sLang.editStatusFail, data));
                    }
                };

                Ajax.request(opts);
            },

            destroy: function () {
                $('.searchBox').hide();
            }
        },

        //网盘设置-企业管理-添加企业
        addCompany: {
            el: "#addCompany",
            ui: {
                select: '#addCompany .real-select',
                unitSelect: '#addCompany #unit-select-add',
                formCtrlCon: '#formCtrlCon',
                addOk: "#add-ok"
            },
            init: function () {
                $(this.el).show().siblings().hide();
                this.render();
                this.initSelect();
                this.initEvents();

                this.addValidateMethod();
                this.validate();

                this.isInitialized = true;
            },
            render: function () {
                var tplStr = Common.getTemplate(tpl, '#formCtrlCon-tpl');
                var html = Common.tpl2Html(tplStr, {});
                $('#formCtrlCon').html(html);
            },
            initSelect: function () {
                //if(this.isInitialized){return}
                $(this.ui.select).dropkick();
                $(this.ui.unitSelect).dropkick();
            },
            initEvents: function () {
                var me = this;

                $(this.ui.select).off('change').on('change', function () {
                    me.customTime();
                });

                if (this.isInitialized) {
                    return
                }
                $(this.ui.addOk).on('click', function () {
                    me.add();
                });

            },
            customTime: function () {
                var $timeout2 = $('#timeout2');
                var v = $('#timeout').val();
                if (v == 0) {
                    $('.customTime').show();
                    $timeout2.focus();
                    $timeout2.rules("remove");
                    $timeout2.rules("add", {
                        required: true,
                        number: true,
                        digits: true,
                        min: 1,
                        max: 1200,
                        messages: {
                            required: sLang.customTime,
                            number: sLang.typeNumber,
                            digits: sLang.typeDigits,
                            min: sLang.minNumber,
                            max: sLang.maxNumber
                        }
                    });

                } else {
                    $('.customTime').hide();
                    $timeout2.rules("remove");
                }
            },
            addValidateMethod: function () {

                var vF = function (key, value) {
                    var deferred = $.Deferred();

                    var data = {
                        status: '-1'
                    };
                    data[key] = value;

                    var opts = {
                        url: Common.getUrlByName('listCorp'),
                        data: data,
                        async: false,
                        success: function (data) {
                            if (!data || data.length == 0) {
                                deferred.resolve();
                            } else {
                                var o = _.find(data, function (v) {
                                    return v[key] == value
                                });
                                if (o) {
                                    deferred.reject();
                                } else {
                                    deferred.resolve();
                                }
                            }
                        },
                        fail: function (data) {
                            deferred.resolve();
                        }
                    };
                    Ajax.request(opts);
                    return deferred.state();
                };

                //验证企业名称是否存在
                $.validator.addMethod("checkCompanyName", function (value, element) {
                    return vF('name', $.trim(value)) == "resolved";
                }, sLang.companyNameExisted);


                //验证域名是否存在
                $.validator.addMethod("checkDomain", function (value, element) {
                    return vF('domain', value) == "resolved";
                }, sLang.domainExisted);


                //验证用户名是否存在
                $.validator.addMethod("checkUserId", function (value, element) {

                    if (value == 'root') {
                        return false
                    }
                    var deferred = $.Deferred();

                    var data = {
                        userId: value
                    };

                    var opts = {
                        url: Common.getUrlByName('searchUser') + '&page=1&pagesize=20&matchrule=equal',
                        data: data,
                        async: false,
                        success: function (data) {
                            var users = data.users;
                            if (users && users.length > 0) {
                                deferred.reject();
                            } else {
                                deferred.resolve();
                            }
                        },
                        fail: function (data) {
                            deferred.resolve();
                        }
                    };
                    Ajax.request(opts);
                    return deferred.state() == "resolved";
                }, sLang.userIdExisted);

            },
            validate: function () {

                $(this.ui.formCtrlCon).validate({
                    onkeyup: false,
                    rules: {
                        'company-name': {
                            required: true,
                            companyName: true,
                            checkCompanyName: true
                        },
                        'company-domain': {
                            required: true,
                            domain: true,
                            checkDomain: true
                        },
                        'user-count': {
                            required: true,
                            number: true,
                            min: 1,
                            max: 999999
                        },
                        'company-space': {
                            required: true,
                            number: true,
                            min: 1,
                            max: 1024 * 1000
                        },
                        'company-account': {
                            required: true,
                            account: true,
                            checkUserId: true
                        },
                        'company-pswd': {
                            required: true,
                            minlength: 6,
                            maxlength: 30,
                            companyPswd: true
                        },
                        'company-pswd-2': {
                            required: true,
                            minlength: 6,
                            maxlength: 30,
                            companyPswd: true,
                            equalTo: "#company-pswd"
                        }
                    },
                    messages: {
                        'company-name': {
                            required: sLang.typeName,
                            companyName: sLang.typeLegalName
                        },
                        'company-domain': {
                            required: sLang.typeDomain
                        },
                        'user-count': {
                            required: sLang.typeUserLimit,
                            number: sLang.typeNumber,
                            min: sLang.minNumber,
                            max: sLang.maxNumber
                        },
                        'company-space': {
                            required: sLang.typeSpace,
                            number: sLang.typeNumber,
                            min: sLang.minNumber,
                            max: sLang.maxNumber
                        },
                        'company-account': {
                            required: sLang.typeAccount,
                            account: sLang.typeLegalAccount,
                            remote: sLang.accountExist
                        },
                        'company-pswd': {
                            required: sLang.typePwd,
                            minlength: sLang.minPsw,
                            maxlength: sLang.maxPws,
                            companyPswd: sLang.legalPsw
                        },
                        'company-pswd-2': {
                            required: sLang.typeConfirmPwd,
                            minlength: sLang.minPsw,
                            maxlength: sLang.maxPws,
                            equalTo: sLang.pswNotEqual,
                            companyPswd: sLang.legalPsw
                        }
                    },
                    wrapper: "span",
                    errorPlacement: function (error, element) {
                        $(element).parent().append(error.prepend('<i class="i-warm ml_5"></i>'));
                    }
                });

            },
            add: function () {

                var btnOK = $(this.ui.addOk);

                if (btnOK.hasClass('disabled')) {
                    return
                }

                if (!$(this.ui.formCtrlCon).valid()) {
                    return
                }

                var storage = Common.convertToB($('#company-space').val(), $(this.ui.unitSelect).val());
                var outDate = $('#timeout').val();

                if (outDate == 0) {
                    outDate = $('#timeout2').val();
                }

                var data = {
                    name: $.trim($('#company-name').val()),
                    domain: $('#company-domain').val().toLowerCase(),
                    outDate: outDate,
                    storage: storage,
                    userLimit: $('#user-count').val(),
                    status: $('#company-status').val(),
                    userId: $('#company-account').val(),
                    pwd: CryptoJS.MD5($('#company-pswd').val()).toString().toUpperCase(),
                    affirmPwd: CryptoJS.MD5($('#company-pswd-2').val()).toString().toUpperCase()
                };

                var opts = {
                    url: Common.getUrlByName('addCorp'),
                    data: data,
                    success: function (data) {
                        console.log(data);
                        // btnOK.removeClass('disabled');
                        Dialog.tips(sLang.addComSuc);
                        setTimeout(function () {
                            location.href=window.modules.setting+'.do';
                            // window.location.reload();
                        }, 800);

                        //Module.callModule(Setting.companyManage.listCompany);
                    },
                    fail: function (data) {
                        Dialog.tips(Common.mergeErrMsg(sLang.addComFail, data));
                        btnOK.removeClass('disabled');
                    }
                };
                Ajax.request(opts);
                btnOK.addClass('disabled');

            }

        },

        //网盘设置-企业管理-编辑企业
        editCompany: {
            el: "#editCompany",
            ui: {
                select: '#editCompany .real-select',
                name: '#company-name-edit',
                domain: '#company-domain-edit',
                space: '#company-space-edit',
                spaceUnit: '#unit-select-edit',
                timeout: '#timeout-edit',
                count: '#user-count-edit',
                status: '#company-status-edit',
                editOk: '#edit-ok',
                editCancel: '#edit-cancel',
                formCtrlCon: '#formCtrl-edit-form'
            },
            init: function (id) {

                this.getData(id);
                $(this.el).show().siblings().hide();
            },
            initSelect: function () {
                //if(this.isInitialized){return}
                //$(this.ui.select).dropkick();
                this.outDateSelect = new Dropkick($(this.ui.timeout)[0]);
                //this.countSelect=new Dropkick($(this.ui.count)[0]);
                this.statusSelect = new Dropkick($(this.ui.status)[0]);
                this.spaceUnitSelect = new Dropkick($(this.ui.spaceUnit)[0]);
            },
            initEvents: function () {
                var me = this;
                if (this.isInitialized) {
                    return
                }

                $(this.ui.editOk).on('click', function () {
                    me.update();
                });
                $(this.ui.editCancel).on('click', function () {
                    Module.callModule(Setting.companyManage.listCompany);
                    //Setting.companyManage.listCompany.init();
                });

                $(this.ui.timeout).on('change', function () {
                    me.customTime();
                });

                $('#resetPwd').click(function () {
                    me.resetPwd();
                });

                this.isInitialized = true;

            },
            getData: function (id) {

                var me = this;
                var opts = {
                    url: Common.getUrlByName('getCorpDetail'),
                    data: {corpId: id},
                    success: function (data) {
                        me.render(data);
                    },
                    fail: function (data) {
                        Dialog.tips(Common.mergeErrMsg(sLang.getComInfoFail, data));
                    }
                };
                Ajax.request(opts);

            },
            tplHelper: function (data) {
                //{code:"S_OK",errorCode:"",summary:"",var:"{corpId:734004224,name:"陈华055",domain:"chenhua055",outDate:121,storage:100000001,userLimit:1001}"}
                var temp = _.extend({}, data);
                temp.outDateOrg = temp.outDate;
                temp.outDate = Common.getOutDate(temp.outDate);

                var storage = Common.formatStorageUnit(temp.storage, true);
                temp.storage = storage.num;
                //temp.userLimit=temp.userLimit;
                return temp;
            },
            render: function (data) {

                this.model = data.corpInfo;
                this.userModel = data.userInfo;

                var formCtrlEdit = $('#formCtrl-edit');

                //var template= _.template(Common.getTemplate(tpl,'#formCtrl-edit-tpl'));
                var tplData = this.tplHelper(this.model);
                var html = Common.tpl2Html(Common.getTemplate(tpl, '#formCtrl-edit-tpl'), tplData);

                formCtrlEdit.html(html);

                $('#adminId').text(this.userModel.userId);

                this.initEvents();
                this.initSelect();
                this.addValidateMethod();
                this.validate();

                var s = [-1, 3, 6, 12];
                var outDate = this.model.outDate;
                if (s.indexOf(outDate) <= -1) {
                    outDate = 0;
                }

                $('.customTime')[outDate?'hide':'show']();

                this.outDateSelect.select(outDate.toString());
                $('#timeout3').blur();
                //this.countSelect.select(data.userLimit.toString());
                this.statusSelect.select(this.model.status.toString());
                this.spaceUnitSelect.select(Common.formatStorageUnit(this.model.storage, true).unit.toString());

            },
            customTime: function () {
                var $timeout3 = $('#timeout3');
                var v = $('#timeout-edit').val();
                if (v == 0) {
                    $('.customTime').show();
                    $timeout3.focus();
                    try {
                        $timeout3.rules("remove");
                        $timeout3.rules("add", {
                            required: true,
                            number: true,
                            digits: true,
                            min: 1,
                            max: 1200,
                            messages: {
                                required: sLang.customTime,
                                number: sLang.typeNumber,
                                digits: sLang.typeDigits,
                                min: sLang.minNumber,
                                max: sLang.maxNumber
                            }
                        });
                    } catch (e) {

                    }

                } else {
                    $('.customTime').hide();
                    $timeout3.rules("remove");
                }
            },
            addValidateMethod: function () {

                var vF = function (key, value) {
                    var deferred = $.Deferred();

                    var data = {
                        status: '-1'
                    };
                    data[key] = value;

                    var opts = {
                        url: Common.getUrlByName('listCorp'),
                        data: data,
                        async: false,
                        success: function (data) {
                            if (!data || data.length == 0) {
                                deferred.resolve();
                            } else {
                                var o = _.find(data, function (v) {
                                    return v[key] == value
                                });
                                if (o) {
                                    deferred.reject();
                                } else {
                                    deferred.resolve();
                                }
                            }
                        },
                        fail: function (data) {
                            deferred.resolve();
                        }
                    };
                    Ajax.request(opts);
                    return deferred.state();
                };

                //验证企业名称是否存在
                $.validator.addMethod("checkCompanyName", function (value, element) {
                    var original = $(element).data('original');
                    if ($.trim(value) == original) {
                        return true;
                    }
                    return vF('name', value) == "resolved";
                }, sLang.companyNameExisted);


                //验证域名是否存在
                $.validator.addMethod("checkDomain", function (value, element) {
                    var original = $(element).data('original');
                    if (value == original) {
                        return true;
                    }
                    return vF('domain', value) == "resolved";
                }, sLang.domainExisted);

            },
            validate: function () {

                $(this.ui.formCtrlCon).validate({
                    onkeyup: false,
                    rules: {
                        'company-name-edit': {
                            required: true,
                            companyName: true,
                            checkCompanyName: true
                        },
                        'company-domain-edit': {
                            required: true,
                            domain: true,
                            checkDomain: true
                        },
                        'user-count-edit': {
                            required: true,
                            number: true,
                            min: 1,
                            max: 999999
                        },
                        'company-space-edit': {
                            required: true,
                            number: true,
                            min: 1,
                            max: 1024 * 1000
                        },
                        remark: {
                            remark: true
                        }
                    },
                    messages: {
                        'company-name-edit': {
                            required: sLang.typeName,
                            companyName: sLang.typeLegalName
                        },
                        'company-domain-edit': {
                            required: sLang.typeDomain
                        },
                        'user-count-edit': {
                            required: sLang.typeUserLimit,
                            number: sLang.typeNumber,
                            min: sLang.minNumber,
                            max: sLang.maxNumber
                        },
                        'company-space-edit': {
                            required: sLang.typeSpace,
                            number: sLang.typeNumber,
                            min: sLang.minNumber,
                            max: sLang.maxNumber
                        },
                        remark: {
                            remark: sLang.remarkLength
                        }
                    },
                    wrapper: "span",
                    errorPlacement: function (error, element) {
                        $(element).parent().append(error.prepend('<i class="i-warm ml_5"></i>'));
                    }
                });
            },
            update: function () {
                var me = this;

                if (!$(this.ui.formCtrlCon).valid()) {
                    return
                }

                var storage = Common.convertToB($(me.ui.space).val(), $(this.ui.spaceUnit).val());
                var outDate = $(me.ui.timeout).val();
                if (outDate == 0) {
                    outDate = $('#timeout3').val();
                }

                var newModel = {
                    name: $.trim($(me.ui.name).val()),
                    domain: $(me.ui.domain).val().toLowerCase(),
                    outDate: Number(outDate),
                    storage: storage,
                    userLimit: Number($(me.ui.count).val()),
                    status: Number($(me.ui.status).val())
                };

                var updateData = _.omit(newModel, function (value, key, object) {
                    return me.model[key] == value
                });

                if (_.isEmpty(updateData)) {
                    Module.callModule(Setting.companyManage.listCompany);
                    return
                }

                updateData.corpId = me.model.corpId;

                updateData.status === undefined && (updateData.status = -1);

                var opts = {
                    url: Common.getUrlByName('updateCorp'),
                    data: updateData,
                    success: function (data) {
                        me.model = newModel;
                        Dialog.tips(sLang.editComSuc);

                        _.delay(function () {
                            location.reload();
                        }, 1000);

                        // Module.callModule(Setting.companyManage.listCompany);
                    },
                    fail: function (data) {
                        if (data.code == 'CORP_USERLIMIT_LESS') {
                            Dialog.tips(sLang.editComFail + '：' + data.summary + '（' + data['var'] + sLang.people + '）');
                        } else {
                            Dialog.tips(Common.mergeErrMsg(sLang.editComFail, data));
                        }

                    }
                };
                Ajax.request(opts);
            },
            resetPwd: function () {

                var me = this;

                var d = Dialog.pop({
                    title: sLang.resetAdminPwd,
                    content: Common.tpl2Html(Common.getTemplate(tpl, '#resetAdminPwd')),
                    okRemovePop: false,
                    width: 380,
                    ok: function () {

                        if ($('#resetAdminPwdForm').valid()) {

                            var p = {
                                uid: me.userModel.uid,
                                userId: me.userModel.userId,
                                corpId: me.model.corpId,
                                password: CryptoJS.MD5($('#as-password').val()).toString().toUpperCase()
                            };

                            var opts = {
                                url: Common.getUrlByName('updateUser') + '&passmodify=1',
                                data: p,
                                success: function (data) {

                                    Dialog.tips(sLang.resetAdminPwdSuc);
                                    d.removePop();

                                },
                                fail: function (data) {
                                    Dialog.tips(Common.mergeErrMsg(sLang.resetAdminPwdFail, data));
                                }
                            };
                            Ajax.request(opts);

                        }

                    },
                    onPop: function () {
                        me.editUserValidate();
                    }
                });

            },
            editUserValidate: function () {
                var me = this;

                $('#resetAdminPwdForm').validate({
                    rules: {
                        'password': {
                            required: true,
                            minlength: 6,
                            maxlength: 30,
                            companyPswd: true
                        },
                        'password2': {
                            required: true,
                            minlength: 6,
                            maxlength: 30,
                            companyPswd: true,
                            equalTo: "#as-password"
                        }
                    },
                    messages: {
                        'password': {
                            required: sLang.typePwd,
                            minlength: sLang.minPsw,
                            maxlength: sLang.maxPws,
                            companyPswd: sLang.legalPsw
                        },
                        'password2': {
                            required: sLang.typeConfirmPwd,
                            minlength: sLang.minPsw,
                            maxlength: sLang.maxPws,
                            equalTo: sLang.pswNotEqual,
                            companyPswd: sLang.legalPsw
                        }
                    },
                    wrapper: "div",
                    errorPlacement: function (error, element) {
                        $(element).parent().append(error.prepend('<i class="i-warm ml_5"></i>'));
                    }
                });

            },
            destroy: function () {
                $('#formCtrl-edit .subCon input').val('');
            }
        },

        //网盘设置-企业管理-企业信息
        showCompany: {
            el: '#showCompany',
            init: function (id) {
                $(this.el).show().siblings().hide();
                this.getData(id);
            },
            getData: function (id) {

                var me = this;
                var opts = {
                    url: Common.getUrlByName('getCorpDetail'),
                    data: {corpId: id},
                    success: function (data) {
                        me.render(data);
                    },
                    fail: function (data) {
                        Dialog.tips(Common.mergeErrMsg(sLang.getComInfoFail, data));
                    }
                };
                Ajax.request(opts);

            },
            tplHelper: function (data) {
                //{code:"S_OK",errorCode:"",summary:"",var:"{corpId:734004224,name:"陈华055",domain:"chenhua055",outDate:121,storage:100000001,userLimit:1001}"}
                data.outDate = Common.getOutDate(data.outDate);
                data.storage = Common.formatStorageUnit(data.storage);
                data.userLimit = data.userLimit + sLang.userUnit;
                data.status = Common.getStatus(data.status);
                return data;
            },
            render: function (data) {
                if (!data) {
                    return
                }
                this.model = data.corpInfo;
                var con = $('#detail-con'),
                    conTpl = $('#detail-con-tpl');
                var tplHelper = this.tplHelper(this.model);
                var html = Common.tpl2Html(Common.getTemplate(tpl, '#detail-con-tpl'), tplHelper);
                con.html(html);
            },
            destroy: function () {
                $('#detail-con .subCon').html('');
            }
        }
    };


    //网盘设置-账户安全
    Setting.accountSecurity = {
        ui: {
            minLength: '#min-length',
            special: '#account-checkbox-1',
            caps: '#account-checkbox-2',
            weak: '#account-checkbox-3',
            duration: '#password-duration',
            accountOk: '#account-ok'
        },
        init: function () {
            this.initSelect();
            this.initEvents();
            this.initData();
            this.isInitialized = true;
            $('.container .tab-li').hide();
            $('#accountSecurity').show();
        },
        initSelect: function () {
            if (this.isInitialized) {
                return
            }
            this.minLengthSelect = new Dropkick($(this.ui.minLength)[0]);
            this.durationSelect = new Dropkick($(this.ui.duration)[0]);
        },
        initEvents: function () {
            if (this.isInitialized) {
                return
            }
            var me = this;
            $(me.ui.accountOk).on('click', function () {
                me.updateAccountRule();
            });
        },
        initData: function () {

            var me = this;

            var opts = {
                url: Common.getUrlByName('getAccountRule'),
                data: {corpId: Setting.model.corpId},
                success: function (data) {
                    me.render(data);
                },
                fail: function (data) {
                    Dialog.tips(Common.mergeErrMsg(sLang.getSafeInfoFail, data));
                }
            };
            Ajax.request(opts);

        },
        render: function (data) {
            //[{corpId:121212,ruleId:1,ruleName:'禁止若密码',ruleValue:'/\w/',isCheck:0}]

            var minLength = data[0],
                duration = data[4],
                special = data[1],
                caps = data[2],
                weak = data[3];

            this.minLengthSelect.select(minLength.ruleValue.toString());
            this.durationSelect.select(duration.ruleValue.toString());

            $(this.ui.special).prop('checked', special.isCheck);
            $(this.ui.caps).prop('checked', caps.isCheck);
            $(this.ui.weak).prop('checked', weak.isCheck);

        },
        updateAccountRule: function () {
            //1：密码长度，2特殊字符，3包含大写，4禁止若密码，5定期修改

            var me = this;
            var minLength = $(me.ui.minLength).val(),
                special = $(me.ui.special).is(":checked"),
                caps = $(me.ui.caps).is(":checked"),
                weak = $(me.ui.weak).is(":checked"),
                duration = $(me.ui.duration).val();

            var corpId = Setting.model.corpId;
            var data = [
                {"corpId": corpId, "ruleId": 1, "ruleValue": minLength, "isCheck": ''},
                {"corpId": corpId, "ruleId": 2, "ruleValue": "", "isCheck": special ? 1 : 0},
                {"corpId": corpId, "ruleId": 3, "ruleValue": "", "isCheck": caps ? 1 : 0},
                {"corpId": corpId, "ruleId": 4, "ruleValue": "", "isCheck": weak ? 1 : 0},
                {"corpId": corpId, "ruleId": 5, "ruleValue": duration, "isCheck": ''}
            ];

            var opts = {
                url: Common.getUrlByName('updateAccountRule'),
                data: data,
                success: function (data) {
                    Dialog.tips(cLang.setSuc);
                },
                fail: function (data) {
                    Dialog.tips(Common.mergeErrMsg(cLang.setFail, data));
                }
            };
            Ajax.request(opts);


        }
    };


    //网盘设置-常规设置
    Setting.normalSetting = {
        el: '#normalSetting',
        init: function () {

            this.getData();
            // this.render();
            this.initEvents();
            this.initValid();
            this.isInitialized = true;
        },
        render: function (data) {

            data = _.extend({
                diskMaxFileUpLoad: 0,
                defaultUserCapacity: 0,
                defaultTeamCapacity: 0,
                diskMaxUserCapacity: 0,
                maxUserTeamCapacity: 0,
                maxUserTeamNum: 0,
                maxUserTeamMember: 0,
                diskMaxFileDownNum: 0,
                diskMaxFileDownTime: 0,
                diskVersionsNum: 0,
                diskVersionsTime: 0
            }, data);

            //单位转换
            data.diskMaxFileUpLoad = Common.formatStorageUnit(data.diskMaxFileUpLoad, true, 'G').num;

            data.defaultUserCapacity = Common.formatStorageUnit(data.defaultUserCapacity, true, 'M').num;
            data.defaultTeamCapacity = Common.formatStorageUnit(data.defaultTeamCapacity, true, 'M').num;

            data.diskMaxUserCapacity = Common.formatStorageUnit(data.diskMaxUserCapacity, true, 'M').num;
            data.maxUserTeamCapacity = Common.formatStorageUnit(data.maxUserTeamCapacity, true, 'M').num;

            var t = Common.getTemplate(tpl, '#normalSetting2');
            $('#ns-ul').html(Common.tpl2Html(t, data));

            $('#normalSetting').show();
            $('.secMenu li[data-id=normalSetting] a').addClass('act');

            Common.placeholder();

        },
        initEvents: function () {
            var me = this;
            if (this.isInitialized) {
                return
            }
            $('#s-btn-ok').on('click', function () {

                if ($('#nsForm').valid()) {
                    me.setData();
                }

            });
        },
        getData: function () {
            var me = this;

            var opts = {
                url: Common.getUrlByName('getCorpService'),
                data: {
                    corpId: Setting.model.corpId
                },
                success: function (data) {
                    me.render(data);
                },
                fail: function (data) {
                    Dialog.tips(Common.mergeErrMsg(sLang.fetchNormalFail, data));
                    me.render();
                }
            };
            Ajax.request(opts);

        },
        setData: function () {
            var me = this;
            var formData = {};
            $('#ns-ul input').each(function () {
                var $this = $(this);
                var name = $this.attr('name');
                formData[name] = Number($this.val());
            });


            //单位转换
            formData.diskMaxFileUpLoad = Common.convertToB(formData.diskMaxFileUpLoad, 'G');

            formData.defaultUserCapacity = Common.convertToB(formData.defaultUserCapacity, 'M');
            formData.defaultTeamCapacity = Common.convertToB(formData.defaultTeamCapacity, 'M');

            formData.diskMaxUserCapacity = Common.convertToB(formData.diskMaxUserCapacity, 'M');
            formData.maxUserTeamCapacity = Common.convertToB(formData.maxUserTeamCapacity, 'M');

            formData.corpId = Setting.model.corpId;

            var opts = {
                url: Common.getUrlByName('updateCorpService'),
                data: formData,
                success: function (data) {
                    Dialog.tips(sLang.settingSaved);
                },
                fail: function (data) {
                    Dialog.tips(Common.mergeErrMsg(sLang.settingFail, data));
                }
            };
            Ajax.request(opts);
        },
        initValid: function () {


            $.validator.addMethod("userCapacity", function (value, element) {
                var v1 = Number($('#defaultUserCapacity').val()),
                    v2 = Number($('#diskMaxUserCapacity').val());
                if (v1 && v2) {
                    return v1 <= v2;
                } else {
                    return true;
                }
            }, '');

            $.validator.addMethod("teamCapacity", function (value, element) {
                var v1 = Number($('#defaultTeamCapacity').val()),
                    v2 = Number($('#maxUserTeamCapacity').val());
                if (v1 && v2) {
                    return v1 <= v2;
                } else {
                    return true;
                }
            }, '');


            $('#nsForm').validate({
                rules: {
                    'diskMaxFileUpLoad': {
                        required: true,
                        number: true,
                        digits: true,
                        min: 1,
                        max: 1024
                    },
                    'defaultUserCapacity': {
                        required: true,
                        number: true,
                        digits: true,
                        min: 1,
                        max: 1024 * 1024 * 1024,
                        userCapacity: true
                    },
                    'defaultTeamCapacity': {
                        required: true,
                        number: true,
                        digits: true,
                        min: 1,
                        max: 1024 * 1024 * 1024,
                        teamCapacity: true
                    },
                    'diskMaxUserCapacity': {
                        required: true,
                        number: true,
                        digits: true,
                        min: 1,
                        max: 1024 * 1024 * 1024
                        // userCapacity:true
                    },
                    'maxUserTeamCapacity': {
                        required: true,
                        number: true,
                        digits: true,
                        min: 1,
                        max: 1024 * 1024 * 1024
                        // teamCapacity:true
                    },
                    'maxUserTeamNum': {
                        required: true,
                        number: true,
                        digits: true,
                        min: 1,
                        max: 999999
                    },
                    'maxUserTeamMember': {
                        required: true,
                        number: true,
                        digits: true,
                        min: 1,
                        max: 999999
                    },
                    'diskMaxFileDownNum': {
                        required: true,
                        number: true,
                        digits: true,
                        min: 1,
                        max: 999999
                    },
                    'diskMaxFileDownTime': {
                        required: true,
                        number: true,
                        digits: true,
                        min: 1,
                        max: 365
                    },
                    'diskVersionsNum': {
                        required: true,
                        number: true,
                        digits: true,
                        min: 1,
                        max: 999
                    },
                    'diskVersionsTime': {
                        required: true,
                        number: true,
                        digits: true,
                        min: 1,
                        max: 365
                    }
                },
                messages: {
                    'diskMaxFileUpLoad': {
                        required: sLang.diskMaxFileUpLoad,
                        number: sLang.typeNumber,
                        min: sLang.gtZero,
                        max: sLang.diskMaxFileUpLoadMax,
                        digits: sLang.typeDigits
                    },
                    'defaultUserCapacity': {
                        required: sLang.diskMaxUserCapacity,
                        number: sLang.typeNumber,
                        min: sLang.gtZero,
                        max: sLang.defaultUserCapacityMax,
                        userCapacity: sLang.userCapacity,
                        digits: sLang.typeDigits
                    },
                    'defaultTeamCapacity': {
                        required: sLang.diskMaxUserCapacity,
                        number: sLang.typeNumber,
                        min: sLang.gtZero,
                        max: sLang.defaultTeamCapacityMax,
                        teamCapacity: sLang.teamCapacity,
                        digits: sLang.typeDigits
                    },
                    'diskMaxUserCapacity': {
                        required: sLang.diskMaxUserCapacity,
                        number: sLang.typeNumber,
                        min: sLang.gtZero,
                        max: sLang.diskMaxUserCapacityMax,
                        digits: sLang.typeDigits
                    },
                    'maxUserTeamCapacity': {
                        required: sLang.maxUserTeamCapacity,
                        number: sLang.typeNumber,
                        min: sLang.gtZero,
                        max: sLang.maxUserTeamCapacityMax,
                        digits: sLang.typeDigits
                    },

                    'maxUserTeamNum': {
                        required: sLang.maxUserTeamNum,
                        number: sLang.typeNumber,
                        min: sLang.gtZero,
                        max: sLang.maxUserTeamNumMax,
                        digits: sLang.typeDigits
                    },
                    'maxUserTeamMember': {
                        required: sLang.maxUserTeamMember,
                        number: sLang.typeNumber,
                        min: sLang.gtZero,
                        max: sLang.maxUserTeamMemberMax,
                        digits: sLang.typeDigits
                    },
                    'diskMaxFileDownNum': {
                        required: sLang.diskMaxFileDownNum,
                        number: sLang.typeNumber,
                        min: sLang.gtZero,
                        max: sLang.diskMaxFileDownNumMax,
                        digits: sLang.typeDigits
                    },
                    'diskMaxFileDownTime': {
                        required: sLang.diskMaxFileDownTime,
                        number: sLang.typeNumber,
                        min: sLang.gtZero,
                        max: sLang.diskMaxFileDownTimeMax,
                        digits: sLang.typeDigits
                    },
                    'diskVersionsNum': {
                        required: sLang.diskVersionsNum,
                        number: sLang.typeNumber,
                        min: sLang.gtZero,
                        max: sLang.diskVersionsNumMax,
                        digits: sLang.typeDigits
                    },
                    'diskVersionsTime': {
                        required: sLang.diskVersionsTime,
                        number: sLang.typeNumber,
                        min: sLang.gtZero,
                        max: sLang.diskVersionsTimeMax,
                        digits: sLang.typeDigits
                    }

                },
                wrapper: "span",
                errorPlacement: function (error, element) {
                    $(element).parent().append(error.prepend('<i class="i-warm ml_5"></i>'));
                }
            });

        }
    };


    //网盘设置-消息设置
    Setting.messageSetting = {
        el: '#messageSetting',
        init: function () {
            this.initEvents();
            this.getData();
        },
        initEvents: function () {
            var me = this;
            var $el = $(this.el);
            $el.find('input[type=checkbox]').off('change').on('change', function () {
                me.setData($(this));
            });

            $el.find('.setInfoContainer .setInfoTitle').off('click').on('click', function () {
                var body = $(this).next();
                var arrow = $(this).find('.btn-arrow');

                if (body.is(':hidden')) {
                    body.slideDown();
                    arrow.addClass('i-bdown').removeClass('i-arrDown2');
                } else {
                    body.slideUp();
                    arrow.addClass('i-arrDown2').removeClass('i-bdown');
                }
            });

        },
        getData: function () {
            var me = this;
            var opts = {
                url: Common.getUrlByName('getCorpMsgSet'),
                data: {
                    corpId: Setting.model.corpId
                },
                success: function (data) {
                    me.setStatus(data);
                },
                fail: function (data) {
                    Dialog.tips(Common.mergeErrMsg(sLang.getMsgSetFail, data));
                }
            };
            Ajax.request(opts);
        },
        setStatus: function (data) {
            _.each(data, function (v) {
                var type = v.operateType;
                var p = $('.setInfoTable tr[data-type=' + type + ']');
                p.find('input[data-client=0]').prop('checked', !!v.msgBoxCheck);
                p.find('input[data-client=1]').prop('checked', !!v.appPushCheck);
            });
        },
        setData: function (el) {
            var $p = el.parents('tr');
            var type = $p.data('type');
            var $msgBoxCheck = $p.find('input[data-client=0]'),
                $appPushCheck = $p.find('input[data-client=1]');

            var opts = {
                url: Common.getUrlByName('updateCorpMsgSet'),
                data: {
                    corpId: Setting.model.corpId,
                    operateType: type,
                    msgBoxCheck: $msgBoxCheck.prop('checked') ? 1 : 0,
                    appPushCheck: $appPushCheck.prop('checked') ? 1 : 0
                },
                success: function (data) {
                    Dialog.tips(sLang.setMsgSuc, 1.5);
                },
                fail: function (data) {
                    el.prop('checked', !el.prop('checked'));
                    Dialog.tips(Common.mergeErrMsg(sLang.setMsgFail, data));
                }
            };
            Ajax.request(opts, false, true);
        },
        destroy: function () {

        }
    };


    //网盘设置-企业定制
    Setting.companyDiy = {
        el: '#companyDiy',
        init: function () {
            this.initUploader();
        },
        initUploader: function () {
            var me = this;

            var state = 'pending';
            me.files = [];
            var $btn = $('.btn-upload');
            var $filePath = $('.filePath');

            var uploader = this.uploader = WebUploader.create({
                resize: false,
                fileNumLimit: 1,
                fileSingleSizeLimit: 1024 * 1024,//1M大小
                // swf文件路径
                swf: (global.path || '/driveadmin') + '/resource/js/lib/webuploader/Uploader.swf',
                // 文件接收服务端。
                server: Common.getUrlByName('uploadLogo') + '&corpId=' + Setting.model.corpId,
                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: {
                    id: '.uploadBtn',
                    multiple: false
                },
                accept: [{
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png'
                }]
            });


            uploader.on('beforeFileQueued', function (file) {
                if (me.files.length) {
                    uploader.removeFile(me.files[0]);
                    me.files = [];
                }
                me.files.push(file);
                $filePath.val(file.name);
            });

            // 文件上传过程中创建进度条实时显示。
            // uploader.on( 'uploadProgress', function( file, percentage ) {
            //
            //
            // });

            uploader.on('uploadSuccess', function (file, response) {
                if (response.code == 'S_OK') {
                    Dialog.tips('上传成功！');
                    me.setLogo(response);
                } else {
                    Dialog.tips(Common.mergeErrMsg('上传失败', response));
                }

            });

            uploader.on('uploadError', function (file) {
                Dialog.tips('上传失败，请重试！');
            });

            uploader.on('uploadComplete', function (file) {
                $filePath.val('');
                me.files = [];
                uploader.reset();
            });

            uploader.on('all', function (type) {
                if (type === 'startUpload') {
                    state = 'uploading';
                } else if (type === 'stopUpload') {
                    state = 'paused';
                } else if (type === 'uploadFinished') {
                    state = 'done';
                }
                if (state === 'uploading') {
                    $btn.text('正在上传').addClass('disabled');
                } else {
                    $btn.text('提交').removeClass('disabled');
                }
            });

            uploader.on('error', function (code) {
                var txt;
                switch (code) {
                    case 'Q_TYPE_DENIED':
                        txt = '选择的文件格式不正确！';
                        break;
                    case 'F_EXCEED_SIZE':
                        txt = '超出最大文件大小！';
                        break;
                    default:
                        txt = '上传错误！';
                }
                Dialog.tips(txt);
            });

            $btn.on('click', function () {
                if ($(this).hasClass('disabled')) {
                    return;
                }

                if (!me.files.length) {
                    Dialog.tips('请选择要上传的文件！');
                    return;
                }

                if (state === 'uploading') {
                    uploader.stop();
                } else {
                    uploader.upload();
                }
            });


        },
        setLogo: function () {
            var url = [Common.getUrlByName('getCorpLogo'), '&corpId=', Common.getCorpId(), '&tid=', new Date().getTime()].join('');
            $('.i-logoImg img').attr('src', url);
        },
        destroy: function () {
            this.files = [];
            this.uploader.destroy();
        }
    };


    //网盘设置-系统配置
    Setting.systemConfig = {
        el: '#systemConfig',
        init: function () {

            this.render();
            this.initEvents();
            this.emailValidate();
            this.getEmailSvr();
            this.getSyncSvr();

            this.deftPwd='~p!w@d#';//密码框默认显示字符

        },
        initEvents: function () {
            var me=this;

            var $s1=$('.s1');
            var $s2=$('.s2');
            var $sOn1=$('#s-on1');
            var $sOff1=$('#s-off1');
            var $addBtn=$('#addSyncServer');
            var $editBtn=$('#editSyncServer');

            //邮件发送开启按钮
            $('#s-on').off('change').on('change',function(){
                me.switchOnEmailSvr(this);
            });

            //邮件发送关闭按钮
            $('#s-off').off('change').on('change',function(){
                me.switchOffEmailSvr(this);
            });

            //更改邮箱按钮
            $('#change-mail').off('click').on('click',function () {
                $s1.hide();
                $s2.show();
            });

            //邮箱提交按钮
            $('#emailBtn').off('click').on('click',function(){

                if(me.emailSvrModel){
                    me.editEmailSvr();
                }else{
                    me.addEmailSvr();
                }

            });

            //组织同步开启按钮
            $sOn1.off('change').on('change',function(){
                me.switchOnSyncSvr(this);
            });

            //组织同步关闭按钮
            $sOff1.off('change').on('change',function(){
                me.switchOffSyncSvr(this);
            });


            //添加同步服务器按钮
            $addBtn.off('click').on('click',function () {
                me.addSyncSvr();
            });


            //修改同步服务器按钮
            $editBtn.off('click').on('click',function () {
                me.editSyncSvr();
            });

            //查看日志
            $('.syncLogBtn a').off('click').on('click',function () {
                me.getSyncLog();
            });


            $('#emailPwd').off('click').on('click',function () {
                var $this=$(this);
                if($this.val()==me.deftPwd){
                    $this.val('');
                }
            });

            var $emailPort=$('#emailPort');


            $('#emailSsl').off('click').on('click',function () {

                if($(this).is(':checked')){
                    $emailPort.val(465);
                }else{
                    $emailPort.val(25);
                }
            });

        },
        render: function () {
            var tp=Common.getTemplate(tpl,'#systemConfigContent');
            var html = Common.tpl2Html(tp);
            $(this.el).html(html);
        },

        getEmailSvr:function () {

            var me=this;

            var $onBtn=$('#s-on');
            var $offBtn=$('#s-off');
            var $s1=$('.s1');
            var $s2=$('.s2');

            var opts = {
                url: Common.getUrlByName('getEmailSvr'),
                data: {
                    corpId:Setting.model.corpId
                },
                success: function (data) {

                    me.emailSvrModel=data;

                    if(data){
                        if(~~data.power){
                            $onBtn.prop('checked',true);
                            $s1.show();
                            $s2.hide();
                        }else{
                            $offBtn.prop('checked',true);
                            $s1.hide();
                            $s2.hide();
                        }

                        $('#emailUrl').val(data.emailAddr);
                        $('#emailPort').val(data.port);
                        $('#emailAccount').val(data.emailUser);
                        $('.emailAccount').text(data.emailUser);
                        $('#emailPwd').val(me.deftPwd);
                        $('#emailSsl').prop('checked',data.isSsl==1);
                    }else{
                        $offBtn.prop('checked',true);
                    }

                },
                fail: function (data) {
                    $offBtn.prop('checked',true);
                    Dialog.tips(Common.mergeErrMsg('获取系统邮箱配置信息失败', data));
                }
            };
            Ajax.request(opts);

        },
        addEmailSvr:function () {

            var me=this;

            if($('#emailForm').valid()){

                var params={
                    corpId:Setting.model.corpId,
                    emailAddr:$('#emailUrl').val(),
                    port:$('#emailPort').val(),
                    emailUser:$('#emailAccount').val(),
                    emailPass:$('#emailPwd').val(),
                    isSsl:$('#emailSsl').prop('checked')?1:2,
                    power:1
                };

                var opts = {
                    url: Common.getUrlByName('addEmailSvr'),
                    data: params,
                    success: function (data) {
                        Dialog.tips('邮箱设置成功！');
                        me.getEmailSvr();

                    },
                    fail: function (data) {
                        Dialog.tips('邮箱验证失败，请检查您的邮箱设置！');
                    }
                };
                Ajax.request(opts);
            }

        },
        editEmailSvr:function () {

            var me=this;

            if($('#emailForm').valid()){

                var params={
                    corpId:Setting.model.corpId,
                    emailAddr:$('#emailUrl').val(),
                    port:$('#emailPort').val(),
                    emailUser:$('#emailAccount').val(),
                    emailPass:$('#emailPwd').val(),
                    isSsl:$('#emailSsl').prop('checked')?1:2,
                    power:1
                };

                if(params.emailPass==me.deftPwd){
                    delete params.emailPass
                }

                this.updateEmailSvr(params, function (data) {
                    Dialog.tips('邮箱设置修改成功！');
                    me.getEmailSvr();
                }, function (data) {
                    Dialog.tips('邮箱验证失败，请检查您的邮箱设置！');
                });
            }

        },
        updateEmailSvr:function (param,success,fail) {
            var opts = {
                url: Common.getUrlByName('updateEmailSvr'),
                data: param,
                success: function (data) {
                    success && success(data);
                },
                fail: function (data) {
                    fail && fail(data);
                }
            };
            Ajax.request(opts);
        },
        switchOnEmailSvr:function(el){
            var me=this;

            var $s1=$('.s1');
            var $s2=$('.s2');

            if($(el).is(':checked')){

                if(me.emailSvrModel){
                    me.updateEmailSvr({
                        corpId:Setting.model.corpId,
                        flag:1,
                        power:1
                    },function(){
                        Dialog.tips('系统邮箱开启成功！');

                        $s1.show();
                        $s2.hide();

                    },function(){
                        Dialog.tips('邮箱验证失败，请检查您的邮箱设置！');

                        $s1.hide();
                        $s2.show();
                    });
                }else{
                    $s1.hide();
                    $s2.show();
                }
            }
        },
        switchOffEmailSvr:function (el) {
            var me=this;
            if($(el).is(':checked')){

                if(me.emailSvrModel){
                    me.updateEmailSvr({
                        corpId:Setting.model.corpId,
                        power:0,
                        flag:0
                    },function(){
                        Dialog.tips('系统邮箱关闭成功！');
                    },function(){
                        Dialog.tips('系统邮箱关闭失败！');
                        me.getEmailSvr();
                    });
                }

                $('.s1,.s2').hide();
            }
            
        },

        emailValidate:function () {

            $('#emailForm').validate({
                rules: {
                    emailUrl:{
                        required: true,
                        domain:true
                    },
                    emailPort:{
                        required: true,
                        min:1,
                        max:65535,
                        number:true
                    },
                    emailAccount:{
                        required: true,
                        email:true
                    },
                    emailPwd:{
                        required: true
                    }
                },
                messages:{
                    emailUrl:{
                        required: '请输入邮件服务器地址',
                        domain:'请输入正确的服务器地址'
                    },
                    emailPort:{
                        required: '请输入服务器端口',
                        min:'请输入正确的端口',
                        max:'请输入正确的端口',
                        number:Lang.setting.typeNumber
                    },
                    emailAccount:{
                        required: '请输入邮件发送账号',
                        email:'请输入正确的邮箱账号'
                    },
                    emailPwd:{
                        required: '请输入邮箱密码'
                    }
                },
                wrapper: "div",
                errorPlacement: function (error, element) {
                    $(element).parent().append(error.prepend('<i class="i-warm ml_5"></i>'));
                }
            });

        },

        getSyncSvr:function () {
            var me=this;

            var opts = {
                url: Common.getUrlByName('getSyncSvr'),
                data: {
                    corpId:Setting.model.corpId
                },
                success: function (data) {

                    var $addBtn=$('#addSyncServer');
                    var $editBtn=$('#editSyncServer');

                    me.syncSvrModel=data;

                    if(data){
                        if(~~data.syncpower){
                            $('#s-on1').prop('checked',true);
                            $('#svrBtn').show();
                        }else{
                            $('#s-off1').prop('checked',true);
                            $('#svrBtn').hide();
                        }

                        $('#svrDomain').text(data.domain);

                        $addBtn.hide();
                        $editBtn.show();

                    }else{
                        $addBtn.show();
                        $editBtn.hide();
                        $('#s-off1').prop('checked',true);
                    }


                },
                fail: function (data) {
                    $('#s-off1').prop('checked',true);
                    Dialog.tips(Common.mergeErrMsg('获取同步服务器信息失败', data));
                }
            };
            Ajax.request(opts);
        },
        addSyncSvr:function () {
            var me=this;
            var pop;

            var d={
                svrtype:'',
                domain:'',
                addr:'',
                port:'',
                isSsl:'',
                user:'',
                pass:'',
                syncperiod:'',
                syncmodel:'',
                corpId:'',
                localDomain:'',
                syncpower:'',
                showPwd:''
            };

            var tp=Common.getTemplate(tpl,'#syncServer');
            var html = Common.tpl2Html(tp,d);

            pop=Dialog.pop({
                title: '同步服务器设置',
                content: ['<div class="addSyncSvr">',html,'</div>'].join(''),
                okRemovePop: false,
                okText:'添加',
                ok: function () {
                    var formData={};

                    if($('#syncServerForm').valid()){

                        $('#syncServerForm input').each(function(){
                            var name=$(this).attr('name');
                            var value=$(this).val();
                            formData[name]=value;
                        });

                        formData.syncSSL= $('#syncSSL').prop('checked');

                        var data={
                            svrtype:$('#syncType').val(),
                            domain:formData.syncDomain,
                            addr:formData.syncURL,
                            port:formData.syncPort,
                            isSsl:(formData.syncSSL=='on'?1:2),
                            user:formData.syncAccount,
                            pass:formData.syncPwd,
                            syncperiod:formData.syncDelay,
                            syncmodel:$('#syncMode').val(),
                            corpId:Setting.model.corpId,
                            localDomain:Setting.model.corpData.domain,
                            syncpower:1
                        };

                        var opts = {
                            url: Common.getUrlByName('addSyncSvr'),
                            data: data,
                            success: function (data) {

                                Dialog.tips('添加服务器成功');
                                pop.removePop();
                                me.getSyncSvr();

                            },
                            fail: function (data) {
                                Dialog.tips(Common.mergeErrMsg('添加服务器失败', data));
                            }
                        };

                        Ajax.request(opts);

                    }

                },
                onPop:function () {
                    me.typeSelect = new Dropkick($('#syncType')[0]);
                    me.modeSelect = new Dropkick($('#syncMode')[0]);
                    me.syncSvrValidate();
                }
            });


        },
        syncSvrValidate:function () {
            $('#syncServerForm').validate({

                rules: {
                    syncDomain: {
                        required: true,
                        domain:true
                    },
                    syncPort:{
                        required: true,
                        min:1,
                        max:65535,
                        number:true
                    },
                    syncURL:{
                        required: true
                    },
                    syncAccount:{
                        required: true
                    },
                    syncPwd:{
                        required: true
                    },
                    syncDelay:{
                        required: true,
                        number:true,
                        min:1
                    }
                },
                messages: {
                    syncDomain: {
                        required: '请输入目标服务器域名',
                        domain:'请输入正确的域名'
                    },
                    syncPort:{
                        required: '请输入组名端口',
                        min:'请输入正确的端口',
                        max:'请输入正确的端口',
                        number:Lang.setting.typeNumber
                    },
                    syncURL:{
                        required: '请输入目标服务器地址'
                    },
                    syncAccount:{
                        required: '请输入目标管理员帐号'
                    },
                    syncPwd:{
                        required: '请输入目标管理员密码'
                    },
                    syncDelay:{
                        required: '请输入同步时间间隔',
                        number:Lang.setting.typeNumber,
                        min:'请输入大于0的正整数'
                    }


                },
                wrapper: "div",
                errorPlacement: function (error, element) {
                    $(element).parent().append(error.prepend('<i class="i-warm ml_5"></i>'));
                }

            });
        },
        editSyncSvr:function () {

            var me=this;
            var pop;

            var d=_.extend({},this.syncSvrModel,{showPwd:me.deftPwd});

            var tp=Common.getTemplate(tpl,'#syncServer');
            var html = Common.tpl2Html(tp,d);

            pop=Dialog.pop({
                title: '同步服务器设置',
                content: ['<div class="addSyncSvr">',html,'</div>'].join(''),
                okRemovePop: false,
                okText:'保存修改',
                ok: function () {
                    var formData={};

                    if($('#syncServerForm').valid()){

                        $('#syncServerForm input').each(function(){
                            var name=$(this).attr('name');
                            var value=$(this).val();
                            formData[name]=value;
                        });

                        formData.syncSSL= $('#syncSSL').prop('checked');

                        var data={
                            svrtype:$('#syncType').val(),
                            domain:formData.syncDomain,
                            addr:formData.syncURL,
                            port:formData.syncPort,
                            isSsl:(formData.syncSSL?1:2),
                            user:formData.syncAccount,
                            pass:formData.syncPwd,
                            syncperiod:formData.syncDelay,
                            syncmodel:$('#syncMode').val(),
                            corpId:Setting.model.corpId,
                            syncpower:1
                        };

                        if(data.pass==me.deftPwd){
                            delete data.pass
                        }

                        var opts = {
                            url: Common.getUrlByName('updateSyncSvr'),
                            data: data,
                            success: function (data) {

                                Dialog.tips('修改服务器成功!');
                                pop.removePop();
                                me.getSyncSvr();

                            },
                            fail: function (data) {
                                Dialog.tips(Common.mergeErrMsg('修改服务器失败', data));
                            }
                        };
                        Ajax.request(opts);
                    }

                },
                onPop:function () {
                    me.typeSelect = new Dropkick($('#syncType')[0]);
                    me.modeSelect = new Dropkick($('#syncMode')[0]);
                    me.syncSvrValidate();

                    $('#syncPwd').off('keydown').on('keydown',function(){
                        if($(this).val()==me.deftPwd){
                            $(this).val('');
                        }
                    });

                }

            });




        },
        updateSyncSvr:function(param,success,fail){
            var opts = {
                url: Common.getUrlByName('updateSyncSvr'),
                data: param,
                success: function (data) {
                    success && success(data);
                },
                fail: function (data) {
                    fail && fail(data);
                }
            };
            Ajax.request(opts);
        },
        switchOnSyncSvr:function(el){
            var me=this;
            var $btn=$('#svrBtn');
            var $sOff1=$('#s-off1');
            var $addBtn=$('#addSyncServer');
            var $editBtn=$('#editSyncServer');

            if($(el).is(':checked')){
                $btn.show();

                if(me.syncSvrModel){

                    $addBtn.hide();
                    $editBtn.show();

                    me.updateSyncSvr({
                        corpId: Setting.model.corpId,
                        syncpower: 1
                    }, function (data) {
                        Dialog.tips('组织同步开启成功！');
                    }, function (data) {
                        Dialog.tips(Common.mergeErrMsg('组织同步开启失败', data));
                        $sOff1.prop('checked',true);
                    });
                }else{
                    $addBtn.show();
                    $editBtn.hide();
                }

            }


        },
        switchOffSyncSvr:function(el){
            var me=this;
            var $btn=$('#svrBtn');
            var $sOn1=$('#s-on1');
            if($(el).is(':checked')){

                if (me.syncSvrModel) {
                    me.updateSyncSvr({
                        corpId: Setting.model.corpId,
                        syncpower: 0
                    }, function (data) {
                        Dialog.tips('组织同步关闭成功！');
                        $btn.hide();
                    }, function (data) {
                        Dialog.tips(Common.mergeErrMsg('组织同步关闭失败', data));
                        $sOn1.prop('checked', true);
                    });
                }else{
                    $btn.hide();
                }

            }
        },

        getSyncLog:function () {
            var me=this;
            var opts = {
                url: Common.getUrlByName('getSyncLog'),
                data: {
                    domain:Setting.model.corpData.domain,
                    pageIndex:0,
                    pageSize:1000
                },
                success: function (data) {
                    me.showSyncLog(data);
                },
                fail: function (data) {
                    Dialog.tips(Common.mergeErrMsg('获取同步日志失败', data));
                }
            };

            Ajax.request(opts);
        },
        showSyncLog:function (data) {

            var html=[];
            var tpl=_.template('<tr><td width="10">&nbsp;</td><td width="150"><%- syncStartTime %></td><td width="150" title="<%- userId||deptName %>"><%- userId||deptName %></td><td width="100"><%-syncOpText%></td><td title="<%-syncDesc%>"<%= syncCode?\' style="color:red"\':\'\' %> ><%-syncDesc%></td></tr>');
            var type=['注销用户','恢复用户','开户','修改密码','修改用户','删除用户','添加部门','修改部门','删除部门'];
            if(data.length){
                _.each(data,function(v){
                    v.syncOpText=type[v.syncOp];
                    html.push(tpl(v));
                });
            }else{
                html.push('<tr><td colspan="5" class="noFail">暂无同步记录</td></tr>');
            }

            Dialog.pop({
                title: '同步日志',
                width:600,
                content: ['<div class="faildTableBox mt_10" style="border:1px solid #ddd;"><table class="faildTable" cellspacing="0" cellpadding="0" border="0" width="100%"><thead><tr><td scope="col" width="10">&nbsp;</td><td scope="col" width="150">时间</td><td width="150">名称</td><td width="100">类型</td><td scope="col">结果</td></tr></thead></table><div class="faildTableBox" style="height:174px"><table class="faildTable" cellspacing="0" cellpadding="0" border="0" width="100%">',html.join(''),'</table></div></div>'].join('')

            });
        }
    };


    //路由
    Setting.Router = Backbone.Router.extend({
        routes: {
            'company-manage': 'companyManage',
            'normal-setting': 'normalSetting',
            'account-security': 'accountSecurity',
            'message-setting': 'messageSetting',
            'company-diy': 'companyDiy',
            'system-config': 'systemConfig',
            '*err': function () {
                if (global.user.role == 'root') {
                    Setting.router.navigate('company-manage', {trigger: true});
                } else {
                    $('.searchBox').hide();
                    Setting.router.navigate('normal-setting', {trigger: true});
                }
            }
        },
        companyManage: function () {
            if (global.user.role != 'root') {
                this.navigate('normal-setting', {trigger: true});
                return
            }
            this.showModule('companyManage');
        },
        normalSetting: function () {
            this.showModule('normalSetting');
        },
        accountSecurity: function () {
            this.showModule('accountSecurity');
        },
        messageSetting: function () {
            this.showModule('messageSetting');
        },
        companyDiy: function () {
            this.showModule('companyDiy');
        },
        systemConfig: function () {
            this.showModule('systemConfig');
        },
        showModule:function (moduleName) {
            Module.callModule(Setting[moduleName]);
            this.showView(moduleName);
        },
        showView: function (viewName) {
            $('.tab-li').hide();
            $('#' + viewName).show();
            $('.secMenu li a').removeClass('act');
            $('.secMenu li[data-id=' + viewName + '] a').addClass('act');
            var $companyManageLi = $('.secMenu li[data-id=companyManage]');
            if (global.user.role == 'root') {
                $companyManageLi.show();
            } else {
                $companyManageLi.hide();
            }
        }
    });
    Setting.router = new Setting.Router();

    return {
        init: function () {
            Setting.init();
        }
    };

});