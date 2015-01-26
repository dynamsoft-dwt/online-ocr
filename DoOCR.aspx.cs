using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using DynamsoftOCR;

using System.IO;
using System.Drawing;

using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Wordprocessing;
using DocumentFormat.OpenXml.Packaging;
using A = DocumentFormat.OpenXml.Drawing;
using DW = DocumentFormat.OpenXml.Drawing.Wordprocessing;
using PIC = DocumentFormat.OpenXml.Drawing.Pictures;
using System.Text.RegularExpressions;


namespace WebTwainSample
{
    public partial class DoOCR : System.Web.UI.Page
    {
        private const int FILE_TYPE_TEXT = 0;
        private const int FILE_TYPE_PDF = 1;
        private const int FILE_TYPE_DOCX = 2;

        private static string StrPath = AppDomain.CurrentDomain.BaseDirectory;
        private static string UploadFolder = StrPath + "Temp" + System.IO.Path.DirectorySeparatorChar + System.IO.Path.DirectorySeparatorChar;

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                string strImageName = "";
                int iFileLength;
                HttpFileCollection files = HttpContext.Current.Request.Files;
                HttpPostedFile uploadfile = files["RemoteFile"];
                if (uploadfile != null)
                {
                    strImageName = uploadfile.FileName;
                    iFileLength = uploadfile.ContentLength;

                    Byte[] inputBuffer = new Byte[iFileLength];
                    System.IO.Stream inputStream;

                    inputStream = uploadfile.InputStream;
                    inputStream.Read(inputBuffer, 0, iFileLength);

                    string strLanguage = "0";
                    try
                    {
                        strLanguage = HttpContext.Current.Request.Form["OCRLanguage"].ToString();
                    }
                    catch { }

                    string strFormat = "0";
                    try
                    {
                        strFormat = HttpContext.Current.Request.Form["FileFormat"].ToString();
                    }
                    catch { }

                    string strReturnValue = "";
                    try
                    {
                        byte[] content = OCRMode.OCR(inputBuffer, strLanguage, Convert.ToInt32(strFormat));
                        string strFileName = SaveOCRContentAsFile(content, Convert.ToInt32(strFormat));
                        strReturnValue = "OK;" + "DownLoadOCR.aspx?FileId=" + Server.UrlEncode(strFileName);
                    }

                    catch (Exception exp)
                    {
                        strReturnValue = "EXP;" + exp.Message.ToString();
                    }
                    finally
                    {

                    }
                    Response.Write(strReturnValue);
                }
            }
            catch (Exception exp)
            {
                Response.Write("EXP;" + exp.Message.ToString() + "; 0;");
            }
        }

        private void SaveToWord(string filepath, string ocrResult)
        {
            using (WordprocessingDocument doc = WordprocessingDocument.Create(filepath, DocumentFormat.OpenXml.WordprocessingDocumentType.Document))
            {
                MainDocumentPart mainPart = doc.AddMainDocumentPart();
                mainPart.Document = new Document();
                Body body = mainPart.Document.AppendChild(new Body());
                Paragraph para = body.AppendChild(new Paragraph());
                Run run = para.AppendChild(new Run());

                string returnValue = FilterInvalidXmlChars(ocrResult);
                run.AppendChild(new Text(returnValue));
            }
        }

        public static string FilterInvalidXmlChars(string text)
        {
            // answer from http://stackoverflow.com/questions/397250/unicode-regex-invalid-xml-characters/961504#961504
            string re = @"(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFEFF\uFFFE\uFFFF]";
            return Regex.Replace(text, re, "");
        }

        private string SaveOCRContentAsFile(byte[] content, int nFileFormat)
        {
            string strFileName = "";
            switch (nFileFormat)
            {
                case FILE_TYPE_TEXT:
                    strFileName = GetNextFileIndex("txt");
                    SaveToFile(content, UploadFolder + strFileName);
                    break;
                case FILE_TYPE_PDF:
                    strFileName = GetNextFileIndex("pdf");
                    SaveToFile(content, UploadFolder + strFileName);
                    break;
                case FILE_TYPE_DOCX:
                    strFileName = GetNextFileIndex("docx");
                    SaveToWord(UploadFolder + strFileName, System.Text.Encoding.ASCII.GetString(content));
                    break;
            }
            
            return strFileName;
        }

        private void SaveToFile(byte[] content, string filePath)
        {
            using (FileStream fs = File.Open(filePath, FileMode.Truncate, FileAccess.Write))
            {
                fs.Write(content, 0, (int)content.Length);
            }
        }

        private string GetNextFileIndex(string strFileExt)
        {
            if (strFileExt.ToLower() == "tif" || strFileExt.ToLower() == "tiff")
            {
                strFileExt = "jpg";
            }
            DateTime now = DateTime.Now;
            string strFile = now.ToString("yyyyMMdd_HHmmss_") + now.Millisecond + "_" + (new Random().Next() % 1000).ToString();
            string strFileName = strFile + "." + strFileExt.ToLower();
            while (File.Exists(UploadFolder + System.IO.Path.DirectorySeparatorChar + System.IO.Path.DirectorySeparatorChar + strFileName))
            {
                strFile = now.ToString("yyyyMMdd_HHmmss_") + now.Millisecond + "_" + (new Random().Next() % 1000).ToString();
                strFileName = strFile + "." + strFileExt.ToLower();
            }
            CreateFolder(UploadFolder);

            File.Create(UploadFolder + System.IO.Path.DirectorySeparatorChar + System.IO.Path.DirectorySeparatorChar + strFileName).Close();
            return strFileName;
        }

        private void CreateFolder(string strDir)
        {
            try
            {
                if (!Directory.Exists(strDir))
                    Directory.CreateDirectory(strDir);
            }
            catch { }
        }
    }
}
