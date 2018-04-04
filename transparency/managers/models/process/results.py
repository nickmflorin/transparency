from settings import ExposureSettings
import datetime 
import transparency.utility as utility 

class ManagerPeerResult(dict):
	def __init__(self, row):
		super(ManagerPeerResult, self).__init__({})

		self['_id'] = int(row[0])
		self['peer_id'] = int(row[1])
		return

class ManagerBenchmarkResult(dict):
	def __init__(self, row):
		super(ManagerBenchmarkResult, self).__init__({})

		self['_id'] = int(row[0])
		self['benchmarks'] = []
		if row[1]:
			self['benchmarks'].append(int(row[1]))
		if row[2]:
			self['benchmarks'].append(int(row[2]))
		return

class PortfolioBenchmarkResult(object):
	def __init__(self, row):

		self.date = row[0]
		self.date = utility.dates.last_day_of_month(self.date.month, self.date.year)
		self.date = datetime.datetime.combine(self.date, datetime.datetime.min.time())

		self.id = int(row[1])
		self.name = str(row[2].encode('utf-8'))
		self.manager_id = int(row[3])
		self.addition = float(row[4])

		if row[5]:
			self.redemption = float(row[5])
		else:
			self.redemption = 0.0

class StrategyAssignmentResult(dict):
	def __init__(self, result):
		super(StrategyAssignmentResult, self).__init__({})

		self['_id'] = int(result[1])
		self['manager_id'] = int(result[0])
		if not self['_id'] or not self['manager_id']:
			raise Exception('ID and Manager ID Required')


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

class ManagerCategoryExposureResult(object):
	def __init__(self, row):
		super(ManagerCategoryExposureResult, self).__init__()

		self.auto_invalid = False
		self.id = int(row[0])

		self.date = row[1]
		self.date = utility.dates.last_day_of_month(self.date.month, self.date.year)
		self.date = datetime.datetime.combine(self.date, datetime.datetime.min.time())

		self.tier = ExposureSettings.convert_tier(str(row[2]))

		try:
			self.value = float(row[3])
		except TypeError:
			print 'Found Invalid Value {} in Exposure Result'.format(row[3])
			self.value = 0.0
			self.auto_invalid = True

		self.category = str(row[4].encode('utf-8'))
		if self.category:
			self.category = ExposureSettings.convert_category(self.category)

		if not row[5]:
			raise Exception('Should Not Have Missing Category Point Names')

		try:
			self.name_1 = str(row[5].encode('utf-8'))
		except UnicodeEncodeError:
			print 'Warning: Trouble Decoding Unicode Name for Manager {}'.format(self.id)
			self.auto_invalid = True 

		self.name_2 = None 
		if row[6]:
			try:
				self.name_2 = str(row[6].encode('utf-8'))
			except UnicodeEncodeError:
				print 'Warning: Trouble Decoding Unicode Name 2 for Manager {}'.format(self.id)
				self.auto_invalid = True 

		self.name_3 = None 
		if row[7]:
			try:
				self.name_3 = str(row[7].encode('utf-8'))
			except UnicodeEncodeError:
				print 'Warning: Trouble Decoding Unicode Name 3 for Manager {}'.format(self.id)
				self.auto_invalid = True

		self.name_4 = None
		if row[8]:
			try:
				self.name_4 = str(row[8].encode('utf-8'))
			except UnicodeEncodeError:
				print 'Warning: Trouble Decoding Unicode Name 4 for Manager {}'.format(self.id)
				self.auto_invalid = True 

		return

	@property
	def valid(self):
		if self.tier != 'invalid' and self.category != 'invalid':
			if not self.auto_invalid:
				return True 
		return False 

class ManagerExposureResult(object):
	def __init__(self, row):
		super(ManagerExposureResult, self).__init__()

		self.auto_invalid = False
		self.id = int(row[0])

		self.date = row[1]
		self.date = utility.dates.last_day_of_month(self.date.month, self.date.year)
		self.date = datetime.datetime.combine(self.date, datetime.datetime.min.time())

		self.tier = ExposureSettings.convert_tier(str(row[2]))

		try:
			self.value = float(row[3])
		except TypeError:
			print 'Found Invalid Value {} in Exposure Result'.format(row[3])
			self.value = 0.0
			self.auto_invalid = True
		return

	@property
	def valid(self):
		if self.tier != 'invalid':
			if not self.auto_invalid:
				return True 
		return False 

	