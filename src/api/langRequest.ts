import { Repository } from "../utils/types";

/**
 * Asynchronously fetches language data from the GitHub API based on the provided repository.
 * @async
 * @function fetchRepositories
 * @param {Repository} repository - The repository object for which languages are to be fetched.
 * @returns {Promise<{ [key: string]: number }>} - A promise that resolves with an object containing the languages used in the repository.
 * @throws {Error} - Throws an error if there is a problem with the API request or response.
 */
export const fetchLanguages = async (repository: Repository) => {
    try {
        const response = await fetch(`${repository.languages_url}`);
        const languages = await response.json();
        return languages;
    } catch (error: any) {
        throw new Error(error.message);
    }
}
