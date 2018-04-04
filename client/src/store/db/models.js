export class UserQuery {
    constructor(data){
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
    static create_temp(user){
        var query = new UserQuery({ id : 'new', name : 'untitled', sql : "", createdAt : null, user : user})
        query.isNew = true 
        return query 
    }
}

export class DatabaseTable {
    constructor(data){
        this.id = data.id 
        this.name = data.name 
        this.handle = data.handle 
        this.type = data.type
        this.db = data.db 
        this.lookup = this.db + '.' + this.handle + '.' + this.name
    }
}

export class Database {
    constructor(data){
        this.id = data.id 
        this.name = data.name 
        this.tables = data.tables.map( (table) => {
            return new DatabaseTable(table)
        })
    }
}

