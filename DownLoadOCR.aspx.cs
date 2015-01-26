using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

namespace OCROnline
{
    public partial class DownLoadOCR : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            char cPathDir = System.IO.Path.DirectorySeparatorChar;
            try
            { 
                string strFileName = GetFileName();
                if (!OnlyDeleteWithoutDownLoad())
                {
                    string strFilePath = AppDomain.CurrentDomain.BaseDirectory
                        + "Temp" + cPathDir + strFileName;
                    using (FileStream fileInfo = new FileStream(strFilePath, FileMode.Open))
                    {
                        byte[] data = new byte[fileInfo.Length];
                        fileInfo.Read(data, 0, (int)fileInfo.Length);
                        Response.Clear();
                        Response.ClearContent();
                        Response.ClearHeaders();
                       
                        Response.AddHeader("Content-Disposition", "attachment;filename=" + Server.UrlEncode("DynamsoftOCR."+ strFileName.Split('.')[1]));
                        Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        Response.AddHeader("Content-Transfer-Encoding", "binary");
                        Response.ContentType = "application/octet-stream";
                        Response.BinaryWrite(data);
                        Response.Flush();
                        Response.End();
                    }
                }
            }
            catch (Exception exp)
            {
                Response.Write("<script type='text/javascript'> alert('" + exp.Message.Replace('\'', '\"').Replace("\\", "\\\\") + "');</script>");
            }
            finally
            {
                DateTime now = DateTime.Now;
                string strFile = now.ToString("yyyyMMdd_");

                DeleteFolder(UploadFolder, strFile);
            }
        }
        private string GetFileName()
        {
            return Request.QueryString["FileId"];
        }
        private bool OnlyDeleteWithoutDownLoad()
        {
            bool isOnlyDeleteWithoutDownLoad = false;
            string strNeedDelete = Request.QueryString["OnlyDelete"];
            bool.TryParse(strNeedDelete, out isOnlyDeleteWithoutDownLoad);
            return isOnlyDeleteWithoutDownLoad;
        }

        private static string StrPath = AppDomain.CurrentDomain.BaseDirectory;
        private static string UploadFolder = StrPath + "Temp";
        internal static void DeleteFolder(string strFullPath, string strNotDeleteFile)
        {
            try
            {
                if (Directory.Exists(strFullPath))
                {
                    foreach (string subdir in Directory.GetDirectories(strFullPath))
                    {
                        DeleteFolder(subdir, strNotDeleteFile); 
                    }

                    try
                    {
                        DeleteTempFiles(strFullPath, strNotDeleteFile);
                    }
                    catch { }
                    Directory.Delete(strFullPath);
                }
            }
            catch { }
        }


        internal static void DeleteTempFiles(string strPath, string strNotDeleteFile)
        {
            try
            {
                string[] aryFiles = System.IO.Directory.GetFiles(strPath);
                foreach (string strFileName in aryFiles)
                {
                    try
                    {
                        int index = strFileName.LastIndexOf("\\");
                        if (index > 0)
                        {
                            string strFileNameTemp = strFileName.Substring(index + 1, strFileName.Length - index - 1);
                            if (strFileNameTemp.StartsWith("Demo_") == false && strFileNameTemp.StartsWith(strNotDeleteFile) == false)
                            {
                                File.Delete(strFileName);
                            }
                        }
                    }
                    catch { }
                }
            }
            catch { }

        }
    }
}
