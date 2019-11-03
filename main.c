#include<stdio.h>
#include "head.h"
#include <gtk/gtk.h>

int main(){
    int a=add(1,2);
    int b=div(a,8);
    gtk_init(NULL,NULL);
    GtkWidget* window=gtk_window_new(GTK_WINDOW_TOPLEVEL);
    gtk_window_set_title((GtkWindow*)window,"hello world");
    g_signal_connect(window,"destroy",gtk_main_quit,NULL);
    gtk_widget_show(window);
    gtk_main();
    printf("hello world\n");
    printf("%d\n",b);
    return 0;
}