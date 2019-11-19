#include<stdio.h>
#include "head.h"
#include <gtk/gtk.h>
int btnOkOnClicked(GtkWidget* btn,int data);

typedef struct WindowWrapper{
    GtkWindow* window;
    void* control;
} WindowWrapper;

int main(){
    int a=add(1,2);
    int b=div(a,8);
    gtk_init(NULL,NULL);
    GtkWidget* window=gtk_window_new(GTK_WINDOW_TOPLEVEL);
    //设置窗口标题
    gtk_window_set_title((GtkWindow*)window,"hello world");
    //设置窗口到正中央
    gtk_window_set_position(window,GTK_WIN_POS_CENTER_ALWAYS);
    //设置窗口最大化
    // gtk_window_maximize(window);
    g_signal_connect(window,"destroy",gtk_main_quit,NULL);
    
    // GtkBox* layout=gtk_box_new(GTK_ORIENTATION_VERTICAL,0);
    // gtk_widget_show(layout);
    // gtk_container_add(window,layout);

    // GtkWidget* txtboxmsg= gtk_entry_new();
    // gtk_widget_show(txtboxmsg);
    // gtk_box_pack_start(layout,txtboxmsg,FALSE,FALSE,0);

    GtkWidget* btnOK=gtk_button_new();
    gtk_widget_show(btnOK);
    gtk_button_set_label(btnOK,"OK");
    gtk_container_add(window,btnOK);
    //gtk_box_pack_start(layout,btnOK,FALSE,FALSE,0);
    WindowWrapper wp;
    wp.window=window;
    //wp.control=txtboxmsg;
    
    // g_signal_connect(btnOK,"clicked",btnOkOnClicked,&wp);

    // GtkWidget* lbMsg=gtk_label_new("hello world");
    // gtk_widget_show(lbMsg);
    // gtk_box_pack_start(layout,lbMsg,FALSE,FALSE,0);
    


    gtk_widget_show(window);
    //阻塞代码
    gtk_main();
    printf("hello world\n");
    printf("%d\n",b);
    return 0;
}



int btnOkOnClicked(GtkWidget* btn,int data){
    WindowWrapper* wp=data;
    char* text= gtk_entry_get_text(wp->control);
    gtk_window_set_title(wp->window,text);
    
    return 0;
}