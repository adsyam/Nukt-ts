//custom validation function for email and password
export const isValidEmail = (input: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailPattern.test(input)) {
    return false
  }
  return true
}

export const isValidPassword = (input: string) => {
  if (input.length < 8) {
    return false
  }
  return true
}