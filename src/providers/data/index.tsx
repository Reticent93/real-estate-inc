import graphQlDataProvider, {createLiveProvider} from "@refinedev/graphql";
import {Client, fetchExchange} from "@urql/core";
import {createClient} from "graphql-ws";


//Refine base url
export const API_BASE_URL = "https://api.crm.refine.dev";

//Refine base url + graphQl which points to Apollo
export const API_URL = `${API_BASE_URL}/graphql`;

//Web Socket for real-time data
export const WS_URL = 'wss://api.crm.refine.dev/graphql'


//Create a new GraphQL client
export const client =new Client({url: API_URL, exchanges: [fetchExchange],
    fetchOptions: () =>{
    const accessToken = localStorage.getItem('access_token');
    return {
        headers: {
            Authorization: accessToken ? `Bearer ${accessToken}`: "",
            "Content-Type": "application/json",
            "Apollo-Require-Preflight": "true",
        },
    }
    }
});


//Create live provider client
export const wsClient = typeof window !== "undefined" ? createClient({
    url: WS_URL,
    connectionParams: () => {
        const accessToken = localStorage.getItem('access_token')

        return {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
    }
}) : undefined;


export const dataProvider = graphQlDataProvider(client);
export const liveProvider = wsClient ?createLiveProvider(wsClient) : undefined;