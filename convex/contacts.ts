import { ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { checkUserRole } from "./auth";

export const getContacts = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    
    const isMember = await checkUserRole(ctx, orgId, "member");
    const isAdmin = await checkUserRole(ctx, orgId, "admin");
    if (!isMember && !isAdmin) {
      throw new ConvexError("User not authorized");
    } 

    
    // Get all contacts for the organization
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
      .collect();

    return contacts;
  }
});

export const createContact = mutation({
  args: {
    orgId: v.id("organizations"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, { orgId, firstName, lastName, email, phone }) => {
    const isAdmin = await checkUserRole(ctx, orgId, "admin");
    const isMember = await checkUserRole(ctx, orgId, "member");

    if (!isMember && !isAdmin) {
        throw new ConvexError("User not authorized");
    }
    
    // Create a new contact
    const contact = await ctx.db.insert("contacts", {
      organizationId: orgId,
      firstName,
      lastName,
      email,
      phone,
    });

    if (!contact) {
        throw new ConvexError("Contact creation failed");
    }

    return contact;
  }
});

export const getContactById = query({
    args: { id: v.id("contacts") },
    handler: async (ctx, { id }) => {
        
        // Check if the contact belongs to any of the user's organizations
        const contact = await ctx.db.get(id);
    
        if (!contact) {
          throw new ConvexError("Contact not found");
        }
    
        return contact;
    }
});