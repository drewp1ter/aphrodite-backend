import winston, { Logger } from 'winston'
import chalk from 'chalk'
import { format, TransformableInfo } from 'logform'
import DailyRotateFile from 'winston-daily-rotate-file'
import PrettyError from 'pretty-error'
import { config } from '../../config'

export class LoggerService {
  private readonly logger: Logger
  private readonly prettyError: PrettyError
  private readonly context: string

  constructor(context: string) {
    this.context = context
    this.prettyError = new PrettyError()
    this.prettyError.skipNodeFiles()
    this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core')

    const transports: winston.transport[] = []
    
    if (!config.isTest) {
      transports.push(
        new DailyRotateFile({
          dirname: config.appLogDirectory,
          filename: 'app.%DATE%',
          extension: '.log',
          maxFiles: 14,
          zippedArchive: true,
          format: format.combine(
            format.timestamp(),
            format.align(),
            format.printf((info) => `${info.timestamp} ${info.level} ${info.context}: ${info.message}`)
          )
        })
      )
    }

    if (!config.isProduction) {
      transports.push(
        new winston.transports.Console({
          format: format.combine(format.align(), format.timestamp({ format: 'hh:mm:ss' }), format.printf(this.formatedLog))
        })
      )
    }

    this.logger = winston.createLogger({ level: 'info', transports })
  }

  log(message: string): void {
    this.logger.info(message, { context: this.context })
  }

  error(message: string, error?: any): void {
    this.logger.error(`${message} -> (${error?.stack ? JSON.stringify(error.stack) : ''})`, { context: this.context })
    if (error && !config.isProduction) this.prettyError.render(error, true)
  }

  warn(message: string): void {
    this.logger.warn(message, { context: this.context })
  }

  private formatedLog(info: TransformableInfo): string {
    switch (info.level) {
      case 'info':
        return `[${chalk.blue('INFO')}] ${chalk.dim.yellow.bold.underline(info.timestamp)} [${chalk.green(info.context)}] ${info.message}`
      case 'error':
        return `[${chalk.red('ERROR')}] ${chalk.dim.yellow.bold.underline(info.timestamp)} [${chalk.green(info.context)}] ${info.message}`
      case 'warn':
        return `[${chalk.yellow('WARN')}] ${chalk.dim.yellow.bold.underline(info.timestamp)} [${chalk.green(info.context)}] ${info.message}`
      default:
        return `[${chalk.grey(info.level)}] ${chalk.dim.yellow.bold.underline(info.timestamp)} [${chalk.green(info.context)}] ${info.message}`
    }
  }
}
