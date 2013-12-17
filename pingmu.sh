#!/bin/bash

cvt 1920 1080
xrandr --newmode "1920x1080_60.00"  173.00  1920 2048 2248 2576  1080 1083 1088 1120 -hsync +vsync
xrandr --addmode DVI-0 "1920x1080_60.00"
xrandr --output DVI-0 --mode "1920x1080_60.00"

xrandr --addmode DVI-1 "1920x1080_60.00"
xrandr --output DVI-1 --mode "1920x1080_60.00"

xrandr --output DVI-1 --right-of DVI-0



