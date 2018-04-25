class ExposureSettings:
	Tier1 = 'Tier 1 - Exposure'
	Tiers = {
		 'Economic Net Exposure':'net',
		 'Economic Gross Exposure':'gross',
		 '% Gross Exposure':'pct_gross',
		 'Economic Long Exposure':'long',
		 'Economic Short Exposure': 'short'
	}
	Categories = {
		'Asset Category' : 'asset',
		'Market Cap' : 'market_cap',
		'Sector' : 'sector',
		'Region' : 'region',
		'Strategy' : 'strategy',
		'Currency' : 'currency'
	}

	@staticmethod 
	def convert_tier(tier):
		return ExposureSettings.Tiers.get(tier, 'invalid')

	@staticmethod 
	def convert_category(category):
		# This Will Happen for Categories That We Do Not Want
		if not ExposureSettings.Categories.get(category):
			return 'invalid'

		return ExposureSettings.Categories[category]
