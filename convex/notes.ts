import { ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import moment from "moment";

export const getNotesByContactId = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, { contactId }) => {
    // Get all notes for the contact
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_contact_id", (q) => q.eq("contactId", contactId))
      .order("desc")
      .collect();
    const newNotes = [];
    for (const note of notes) {
        const userInfo = await ctx.db.get(note.createdBy);
        newNotes.push({
            id: note._id,
            content: note.content,
            createdAt: moment(note.createdAt).format("YYYY-MM-DD HH:mm:ss"), 
            createdBy: userInfo?.email || userInfo?.name || "Unknown",
        });
    }

    return newNotes;
    }
});

export const createNote = mutation({
    args: {
        contactId: v.id("contacts"),
        content: v.string(),
    },
    handler: async (ctx, { contactId, content }) => {
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

        // Create a new note
        const note = await ctx.db.insert("notes", {
            contactId,
            content,
            createdAt: new Date().toISOString(),
            createdBy: user._id,
        });

        if (!note) {
            throw new ConvexError("Note creation failed");
        }

        return note;
    }
});