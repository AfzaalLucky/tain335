# -*- coding: utf8 -*-
# This module is part of the Lupy project and is Copyright 2003 Amir
# Bakhtiar (amir@divmod.org). This is free software; you can redistribute
# it and/or modify it under the terms of version 2.1 of the GNU Lesser
# General Public License as published by the Free Software Foundation.

import os, sys, time
from lupy.indexer import Index


def main():
    """An example of using the Indexer wrapper.
    """
    
    # TODO Command line argument passing
    # TODO e.g.
    # TODO -d directory to store index in
    # TODO -i directory to recursively index
    
    import time
    tt = time.time()

    filedir = 'aesop'
    indexName = 'aesopind'

    if os.path.exists(indexName):
        for f in os.listdir(indexName):
            os.remove(os.path.join(indexName, f))
        # Remove results of previous runs
        os.rmdir(indexName)

    # Create a new Index
    index = Index(indexName, create = True)
    index.setMergeFactor(20)
    # Get the files
    files = os.listdir(filedir)
    for name in files:
        f = os.path.join(filedir, name)
        if os.path.isdir(f) or os.path.islink(f):
            continue
        text = open(f, 'rb').read().decode("latin-1")
        title = text.split('\n\n\n')[0]
        print 'indexing:', f
        # the next line creates a Document with 2 fields
        # one field is named text and the other is named
        # filename. The latter is created as Keyword since
        # the name is preceded by '_'. Naughty but expdient.
        index.index(text=text, __title=title, _filename=f)
        
    # Uncomment the following line to optimize the index.
    # Have a look in the index dir before you optimize.
    # You will probably see a dozens of files from
    # several segments. optimize() merges all the segments
    # into one. It can be quite an expensive operation, but
    # it can save space and speed up searches.
    
    #index.optimize()

    queries = ['fox', u'intô', 'python', 'fox python',
               '"the Fox and the"',
               'the fox and python']
    for q in queries:
        hits = index.find(q)
        print q.encode('utf8'), hits
        for h in hits:
            print '\tFound in %s (%s)' % (h.get('filename'), h.get('title'))
    index.close()
    print 'Elapsed time:', time.time() - tt

if __name__ == "__main__":
    main()
