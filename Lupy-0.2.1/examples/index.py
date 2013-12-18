# This module is part of the Lupy project and is Copyright 2003 Amir
# Bakhtiar (amir@divmod.org). This is free software; you can redistribute
# it and/or modify it under the terms of version 2.1 of the GNU Lesser
# General Public License as published by the Free Software Foundation.

"""An example of how to create an index.

This is a thin wrapper around L{IndexWriter}.
"""

import os, sys
import cStringIO as StringIO

from lupy.index.indexwriter import IndexWriter
from lupy import document

class Indexer:


    def __init__(self, path, create=False):
        """Create an indexer, writing and index to the directory B{path}.
        The boolean flag B{create} determines whether the index is created
        (overwriting an existing index) or updated"""
        
        self.indexer = IndexWriter(path, create)
        

    def addDoc(self, fname):
        """Add a document to the index"""
        
        # create document
        d = document.Document()

        # add a file field containing the path to this file
        f = document.Keyword('filename',fname)
        d.add(f)

        # I happen to know that the title is separated
        # from the story by '\n\n\n', so I can easily get the title
        # which we store in the title field
        fp = open(fname,'rb')
        s = fp.read().decode("latin-1")
        title = s.split('\n\n\n')[0]
        f = document.Text('title',title)
        d.add(f)

        # Here I pass False as the 3rd arg to ensure that
        # the actual text of s is not stored in the index
        # the following lines using TextWithReader are
        # more typical.
        
        f = document.Text('text', s, False)
        d.add(f)

        
        # Add text of an open file (fp)
        # This is typically how you add a file to an index
        # f = field.Text('text', fp)
        # d.add(f)
        
        fp.close()

        # add doc to index
        print 'indexing', fname
        self.indexer.addDocument(d)


    def index(self, dir):
        """Recurse through B{dir} and index the files.
        
        Call optimize() before closing to merge all of the segments
        created by indexing. This is an optional step and can be expensive
        for large indexes.
        """
        for name in os.listdir(dir):
            f = os.path.join(dir, name)
            if os.path.isdir(f) or os.path.islink(f):
                continue
            self.addDoc(f)

        # Uncomment the following line to optimize the index.
        # Have a look in the index dir before you optimize.
        # You will probably see a dozens of files from
        # several segments. optimize() merges all the segments
        # into one. It can be quite an expensive operation, but
        # it can save space and speed up searches.
        
        # self.indexer.optimize()
        
        self.indexer.close()


if __name__ == "__main__":

    import time
    tt = time.time()
    # create a new index in a directory
    i = Indexer('aesopind', True)

    # recursively index the files in a directory
    i.index('aesop')
    print 'Elapsed time:', time.time() - tt
