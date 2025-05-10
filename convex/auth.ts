import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";


export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});


export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db.get(userId);
  },
});

export const checkUserRole = async (ctx: any, orgId: Id<"organizations">, role: "admin" | "member") => {
  const userId = await getAuthUserId(ctx);
  if (!userId) return false;
  // Get the user's membership in the organization
  const membership = await ctx.db
    .query("organizationMembers")
    .withIndex("by_organization_id_user_id", (q: any) => q
      .eq("userId", userId)
      .eq("organizationId", orgId))
    .first();
  // If no membership or role doesn't match, return false
  if (!membership || membership.role !== role) {
    return false;
  }
  return true;
};


export const hasRole = query({
  args: { orgId: v.id("organizations"), role: v.union(v.literal("admin"), v.literal("member")) },
  handler: async (ctx, { orgId, role }) => {
    return await checkUserRole(ctx, orgId, role);
  }
});
