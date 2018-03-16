import sys
sys.dont_write_bytecode = True
from django.conf import settings

class ServerConfig:
	DRIVER = 'SQL SERVER'
	SERVER='10.13.0.25'
	UID='Transparency'
	PWD='RCGTransparency'
	TDS_Version='8.0'
	PORT='1433'

class Config:
	DSN = 'Transparency2'
	UID = 'Transparency'
	PWD = 'RCGTransparency'

class ReportingConfig:
	DSN = 'Transparency2'
	UID = 'Reporting'
	PWD = 'R0ckyReporting'

class ServerReportingConfig:
	DRIVER = 'SQL SERVER'
	SERVER='10.13.0.25'
	UID='Reporting'
	PWD='R0ckyReporting'
	TDS_Version='8.0'
	PORT='1433'

def connection_string():
	if not settings.SERVER:
		connection_string = 'DSN={};UID={};PWD={};'.format(Config.DSN, Config.UID, Config.PWD)
	else:
		connection_string = 'DRIVER={};SERVER={};UID={};PWD={};TDS_Version={};PORT={};'
		connection_string = connection_string.format(ServerConfig.DRIVER, ServerConfig.SERVER, ServerConfig.UID, ServerConfig.PWD, ServerConfig.TDS_Version, ServerConfig.PORT)
	return connection_string

def reporting_connection_string():
	if not settings.SERVER:
		connection_string = 'DSN={};UID={};PWD={};'.format(ReportingConfig.DSN, ReportingConfig.UID, ReportingConfig.PWD)
	else:
		connection_string = 'DRIVER={};SERVER={};UID={};PWD={};TDS_Version={};PORT={};'
		connection_string = connection_string.format(ServerReportingConfig.DRIVER, ServerReportingConfig.SERVER, ServerReportingConfig.UID, ServerReportingConfig.PWD, ServerReportingConfig.TDS_Version, ServerReportingConfig.PORT)
	return connection_string
