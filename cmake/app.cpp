#include<stdio.h>
#include<curl/curl.h>

int main(){

    int a=3;
    int b=a*34;
    printf("hello world%d",b);

    CURL* curl=nullptr;
    CURLcode res;
    curl=curl_easy_init();
    curl_easy_setopt(curl,CURLOPT_URL,"http://www.baidu.com");
    curl_easy_setopt(curl,CURLOPT_FOLLOWLOCATION,1L);
    res= curl_easy_perform(curl);
    


    return 0;
}