#!/usr/bin/python
# Author: Ary Pablo Batista <arypbatista@gmail.com>
"""
    This file is part of JSGobstones.
    JSGobstones is free software: you can redistribute it and/or
    modify it under the terms of the GNU General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    JSGobstones is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with JSGobstones.  If not, see <http://www.gnu.org/licenses/>.
"""

import argparse
import os, os.path
import sys
import fnmatch
import os, shutil

def append_file(filename, content):
    with open(filename, 'a') as f:
        f.write(content)

def write_file(filename, content):
    with open(filename, 'w') as f:
        f.write(content)

def delete_file(filename):
    os.unlink(filename)

def read_file(filename):
    with open(filename, 'r') as f:
        return f.read()

def get_files_matching(directory, matching):
    matches = []
    for root, dirnames, filenames in os.walk(directory):
      for filename in fnmatch.filter(filenames, matching):
        matches.append(os.path.join(root, filename))
    return matches

THIS_DIR = os.path.dirname(__file__)
BIN_DIR = os.path.join(THIS_DIR, "public", "jsgobstones")

class RunTypescript(object):

    def run(self, args):
        self.options = args
        if args.install:
            self.install()
        elif args.purge:
            self.purge()
        elif args.main:
            self.build(args.main)

    def install(self):
        print "Installing JSGobstones"
        os.system("npm install")
        os.system("bower install")
        os.system("sudo gem install sass")
        print "Done"

    def purge(self):
        print "The Purge begins!"
        if os.path.exists(BIN_DIR):
            shutil.rmtree(BIN_DIR)
        print "Ready"

    def build(self, mainfile, target="ES5"):
        print "Compiling %s" % (mainfile,)

        if self.options.build_parser:
            print "Compiling parser"
            os.system("pegjs -e \"var parser\" ./src/parser/GobstonesTranspiler.pegjs ./src/parser/GobstonesTranspiler.js".replace("\./", THIS_DIR))

        print "Building macro's file"
        os.system(os.path.join(THIS_DIR, "src", "compiler", "GenerateMacrosFile.py"))

        output = os.path.join(BIN_DIR, os.path.basename(mainfile)[:-3] + ".js")
        test_output = os.path.join(BIN_DIR, os.path.basename(mainfile)[:-3] + "-tests.js")

        build_cmd = "tsc --sourcemap --target %s --out %s %s" % (target, output, mainfile)
        build_tests = "tsc --sourcemap --target %s --out %s %s" % (target, test_output, "./tests/Test.ts")

        if self.options.clean:
            if os.path.exists(BIN_DIR):
                shutil.rmtree(BIN_DIR)
            os.mkdir(BIN_DIR)

        os.system(build_cmd)
        
        os.system(build_tests)

        jsfiles = get_files_matching(os.path.dirname(mainfile), "*.js")
        jsfiles = filter(lambda f: not mainfile[:-3] + ".js" in f and not "/gui/" in f, jsfiles)
        for f in jsfiles:
            os.system("mv %s %s" % (f, BIN_DIR))
        #os.system("mv %s %s" % (mainfile[:-3]+".js", BIN_DIR))

        os.system("gulp")
        print "Ready"


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("-i", "--install", action="store_true")
    group.add_argument("-m", "--main")
    group.add_argument("-p", "--purge", action="store_true")
    parser.add_argument("--no-build-parser",action="store_false", dest="build_parser")
    parser.add_argument("--no-clear",action="store_false", dest="clean")
    args = parser.parse_args()
    RunTypescript().run(args)
