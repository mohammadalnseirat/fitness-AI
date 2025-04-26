import { httpRouter } from "convex/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    //! check if there webhookSecret is not provided:
    if (!webhookSecret) {
      throw new Error("Missing Clerk Webhook Secret...");
    }

    //! get the svix-id/ svix-signature/ svix-timestamp
    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    //! check the svix:
    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("No Svix Found", {
        status: 400,
      });
    }

    //! get the payload and body:
    const payload = await request.json();
    const body = JSON.stringify(payload);

    //! create webhook object and evt(event):
    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    //! verify the webhook:
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (error) {
      console.log("Error While Verifying webhook:", error);
      return new Response("Error While Verifying webhook", { status: 400 });
    }

    //! get the event type and check it:
    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, first_name, last_name, image_url, email_addresses } =
        evt.data;

      //! get the name and email:
      const name =
        `${first_name || ""} ${last_name || ""}`.trim() ||
        email_addresses[0].email_address.split("@")[0];
      const email = email_addresses[0].email_address;

      try {
        await ctx.runMutation(api.users.syncUser, {
          email,
          name,
          image: image_url,
          clerkId: id,
        });
      } catch (error) {
        console.log(`Error Creating User:${error}`);
        return new Response("Error Creating User In The DataBase", {
          status: 500,
        });
      }
    }

    //Todo: check the eventType is (user.updated):

    //! Success Response:
    return new Response("Webhook Processed Successfully!", { status: 200 });
  }),
});

export default http;
