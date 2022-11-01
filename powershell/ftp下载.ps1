$ErrorActionPreference="stop"

$ftpAddress="";
$ftpUserName="";
$ftpPwd="";
$remoteFileNames="aa.zp","bb.zip";
$localDirectory="d:/download";

if(!$ftpAddress.EndsWith("/")){
    $ftpAddress+="/"
}
foreach($fileName in $remoteFileNames){
    [System.Console]::WriteLine("开始下载:"+$fileName);
    [System.Net.FtpWebRequest] $ftpRequest=[System.Net.FtpWebRequest]::Create($ftpAddress+$fileName);
    $ftpRequest.Method="RETR";
    $ftpRequest.UseBinary=$true;
    $ftpRequest.Credentials=New-Object System.Net.NetworkCredential($ftpUserName,$ftpPwd);
    $ftpResStream=$ftpRequest.EndGetResponse().GetResponseStream();
    [System.IO.Directory]::CreateDirectory($localDirectory);
    [System.IO.FileStream] $fs=[System.IO.File]::OpenWrite($localDirectory+"/"+$fileName);
    $ftpResStream.CopyTo($fs);
    $fs.Close();
    $ftpResStream.Close();
       [System.Console]::WriteLine("完成下载:"+$fileName);
}