var sure_btn = document.getElementsByClassName('sure_btn')[0]; //确定按钮
var change_btn = document.getElementsByClassName('change_btn')[0]; //换一换按钮
var name1Input = document.getElementById('name1'); // 输入的name1
var name2Input = document.getElementById('name2'); // 输入的name2
var cp_name_span = document.getElementsByClassName('cp_name')[0];

var intro_p1 = document.getElementsByClassName('intro1')[0];
var intro_p2 = document.getElementsByClassName('intro2')[0];
var intro_p3 = document.getElementsByClassName('intro3')[0];
var intro_p4 = document.getElementsByClassName('intro4')[0];

var ciyuOption = document.getElementsByName("style")[0];
var chengyuOption = document.getElementsByName("style")[1];
var nameDic = ciyuDicFinal; // 默认词典

//复选框成语词语二选一
var styleOptin = function (value) {
    if (value == 'ciyu') {
        if (ciyuOption.checked == 'checked') {
            return; // 如果已经选过了则不做任何操作
        }
        ciyuOption.checked = true;
        chengyuOption.checked = false;
        nameDic = ciyuDicFinal;
        clearContent();
    }
    if (value == 'chengyu') {
        if (chengyuOption.checked == 'checked') {
            return;
        }
        ciyuOption.checked = false;
        chengyuOption.checked = true;
        nameDic = chengyuDicFinal;
        clearContent();
    }
}

// 清空内容
var clearContent = function () {
    cp_name_span.innerText = '';
    intro_p1.innerText = '';
    intro_p2.innerText = '';
    intro_p3.innerText = '';
    intro_p4.innerText = '';
    change_btn.disabled = 'disabled';
}

// 匹配中文字符，为了走完之后name12Inputvalue内只包含中文
var chineseStr = function (str) {
    var reg = /[\u4e00-\u9fa5]/g;
    if (!str || !str.match(reg)) {
        return 0;
    }
    return str.match(reg).join('');
}

// 点击确定生成cp名
sure_btn.onclick = function () {
    var cpNameArray = [];
    cpNameArray = cpNames(chineseStr(name1Input.value), chineseStr(name2Input.value));
    if (cpNameArray == '!') {
        clearContent();
        return;
    }
    if (cpNameArray == 0) {
        clearContent();
        cp_name_span.innerText = 'ε-(´∀｀; ) 没找着';
        cp_name_span.style.fontSize = '15px';
        return;
    } else {
        change_btn.removeAttribute('disabled');
        cp_name_span.innerText = cpNameArray[0];

        if (nameDic == ciyuDicFinal) {
            intro_p1.innerText = ciyuDic[cpNameArray[0]] ? ciyuDic[cpNameArray[0]] : '';
        } else {
            intro_p1.innerText = chengyuDic[cpNameArray[0]][0];
            intro_p2.innerText = chengyuDic[cpNameArray[0]][1];
            intro_p3.innerText = chengyuDic[cpNameArray[0]][2];
            intro_p4.innerText = chengyuDic[cpNameArray[0]][3];
        }
    }
    // 字体大小随字数改变使之适应文本框
    var len = cpNameArray[0].length;
    cp_name_span.style.fontSize = 100 - (5 * len) + 'px';

    cpNameArray.push('over');
    print(cpNameArray);
    
    // 点击换一换，换个cp名
    var i = 1;
    change_btn.onclick = function () {
        // console.log(cpNameArray);
        if (cpNameArray.length > i) {
            cp_name_span.innerText = cpNameArray[i];

            if (i == cpNameArray.length - 1) {
                intro_p1.innerText = '';
                intro_p2.innerText = '';
                intro_p3.innerText = '';
                intro_p4.innerText = '';
            } else {
                if (nameDic == ciyuDicFinal) {
                    intro_p1.innerText = ciyuDic[cpNameArray[i]] ? ciyuDic[cpNameArray[i]] : '';
                } else {
                    intro_p1.innerText = chengyuDic[cpNameArray[i]][0];
                    intro_p2.innerText = chengyuDic[cpNameArray[i]][1];
                    intro_p3.innerText = chengyuDic[cpNameArray[i]][2];
                    intro_p4.innerText = chengyuDic[cpNameArray[i]][3];
                }
            }

            // console.log(len)
            // 字体大小随字数改变使之适应文本框
            len = cpNameArray[i].length;
            cp_name_span.style.fontSize = 100 - (5 * len) + 'px';
            // console.log(cp_name_span.style.fontSize);

            i++;
            if (i == cpNameArray.length) {
                i = 0;
            }
        }
        // console.log(cpNameArray);
    }
}



// 生成cp名
var cpNames = function (name1Inputvalue, name2Inputvalue) {

    if (!name1Inputvalue || !name2Inputvalue) {
        return '!';
    }

    // 将两个name转为拼音
    var name1PinYin = pinyin.getFullChars(name1Inputvalue).split(' ');
    var name2PinYin = pinyin.getFullChars(name2Inputvalue).split(' ');

    // 数组去重
    name1PinYin = Array.from(new Set(name1PinYin));
    name2PinYin = Array.from(new Set(name2PinYin));
    var len1 = name1PinYin.length,
        len2 = name2PinYin.length;
    // console.log(name1PinYin);
    // console.log(name2PinYin);
    // 分别从两个数组里选一个字拼音，作为属性名，取对应的属性值重合的部分
    var strArray = []; //存放符合要求的cp字典里的属性名
    var str = []; // 每一个符合条件的属性名
    for (var i = 0; i < len1; i++) {
        for (var j = 0; j < len2; j++) {
            if (name1PinYin[i] == name2PinYin[j]) { // 如果两个字同音，那么cp名也得至少两个音相同
                str = doubleYin(nameDic[name1PinYin[i]], name1PinYin[i]);

                for (var h = 0; h < str.length; h++) {
                    strArray.push(str[h]);
                }
                continue;
            }

            if (!nameDic[name1PinYin[i]] || !nameDic[name2PinYin[j]]) {
                continue; // 因为有的拼音可能还没录入字典里
            } else {
                str = arrayIntersection(nameDic[name1PinYin[i]], nameDic[name2PinYin[j]]);
                // console.log(str);
                if (str == []) {
                    continue;
                } else {
                    for (var h = 0; h < str.length; h++) {
                        strArray.push(str[h]);
                    }
                }
            }
        }
    }
    // strArray去重
    strArray = Array.from(new Set(strArray));
    return strArray;
}
// arrayIntersection取两数组重合部分（有更优化对方式吗？？？？？？？）
var arrayIntersection = function (a, b) {
    var ai = 0,
        bi = 0;
    var result = new Array();
    for (ai = 0; ai < a.length; ai++) {
        for (bi = 0; bi < b.length; bi++) {
            if (a[ai] == b[bi]) {
                result.push(a[ai])
            } else {
                continue;
            }
        }
    }
    return result;
}

// 至少有两个音相同
var doubleYin = function (array, yin) {
    var obj = {};
    var doubleArray = [];
    for (var i = 0; i < array.length; i++) {
        var yinArray = pinyin.getFullChars(array[i]).split(' ');
        // console.log(yinArray[i]);
        obj = {};
        for (var j = 0; j < array[i].length; j++) {
            //    console.log(yinArray[j])
            if (yinArray[j] == yin) {
                if (obj[yin]) {
                    doubleArray.push(array[i]);
                } else {
                    obj[yin] = 1;
                }
            }
        }

    }
    return doubleArray;
}

var print = function(arr){
    var str = arr.join('" , "');
    console.log(str);
}