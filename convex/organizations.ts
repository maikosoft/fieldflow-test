import { ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { checkUserRole } from "./auth";


export const getOrganizations = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("User not authenticated");
        }

        // Split the subject to get the user ID
        const userId = identity.subject.split('|')[0];

        // Get the user from the db
        const user = await ctx.db
            .query("users")
            .filter((q) => 
                q.eq(q.field("_id"), userId)
            )
            .first();
            
        if (!user) {
            throw new ConvexError("User not found");
        }

        // Get all memberships from orgs for the user
        const memberships = await ctx.db
            .query("organizationMembers")
            .withIndex("by_user_id", (q) => q.eq("userId", user._id))
            .collect();

        // Get the organizations for each membership
        const organizations = await Promise.all(
            memberships.map(async (membership) => {
              const organization = await ctx.db.get(membership.organizationId);
              return {
                ...organization,
                role: membership.role,
              };
            })
        );
        return organizations;
    },
});

export const getOrganizationById = query({
    args: { id: v.id("organizations") },
    handler: async (ctx, { id }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        // Split the subject to get the user ID
        const userId = identity.subject.split('|')[0];

        // Get the user 
        const user = await ctx.db
            .query("users")
            .filter((q) => 
                q.eq(q.field("_id"), userId)
            )
            .first();
            
        if (!user) {
            return null;
        }

        // Get the organization
        const organization = await ctx.db.get(id);
        if (!organization) {
            return null;
        }
        const organizatioRole = await ctx.db
            .query("organizationMembers")
            .withIndex("by_organization_id_user_id", (q) => q
            .eq("organizationId", organization._id)
            .eq("userId", user._id))
            .first();
        if (!organizatioRole) {
            return null;
        } 
        const organizationWithRole = {
            ...organization,
            role: organizatioRole.role,
        };
        return organizationWithRole;
    }
});

export const updateOrganization = mutation({
    args: {
        id: v.id("organizations"),
        name: v.string(),
    },
    handler: async (ctx, { id, name }) => {
        // Check if the user is admin
        const isAdmin = await checkUserRole(ctx, id, "admin");
        console.log('isAdmin', isAdmin);
        if (!isAdmin) {
            throw new ConvexError("User not authorized");
        }
        // Update the organization
        await ctx.db.patch(id, { name });
        const updatedOrganization = await ctx.db.get(id);
        const updatedId = updatedOrganization?._id;
        
        return updatedId;
    }
});