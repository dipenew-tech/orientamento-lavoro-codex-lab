import { z } from 'zod';

export const roleSchema = z.enum(['lettore', 'operatore', 'amministratore']);
export type Role = z.infer<typeof roleSchema>;
export const memberSchema = z.object({ role: roleSchema, active: z.boolean() }).strict();
export const serviceSchema = z.object({
  id: z.string().regex(/^demo-[a-z0-9-]+$/), name: z.string().min(1).max(120),
  description: z.string().min(1).max(1000), area: z.enum(['AREA-DEMO-A', 'AREA-DEMO-B']),
  access: z.string().min(1).max(500), email: z.string().endsWith('@example.invalid'),
  fictional: z.literal(true), version: z.number().int().positive()
}).strict();
export const patchSchema = serviceSchema.pick({ description: true, access: true }).partial()
  .refine(value => Object.keys(value).length > 0, 'Empty patch');
export const proposalInput = z.object({ serviceId: serviceSchema.shape.id,
  baseVersion: z.number().int().positive(), patch: patchSchema }).strict();
export const proposalSchema = proposalInput.extend({
  id: z.string().uuid(), authorUid: z.string().regex(/^demo-/),
  status: z.enum(['pending', 'approved']), createdAt: z.string().datetime(),
  approvedBy: z.string().regex(/^demo-/).optional(), approvedAt: z.string().datetime().optional()
}).strict();
export const historySchema = z.object({ id: z.string().uuid(), proposalId: z.string().uuid(),
  serviceId: serviceSchema.shape.id, before: serviceSchema, after: serviceSchema,
  approvedBy: z.string().regex(/^demo-/), approvedAt: z.string().datetime() }).strict();
export const archiveSchema = z.object({ format: z.literal('caritas-local-poc-v1'),
  projectId: z.literal('demo-caritas-local'), fictionalOnly: z.literal(true),
  collections: z.object({
    services: z.array(serviceSchema).max(100),
    memberships: z.array(memberSchema.extend({ id: z.string().regex(/^demo-/) })).max(100),
    proposals: z.array(proposalSchema).max(500), history: z.array(historySchema).max(500)
  }).strict()
}).strict();
