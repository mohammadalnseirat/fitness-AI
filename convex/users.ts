import { v } from "convex/values";
import { mutation } from "./_generated/server";

//! Function to SyncUser to database:
export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    //! check if the user existing in the database:
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existingUser) return;

    //! if there is no user insert to database:
    return await ctx.db.insert("users", args);
  },
});
