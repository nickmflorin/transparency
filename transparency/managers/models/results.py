from config import ExposureSettings
import datetime 
import transparency.utility as utility

class ManagerPeerResult(dict):
	def __init__(self, row):
		super(ManagerPeerResult, self).__init__({})

		self['id'] = int(row[0])
		self['peer_id'] = int(row[1])
		return

class ManagerBenchmarkResult(dict):
	def __init__(self, row):
		super(ManagerBenchmarkResult, self).__init__({})

		self['id'] = int(row[0])
		self['benchmarks'] = []
		if row[1]:
			self['benchmarks'].append(int(row[1]))
		if row[2]:
			self['benchmarks'].append(int(row[2]))
		return

class ManagerReturnResult(dict):
	def __init__(self, row):
		super(ManagerReturnResult, self).__init__({})

		self['_id'] = int(row[0])
		self['value'] = 100.0 * float(row[1])

		year = int(row[2])
		month = int(row[3])
		date = utility.dates.last_day_of_month(month, year)

		# Need as Datetime for Mongo DB
		self['date'] = datetime.datetime.combine(date, datetime.datetime.min.time())
		return

class StrategyAssignmentResult(dict):
	def __init__(self, **kwargs):
		super(StrategyAssignmentResult, self).__init__({})

		self['id'] = kwargs.get('id')
		self['managerID'] = kwargs.get('managerID')
		if not self['id'] or not self['managerID']:
			raise Exception('ID and Manager ID Required')

	@staticmethod
	def from_result(result):
		if result[0] and result[1]:
			return StrategyAssignmentResult(id = int(result[1]), managerID = int(result[0]))
		return None

class StrategyResult(object):
	def __init__(self, row):
		self.id = int(row[0])
		self.name = str(row[1])
		self.code = str(row[2])
		
		# To Do: Turn These Into Related Fields Referencing Our Peers and Benchmarks
		self.hf_benchmarkId = None 
		if row[3]:
			self.hf_benchmarkId = int(row[3])
		
		self.market_benchmarkId = None 
		if row[4]:
			self.market_benchmarkId = int(row[4])
		return

class SubStrategyResult(object):
	def __init__(self, row):
		self.id = int(row[0])
		self.parent_id = int(row[1])
		self.name = str(row[2])
		return
		
class ManagerExposureResult(object):
	def __init__(self, row):
		super(ManagerExposureResult, self).__init__()

		self.auto_invalid = False
		self.id = int(row[0])

		self.date = row[1]
		self.date = utility.dates.last_day_of_month(self.date.month, self.date.year)
		self.date = datetime.datetime.combine(self.date, datetime.datetime.min.time())

		self.tier = ExposureSettings.convert_tier(str(row[3]))

		try:
			self.value = float(row[8])
		except TypeError:
			print 'Found Invalid Value {} in Exposure Result'.format(row[8])
			self.value = 0.0
			self.auto_invalid = True

		self.categories = {
			1 : str(row[4]),
			2 : str(row[5]),
			3 : str(row[6]),
			4 : str(row[7])
		}

		if self.categories[1]:
			self.categories[1] = ExposureSettings.convert_category(self.categories[1])
		
		self.level = 4
		if not self.categories[1]:
			self.level = 0
		elif not self.categories[3]:
			self.level = 1
			if not self.categories[2]:
				raise Exception('Found Corrupted Result Element...')
			
		return

	@property
	def valid(self):
		if self.tier != 'invalid' and self.categories[1] != 'invalid':
			if not self.auto_invalid:
				return True 
		return False 
