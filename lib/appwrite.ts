import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from 'expo-web-browser';
import { Account, Avatars, Client, Databases, OAuthProvider, Query } from 'react-native-appwrite';
import { PropertyDocument } from './types';

// --- Environment Variables ---
const Endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const ProjectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const agentsTableId = process.env.EXPO_PUBLIC_APPWRITE_AGENTS_TABLE_ID;
const galleriesTableId = process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_TABLE_ID;
const reviewsTableId = process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_TABLE_ID;
const propertiesTableId = process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_TABLE_ID;

// Centralized configuration object for easy access
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

// --- Appwrite SDK Initialization ---
export const client = new Client();

client
    .setEndpoint(config.endpoint!)
    .setProject(config.projectId!)
    .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const database = new Databases(client);

/**
 * Handles Google OAuth2 Login flow
 * 1. Creates a redirect URI
 * 2. Opens a secure browser session for Google login
 * 3. Extracts userId and secret from the callback URL
 * 4. Creates a persistent session
 */
export async function login() {
    try {
        const redirectUri = Linking.createURL('/');

        const response = await account.createOAuth2Token(
            OAuthProvider.Google,
            redirectUri
        );

        if (!response) throw new Error('Login failed');

        // Open the browser session for the user to sign in
        const browserResult = await openAuthSessionAsync(
            response.toString(),
            redirectUri
        );

        if (browserResult.type !== 'success') throw new Error('Login failed');

        // Parse the URL to get the secret credentials returned by Appwrite
        const url = new URL(browserResult.url);
        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();

        if (!secret || !userId) throw new Error('Failed to Login');

        // Create the final session to keep the user logged in
        const session = await account.createSession(userId, secret);

        if (!session) throw new Error('Failed to create session');
        return true;

    } catch (error) {
        console.error("Login failed:", error);
        return false;
    }
}

/**
 * Logs the user out by deleting the current session
 */
export async function logout() {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error("Logout failed:", error);
        return false;
    }
}

/**
 * Retrieves the currently logged-in user profile
 * Also generates a dynamic avatar URL based on the user's initials
 */
export async function getCurrentUser() {
    try {
        const response = await account.get();
        if (!response.$id) return null;

        const name = encodeURIComponent(response.name || "U");

        // Construct the Appwrite Avatars API URL
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

/**
 * Fetches the 5 most recently added properties for the "Featured" section
 */
export async function getLatestProperties(): Promise<PropertyDocument[]> {
    try {
        const response = await database.listDocuments(
            config.databaseId!,
            config.propertiesTableId!,
            [Query.orderDesc('$createdAt'), Query.limit(5)]
        );
        return response.documents as unknown as PropertyDocument[];
    } catch (error) {
        console.error("Failed to get latest properties:", error);
        return [];
    }
}

/**
 * Fetches a list of properties with optional filtering and search functionality
 */
export async function getProperties ({ filter, query, limit }: {
    filter: string;
    query: string;
    limit?: number;
}): Promise<PropertyDocument[]> {
    try {
        const buildQuery = [Query.orderDesc('$createdAt')];

        // Apply category filter if one is selected
        if(filter && filter !== 'All') buildQuery.push(Query.equal('type', filter))
        
        // Apply text search across Name, Address, and Type
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
        return response.documents as unknown as PropertyDocument[];
    } catch (error) {
        console.error("Failed to get properties:", error);
        return [];
    }
}

/**
 * Fetches a single property and manually resolves its relationships
 * (Appwrite returns IDs for relationships, so we fetch the full documents here)
 */
export async function getPropertyById(id: string) {
    try {
        // 1. Fetch the main Property document
        const response = await database.getDocument(
            config.databaseId!,
            config.propertiesTableId!,
            id
        );
        
        try {
            // 2. Resolve Agent Relationship
            let agentDetails: any = null;
            if (response.agent) {
                agentDetails = await database.getDocument(
                    config.databaseId!,
                    config.agentsTableId!,
                    response.agent
                );
            }
            
            // 3. Resolve Gallery Relationship (Array of Image Documents)
            let galleryDetails: any[] = [];
            if (response.gallery && Array.isArray(response.gallery) && response.gallery.length > 0) {
                const galleryPromises = response.gallery.map(galleryId => 
                    database.getDocument(
                        config.databaseId!,
                        config.galleriesTableId!,
                        galleryId
                    )
                );
                galleryDetails = await Promise.all(galleryPromises);
            }
            
            // 4. Resolve Reviews Relationship (Array of Review Documents)
            let reviewDetails: any[] = [];
            if (response.reviews && Array.isArray(response.reviews) && response.reviews.length > 0) {
                const reviewPromises = response.reviews.map(reviewId => 
                    database.getDocument(
                        config.databaseId!,
                        config.reviewsTableId!,
                        reviewId
                    )
                );
                reviewDetails = await Promise.all(reviewPromises);
            }
            
            // 5. Merge all related data into a single object
            const propertyWithRelations = {
                ...response,
                agent: agentDetails,
                gallery: galleryDetails,
                reviews: reviewDetails,
            };
            
            return propertyWithRelations as unknown as PropertyDocument;
        } catch (relationError) {
            console.error("Error fetching related data:", relationError);
            // Fallback: return the document even if relations fail to load
            return response as unknown as PropertyDocument;
        }
    } catch (error) {
        console.error("Failed to get property by id:", error);
        return null;
    }
}
