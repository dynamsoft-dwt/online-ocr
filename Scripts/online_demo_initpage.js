
//--------------------------------------------------------------------------------------
//************************** Don't change these properties *****************************
//--------------------------------------------------------------------------------------
// Dynamsoft DWT Events Start
var _iWidth = 580;        // The width of the main control. User can change it.
var _iHeight = 600;       // The width of the main control. User can change it.

var _bInIE;               // If it is in IE
var _bInWindows;          // If it is in Windows OS
var _bInWindowsX86;       // If it is in X86 platform
var _divMessageContainer;   // For message display

//--------------------------------------------------------------------------------------
//****************** Default value provided. User can change it accordingly ************
//--------------------------------------------------------------------------------------
var _bDiscardBlankImage = false;  // User can change it.
var _bShowMessagePanel = true;
var _bShowNavigatorPanel = true;
var _divDWTSourceContainerID = "source";     // The ID of the container (Usually <select>) which is used to show the available sources. User must specify it.
var _iLeft, _iTop, _iRight, _iBottom; //These variables are used to remember the selected area
var _txtFileNameforSave, _txtFileName, _chkMultiPageTIFF_save, _chkMultiPagePDF_save, _chkMultiPageTIFF, _chkMultiPagePDF;
//--------------------------------------------------------------------------------------
//****************** User must specify it before using DWT *****************************
//--------------------------------------------------------------------------------------
var _divDWTContainerID = 'dwtcontrolContainer';
var _divDWTNonInstallContainerID = "DWTNonInstallContainerID" // The ID of the container (Usually a DIV) which is used to show a message if DWT is not installed. User must specify it.
var _strDefaultSaveImageName = "WebTWAINImage";
var _strNoDrivers = "No TWAIN compatible drivers detected:";


//Upload
var _strServerName = location.hostname; //Demo: "www.dynamsoft.com";
var _strPort = location.port == "" ? 80 : location.port; //Demo: 80;

//Sample
var _strActionPage = "SaveToFile.aspx";
//var _strActionPage = "SaveToDB.aspx";

/*
var _strCanNotScanDetail = "<div class=\"D-dialog-body-Scan-sample\" style=\"width:380px\">" + _strDynamsoftWithClose + "<div class=\"box_title_scan\">Fail to use your scanner on the demo? Please try:</div><ul>"
    + "<li><div class=\"box_scan_subtitle\">Add the website to the zone of trusted sites.</div><div class=\"box_scan_detail\">IE | Tools | Internet Options | Security | Trusted Sites.</div></li>"
    + "<li><div class=\"box_scan_subtitle\">Turn Protected Mode off. </div><div class=\"box_scan_detail\">To turn off the protected mode of IE, you can go to Tools | Internet Options | Security and uncheck \"Enable Protected Mode(requires restarting Internet Explorer)\" option.</div></li>"
    + "</ul></div>";
var _iCanNotScanDialogHeigth = 242;
*/

var vPluginLength = 0;
var D_get=DynamLib.get;


//------------------------------------------------------------------------------------------
//************************** Dynamsoft DWT Events Start ************************************
//------------------------------------------------------------------------------------------

function Dynamsoft_OnPostTransfer() {
    if (_bDiscardBlankImage) {
        var NewlyScannedImage = DWObject.CurrentImageIndexInBuffer;
        if (DWObject.IsBlankImage(NewlyScannedImage)) {
            DWObject.RemoveImage(NewlyScannedImage);
        }
		DynamLib.appendMessage('<b>Blank Discard (On PostTransfer): </b>');
		
        if (checkErrorString()) {
            updatePageInfo();
        }
    }
    updatePageInfo();
}

function Dynamsoft_OnPostLoadfunction(path, name, type) {
    if (_bDiscardBlankImage) {
        var NewlyScannedImage = DWObject.CurrentImageIndexInBuffer;
        if (DWObject.IsBlankImage(NewlyScannedImage)) {
            DWObject.RemoveImage(NewlyScannedImage);
        }
        DynamLib.appendMessage('<b>Blank Discard (On PostLoad): </b>');
        if (checkErrorString()) {
            updatePageInfo();
        }
    }
    updatePageInfo();
}

function Dynamsoft_OnPostAllTransfers() {
    DWObject.CloseSource();
    updatePageInfo();
    checkErrorString();
}

function Dynamsoft_OnMouseClick(index) {
    updatePageInfo();
}

function Dynamsoft_OnMouseRightClick(index) {
    // To add
}


function Dynamsoft_OnImageAreaSelected(index, left, top, right, bottom) {
    _iLeft = left;
    _iTop = top;
    _iRight = right;
    _iBottom = bottom;
}

function Dynamsoft_OnImageAreaDeselected(index) {
    _iLeft = 0;
    _iTop = 0;
    _iRight = 0;
    _iBottom = 0;
}

function Dynamsoft_OnMouseDoubleClick() {
    return;
}


function Dynamsoft_OnTopImageInTheViewChanged(index) {
    if (DWObject.CurrentImageIndexInBuffer != index)
        DWObject.CurrentImageIndexInBuffer = index;
    updatePageInfo();
}

function Dynamsoft_OnGetFilePath(bSave, count, index, path, name) {
}


function Dynamsoft_ChangeConfig(config){
	
	// width & height
	config.width = _iWidth;
	config.height = _iHeight;
	
	// events
	config.onPostTransfer = Dynamsoft_OnPostTransfer;
    config.onPostAllTransfers = Dynamsoft_OnPostAllTransfers;
    config.onMouseClick = Dynamsoft_OnMouseClick;
    config.onPostLoad = Dynamsoft_OnPostLoadfunction;
    config.onImageAreaSelected = Dynamsoft_OnImageAreaSelected;
    config.onMouseDoubleClick = Dynamsoft_OnMouseDoubleClick; 
    config.onMouseRightClick = Dynamsoft_OnMouseRightClick; 
    config.onTopImageInTheViewChanged = Dynamsoft_OnTopImageInTheViewChanged;
    config.onImageAreaDeSelected = Dynamsoft_OnImageAreaDeselected;
    config.onGetFilePath = Dynamsoft_OnGetFilePath;
	
	config.onRefreshUI = g_OnRefreshUI;
	config.onPrintMsg = g_DWT_PrintMsg;
	
}

// OnLoad event before using DWT 
function Dynamsoft_OnLoad() {
    getEnvironment();
    
    initMessageBox(false);  //Messagebox
    initCustomScan();       //CustomScan

    initiateInputs();
}

// Event fired When the control is not loaded.
function Dynamsoft_OnReady() {
	if (_divDWTSourceContainerID == '')
		return;

	var i, iSourceCount = 0, 
		buttonScan = D_get('btnScan'), 
		oSourceContainer = D_get(_divDWTSourceContainerID);
	
	DWObject.Loglevel = 1;
	DWObject.BrokerProcessType = 1;
	DWObject.IfAllowLocalCache = true;
	DWObject.IfShowProgressBar = true;
		
	if(DynamLib.product.bChromeEdition){

		var names = DWObject.GetSourceNames();
		oSourceContainer.options.length = 0;

		iSourceCount = names.length - 1;
		if(iSourceCount > 0)
		{
			var sn, defaultSource = names[iSourceCount];
			
			for (i = 0; i < iSourceCount; i++) {
				sn = names[i];
				oSourceContainer.options.add(new Option(sn, i));
				if (sn == defaultSource){
					oSourceContainer.selectedIndex = i;
				}
			}
			
		}
		
	}else{
		DWObject.AllowPluginAuthentication = true;

		iSourceCount = DWObject.SourceCount;
		oSourceContainer.options.length = 0;
		if(iSourceCount > 0)
		{
			for (i = 0; i < iSourceCount; i++) {
				oSourceContainer.options.add(new Option(DWObject.GetSourceNameItems(i), i));
			}
		}

		if (DynamLib.env.bWin)
			DWObject.MouseShape = false;
	}
	
	if (iSourceCount === 0) {
		buttonScan.disabled = true;
		
		var liNoScanner = D_get('pNoScanner');
		if (DynamLib.env.bWin) {
			DynamLib.show(liNoScanner);
			liNoScanner.style.textAlign = 'center';
		}
		else{
			DynamLib.hide(liNoScanner);
		}
	} else {
		buttonScan.disabled = false;
		buttonScan.style.color = '#FE8E14';
	
		//source_onchange();
	}

	if (!DynamLib.env.bWin && DWObject.ImageCaptureDriverType != 0) {
		DynamLib.hide('lblShowUI');
		DynamLib.hide('ShowUI');
	}
	else {
		DynamLib.show('lblShowUI');
		DynamLib.show('ShowUI');
	}

	initDllForChangeImageSize();
	setDefaultValue();

	re = /^\d+$/;
	strre = /^[\s\w]+$/;
	refloat = /^\d+\.*\d*$/i;

	_iLeft = 0;
	_iTop = 0;
	_iRight = 0;
	_iBottom = 0;

	if (DynamLib.env.bWin) {
		for (var i = 0; i < document.links.length; i++) {
			if (document.links[i].className == "ShowtblLoadImage") {
				document.links[i].onclick = showtblLoadImage_onclick;
			}
			if (document.links[i].className == "ClosetblLoadImage") {
				document.links[i].onclick = closetblLoadImage_onclick;
			}
		}
		
		if (iSourceCount === 0) {
			showtblLoadImage_onclick();
		}
	}
	
	if (iSourceCount > 0) {
		DynamLib.hide('divBlank');
	}

	g_OnRefreshUI(-1, 0);
	ua = (navigator.userAgent.toLowerCase());
	if (!ua.indexOf('msie 6.0')) {
		ShowSiteTour();
	}
}

//------------------------------------------------------------------------------------------
//*************************** Dynamsoft DWT Events End *************************************
//------------------------------------------------------------------------------------------

function getEnvironment() {
    // Get User Agent Value
    ua = (navigator.userAgent.toLowerCase());

    // Set the Explorer Type
    if (ua.indexOf("msie") != -1 || ua.indexOf('trident') != -1)
        _bInIE = true;
    else
        _bInIE = false;

    // Set the Operating System Type
    if (ua.indexOf("macintosh") != -1)
        _bInWindows = false;
    else
        _bInWindows = true;

    // Set the x86 and x64 type
    if (ua.indexOf("win64") != -1 && ua.indexOf("x64") != -1)
        _bInWindowsX86 = false;
    else
        _bInWindowsX86 = true;

}

function g_OnRefreshUI(currentIndex, maxIndex){
	if(currentIndex !== undefined)
		D_get("DW_CurrentImage").value = currentIndex + 1;
	
	if(maxIndex !== undefined)
		D_get("DW_TotalImage").value = maxIndex;

}

function initCustomScan() {
    var ObjString = ['<ul id="divTwainType" style="height:70px; background:#f0f0f0;"> ',
    '<li style="padding-left:12px;">',
    '<label id="lblShowUI" for="ShowUI"><input type="checkbox" id="ShowUI" />Show UI&nbsp;</label>',
    '<label for="ADF"><input type="checkbox" id="ADF" />AutoFeeder&nbsp;</label>',
    '<label for="Duplex"><input type="checkbox" id="Duplex"/>Duplex</label></li>',
    '<li style="padding-left:15px;">Pixel Type:',
    '<label for="BW"><input type="radio" id="BW" name="PixelType"/>B&amp;W </label>',
    '<label for="Gray"><input type="radio" id="Gray" name="PixelType"/>Gray</label>',
    '<label for="RGB"><input type="radio" id="RGB" name="PixelType"/>Color</label></li>',
    '<li style="padding-left:15px;">',
    '<label for="Resolution">Resolution:<select size="1" id="Resolution"><option value=""></option></select></label></li>',
    '</ul>'];
	
    D_get("divProductDetail").innerHTML = ObjString.join('');

    var vResolution = D_get("Resolution");
    vResolution.options.length = 0;
    vResolution.options.add(new Option("100", 100));
    vResolution.options.add(new Option("150", 150));
    vResolution.options.add(new Option("200", 200));
    vResolution.options.add(new Option("300", 300));
	
	D_get("btnScan").disabled = true;
}

function initiateInputs() {

    var allinputs = document.getElementsByTagName("input");
    for (var i = 0; i < allinputs.length; i++) {
        if (allinputs[i].type == "checkbox") {
            allinputs[i].checked = false;
        }
        else if (allinputs[i].type == "text") {
            allinputs[i].value = "";
        }
    }

	if (DynamLib.env.bWin64) {
		DynamLib.hide('samplesource32bit');
		DynamLib.show('samplesource64bit');
	} 

	if(!DynamLib.env.bWin){

		DynamLib.hide('samplesource32bit');
		
        //D_get("btnEditor").style.display = "none";
        DynamLib.hide('notformac1');
	}
	
    if (!_bInIE)
        vPluginLength = navigator.plugins.length;

}

function initMessageBox(bNeebBack) {
    var objString = [

    // The container for navigator, view mode and remove button
    '<div style="text-align:center; margin-top:5px; background-color:#FFFFFF;',
    (_bShowNavigatorPanel) ? 'display:block">' : 'display:none">',
    '<div id="DW_divPreviewMode" style="background:white;width:150px;height:35px;z-index:2;float:right;text-align: right;">Preview Mode: ',
    '<select size="1" id="DW_PreviewMode" onchange ="setlPreviewMode();">',
    '    <option value="0">1X1</option>',
    '</select></div>',
    '<div style="background:white; height:35px; z-index:2;">',
    '<input id="DW_btnFirstImage" onclick="btnFirstImage_onclick()" type="button" value=" |&lt; "/>&nbsp;',
    '<input id="DW_btnPreImage" onclick="btnPreImage_onclick()" type="button" value=" &lt; "/>&nbsp;&nbsp;',
    '<input type="text" size="2" id="DW_CurrentImage" readonly="readonly"/>/',
    '<input type="text" size="2" id="DW_TotalImage" readonly="readonly"/>&nbsp;&nbsp;',
    '<input id="DW_btnNextImage" onclick="btnNextImage_onclick()" type="button" value=" &gt; "/>&nbsp;',
    '<input id="DW_btnLastImage" onclick="btnLastImage_onclick()" type="button" value=" &gt;| "/></div>',
    '<div><input id="DW_btnRemoveCurrentImage" onclick="btnRemoveCurrentImage_onclick()" type="button" value="Remove Selected Images"/>',
	'<input id="DW_btnRemoveAllImages" onclick="btnRemoveAllImages_onclick()" type="button" value="Remove All Images"/>',
    (bNeebBack) ? '<br /><span style="font-size:larger"><a href ="online_demo_list.aspx"><b>Back</b></a></span>' : '',
	'</div>',
    '</div>',

    // The container for the error message
    '<div id="DWTdivMsg" style="width:',
	_iWidth-10,
	'px;',

    (_bShowMessagePanel) ? 'display:inline">' : 'display:none">',
    'Message:<br />',
    '<div id="DWTemessage" style="height:100px; overflow:scroll; background-color:#ffffff; border:1px #303030; border-style:solid; text-align:left; position:relative" >',
    '</div></div>'];

    var DWTemessageContainer = D_get('DWTemessageContainer');
    DWTemessageContainer.innerHTML = objString.join('');

    // Fill the init data for preview mode selection
    var varPreviewMode = D_get("DW_PreviewMode");
    varPreviewMode.options.length = 0;

	varPreviewMode.options.add(new Option('1X1', 0));
	varPreviewMode.options.add(new Option('2X2', 1));
	varPreviewMode.options.add(new Option('3X3', 2));
	varPreviewMode.options.add(new Option('4X4', 3));
	varPreviewMode.options.add(new Option('5X5', 4));
	varPreviewMode.selectedIndex = 0;
    varPreviewMode.onclick = function() {
        DynamLib.clearMessage();
    }


    _divMessageContainer = D_get("DWTemessage");
    _divMessageContainer.ondblclick = function() {
        this.innerHTML = "";
        DynamLib.clearMessage();
    }

}

function initDllForChangeImageSize() {

    var vInterpolationMethod = D_get("InterpolationMethod");
    if (vInterpolationMethod) {
        vInterpolationMethod.options.length = 0;
        vInterpolationMethod.options.add(new Option("NearestNeighbor", 1));
        vInterpolationMethod.options.add(new Option("Bilinear", 2));
        vInterpolationMethod.options.add(new Option("Bicubic", 3));
    }

}

function setDefaultValue() {
    D_get("Gray").checked = true;

    var varImgTypejpeg2 = D_get('imgTypejpeg2');
    if (varImgTypejpeg2)
        varImgTypejpeg2.checked = true;
    var varImgTypejpeg = D_get('imgTypejpeg');
    if (varImgTypejpeg)
        varImgTypejpeg.checked = true;

    _txtFileNameforSave = D_get("txt_fileNameforSave");
    if (_txtFileNameforSave)
        _txtFileNameforSave.value = _strDefaultSaveImageName;

    _txtFileName = D_get("txt_fileName");
    if (_txtFileName)
        _txtFileName.value = _strDefaultSaveImageName;

    _chkMultiPageTIFF_save = D_get("MultiPageTIFF_save");
    if (_chkMultiPageTIFF_save)
        _chkMultiPageTIFF_save.disabled = true;
    _chkMultiPagePDF_save = D_get("MultiPagePDF_save");
    if (_chkMultiPagePDF_save)
        _chkMultiPagePDF_save.disabled = true;
    _chkMultiPageTIFF = D_get("MultiPageTIFF");
    if (_chkMultiPageTIFF)
        _chkMultiPageTIFF.disabled = true;
    _chkMultiPagePDF = D_get("MultiPagePDF");
    if (_chkMultiPagePDF)
        _chkMultiPagePDF.disabled = true;
}


function showtblLoadImage_onclick() {
	DynamLib.show('tblLoadImage');
	DynamLib.hide('Resolution');
	
    return false;
}
function closetblLoadImage_onclick() {
	DynamLib.hide('tblLoadImage');
	DynamLib.show('Resolution');
    return false;
}

//--------------------------------------------------------------------------------------
//************************** Used a lot *****************************
//--------------------------------------------------------------------------------------
function updatePageInfo() {
	g_OnRefreshUI(DWObject.CurrentImageIndexInBuffer, DWObject.HowManyImagesInBuffer);
}

function g_OnPrintMsg(){
    if (_divMessageContainer) {
		var str = DynamLib.config.msg.join('');
		_divMessageContainer.innerHTML = str;
        _divMessageContainer.scrollTop = _divMessageContainer.scrollHeight;
    }
}

function g_DWT_PrintMsg(msg) {

	var str = [msg, '<br />'].join('');
	DynamLib.appendMessage(str);
	g_OnPrintMsg();
	
}

function printResult(){
	var ret = DWObject.checkErrorString();
	g_OnPrintMsg();	
	return ret;
}

function checkIfImagesInBuffer() {
    if (DWObject.HowManyImagesInBuffer == 0) {
        g_DWT_PrintMsg("There is no image in buffer.")
        return false;
    }
    else
        return true;
}


function checkErrorString() {
    if (DWObject.ErrorCode == 0) {
        g_DWT_PrintMsg("<span style='color:#cE5E04'><b>" + DWObject.ErrorString + "</b></span>");

        return true;
    }
    if (DWObject.ErrorCode == -2115) //Cancel file dialog
        return true;
    else {
        if (DWObject.ErrorCode == -2003) {
            var ErrorMessageWin = window.open("", "ErrorMessage", "height=500,width=750,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
            ErrorMessageWin.document.writeln(DWObject.HTTPPostResponseString);
        }
        g_DWT_PrintMsg("<span style='color:#cE5E04'><b>" + DWObject.ErrorString + "</b></span>");
        return false;
    }
}

//--------------------------------------------------------------------------------------
//************************** Used a lot *****************************
//--------------------------------------------------------------------------------------
function ds_getleft(el) {
	if(!el){
		return 0;
	}
    var tmp = el.offsetLeft;
    el = el.offsetParent
    while (el) {
        tmp += el.offsetLeft;
        el = el.offsetParent;
    }
    return tmp;
}
function ds_gettop(el) {
	if(!el){
		return 0;
	}
    var tmp = el.offsetTop;
    el = el.offsetParent
    while (el) {
        tmp += el.offsetTop;
        el = el.offsetParent;
    }
    return tmp;
}

function Over_Out_DemoImage(obj, url) {
    obj.src = url;
}