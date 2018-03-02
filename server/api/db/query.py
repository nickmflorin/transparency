import sys
sys.dont_write_bytecode = True

import time 
import datetime
from django.core.cache import cache
import pyodbc
import config

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
    conn = pyodbc.connect(connection_string)

    notification = query_notification(db = db, title = title)
    if notification and notify:
        print notification

    start = time.clock()
    curs = conn.cursor()
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

def queryRCGReporting(query, columns=None):
    connection_string = config.connection_string()
    conn = pyodbc.connect(connection_string)

    curs = conn.cursor()
    curs.execute(str(query))

    if columns:
        columns = []
        for h in curs.description:
            columns.append(str(h[0]))
        return {'results' : curs.fetchall(), 'columns' : columns}
    return curs.fetchall()




