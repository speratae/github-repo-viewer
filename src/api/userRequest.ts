export const fetchUser = async (username: string) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const user = await response.json();
      return user;
    } catch (error: any) { // ts checks the error type too
      throw new Error(error.message);
    }
};
  