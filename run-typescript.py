#!/usr/bin/python
# Author: Ary Pablo Batista <arypbatista@gmail.com>
"""
    This file is part of JSGobstones.
    JSGobstones is free software: you can redistribute it and/or 
    modify it under the terms of the GNU General Public License as published 
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    Foobar is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
"""

import os, os.path
import sys

class CmdApplication(object):

    def initialize(self):
        self.input_key = _Getch()
        self.options = None
        self.arguments = None
        
    def usage(self):
        return "No usage info.\n"
        
    def get_option_handlers(self):
        return {}
        
    def get_option_switches(self):        
        return self.get_option_handlers().keys()
        
    def error(self, message):
        sys.stderr.write(message)
            
    def get_option_name(self, option_switch):
        return remove_no(normalize_option_name(option_switch.split(" ")[0]))
            
    def start(self):
        self.initialize()
        self.arguments, self.options = get_options(self.get_option_switches())
        
        options_processed = []
        for option_switch, option_handler in self.get_option_handlers().iteritems():
            option = self.get_option_name(option_switch)
            if self.options[option] and not option_handler is None:
                if isinstance(self.options[option], list):
                    option_handler(*self.options[option])
                else:
                    option_handler()
        
                options_processed += [option]
            
        if len(options_processed) == 0:
            self.error(self.usage().replace('<CMDLINE>', sys.argv[0]))
            sys.exit(1)

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



class RunTypescript(CmdApplication):
    
    def get_option_handlers(self):
        return {
            "--main X" : self.build,
            "--purge"  : self.purge,
            "--no-build-html" : None,
            "--no-clear" : None
        }
        
    def purge(self):
        print "The Purge begins!"
        bin_dir = os.path.join(os.getcwd(), "bin")
        if os.path.exists(bin_dir):
            shutil.rmtree(bin_dir)  
        print "Ready"
            
    def build(self, mainfile):
        print "Compiling %s" % (mainfile,)
        os.system("tsc %s" % (mainfile,))
        
        bin_dir = os.path.join(os.getcwd(), "bin")

        if self.options["clear"]:
            if os.path.exists(bin_dir):
                shutil.rmtree(bin_dir)    
            os.mkdir(bin_dir)
            
        jsfiles = get_files_matching(os.path.dirname(mainfile), "*.js")        
        jsfiles = filter(lambda f: not mainfile[:-3] + ".js" in f, jsfiles)
        for f in jsfiles:
            os.system("mv %s %s" % (f, bin_dir))        
        os.system("mv %s %s" % (mainfile[:-3]+".js", bin_dir))
        
        if self.options["build-html"]:
            print "Building html file..."
            jsfiles = map(lambda f: os.path.basename(f), jsfiles)                    
            html = self.render_html(os.path.basename(mainfile)[:-3]+".js", jsfiles)
            write_file(os.path.join(bin_dir, "index.html"), html)
            #os.system("google-chrome %s/index.html" % (os.getcwd(),))
            #os.system("cat %s/index.html" % (os.getcwd(),))
        print "Ready"

    def render_html(self, mainf, jsfiles):
        output = "<html><head>\n"
        for jsfile in jsfiles + [mainf]:
            output += "<script type=\"text/javascript\" src=\"%s\"></script>\n" % (jsfile,)
        output += "</head></html>"
        return output
        
        
RunTypescript().start()