/**
 * Created by Yangz on 2016/3/25.
 */


define(function () {
    return {

        //公用
        common: {
            invalidFn: '无效请求方法名',
            weak: '弱',
            normal: '中',
            strong: '强',
            operate: '操作',
            add: '添加',
            addSuc: '添加成功',
            addFail: '添加失败',
            'del': '删除',
            delSuc: '删除成功',
            delFail: '删除失败',
            edit: '编辑',
            editSuc: '修改成功',
            editFail: '修改失败',
            setSuc: '设置成功',
            setFail: '设置失败',
            searchFail: '搜索失败',
            out: '移除',
            setting: '设置',
            tips: '提示',
            loading: '数据加载中，请稍候...',
            loadMore: '加载更多',
            loadFail: '数据加载失败,请重试！',
            fetchFail: '数据拉取失败！',
            noData: '暂无数据！',
            ok: '确定',
            cancel: '取消',
            warn:'警告',
            from: '显示从',
            to: '到',
            all: '共',
            unit: '条',
            pageSize: '每页显示',
            pageTips: '输入页数按Enter键跳到该页',
            sysTips:'系统提示',
            loginTimeout:'登录超时，请重新登录！',
            getComInfoFail:'获取企业信息失败,请重新登录！',
            copyright:'版权所有:彩讯科技股份有限公司',
            version:'版本号',
            licence:'许可证信息',
            getLicenceFail:'获取许可证信息失败',
            baseInfo:'基本信息',
            licenceId:'许可证ID',
            customer:'授权客户',
            domain:'授权域名',
            productType:'产品类型',
            licenceType:'许可类型',
            userCount:'用户数',
            expireTime:'过期时间',
            productInfo:'产品信息',
            product:'产品',
            finalVersion:'正式版',
            trialVersion:'试用版',
            userUnit:'个',
            vas:'增值服务'
        },

        //头部
        head: {
            backToUser: '返回用户平台',
            exit: '退出',
            companyDisk: '企业网盘',
            managerCenter: '管理中心',
            uncInfo:'用户及企业信息'
        },
        sideBar: {
            diskSetting: '网盘设置',
            userManager: '用户管理',
            logManager: '日志管理',
            statisticManager: '统计管理'
        },
        //企业开户
        addCompany: {
            typeAccount: '请输入帐号',
            addCompanySuc: '企业添加成功',
            addCompanyFail: '企业添加失败'
        },

        //网盘设置
        setting: {
            companyManage: '企业管理',
            normalSetting: '常规设置',
            accountSecurity: '账户安全',
            messageSetting: '消息设置',
            companyDiy: '企业定制',
            systemConfig: '系统配置',
            searchByNnD: '按名称或域名搜索',
            add: '添加企业',
            allCompany: '所有企业',
            normalCompany: '正常企业',
            lockedCompany: '锁定企业',
            back: '返回',
            pwdLv: '密码强度',
            minPwd: '最小密码长度',
            pwdRule1: '必须包含特殊字符，如 %&@#！% ',
            pwdRule2: '必须包含大写字母',
            pwdRule3: '禁止使用弱密码，包括一种字符和连续字符，如123456/aaaaaa',
            pwdTime: '密码定期修改',
            never: '从不',
            month1: '一个月',
            month2: '二个月',
            month3: '三个月',
            month6: '半年',
            month12: '一年',
            diskMaxFileUpLoad2: '单文件上传最大值（G）：',
            defaultUserCapacity2:'单用户个人盘默认容量（MB）：',
            defaultTeamCapacity2:'单用户团队协作默认容量（MB）：',
            diskMaxUserCapacity2: '单用户个人盘最大容量（MB）：',
            maxUserTeamCapacity2: '单用户团队协作最大容量（MB）：',
            maxUserTeamNum2: '单用户可创建团队协作个数（个）：',
            maxUserTeamMember2: '单用户团队协作成员上限（人）：',
            diskMaxFileDownNum2: '文件外链下载次数（次）：',
            diskMaxFileDownTime2: '文件外链下载有效期（天）：',
            diskVersionsNum2: '历史版本保留个数（个）：',
            diskVersionsTime2: '历史版本保留时间（天）：',
            custom: '自定义',
            customTime2: '自定义时间：',
            months: '个月',
            companyInfo: '企业信息',
            companyName: '企业名称',
            domain: '域名',
            timeout: '过期时间',
            space: '空间',
            defaultPersonSpace: '默认个人盘空间',
            defaultGroupSpace: '默认团队协作空间',
            userLimit: '用户数',
            status: '企业状态',
            account: '账号',
            password: '密码',
            newPassword: '请输入新密码',
            confirmPwd: '确认密码',
            typeName: '请输入企业名称',
            typeLegalName: '请输入正确的企业名称',
            typeDomain: '请输入域名',
            typeSpace: '请输入空间大小',
            typeUserLimit: '请输入用户数',
            typeAccount: '请输入账号',
            typeLegalAccount: '请输入正确的账号',
            typePwd: '请输入密码',
            typePwd2: '请再次输入密码',
            typeConfirmPwd: '请再次输入密码',
            minPsw: '密码长度至少{0}位',
            maxPws: '请输入最多{0}位字符的密码',
            legalPsw: '请输入包含至少2种组合的密码',
            pswNotEqual: '两次输入密码不一致',
            typeNumber: '请输入数字',
            minNumber: '请输入不小于{0}的数字',
            gtZero: '请输入大于0的数字',
            maxNumber: '请输入不大于{0}的数字',
            customTime: '请输入自定义过期时间',
            typeDigits: '请输入正整数',
            remarkLength: '请输入100字符以内的备注',
            normal: '正常',
            locked: '锁定',
            canceled: '注销',
            userUnit: '人',
            month: '个月',
            year: '年',
            forever: '永久',
            typeKeyword: '请输入搜索关键字',
            selectCompany: '请选择要锁定的企业',
            userManage: '用户管理',
            listFail: '企业列表拉取失败',
            editStatusSuc: '修改企业状态成功',
            editStatusFail: '修改企业状态失败',
            accountExist: '帐号已存在',
            addComSuc: '企业添加成功',
            addComFail: '企业添加失败',
            editComSuc: '企业信息修改成功',
            editComFail: '企业信息修改失败',
            getComInfoFail: '获取企业信息失败',
            getSafeInfoFail: '获取安全设置失败',
            confirmLock: '确定锁定所选企业？',
            fetchNormalFail: '获取常规设置数据失败！',
            companyNameExisted: '企业名称已存在',
            domainExisted: '域名已存在',
            userIdExisted: '用户名已存在',
            settingSaved: '设置保存成功！',
            settingFail: '设置失败！',
            diskMaxFileUpLoad: '请输入单文件上传最大值',
            defaultUserCapacity:'请输入单用户个人盘默认容量',
            defaultTeamCapacity:'请输入单用户团队协作默认容量',
            diskMaxUserCapacity: '请输入用户个人盘最大容量',
            maxUserTeamCapacity: '请输入单用户团队协作最大容量',
            maxUserTeamNum: '请输入单用户可创建团队协作个数',
            maxUserTeamMember: '请输入单用户团队协作成员上限',
            diskMaxFileDownNum: '请输入文件外链下载次数',
            diskMaxFileDownTime: '请输入文件外链下载有效期',
            diskVersionsNum: '请输入历史版本保留个数',
            diskVersionsTime: '请输入历史版本保留时间',
            diskMaxFileUpLoadMax: '单文件上传最大值不能超过{0}G',
            defaultUserCapacityMax:'单用户个人盘默认容量不能超过{0}MB',
            defaultTeamCapacityMax:'单用户团队协作默认容量不能超过{0}MB',
            diskMaxUserCapacityMax: '单用户个人盘最大容量不能超过{0}MB',
            maxUserTeamCapacityMax: '单用户团队协作最大容量不能超过{0}MB',
            maxUserTeamNumMax: '单用户可创建团队协作个数不能超过{0}个',
            maxUserTeamMemberMax: '单用户团队协作成员上限不能超过{0}人',
            diskMaxFileDownNumMax: '文件外链下载次数不能超过{0}次',
            diskMaxFileDownTimeMax: '文件外链下载有效期不能超过{0}天',
            diskVersionsNumMax: '历史版本保留个数不能超过{0}个',
            diskVersionsTimeMax: '历史版本保留时间不能超过{0}天',
            userCapacity:'单用户个人盘默认容量不能大于单用户个人盘最大容量',
            teamCapacity:'单用户团队协作默认容量不能大于单用户团队协作最大容量',
            people:'人',
            getMsgSetFail:'获取消息设置失败',
            setMsgSuc:'消息设置保存成功！',
            setMsgFail:'消息设置保存失败',
            resetPwd:'重置密码',
            resetAdminPwd:'重置管理员密码',
            resetAdminPwdSuc:'重置管理员密码成功！',
            resetAdminPwdFail:'重置管理员密码失败',
            cantDelCompany:'不可删除正在使用中的企业，请先锁定该企业！',
            confirmDelCompany:'请确认是否删除企业“{0}”？<div style="color:#e02e2e; line-height:22px">将删除该企业下的所有资料，请确认是否有资料需要备份！</div>',
            delCompanySuc:'企业删除成功！',
            delCompanyFail:'企业删除失败'

        },

        //用户管理
        userManager: {
            userName: '用户名',
            depart: '所属部门',
            ungrouped: '未分组',
            spChar: '必须包含特殊字符,如!@#$%^&*.',
            caps: '必须包含大写字母',
            weak: '禁止使用弱密码，如一种字符或连续字符',
            allUser: '所有用户',
            userList: '成员列表',
            getDeptFail: '获取部门数据失败',
            getUserInfoFail: '获取用户数据失败',
            name: '姓名',
            typeName: '请输入姓名',
            userSpace: '个人空间',
            spaceSetting: '空间设置',
            teamSpace: '团队协作空间',
            typeUserName: '请输入用户名',
            emailNotCorrect: '请输入正确的邮箱格式',
            addUserSuc: '用户添加成功',
            addUserFail: '用户添加失败',
            addUser: '创建用户',
            addDeptUser: '添加部门用户',
            selectUser: '请选择要添加的用户',
            addDeptUserSuc: '添加部门用户成功',
            addDeptUserFail: '添加部门用户失败',
            updateUserSuc: '用户信息更新成功',
            updateUserFail: '用户信息更新失败',
            userSetting: '用户设置',
            unactived: '该用户未激活',
            cantDelAdmin: '不能删除管理员',
            confirmDel: '确定删除？',
            confirmDel2: '确定删除这{0}个用户？',
            confirmDelUser: '确定删除用户',
            delUserSuc: '用户删除成功',
            delUserFail: '用户删除失败',
            selectDelUser: '请选择要删除的用户',
            outUserSuc: '移除用户成功',
            outUserFail: '移除用户失败',
            outConfirm: '确定要将用户：{0} 移除本部门吗？',
            outConfirms: '确定要将这{0}个用户移除本部门吗？',
            selectOutUser: '请选择要从该部门移除的用户',
            importUser: '批量导入用户',
            importUserResult: '批量导入结果查询',
            selectFile: '请选择要上传的文件',
            uploading: '文件上传中，请稍候……',
            fileTips: '请选择格式为{0}的文件',
            importBtn: '导入',
            uploadTips: '文件上传成功，请稍后刷新页面查看部门用户数据！',
            uploadFail: '文件上传失败，请重试！',
            deptName: '部门名称',
            typeDeptName: '请输入部门名称',
            reDeptName: '部门名称重复',
            addDept: '新建部门',
            addDeptSuc: '新建部门成功',
            addDeptFail: '新建部门失败',
            editDept: '修改部门',
            editDeptSuc: '修改部门成功',
            editDeptFail: '修改部门失败',
            getDeptInfoFail: '获取部门详细信息失败',
            delDeptConfirm: '确定删除部门：{0} ？',
            delDeptSuc: '部门删除成功',
            delDeptFail: '部门删除失败',
            searchTips: '输入用户名、邮箱搜索',
            searchResult: '查找到',
            noResult: '没有符合条件的用户！',
            clearAll: '清空所有用户',
            user: '用户',
            lessThanPerson: '不能超过个人空间最大值',
            lessThanGroup: '不能超过团队协作空间最大值',
            lessThan2: '不能超过上级部门可用空间大小',
            email: '邮箱',
            typeEmail: '请输入邮箱',
            mobile: '手机号',
            typeMobile: '请输入手机号',
            modifyPsw: '首次登录修改密码',
            downFileTpl: '下载模板文件',
            downTpl: '下载模板',
            fileType: 'xls文件',
            editTpl: '编辑模板文件',
            selectTplFile: '选择编辑好的文件',
            selectTplFile2: '选择文件',
            deptSpace: '部门空间',
            deptUserLimit: '团队人数上限',
            typeDeptUserLimit: '请输入团队人数上限',
            remark: '备注',
            accountSetting: '用户设置',
            userPsw: '用户密码',
            usedSpace: '当前已用个人空间',
            usedSpace2: '当前已用团队协作空间',
            all: '共',
            nameExisted: '姓名已存在',
            emailExisted: '邮箱已存在',
            mobileExisted: '手机号码已存在',
            illegalUserId: '请输入正确的用户名',
            illegalName: '请输入正确的姓名',
            illegalMobile: '请输入正确的手机号码',
            maxPwd: '请输入小于{0}字符的密码',
            fileNotExist: '所选文件不存在，请重新选择！',
            illegalDeptName: "请输入正确的部门名称",
            maxDeptMember: '不能超过上级部门可分配人数({0}人)',
            importing: '正在导入，请稍候...',
            impResult: '成功导入{0}条，失败{1}条，失败记录如下：',
            impStatus0: '入库',
            impStatus1: '处理中',
            impStatus2: '成功',
            impStatus3: '失败',
            getImpFail: '获取批量导入结果失败',
            noImpResult: '暂无批量导入操作',
            noFail: '暂无失败记录',
            sByUserId: '按用户名搜索',
            imResultQuery: '导入结果查询',
            addDeptMember: '添加部门成员',
            addDeptMember2: '添加现有成员',
            editDeptS: '修改部门设置',
            delDept: '删除部门',
            outOfDept: '移出部门',
            delUser: '删除用户',
            impStatus: '状态',
            impReason: '原因'

        },

        //日志管理
        log: {
            all: '全部',
            time: '时间',
            opUser: '操作者',
            group: '所属群组',
            opType: '操作类型',
            action: '动作',
            result: '结果',
            type: '渠道',
            data: '文件操作',
            user: '用户管理',
            team: '团队管理',
            grant: '授权管理',
            web: 'WEB',
            pc: 'PC客户端',
            mobile: '手机客户端'
        },

        //统计管理
        statistic: {
            file: '文件统计',
            space: '空间统计',
            fileSize: '文件大小统计',
            fileSize2: '文件大小',
            fileSizeCount: '文件总大小：',
            fileCountS: '文件个数统计',
            fileCountNumber: '总文件数：',
            fileOp: '文件操作次数统计',
            today: '今天',
            week: '近一周',
            month: '近30天',
            year: '近一年',
            allSpace: '总容量：',
            spaceUse: '容量使用情况',
            team: '企业文库',
            person: '个人空间',
            group: '团队协作',
            "export2": '导出',
            allSpace2: '总空间',
            usedSpace: '已用空间',
            assignSpace: '分配空间',
            restSpace: '剩余空间',
            fileCount: '文件个数',
            avg: '平均值',
            upload: '上传',
            download: '下载',
            link: '创建外链',
            del: '删除',
            searchByUserId: '输入用户名搜索',
            searchByLibName: '输入文库名称搜索',
            searchByGroupName: '输入团队名称搜索',
            libName: '文库名称',
            groupName: '团队名称',
            availableSpace:'可用空间',
            used:'已使用'
        }


    }
});