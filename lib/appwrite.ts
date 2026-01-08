import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from 'expo-web-browser';
import { Account, Avatars, Client, Databases, OAuthProvider, Query } from 'react-native-appwrite';

const Endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const ProjectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const agentsTableId = process.env.EXPO_PUBLIC_APPWRITE_AGENTS_TABLE_ID;
const galleriesTableId = process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_TABLE_ID;
const reviewsTableId = process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_TABLE_ID;
const propertiesTableId = process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_TABLE_ID;


export const config = {
    platform: 'com.dan.restate',
    endpoint: Endpoint,
    projectId: ProjectId,
    databaseId: databaseId,
    agentsTableId: agentsTableId,
    galleriesTableId: galleriesTableId,
    reviewsTableId: reviewsTableId,
    propertiesTableId: propertiesTableId,
}

export const client = new Client();

client
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const database = new Databases(client);


export async function login() {
    try {
        const redirectUri = Linking.createURL('/');

        const response = await account.createOAuth2Token(
            OAuthProvider.Google,
            redirectUri
        );

        if (!response) throw new Error('Login failed');

        const browserResult = await openAuthSessionAsync(
            response.toString(),
            redirectUri
        );

        if (browserResult.type !== 'success') throw new Error('Login failed');

        const url = new URL(browserResult.url);
        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();

        if (!secret || !userId) throw new Error('Failed to Login');

        // FIXED: Argument order is (userId, secret)
        const session = await account.createSession(userId, secret);

        if (!session) throw new Error('Failed to create session');
        return true;

    } catch (error) {
        console.error("Login failed:", error);
        return false;
    }
}

export async function logout() {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error("Logout failed:", error);
        return false;
    }
}

export async function getCurrentUser() {
    try {
        const response = await account.get();
        if (!response.$id) return null;

        const name = encodeURIComponent(response.name || "U");

        const avatarUrl =
            `${config.endpoint}/avatars/initials` +
            `?name=${name}` +
            `&width=256&height=256&format=png` +
            `&project=${config.projectId}`;

        return {
            ...response,
            avatar: avatarUrl,
        };
    } catch {
        return null;
    }
}

export async function getLatestProperties() {
    try {
        const response = await database.listDocuments(
            config.databaseId!,
            config.propertiesTableId!,
            [Query.orderAsc('createdAt'), Query.limit(5)]
        );
        return response.documents;
    } catch (error) {
        console.error("Failed to get latest properties:", error);
        return [];
    }
}

export async function getProperties ({ filter, query, limit }: {
    filter: string;
    query: string;
    limit?: number;
}) {
    try {
        const buildQuery = [Query.orderDesc('$createdAt')];

        if(filter && filter !== 'All') buildQuery.push(Query.equal('type', filter))
        if(query) {
            buildQuery.push(
                Query.or([
                    Query.search('name', query), 
                    Query.search('address', query), 
                    Query.search('type', query)
                ])
            );
        }
        
        if(limit) buildQuery.push(Query.limit(limit));

        const response = await database.listDocuments(
            config.databaseId!,
            config.propertiesTableId!,
            buildQuery
        );
        return response.documents;
    } catch (error) {
        console.error("Failed to get properties:", error);
        return [];
    }
}

export async function getPropertyById(id: string) {
    try {
        const response = await database.getDocument(
            config.databaseId!,
            config.propertiesTableId!,
            id
        );
        return response;
    } catch (error) {
        console.error("Failed to get property by id:", error);
        return null;
    }
}
