export class Manager {
    constructor(manager, peer = false, benchmark = false, selected = false){
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
    constructor(betas){
        this.manager = betas.manager 
        this.managers = betas.managers 
        this.groups = betas.groups 
        this.betas = betas.betas 
        this.range = betas.range 
    }
}
