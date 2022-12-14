export class searchUser {
    static search(value) {
        const endpoint = `https://api.github.com/users/${value}`

        return fetch(endpoint)
            .then(data => data.json())
            .then(({ login, name, public_repos, followers }) => ({
                login,
                name,
                public_repos,
                followers
            }))
    }
} 