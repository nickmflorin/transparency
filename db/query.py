import sys
sys.dont_write_bytecode = True

import time 
import datetime
from django.core.cache import cache
import config

pyodbc = None
try:
    import pyodbc
except ImportError:
    print 'Warning: Cannot Import pyodbc... Access to SQL Database Not Available'

def query_notification(db = None, title = None):
    if not db and not title:
        return None 

    titleString = ""
    notification = 'Querying'
    if db:
        notification = notification + " " + db 
    if title:
        if db:
            notification = notification + " for " + title
        else:
            notification = notification + " " + title
    notification = notification + "..."
    return notification

def queryRCG(query, db = None, title = None, timer = True, notify = True, columns = None):
    connection_string = config.connection_string()
    if pyodbc:
        conn = pyodbc.connect(connection_string)
    else:
        print 'Warning: Access to SQL Database Not Available...'

    notification = query_notification(db = db, title = title)
    if notification and notify:
        print notification

    start = time.clock()
    curs = conn.cursor()
    if pyodbc:
        curs.execute(str(query))

        end = time.clock()
        if timer:
            print 'Query Took {} Seconds'.format(end - start)

        if columns:
            columns = []
            for h in curs.description:
                columns.append(str(h[0]))
            return {'results' : curs.fetchall(), 'columns' : columns}
        return curs.fetchall()
        
    if columns:
        return {'results' : [], 'columns' : []}
    return []

def queryRCGReporting(query, columns=None):
    connection_string = config.connection_string()
    if pyodbc:
        conn = pyodbc.connect(connection_string)

        curs = conn.cursor()
        curs.execute(str(query))

        if columns:
            columns = []
            for h in curs.description:
                columns.append(str(h[0]))
            return {'results' : curs.fetchall(), 'columns' : columns}
        return curs.fetchall()

    else:
        print 'Warning: Access to SQL Database Not Available...'
    
    if columns:
        return {'results' : [], 'columns' : []}
    return []




