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
});
