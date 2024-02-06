export type User = {
    name: string;
    login: string;
    bio: string;
    avatar_url: string;
}

export type Repository = {
    id: number;
    name: string;
    description: string;
    languages_url: string;
}
  
export type Language = {
    [language: string]: number; // index that is a string and a value that is a number
}

