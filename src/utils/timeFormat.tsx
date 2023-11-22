export const timeFormat = (publishedAt: string): string => {
  const dataContainer: Date = new Date(publishedAt)
  const currentDate: Date = new Date()
  const timeDifference: number = currentDate.getTime() - dataContainer.getTime() // getTime() returns the number of milliseconds since January 1, 1970

  const MILLISECONDS_IN_A_DAY: number = 24 * 60 * 60 * 1000
  const MILLISECONDS_IN_A_WEEK: number = 7 * MILLISECONDS_IN_A_DAY
  const MILLISECONDS_IN_A_MONTH: number = 30 * MILLISECONDS_IN_A_DAY
  const MILLISECONDS_IN_A_YEAR: number = 365 * MILLISECONDS_IN_A_DAY

  if (timeDifference < MILLISECONDS_IN_A_DAY) {
    return "Today"
  } else if (timeDifference < MILLISECONDS_IN_A_WEEK) {
    const daysAgo: number = Math.floor(timeDifference / MILLISECONDS_IN_A_DAY)
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`
  } else if (timeDifference < MILLISECONDS_IN_A_MONTH) {
    const weeksAgo: number = Math.floor(timeDifference / MILLISECONDS_IN_A_WEEK)
    return `${weeksAgo} week${weeksAgo > 1 ? "s" : ""} ago`
  } else if (timeDifference < MILLISECONDS_IN_A_YEAR) {
    const monthsAgo: number = Math.floor(
      timeDifference / MILLISECONDS_IN_A_MONTH
    )
    return `${monthsAgo} month${monthsAgo > 1 ? "s" : ""} ago`
  } else {
    const yearsAgo: number = Math.floor(timeDifference / MILLISECONDS_IN_A_YEAR)
    return `${yearsAgo} year${yearsAgo > 1 ? "s" : ""} ago`
  }
}
