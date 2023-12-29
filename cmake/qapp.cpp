#include<QApplication>
#include<qqlayout.h>
int main(int argc,char* argv[]){
    QApplication a(argc,argv);
    qqlayout w;
    w.show();
    return a.exec();
}