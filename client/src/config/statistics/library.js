import { ParentStatisticConfig, StatisticConfig } from './models'
import { ReturnStatsAccessor, Accessor, StrategyAccessor, RangeAccessor } from './accessors'

export const StatisticsLibrary = [
	StatisticConfig('name', 'Name', Accessor, 'name', 'string'),
	StatisticConfig('strategy', 'Strategy', StrategyAccessor, null, 'string'),
	StatisticConfig('range', 'Range', RangeAccessor, null, 'string'),
	
	ParentStatisticConfig('cumulative', 'Cumulative', [
        StatisticConfig('month_3', '3 Month', new ReturnStatsAccessor(3).cumulative),
        StatisticConfig('month_6', '6 Month', new ReturnStatsAccessor(6).cumulative),
        StatisticConfig('month_9', '9 Month', new ReturnStatsAccessor(9).cumulative),
        StatisticConfig('year_1', '1 Year', new ReturnStatsAccessor(12).cumulative),
        StatisticConfig('year_2', '2 Year', new ReturnStatsAccessor(24).cumulative),
        StatisticConfig('year_3', '3 Year', new ReturnStatsAccessor(36).cumulative),
        StatisticConfig('year_5', '5 Year', new ReturnStatsAccessor(60).cumulative),
    ]),

	ParentStatisticConfig('returns', 'Returns', [
	    StatisticConfig('average', 'Average', ReturnStatsAccessor, 'average'),
	    StatisticConfig('minimum', 'Min', ReturnStatsAccessor, 'minimum'),
	    StatisticConfig('maximum', 'Max', ReturnStatsAccessor, 'maximum'),
	    StatisticConfig('std_dev_annual', 'Annual Std. Dev.', ReturnStatsAccessor, 'std_dev_annual'),
	    StatisticConfig('var', 'VAR 95%', ReturnStatsAccessor, 'var'),
	    StatisticConfig('max_drawdown', 'Max DD', ReturnStatsAccessor, 'max_drawdown'),
	    StatisticConfig('extreme_shortfall', 'Ex. Shortfall', ReturnStatsAccessor, 'extreme_shortfall'),
	    StatisticConfig('skew', 'Skew', ReturnStatsAccessor, 'skew'),
	])
]