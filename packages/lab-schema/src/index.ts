import { z } from "zod";

export const ResourceType = z.enum([
  "official-docs",
  "related-topic",
  "search-term",
  "video",
  "article",
]);

export type ResourceType = z.infer<typeof ResourceType>;

export const Resource = z.object({
  type: ResourceType,
  title: z.string().min(1),
  url: z.string().url().optional(),
  description: z.string().optional(),
});

export type Resource = z.infer<typeof Resource>;

export const LabMode = z.enum([
  "containerlab",
  "quiz",
  "physical-auto",
  "physical-manual",
]);

export type LabMode = z.infer<typeof LabMode>;

export const Difficulty = z.enum([
  "easy",
  "medium",
  "hard",
  "exam",
]);

export type Difficulty = z.infer<typeof Difficulty>;

export const ValidationType = z.enum([
  "automatic",
  "manual",
  "quiz",
  "mixed",
]);

export type ValidationType = z.infer<typeof ValidationType>;

export const Validation = z.object({
  type: ValidationType,
});

export type Validation = z.infer<typeof Validation>;

export const Router = z.object({
  name: z.string().min(1),
  winboxPort: z.number().int().min(1).max(65535).optional(),
  sshPort: z.number().int().min(1).max(65535).optional(),
  webfigPort: z.number().int().min(1).max(65535).optional(),
  username: z.string().min(1),
  password: z.string().min(1),
});

export type Router = z.infer<typeof Router>;

export const Hardware = z.object({
  required: z.boolean(),
  deviceType: z.enum(["mikrotik-wireless-router"]).optional(),
  knownModel: z.string().optional(),
  connectionMode: z.enum(["same-lan", "direct-ethernet", "manual"]).optional(),
});

export type Hardware = z.infer<typeof Hardware>;

export const LabManifest = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  track: z.enum(["MTCNA", "MTCRE"]),
  mode: LabMode,
  difficulty: Difficulty,
  estimatedMinutes: z.number().int().min(1),
  topics: z.array(z.string().min(1)),
  resources: z.array(Resource),
  objectives: z.array(z.string().min(1)),
  prerequisites: z.array(z.string().min(1)).optional(),
  routers: z.array(Router).optional(),
  validation: Validation,
  hardware: Hardware.optional(),
});

export type LabManifest = z.infer<typeof LabManifest>;

export function parseLabManifest(input: unknown): LabManifest {
  return LabManifest.parse(input);
}
