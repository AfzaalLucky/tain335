# -*- test-case-name: lupy.test -*- 
# This module is part of the Lupy project and is Copyright 2003 Amir
# Bakhtiar (amir@divmod.org). This is free software; you can redistribute
# it and/or modify it under the terms of version 2.1 of the GNU Lesser
# General Public License as published by the Free Software Foundation.

from distutils.core import setup

classifiers = """\
Development Status :: 5 - Production/Stable
Intended Audience :: Developers
Programming Language :: Python
License :: OSI Approved :: GNU Library or Lesser General Public License (LGPL)
Topic :: Text Processing :: Indexing
Operating System :: Microsoft :: Windows
Operating System :: POSIX
"""

setup(name="Lupy",
      version="0.2.1",
      description="Lupy - Full Text Indexing and Search",
      author="Amir Bakhtiar",
      author_email="amir@divmod.org",
      url="http://www.divmod.org/",
      license="GNU LGPL",
      long_description="A full-text indexer compatible with Jakarta Lucene 1.2.",
      classifiers = filter(None, classifiers.split("\n")),
      packages=['lupy', 'lupy.index', 'lupy.search'])

