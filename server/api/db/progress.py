import sys
sys.dont_write_bytecode = True

class Progress(object):
    update_interval = 0.0002
    
    def __init__(self,title,length, update_interval=None):
        
        self.prev_block = 0.0
        self.current = 0
        
        if update_interval is not None:
            self.update_interval = update_interval
        
        self.title = title
        self.total = length
        
        self.output()
        return
    
    @property
    def percent(self):
        if self.total == 0:
            return 0.0
        
        return round(100.0 *float(self.current)/float(self.total),2)
    
    @property
    def percent_string(self):
        return str(self.percent) + ' %'
    
    def output(self):
        sys.stdout.write('\r')
        sys.stdout.flush()
        print(self.title + '... ' + self.percent_string),
        return
    
    def update(self):
        self.current += 1
        if self.percent - self.prev_block >= self.update_interval:
            self.output()
            self.prev_block = self.percent
            
        return