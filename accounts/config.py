AppLibrary = [
	{'id' : 'managers', 'path_name' : 'managers', 'label' : 'Managers', 'children' : [
		{'id' : 'perf', 'path_name' : 'perf', 'label' : 'Performance', 'children' : [
			{'id' : 'historical_perf', 'path_name' : 'hist', 'label' : 'Historical Performance'},
			{'id' : 'attribution_perf', 'path_name' : 'attr', 'label' : 'Performance Attribution'},
		]},
		{'id' : 'exp', 'path_name' : 'exp', 'label' : 'Exposures', 'children' : [
			{'id' : 'historical_exp', 'path_name' : 'hist', 'label' : 'Historical Exposure'},
			{'id' : 'snapshot_exp', 'path_name' : 'snap', 'label' : 'Snapshot Exposure'},
			{'id' : 'explorer_exp', 'path_name' : 'explore', 'label' : 'Exposure Explorer'},
		]},
		{'id' : 'pos', 'path_name' : 'pos', 'label' : 'Positions', 'children' : [
			{'id' : 'historical_pos', 'path_name' : 'hist', 'label' : 'Historical Positions'},
			{'id' : 'top_pos', 'path_name' : 'top', 'label' : 'Top Positions'},
			{'id' : 'proxy_pos', 'path_name' : 'proxy', 'label' : 'Proxy Positions'},
		]},
		{'id' : 'quant', 'path_name' : 'quant', 'label' : 'Quant'}
	]},
	{'id' : 'data', 'path_name' : 'data', 'label' : 'Data'},
	{'id' : 'analysis', 'path_name' : 'analysis', 'label' : 'Analysis', 'children' : [
		{'id' : 'mgrcomp', 'path_name' : 'mgrcomp', 'label' : 'Manager Comparison'},
		{'id' : 'dailymet', 'path_name' : 'dailymet', 'label' : 'Daily Metrics'},
		{'id' : 'dailyplat', 'path_name' : 'dailyplat', 'label' : 'Daily Platform'},
	]},
	{'id' : 'benchmarks', 'path_name' : 'benchmarks', 'label' : 'Benchmarks', 'children' : [
		{'id' : 'indices', 'path_name' : 'indices', 'label' : 'Indices'},
		{'id' : 'indscreen', 'path_name' : 'indscreen', 'label' : 'Index Screen'},
		{'id' : 'rcgind', 'path_name' : 'rcgind', 'label' : 'RCG Indices'},
	]},
	{'id' : 'alloc', 'path_name' : 'alloc', 'label' : 'Allocation', 'children' : [
		{'id' : 'aam', 'path_name' : 'aam', 'label' : 'AAM'},
		{'id' : 'aamdash', 'path_name' : 'aamdash', 'label' : 'AAM Dashboard'},
	]},
]
