function addDetail() { 
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
    //document.getElementsByClassName("loader")[0].style.display = "block";
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
                //document.getElementsByClassName("loader")[0].style.display = "none";
                for (let i = 0; i < widgets.length; i++) {
                    arr.arrHeight.push(widgets[i].dimensions['height']); 
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
        addDetail();
}

function getDevOption(){ 
    let sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&');
    devOption[0] = sURLVariables[3].split('=')[1];
    devOption[1] = sURLVariables[4].split('=')[1];
    return devOption
}

function loadCmpImages(_page) { //loadComparePage
    //document.getElementsByClassName("loader")[0].style.display = "block";
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
    //为不同container创建不同空html
    let htmlButtonOne = htmlCheckBoxOne = htmlChronometerOne = htmlCompoundButtonOne = htmlImageButtonOne = htmlProgressBarOne = htmlRadioButtonOne = htmlRatingBarOne = htmlSeekBarOne = htmlSpinnerOne = htmlSwitchOne = htmlToggleButtonOne = "";
    let htmlButtonTwo = htmlCheckBoxTwo = htmlChronometerTwo = htmlCompoundButtonTwo = htmlImageButtonTwo = htmlProgressBarTwo = htmlRadioButtonTwo = htmlRatingBarTwo = htmlSeekBarTwo = htmlSpinnerTwo = htmlSwitchTwo = htmlToggleButtonTwo = "";
    $.ajax({
        url: "./compare", 
        type: 'POST',
        data: ajaxData,
        async: false,
        success: function (companys) {             
            if (companys.length === 0) {
                $("#endPage").removeClass("loader").append("End of Page.");
                $(window).unbind('scroll');
            } else {
            document.getElementsByClassName("loader")[0].style.display = "none";
            getDevOption();
            for (let i = 0; i < companys.length; i++) {
                    arr.arrHeight.push(companys[i].dimensions['height']); 
                    heightWithName.push([companys[i].dimensions['height'], companys[i].name, i, companys[i].Developer, companys[i].widget_class]); 
            }
            heightWithName.sort(function(x, y){
                return(x[0]-y[0])
            });
            }
            for(let j = 0; j < heightWithName.length; j++){
                className = heightWithName[j][4].toString();//获得不同的className，后续显示在不同类的container
                if(devOption[0] === devOption[1]){ //选择相同公司则break
                    break;
                }else{
                    if( heightWithName[j][3] === devOption[0]){ //找到DeveloperOne
                        if(className === "Button"){   //choose different div to upload different content 
                            htmlButtonOne += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlButtonOne += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlButtonOne += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; //图片的边框，假如边框高度太小，会导致图片溢出，下一层图片按照边框排列，则最后造成图片重叠
                            htmlButtonOne += '<div>';
                            htmlButtonOne += '<a href="#expand-jump-' + j + ' " >';
                            htmlButtonOne += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlButtonOne += '</div>';
                            htmlButtonOne += '</article>'; 
                        }else if(className === "CheckBox"){
                            htmlCheckBoxOne += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlCheckBoxOne += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlCheckBoxOne += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlCheckBoxOne += '<div>';
                            htmlCheckBoxOne += '<a href="#expand-jump-' + j + ' " >';
                            htmlCheckBoxOne += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlCheckBoxOne += '</div>';
                            htmlCheckBoxOne += '</article>'; 
                        }else if(className === "Chronometer"){
                            htmlChronometerOne += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlChronometerOne += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlChronometerOne += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlChronometerOne += '<div>';
                            htmlChronometerOne += '<a href="#expand-jump-' + j + ' " >';
                            htmlChronometerOne += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlChronometerOne += '</div>';
                            htmlChronometerOne += '</article>'; 
                        }else if(className === "CompoundButton"){
                            htmlCompoundButtonOne += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlCompoundButtonOne += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlCompoundButtonOne += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlCompoundButtonOne += '<div>';
                            htmlCompoundButtonOne += '<a href="#expand-jump-' + j + ' " >';
                            htmlCompoundButtonOne += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlCompoundButtonOne += '</div>';
                            htmlCompoundButtonOne += '</article>'; 
                        }else if(className === "ImageButton"){
                            htmlImageButtonOne += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlImageButtonOne += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlImageButtonOne += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlImageButtonOne += '<div>';
                            htmlImageButtonOne += '<a href="#expand-jump-' + j + ' " >';
                            htmlImageButtonOne += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlImageButtonOne += '</div>';
                            htmlImageButtonOne += '</article>'; 
                        }else if(className === "ProgressBar"){
                            htmlProgressBarOne += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlProgressBarOne += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlProgressBarOne += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlProgressBarOne += '<div>';
                            htmlProgressBarOne += '<a href="#expand-jump-' + j + ' " >';
                            htmlProgressBarOne += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlProgressBarOne += '</div>';
                            htmlProgressBarOne += '</article>'; 
                        }else if(className === "RadioButton"){
                            htmlRadioButtonOne += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlRadioButtonOne += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlRadioButtonOne += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlRadioButtonOne += '<div>';
                            htmlRadioButtonOne += '<a href="#expand-jump-' + j + ' " >';
                            htmlRadioButtonOne += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlRadioButtonOne += '</div>';
                            htmlRadioButtonOne += '</article>'; 
                        }else if(className === "RatingBar"){
                            htmlRatingBarOne += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlRatingBarOne += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlRatingBarOne += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlRatingBarOne += '<div>';
                            htmlRatingBarOne += '<a href="#expand-jump-' + j + ' " >';
                            htmlRatingBarOne += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlRatingBarOne += '</div>';
                            htmlRatingBarOne += '</article>'; 
                        }else if(className === "SeekBar"){
                            htmlSeekBarOne += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlSeekBarOne += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlSeekBarOne += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlSeekBarOne += '<div>';
                            htmlSeekBarOne += '<a href="#expand-jump-' + j + ' " >';
                            htmlSeekBarOne += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlSeekBarOne += '</div>';
                            htmlSeekBarOne += '</article>'; 
                        }else if(className === "Spinner"){
                            htmlSpinnerOne += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlSpinnerOne += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlSpinnerOne += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlSpinnerOne += '<div>';
                            htmlSpinnerOne += '<a href="#expand-jump-' + j + ' " >';
                            htmlSpinnerOne += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlSpinnerOne += '</div>';
                            htmlSpinnerOne += '</article>'; 
                        }else if(className === "Switch"){
                            htmlSwitchOne += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlSwitchOne += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlSwitchOne += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlSwitchOne += '<div>';
                            htmlSwitchOne += '<a href="#expand-jump-' + j + ' " >';
                            htmlSwitchOne += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlSwitchOne += '</div>';
                            htmlSwitchOne += '</article>'; 
                        }else if(className === "ToggleButton"){
                            htmlToggleButtonOne += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlToggleButtonOne += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlToggleButtonOne += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlToggleButtonOne += '<div>';
                            htmlToggleButtonOne += '<a href="#expand-jump-' + j + ' " >';
                            htmlToggleButtonOne += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlToggleButtonOne += '</div>';
                            htmlToggleButtonOne += '</article>'; 
                        }else{
                            console.log(className);
                        }  
                    }else if(heightWithName[j][3] === devOption[1]){ //找到DeveloperTwo
                        console.log(heightWithName[j][3]);
                        console.log(devOption[1]);
                        if(className === "Button"){  
                            htmlButtonTwo += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlButtonTwo += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlButtonTwo += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; //图片的边框，假如边框高度太小，会导致图片溢出，下一层图片按照边框排列，则最后造成图片重叠
                            htmlButtonTwo += '<div>';
                            htmlButtonTwo += '<a href="#expand-jump-' + j + ' " >';
                            htmlButtonTwo += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlButtonTwo += '</div>';
                            htmlButtonTwo += '</article>'; 
                        }else if(className === "CheckBox"){
                            htmlCheckBoxTwo += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlCheckBoxTwo += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlCheckBoxTwo += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlCheckBoxTwo += '<div>';
                            htmlCheckBoxTwo += '<a href="#expand-jump-' + j + ' " >';
                            htmlCheckBoxTwo += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlCheckBoxTwo += '</div>';
                            htmlCheckBoxTwo += '</article>'; 
                        }else if(className === "Chronometer"){
                            htmlChronometerTwo += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlChronometerTwo += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlChronometerTwo += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlChronometerTwo += '<div>';
                            htmlChronometerTwo += '<a href="#expand-jump-' + j + ' " >';
                            htmlChronometerTwo += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlChronometerTwo += '</div>';
                            htmlChronometerTwo += '</article>'; 
                        }else if(className === "CompoundButton"){
                            htmlCompoundButtonTwo += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlCompoundButtonTwo += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlCompoundButtonTwo += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlCompoundButtonTwo += '<div>';
                            htmlCompoundButtonTwo += '<a href="#expand-jump-' + j + ' " >';
                            htmlCompoundButtonTwo += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlCompoundButtonTwo += '</div>';
                            htmlCompoundButtonTwo += '</article>'; 
                        }else if(className === "ImageButton"){
                            htmlImageButtonTwo += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlImageButtonTwo += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlImageButtonTwo += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlImageButtonTwo += '<div>';
                            htmlImageButtonTwo += '<a href="#expand-jump-' + j + ' " >';
                            htmlImageButtonTwo += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlImageButtonTwo += '</div>';
                            htmlImageButtonTwo += '</article>'; 
                        }else if(className === "ProgressBar"){
                            htmlProgressBarTwo+= '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlProgressBarTwo += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlProgressBarTwo += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlProgressBarTwo += '<div>';
                            htmlProgressBarTwo += '<a href="#expand-jump-' + j + ' " >';
                            htmlProgressBarTwo += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlProgressBarTwo += '</div>';
                            htmlProgressBarTwo += '</article>'; 
                        }else if(className === "RadioButton"){
                            htmlRadioButtonTwo += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlRadioButtonTwo += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlRadioButtonTwo += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlRadioButtonTwo += '<div>';
                            htmlRadioButtonTwo += '<a href="#expand-jump-' + j + ' " >';
                            htmlRadioButtonTwo += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlRadioButtonTwo += '</div>';
                            htmlRadioButtonTwo += '</article>'; 
                        }else if(className === "RatingBar"){
                            htmlRatingBarTwo += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlRatingBarTwo += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlRatingBarTwo += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlRatingBarTwo += '<div>';
                            htmlRatingBarTwo += '<a href="#expand-jump-' + j + ' " >';
                            htmlRatingBarTwo += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlRatingBarTwo += '</div>';
                            htmlRatingBarTwo += '</article>'; 
                        }else if(className === "SeekBar"){
                            htmlSeekBarTwo += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlSeekBarTwo += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlSeekBarTwo += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlSeekBarTwo += '<div>';
                            htmlSeekBarTwo += '<a href="#expand-jump-' + j + ' " >';
                            htmlSeekBarTwo += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlSeekBarTwo += '</div>';
                            htmlSeekBarTwo += '</article>'; 
                        }else if(className === "Spinner"){
                            htmlSpinnerTwo += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlSpinnerTwo += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlSpinnerTwo += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlSpinnerTwo += '<div>';
                            htmlSpinnerTwo += '<a href="#expand-jump-' + j + ' " >';
                            htmlSpinnerTwo += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlSpinnerTwo += '</div>';
                            htmlSpinnerTwo += '</article>'; 
                        }else if(className === "Switch"){
                            htmlSwitchTwo += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlSwitchTwo += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlSwitchTwo += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlSwitchTwo += '<div>';
                            htmlSwitchTwo += '<a href="#expand-jump-' + j + ' " >';
                            htmlSwitchTwo += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlSwitchTwo += '</div>';
                            htmlSwitchTwo += '</article>'; 
                        }else if(className === "ToggleButton"){
                            htmlToggleButtonTwo += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                            htmlToggleButtonTwo += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                            htmlToggleButtonTwo += '<div class="image--basic" style="height:auto; margin-bottom:15px">'; 
                            htmlToggleButtonTwo += '<div>';
                            htmlToggleButtonTwo += '<a href="#expand-jump-' + j + ' " >';
                            htmlToggleButtonTwo += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + className + '/' + heightWithName[j][1] + '.png"/>';
                            htmlToggleButtonTwo += '</div>';
                            htmlToggleButtonTwo += '</article>'; 
                        }else{
                            console.log(className);
                        }  
                    }
                }
            }console.log(htmlButtonTwo);
            $("#cmpOneButton").append(htmlButtonOne); 
            $("#cmpOneChronometer").append(htmlChronometerOne); 
            $("#cmpOneCompoundButton").append(htmlCompoundButtonOne); 
            $("#cmpOneImageButton").append(htmlImageButtonOne); 
            $("#cmpOneProgressBar").append(htmlProgressBarOne); 
            $("#cmpOneRadioButton").append(htmlRadioButtonOne);  
            $("#cmpOneRatingBar").append(htmlRatingBarOne); 
            $("#cmpOneSeekBar").append(htmlSeekBarOne); 
            $("#cmpOneSpinner").append(htmlSpinnerOne); 
            $("#cmpOneToggleButton").append(htmlToggleButtonOne); 

            $("#cmpTwoButton").append(htmlButtonTwo); 
            $("#cmpTwoChronometer").append(htmlChronometerTwo); 
            $("#cmpTwoCompoundButton").append(htmlCompoundButtonTwo); 
            $("#cmpTwoImageButton").append(htmlImageButtonTwo); 
            $("#cmpTwoProgressBar").append(htmlProgressBarTwo); 
            $("#cmpTwoRadioButton").append(htmlRadioButtonTwo); 
            $("#cmpTwoRatingBar").append(htmlRatingBarTwo); 
            $("#cmpTwoSeekBar").append(htmlSeekBarTwo); 
            $("#cmpTwoSpinner").append(htmlSpinnerTwo); 
            $("#cmpTwoToggleButton").append(htmlToggleButtonTwo); 
        }
    })
}

function sendSeeMoreURL(_class, position){ //_class = widgets.class; position means choose which developer
    console.log(_class);
    getDevOption();
    var dev0 = devOption[0].toString(); //developer0
    var dev1 = devOption[1].toString(); //developer1
    var a = document.createElement("a");
    console.log(position);
    if(position === "0"){ //chosen developer0
        console.log("chosen 0")
        a.setAttribute("href", "./seemore?btnType=All&color=All&category=All&sortType=appDownloads&text=&width=0%3B800&height=0%3B1280&page=1/" + dev0 + '/' + _class);
    }else if(position === "1"){ //chosen developer1
        a.setAttribute("href", "./seemore?btnType=All&color=All&category=All&sortType=appDownloads&text=&width=0%3B800&height=0%3B1280&page=1/" + dev1 + '/' + _class);
    }
    a.setAttribute("target", "_blank");
    a.setAttribute("id", "openwin");
    document.body.appendChild(a);
    a.click();
}

function loadSeeMoreImages(_page){
    var sURL = decodeURIComponent(window.location.href); //解析URL得到DeveloperName 
    sURLVariables = sURL.split("/");
    console.log(sURLVariables);
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
    let html = "";
    $.ajax({
        url: "./seemore", //需要通过routes调用model操作，如果schema相同可以选择同一个model 
        type: 'POST',
        data: ajaxData,
        async: false,
        success: function (companys) {    
            if (companys.length === 0) {
                $("#endPage").removeClass("loader").append("End of Page.");
                $(window).unbind('scroll');
                console.log("no data");
            } else {
                for (let i = 0; i < companys.length; i++) {
                    arr.arrHeight.push(companys[i].dimensions['height']); 
                    heightWithName.push([companys[i].dimensions['height'], companys[i].name, i, companys[i].Developer, companys[i].widget_class]); 
                }
                heightWithName.sort(function(x, y){
                    return(x[0]-y[0])
                });
                console.log(heightWithName);
                for(let j = 0; j < heightWithName.length; j++){
                    if( heightWithName[j][3].toString() === sURLVariables[4] && heightWithName[j][4] === sURLVariables[5]){
                        html += '<span class="anchor" id="#expand-jump-' + j + '"></span>';
                        html += '<article class="image__cell is-collapsed" id="page-' + _page + '">';
                        html += '<div class="image--basic" style="height:auto; margin-bottom:15px">';                               
                        html += '<div>'
                        html += '<a href="#expand-jump-' + j + ' " >';
                        html += '<img class="basic__img" src="https://storage.googleapis.com/ui-collection-gcs/Mycompany/' + sURLVariables[5] +'/' + heightWithName[j][1] + '.png"/>';
                        html += '</div>';
                        html += '</div>'; 
                        html += '</article>';                    
                    }
                }
            }
        }
    })
    $(".seemore-container").append(html);// This will be the div where our content will be loaded
}