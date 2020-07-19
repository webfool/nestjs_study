// import { configure } from 'log4js'
import {join} from 'path'

/**
 * todo:
 * - 确定日志存储目录
 */
const dirName = join(process.cwd(), 'logs')

export default {
  appenders: {
    // 打印所有日志
    console: {
      type: 'console'
    },
    app: {
      type: 'dateFile',
      filename: `${dirName}/app.log`,
      pattern: '.yyyy-MM-dd',
      keepFileExt: true,
      alwaysIncludePattern: true,

      layout: {
        type: 'pattern',
        pattern: '{"date": "%d{yyyy-MM-dd hh:mm:ss}", "category": "%c", "level": "%p", "info": "%m", "hostname": "%h", "processId": "%z"}'
      }
    },
    errors: {
      type: 'logLevelFilter',
      level: 'error',
      appender: 'errorFile'
    },
    errorFile: {
      type: 'dateFile',
      filename: `${dirName}/error.log`,
      pattern: '.yyyy-MM-dd',
      keepFileExt: true,
      alwaysIncludePattern: true,

      layout: {
        type: 'pattern',
        pattern: '{"date": "%d{yyyy-MM-dd hh:mm:ss}", "category": "%c", "level": "%p", "info": "%m", "hostname": "%h", "processId": "%z"}'
      }
    }
  },
  categories: {
    default: {level: 'all', appenders: ['console']},
    app: {level: 'debug', appenders: ['console', 'app', 'errors']}
  }
}