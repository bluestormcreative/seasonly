export async function fetchData(input: RequestInfo, init: RequestInit) {
  const response = await fetch(input, init);
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json(); // We set up this JSON in our endpoint.
    const errorMsg = errorBody.error;
    throw Error(errorMsg);
  }
}
