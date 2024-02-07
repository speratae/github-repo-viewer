/**
 * Asynchronously fetches user data from the GitHub API based on the provided username.
 * @async
 * @function fetchUser
 * @param {string} username - The GitHub username to fetch data for.
 * @returns {Promise<Object>} A promise that resolves with the user data retrieved from the API.
 * @throws {Error} If an error occurs during the fetch operation, an Error object with the error message is thrown.
 */
export const fetchUser = async (username: string) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const user = await response.json();
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
};
  