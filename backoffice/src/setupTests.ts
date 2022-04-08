function buildMatcherResponse(pass: boolean, message: string) {
  return {
    pass,
    message: () => message,
  }
}

expect.extend({
  toBeAsExpectedResponse(
    receivedPayload,
    expectedStatus,
    expectedBody,
  ): jest.CustomMatcherResult {
    const isStatusMatches: boolean =
      receivedPayload.statusCode === expectedStatus

    if (!isStatusMatches) {
      return buildMatcherResponse(
        false,
        `Expected status ${expectedStatus}, but received ${receivedPayload.statusCode}`,
      )
    }

    const isBodyMatches: boolean =
      JSON.stringify(receivedPayload.body) === JSON.stringify(expectedBody)

    if (!isBodyMatches) {
      return buildMatcherResponse(
        false,
        `Expected body ${JSON.stringify(
          expectedBody,
        )}, but received ${JSON.stringify(receivedPayload.body)}`,
      )
    }

    return buildMatcherResponse(true, 'Ok')
  },
})
