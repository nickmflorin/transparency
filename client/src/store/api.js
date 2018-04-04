import { dbApi } from './db'
import { listsApi } from './lists'
import { managerApi } from './manager'

export * from './auth'

export const Api = {
	db : dbApi,
	lists : listsApi,
	manager : managerApi,
}

export default Api;
