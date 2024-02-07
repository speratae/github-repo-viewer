/**
 * Asynchronously fetches repository data from the GitHub API based on the provided username.
 * @async
 * @function fetchRepositories
 * @param {string} username - The GitHub username for which repositories are to be fetched.
 * @returns {Promise<Repository[]>} - A promise that resolves with an array of Repository objects representing the user's repositories.
 * @throws {Error} - Throws an error if there is a problem with the API request or response.
 */
export const fetchRepositories = async (username: string) => {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repositories = await response.json();
        return repositories;
    } catch (error: any) {
        throw new Error(error.message);
    }
}