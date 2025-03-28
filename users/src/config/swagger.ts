import swaggerJSDoc from "swagger-jsdoc";

const createSwaggerSpec = (version: string, description: string, apiPath: string): swaggerJSDoc.OAS3Options => ({
  definition: {
    openapi: "3.0.0",
    info: {
      title: `Users API v${version}`,
      version,
      description,
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          in: "header",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
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
  apis: [`src/api/${apiPath}/**/*.controller.{ts,js}`, `src/api/${apiPath}/**/*.dto.{ts,js}`],
});

export const swaggerSpecV1 = swaggerJSDoc(createSwaggerSpec("1.0.0", "API for Users Application v1", "v1"));
