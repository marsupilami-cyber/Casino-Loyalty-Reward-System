import swaggerJsdoc from "swagger-jsdoc";

const createSwaggerSpec = (version: string, description: string, apiPath: string) => ({
  definition: {
    openapi: "3.0.0",
    info: {
      title: `Users API v${version}`,
      version,
      description,
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
      {
        url: "https://casino-loyalty.example.com",
        description: "Production Server",
      },
    ],
  },
  apis: [`src/api/${apiPath}/**/*.controller.{ts,js}`],
});

export const swaggerSpecV1 = swaggerJsdoc(createSwaggerSpec("1.0.0", "API for Users Application v1", "v1"));
