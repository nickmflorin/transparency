import faChartLine from '@fortawesome/fontawesome-free-solid/faChartLine'
import faChartPie from '@fortawesome/fontawesome-free-solid/faChartPie'
import faClipboard from '@fortawesome/fontawesome-free-solid/faClipboard'
import faBalanceScale from '@fortawesome/fontawesome-free-solid/faBalanceScale'

export const ManagerSidebarItems = [
    {'id' : 'perf', 'label' : 'Performance', 'link' : '/managers/perf', icon : faChartLine, children : [
    	{'id' : 'historical_perf', 'label' : 'Historical Returns', 'link' : '/managers/perf/hist'},
    	{'id' : 'attribution_perf', 'label' : 'Performance Attr', 'link' : '/managers/perf/attr'},
    ]},
    {'id' : 'exp', 'label' : 'Exposures', 'link' : '/managers/exp/hist', icon : faChartPie, children : [
    	{'id' : 'historical_exp', 'label' : 'Historical', 'link' : '/managers/exp/hist'},
    	{'id' : 'snapshot_exp', 'label' : 'Snapshot', 'link' : '/managers/exp/snap'},
    	{'id' : 'explorer_exp', 'label' : 'Explorer', 'link' : '/managers/exp/explore'},
    ]},
    {'id' : 'pos', 'label' : 'Positions', 'link' : '/managers/pos', icon : faClipboard, children : [
    	{'id' : 'historical_pos', 'label' : 'Historical', 'link' : '/managers/pos/hist'},
    	{'id' : 'top_pos', 'label' : 'Top', 'link' : '/managers/pos/top'},
    	{'id' : 'proxy_pos', 'label' : 'Proxy', 'link' : '/managers/pos/proxy'},
    ]},
    {'id' : 'quant', 'label' : 'Quantitative', 'link' : '/managers/quant', icon : faBalanceScale},
]
