(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/hooks/use-toast.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "reducer": (()=>reducer),
    "toast": (()=>toast),
    "useToast": (()=>useToast)
});
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST"
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case "DISMISS_TOAST":
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: "UPDATE_TOAST",
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: "DISMISS_TOAST",
            toastId: id
        });
    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(memoryState);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useToast.useEffect": ()=>{
            listeners.push(setState);
            return ({
                "useToast.useEffect": ()=>{
                    const index = listeners.indexOf(setState);
                    if (index > -1) {
                        listeners.splice(index, 1);
                    }
                }
            })["useToast.useEffect"];
        }
    }["useToast.useEffect"], [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: "DISMISS_TOAST",
                toastId
            })
    };
}
_s(useToast, "SPWE98mLGnlsnNfIwu/IAKTSZtk=");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "cn": (()=>cn),
    "formatCurrency": (()=>formatCurrency),
    "generateCatchyTitle": (()=>generateCatchyTitle)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInHours$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/differenceInHours.mjs [app-client] (ecmascript)");
;
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        currencyDisplay: 'symbol'
    }).format(amount);
}
function generateCatchyTitle(post) {
    if (!post.details?.restaurant || !post.order?.totalAmount) {
        return post.details?.title?.trim() || "Group Order";
    }
    const restaurant = post.details.restaurant;
    const remaining = Math.max(0, (post.order.totalAmount || 0) - (post.order.contributionAmount || 0));
    const deadlineHours = post.timestamps?.deadline ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInHours$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["differenceInHours"])(new Date(post.timestamps.deadline), new Date()) : null;
    // --- Phrase Pools ---
    const invitePhrases = [
        `Who\'s in for ${restaurant}?`,
        `Group order at ${restaurant}!`,
        `Let’s team up on ${restaurant}`,
        `Anyone up for ${restaurant}?`,
        `Craving ${restaurant}? Join in!`,
        `Don’t miss the ${restaurant} order!`,
        `Hop on this ${restaurant} deal`
    ];
    const dealPhrases = [];
    if (post.details.title && /free delivery/i.test(post.details.title)) {
        dealPhrases.push("Free Delivery 🚚");
    } else if (post.details.title && /₹\d+\s*off/i.test(post.details.title)) {
        const match = post.details.title.match(/₹\d+\s*off/i);
        if (match) dealPhrases.push(`${match[0].trim()} 🔥`);
    }
    if (remaining > 0) {
        dealPhrases.push(`₹${remaining} more needed!`);
        dealPhrases.push(`Still short by ₹${remaining}`);
        dealPhrases.push(`Only ₹${remaining} left to hit target`);
    } else {
        dealPhrases.push("Deal unlocked! 🎉");
        dealPhrases.push("Target met ✅");
    }
    const urgencyPhrases = [];
    if (deadlineHours !== null && deadlineHours > 0 && deadlineHours <= 6) {
        urgencyPhrases.push(`Ends in ${deadlineHours}h ⏳`);
        urgencyPhrases.push(`Hurry, ${deadlineHours}h left!`);
    } else if (deadlineHours !== null && deadlineHours <= 0) {
        urgencyPhrases.push("Closing now!");
        urgencyPhrases.push("Last call 🚨");
    }
    const extraFlair = [
        "🔥",
        "🍔",
        "🍟",
        "🚀",
        "💥",
        "✨",
        "Don’t miss it!",
        "Grab your spot!",
        "Limited slots!",
        ""
    ];
    // --- Random selection ---
    const invite = invitePhrases[Math.floor(Math.random() * invitePhrases.length)];
    const deal = dealPhrases[Math.floor(Math.random() * dealPhrases.length)];
    const urgency = urgencyPhrases.length > 0 ? urgencyPhrases[Math.floor(Math.random() * urgencyPhrases.length)] : "";
    const flair = extraFlair[Math.floor(Math.random() * extraFlair.length)];
    // --- Shuffle order of parts ---
    const parts = [
        invite,
        deal,
        urgency,
        flair
    ].filter(Boolean);
    const shuffled = parts.sort(()=>Math.random() - 0.5);
    let title = shuffled.join(" • ");
    // Limit length
    const maxLength = 100;
    if (title.length > maxLength) {
        title = title.substring(0, maxLength - 3) + "...";
    }
    return title;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/toast.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Toast": (()=>Toast),
    "ToastAction": (()=>ToastAction),
    "ToastClose": (()=>ToastClose),
    "ToastDescription": (()=>ToastDescription),
    "ToastProvider": (()=>ToastProvider),
    "ToastTitle": (()=>ToastTitle),
    "ToastViewport": (()=>ToastViewport)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
const ToastProvider = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"];
const ToastViewport = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, this));
_c1 = ToastViewport;
ToastViewport.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"].displayName;
const toastVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full", {
    variants: {
        variant: {
            default: "border bg-background text-foreground",
            destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Toast = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ className, variant, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(toastVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
});
_c3 = Toast;
Toast.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
const ToastAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, this));
_c5 = ToastAction;
ToastAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"].displayName;
const ToastClose = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600", className),
        "toast-close": "",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/toast.tsx",
            lineNumber: 86,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 77,
        columnNumber: 3
    }, this));
_c7 = ToastClose;
ToastClose.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"].displayName;
const ToastTitle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, this));
_c9 = ToastTitle;
ToastTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const ToastDescription = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm opacity-90", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 107,
        columnNumber: 3
    }, this));
_c11 = ToastDescription;
ToastDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "ToastViewport$React.forwardRef");
__turbopack_context__.k.register(_c1, "ToastViewport");
__turbopack_context__.k.register(_c2, "Toast$React.forwardRef");
__turbopack_context__.k.register(_c3, "Toast");
__turbopack_context__.k.register(_c4, "ToastAction$React.forwardRef");
__turbopack_context__.k.register(_c5, "ToastAction");
__turbopack_context__.k.register(_c6, "ToastClose$React.forwardRef");
__turbopack_context__.k.register(_c7, "ToastClose");
__turbopack_context__.k.register(_c8, "ToastTitle$React.forwardRef");
__turbopack_context__.k.register(_c9, "ToastTitle");
__turbopack_context__.k.register(_c10, "ToastDescription$React.forwardRef");
__turbopack_context__.k.register(_c11, "ToastDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/toaster.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Toaster": (()=>Toaster)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/toast.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function Toaster() {
    _s();
    const { toasts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastProvider"], {
        children: [
            toasts.map(function({ id, title, description, action, ...props }) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toast"], {
                    ...props,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-1",
                            children: [
                                title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastTitle"], {
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this),
                                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastDescription"], {
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 24,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 21,
                            columnNumber: 13
                        }, this),
                        action,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastClose"], {}, void 0, false, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 28,
                            columnNumber: 13
                        }, this)
                    ]
                }, id, true, {
                    fileName: "[project]/src/components/ui/toaster.tsx",
                    lineNumber: 20,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastViewport"], {}, void 0, false, {
                fileName: "[project]/src/components/ui/toaster.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/toaster.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_s(Toaster, "1YTCnXrq2qRowe0H/LBWLjtXoYc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = Toaster;
var _c;
__turbopack_context__.k.register(_c, "Toaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/data:1bf594 [app-client] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"60cc8ebb244f6fe1f1f1b3d8ee4bd944f52bd618c3":"updatePostViewCountAction"},"src/lib/actions.ts",""] */ __turbopack_context__.s({
    "updatePostViewCountAction": (()=>updatePostViewCountAction)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var updatePostViewCountAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("60cc8ebb244f6fe1f1f1b3d8ee4bd944f52bd618c3", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "updatePostViewCountAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcblxuXG5cbid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tICduZXh0L2NhY2hlJztcbmltcG9ydCB7IFBvc3QsIFVzZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7RmllbGRWYWx1ZSxUaW1lc3RhbXAsfSBmcm9tICdmaXJlYmFzZS1hZG1pbi9maXJlc3RvcmUnO1xuaW1wb3J0IHsgZGIgYXMgYWRtaW5EYiwgYXV0aCBhcyBhZG1pbkF1dGggfSBmcm9tICcuL2ZpcmViYXNlLWFkbWluJztcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tICduZXh0L2hlYWRlcnMnO1xuaW1wb3J0IHsgZmluZFVzZXJCeUVtYWlsLCBjcmVhdGVVc2VySW5EYiwgZ2V0QXV0aG9yQW5kSW5zdGl0dXRpb24sIGdldFBvc3RzQnlBdXRob3JJZCB9IGZyb20gJy4vZGF0YSc7XG5cbmZ1bmN0aW9uIGNvbnZlcnRGaXJlc3RvcmVUaW1lc3RhbXBUb0RhdGUodGltZXN0YW1wOiBhbnkpOiBEYXRlIHwgbnVsbCB7XG4gIGlmICghdGltZXN0YW1wKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKHR5cGVvZiB0aW1lc3RhbXAuc2Vjb25kcyA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHRpbWVzdGFtcC5uYW5vc2Vjb25kcyA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gbmV3IERhdGUodGltZXN0YW1wLnNlY29uZHMgKiAxMDAwICsgdGltZXN0YW1wLm5hbm9zZWNvbmRzIC8gMTAwMDAwMCk7XG4gIH1cbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRpbWVzdGFtcCk7XG4gIGlmICghaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSB7XG4gICAgcmV0dXJuIGRhdGU7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVQb3N0QWN0aW9uKHByZXZTdGF0ZTogYW55LCBmb3JtRGF0YTogRm9ybURhdGEpIHtcbiAgY29uc3QgYXV0aG9ySWQgPSBmb3JtRGF0YS5nZXQoJ2F1dGhvcklkJykgYXMgc3RyaW5nO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgYXV0aG9yUmVzdWx0ID0gYXdhaXQgZ2V0QXV0aG9yQW5kSW5zdGl0dXRpb24oYXV0aG9ySWQpO1xuICAgIGlmICghYXV0aG9yUmVzdWx0KSB7XG4gICAgICByZXR1cm4geyBtZXNzYWdlOiAnRXJyb3I6IENvdWxkIG5vdCBmaW5kIGF1dGhvciBvciBpbnN0aXR1dGlvbi4nIH07XG4gICAgfVxuXG4gICAgY29uc3QgeyBhdXRob3JEYXRhIH0gPSBhdXRob3JSZXN1bHQ7XG5cbiAgICBjb25zdCBkZWFkbGluZVN0ciA9IGZvcm1EYXRhLmdldCgndGltZXN0YW1wcy5kZWFkbGluZScpIGFzIHN0cmluZztcbiAgICBjb25zdCBkZWFkbGluZSA9IFRpbWVzdGFtcC5mcm9tRGF0ZShuZXcgRGF0ZShkZWFkbGluZVN0cikpO1xuXG4gICAgY29uc3QgbmV3UG9zdDogT21pdDxQb3N0LCAnaWQnIHwgJ2F1dGhvcic+ID0ge1xuICAgICAgYXV0aG9ySWQsXG4gICAgICBhdXRob3JJbmZvOiB7XG4gICAgICAgIGF1dGhvck5hbWU6IGF1dGhvckRhdGEudXNlclByb2ZpbGUubmFtZSxcbiAgICAgICAgZ2VuZGVyOiBhdXRob3JEYXRhLnVzZXJQcm9maWxlLmdlbmRlciB8fCAncHJlZmVyX25vdF90b19zYXknLFxuICAgICAgfSxcbiAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgdGl0bGU6IGZvcm1EYXRhLmdldCgnZGV0YWlscy50aXRsZScpIGFzIHN0cmluZyxcbiAgICAgICAgcmVzdGF1cmFudDogZm9ybURhdGEuZ2V0KCdkZXRhaWxzLnJlc3RhdXJhbnQnKSBhcyBzdHJpbmcsXG4gICAgICAgIG5vdGVzOiBmb3JtRGF0YS5nZXQoJ2RldGFpbHMubm90ZXMnKSBhcyBzdHJpbmcsXG4gICAgICB9LFxuICAgICAgb3JkZXI6IHtcbiAgICAgICAgdG90YWxBbW91bnQ6IHBhcnNlRmxvYXQoZm9ybURhdGEuZ2V0KCdvcmRlci50b3RhbEFtb3VudCcpIGFzIHN0cmluZyksXG4gICAgICAgIGNvbnRyaWJ1dGlvbkFtb3VudDogcGFyc2VGbG9hdChmb3JtRGF0YS5nZXQoJ29yZGVyLmNvbnRyaWJ1dGlvbkFtb3VudCcpIGFzIHN0cmluZyksXG4gICAgICB9LFxuICAgICAgdGltZXN0YW1wczoge1xuICAgICAgICBjcmVhdGVkQXQ6IEZpZWxkVmFsdWUuc2VydmVyVGltZXN0YW1wKCkgYXMgYW55LFxuICAgICAgICB1cGRhdGVkQXQ6IEZpZWxkVmFsdWUuc2VydmVyVGltZXN0YW1wKCkgYXMgYW55LFxuICAgICAgICBkZWFkbGluZTogZGVhZGxpbmUgYXMgYW55LFxuICAgICAgfSxcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIGluc3RpdHV0aW9uTmFtZTogYXV0aG9yRGF0YS5pbnN0aXR1dGlvbj8uaW5zdGl0dXRpb25OYW1lID8/IHVuZGVmaW5lZCxcbiAgICAgICAgYXJlYTogYXV0aG9yRGF0YS5sb2NhdGlvbj8uYXJlYSA/PyB1bmRlZmluZWQsXG4gICAgICAgIGNpdHk6IGF1dGhvckRhdGEubG9jYXRpb24/LmNpdHkgPz8gdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgYXdhaXQgYWRtaW5EYi5jb2xsZWN0aW9uKCdwb3N0cycpLmFkZChuZXdQb3N0KTtcbiAgICBcbiAgICByZXZhbGlkYXRlUGF0aCgnLycpO1xuICAgIHJldmFsaWRhdGVQYXRoKCcvbXktcG9zdHMnKTtcblxuICAgIHJldHVybiB7IG1lc3NhZ2U6ICdQb3N0IGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5IScgfTtcblxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNyZWF0aW5nIHBvc3Q6JywgZXJyb3IpO1xuICAgIHJldHVybiB7IG1lc3NhZ2U6IGBFcnJvciBjcmVhdGluZyBwb3N0OiAke2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InfWAgfTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlUG9zdEFjdGlvbihwb3N0SWQ6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGFkbWluRGIuY29sbGVjdGlvbigncG9zdHMnKS5kb2MocG9zdElkKS5kZWxldGUoKTtcbiAgICAgICAgcmV2YWxpZGF0ZVBhdGgoJy9teS1wb3N0cycpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBtZXNzYWdlOiAnUG9zdCBkZWxldGVkIHN1Y2Nlc3NmdWxseS4nIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZGVsZXRpbmcgcG9zdDonLCBlcnJvcik7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiAnRmFpbGVkIHRvIGRlbGV0ZSBwb3N0LicgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVQb3N0QWN0aW9uKHByZXZTdGF0ZTogYW55LCBmb3JtRGF0YTogRm9ybURhdGEpIHtcbiAgICBjb25zdCBwb3N0SWQgPSBmb3JtRGF0YS5nZXQoJ3Bvc3RJZCcpIGFzIHN0cmluZztcbiAgICBpZiAoIXBvc3RJZCkge1xuICAgICAgICByZXR1cm4geyBtZXNzYWdlOiAnRXJyb3I6IFBvc3QgSUQgaXMgbWlzc2luZy4nIH07XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGVhZGxpbmVTdHIgPSBmb3JtRGF0YS5nZXQoJ3RpbWVzdGFtcHMuZGVhZGxpbmUnKSBhcyBzdHJpbmc7XG4gICAgICAgIGNvbnN0IGRlYWRsaW5lID0gVGltZXN0YW1wLmZyb21EYXRlKG5ldyBEYXRlKGRlYWRsaW5lU3RyKSk7XG5cbiAgICAgICAgY29uc3QgdXBkYXRlcyA9IHtcbiAgICAgICAgICAgICdkZXRhaWxzLnRpdGxlJzogZm9ybURhdGEuZ2V0KCdkZXRhaWxzLnRpdGxlJykgYXMgc3RyaW5nLFxuICAgICAgICAgICAgJ2RldGFpbHMucmVzdGF1cmFudCc6IGZvcm1EYXRhLmdldCgnZGV0YWlscy5yZXN0YXVyYW50JykgYXMgc3RyaW5nLFxuICAgICAgICAgICAgJ2RldGFpbHMubm90ZXMnOiBmb3JtRGF0YS5nZXQoJ2RldGFpbHMubm90ZXMnKSBhcyBzdHJpbmcsXG4gICAgICAgICAgICAnb3JkZXIudG90YWxBbW91bnQnOiBwYXJzZUZsb2F0KGZvcm1EYXRhLmdldCgnb3JkZXIudG90YWxBbW91bnQnKSBhcyBzdHJpbmcpLFxuICAgICAgICAgICAgJ29yZGVyLmNvbnRyaWJ1dGlvbkFtb3VudCc6IHBhcnNlRmxvYXQoZm9ybURhdGEuZ2V0KCdvcmRlci5jb250cmlidXRpb25BbW91bnQnKSBhcyBzdHJpbmcpLFxuICAgICAgICAgICAgJ3RpbWVzdGFtcHMuZGVhZGxpbmUnOiBkZWFkbGluZSxcbiAgICAgICAgICAgICd0aW1lc3RhbXBzLnVwZGF0ZWRBdCc6IEZpZWxkVmFsdWUuc2VydmVyVGltZXN0YW1wKCksXG4gICAgICAgIH07XG5cbiAgICAgICAgYXdhaXQgYWRtaW5EYi5jb2xsZWN0aW9uKCdwb3N0cycpLmRvYyhwb3N0SWQpLnVwZGF0ZSh1cGRhdGVzKTtcblxuICAgICAgICByZXZhbGlkYXRlUGF0aCgnLycpO1xuICAgICAgICByZXZhbGlkYXRlUGF0aCgnL215LXBvc3RzJyk7XG4gICAgICAgIHJldmFsaWRhdGVQYXRoKGAvZWRpdC1wb3N0LyR7cG9zdElkfWApO1xuXG4gICAgICAgIHJldHVybiB7IG1lc3NhZ2U6ICdQb3N0IHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5IScgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciB1cGRhdGluZyBwb3N0ICR7cG9zdElkfTpgLCBlcnJvcik7XG4gICAgICAgIHJldHVybiB7IG1lc3NhZ2U6IGBFcnJvciB1cGRhdGluZyBwb3N0OiAke2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InfWAgfTtcbiAgICB9XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVByb2ZpbGVBY3Rpb24ocHJldlN0YXRlOiBhbnksIGZvcm1EYXRhOiBGb3JtRGF0YSkge1xuICAgIGNvbnN0IHVzZXJJZCA9IGZvcm1EYXRhLmdldCgnaWQnKSBhcyBzdHJpbmc7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIHsgbWVzc2FnZTogJ0Vycm9yOiBVc2VyIElEIGlzIG1pc3NpbmcuJyB9O1xuICAgIH1cblxuICAgIGNvbnN0IG9uZVdlZWsgPSA3ICogMjQgKiA2MCAqIDYwICogMTAwMDtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVzZXJSZWYgPSBhZG1pbkRiLmNvbGxlY3Rpb24oJ3VzZXJzJykuZG9jKHVzZXJJZCk7XG4gICAgICAgIGNvbnN0IHVzZXJEb2MgPSBhd2FpdCB1c2VyUmVmLmdldCgpO1xuICAgICAgICBpZiAoIXVzZXJEb2MuZXhpc3RzKSB7XG4gICAgICAgICAgICByZXR1cm4geyBtZXNzYWdlOiAnRXJyb3I6IFVzZXIgbm90IGZvdW5kLicgfTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY29uc3QgdXNlckRhdGEgPSB1c2VyRG9jLmRhdGEoKSBhcyBVc2VyO1xuICAgICAgICBjb25zdCBsYXN0VXBkYXRlU3RyID0gdXNlckRhdGEudXNlclByb2ZpbGU/Lmxhc3RQcm9maWxlVXBkYXRlO1xuICAgICAgICBcbiAgICAgICAgaWYgKGxhc3RVcGRhdGVTdHIpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RVcGRhdGUgPSBuZXcgRGF0ZShsYXN0VXBkYXRlU3RyKTtcbiAgICAgICAgICAgIGlmICgobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBsYXN0VXBkYXRlLmdldFRpbWUoKSkgPCBvbmVXZWVrKSB7XG4gICAgICAgICAgICAgICAgIHJldHVybiB7IG1lc3NhZ2U6ICdQcm9maWxlIGNhbiBvbmx5IGJlIHVwZGF0ZWQgb25jZSBhIHdlZWsuJyB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCB1cGRhdGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgICAgICAgJ3VzZXJQcm9maWxlLm5hbWUnOiBmb3JtRGF0YS5nZXQoJ25hbWUnKSxcbiAgICAgICAgICAgICd1c2VyUHJvZmlsZS5sYXN0UHJvZmlsZVVwZGF0ZSc6IEZpZWxkVmFsdWUuc2VydmVyVGltZXN0YW1wKCksXG4gICAgICAgICAgICAnY29udGFjdC5waG9uZSc6IGZvcm1EYXRhLmdldCgnY29udGFjdE51bWJlcicpLFxuICAgICAgICAgICAgJ2NvbnRhY3Quc2hhcmVDb250YWN0JzogZm9ybURhdGEuZ2V0KCdzaGFyZUNvbnRhY3QnKSA9PT0gJ29uJyxcbiAgICAgICAgICAgICdpbnN0aXR1dGlvbi5pbnN0aXR1dGlvblR5cGUnOiBmb3JtRGF0YS5nZXQoJ2luc3RpdHV0aW9uVHlwZScpLFxuICAgICAgICAgICAgJ2luc3RpdHV0aW9uLmluc3RpdHV0aW9uTmFtZSc6IGZvcm1EYXRhLmdldCgnaW5zdGl0dXRpb25OYW1lJyksXG4gICAgICAgICAgICAnbG9jYXRpb24uYXJlYSc6IGZvcm1EYXRhLmdldCgnYXJlYScpLFxuICAgICAgICAgICAgJ2xvY2F0aW9uLmNpdHknOiBmb3JtRGF0YS5nZXQoJ2NpdHknKSxcbiAgICAgICAgICAgICdsb2NhdGlvbi5waW5Db2RlJzogZm9ybURhdGEuZ2V0KCdwaW5Db2RlJyksXG4gICAgICAgIH07XG5cbiAgICAgICAgYXdhaXQgdXNlclJlZi51cGRhdGUodXBkYXRlcyk7XG4gICAgICAgIFxuICAgICAgICByZXZhbGlkYXRlUGF0aCgnL3Byb2ZpbGUnKTtcbiAgICAgICAgcmV2YWxpZGF0ZVBhdGgoJy8nKTtcblxuICAgICAgICByZXR1cm4geyBtZXNzYWdlOiAnUHJvZmlsZSB1cGRhdGVkIHN1Y2Nlc3NmdWxseSEnIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgdXBkYXRpbmcgcHJvZmlsZTonLCBlcnJvcik7XG4gICAgICAgIHJldHVybiB7IG1lc3NhZ2U6IGBFcnJvciB1cGRhdGluZyBwcm9maWxlOiAke2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InfWAgfTtcbiAgICB9XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlYWN0aXZhdGVTaW5nbGVQb3N0UGFzc0FjdGlvbih1c2VySWQ6IHN0cmluZykge1xuICB0cnkge1xuICAgIGNvbnN0IHVzZXJSZWYgPSBhZG1pbkRiLmNvbGxlY3Rpb24oJ3VzZXJzJykuZG9jKHVzZXJJZCk7XG4gICAgY29uc3QgdXNlckRvYyA9IGF3YWl0IHVzZXJSZWYuZ2V0KCk7XG5cbiAgICBpZiAoIXVzZXJEb2MuZXhpc3RzKSB7XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kLicgfTtcbiAgICB9XG5cbiAgICBjb25zdCB1c2VyID0gdXNlckRvYy5kYXRhKCkgYXMgVXNlcjtcblxuICAgIGlmICh1c2VyLnN1YnNjcmlwdGlvbj8ucGxhbiA9PT0gJ3NpbmdsZS1wb3N0JyAmJiB1c2VyLnN1YnNjcmlwdGlvbj8uc3RhdHVzID09PSAnYWN0aXZlJykge1xuICAgICAgYXdhaXQgdXNlclJlZi51cGRhdGUoe1xuICAgICAgICAnc3Vic2NyaXB0aW9uLnN0YXR1cyc6ICdpbmFjdGl2ZScsXG4gICAgICAgICdzdWJzY3JpcHRpb24ucG9zdHNWaWV3ZWQnOiAxLCBcbiAgICAgIH0pO1xuXG4gICAgICByZXZhbGlkYXRlUGF0aCgnLycpOyBcblxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogJ1NpbmdsZS1wb3N0IHBhc3MgdXNlZCBhbmQgZGVhY3RpdmF0ZWQuJyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgbWVzc2FnZTogJ05vIGFjdGl2ZSBzaW5nbGUtcG9zdCBwYXNzIHRvIGRlYWN0aXZhdGUuJyB9O1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkZWFjdGl2YXRpbmcgc2luZ2xlLXBvc3QgcGFzczonLCBlcnJvcik7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICdBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkLicgfTtcbiAgfVxufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB2ZXJpZnlBbmRTaWduSW5BY3Rpb24oaWRUb2tlbjogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGVjb2RlZFRva2VuID0gYXdhaXQgYWRtaW5BdXRoLnZlcmlmeUlkVG9rZW4oaWRUb2tlbik7XG4gICAgY29uc3QgdWlkID0gZGVjb2RlZFRva2VuLnVpZDtcbiAgICBjb25zdCBlbWFpbCA9IGRlY29kZWRUb2tlbi5lbWFpbDtcblxuICAgIGlmICghZW1haWwpIHtcbiAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiAnRW1haWwgbm90IGZvdW5kIGluIHRva2VuLicgfTtcbiAgICB9XG5cbiAgICBsZXQgdXNlciA9IGF3YWl0IGZpbmRVc2VyQnlFbWFpbChlbWFpbCk7XG5cbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIGNvbnN0IG5ld1VzZXIgPSB7XG4gICAgICAgIG5hbWU6IGRlY29kZWRUb2tlbi5uYW1lIHx8ICdOZXcgVXNlcicsXG4gICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgcGhvdG9VUkw6IGRlY29kZWRUb2tlbi5waWN0dXJlIHx8IG51bGwsXG4gICAgICB9O1xuICAgICAgdXNlciA9IGF3YWl0IGNyZWF0ZVVzZXJJbkRiKG5ld1VzZXIpO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBjb29raWVTdG9yZSA9IGF3YWl0IGNvb2tpZXMoKTtcbiAgICBjb29raWVTdG9yZS5zZXQoJ3Nlc3Npb25fdXNlcklkJywgdXNlci5pZCwgeyBodHRwT25seTogdHJ1ZSwgc2VjdXJlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nIH0pO1xuXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgdXNlciB9O1xuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0F1dGhlbnRpY2F0aW9uIGZhaWxlZC4nIH07XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ291dEFjdGlvbigpIHtcbiAgICBjb25zdCBjb29raWVTdG9yZSA9IGF3YWl0IGNvb2tpZXMoKTtcbiAgICBjb29raWVTdG9yZS5kZWxldGUoJ3Nlc3Npb25fdXNlcklkJyk7XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN1YnNjcmliZUFjdGlvbihwbGFuSWQ6ICdzaW5nbGUtcG9zdCcgfCAnZGFpbHknIHwgJ3dlZWtseScgfCAnbW9udGhseScsIHVzZXJJZDogc3RyaW5nKSB7XG4gIGlmICghdXNlcklkKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZC4nIH07XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IHVzZXJSZWYgPSBhZG1pbkRiLmNvbGxlY3Rpb24oJ3VzZXJzJykuZG9jKHVzZXJJZCk7XG5cbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGxldCBleHBpcnkgPSBuZXcgRGF0ZShub3cpO1xuXG4gICAgc3dpdGNoIChwbGFuSWQpIHtcbiAgICAgIGNhc2UgJ2RhaWx5JzpcbiAgICAgICAgZXhwaXJ5LnNldERhdGUobm93LmdldERhdGUoKSArIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3dlZWtseSc6XG4gICAgICAgIGV4cGlyeS5zZXREYXRlKG5vdy5nZXREYXRlKCkgKyA3KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb250aGx5JzpcbiAgICAgICAgZXhwaXJ5LnNldE1vbnRoKG5vdy5nZXRNb250aCgpICsgMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2luZ2xlLXBvc3QnOlxuICAgICAgICBleHBpcnkuc2V0RnVsbFllYXIobm93LmdldEZ1bGxZZWFyKCkgKyAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbkRhdGE6IFVzZXJbJ3N1YnNjcmlwdGlvbiddID0ge1xuICAgICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICAgIHBsYW46IHBsYW5JZCxcbiAgICAgIHN0YXJ0RGF0ZTogVGltZXN0YW1wLmZyb21EYXRlKG5vdykgYXMgYW55LFxuICAgICAgZXhwaXJ5OiBUaW1lc3RhbXAuZnJvbURhdGUoZXhwaXJ5KSBhcyBhbnksXG4gICAgICBwb3N0c1ZpZXdlZDogMCxcbiAgICB9O1xuICAgIFxuICAgIGF3YWl0IHVzZXJSZWYudXBkYXRlKHtcbiAgICAgICAgJ3N1YnNjcmlwdGlvbic6IHN1YnNjcmlwdGlvbkRhdGFcbiAgICB9KTtcblxuICAgIHJldmFsaWRhdGVQYXRoKCcvcHJpY2luZycpO1xuICAgIHJldmFsaWRhdGVQYXRoKCcvcHJvZmlsZScpO1xuICAgIHJldmFsaWRhdGVQYXRoKCcvJyk7XG5cbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG4gIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICBjb25zb2xlLmVycm9yKCdTdWJzY3JpcHRpb24gRXJyb3I6JywgZXJyb3IpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkLicgfTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3VibWl0RmVlZGJhY2tBY3Rpb24ocHJldlN0YXRlOiBhbnksIGZvcm1EYXRhOiBGb3JtRGF0YSkge1xuICAgIGNvbnN0IGVtYWlsID0gZm9ybURhdGEuZ2V0KCdlbWFpbCcpIGFzIHN0cmluZztcbiAgICBjb25zdCBmZWVkYmFjayA9IGZvcm1EYXRhLmdldCgnZmVlZGJhY2snKSBhcyBzdHJpbmc7XG5cbiAgICBpZiAoIWZlZWRiYWNrKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiAnRmVlZGJhY2sgY2Fubm90IGJlIGVtcHR5LicgfTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgICBhd2FpdCBhZG1pbkRiLmNvbGxlY3Rpb24oJ2ZlZWRiYWNrJykuYWRkKHtcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbCB8fCAnYW5vbnltb3VzJyxcbiAgICAgICAgICAgIGZlZWRiYWNrOiBmZWVkYmFjayxcbiAgICAgICAgICAgIHN1Ym1pdHRlZEF0OiBGaWVsZFZhbHVlLnNlcnZlclRpbWVzdGFtcCgpLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogJ1lvdXIgZmVlZGJhY2sgaGFzIGJlZW4gc3VibWl0dGVkLicgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGZWVkYmFjayBzdWJtaXNzaW9uIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICdTb21ldGhpbmcgd2VudCB3cm9uZy4gUGxlYXNlIHRyeSBhZ2Fpbi4nIH07XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUG9zdFZpZXdDb3VudEFjdGlvbih1c2VySWQ6IHN0cmluZywgY291bnQ6IG51bWJlcikge1xuICAgIGlmICghdXNlcklkIHx8IGNvdW50ID09PSAwKSByZXR1cm47XG5cbiAgICBjb25zdCB1c2VyUmVmID0gYWRtaW5EYi5jb2xsZWN0aW9uKCd1c2VycycpLmRvYyh1c2VySWQpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdXNlckRvYyA9IGF3YWl0IHVzZXJSZWYuZ2V0KCk7XG4gICAgICAgIGlmICh1c2VyRG9jLmV4aXN0cykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudENvdW50ID0gdXNlckRvYy5kYXRhKCk/LnN1YnNjcmlwdGlvbj8ucG9zdHNWaWV3ZWQgfHwgMDtcbiAgICAgICAgICAgIGF3YWl0IHVzZXJSZWYudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAnc3Vic2NyaXB0aW9uLnBvc3RzVmlld2VkJzogY3VycmVudENvdW50ICsgY291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHVwZGF0ZSB2aWV3IGNvdW50IGZvciB1c2VyICR7dXNlcklkfTpgLCBlcnJvcik7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TXlQb3N0c0FjdGlvbih1c2VySWQ6IHN0cmluZykge1xuICBpZiAoIXVzZXJJZCkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQuJywgcG9zdHM6IFtdIH07XG4gIH1cbiAgdHJ5IHtcbiAgICBjb25zdCBwb3N0cyA9IGF3YWl0IGdldFBvc3RzQnlBdXRob3JJZCh1c2VySWQpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIHBvc3RzOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHBvc3RzKSkgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyBteSBwb3N0czonLCBlcnJvcik7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICdGYWlsZWQgdG8gZmV0Y2ggcG9zdHMuJywgcG9zdHM6IFtdIH07XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoicVNBd1RzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/providers.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AuthProvider": (()=>AuthProvider),
    "PostViewContext": (()=>PostViewContext),
    "Providers": (()=>Providers),
    "useAuth": (()=>useAuth)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$3a$1bf594__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/data:1bf594 [app-client] (ecmascript) <text/javascript>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    user: null
});
const PostViewContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    trackViewedPost: ()=>{}
});
function PostViewProvider({ children }) {
    _s();
    const { user } = useAuth();
    const viewedPostIdsInSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    const trackViewedPost = (postId)=>{
        viewedPostIdsInSession.current.add(postId);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PostViewProvider.useEffect": ()=>{
            const handleVisibilityChange = {
                "PostViewProvider.useEffect.handleVisibilityChange": ()=>{
                    if (document.visibilityState === 'hidden' && viewedPostIdsInSession.current.size > 0) {
                        if (user?.id) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$3a$1bf594__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["updatePostViewCountAction"])(user.id, viewedPostIdsInSession.current.size);
                            viewedPostIdsInSession.current.clear(); // Reset after sending
                        }
                    }
                }
            }["PostViewProvider.useEffect.handleVisibilityChange"];
            document.addEventListener('visibilitychange', handleVisibilityChange);
            return ({
                "PostViewProvider.useEffect": ()=>{
                    document.removeEventListener('visibilitychange', handleVisibilityChange);
                    // Fallback: try to update when the component unmounts
                    if (viewedPostIdsInSession.current.size > 0 && user?.id) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$3a$1bf594__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["updatePostViewCountAction"])(user.id, viewedPostIdsInSession.current.size);
                    }
                }
            })["PostViewProvider.useEffect"];
        }
    }["PostViewProvider.useEffect"], [
        user
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PostViewContext.Provider, {
        value: {
            trackViewedPost
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/providers.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_s(PostViewProvider, "XXJiigEzYoJ+uqFk/26/IVHp8VQ=", false, function() {
    return [
        useAuth
    ];
});
_c = PostViewProvider;
function AuthProvider({ children, initialUser }) {
    _s1();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "AuthProvider.useState": ()=>{
            // On server, always start with initialUser to avoid mismatch
            if ("TURBOPACK compile-time falsy", 0) {
                "TURBOPACK unreachable";
            }
            // On client, try to load from cache
            try {
                const cachedUser = localStorage.getItem('cachedUser');
                return cachedUser ? JSON.parse(cachedUser) : initialUser;
            } catch (error) {
                console.error('Failed to load cached user', error);
                return initialUser;
            }
        }
    }["AuthProvider.useState"]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true); // Start with loading=true on client
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // If we have an initial user from server, update cache
            if (initialUser) {
                try {
                    localStorage.setItem('cachedUser', JSON.stringify(initialUser));
                } catch (error) {
                    console.error('Failed to cache initial user', error);
                }
                if (JSON.stringify(user) !== JSON.stringify(initialUser)) {
                    setUser(initialUser);
                }
                setLoading(false);
                return;
            }
            // If no initial user, this might be a client-side navigation or first load with no session.
            let isMounted = true;
            async function fetchSession() {
                try {
                    const response = await fetch('/api/session');
                    if (response.ok) {
                        const session = await response.json();
                        const fetchedUser = session.user || null;
                        if (isMounted) {
                            setUser(fetchedUser);
                            if (fetchedUser) {
                                localStorage.setItem('cachedUser', JSON.stringify(fetchedUser));
                            } else {
                                localStorage.removeItem('cachedUser');
                            }
                        }
                    } else {
                        if (isMounted) {
                            setUser(null);
                            localStorage.removeItem('cachedUser');
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch session:', error);
                    if (isMounted) {
                        setUser(null);
                        localStorage.removeItem('cachedUser');
                    }
                } finally{
                    if (isMounted) setLoading(false);
                }
            }
            fetchSession();
            return ({
                "AuthProvider.useEffect": ()=>{
                    isMounted = false;
                }
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        initialUser
    ]);
    // This effect ensures client-side loading state is handled correctly.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                setLoading(false);
            }
        }
    }["AuthProvider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user
        },
        children: loading ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PostViewProvider, {
            children: children
        }, void 0, false, {
            fileName: "[project]/src/providers.tsx",
            lineNumber: 141,
            columnNumber: 25
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/providers.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
_s1(AuthProvider, "YyNfCwy017Ep7TKb7BfgbitZau4=");
_c1 = AuthProvider;
function useAuth() {
    _s2();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s2(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function Providers({ children, initialUser }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthProvider, {
        initialUser: initialUser,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/providers.tsx",
        lineNumber: 155,
        columnNumber: 10
    }, this);
}
_c2 = Providers;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "PostViewProvider");
__turbopack_context__.k.register(_c1, "AuthProvider");
__turbopack_context__.k.register(_c2, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/button.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Button": (()=>Button),
    "buttonVariants": (()=>buttonVariants)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 46,
        columnNumber: 7
    }, this);
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/data:52735f [app-client] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"004d49033eb565a117b1d8b30854d8c4f35e240335":"logoutAction"},"src/lib/actions.ts",""] */ __turbopack_context__.s({
    "logoutAction": (()=>logoutAction)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var logoutAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("004d49033eb565a117b1d8b30854d8c4f35e240335", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "logoutAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcblxuXG5cbid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tICduZXh0L2NhY2hlJztcbmltcG9ydCB7IFBvc3QsIFVzZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7RmllbGRWYWx1ZSxUaW1lc3RhbXAsfSBmcm9tICdmaXJlYmFzZS1hZG1pbi9maXJlc3RvcmUnO1xuaW1wb3J0IHsgZGIgYXMgYWRtaW5EYiwgYXV0aCBhcyBhZG1pbkF1dGggfSBmcm9tICcuL2ZpcmViYXNlLWFkbWluJztcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tICduZXh0L2hlYWRlcnMnO1xuaW1wb3J0IHsgZmluZFVzZXJCeUVtYWlsLCBjcmVhdGVVc2VySW5EYiwgZ2V0QXV0aG9yQW5kSW5zdGl0dXRpb24sIGdldFBvc3RzQnlBdXRob3JJZCB9IGZyb20gJy4vZGF0YSc7XG5cbmZ1bmN0aW9uIGNvbnZlcnRGaXJlc3RvcmVUaW1lc3RhbXBUb0RhdGUodGltZXN0YW1wOiBhbnkpOiBEYXRlIHwgbnVsbCB7XG4gIGlmICghdGltZXN0YW1wKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKHR5cGVvZiB0aW1lc3RhbXAuc2Vjb25kcyA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHRpbWVzdGFtcC5uYW5vc2Vjb25kcyA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gbmV3IERhdGUodGltZXN0YW1wLnNlY29uZHMgKiAxMDAwICsgdGltZXN0YW1wLm5hbm9zZWNvbmRzIC8gMTAwMDAwMCk7XG4gIH1cbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRpbWVzdGFtcCk7XG4gIGlmICghaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSB7XG4gICAgcmV0dXJuIGRhdGU7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVQb3N0QWN0aW9uKHByZXZTdGF0ZTogYW55LCBmb3JtRGF0YTogRm9ybURhdGEpIHtcbiAgY29uc3QgYXV0aG9ySWQgPSBmb3JtRGF0YS5nZXQoJ2F1dGhvcklkJykgYXMgc3RyaW5nO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgYXV0aG9yUmVzdWx0ID0gYXdhaXQgZ2V0QXV0aG9yQW5kSW5zdGl0dXRpb24oYXV0aG9ySWQpO1xuICAgIGlmICghYXV0aG9yUmVzdWx0KSB7XG4gICAgICByZXR1cm4geyBtZXNzYWdlOiAnRXJyb3I6IENvdWxkIG5vdCBmaW5kIGF1dGhvciBvciBpbnN0aXR1dGlvbi4nIH07XG4gICAgfVxuXG4gICAgY29uc3QgeyBhdXRob3JEYXRhIH0gPSBhdXRob3JSZXN1bHQ7XG5cbiAgICBjb25zdCBkZWFkbGluZVN0ciA9IGZvcm1EYXRhLmdldCgndGltZXN0YW1wcy5kZWFkbGluZScpIGFzIHN0cmluZztcbiAgICBjb25zdCBkZWFkbGluZSA9IFRpbWVzdGFtcC5mcm9tRGF0ZShuZXcgRGF0ZShkZWFkbGluZVN0cikpO1xuXG4gICAgY29uc3QgbmV3UG9zdDogT21pdDxQb3N0LCAnaWQnIHwgJ2F1dGhvcic+ID0ge1xuICAgICAgYXV0aG9ySWQsXG4gICAgICBhdXRob3JJbmZvOiB7XG4gICAgICAgIGF1dGhvck5hbWU6IGF1dGhvckRhdGEudXNlclByb2ZpbGUubmFtZSxcbiAgICAgICAgZ2VuZGVyOiBhdXRob3JEYXRhLnVzZXJQcm9maWxlLmdlbmRlciB8fCAncHJlZmVyX25vdF90b19zYXknLFxuICAgICAgfSxcbiAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgdGl0bGU6IGZvcm1EYXRhLmdldCgnZGV0YWlscy50aXRsZScpIGFzIHN0cmluZyxcbiAgICAgICAgcmVzdGF1cmFudDogZm9ybURhdGEuZ2V0KCdkZXRhaWxzLnJlc3RhdXJhbnQnKSBhcyBzdHJpbmcsXG4gICAgICAgIG5vdGVzOiBmb3JtRGF0YS5nZXQoJ2RldGFpbHMubm90ZXMnKSBhcyBzdHJpbmcsXG4gICAgICB9LFxuICAgICAgb3JkZXI6IHtcbiAgICAgICAgdG90YWxBbW91bnQ6IHBhcnNlRmxvYXQoZm9ybURhdGEuZ2V0KCdvcmRlci50b3RhbEFtb3VudCcpIGFzIHN0cmluZyksXG4gICAgICAgIGNvbnRyaWJ1dGlvbkFtb3VudDogcGFyc2VGbG9hdChmb3JtRGF0YS5nZXQoJ29yZGVyLmNvbnRyaWJ1dGlvbkFtb3VudCcpIGFzIHN0cmluZyksXG4gICAgICB9LFxuICAgICAgdGltZXN0YW1wczoge1xuICAgICAgICBjcmVhdGVkQXQ6IEZpZWxkVmFsdWUuc2VydmVyVGltZXN0YW1wKCkgYXMgYW55LFxuICAgICAgICB1cGRhdGVkQXQ6IEZpZWxkVmFsdWUuc2VydmVyVGltZXN0YW1wKCkgYXMgYW55LFxuICAgICAgICBkZWFkbGluZTogZGVhZGxpbmUgYXMgYW55LFxuICAgICAgfSxcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIGluc3RpdHV0aW9uTmFtZTogYXV0aG9yRGF0YS5pbnN0aXR1dGlvbj8uaW5zdGl0dXRpb25OYW1lID8/IHVuZGVmaW5lZCxcbiAgICAgICAgYXJlYTogYXV0aG9yRGF0YS5sb2NhdGlvbj8uYXJlYSA/PyB1bmRlZmluZWQsXG4gICAgICAgIGNpdHk6IGF1dGhvckRhdGEubG9jYXRpb24/LmNpdHkgPz8gdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgYXdhaXQgYWRtaW5EYi5jb2xsZWN0aW9uKCdwb3N0cycpLmFkZChuZXdQb3N0KTtcbiAgICBcbiAgICByZXZhbGlkYXRlUGF0aCgnLycpO1xuICAgIHJldmFsaWRhdGVQYXRoKCcvbXktcG9zdHMnKTtcblxuICAgIHJldHVybiB7IG1lc3NhZ2U6ICdQb3N0IGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5IScgfTtcblxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNyZWF0aW5nIHBvc3Q6JywgZXJyb3IpO1xuICAgIHJldHVybiB7IG1lc3NhZ2U6IGBFcnJvciBjcmVhdGluZyBwb3N0OiAke2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InfWAgfTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlUG9zdEFjdGlvbihwb3N0SWQ6IHN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGFkbWluRGIuY29sbGVjdGlvbigncG9zdHMnKS5kb2MocG9zdElkKS5kZWxldGUoKTtcbiAgICAgICAgcmV2YWxpZGF0ZVBhdGgoJy9teS1wb3N0cycpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBtZXNzYWdlOiAnUG9zdCBkZWxldGVkIHN1Y2Nlc3NmdWxseS4nIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZGVsZXRpbmcgcG9zdDonLCBlcnJvcik7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiAnRmFpbGVkIHRvIGRlbGV0ZSBwb3N0LicgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVQb3N0QWN0aW9uKHByZXZTdGF0ZTogYW55LCBmb3JtRGF0YTogRm9ybURhdGEpIHtcbiAgICBjb25zdCBwb3N0SWQgPSBmb3JtRGF0YS5nZXQoJ3Bvc3RJZCcpIGFzIHN0cmluZztcbiAgICBpZiAoIXBvc3RJZCkge1xuICAgICAgICByZXR1cm4geyBtZXNzYWdlOiAnRXJyb3I6IFBvc3QgSUQgaXMgbWlzc2luZy4nIH07XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGVhZGxpbmVTdHIgPSBmb3JtRGF0YS5nZXQoJ3RpbWVzdGFtcHMuZGVhZGxpbmUnKSBhcyBzdHJpbmc7XG4gICAgICAgIGNvbnN0IGRlYWRsaW5lID0gVGltZXN0YW1wLmZyb21EYXRlKG5ldyBEYXRlKGRlYWRsaW5lU3RyKSk7XG5cbiAgICAgICAgY29uc3QgdXBkYXRlcyA9IHtcbiAgICAgICAgICAgICdkZXRhaWxzLnRpdGxlJzogZm9ybURhdGEuZ2V0KCdkZXRhaWxzLnRpdGxlJykgYXMgc3RyaW5nLFxuICAgICAgICAgICAgJ2RldGFpbHMucmVzdGF1cmFudCc6IGZvcm1EYXRhLmdldCgnZGV0YWlscy5yZXN0YXVyYW50JykgYXMgc3RyaW5nLFxuICAgICAgICAgICAgJ2RldGFpbHMubm90ZXMnOiBmb3JtRGF0YS5nZXQoJ2RldGFpbHMubm90ZXMnKSBhcyBzdHJpbmcsXG4gICAgICAgICAgICAnb3JkZXIudG90YWxBbW91bnQnOiBwYXJzZUZsb2F0KGZvcm1EYXRhLmdldCgnb3JkZXIudG90YWxBbW91bnQnKSBhcyBzdHJpbmcpLFxuICAgICAgICAgICAgJ29yZGVyLmNvbnRyaWJ1dGlvbkFtb3VudCc6IHBhcnNlRmxvYXQoZm9ybURhdGEuZ2V0KCdvcmRlci5jb250cmlidXRpb25BbW91bnQnKSBhcyBzdHJpbmcpLFxuICAgICAgICAgICAgJ3RpbWVzdGFtcHMuZGVhZGxpbmUnOiBkZWFkbGluZSxcbiAgICAgICAgICAgICd0aW1lc3RhbXBzLnVwZGF0ZWRBdCc6IEZpZWxkVmFsdWUuc2VydmVyVGltZXN0YW1wKCksXG4gICAgICAgIH07XG5cbiAgICAgICAgYXdhaXQgYWRtaW5EYi5jb2xsZWN0aW9uKCdwb3N0cycpLmRvYyhwb3N0SWQpLnVwZGF0ZSh1cGRhdGVzKTtcblxuICAgICAgICByZXZhbGlkYXRlUGF0aCgnLycpO1xuICAgICAgICByZXZhbGlkYXRlUGF0aCgnL215LXBvc3RzJyk7XG4gICAgICAgIHJldmFsaWRhdGVQYXRoKGAvZWRpdC1wb3N0LyR7cG9zdElkfWApO1xuXG4gICAgICAgIHJldHVybiB7IG1lc3NhZ2U6ICdQb3N0IHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5IScgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciB1cGRhdGluZyBwb3N0ICR7cG9zdElkfTpgLCBlcnJvcik7XG4gICAgICAgIHJldHVybiB7IG1lc3NhZ2U6IGBFcnJvciB1cGRhdGluZyBwb3N0OiAke2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InfWAgfTtcbiAgICB9XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVByb2ZpbGVBY3Rpb24ocHJldlN0YXRlOiBhbnksIGZvcm1EYXRhOiBGb3JtRGF0YSkge1xuICAgIGNvbnN0IHVzZXJJZCA9IGZvcm1EYXRhLmdldCgnaWQnKSBhcyBzdHJpbmc7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIHsgbWVzc2FnZTogJ0Vycm9yOiBVc2VyIElEIGlzIG1pc3NpbmcuJyB9O1xuICAgIH1cblxuICAgIGNvbnN0IG9uZVdlZWsgPSA3ICogMjQgKiA2MCAqIDYwICogMTAwMDtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVzZXJSZWYgPSBhZG1pbkRiLmNvbGxlY3Rpb24oJ3VzZXJzJykuZG9jKHVzZXJJZCk7XG4gICAgICAgIGNvbnN0IHVzZXJEb2MgPSBhd2FpdCB1c2VyUmVmLmdldCgpO1xuICAgICAgICBpZiAoIXVzZXJEb2MuZXhpc3RzKSB7XG4gICAgICAgICAgICByZXR1cm4geyBtZXNzYWdlOiAnRXJyb3I6IFVzZXIgbm90IGZvdW5kLicgfTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY29uc3QgdXNlckRhdGEgPSB1c2VyRG9jLmRhdGEoKSBhcyBVc2VyO1xuICAgICAgICBjb25zdCBsYXN0VXBkYXRlU3RyID0gdXNlckRhdGEudXNlclByb2ZpbGU/Lmxhc3RQcm9maWxlVXBkYXRlO1xuICAgICAgICBcbiAgICAgICAgaWYgKGxhc3RVcGRhdGVTdHIpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RVcGRhdGUgPSBuZXcgRGF0ZShsYXN0VXBkYXRlU3RyKTtcbiAgICAgICAgICAgIGlmICgobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBsYXN0VXBkYXRlLmdldFRpbWUoKSkgPCBvbmVXZWVrKSB7XG4gICAgICAgICAgICAgICAgIHJldHVybiB7IG1lc3NhZ2U6ICdQcm9maWxlIGNhbiBvbmx5IGJlIHVwZGF0ZWQgb25jZSBhIHdlZWsuJyB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCB1cGRhdGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgICAgICAgJ3VzZXJQcm9maWxlLm5hbWUnOiBmb3JtRGF0YS5nZXQoJ25hbWUnKSxcbiAgICAgICAgICAgICd1c2VyUHJvZmlsZS5sYXN0UHJvZmlsZVVwZGF0ZSc6IEZpZWxkVmFsdWUuc2VydmVyVGltZXN0YW1wKCksXG4gICAgICAgICAgICAnY29udGFjdC5waG9uZSc6IGZvcm1EYXRhLmdldCgnY29udGFjdE51bWJlcicpLFxuICAgICAgICAgICAgJ2NvbnRhY3Quc2hhcmVDb250YWN0JzogZm9ybURhdGEuZ2V0KCdzaGFyZUNvbnRhY3QnKSA9PT0gJ29uJyxcbiAgICAgICAgICAgICdpbnN0aXR1dGlvbi5pbnN0aXR1dGlvblR5cGUnOiBmb3JtRGF0YS5nZXQoJ2luc3RpdHV0aW9uVHlwZScpLFxuICAgICAgICAgICAgJ2luc3RpdHV0aW9uLmluc3RpdHV0aW9uTmFtZSc6IGZvcm1EYXRhLmdldCgnaW5zdGl0dXRpb25OYW1lJyksXG4gICAgICAgICAgICAnbG9jYXRpb24uYXJlYSc6IGZvcm1EYXRhLmdldCgnYXJlYScpLFxuICAgICAgICAgICAgJ2xvY2F0aW9uLmNpdHknOiBmb3JtRGF0YS5nZXQoJ2NpdHknKSxcbiAgICAgICAgICAgICdsb2NhdGlvbi5waW5Db2RlJzogZm9ybURhdGEuZ2V0KCdwaW5Db2RlJyksXG4gICAgICAgIH07XG5cbiAgICAgICAgYXdhaXQgdXNlclJlZi51cGRhdGUodXBkYXRlcyk7XG4gICAgICAgIFxuICAgICAgICByZXZhbGlkYXRlUGF0aCgnL3Byb2ZpbGUnKTtcbiAgICAgICAgcmV2YWxpZGF0ZVBhdGgoJy8nKTtcblxuICAgICAgICByZXR1cm4geyBtZXNzYWdlOiAnUHJvZmlsZSB1cGRhdGVkIHN1Y2Nlc3NmdWxseSEnIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgdXBkYXRpbmcgcHJvZmlsZTonLCBlcnJvcik7XG4gICAgICAgIHJldHVybiB7IG1lc3NhZ2U6IGBFcnJvciB1cGRhdGluZyBwcm9maWxlOiAke2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InfWAgfTtcbiAgICB9XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlYWN0aXZhdGVTaW5nbGVQb3N0UGFzc0FjdGlvbih1c2VySWQ6IHN0cmluZykge1xuICB0cnkge1xuICAgIGNvbnN0IHVzZXJSZWYgPSBhZG1pbkRiLmNvbGxlY3Rpb24oJ3VzZXJzJykuZG9jKHVzZXJJZCk7XG4gICAgY29uc3QgdXNlckRvYyA9IGF3YWl0IHVzZXJSZWYuZ2V0KCk7XG5cbiAgICBpZiAoIXVzZXJEb2MuZXhpc3RzKSB7XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgbWVzc2FnZTogJ1VzZXIgbm90IGZvdW5kLicgfTtcbiAgICB9XG5cbiAgICBjb25zdCB1c2VyID0gdXNlckRvYy5kYXRhKCkgYXMgVXNlcjtcblxuICAgIGlmICh1c2VyLnN1YnNjcmlwdGlvbj8ucGxhbiA9PT0gJ3NpbmdsZS1wb3N0JyAmJiB1c2VyLnN1YnNjcmlwdGlvbj8uc3RhdHVzID09PSAnYWN0aXZlJykge1xuICAgICAgYXdhaXQgdXNlclJlZi51cGRhdGUoe1xuICAgICAgICAnc3Vic2NyaXB0aW9uLnN0YXR1cyc6ICdpbmFjdGl2ZScsXG4gICAgICAgICdzdWJzY3JpcHRpb24ucG9zdHNWaWV3ZWQnOiAxLCBcbiAgICAgIH0pO1xuXG4gICAgICByZXZhbGlkYXRlUGF0aCgnLycpOyBcblxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogJ1NpbmdsZS1wb3N0IHBhc3MgdXNlZCBhbmQgZGVhY3RpdmF0ZWQuJyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgbWVzc2FnZTogJ05vIGFjdGl2ZSBzaW5nbGUtcG9zdCBwYXNzIHRvIGRlYWN0aXZhdGUuJyB9O1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkZWFjdGl2YXRpbmcgc2luZ2xlLXBvc3QgcGFzczonLCBlcnJvcik7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICdBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkLicgfTtcbiAgfVxufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB2ZXJpZnlBbmRTaWduSW5BY3Rpb24oaWRUb2tlbjogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGVjb2RlZFRva2VuID0gYXdhaXQgYWRtaW5BdXRoLnZlcmlmeUlkVG9rZW4oaWRUb2tlbik7XG4gICAgY29uc3QgdWlkID0gZGVjb2RlZFRva2VuLnVpZDtcbiAgICBjb25zdCBlbWFpbCA9IGRlY29kZWRUb2tlbi5lbWFpbDtcblxuICAgIGlmICghZW1haWwpIHtcbiAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiAnRW1haWwgbm90IGZvdW5kIGluIHRva2VuLicgfTtcbiAgICB9XG5cbiAgICBsZXQgdXNlciA9IGF3YWl0IGZpbmRVc2VyQnlFbWFpbChlbWFpbCk7XG5cbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIGNvbnN0IG5ld1VzZXIgPSB7XG4gICAgICAgIG5hbWU6IGRlY29kZWRUb2tlbi5uYW1lIHx8ICdOZXcgVXNlcicsXG4gICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgcGhvdG9VUkw6IGRlY29kZWRUb2tlbi5waWN0dXJlIHx8IG51bGwsXG4gICAgICB9O1xuICAgICAgdXNlciA9IGF3YWl0IGNyZWF0ZVVzZXJJbkRiKG5ld1VzZXIpO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBjb29raWVTdG9yZSA9IGF3YWl0IGNvb2tpZXMoKTtcbiAgICBjb29raWVTdG9yZS5zZXQoJ3Nlc3Npb25fdXNlcklkJywgdXNlci5pZCwgeyBodHRwT25seTogdHJ1ZSwgc2VjdXJlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nIH0pO1xuXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgdXNlciB9O1xuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0F1dGhlbnRpY2F0aW9uIGZhaWxlZC4nIH07XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ291dEFjdGlvbigpIHtcbiAgICBjb25zdCBjb29raWVTdG9yZSA9IGF3YWl0IGNvb2tpZXMoKTtcbiAgICBjb29raWVTdG9yZS5kZWxldGUoJ3Nlc3Npb25fdXNlcklkJyk7XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN1YnNjcmliZUFjdGlvbihwbGFuSWQ6ICdzaW5nbGUtcG9zdCcgfCAnZGFpbHknIHwgJ3dlZWtseScgfCAnbW9udGhseScsIHVzZXJJZDogc3RyaW5nKSB7XG4gIGlmICghdXNlcklkKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICdVc2VyIG5vdCBmb3VuZC4nIH07XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IHVzZXJSZWYgPSBhZG1pbkRiLmNvbGxlY3Rpb24oJ3VzZXJzJykuZG9jKHVzZXJJZCk7XG5cbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGxldCBleHBpcnkgPSBuZXcgRGF0ZShub3cpO1xuXG4gICAgc3dpdGNoIChwbGFuSWQpIHtcbiAgICAgIGNhc2UgJ2RhaWx5JzpcbiAgICAgICAgZXhwaXJ5LnNldERhdGUobm93LmdldERhdGUoKSArIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3dlZWtseSc6XG4gICAgICAgIGV4cGlyeS5zZXREYXRlKG5vdy5nZXREYXRlKCkgKyA3KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb250aGx5JzpcbiAgICAgICAgZXhwaXJ5LnNldE1vbnRoKG5vdy5nZXRNb250aCgpICsgMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2luZ2xlLXBvc3QnOlxuICAgICAgICBleHBpcnkuc2V0RnVsbFllYXIobm93LmdldEZ1bGxZZWFyKCkgKyAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbkRhdGE6IFVzZXJbJ3N1YnNjcmlwdGlvbiddID0ge1xuICAgICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICAgIHBsYW46IHBsYW5JZCxcbiAgICAgIHN0YXJ0RGF0ZTogVGltZXN0YW1wLmZyb21EYXRlKG5vdykgYXMgYW55LFxuICAgICAgZXhwaXJ5OiBUaW1lc3RhbXAuZnJvbURhdGUoZXhwaXJ5KSBhcyBhbnksXG4gICAgICBwb3N0c1ZpZXdlZDogMCxcbiAgICB9O1xuICAgIFxuICAgIGF3YWl0IHVzZXJSZWYudXBkYXRlKHtcbiAgICAgICAgJ3N1YnNjcmlwdGlvbic6IHN1YnNjcmlwdGlvbkRhdGFcbiAgICB9KTtcblxuICAgIHJldmFsaWRhdGVQYXRoKCcvcHJpY2luZycpO1xuICAgIHJldmFsaWRhdGVQYXRoKCcvcHJvZmlsZScpO1xuICAgIHJldmFsaWRhdGVQYXRoKCcvJyk7XG5cbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG4gIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICBjb25zb2xlLmVycm9yKCdTdWJzY3JpcHRpb24gRXJyb3I6JywgZXJyb3IpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkLicgfTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3VibWl0RmVlZGJhY2tBY3Rpb24ocHJldlN0YXRlOiBhbnksIGZvcm1EYXRhOiBGb3JtRGF0YSkge1xuICAgIGNvbnN0IGVtYWlsID0gZm9ybURhdGEuZ2V0KCdlbWFpbCcpIGFzIHN0cmluZztcbiAgICBjb25zdCBmZWVkYmFjayA9IGZvcm1EYXRhLmdldCgnZmVlZGJhY2snKSBhcyBzdHJpbmc7XG5cbiAgICBpZiAoIWZlZWRiYWNrKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiAnRmVlZGJhY2sgY2Fubm90IGJlIGVtcHR5LicgfTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgICBhd2FpdCBhZG1pbkRiLmNvbGxlY3Rpb24oJ2ZlZWRiYWNrJykuYWRkKHtcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbCB8fCAnYW5vbnltb3VzJyxcbiAgICAgICAgICAgIGZlZWRiYWNrOiBmZWVkYmFjayxcbiAgICAgICAgICAgIHN1Ym1pdHRlZEF0OiBGaWVsZFZhbHVlLnNlcnZlclRpbWVzdGFtcCgpLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogJ1lvdXIgZmVlZGJhY2sgaGFzIGJlZW4gc3VibWl0dGVkLicgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGZWVkYmFjayBzdWJtaXNzaW9uIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICdTb21ldGhpbmcgd2VudCB3cm9uZy4gUGxlYXNlIHRyeSBhZ2Fpbi4nIH07XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlUG9zdFZpZXdDb3VudEFjdGlvbih1c2VySWQ6IHN0cmluZywgY291bnQ6IG51bWJlcikge1xuICAgIGlmICghdXNlcklkIHx8IGNvdW50ID09PSAwKSByZXR1cm47XG5cbiAgICBjb25zdCB1c2VyUmVmID0gYWRtaW5EYi5jb2xsZWN0aW9uKCd1c2VycycpLmRvYyh1c2VySWQpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdXNlckRvYyA9IGF3YWl0IHVzZXJSZWYuZ2V0KCk7XG4gICAgICAgIGlmICh1c2VyRG9jLmV4aXN0cykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudENvdW50ID0gdXNlckRvYy5kYXRhKCk/LnN1YnNjcmlwdGlvbj8ucG9zdHNWaWV3ZWQgfHwgMDtcbiAgICAgICAgICAgIGF3YWl0IHVzZXJSZWYudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAnc3Vic2NyaXB0aW9uLnBvc3RzVmlld2VkJzogY3VycmVudENvdW50ICsgY291bnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHVwZGF0ZSB2aWV3IGNvdW50IGZvciB1c2VyICR7dXNlcklkfTpgLCBlcnJvcik7XG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TXlQb3N0c0FjdGlvbih1c2VySWQ6IHN0cmluZykge1xuICBpZiAoIXVzZXJJZCkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiAnVXNlciBub3QgZm91bmQuJywgcG9zdHM6IFtdIH07XG4gIH1cbiAgdHJ5IHtcbiAgICBjb25zdCBwb3N0cyA9IGF3YWl0IGdldFBvc3RzQnlBdXRob3JJZCh1c2VySWQpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIHBvc3RzOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHBvc3RzKSkgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyBteSBwb3N0czonLCBlcnJvcik7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICdGYWlsZWQgdG8gZmV0Y2ggcG9zdHMuJywgcG9zdHM6IFtdIH07XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoid1JBNE9zQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/avatar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Avatar": (()=>Avatar),
    "AvatarFallback": (()=>AvatarFallback),
    "AvatarImage": (()=>AvatarImage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-avatar/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const Avatar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/avatar.tsx",
        lineNumber: 12,
        columnNumber: 3
    }, this));
_c1 = Avatar;
Avatar.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
const AvatarImage = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Image"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("aspect-square h-full w-full", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/avatar.tsx",
        lineNumber: 27,
        columnNumber: 3
    }, this));
_c3 = AvatarImage;
AvatarImage.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Image"].displayName;
const AvatarFallback = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fallback"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/avatar.tsx",
        lineNumber: 39,
        columnNumber: 3
    }, this));
_c5 = AvatarFallback;
AvatarFallback.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fallback"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "Avatar$React.forwardRef");
__turbopack_context__.k.register(_c1, "Avatar");
__turbopack_context__.k.register(_c2, "AvatarImage$React.forwardRef");
__turbopack_context__.k.register(_c3, "AvatarImage");
__turbopack_context__.k.register(_c4, "AvatarFallback$React.forwardRef");
__turbopack_context__.k.register(_c5, "AvatarFallback");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/dropdown-menu.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "DropdownMenu": (()=>DropdownMenu),
    "DropdownMenuCheckboxItem": (()=>DropdownMenuCheckboxItem),
    "DropdownMenuContent": (()=>DropdownMenuContent),
    "DropdownMenuGroup": (()=>DropdownMenuGroup),
    "DropdownMenuItem": (()=>DropdownMenuItem),
    "DropdownMenuLabel": (()=>DropdownMenuLabel),
    "DropdownMenuPortal": (()=>DropdownMenuPortal),
    "DropdownMenuRadioGroup": (()=>DropdownMenuRadioGroup),
    "DropdownMenuRadioItem": (()=>DropdownMenuRadioItem),
    "DropdownMenuSeparator": (()=>DropdownMenuSeparator),
    "DropdownMenuShortcut": (()=>DropdownMenuShortcut),
    "DropdownMenuSub": (()=>DropdownMenuSub),
    "DropdownMenuSubContent": (()=>DropdownMenuSubContent),
    "DropdownMenuSubTrigger": (()=>DropdownMenuSubTrigger),
    "DropdownMenuTrigger": (()=>DropdownMenuTrigger)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const DropdownMenu = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const DropdownMenuTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const DropdownMenuGroup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"];
const DropdownMenuPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const DropdownMenuSub = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sub"];
const DropdownMenuRadioGroup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroup"];
const DropdownMenuSubTrigger = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, inset, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubTrigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                className: "ml-auto"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/dropdown-menu.tsx",
                lineNumber: 37,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 27,
        columnNumber: 3
    }, this));
_c1 = DropdownMenuSubTrigger;
DropdownMenuSubTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubTrigger"].displayName;
const DropdownMenuSubContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubContent"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 47,
        columnNumber: 3
    }, this));
_c3 = DropdownMenuSubContent;
DropdownMenuSubContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubContent"].displayName;
const DropdownMenuContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, sideOffset = 4, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dropdown-menu.tsx",
            lineNumber: 64,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 63,
        columnNumber: 3
    }, this));
_c5 = DropdownMenuContent;
DropdownMenuContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const DropdownMenuItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c6 = ({ className, inset, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 83,
        columnNumber: 3
    }, this));
_c7 = DropdownMenuItem;
DropdownMenuItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"].displayName;
const DropdownMenuCheckboxItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c8 = ({ className, children, checked, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckboxItem"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        checked: checked,
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/dropdown-menu.tsx",
                    lineNumber: 109,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/dropdown-menu.tsx",
                lineNumber: 108,
                columnNumber: 5
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 99,
        columnNumber: 3
    }, this));
_c9 = DropdownMenuCheckboxItem;
DropdownMenuCheckboxItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckboxItem"].displayName;
const DropdownMenuRadioItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c10 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioItem"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                        className: "h-2 w-2 fill-current"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/dropdown-menu.tsx",
                    lineNumber: 132,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/dropdown-menu.tsx",
                lineNumber: 131,
                columnNumber: 5
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 123,
        columnNumber: 3
    }, this));
_c11 = DropdownMenuRadioItem;
DropdownMenuRadioItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioItem"].displayName;
const DropdownMenuLabel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c12 = ({ className, inset, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 147,
        columnNumber: 3
    }, this));
_c13 = DropdownMenuLabel;
DropdownMenuLabel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"].displayName;
const DropdownMenuSeparator = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c14 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-1 my-1 h-px bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 163,
        columnNumber: 3
    }, this));
_c15 = DropdownMenuSeparator;
DropdownMenuSeparator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"].displayName;
const DropdownMenuShortcut = ({ className, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("ml-auto text-xs tracking-widest opacity-60", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dropdown-menu.tsx",
        lineNumber: 176,
        columnNumber: 5
    }, this);
};
_c16 = DropdownMenuShortcut;
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16;
__turbopack_context__.k.register(_c, "DropdownMenuSubTrigger$React.forwardRef");
__turbopack_context__.k.register(_c1, "DropdownMenuSubTrigger");
__turbopack_context__.k.register(_c2, "DropdownMenuSubContent$React.forwardRef");
__turbopack_context__.k.register(_c3, "DropdownMenuSubContent");
__turbopack_context__.k.register(_c4, "DropdownMenuContent$React.forwardRef");
__turbopack_context__.k.register(_c5, "DropdownMenuContent");
__turbopack_context__.k.register(_c6, "DropdownMenuItem$React.forwardRef");
__turbopack_context__.k.register(_c7, "DropdownMenuItem");
__turbopack_context__.k.register(_c8, "DropdownMenuCheckboxItem$React.forwardRef");
__turbopack_context__.k.register(_c9, "DropdownMenuCheckboxItem");
__turbopack_context__.k.register(_c10, "DropdownMenuRadioItem$React.forwardRef");
__turbopack_context__.k.register(_c11, "DropdownMenuRadioItem");
__turbopack_context__.k.register(_c12, "DropdownMenuLabel$React.forwardRef");
__turbopack_context__.k.register(_c13, "DropdownMenuLabel");
__turbopack_context__.k.register(_c14, "DropdownMenuSeparator$React.forwardRef");
__turbopack_context__.k.register(_c15, "DropdownMenuSeparator");
__turbopack_context__.k.register(_c16, "DropdownMenuShortcut");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/firebase.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// @ts-nocheck
__turbopack_context__.s({
    "auth": (()=>auth),
    "db": (()=>db)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm2017.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$8e6e89cb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__p__as__getAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index-8e6e89cb.js [app-client] (ecmascript) <export p as getAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
;
;
;
const firebaseConfig = {
    apiKey: "AIzaSyA00F2LyzvMPYTLN4SLjZ0aOPky8CcDyLA",
    authDomain: "studio-5219136729-6683e.firebaseapp.com",
    projectId: "studio-5219136729-6683e",
    storageBucket: "studio-5219136729-6683e.appspot.com",
    messagingSenderId: "183055801352",
    appId: "1:183055801352:web:495772bc4e16491fe6c5bd"
};
// Initialize Firebase
const app = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApps"])().length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeApp"])(firebaseConfig) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApp"])();
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$8e6e89cb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__p__as__getAuth$3e$__["getAuth"])(app);
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(app);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/header.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Header": (()=>Header)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/providers.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$3a$52735f__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/data:52735f [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/utensils-crossed.js [app-client] (ecmascript) <export default as UtensilsCrossed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-plus.js [app-client] (ecmascript) <export default as PlusCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$indian$2d$rupee$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IndianRupee$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/indian-rupee.js [app-client] (ecmascript) <export default as IndianRupee>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogIn$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-in.js [app-client] (ecmascript) <export default as LogIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$ordered$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListOrdered$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list-ordered.js [app-client] (ecmascript) <export default as ListOrdered>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$8e6e89cb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__signOut$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index-8e6e89cb.js [app-client] (ecmascript) <export D as signOut>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
function Header() {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [isPending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleLogout = async ()=>{
        startTransition(async ()=>{
            const auth = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"];
            if (auth) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$8e6e89cb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__signOut$3e$__["signOut"])(auth);
            }
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$3a$52735f__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["logoutAction"])();
            // Clear cached user data on logout
            try {
                localStorage.removeItem('cachedUser');
                localStorage.removeItem('cachedPosts');
                localStorage.removeItem('myPosts');
            } catch (error) {
                console.error('Failed to clear localStorage on logout', error);
            }
            router.push('/login');
        });
    };
    const navLinks = [
        {
            href: '/',
            label: 'Dashboard',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
        },
        {
            href: '/about',
            label: 'About',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"]
        },
        {
            href: '/create-post',
            label: 'Create Post',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"]
        },
        {
            href: '/pricing',
            label: 'Pricing',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$indian$2d$rupee$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IndianRupee$3e$__["IndianRupee"]
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-50 w-full bg-header-background",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container flex h-16 items-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: "mr-6 flex items-center space-x-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__["UtensilsCrossed"], {
                            className: "h-6 w-6 text-primary"
                        }, void 0, false, {
                            fileName: "[project]/src/components/header.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-bold font-headline text-lg text-foreground",
                            children: "OrderlyGather"
                        }, void 0, false, {
                            fileName: "[project]/src/components/header.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/header.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "hidden md:flex items-center space-x-6 text-sm font-medium",
                    children: navLinks.map((link)=>{
                        const isActive = pathname === link.href;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: link.href,
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground relative py-2', isActive && 'text-foreground'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(link.icon, {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/header.tsx",
                                    lineNumber: 86,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: link.label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/header.tsx",
                                    lineNumber: 87,
                                    columnNumber: 17
                                }, this),
                                isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/header.tsx",
                                    lineNumber: 89,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, link.href, true, {
                            fileName: "[project]/src/components/header.tsx",
                            lineNumber: 78,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/src/components/header.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-1 items-center justify-end space-x-4",
                    children: user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "secondary",
                                    size: "sm",
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                            className: "h-7 w-7 mr-2",
                                            children: [
                                                user.userProfile?.photoURL && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                                    src: user.userProfile.photoURL,
                                                    alt: user.userProfile.name || ''
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/header.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                                    className: "text-xs bg-primary text-primary-foreground",
                                                    children: user.userProfile?.name?.charAt(0).toUpperCase()
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/header.tsx",
                                                    lineNumber: 108,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/header.tsx",
                                            lineNumber: 101,
                                            columnNumber: 19
                                        }, this),
                                        "Profile"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/header.tsx",
                                    lineNumber: 100,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/header.tsx",
                                lineNumber: 99,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                className: "w-56",
                                align: "end",
                                forceMount: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/profile",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/header.tsx",
                                                    lineNumber: 119,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "My Profile"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/header.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/header.tsx",
                                            lineNumber: 118,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/header.tsx",
                                        lineNumber: 117,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/my-posts",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$ordered$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListOrdered$3e$__["ListOrdered"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/header.tsx",
                                                    lineNumber: 126,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "My Posts"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/header.tsx",
                                                    lineNumber: 127,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/header.tsx",
                                            lineNumber: 125,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/header.tsx",
                                        lineNumber: 124,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/create-post",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/header.tsx",
                                                    lineNumber: 133,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Create Post"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/header.tsx",
                                                    lineNumber: 134,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/header.tsx",
                                            lineNumber: 132,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/header.tsx",
                                        lineNumber: 131,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/src/components/header.tsx",
                                        lineNumber: 138,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/about",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/header.tsx",
                                                    lineNumber: 142,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "About"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/header.tsx",
                                                    lineNumber: 143,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/header.tsx",
                                            lineNumber: 141,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/header.tsx",
                                        lineNumber: 140,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/src/components/header.tsx",
                                        lineNumber: 147,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onSelect: (e)=>{
                                            e.preventDefault();
                                            handleLogout();
                                        },
                                        disabled: isPending,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/header.tsx",
                                                lineNumber: 156,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: isPending ? 'Logging out...' : 'Logout'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/header.tsx",
                                                lineNumber: 157,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/header.tsx",
                                        lineNumber: 149,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/header.tsx",
                                lineNumber: 116,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/header.tsx",
                        lineNumber: 98,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: ()=>{
                            router.push('/login');
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogIn$3e$__["LogIn"], {
                                className: "mr-2 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/header.tsx",
                                lineNumber: 167,
                                columnNumber: 15
                            }, this),
                            "Login"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/header.tsx",
                        lineNumber: 162,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/header.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/header.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/header.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_s(Header, "mJH8AEnEgWycMXMvL45hk3897tg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_1b8fbc86._.js.map