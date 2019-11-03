src=$(wildcard ./*.c)
obj=$(patsubst ./%.c,./%.o,$(src))
target=app
$(target):$(obj)
	gcc  $^ -g -o $@

%.o:%.c
	gcc -c $< -g -o $@

hello:
	echo hello world

clean:
	del /q *.o
	del /q $(target).exe 