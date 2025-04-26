// @ts-nocheck

export const getErrorMessage = (error: Error) => {
  try {
    if (error?.response?.data?.err) {
      return error.response.data.err;
    }
  } catch {
    return 'Please check your data once';
  }

  return 'Please check your data once';
};
