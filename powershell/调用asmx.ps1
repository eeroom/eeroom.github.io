$ErrorActionPreference="Stop";
$targeturl="http://localhost:49755/Home.asmx";
$method="POST";
$action="HelloWorld"
[string] $reqbody='<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <HelloWorld xmlns="http://tempuri.org/">
      <a>44</a>
    </HelloWorld>
  </soap:Body>
</soap:Envelope>';
[System.Net.HttpWebRequest] $req= [System.Net.WebRequest]::Create($targeturl);
$req.Method=$method;
$req.ContentType="text/xml; charset=utf-8";
$req.Headers.Add("SOAPAction","http://tempuri.org/"+$action)
[byte[]] $bodydata= [System.Text.Encoding]::UTF8.GetBytes($reqbody);
[System.IO.Stream] $reqStream= $req.GetRequestStream();
$reqStream.Write($bodydata,0,$bodydata.Length);
$res= $req.GetResponse();
[System.IO.Stream] $resStream= $res.GetResponseStream();
$reader= [System.IO.StreamReader]::new($resStream);
$xml= $reader.ReadToEnd();
[System.Console]::WriteLine("---------------------");
[System.Console]::WriteLine($xml);





