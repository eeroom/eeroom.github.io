//这里是随便写的，类型名称和参数以你代码里那个定义为准，
public delegate int fanys(int a,int b,int c);


//修改这个回调方法在最后加一个参数，传递_cabpulisher那个数据，后续就可以用
public static int mycallback(int a,int b,int c,object tabpulishe){
        

}


public void Get(){
    //类型名称和参数以你代码里的为准，
    fanys fhandler=new fanys((a,b,c)=>mycallback(a,b,c,tabpulishe))
    //这里不传以前那个静态字段的值，改成fhandler
    NTClient.RealoadPicture(,,,,fhandler);
}