using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;

namespace DynamsoftOCR
{
    internal class DoOCR
    {
        private static string StrPath = AppDomain.CurrentDomain.BaseDirectory;
        private static char cSep = System.IO.Path.DirectorySeparatorChar;
        private static string UploadFolder = StrPath + "Temp";

        private const int FILE_TYPE_TEXT = 0;
        private const int FILE_TYPE_PDF = 1;
        private const int FILE_TYPE_DOCX = 2;

        static DoOCR()
        {
        }

        public static byte[] OCRInner(byte[] byteImages, string strLanguageFileName, int nFileFormat)
        {
            Dynamsoft.DotNet.TWAIN.DynamicDotNetTwain twain = new Dynamsoft.DotNet.TWAIN.DynamicDotNetTwain("586300F2E000E88E9965483ECB6CCD4C");

            twain.OCRTessDataPath = StrPath;
            twain.OCRLanguage = strLanguageFileName;
            twain.OCRDllPath = StrPath + "bin";

            switch (nFileFormat)
            {
                case FILE_TYPE_TEXT:
                case FILE_TYPE_DOCX:
                    twain.OCRResultFormat = Dynamsoft.DotNet.TWAIN.OCR.ResultFormat.Text;
                    break;
                case FILE_TYPE_PDF:
                    twain.OCRResultFormat = Dynamsoft.DotNet.TWAIN.OCR.ResultFormat.PDFPlainText;
                    break;
            }
            
            twain.LoadImageFromBytes(byteImages, Dynamsoft.DotNet.TWAIN.Enums.DWTImageFileFormat.WEBTW_BMP);

            Dynamsoft.DotNet.TWAIN.IndexList tmp = new Dynamsoft.DotNet.TWAIN.IndexList(0);
            return twain.OCR(tmp);
        }

        public static byte[] OCR(byte[] byteImages, string strLanguageFileName, int nFileFormat)
        {
            try
            {
                byte[] content = DoOCR.OCRInner(byteImages, strLanguageFileName, nFileFormat);
                if (content == null || content.Length == 0)
                {
                    throw new Exception("Not Found literal.");
                }

                return content;
                //return System.Text.Encoding.ASCII.GetString(content);
            }
            catch
            {
                throw new Exception("Failed to OCR.");
            }
        }
    }

}
