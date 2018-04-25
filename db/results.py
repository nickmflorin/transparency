class DatabaseTableResult(object):
	def __init__(self, result):
		self.db = str(result[0])
		self.handle = str(result[1])

		self.name = str(result[2])
		self.id = str(result[2])

		self.type = str(result[3])
		return
