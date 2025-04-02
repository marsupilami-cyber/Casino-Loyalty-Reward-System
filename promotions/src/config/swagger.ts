import swaggerJSDoc from "swagger-jsdoc";

const createSwaggerSpec = (version: string, description: string, apiPath: string): swaggerJSDoc.OAS3Options => ({
  definition: {
    openapi: "3.0.0",
    info: {
      title: `Promotions API v${version}`,
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
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: "success" },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        ApiResponseWithMeta: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string", example: "success" },
            data: { type: "object" },
            meta: {
              type: "object",
              properties: {
                page: { type: "integer" },
                limit: { type: "integer" },
                total: { type: "integer" },
              },
            },
          },
        },
        ApiError: {
          description: "Standard API Error Response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  message: { type: "string" },
                  error: {
                    type: "object",
                    properties: {
                      code: { oneOf: [{ type: "string" }, { type: "number" }] },
                      details: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            field: { type: "string" },
                            message: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    servers: [
      {
        url: "http://localhost/promotions",
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

export const swaggerSpecV1 = swaggerJSDoc(createSwaggerSpec("1.0.0", "API for Promotions Application v1", "v1"));
