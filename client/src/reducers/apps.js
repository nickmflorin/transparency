import _ from 'underscore'

import faHome from '@fortawesome/fontawesome-free-solid/faHome'
import faCompress from '@fortawesome/fontawesome-free-solid/faCompress'
import faChartArea from '@fortawesome/fontawesome-free-solid/faChartArea'
import faDatabase from '@fortawesome/fontawesome-free-solid/faDatabase'

import faChartLine from '@fortawesome/fontawesome-free-solid/faChartLine'
import faChartPie from '@fortawesome/fontawesome-free-solid/faChartPie'
import faClipboard from '@fortawesome/fontawesome-free-regular/faClipboard'
import faBalanceScale from '@fortawesome/fontawesome-free-solid/faBalanceScale'

// Using Labels Specified by Django Models for Now
const AppConfigIcons = [
    {id : 'managers', icon : faHome},
    {id : 'data', icon : faDatabase},
    {id : 'analysis', icon : faChartArea},
    {id : 'benchmarks', icon : faCompress},
    {id : 'perf', icon : faChartLine},
    {id : 'exp', icon : faChartPie},
    {id : 'pos', icon : faClipboard},
    {id : 'quant', icon : faBalanceScale},
]

const MenuApps = [
    {id : 'managers', children : false},
    {id : 'data', children : true},
    {id : 'analysis', children : true},
    {id : 'benchmarks', children : true},
]

class AppLocation {
    constructor(app){
        this.menu = {
            enabled : false,
            dropdown : false,
        }
        this.sidebar = {
            enabled : false
        }
        var top = app;
        var continuum = [app]
        while(top !== undefined){
            top = top.parent 
            continuum.push(top)
        }
       
        continuum = _.filter(continuum, (cont) => cont !== undefined)
        var topApp = continuum[continuum.length - 1]

        if(_.findWhere(MenuApps, {id : topApp.id})){
            this.menu['enabled'] = true;
            if(_.findWhere(MenuApps, {id : topApp.id}).children && app.children && app.children.length != 0){
                this.menu['dropdown'] = true;
            }
        }
    }
}

class App {
    constructor(id, path, label, order, level, conf){
        this.id = id 
        this.path = path
        this.order = order 
        this.label = label 
        this.level = level 
        this.isParent = false;

        this.icon = _.findWhere(AppConfigIcons, { id : this.id })
        if(this.icon){
            this.icon = this.icon.icon 
        }
        this.children = (conf.children || []).map( (child) => {
            return new ChildApp(child, this)
        })
        if(this.children && this.children.length != 0){
            this.isParent = true;
            this.children.sort(function(a, b) {
              return a.order - b.order;
            })
        }
    }
} 

class TopLevelApp extends App {
    constructor(conf){
        var path = '/' + conf.path_name
        super(conf.id, path, conf.label, conf.order, conf.level, conf)
        this.location = new AppLocation(this)
    }
}

class ChildApp extends App{
    constructor(conf, parent){
        var path = parent.path + '/' + conf.path_name
        super(conf.id, path, conf.label, conf.order, conf.level, conf)
        this.parent = parent
    }
} 

function AppWrapper(user){
    var apps = user.apps.map((app) => {
        return new TopLevelApp(app)
    })
    apps.sort(function(a, b) {
      return a.order - b.order;
    })
    return apps 
}

export const apps = function(state) {
    if(state.auth.user){
        return AppWrapper(state.auth.user)
    }
    return []
}


