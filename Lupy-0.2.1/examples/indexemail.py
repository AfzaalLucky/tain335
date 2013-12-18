# This module is part of the Pyndex project and is Copyright 2003 Amir
# Bakhtiar (amir@divmod.org). This is free software; you can redistribute
# it and/or modify it under the terms of version 2.1 of the GNU Lesser
# General Public License as published by the Free Software Foundation.

import os, sys
import email, email.Iterators, email.Errors
import time

from lupy.indexer import Index


filedir = sys.argv[1]
indexName = 'emailindex'

tt = time.time()

# Create a new Index
index = Index(indexName, create=True)

# Get the files
files = os.listdir(filedir)

i=0
for f in files:
    print 'Indexing', f
    fp = open(os.path.join(filedir, f))

    # Try to parse the message
    try:
        msg = email.message_from_file(fp)
    except email.Errors.MessageParseError:
        print 'Bad msg:', f
        continue

    # get the subject
    subj = msg.get('subject', '<No Subject>')

    # get the sender
    frm = msg.get('from', '<Nobody>')

    body = ''
    for part in msg.walk():
        typ = part.get_type()
        if typ and typ.lower() == "text/plain":
            # Found the first text/plain part
            body = part.get_payload(decode=True)
            break

    # text is indexed
    # subject is indexed and stored (returned with Hits)
    # frm is indexed and stored (returned with Hits)
    # uid is a Lupy Keyword Field and it is stored and
    # returned with search hits it is not indexed.
    # Keywords are useful for linking results back into
    # your reality of files and messages. They are also
    # for deletion. If you have a unique string per doc
    # you can ask the index to delete all docs containing
    # that Term in that Field.
    index.index(text = body, _uid = str(i), __subject=subj, __frm=frm)
    i += 1

index.optimize()
index.commit()

# pretend it never happened
del(index)

# re-open it for search
index = Index(indexName, create=False)

# search for the word 'today'
hits = index.find('you')
print 'Finding you', hits
for h in hits:
    print h

index.delete(uid='41')
hits = index.find('you')
print 'Finding you', hits
for h in hits:
    print h

index.close()
print time.time() - tt


