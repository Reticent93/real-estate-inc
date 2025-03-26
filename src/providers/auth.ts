import {AuthProvider} from '@refinedev/core';

import {API_URL, dataProvider} from "./data";


//for demo purposes
export const authCredentials = {
    email: 'test@example.com',
    password: 'test123',
}


export const authProvider: AuthProvider = {
    login: async ({email}) => {

        try {
            const {data} = await dataProvider.custom({
                url: API_URL,
                method: "post",
                headers: {},
                meta: {
                    variables: {email},
                    query: `
            mutation Login($email: String!) {
              login(loginInput: { email: $email }) {
                accessToken
              }
            }
          `,
                },
            });

            localStorage.setItem('access_token', data.login.accessToken);
            return {
                success: true,
                redirectTo: '/',
            };
        } catch (e) {
            const error = e as Error;

            return {
                success: false,
                error: {
                    message: 'message' in error ? error.message : 'Login failed',
                    name: 'name' in error ? error.name : 'Invalid email or password',
                }
            }
        }
    },

    logout: async () => {
        localStorage.removeItem('access_token');

        return {
            success: true,
            redirectTo: '/'
        }
    },


    onError: async (error) => {
        if (error.statusCode === "UNAUTHENTICATED") {
            return {
                logout: true,
                ...error
            }
        }
        return {error}
    },

    check: async () => {
        try {
            await dataProvider.custom({
                url: API_URL,
                method: "post",
                headers: {},
                meta: {
                    rawQuery: `
                   query Me {
                        me {
                        name
                        }
                    }`,
                },
            });
            return {
                authenticated: true,
                redirectTo: '/',
            };
        } catch (e) {
            return {
                authenticated: false,
                redirectTo: '/'
            };
        }
    },


    getIdentity: async () => {
            const accessToken = localStorage.getItem('access_token');

            try {
                const {data} = await dataProvider.custom<{me: any}>({
                    url: API_URL,
                    method: "post",
                    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
                    meta: {
                        rawQuery: `
                           query Me {
                           me {
                           id
                           name
                           email
                           phone
                           jobTitle
                           timezone
                           avatarUrl
                           }
                         }`
                    },
                });
                return data.me
            } catch (e) {
                return undefined;
            }
    },

};


