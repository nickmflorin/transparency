class FundResult(object):
	def __init__(self, result):
		self.id = int(result[0])
		self.name = str(result[1])
		self.code = str(result[2])
		self.short_name = str(result[3])
		return
		
class FundPositionResult(object):
	def __init__(self, result):
		self.id = int(result[0])
		self.RCGFundName = str(result[1])

		self.ManagerID = int(result[2])
		self.ManagerName = str(result[3])

		self.date = result[4]
		#self.BeginningAllocation = float(result[5])
		self.BeginningWeight = float(result[5])

		self.EndingAllocation = float(result[6])
		self.EndingWeight = float(result[7])

		self.TranType = str(result[8])
		return

