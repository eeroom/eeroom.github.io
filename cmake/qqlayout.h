#ifndef QLAYOUT_H
#define QLAYOUT_H

#include<QWidget>

class qqlayout:public QWidget{
    Q_OBJECT

    public:
        qqlayout(QWidget *parent=0);
        ~qqlayout();
};

#endif