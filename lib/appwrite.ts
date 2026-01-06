import { Account, Avatars, Client, OAuthProvider } from 'react-native-appwrite';
import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from 'expo-web-browser';


const Endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const ProjectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

export const config = {
    platform: 'com.dan.restate',
    endpoint: Endpoint,
    projectId: ProjectId,
}

export const client = new Client();

client
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setPlatform(config.platform!);

export const avatar = new Avatars(client);

export const account = new Account(client);


export async function login() {
    try {
        const redirectUri = Linking.createURL('/');

        const response = await account.createOAuth2Token(
            OAuthProvider.Google,
            redirectUri
        );

        if(!response) throw new Error('Login failed');

        const browserResult = await openAuthSessionAsync(
            response.toString(),
            redirectUri
        );

        if(browserResult.type !== 'success') throw new Error('Login failed');

        const url = new URL(browserResult.url);

        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();

        if(!secret || !userId) throw new Error('Failed to Login');

        const session = await account.createSession(secret, userId);

        if(!session) throw new Error('Failed to create session');
        return true;
    
    } catch (error) {
        console.error("Login failed:", error)
        return false;
    }
}


export async function logout() {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error("Logout failed:", error)
        return false;
    }
}


export async function getUser() {
    try {
        const response = await account.get();

        if(response.$id) {
            const userAvatar = avatar.getInitials(response.name);

            return {
                ...response,
                avatar: userAvatar.toString(),
            }
        }
    } catch (error) {
        console.error("Failed to get user:", error)
        return null;
    }
}
 