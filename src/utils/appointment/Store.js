import { insertLog } from '@/utils/appointment/Service'

export const Actions = {
  INSERT_LOG: 'logsInsertLog'
}

export default {
  actions: {
    [Actions.INSERT_LOG]: (_, logObj) => insertLog(logObj)
  }
}
