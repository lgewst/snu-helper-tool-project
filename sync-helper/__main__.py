import argparse
import pathlib

from utile.conflictUtile import *
from conflict.conflict import *

from utile.blameUtile import *
from blame.blame import *

def main():
    parser = argparse.ArgumentParser(description='Chromium sync helper tool')
    parser.add_argument('path', type=pathlib.Path, help='path to repository')
    parser.add_argument('-c', '--conflict',action='store_const',
                        const=True, default=False, help='Show all conflicts')
    parser.add_argument('-b', '--blame', action='store_const',
                        const=True, default=False, help='Show what revision and author last modified each conflict line')
    args = parser.parse_args()
    
    # fill conflicts located in conflict.coflict
    ret = fill_conflicts(args.path)
    if ret == -1:
        print("Invalid path")
        exit(0)
    if ret == -2:
        print(f"'{args.path}' is not a git repository")
        exit(0)
    
    if args.conflict:
        print(f"{'file path':100}{'current':15}{'incoming'}")
        print("-" * 130)
        for cf in conflicts:
            print(cf)
        return
    elif args.blame:
        ret = fill_blame_info(args.path)
        for bl in blames:
            print(bl)
        return
    else:
        ##TODO
        pass
    


if __name__ == '__main__':
    main()
