src=$(wildcard ./*.c)
obj=$(patsubst ./%.c,./%.o,$(src))
target=app
#CPPFLAGS=-mms-bitfields -IE:/gtk30/include/gtk-3.0 -IE:/gtk30/include/cairo -IE:/gtk30/include/pango-1.0 -IE:/gtk30/include/atk-1.0 -IE:/gtk30/include/cairo -IE:/gtk30/include/pixman-1 -IE:/gtk30/include -IE:/gtk30/include/freetype2 -IE:/gtk30/include -IE:/gtk30/include/libpng15 -IE:/gtk30/include/gdk-pixbuf-2.0 -IE:/gtk30/include/libpng15 -IE:/gtk30/include/glib-2.0 -IE:/gtk30/lib/glib-2.0/include
#LDFLAGS=-LE:/gtk30/lib -lgtk-3 -lgdk-3 -lgdi32 -limm32 -lshell32 -lole32 -Wl,-luuid -lpangocairo-1.0 -lpangoft2-1.0 -lfreetype -lfontconfig -lpangowin32-1.0 -lgdi32 -lpango-1.0 -lm -latk-1.0 -lcairo-gobject -lcairo -lgdk_pixbuf-2.0 -lgio-2.0 -lgobject-2.0 -lglib-2.0 -lintl
CPPFLAGS=-pthread -I/usr/include/gtk-2.0 -I/usr/lib64/gtk-2.0/include -I/usr/include/atk-1.0 -I/usr/include/cairo -I/usr/include/gdk-pixbuf-2.0 -I/usr/include/pango-1.0 -I/usr/include/glib-2.0 -I/usr/lib64/glib-2.0/include -I/usr/include/pixman-1 -I/usr/include/freetype2 -I/usr/include/libpng12
LDFLAGS=-pthread -lgtk-x11-2.0 -lgdk-x11-2.0 -latk-1.0 -lgio-2.0 -lpangoft2-1.0 -lpangocairo-1.0 -lgdk_pixbuf-2.0 -lcairo -lpango-1.0 -lfreetype -lfontconfig -lgobject-2.0 -lgmodule-2.0 -lgthread-2.0 -lrt -lglib-2.0

$(target):$(obj)
	gcc $^ -o $@  $(CPPFLAGS) $(LDFLAGS)  -g

%.o:%.c
	gcc -c $< -g -o $@  $(CPPFLAGS) $(LDFLAGS) -g

hello:
	echo hello world

clean:
	del /q *.o
	del /q $(target).exe 