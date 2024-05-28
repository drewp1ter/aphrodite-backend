export class WorkingTimeError extends Error {
  startTime?: string
  endTime?: string
  days?: string

  constructor(partial: Partial<WorkingTimeError>) {
    super(partial.message, { cause: partial.cause })
    this.name = WorkingTimeError.name
    this.startTime = partial.startTime
    this.endTime = partial.endTime
  }
}

export class WorkingDaysError extends Error {
  days?: string

  constructor(partial: Partial<WorkingDaysError>) {
    super(partial.message, { cause: partial.cause })
    this.name = WorkingDaysError.name
    this.days = partial.days
  }
}