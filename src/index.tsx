import { serve } from "bun";
import index from "./index.html";
import { syncAndFetchProjects, updateProjectProperties } from "./api/projects";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    "/api/projects": {
      async GET(req) {
        try {
          const projects = await syncAndFetchProjects();
          return Response.json(projects);
        } catch (error) {
          console.error("Error fetching projects from API:", error);
          return new Response(JSON.stringify({ message: "Failed to fetch projects" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      },
    },

    "/api/projects/update": {
      async PUT(req) {
        try {
          const updateObject = await req.json();
          await updateProjectProperties(updateObject);
          return Response.json({ message: "Project File Updated" });
        } catch (error) {
          console.error("Error updating projects from API:", error);
          return new Response(JSON.stringify({ message: "Failed to fetch projects" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
