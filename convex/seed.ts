import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { createAccount } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const seedUsers = [
  {
    email: "test1@test.com",
    name: "Test User 1",
    memberships: [
      {
        orgName: "Organization 1",
        role: "admin",
      },
    ],
  },
  {
    email: "test2@test.com",
    name: "Test User 2",
    memberships: [
      {
        orgName: "Organization 2",
        role: "member",
      },
    ],
  },
  {
    email: "test3@test.com",
    name: "Test User 3",
    memberships: [
      {
        orgName: "Organization 1",
        role: "member",
      },
      {
        orgName: "Organization 3",
        role: "admin",
      },
    ],
  },
];

const seedOrgs = [
  {
    name: "Organization 1",
  },
  {
    name: "Organization 2",
  },
  {
    name: "Organization 3",
  },
];


export const seedData = internalMutation(async (ctx) => {
  for (const org of seedOrgs) {
    const existing = await ctx.db
      .query("organizations")
      .withIndex("by_name", (q) => q.eq("name", org.name))
      .unique();

    if (!existing) {
      await ctx.db.insert("organizations", org);
      console.log(`Seeded organization: ${org.name}`);
    } else {
      console.log(`Organization already exists: ${org.name}`);
    }
  }  

  for (const user of seedUsers) {
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", user.email))
      .unique();

    let userId = existing?._id;

    if (!existing) {
      userId = await ctx.db.insert("users", {
        email: user.email,
        name: user.name,
        emailVerificationTime: Date.now(),
      });

      ctx.scheduler.runAfter(0, internal.seed.createAccountAction, {
        user: {
          email: user.email,
          name: user.name,
        },
        secret: "password!",
      });
      console.log(`Seeded user: ${user.name}`);
    } else {
      console.log(`User already exists: ${user.email}`);
    }

    for (const membership of user.memberships) {
      const org = await ctx.db
        .query("organizations")
        .withIndex("by_name", (q) => q.eq("name", membership.orgName))
        .unique();

      if (!org) {
        console.log(`Organization not found: ${membership.orgName}`);
        continue;
      }

      await ctx.db.insert("organizationMembers", {
        organizationId: org._id,
        userId: userId as Id<"users">,
        role: membership.role as "admin" | "member",
      });
    }
  }
});

export const createAccountAction = internalAction({
  args: {
    user: v.object({ email: v.string(), name: v.string() }),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    const account = await createAccount(ctx, {
      provider: "password",
      account: {
        id: args.user.email,
        secret: args.secret,
      },
      profile: args.user,
      shouldLinkViaEmail: true,
    });

    account.user
  },
});
