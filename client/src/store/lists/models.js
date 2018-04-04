import { Manager } from '../manager'
import _ from 'underscore'

// Doesnt Serve Much Purpose Now but May in Future
export class ManagerList {
    constructor(data){
        this.id = data.id 
        this.name = data.name 
        this.managers = data.managers.map(function(manager){
            return new Manager(manager)
        }) 
        this.createdAt = new Date(data.createdAt)
        this.user = data.user
        this.isNew = false
    }
    set_returns(returns){
        _.each(this.managers, function(manager){
            var rets = _.findWhere(returns, { id : manager.id })
            if(!rets){
                console.log('Warning: No Returns Specified for Manager',manager.id)
                manager.returns = {}
            }
            else{
                manager.returns = rets
            }
        })
    }
    static create_temp(user){
        var list = new ManagerList({ id : 'new', name : 'untitled', managers : [], createdAt : null, user : user})
        list.isNew = true 
        return list 
    }
}