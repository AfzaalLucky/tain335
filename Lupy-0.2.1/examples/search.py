# This module is part of the Lupy project and is Copyright 2003 Amir
# Bakhtiar (amir@divmod.org). This is free software; you can redistribute
# it and/or modify it under the terms of version 2.1 of the GNU Lesser
# General Public License as published by the Free Software Foundation.

"""Examples of different kinds of query being run through an IndexSearcher.
"""

from lupy.index.term import Term
from lupy.search.indexsearcher import IndexSearcher
from lupy.search.term import TermQuery
from lupy.search.phrase import PhraseQuery
from lupy.search.boolean import BooleanQuery


def printHits(hits):
    if len(hits) == 0:
        print 'Nothing found!'
    else:
        for hit in hits:
            print 'Found in document %s (%s)' % (hit.get('filename'), hit.get('title'))
        
def termSearch(qStr):
    t = Term('text', qStr)
    q = TermQuery(t)
    
    return q


def titleSearch(qStr):
    t = Term('title', qStr)
    q = TermQuery(t)
    
    return q
        
        
def phraseSearch(qStr, field='text'):
    """Find all docs containing the phrase C{qStr}."""

    parts = qStr.split()
    
    q = PhraseQuery()
    
    for p in parts:
        t = Term(field, p)
        q.add(t)
        
    return q
        

def boolSearch(ands=[], ors=[], nots=[]):
    """Build a simple boolean query.
    each word in B{ands} is equiv to +word
    each word in B{ors} is equiv to word
    each word in B{nots} is equiv to -word

    e.g. boolSearch(['spam'], ['eggs'], ['parrot', 'cheese'])
    is equiv to +spam eggs -parrot -cheese in Google/Lucene syntax"""
    
    q = BooleanQuery()

    for a in ands:
        t = Term('text', a)
        tq = TermQuery(t)
        q.add(tq, True, False)
        
    for a in ors:
        t = Term('text', a)
        tq = TermQuery(t)
        q.add(tq, False, False)
        
    for a in nots:
        t = Term('text', a)
        tq = TermQuery(t)
        q.add(tq, False, True)
    
    return q
        
        
def runQuery(q, searcher):
    """The run a query through a searcher and return the hits"""

    print 'Query:', q.toString('text')
    hits = searcher.search(q)
    printHits(hits)
    print
    return hits

       
      
if __name__ == "__main__":
    """One shot search.
    Opens and closes the index on every query.
    """
    
    import time    
    tt = time.time()
    
    searcher = IndexSearcher('aesopind')

    # Note that all queries have to be submitted in lower-case...

    q = termSearch('fox')
    runQuery(q, searcher)
    
    q = phraseSearch('fox and the crow')
    runQuery(q, searcher)

    # A boolean search equiv to 'x and not y'
    q = boolSearch(['fox'], [], ['crow', 'lion'])
    runQuery(q, searcher)

    # Search the title field
    q = titleSearch('frog')
    runQuery(q, searcher)

    searcher.close()
    
    print time.time() - tt
