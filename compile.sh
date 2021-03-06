#!/bin/sh

# This is the path to the Closure Compiler from http://code.google.com/closure/compiler/
COMPILER=~/compiler.jar
COMPLEVEL=ADVANCED_OPTIMIZATIONS

echo "Compiling Mac interpreter..."

java -jar $COMPILER --warning_level VERBOSE --compilation_level $COMPLEVEL --js mac/mac.js --js mac/files.js --js mac/graphics.js --js mac/resources.js --js mac/menus.js --js mac/windows.js --js mac/sound.js --js files.js --js init.js --js main.js --js graphics.js --js menus.js --js windows.js --js engine.js --js controls.js --js text.js --js objects.js --js sound.js --js last.js --externs externs.js --externs jquery_externs.js --js_output_file mac.js

echo "mac.js created"
echo "Compiling IIgs interpreter..."

java -jar $COMPILER --warning_level VERBOSE --compilation_level $COMPLEVEL --js gs/gs.js --js gs/files.js --js gs/graphics.js --js gs/resources.js --js gs/menus.js --js gs/windows.js --js gs/sound.js --js files.js --js init.js --js main.js --js graphics.js --js menus.js --js windows.js --js engine.js --js controls.js --js text.js --js objects.js --js sound.js --js last.js --externs externs.js --externs jquery_externs.js --js_output_file gs.js

echo "gs.js created"

echo "Webventure compiled"
