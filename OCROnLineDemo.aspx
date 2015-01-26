<!DOCTYPE html >
<%@ Page Language="C#"%>
<html>
<head runat="server">
    <title>Web Scanning and Server-side OCR Recognition</title>
    <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
    <meta http-equiv="Content-Language" content="en-us"/>
    <meta http-equiv="X-UA-Compatible" content="requiresActiveX=true" />
    <meta name="description" content="This ASP.NET sample shows web scan and server-side OCR. You can scan or load images into the TWAIN control and save the OCR result as PDF, text, or string." />
    <%= Common.DW_Keyword%>
    <link href="Styles/style.css" type="text/css" rel="stylesheet" />
    <link rel="stylesheet" href="Resources/reference/slide.css" />
    <script type="text/javascript" language="javascript" src="Scripts/kissy-min.js"></script>
</head>
<body>
    <div id="container" class="body_Broad_width" style="margin: 0 auto;">
       <div class="DWTHeader">
              <!-- header.aspx is used to initiate the head of the sample page. Not necessary!-->
              <!-- #include file=includes/PageHead.aspx -->
        </div>

       <div id="DWTcontainer" class="body_Broad_width">
<div class="Content_Left">
<div id="dwtcontrolContainer"></div>
<div id="DWTNonInstallContainerID" style="width:580px"></div>
<div id="DWTemessageContainer" style="clear: both;width:580px"></div>
</div>
<div class="Content_Right">
            <div id="ScanWrapper">
                <div id="divList" class="divinput">
                    <ul class="PCollapse">
                        <li>
                            <div class="divType"><div class="mark_arrow expanded"></div>Load the Sample Images</div>
                            <div id="div_SampleImage" class="divTableStyle">
                                <ul>
                                    <li></li>
                                    <li style="text-align: center;">
                                        <table style="border-spacing: 2px; width: 100%;">
                                            <tr>
                                                <td style="width: 25%">
                                                    <input name="code39Sample" type="image" src="Images/Demo_OCR1.png" style="width: 50px;
                                                        height: 50px" onclick="LoadOCRDemoImage(1);" onmouseover="Over_Out_DemoImage(this,'Images/Demo_OCR1.png');"
                                                        onmouseout="Over_Out_DemoImage(this,'Images/Demo_OCR1.png');" />
                                                </td>
                                                <td style="width: 25%">
                                                    <input name="code128Sample" type="image" src="Images/Demo_OCR2.png" style="width: 50px;
                                                        height: 50px" onclick="LoadOCRDemoImage(2);" onmouseover="Over_Out_DemoImage(this,'Images/Demo_OCR2.png');"
                                                        onmouseout="Over_Out_DemoImage(this,'Images/Demo_OCR2.png');" />
                                                </td>
                                                <td style="width: 25%">
                                                    <input name="qrcodeSample" type="image" src="Images/Demo_OCR3.png" style="width: 50px;
                                                        height: 50px" onclick="LoadOCRDemoImage(3);" onmouseover="Over_Out_DemoImage(this,'Images/Demo_OCR3.png');"
                                                        onmouseout="Over_Out_DemoImage(this,'Images/Demo_OCR3.png');" />
                                                </td>
                                                <td>
                                                    <input name="upcaSample" type="image" src="Images/Demo_OCR4.png" style="width: 50px;
                                                        height: 50px" onclick="LoadOCRDemoImage(4);" onmouseover="Over_Out_DemoImage(this,'Images/Demo_OCR4.png');"
                                                        onmouseout="Over_Out_DemoImage(this,'Images/Demo_OCR4.png');" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    OCR Demo1
                                                </td>
                                                <td>
                                                    OCR Demo2
                                                </td>
                                                <td>
                                                    OCR Demo3
                                                </td>
                                                <td>
                                                    OCR Demo4
                                                </td>
                                            </tr>
                                        </table>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div class="divType"><div class="mark_arrow collapsed"></div>Load a Local Image</div>
                            <div id="div_LoadLocalImage" style="display: none" class="divTableStyle">
                                <ul>
                                    <li style="text-align: center; height:35px; padding-top:8px;">
                                        <input type="button" value="Load Image" style="width: 130px; height:30px; font-size:medium;" onclick="return btnLoad_onclick()" />
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div class="divType"><div class="mark_arrow collapsed"></div>Scan Documents</div>
                            <div id="div_ScanImage" style="display: none" class="divTableStyle">
                                <ul id="ulScaneImageHIDE" >
                                    <li style="padding-left: 15px;">
                                        <label for="source">Select Source:</label>
                                        <select size="1" id="source" style="position:relative;width: 220px;" onchange="source_onchange()">
                                            <option value = ""></option>    
                                        </select>&nbsp;<a href="http://kb.dynamsoft.com/questions/541/Why+is+my+scanner+not+shown+or+not+responding+in+the+browser%3F" target="_blank"><img title = "Why is my scanner not shown or not responding in the browser?" alt = "Why is my scanner not shown or not responding in the browser?" style="border:none;" src="Images/faq 16.png"/></a></li>
                                         <li style="display:none;" id="pNoScanner">
                            <a href="javascript: void(0)" class="ShowtblLoadImage" style="color:red; background-color:#f0f0f0; position:relative" id="aNoScanner"><b>No TWAIN compatible drivers detected.</b></a>
                                                       <div id="tblLoadImage" style="display:none;height:80px">
                                                <ul>
                                                    <li><b>You can:</b><a href="javascript: void(0)" style="text-decoration:none; padding-left:200px" class="ClosetblLoadImage">X</a></li>
                                                </ul>
                                                <div id="notformac1" style="background-color:#f0f0f0; padding:5px;">
                                                <ul>
                                                    <li><img alt="arrow" src="Images/arrow.gif" width="9" height="12"/><b>Install a Virtual Scanner:</b></li>
                                                    <li style="text-align:center;"><a id="samplesource32bit" href="http://www.dynamsoft.com/demo/DWT/Sources/twainds.win32.installer.2.1.3.msi">32-bit Sample Source</a>
                                                        <a id="samplesource64bit" style="display:none;" href="http://www.dynamsoft.com/demo/DWT/Sources/twainds.win64.installer.2.1.3.msi">64-bit Sample Source</a>
                                                        from <a href="http://www.twain.org">TWG</a></li>
                                                </ul>
                                                </div>
                                                </div>
                                        </li>
                                        <li id="divProductDetail"></li>
                                    <li style="text-align:center;">
                                        <input id="btnScan" class="bigbutton" style="color:#C0C0C0;" disabled="disabled" type="button" value="Scan" onclick ="acquireImage();"/>&nbsp;&nbsp;<a id="showDetail"  style="display:none;" href="javascript: void(0)" class="ShowtblCanNotScan">Can't Scan</a></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>   


                <div id="div_OCR" class="divinput">
                    <ul>
                        <li><div class="divType"><div class="mark_arrow collapsed"></div>Try OCR and Get Searchable PDF/Text</div></li>
                        <li style="text-align: left">
                            <table class="tableStyle">
                                <tr>
                                    <td>
                                        Supported Languages:
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width: 400px">
                                        <select id="ddl_language" style="width: 250px">
                                            <option value="eng">English</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr><td style="height:10px"></td></tr>
                                <tr>
                                    <td>
                                        OCR Result File Format:
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <select id="ddl_fileType" style="width: 250px">
                                            <option value="2" selected="selected">Word</option>
                                            <option value="1">PDF</option>
                                            <option value="0">Text</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr><td style="height:10px"></td></tr>
                                <tr>
                                    <td colspan="2" style="text-align:center; height:35px;">
                                        <input id="btnOCRClient" type="button" style="width: 130px; height:30px; font-size:medium;" value=" OCR " onclick="ClickDoOCR();" />
                                    </td>
                                </tr>
                            </table>
                        </li>
                    </ul>
                </div>
                <div id="divUpgrade"></div>
               
                
            </div>
        </div>
 <div id="J_waiting" class="D-dialog ks-dialog-hidden">
	<div class="ks-dialog-header"></div>
	<div class="ks-dialog-body">
		<div class="ks-dialog-content"><div id="InstallBody"></div></div>
	</div>
	<div class="ks-dialog-footer"></div>
</div>
       </div> 
        <div class="DWTTail">
             <!-- #include file=includes/PageTail.aspx -->
        </div>
        </div>
<%=Common.DW_LiveChatJS %>
<script type="text/javascript" language="javascript" src="Resources/dynamsoft.webtwain.initiate.js"></script>
<script type="text/javascript" language="javascript" src="Scripts/online_demo_operation.js"></script>
<script type="text/javascript" language="javascript" src="Scripts/online_demo_initpage.js"></script>
<script type="text/javascript" language="javascript" src="Resources/dynamsoft.webtwain.config.js"></script>
<script>
    var S = KISSY;

    // Assign the page onload fucntion.
    S.ready(function() {
        window.history.forward();
    });

    S.use(['node', 'dom', 'event'], function(S, Node, DOM, Event) {

        var $ = S.all, _li = $('li', 'ul.PCollapse'), o = S.one('#dwtcontrolContainer');

        $('div.divType', _li).each(function(_this) {

            _this.on('click', function() {
                var _thisDOM = S.one(_this);

                if (_thisDOM.next().css('display') === 'none') {
                    $('.expanded', _li).addClass('collapsed').removeClass('expanded');
                    $('div.divTableStyle', _li).hide();

                    _thisDOM.next().show();
                    $('.mark_arrow', _this).addClass('expanded').removeClass('collapsed');
                }

            });

        });

    });
	

</script>
</body>
</html>
