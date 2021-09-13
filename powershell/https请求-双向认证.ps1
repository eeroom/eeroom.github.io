$ErrorActionPreference="Stop"

[String]$url="https://localhost/WcfTwoWayAuthentication/Home.svc/help/operations/DoWork";
#证书指纹
$certzhiwen="‎0adc42305145e53a07ebc2fd619929c7f124d60d".ToUpper();
#证书名称
$certSubjectName="WCH";
#需要安装wmf5.1才可以支持这个class关键字
 class TrustAllServerCert : System.Net.ICertificatePolicy{
    [bool] CheckValidationResult([System.Net.ServicePoint] $srvPoint, [System.Security.Cryptography.X509Certificates.X509Certificate] $certificate, [System.Net.WebRequest] $request,[int] $certificateProblem){
          [System.Console]::WriteLine("TrustAllServerCert");
        return $true;
    }
}
$serverCertificateValidationCallback={
    param($p1,$p2,$p3,$p4){
        [System.Console]::WriteLine("serverCertificateValidationCallback");
        return $true;
    }
}
#这里设置ServerCertificateValidationCallback或CertificatePolicy.都是为了忽略服务端https证书的校验，不同os及版本运行这个的时候表现的结果可能有差异（原因未知），需要灵活组合让其生效
#等价的c#代码，优先设置ServerCertificateValidationCallback为$serverCertificateValidationCallback,不设置CertificatePolicy（弃用属性），
#[System.Net.ServicePointManager]::ServerCertificateValidationCallback=$serverCertificateValidationCallback;
[System.Net.ServicePointManager]::ServerCertificateValidationCallback=$null;
[System.Net.ServicePointManager]::CertificatePolicy=[TrustAllServerCert]::new()
#[System.Net.ServicePointManager]::CertificatePolicy=$null;

[System.Net.HttpWebRequest]$req=[System.Net.WebRequest]::Create($url);
$req.Method="GET";
$req.KeepAlive=$true;
$certStore=New-Object System.Security.Cryptography.X509Certificates.X509Store([System.Security.Cryptography.X509Certificates.StoreName]::My,[System.Security.Cryptography.X509Certificates.StoreLocation]::CurrentUser);
$certStore.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadOnly);
#精确查找需要的证书然后添加到请求里面
$certs=$certStore.Certificates.Find([System.Security.Cryptography.X509Certificates.X509FindType]::FindBySubjectName,$certSubjectName,$true);
#$req.ClientCertificates.AddRange($certs);

#直接把多个证书都加到请求里面
$req.ClientCertificates.AddRange($certStore.Certificates);

$res=$req.GetResponse();
$reader=New-Object System.IO.StreamReader($res.GetResponseStream());
$value=$reader.ReadToEnd();
[System.Console]::WriteLine($value);









