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
// var wangyouOption = document.getElementsByName("style")[2];

var sure_btn = document.getElementsByClassName('sure_btn')[0]; //确定按钮
var change_btn = document.getElementsByClassName('change_btn')[0]; //换一换按钮
var name1 = document.getElementById('name1').value;
var name2 = document.getElementById('name2').value;
var ciyuOption = document.getElementsByName("style")[0];
var cp_name_span = document.getElementsByClassName('cp_name')[0];
// var tp;
var main = document.getElementsByClassName('main')[0];
var error = document.getElementsByClassName('error')[0];
var errorDisplay = function(){
    main.style.disply = 'none';
    error.style.disply = 'block';
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


var styleOptin = function (value) {
    if (value == 'ciyu') {
        if (ciyuOption.checked == 'checked') {
            return; // 如果已经选过了则不做任何操作
        }
        ciyuOption.checked = true;
        chengyuOption.checked = false;
        clearContent();
    }
    if (value == 'chengyu') {
        if (chengyuOption.checked == 'checked') {
            return;
        }
        ciyuOption.checked = false;
        chengyuOption.checked = true;
        clearContent();
    }

}

// 当点击确定时
sure_btn.onclick = function () {
    var name1 = name1Input.value;
    var name2 = name2Input.value;
    var tp;
    if (ciyuOption.checked == true) {
        tp = 1;
    }
    if (chengyuOption.checked == true) {
        tp = 2;
    }

    $.ajax({
        type: "get",
        url: "http://49.232.68.86/cp/cpname",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        data: {
            name1: name1,
            name2: name2,
            tp: tp
        },
        success: function (response) {
            if (!name1 || !name2) {
                clearContent();
                return;
            }
            var res = JSON.parse(response); // 字符串转对象
            var cpArray = res.data;
            // console.log(cpArray);

            if (cpArray.length == 0) {
                clearContent();
                cp_name_span.innerText = 'ε-(´∀｀; ) 没找着';
                cp_name_span.style.fontSize = '15px';
                return;
            } else {
                change_btn.removeAttribute('disabled');
                cp_name_span.innerText = cpArray[0].name;
                if (tp == 1) {
                    intro_p1.innerText = cpArray[0].desc ? cpArray[0].desc : '';
                }
                if (tp == 2) {
                    intro_p1.innerText = cpArray[0].desc[0] ? cpArray[0].desc[0] : '';
                    intro_p2.innerText = cpArray[0].desc[1] ? cpArray[0].desc[1] : '';
                    intro_p3.innerText = cpArray[0].desc[2] ? cpArray[0].desc[2] : '';
                    intro_p4.innerText = cpArray[0].desc[3] ? cpArray[0].desc[3] : '';
                }

                console.log(cpArray[0]);
                console.log(typeof cpArray[0]);
            }

            // 字体大小随字数改变使之适应文本框
            var len = cpArray[0].name.length;
            cp_name_span.style.fontSize = 100 - (5 * len) + 'px';

            cpArray.push({
                name: 'over',
                desc: []
            });

            // 遍历数组
            // for(let key  in cpArray){
            //     console.log(cpArray[key].name);
            // }


            // 点击换一换，换个cp名
            var i = 1;
            var cpArrayLength = cpArray.length;

            change_btn.onclick = function () {
                if (cpArrayLength > i) {
                    cp_name_span.innerText = cpArray[i].name;
                   

                    if (tp == 1) {
                        intro_p1.innerText = cpArray[i].desc? cpArray[i].desc : '';
                    }
                    if (tp == 2) {
                        intro_p1.innerText = cpArray[i].desc[0] ? cpArray[i].desc[0] : '';
                        intro_p2.innerText = cpArray[i].desc[1] ? cpArray[i].desc[1] : '';
                        intro_p3.innerText = cpArray[i].desc[2] ? cpArray[i].desc[2] : '';
                        intro_p4.innerText = cpArray[i].desc[3] ? cpArray[i].desc[3] : '';
                    }

                    // console.log(len)
                    // 字体大小随字数改变使之适应文本框
                    len = cpArray[i].name.length;
                    cp_name_span.style.fontSize = 100 - (5 * len) + 'px';
                    // console.log(cp_name_span.style.fontSize);

                    i++;
                    if (i == cpArrayLength) {
                        i = 0;
                    }
                }
                // console.log(cpNameArray);
            }
        }
        // error:function(response){
        //     alert('当前人数过多，请稍后再试～');
        // }

    });
}