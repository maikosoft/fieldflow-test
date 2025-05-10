import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  organizations: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),
  organizationMembers: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
  }).index("by_organization_id", ["organizationId"])
    .index("by_user_id", ["userId"])
    .index("by_organization_id_user_id", ["organizationId", "userId"]),
  contacts: defineTable({
    organizationId: v.id("organizations"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
  }).index("by_organization_id", ["organizationId"])
    .index("by_email", ["email"]),
  notes: defineTable({
    contactId: v.id("contacts"),
    content: v.string(),
    createdAt: v.string(),
    createdBy: v.id("users"),
  }).index("by_contact_id", ["contactId"])
    .index("by_created_at", ["createdAt"])
    .index("by_created_by", ["createdBy"]),
});
