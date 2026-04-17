export const getErrorMessage = (error: any): string => {
  if (!error.response) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  const data = error.response.data;

  // Handle Zod validation errors (array of errors)
  if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    // Return the first error's message or a combined string
    return data.errors[0].message;
  }

  // Handle generic backend error messages
  if (data?.message) {
    return data.message;
  }

  return "An unexpected error occurred. Please try again.";
};
