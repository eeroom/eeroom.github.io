$ErrorActionPreference="stop"

$ftpAddress="";
$ftpUserName="";
$ftpPwd="";
$localFileFullPath="d:/abc/aa.zp","d:\ma\bb.zip";

foreach($fileName in $remoteFileNames){
    [System.Console]::WriteLine("开始上传:"+$fileName);
    $fileNameNoPath=[System.IO.Path]::GetFileName($fileName);
    [System.Net.FtpWebRequest] $ftpRequest=[System.Net.FtpWebRequest]::Create($ftpAddress+$fileNameNoPath);
    $ftpRequest.Method="STOR";
    $ftpRequest.UseBinary=$true;
    $ftpRequest.Credentials=New-Object System.Net.NetworkCredential($ftpUserName,$ftpPwd);
    
    [System.IO.FileStream] $fs=[System.IO.File]::Open($fileName);
    $ftpReqStream=$ftpRequest.GetRequestStream();
    $fs.CopyTo($ftpReqStream);
    $ftpReqStream.Close()
    $fs.Close();
    [System.Console]::WriteLine("完成上传:"+$fileName);
}