function addCall() {
    let $cell = $('.image__cell');
    // TODO: Very inefficient for removing and adding of click handler.
    $cell.find('.image--basic').off('click').on('click', function () {
        let $thisCell = $(this).closest('.image__cell');
        let bb = $thisCell.find('.image--basic').html(); //点击图片得到此图片ClassWithName
        console.log(bb);
        //var bbReg = /(\w+).clipping-(\d+)/g;
        var bbReg = /Mywidgets\/([^]+).png/g;
        let bbRes = bbReg.exec(bb); 
        for(var k = 0; k < btnDetail.length; k++){
            if(bbRes[1] === btnDetail[k][0]){ 
                var a = document.createElement("a");
                let str = "";
                for(var n = 0; n < btnDetail[k].length; n++){
                    str += btnDetail[k][n];
                    str += '#';
                }
                a.setAttribute("href", "./detail?#"+str);
                a.setAttribute("target", "_blank");
                a.setAttribute("id", "openwin");
                document.body.appendChild(a);
                a.click();
                let imageUrl = $thisCell.find('.image--expand img').attr('src'); 
                break;               
            }
        }
       
    })
}

function getUrlParameter(sParam) {
    let sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function sortNumber(a, b)  //数字排序函数
{
return a - b
}

//arr.arrHeight.sort(sortNumber)

function compare(str) {  //Object 排序函数
    return function(obj1, obj2) {
        var value1 = obj1[str];
        var value2 = obj2[str]
        if (value1 > value2) {
            return 1;
        } else if (value1 < value2) {
            return -1;
        } else {
            return 0;
        }
    }
}

//dict.sort(compare("value")); 按照value排序,即按照height排序name

function getKeyByValue(object, value) {  //按key选择value
  return Object.keys(object).find(key => object[key] === value);
}

//var arrHeight = new Array(); //全局高度数组
//var arrWidth = new Array(); //全局宽度数组

var arr = {
      arrHeight:Array(),
      arrWidth:Array(),
      arrCheck:Array(),
      arrClassWithName:Array()
   };

var heightWithName = []; //关联Height和Name; 只需要能按 key 得到 value 即可
var btnDetail = []; // 存储要传给子窗体的信息
var devOption = []; //存储所选择的Develper的信息

function getKeyByHeight(value){
    var i = 0;
    for(var key in heightWithName){
        if(heightWithName[key] == value){
            arr.arrCheck[i] = key;
            i++;
        }
    }
    return i;
}

//合并一维数组为二维数组
function array_combine(arr1,arr2){
    var result = new Array();
    for(var i=0;i<arr1.length;i++){
        result.push([arr1[i],arr2[i]]);
    }
    return result;
}


function loadImages(_page) { //loadSearchPage
    document.getElementsByClassName("loader")[0].style.display = "block";
    let ajaxData = {
        btnType: getUrlParameter('btnType'),
        color: getUrlParameter('color'),
        text: getUrlParameter('text'),
        category: getUrlParameter('category'),
        sortType: getUrlParameter('sortType'),
        width: getUrlParameter('width'),
        height: getUrlParameter('height'),
        package: getUrlParameter('package'),
        page: _page
    };
    let html = "";
    $.ajax({
        url: "./search",
        type: 'POST',
        data: ajaxData,
        async: false,
        success: function (widgets) {             
            if (widgets.length === 0) {
                $("#endPage").removeClass("loader").append("End of Page.");
                $(window).unbind('scroll');
            } else {
                document.getElementsByClassName("loader")[0].style.display = "none";
                for (let i = 0; i < widgets.length; i++) {
                    arr.arrHeight.push(widgets[i].dimensions['height']); 
                    arr.arrWidth.push(widgets[i].dimensions['width']); 
                    heightWithName.push([widgets[i].dimensions['height'], widgets[i].name, i]); 
                }
                heightWithName.sort(function(x, y){
                    return(x[0]-y[0])
                });
            }
            for(let j = 0; j < heightWithName.length; j++){
                var i = heightWithName[j][2];
                let btnSize = widgets[i].dimensions['width'] + 'x' + widgets[i].dimensions['height'];
                html += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                html += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                html += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; //图片的边框，假如边框高度太小，会导致图片溢出，下一层图片按照边框排列，则最后造成图片重叠
                html += '<div>'
                html += '<a href="#expand-jump-' + j + ' " >';
                html += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mywidgets/' + heightWithName[j][1] + '.png" style="height:max-height:100px" />';
                html += '</div>';
                html += '</div>'; 
                var i = heightWithName[j][2];
                let screenSrc = widgets[i].src.split('/'); //获取urlAdd & similarAdd
                var urlAdd = '', similarAdd = '';
                urlAdd = screenSrc[3] + '/' + screenSrc[4];
                similarAdd = screenSrc[4];
                btnDetail.push([heightWithName[j][1], urlAdd, similarAdd, widgets[i].url, widgets[i].application_name, widgets[i].package_name, widgets[i].category, 
                    + widgets[i].text, widgets[i].widget_class, widgets[i].coordinates['from'], widgets[i].coordinates['to'], btnSize, widgets[i].color, widgets[i].downloads]);
                
                html += '</article>';
            }
          
        }

    })
        $(".image-grid").append(html);    // This will be the div where our content will be loaded
        addCall();
}

function getDevOption(){ 
    let sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&');
    devOption[0] = sURLVariables[3].split('=')[1];
    devOption[1] = sURLVariables[4].split('=')[1];
    return devOption
}

function loadCmpImages(_page) { //loadComparePage
    document.getElementsByClassName("loader")[0].style.display = "block";
    let ajaxData = {
        btnType: getUrlParameter('btnType'),
        color: getUrlParameter('color'),
        text: getUrlParameter('text'),
        category: getUrlParameter('category'),
        sortType: getUrlParameter('sortType'),
        width: getUrlParameter('width'),
        height: getUrlParameter('height'),
        page: _page
    };
    let htmlOne = "";
    let htmlTwo = "";
    $.ajax({
        url: "./search", //
        type: 'POST',
        data: ajaxData,
        async: false,
        success: function (widgets) {             
            if (widgets.length === 0) {
                $("#endPage").removeClass("loader").append("End of Page.");
                $(window).unbind('scroll');
            } else {
            document.getElementsByClassName("loader")[0].style.display = "none";
            getDevOption();
            for (let i = 0; i < widgets.length; i++) {
                    arr.arrHeight.push(widgets[i].dimensions['height']); 
                    arr.arrWidth.push(widgets[i].dimensions['width']); 
                    heightWithName.push([widgets[i].dimensions['height'], widgets[i].name, i, widgets[i].Developer]); 
            }
            heightWithName.sort(function(x, y){
                return(x[0]-y[0])
            });
            }
            for(let j = 0; j < heightWithName.length; j++){
                if(devOption[0] === devOption[1]){
                    break;
                }else{
                    var i = heightWithName[j][2];  
                    let btnSize = widgets[i].dimensions['width'] + 'x' + widgets[i].dimensions['height'];
                    if( heightWithName[j][3] === devOption[0]){
                        htmlOne += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                        htmlOne += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                        htmlOne += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; //图片的边框，假如边框高度太小，会导致图片溢出，下一层图片按照边框排列，则最后造成图片重叠
                        htmlOne += '<div>'
                        htmlOne += '<a href="#expand-jump-' + j + ' " >';
                        htmlOne += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mywidgets/' + heightWithName[j][1] + '.png" style="height:max-height:100px" />';
                        htmlOne += '</div>';
                        htmlOne += '</div>'; 
                        htmlOne += '</article>';
                    }else if( heightWithName[j][3] === devOption [1]){
                        htmlTwo += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                        htmlTwo += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                        htmlTwo += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; //图片的边框，假如边框高度太小，会导致图片溢出，下一层图片按照边框排列，则最后造成图片重叠
                        htmlTwo += '<div>'
                        htmlTwo += '<a href="#expand-jump-' + j + ' " >';
                        htmlTwo += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mywidgets/' + heightWithName[j][1] + '.png" style="height:max-height:100px" />';
                        htmlTwo += '</div>';
                        htmlTwo += '</div>'; 
                        htmlTwo += '</article>';
                    }    
                    var i = heightWithName[j][2];
                    let screenSrc = widgets[i].src.split('/'); //获取urlAdd & similarAdd
                    var urlAdd = '', similarAdd = '';
                    urlAdd = screenSrc[3] + '/' + screenSrc[4];
                    similarAdd = screenSrc[4];
                    btnDetail.push([heightWithName[j][1], urlAdd, similarAdd, widgets[i].url, widgets[i].application_name, widgets[i].package_name, widgets[i].category, 
                        + widgets[i].text, widgets[i].widget_class, widgets[i].coordinates['from'], widgets[i].coordinates['to'], btnSize, widgets[i].color, widgets[i].downloads]);             
                }
            }       
        }

    })
        $("#companyOne").append(htmlOne);    // This will be the div where our content will be loaded
        $("#companyTwo").append(htmlTwo); 
        var myselect1=document.getElementById("devOptionOne");
        var index1=myselect1.selectedIndex ;
        myselect1.options[index1].selected = true;
        var myselect2=document.getElementById("devOptionTwo");
        var index2=myselect2.selectedIndex ;
        myselect2.options[index2].selected = true;

}

