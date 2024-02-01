export const fetchRepositories = async (username: string) => {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repositories = await response.json();
        return repositories;
    } catch (error: any) {
        throw new Error(error.message);
    }
}