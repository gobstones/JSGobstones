#!/usr/bin/python

from os.path import dirname, join
from os import system
import re

MACRO_FILE = join(dirname(__file__), "GobstonesMacros.sjs")
OUTPUT_FILE = join(dirname(__file__), "GobstonesMacros.js")

def read(filename):
    f = open(filename, "r")
    content = f.read()
    f.close()
    return content
    
def minify(text):
    return text.replace(" +", " ").replace("\n", " ").replace("\t", " ")
    
def main():
    macro_content = minify(read(MACRO_FILE))
    system("echo 'var GOBSTONES_MACROS = \"%s\"' > %s" % (macro_content.replace("\n", " "), OUTPUT_FILE))
    
if __name__ == "__main__":
    main()