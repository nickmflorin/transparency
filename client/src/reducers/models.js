import _ from 'underscore'

export class UserQuery {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.sql = data.sql
        this.createdAt = data.createdAt || new Date(data.createdAt)
        this.user = data.user
        this.isNew = false

        this.table = data.table || null;
        this.error = data.error || null;
        this.warning = data.warning || null;
        this.result = data.result || null;
    }
    static create_temp(user) {
        var query = new UserQuery({ id: 'new', name: 'untitled', sql: "", createdAt: null, user: user })
        query.isNew = true
        return query
    }
}

export class DatabaseTable {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.handle = data.handle
        this.type = data.type
        this.db = data.db
        this.lookup = this.db + '.' + this.handle + '.' + this.name
    }
}

export class Database {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.tables = data.tables.map((table) => {
            return new DatabaseTable(table)
        })
    }
}

export class Manager {
    constructor(manager, peer = false, benchmark = false, selected = false) {
        this.id = manager.id
        this.name = manager.name

        this.peers = manager.peers
        this.benchmarks = manager.benchmarks

        this.strategy = manager.strategy
        this.substrategy = manager.substrategy

        this.returns = manager.returns
        this.exposures = manager.exposures || []

        this.peer = peer;
        this.benchmark = benchmark;
        this.selected = selected;
        this.group = manager.group;
    }
}

export class ManagerBetas {
    constructor(betas) {
        this.manager = betas.manager
        this.managers = betas.managers
        this.groups = betas.groups
        this.betas = betas.betas
        this.range = betas.range
    }
}

// Doesnt Serve Much Purpose Now but May in Future
export class ManagerList {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.managers = data.managers.map(function(manager) {
            return new Manager(manager)
        })
        this.createdAt = new Date(data.createdAt)

        this.updatedAt = null;
        if (data.updatedAt) {
            this.updatedAt = new Date(data.updatedAt)
        }

        this.user = data.user
        this.isNew = false
    }
    set_returns(returns) {
        _.each(this.managers, function(manager) {
            var rets = _.findWhere(returns, { id: manager.id })
            if (!rets) {
                console.log('Warning: No Returns Specified for Manager', manager.id)
                manager.returns = {}
            } else {
                manager.returns = rets
            }
        })
    }
    static create_temp(user) {
        var list = new ManagerList({ id: 'new', name: 'untitled', managers: [], createdAt: null, user: user })
        list.isNew = true
        return list
    }
}