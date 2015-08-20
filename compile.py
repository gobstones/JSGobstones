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

def append_file(filename, content):
    f = open(filename, 'a')
    f.write(content)
    f.close()

def write_file(filename, content):
    f = open(filename, 'w')
    f.write(content)
    f.close()

def delete_file(filename):
    os.unlink(filename)

def read_file(filename):
    f = open(filename, "r")
    content = f.read()
    f.close()
    return content

## Parser for option switches

def remove_no(option_name):
    if option_name[:3] == "no-":
        return option_name[3:]
    else:
        return option_name

def normalize_option_name(option_name):
    if option_name[:2] == "--":
        return option_name[2:]
    else:
        return option_name

def get_options(option_switches):
    return parse_options(option_switches, sys.argv)

def default_options(option_switches):
    opt = {}
    for o in option_switches:
        o = o.split(' ')
        sw = o[0]
        if sw[:3] == 'no-':
            neg = True
            sw = sw[3:]
        else:
            neg = False
        if len(o) == 1:
            opt[sw] = neg
        else:
            opt[sw] = []
    return opt

def get_option_names(option_switches):
    return [option.split(' ')[0] for option in option_switches]

def parse_options(option_switches, args, max_args=None):
    arguments = []
    option_names = get_option_names(option_switches)
    switches = [normalize_option_name(s) for s in option_switches]
    args = map(lambda arg: normalize_option_name(arg) if arg in option_names else arg, args)
    opt = default_options(switches)
    i = 1
    n = len(args)

    # all args
    while i < len(args):
        o = None

        # select matching option
        for oi in switches:
            oi = oi.split(' ')
            if oi[0] == args[i]:
                o = oi
                break

        # This is an argument, not an option
        if o is None:
            if len(arguments) == max_args:
                return False
            arguments.append(args[i])
            i += 1
            continue

        # Check if single-word option
        # sw = current option
        sw = o[0]
        if len(o) == 1:
            if sw[:3] == 'no-':
                neg = True
                sw = sw[3:]
            else:
                neg = False
            opt[sw] = not neg
            i += 1
        # If has parameters
        else:
            k = 1
            i += 1
            while k < len(o):
                if i >= n: return False
                opt[sw].append(args[i])
                i += 1
                k += 1
    return arguments, opt

class _Getch:
    """Gets a single character from standard input.  Does not echo to the
screen."""
    def __init__(self):
        try:
            self.impl = _GetchWindows()
        except ImportError:
            self.impl = _GetchUnix()

    def __call__(self): return self.impl()


class _GetchUnix:
    def __init__(self):
        import tty, sys

    def __call__(self):
        import sys, tty, termios
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setraw(sys.stdin.fileno())
            ch = sys.stdin.read(1)
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        return ch


class _GetchWindows:
    def __init__(self):
        import msvcrt

    def __call__(self):
        import msvcrt
        return msvcrt.getch()


import fnmatch
import os, shutil

def get_files_matching(directory, matching):
    matches = []
    for root, dirnames, filenames in os.walk(directory):
      for filename in fnmatch.filter(filenames, matching):
        matches.append(os.path.join(root, filename))
    return matches

THIS_DIR = os.path.dirname(__file__)
BIN_DIR = os.path.join(THIS_DIR, "public", "jsgobstones")

class RunTypescript(object):

    def get_option_handlers(self):
        return {
            "--main X" : self.build,
            "--purge"  : self.purge,
            "--no-build-html" : None,
            "--no-clean" : None,
            "--no-build-parser": None,
            "--install" : self.install
        }

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

        build_cmd = "tsc --sourcemap --target %s --out %s %s" % (target, output, mainfile)

        if self.options.clean:
            if os.path.exists(BIN_DIR):
                shutil.rmtree(BIN_DIR)
            os.mkdir(BIN_DIR)

        os.system(build_cmd)

        jsfiles = get_files_matching(os.path.dirname(mainfile), "*.js")
        jsfiles = filter(lambda f: not mainfile[:-3] + ".js" in f and not "/gui/" in f, jsfiles)
        for f in jsfiles:
            os.system("mv %s %s" % (f, BIN_DIR))
        #os.system("mv %s %s" % (mainfile[:-3]+".js", BIN_DIR))

        os.system("gulp")
        print "Ready"


parser = argparse.ArgumentParser()
group = parser.add_mutually_exclusive_group(required=True)
group.add_argument("-i", "--install", action="store_true")
group.add_argument("-m", "--main")
group.add_argument("-p", "--purge", action="store_true")
parser.add_argument("--no-build-parser",action="store_false", dest="build_parser")
parser.add_argument("--no-clear",action="store_false", dest="clean")
args = parser.parse_args()

RunTypescript().run(args)
