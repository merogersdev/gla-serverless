// API Gateway Response Generator
export const apiResponse = (
  statusCode: number,
  message: string,
  payload: unknown
) => {
  return {
    statusCode,
    body: JSON.stringify({
      message,
      payload,
    }),
  };
};
