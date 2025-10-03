module.exports = {

"[project]/.next-internal/server/app/api/session/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/@opentelemetry/api [external] (@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@opentelemetry/api", () => require("@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/firebase-admin [external] (firebase-admin, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("firebase-admin", () => require("firebase-admin"));

module.exports = mod;
}}),
"[externals]/next/dist/shared/lib/runtime-config.external.js [external] (next/dist/shared/lib/runtime-config.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/runtime-config.external.js", () => require("next/dist/shared/lib/runtime-config.external.js"));

module.exports = mod;
}}),
"[project]/src/lib/firebase-admin.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "auth": (()=>auth),
    "db": (()=>db)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/firebase-admin [external] (firebase-admin, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/config.js [app-route] (ecmascript)");
;
;
// Important: You must generate a service account key in the Firebase console,
// Base64-encode the entire JSON file, and set it as a single environment variable.
// DO NOT hardcode the service account key in your code.
// For local development, you can create a `.env` file with the variable.
function initializeAdminApp() {
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].apps.length > 0) {
        return __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].app();
    }
    const { serverRuntimeConfig } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const base64ServiceAccount = serverRuntimeConfig.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (!base64ServiceAccount) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 is not set in next.config.js. Please check your configuration.');
    }
    try {
        // Decode the Base64 string to get the JSON string
        const serviceAccountJson = Buffer.from(base64ServiceAccount, 'base64').toString('utf8');
        const serviceAccount = JSON.parse(serviceAccountJson);
        return __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].initializeApp({
            credential: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].credential.cert(serviceAccount)
        });
    } catch (error) {
        console.error('Firebase admin initialization error', error);
        // Throw a more descriptive error to help with debugging.
        throw new Error(`Firebase admin initialization failed: ${error.message}. Ensure FIREBASE_SERVICE_ACCOUNT_BASE64 is a valid Base64-encoded service account JSON.`);
    }
}
const adminApp = initializeAdminApp();
const db = adminApp.firestore();
const auth = adminApp.auth();
}}),
"[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("firebase-admin/firestore");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/lib/data.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
// @ts-nocheck
__turbopack_context__.s({
    "createUserInDb": (()=>createUserInDb),
    "deletePost": (()=>deletePost),
    "findUserByEmail": (()=>findUserByEmail),
    "getAuthorAndInstitution": (()=>getAuthorAndInstitution),
    "getBannerImageUrl": (()=>getBannerImageUrl),
    "getPostById": (()=>getPostById),
    "getPostsByAuthorId": (()=>getPostsByAuthorId),
    "getPostsForUser": (()=>getPostsForUser),
    "getUserById": (()=>getUserById),
    "updatePost": (()=>updatePost),
    "updateUser": (()=>updateUser)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase-admin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
const usersCollection = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('users');
const postsCollection = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('posts');
const appDataCollection = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection('app_data');
// Helper function to convert Firestore Timestamps to JS Dates
function convertTimestamps(obj) {
    if (!obj) return obj;
    if (Array.isArray(obj)) {
        return obj.map(convertTimestamps);
    }
    if (obj instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["Timestamp"]) {
        // When serializing for the client, toISOString() is a good, standard format.
        return obj.toDate().toISOString();
    }
    if (typeof obj === 'object') {
        const newObj = {};
        for(const key in obj){
            newObj[key] = convertTimestamps(obj[key]);
        }
        return newObj;
    }
    return obj;
}
// Uncached base function
const _getUserById = async (userId)=>{
    console.log(`data: getUserById called for ID: ${userId}`);
    const userDoc = await usersCollection.doc(userId).get();
    if (!userDoc.exists) {
        console.log(`data: No user found with ID: ${userId}`);
        return undefined;
    }
    const userData = {
        id: userDoc.id,
        ...userDoc.data()
    };
    // Convert timestamps for client-side usage
    return convertTimestamps(userData);
};
const getUserById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"])(_getUserById);
const getAuthorAndInstitution = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"])(async (authorId)=>{
    try {
        const userDoc = await usersCollection.doc(authorId).get();
        if (!userDoc.exists) return null;
        const authorData = {
            id: userDoc.id,
            ...userDoc.data()
        };
        const institutionId = authorData.institution?.institutionName;
        if (!institutionId) {
            console.warn(`User ${authorId} does not have an institutionId.`);
            return null;
        }
        return {
            authorData: convertTimestamps(authorData),
            institutionId
        };
    } catch (error) {
        console.error('Error fetching user and institution:', error);
        return null;
    }
});
const findUserByEmail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"])(async (email)=>{
    console.log(`data: findUserByEmail called for: ${email}`);
    const snapshot = await usersCollection.where('contact.email', '==', email).limit(1).get();
    if (snapshot.empty) {
        console.log(`data: No user found with email: ${email}`);
        return undefined;
    }
    const userDoc = snapshot.docs[0];
    const userData = {
        id: userDoc.id,
        ...userDoc.data()
    };
    console.log(`data: User found with ID: ${userDoc.id}`, userData);
    return convertTimestamps(userData);
});
async function joinAuthorToPosts(posts) {
    if (posts.length === 0) return [];
    const authorIds = [
        ...new Set(posts.map((p)=>p.authorId).filter(Boolean))
    ];
    if (authorIds.length === 0) {
        return convertTimestamps(posts);
    }
    const authorPromises = authorIds.map((id)=>getUserById(id));
    const authorResults = await Promise.all(authorPromises);
    const authors = authorResults.reduce((acc, author)=>{
        if (author) {
            acc[author.id] = author;
        }
        return acc;
    }, {});
    const joinedPosts = posts.map((post)=>({
            ...post,
            author: authors[post.authorId] || null
        })).filter((p)=>p.author !== null);
    // This is the critical fix: convert timestamps AFTER joining the author.
    return convertTimestamps(joinedPosts);
}
const getPostsForUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"])(async (user)=>{
    // Simple query that does not require a composite index
    let query = postsCollection.orderBy('timestamps.createdAt', 'desc').limit(50);
    const snapshot = await query.get();
    let allRecentPosts = snapshot.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }));
    let postsToDisplay = allRecentPosts;
    // If the user is logged in, filter the posts in code
    if (user) {
        // Filter posts from the user's institution
        if (user.institution?.institutionName) {
            postsToDisplay = allRecentPosts.filter((post)=>post.location?.institutionName === user.institution.institutionName);
        }
        // Exclude posts made by the current user from their own feed
        postsToDisplay = postsToDisplay.filter((post)=>post.authorId !== user.id);
    }
    const postsWithAuthors = await joinAuthorToPosts(postsToDisplay);
    return postsWithAuthors;
});
const getPostsByAuthorId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"])(async (authorId)=>{
    const snapshot = await postsCollection.where('authorId', '==', authorId).orderBy('timestamps.createdAt', 'desc').get();
    let posts = snapshot.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }));
    const postsWithAuthors = await joinAuthorToPosts(posts);
    return postsWithAuthors;
});
async function updatePost(postId, updates) {
    await postsCollection.doc(postId).update({
        ...updates,
        'timestamps.updatedAt': new Date()
    });
}
async function deletePost(postId) {
    await postsCollection.doc(postId).delete();
}
const _getPostById = async (postId)=>{
    const postDoc = await postsCollection.doc(postId).get();
    if (!postDoc.exists) {
        return null;
    }
    const postData = {
        id: postDoc.id,
        ...postDoc.data()
    };
    const postsWithAuthor = await joinAuthorToPosts([
        postData
    ]);
    return postsWithAuthor[0] || null; // Return null if author join fails
};
const getPostById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"])(_getPostById);
async function updateUser(userId, updates) {
    await usersCollection.doc(userId).update(updates);
    const updatedUser = await getUserById(userId);
    if (!updatedUser) {
        throw new Error('User not found after update');
    }
    return updatedUser;
}
async function createUserInDb(data) {
    console.log(`data: createUserInDb called for email: ${data.email}`);
    const newUserTemplate = {
        userProfile: {
            name: data.name,
            gender: 'prefer_not_to_say',
            photoURL: data.photoURL || null
        },
        contact: {
            email: data.email,
            phone: null,
            whatsapp: null,
            shareContact: true
        },
        location: {
            area: null,
            city: null,
            pinCode: null
        },
        institution: {
            institutionType: null,
            institutionName: null
        },
        subscription: {
            status: 'inactive',
            plan: null,
            startDate: null,
            expiry: null,
            postsViewed: 0
        }
    };
    console.log('data: Writing new user data to Firestore:', newUserTemplate);
    const docRef = await usersCollection.add(newUserTemplate);
    console.log(`data: New user document created with ID: ${docRef.id}`);
    const newUserDoc = await docRef.get();
    const result = {
        id: docRef.id,
        ...newUserDoc.data()
    };
    console.log('data: Returning new user object:', result);
    return convertTimestamps(result);
}
const getBannerImageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    try {
        const snapshot = await appDataCollection.limit(1).get();
        if (snapshot.empty) {
            console.log('data: No document found in app_data collection.');
            return null;
        }
        const doc = snapshot.docs[0];
        const data = doc.data();
        return data.banner_img || null;
    } catch (error) {
        console.error('Error fetching banner image URL:', error);
        return null;
    }
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/api/session/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
async function GET() {
    // The Next.js static analyzer expects `cookies()` to be awaited in this project.
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const userId = cookieStore.get('session_userId')?.value;
    if (!userId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            user: null
        });
    }
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUserById"])(userId);
        if (!user) {
            // If user not found, maybe the cookie is stale. Clear it.
            cookieStore.delete('session_userId');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                user: null
            });
        }
        // Ensure data is serializable
        const serializableUser = JSON.parse(JSON.stringify(user));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            user: serializableUser
        });
    } catch (error) {
        console.error('API session route error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            user: null
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__7b816774._.js.map