using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Net;
using ICSharpCode.SharpZipLib;

namespace Blimp_Update
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            if (File.Exists(Application.StartupPath + "\text.ini"))
            {
                string texto = System.IO.File.ReadAllText(Application.StartupPath + "\text.ini");
                label1.Text = texto;
            }
            label1.Text += "...";
            WebClient cliente = new WebClient();
            cliente.DownloadFileAsync(new Uri("http://www.alva-interactive.com.es/blimp/installer.zip"), System.IO.Path.GetTempPath() + "\\installer.zip");
            cliente.DownloadFileCompleted += Cliente_DownloadFileCompleted;
        }

        private void Cliente_DownloadFileCompleted(object sender, AsyncCompletedEventArgs e)
        {
            ICSharpCode.SharpZipLib.Zip.FastZip zipea = new ICSharpCode.SharpZipLib.Zip.FastZip();
            zipea.ExtractZip(System.IO.Path.GetTempPath() + "\\installer.zip",System.IO.Path.GetTempPath(),"");
            if (File.Exists(System.IO.Path.GetTempPath() + "\\installer.asar"))
            {
                Process[] tabla = Process.GetProcessesByName("Blimp Animator");
                foreach (Process blimp in tabla)
                {
                    blimp.Kill();
                }
                File.Copy(System.IO.Path.GetTempPath() + "\\installer.asar", Application.StartupPath + "\\resources\\app.asar", true);
                System.Threading.Thread.Sleep(1000);
                Process blimpPro = new Process();
                blimpPro.StartInfo.FileName = Application.StartupPath + "\\Blimp Animator.exe";
                blimpPro.Start();
                Application.Exit();
            }
        }
    }
}
