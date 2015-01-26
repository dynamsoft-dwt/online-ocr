using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;
using System.IO;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;


namespace DynamsoftOCR
{
    public class OCRMode
    {

        public static byte[] OCR(byte[] byteImages, string strLanguageFileName, int nFileFormat)
        {
            try
            {
                if (byteImages == null || byteImages.Length == 0)
                    throw new Exception("Image is not exist.");
                return DoOCR.OCR(byteImages, strLanguageFileName, nFileFormat);
            }
            catch
            {
                throw new Exception("Failed to OCR"); ;
            }
        }

    }
}
