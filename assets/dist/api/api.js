const SET_EXPIRE_DATE=672;
const FREIGHT=0;

const userEac=/^\d{1,}$/;
let emilnEac=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
let language =localStorage.getItem('language')

// 提示框
function promptBox(a) {
    alert(a)
}

// 获取url参数函数封装
function getUrlParameter(key) {
    let urlarr=location.search.substring(1).split('&')
    for(let i=0;i<urlarr.length;i++){
        if(key===urlarr[i].split('=')[0]){
            return urlarr[i].split('=')[1]
        }
    }
}

// 设置带时效的localhost
function setLocalhost(key,value,time) {
    time= time || 1;
    let Time=Number.parseInt(new Date().getTime()/1000)+(time*3600);
    value.Time=Time;
    localStorage.setItem(key,JSON.stringify(value));
}

// 获取localhost/对有效期做判断，过期就清除
function getLocahost(key) {
    let data=JSON.parse(localStorage.getItem(key));
    if(data){
        let thisTIme=Number.parseInt(new Date().getTime()/1000);
        if(thisTIme<data.Time){
            // 更新过期时间
            data.Time=Number.parseInt(new Date().getTime()/1000)+(SET_EXPIRE_DATE*3600);
            localStorage.setItem(key,JSON.stringify(data));
            return data
        }
        else {
            // 用户操作商品时对登陆的有效期做判断，过期就调用退出函数
            logout()
            // 清除已经过期的凭证
            return '';
        }
    }

}

function cheacksocket() {
    // 简体
    if(language==='1'){
        alert('用户已经失效，请重新登录')
    }
    // 英文
    else if(language==='3'){
        alert('The user has failed, please log in again')
    }
    // 繁体
    else {
        alert('用戶已經失效，請重新登入')
    }
    localStorage.removeItem('userID')
    window.open('./index.html','_self')
}

// 获取区号
function getCodel() {
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "post",
            url: "http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/getCode",
            async: true,
            dataType: 'jsonp',
            data: {
                "compid": '34',
            },
            success: function(data) {
                resolve(data)
            }
        })
    })
}

// 获取邮箱注册的验证码
function sendEmailCode(email,type) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "post",
            url: "http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/sendEmailCode",
            async: false,
            dataType: 'jsonp',
            data: {
                "comid": COMID,
                "email":email,
                "type":Number.parseInt(type),
            },
            success: function(data) {
                resolve(data)
            }
        })
    })
}

// 获取电话注册验证码
function sendphoneCode(code,phone,type) {
    let language = localStorage.getItem('language')
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "post",
            url: "http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/checkIfExists",
            async: false,
            dataType: 'jsonp',
            data: {
                "compid": COMID,
                "phnum":Number.parseInt(phone),
                "code":Number.parseInt(code),
            },
            success: function(datas) {
                if(!datas.status){
                    if(language==='1'){
                        alert(datas.message)
                    }
                    // 英文
                    else if(language==='3'){
                        alert('The user has been registered and cannot continue to register')
                    }
                    // 繁体
                    else {
                        alert('用戶已經注册，不能繼續注册')
                    }
                }
                else {
                    $.ajax({
                        type: "post",
                        url: "http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/ajaxGetConfirmCode",
                        async: false,
                        dataType: 'jsonp',
                        data: {
                            "compid": COMID,
                            "phonenumber":Number.parseInt(phone),
                            "regionnum":Number.parseInt(code),
                            "type":type,
                        },
                        success: function(data) {
                            resolve(data)
                            if(data.status){
                                if(language==='1'){
                                    alert('验证码已发送')
                                }
                                // 英文
                                else if(language==='3'){
                                    alert('Verifying code has been sent')
                                }
                                // 繁体
                                else {
                                    alert('驗證碼已發送')
                                }
                            }
                        }
                    })
                }
            }
        })
    })
}

// 获取手机找回密码的验证码
function findphoneCode(code,phone,type) {
    let language = localStorage.getItem('language')
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "post",
            url: "http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/ajaxGetConfirmCode",
            async: false,
            dataType: 'jsonp',
            data: {
                "compid": COMID,
                "phonenumber":Number.parseInt(phone),
                "regionnum":Number.parseInt(code),
                "type":type,
            },
            success: function(data) {
                resolve(data)
                if(data.status){
                    if(language==='1'){
                        alert('验证码已发送')
                    }
                    // 英文
                    else if(language==='3'){
                        alert('Verifying code has been sent')
                    }
                    // 繁体
                    else {
                        alert('驗證碼已發送')
                    }
                }
            }
        })
    })
}

// 手机注册
function register(data) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "post",
            url: "http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/ajaxRegisterUsers",
            async: false,
            dataType: 'jsonp',
            data: {
                "compid": COMID,
                "phonenumber":Number.parseInt(data.phonenumber),
                "regionnum":Number.parseInt(data.regionnum),
                "password":data.password,
                "confirmpassword":data.password2,
                "confirmcode":data.code
            },
            success: function(data) {
                resolve(data)
            }
        })
    })
}

// 邮箱注册
function emailRegisterUser(data,type) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "post",
            url: "http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/emailRegisterUser",
            async: false,
            dataType: 'jsonp',
            data: {
                "comid": COMID,
                "email":data.email,
                "password":data.password,
                "confirmpassword":data.password2,
                "code":data.code,
                "type":type
            },
            success: function(data) {
                resolve(data)
            }
        })
    })
}

//手机找回密码
function phonefindpassword(data) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "post",
            url: "http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/findPassword",
            async: false,
            dataType: 'jsonp',
            data: {
                "compid": COMID,
                "phonenumber":Number.parseInt(data.phonenumber),
                "regionnum":Number.parseInt(data.regionnum),
                "password":data.password,
                "confirmpassword":data.password2,
                "confirmcode":data.code
            },
            success: function(data) {
                resolve(data)
            }
        })
    })
}

// 邮箱登录
function emailLogin(email,password,detail) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "post",
            url: "http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/emailLogin",
            async: false,
            dataType: 'jsonp',
            data: {
                "comid": COMID,
                "email":email,
                "password":password,
                'detail':detail
            },
            success: function(data) {
                resolve(data)
                if(data.status){
                    alert(data.message)
                    data.data.phone=email;
                    setLocalhost('userID', data.data, SET_EXPIRE_DATE);
                    $('#login').css('display','none')
                    $('#out').css('display','block')
                    $('#user a').html('您好,'+getLocahost('userID').phone);
                    window.open('index.html','_self')
                }
                else{
                    // 简体
                    if(language==='1'){
                        alert(data.message)
                    }
                    // 英文
                    else if(language==='3'){
                        alert('Login failure')
                    }
                    // 繁体
                    else {
                        alert('登入失敗')
                    }
                }
            }
        })
    })
}

//手机登陆
function phoneLogin(code,phone,password,detail) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "post",
            url: "http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/ajaxLoginUsers",
            async: false,
            dataType: 'jsonp',
            data: {
                "compid": COMID,
                "phonenumber":Number.parseInt(phone),
                "regionnum":Number.parseInt(code),
                "password":password.toString(),
                // "detail":loginSendSplus()
                "detail":detail
            },
            success: function(data) {
                resolve(data)
                if(data.status){
                    alert(data.message)
                    data.data.phone=phone;
                    data.data.regionnum=code;
                    setLocalhost('userID', data.data, SET_EXPIRE_DATE);
                    $('#login').css('display','none')
                    $('#out').css('display','block')
                    $('#user a').html('您好,'+getLocahost('userID').phone);
                    window.open('index.html','_self')
                }
                else{
                    // 简体
                    if(language==='1'){
                        alert(data.message)
                    }
                    // 英文
                    else if(language==='3'){
                        alert('Login failure')
                    }
                    // 繁体
                    else {
                        alert('登入失敗')
                    }
                }
            }
        })
    })
}

// 获取导航接口
function nav() {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/webNavigation',
            type:'post',
            dataType:'jsonp',
            data:{
                comid:COMID
            },
            success:function (data) {
                resolve(data)
            }
        })
    })
}

// 获取单个导航的数据接口
function getAllNavInfo(id) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/getAllNavInfo',
            type:'post',
            dataType:'jsonp',
            data:{
                comid:COMID,
                navid:id
            },
            success:function (data) {
                resolve(data)
            }
        })
    })
}

//获取商品分类
function classify() {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/getAll',
            type:'post',
            dataType:'jsonp',
            data:{
                comid:COMID
            },
            success:function (data) {
                resolve(data)
            }
        })
    })
}

// 获取某个产品的详情
function getProDetail(id) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/getProDetail',
            type:'post',
            dataType:'jsonp',
            data:{
                comid:COMID,
                pid:Number.parseInt(id)
            },
            success:function (data) {
                resolve(data)
            }
        })
    })
}

// 对本地购物车数据封装
function loginSendSplus() {
    let data=JSON.parse(localStorage.getItem('datas')).listdata;
    let Splusobj={};
    for (let i=0;i<data.length;i++){
        if(data[i].commodity_number>=1){
            Splusobj[data[i].expend_product_id]=data[i].commodity_number
        }
    }
    return Splusobj
}

// 账号退出函数
function logout() {
    $.ajax({
        url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/logout',
        type:'post',
        dataType:'jsonp',
        data:{
            "uid":Number.parseInt(getLocahost('userID').user_id),
            "compid":COMID,
            "scoket":getLocahost('userID').socket
        },
        success:function (data) {
            if(data.status){
                // 退出成功清除用户数据
                localStorage.removeItem('userID')
                window.open('index.html','_self')
            }
            else {
                cheacksocket()
            }
        }
    })
}

// 对本地购物车数据封装
function LocalShoppingCart(id,sum,xid,add,modify) {
    let data=JSON.parse(localStorage.getItem('LocalShoppingCart'));
    if(data){
        let has=true;
        for(let i=0;i<data.length;i++){
            if(data[i].xid==xid){
                has=false
                if (sum==0){
                    data.splice(i,1)
                }
                else {
                    data[i].sum=sum
                }
            }
        }
        if(has && sum!=0){
            data.push({
                id:id,
                sum:sum,
                xid:xid
            })
        }
        localStorage.setItem('LocalShoppingCart',JSON.stringify(data))
        if(!getLocahost('userID') && modify){
            alert('添加商品到購物車成功')
        }
    }
    else {
        let shoppingarr=[];
        shoppingarr.push({
            id:id,
            sum:sum,
            xid:xid
        })
        console.log('222')
        localStorage.setItem('LocalShoppingCart',JSON.stringify(shoppingarr))
        if(!getLocahost('userID')){
            alert('添加商品到購物車成功')
        }
    }
    if(getLocahost('userID') && add){
        sendLocahostSplus({[id]:sum}).then((data)=>{
            if(data.status){
                // window.open('shoppingCart.html','_self')
                // promptBox('加入成功')
            }
        })
    }
    else if(getLocahost('userID') && sum==0){
        delCart({0:id})
    }
    else if (getLocahost('userID')) {
        console.log('222')
        changeSplus(id,sum)
    }
}

// 向购物车添加商品
function sendLocahostSplus(detail) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/addToCart',
            type:'post',
            dataType:'jsonp',
            data:{
                "uid":getLocahost('userID').user_id,
                'socket':getLocahost('userID').socket,
                'cpid':COMID,
                'detail': detail
            },
            success:function (data) {
                resolve(data)
                if(data.status){
                    // 简体
                    if(language==='1'){
                        promptBox('添加商品到购物车成功')
                    }
                    // 英文
                    else if(language==='3'){
                        promptBox('Add goods to the shopping cart success')
                    }
                    // 繁体
                    else {
                        promptBox('添加商品到購物車成功')
                    }
                }
                else {
                    if(data.code===202){
                        cheacksocket()
                    }
                    else {
                        // 简体
                        if(language==='1'){
                            promptBox('添加商品到购物车失败')
                        }
                        // 英文
                        else if(language==='3'){
                            promptBox('Add goods to the failure of a shopping cart')
                        }
                        // 繁体
                        else {
                            promptBox('添加商品到購物車失敗')
                        }
                    }
                }

            }
        })
    })
}

// 移除购物车的商品
function delCart(detail) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/delCart',
            type:'post',
            dataType:'jsonp',
            data:{
                "uid":getLocahost('userID').user_id,
                'socket':getLocahost('userID').socket,
                'compid':COMID,
                'pid': detail
            },
            success:function (data) {
                resolve(data)
                if(data.status){
                    // 简体
                    if(language==='1'){
                        promptBox('商品已从购物车移除')
                    }
                    // 英文
                    else if(language==='3'){
                        promptBox('The goods have been removed from the shopping cart')
                    }
                    // 繁体
                    else {
                        promptBox('商品已從購物車移除')
                    }

                }
                else {
                    if(data.code===202){
                        cheacksocket()
                    }
                    else {
                        // 简体
                        if(language==='1'){
                            promptBox('移除商品失败')
                        }
                        // 英文
                        else if(language==='3'){
                            promptBox('Remove goods from failure')
                        }
                        // 繁体
                        else {
                            promptBox('移除商品失敗')
                        }

                    }

                }

            }
        })
    })
}

// 对已加入购物车的商品做操作
function changeSplus(id,num) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/modifyCartNum',
            type:'post',
            dataType:'jsonp',
            data:{
                'uid':Number.parseInt(getLocahost('userID').user_id),
                'socket':getLocahost('userID').socket,
                'cpid':COMID,
                'num':num,
                'pid':id,
            },
            success:function (data) {
                resolve(data)
                if(data.code===202){
                    cheacksocket()
                }
            }
        })
    })

}

//请求的购物车列表
function requesSplus() {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/cartList',
            type:'post',
            dataType:'jsonp',
            data:{
                'uid':Number.parseInt(getLocahost('userID').user_id),
                'socket':getLocahost('userID').socket,
                'cpid':COMID
            },
            success:function (data) {
                resolve(data)
                if(data.code===202){
                    cheacksocket()
                }
            }
        })
    })
}

// 购物车列表选择商品
function cartSelectProduct(Detail) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/cartSelectProduct',
            type:'post',
            dataType:'jsonp',
            data:{
                'uid':Number.parseInt(getLocahost('userID').user_id),
                'socket':getLocahost('userID').socket,
                'cpid':COMID,
                'detail':Detail
            },
            success:function (data) {
                resolve(data)
                if(data.code===202){
                    cheacksocket()
                }
            }
        })
    })
}

// 商品结算
function checkOut(detail) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/checkOut',
            type:'post',
            dataType:'jsonp',
            data:{
                'uid':Number.parseInt(getLocahost('userID').user_id),
                'socket':getLocahost('userID').socket,
                'cpid':COMID,
                'detail':detail
            },
            success:function (data) {
                resolve(data)
                if(data.code===202){
                    cheacksocket()
                }
            }
        })
    })
}

// 提交订单
function CommitOrder(data) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/commitOrder',
            type:'post',
            dataType:'jsonp',
            data:{
                'uid':Number.parseInt(getLocahost('userID').user_id),
                'socket':getLocahost('userID').socket,
                'cpid':COMID,
                'detail':data.Detail,
                'receive_user':data.user,
                'receive_phone':data.phone,
                'receive_address':data.address,
                'pay_way':data.pay_way
            },
            success:function (data) {
                resolve(data)
                if(data.code===202){
                    cheacksocket()
                }
            }
        })
    })
}

// 获取订单列表
function OrdersList() {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/ordersList',
            type:'post',
            dataType:'jsonp',
            data:{
                'uid':Number.parseInt(getLocahost('userID').user_id),
                'socket':getLocahost('userID').socket,
                'cpid':COMID,
            },
            success:function (data) {
                resolve(data)
                if(data.code===202){
                    cheacksocket()
                }
            }
        })
    })
}

// 获取模块
function getModelContent(sign) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/getModelContent',
            type:'post',
            dataType:'jsonp',
            data:{
                compid:COMID,
                sign:sign
            },
            success:function (data) {
                resolve(data)
            }
        })
    })
}

// 获取广告
function getBanners() {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/getBanner',
            type:'post',
            dataType:'jsonp',
            data:{
                comid:COMID,
            },
            success:function (data) {
                resolve(data)
            }
        })
    })
}

// 获取网站的基本信息
function baseInfo() {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/baseInfo?comid='+COMID,
            type:'post',
            dataType:'jsonp',
            // data:{
            //     comid:COMID,
            // },
            success:function (data) {
                resolve(data)
            }
        })
    })
}

// 上门送货列表
function getSmsh() {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/getSmsh',
            type:'post',
            dataType:'jsonp',
            data:{
                compid:COMID,
            },
            success:function (data) {
                resolve(data)
            }
        })
    })
}

// 常见问题列表
function getFrePros() {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/getFrePros',
            type:'post',
            dataType:'jsonp',
            data:{
                compid:COMID,
            },
            success:function (data) {
                resolve(data)
            }
        })
    })
}

// 隐私条例
function getPrivates() {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/getPrivates',
            type:'post',
            dataType:'jsonp',
            data:{
                compid:COMID,
            },
            success:function (data) {
                resolve(data)
            }
        })
    })
}

// 项目条款
function getItemlist() {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/getItems',
            type:'post',
            dataType:'jsonp',
            data:{
                compid:COMID,
            },
            success:function (data) {
                resolve(data)
            }
        })
    })
}

// 智能自提柜
function getIntelZtg() {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/getIntelZtg',
            type:'post',
            dataType:'jsonp',
            data:{
                compid:COMID,
            },
            success:function (data) {
                resolve(data)
            }
        })
    })
}

//提交反馈信息
function FeedbackInfo(datas) {
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://www.1ecst.com/tp_ecst/index.php/Api2/Ecustomers/insertFeedbackInfo',
            type:'post',
            dataType:'jsonp',
            data:{
                comid:COMID,
                name:datas.name,
                phone:datas.phone,
                email:datas.email,
                message:datas.message,
            },
            success:function (data) {
                resolve(data)
            }
        })
    })
}