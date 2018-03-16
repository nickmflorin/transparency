import sys
sys.dont_write_bytecode = True

class Config:
	DSN = 'Transparency2'
	UID = 'Transparency'
	PWD = 'RCGTransparency'

class ReportingConfig:
	DSN = 'Transparency2'
	UID = 'Reporting'
	PWD = 'R0ckyReporting'

def connection_string():
	connection_string = 'DSN={};UID={};PWD={};'.format(Config.DSN, Config.UID, Config.PWD)
	return connection_string

def reporting_connection_string():
	connection_string = 'DSN={};UID={};PWD={};'.format(ReportingConfig.DSN, ReportingConfig.UID, ReportingConfig.PWD)
	return connection_string
