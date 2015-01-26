//--------------------------------------------------------------------------------------
//************************** Import Image*****************************
//--------------------------------------------------------------------------------------
/*-----------------select source---------------------*/
function source_onchange() {
    if (document.getElementById("divTwainType"))
        document.getElementById("divTwainType").style.display = "";
    if (document.getElementById("btnScan"))
        document.getElementById("btnScan").value = "Scan";

    if (_divDWTSourceContainerID == "")
        DWObject.SelectSource();
    else {
        if (document.getElementById(_divDWTSourceContainerID))
            DWObject.SelectSourceByIndex(document.getElementById(_divDWTSourceContainerID).selectedIndex);
    }

    DWObject.CloseSource();
}


/*-----------------Acquire Image---------------------*/
function acquireImage() {
    _iHowManyImages = DWObject.HowManyImagesInBuffer;
    if (_divDWTSourceContainerID == "")
        DWObject.SelectSource();
    else
        DWObject.SelectSourceByIndex(document.getElementById(_divDWTSourceContainerID).selectedIndex);
    DWObject.CloseSource();
    DWObject.OpenSource();
    DWObject.IfShowUI = document.getElementById("ShowUI").checked;

    var i;
    for (i = 0; i < 3; i++) {
        if (document.getElementsByName("PixelType").item(i).checked == true)
            DWObject.PixelType = i;
    }
    DWObject.Resolution = document.getElementById("Resolution").value;
    DWObject.IfFeederEnabled = document.getElementById("ADF").checked;
    DWObject.IfDuplexEnabled = document.getElementById("Duplex").checked;
    if (_bInWindows || (!_bInWindows && DWObject.ImageCaptureDriverType == 0))
        DynamLib.appendMessage("Pixel Type: " + DWObject.PixelType + "<br />Resolution: " + DWObject.Resolution + "<br />");

    DWObject.IfDisableSourceAfterAcquire = true;
    _iTwainType = 0;
    DWObject.AcquireImage();

    _iErrorCode = DWObject.ErrorCode;
    _strErrorString = DWObject.ErrorString;

}

/*-----------------Load Image---------------------*/
function btnLoad_onclick() {
    _iHowManyImages = DWObject.HowManyImagesInBuffer;
    DWObject.IfShowFileDialog = true;
    DWObject.LoadImageEx("", 5, function() {
        g_DWT_PrintMsg("Loaded an image successfully.");
    }, function() {
    });

    _iErrorCode = DWObject.ErrorCode;
    _strErrorString = DWObject.ErrorString;
}

//--------------------------------------------------------------------------------------
//************************** Save Image***********************************
//--------------------------------------------------------------------------------------
function btnSave_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    var i, strimgType_save;
    var NM_imgType_save = document.getElementsByName("imgType_save");
    for (i = 0; i < 5; i++) {
        if (NM_imgType_save.item(i).checked == true) {
            strimgType_save = NM_imgType_save.item(i).value;
            break;
        }
    }
    DWObject.IfShowFileDialog = true;
    _txtFileNameforSave.className = "";
    var bSave = false;
    
    var nSaveType = -1;
    var strFilePath = "C:\\" + _txtFileNameforSave.value + "." + strimgType_save;
    if (strimgType_save == "tif" && _chkMultiPageTIFF_save.checked) {
        if ((DWObject.SelectedImagesCount == 1) || (DWObject.SelectedImagesCount == DWObject.HowManyImagesInBuffer)) {
            nSaveType = 5;
            bSave = DWObject.SaveAllAsMultiPageTIFF(strFilePath);
        }
        else {
            nSaveType = 6;
            bSave = DWObject.SaveSelectedImagesAsMultiPageTIFF(strFilePath);
        }
    }
    else if (strimgType_save == "pdf" && document.getElementById("MultiPagePDF_save").checked) {
        if ((DWObject.SelectedImagesCount == 1) || (DWObject.SelectedImagesCount == DWObject.HowManyImagesInBuffer)) {
            nSaveType = 7;
            bSave = DWObject.SaveAllAsPDF(strFilePath);
        }
        else {
            nSaveType = 8;
            bSave = DWObject.SaveSelectedImagesAsMultiPagePDF(strFilePath);
        }
    }
    else {
        nSaveType = i;
        switch (i) {
            case 0: bSave = DWObject.SaveAsBMP(strFilePath, DWObject.CurrentImageIndexInBuffer); break;
            case 1: bSave = DWObject.SaveAsJPEG(strFilePath, DWObject.CurrentImageIndexInBuffer); break;
            case 2: bSave = DWObject.SaveAsTIFF(strFilePath, DWObject.CurrentImageIndexInBuffer); break;
            case 3: bSave = DWObject.SaveAsPNG(strFilePath, DWObject.CurrentImageIndexInBuffer); break;
            case 4: bSave = DWObject.SaveAsPDF(strFilePath, DWObject.CurrentImageIndexInBuffer); break;
        }
    }

    if (bSave)
        _strTempStr = _strTempStr + "<b>Save Image: </b>";
    if (checkErrorString()) {
        return;
    }
}

//--------------------------------------------------------------------------------------
//************************** Navigator functions***********************************
//--------------------------------------------------------------------------------------
function btnPreImage_wheel() {
    if (DWObject.HowManyImagesInBuffer != 0)
        btnPreImage_onclick()
}

function btnNextImage_wheel() {
    if (DWObject.HowManyImagesInBuffer != 0)
        btnNextImage_onclick()
}

function btnFirstImage_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    DWObject.first();
}

function btnPreImage_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    else if (DWObject.CurrentImageIndexInBuffer == 0) {
        return;
    }
    DWObject.previous();
}

function btnNextImage_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    else if (DWObject.CurrentImageIndexInBuffer == DWObject.HowManyImagesInBuffer - 1) {
        return;
    }
    DWObject.next();
}


function btnLastImage_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    DWObject.last();
}

function btnRemoveCurrentImage_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    DWObject.RemoveAllSelectedImages();
    //WriteLogForRemoveSelectedImages();
    if (DWObject.HowManyImagesInBuffer == 0) {
        document.getElementById("DW_TotalImage").value = DWObject.HowManyImagesInBuffer;
        document.getElementById("DW_CurrentImage").value = "";
        return;
    }
    else {
        updatePageInfo();
    }
}


function btnRemoveAllImages_onclick() {
    if (!checkIfImagesInBuffer()) {
        return;
    }
    var varHowManyImagesInBuffer = DWObject.HowManyImagesInBuffer;
    DWObject.RemoveAllImages();
    //WriteLogForRemoveAllImages(varHowManyImagesInBuffer);
    document.getElementById("DW_TotalImage").value = "0";
    document.getElementById("DW_CurrentImage").value = "";
}
function setlPreviewMode() {
    DWObject.SetViewMode(parseInt(document.getElementById("DW_PreviewMode").selectedIndex + 1), parseInt(document.getElementById("DW_PreviewMode").selectedIndex + 1));
    if (!_bInWindows) {
        return;
    }
    else if (document.getElementById("DW_PreviewMode").selectedIndex != 0) {
        DWObject.MouseShape = true;
    }
    else {
        DWObject.MouseShape = false;
    }
}

//--------------------------------------------------------------------------------------
//*********************************radio response***************************************
//--------------------------------------------------------------------------------------
function rdTIFFsave_onclick() {
    _chkMultiPageTIFF_save.disabled = false;

    _chkMultiPageTIFF_save.checked = false;
    _chkMultiPagePDF_save.checked = false;
    _chkMultiPagePDF_save.disabled = true;
}
function rdPDFsave_onclick() {
    _chkMultiPagePDF_save.disabled = false;

    _chkMultiPageTIFF_save.checked = false;
    _chkMultiPagePDF_save.checked = false;
    _chkMultiPageTIFF_save.disabled = true;
}
function rdsave_onclick() {
    _chkMultiPageTIFF_save.checked = false;
    _chkMultiPagePDF_save.checked = false;

    _chkMultiPageTIFF_save.disabled = true;
    _chkMultiPagePDF_save.disabled = true;
}
function rdTIFF_onclick() {
    _chkMultiPageTIFF.disabled = false;

    _chkMultiPageTIFF.checked = false;
    _chkMultiPagePDF.checked = false;
    _chkMultiPagePDF.disabled = true;
}
function rdPDF_onclick() {
    _chkMultiPagePDF.disabled = false;

    _chkMultiPageTIFF.checked = false;
    _chkMultiPagePDF.checked = false;
    _chkMultiPageTIFF.disabled = true;
}
function rd_onclick() {
    _chkMultiPageTIFF.checked = false;
    _chkMultiPagePDF.checked = false;

    _chkMultiPageTIFF.disabled = true;
    _chkMultiPagePDF.disabled = true;
}



//--------------------------------------------------------------------------------------
//************************** ImageCapture Suite Events***********************************
//--------------------------------------------------------------------------------------

function Dynamsoft_OnPostTransfer() {
   
    _iHowManyImages = DWObject.HowManyImagesInBuffer;
    if (_bDiscardBlankImage) {
        var NewlyScannedImage = DWObject.CurrentImageIndexInBuffer;
        if (DWObject.IsBlankImage(NewlyScannedImage)) {
            DWObject.RemoveImage(NewlyScannedImage);
        
        _strTempStr += "<b>Blank Discard (On PostTransfer): </b>";
    }

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

            _strTempStr += "<b>Blank Discard (On PostLoad): </b>";
        }
        if (checkErrorString()) {
            updatePageInfo();
        }
    }
    updatePageInfo();
}

function Dynamsoft_OnPostAllTransfers() {
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
    fileName = path + "\\" + name;
}

//----------------------------OCR--------------------------------------
function LoadOCRDemoImage(nIndex) {

    var ImgArr;
    DWObject.IfShowProgressBar = true;
    switch (nIndex) {
        case 1:
            ImgArr = '/images/Demo_OCR1.png';
            break;
        case 2:
            ImgArr = '/images/Demo_OCR2.png';
            break;
        case 3:
            ImgArr = '/images/Demo_OCR3.png';
            break;
        case 4:
            ImgArr = '/images/Demo_OCR4.png';
            break;
    }

    if (location.hostname != '') {
        DWObject.HTTPPort = location.port == "" ? 80 : location.port;
        DWObject.IfSSL = DynamLib.detect.ssl;
        DWObject.HTTPDownload(location.hostname, DynamLib.getRealPath(ImgArr), function() {
            g_DWT_PrintMsg('Loaded a demo image successfully. (Http Download)');
            updatePageInfo();
        }, function() {
            checkErrorString();
        });
    }
    else {
        DWObject.IfShowFileDialog = false;
        DWObject.LoadImage(DynamLib.getRealPath(ImgArr), function() {
            DWObject.IfShowFileDialog = true;
            g_DWT_PrintMsg('Loaded a demo image successfully.');
            updatePageInfo();
        }, function() {
            DWObject.IfShowFileDialog = true;
            checkErrorString();
        });
    }

}

function showErrorInMessageBox(strErrorString) {
    var emTemp = "<span style='color:#cE5E04'><b>" + strErrorString + "</b></span><br />";
    DynamLib.appendMessage(emTemp);
}

/////////////////////////////////////////////////////////////////////////////////////////
//ocr
/////////////////////////////////////////////////////////////////////////////////////////
function ClickDoOCR() {
    if (DWObject.CurrentImageIndexInBuffer >= 0) {
        DWObject.IfShowProgressBar = false;
        DynamLib.detect.showMask();
        DoOCR();
    }
    return true;
}

function DoOCR() {
    var vlanguage = (document.getElementById("ddl_language").options[document.getElementById("ddl_language").selectedIndex]).value;

    var vLan = (document.getElementById("ddl_language").options[document.getElementById("ddl_language").selectedIndex]).value;
    var vLanguageFileName = "eng";
    if (vLan != "")
        vLanguageFileName = vLan;

    var vFileFormat = (document.getElementById("ddl_fileType").options[document.getElementById("ddl_fileType").selectedIndex]).value;

    DWObject.SetHTTPFormField("OCRLanguage", vLanguageFileName);
    DWObject.SetHTTPFormField("FileFormat", vFileFormat);
    strHTTPServer = _strServerName;
    DWObject.HTTPPort = _strPort;

    var sFun = function() {
    DynamLib.detect.hideMask();
    },fFun = function() {
        DynamLib.detect.hideMask();
        var responseText = DWObject.HTTPPostResponseString;
        if (responseText != "" && typeof (responseText) == 'string') {
            var tmpState = responseText.split(';');
            if (tmpState[0] == "OK") {
                if (vFileFormat == "3")
                    alert(tmpState[1]);
                else {
                    IshasDownLoadFile = "true";
                    DownLoadFileURL = tmpState[1];
                    DynamLib.detect.hideMask();
                    DownLoadFile();
                }
            }
            else {
                IshasDownLoadFile = "false";
                DownLoadFileURL = "";
                alert(tmpState[1]);
            }
        }
        else {
            alert(DWObject.ErrorString);
        }
    };


    if (DWObject.CurrentImageIndexInBuffer >= 0) {
    
        DWObject.HTTPUploadThroughPostEx(
            strHTTPServer,
            DWObject.CurrentImageIndexInBuffer,
            "DoOCR.aspx",
            "OCR.png",
            3, sFun, fFun
        );
    }

    for (var i = 0; i < document.links.length; i++) {
        if (document.links[i].className == "ClosetblCanNotScan") {
            document.links[i].onclick = closetblInstall_onclick;
        }
    }
}

var IshasDownLoadFile = "false";
var DownLoadFileURL = "";
function DownLoadFile() {

      if ("true" == IshasDownLoadFile) {
            var ObjString = [
		'<div class="D-dialog-body" style="height:190px;">',
		_strDynamsoftWithClose,
		'<div class="box_title"></div>',
		'<ul>',
		'<li><p>Recognition Completed, click Download to download the result file.</p>',
		'<a href="' + DownLoadFileURL + '" class="CloseDownLoadFile"><div class="button"></div</a>',
		' </li>',
		'</ul>',
		'</div>'];
            var msgContainer =
           ['<div id="J_waiting" class="D-dialog ks-dialog-hidden">',
           '<div class="ks-dialog-header"></div>',
           '<div class="ks-dialog-body">',
               '<div class="ks-dialog-content"><div id="' + _dwtParam._divInstallBody + '"></div></div></div>',
           '<div class="ks-dialog-footer"></div>', '</div>'];

            KISSY.one('body').append(msgContainer.join(''));
            DynamLib.get(_dwtParam._divInstallBody).innerHTML = ObjString.join('');
            
            for (var i = 0; i < document.links.length; i++) {
                if (document.links[i].className == "CloseDownLoadFile") {
                    document.links[i].onclick = closetblInstall_onclick;
                }
            }
            
            // Display the message and hide the main control
            if (!DynamLib.product.bChromeEdition) {
                var strDisableDIV = '<div style="width: ' + _dwtParam.width + 'px; height: ' + _dwtParam.height + 'px; margin: 0; border:1px solid #ccc; text-align:center;"' + 'id="' + _dwtParam._divDWTNonInstallContainerID + '"></div>';

                KISSY.one('#' + _dwtParam.containerID).before(strDisableDIV);
                DynamLib.show(_dwtParam._divDWTNonInstallContainerID);
                DynamLib.hide(_dwtParam.containerID);
            }
            if (_dwtParam._divDWTemessageContainer != '')
                DynamLib.hide(_dwtParam._divDWTemessageContainer);
            KISSY.use("overlay", function(S, o) {
                dlgInstall = new o.Dialog({
                    srcNode: "#J_waiting",
                    width: 392,
                    height: 227,
                    closable: false,
                    mask: true,
                    align: {
                        points: ['cc', 'cc']
                    }
                });
                dlgInstall.show();
            });
        }
    }
   
