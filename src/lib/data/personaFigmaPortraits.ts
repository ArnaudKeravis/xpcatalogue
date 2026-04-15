/**
 * Portrait image URLs from Labs “Personae Description” frames (Figma MCP `get_design_context`).
 * These are temporary CDN URLs (~7 days); export to `public/images/catalogue/figma/personas/` for permanence.
 */

export const PERSONA_FIGMA_PORTRAIT_URL: Record<string, string> = {
  'client-work': 'https://www.figma.com/api/mcp/asset/f25fa316-9704-4e4e-8dc1-2939343053ee',
  'operator-work': 'https://www.figma.com/api/mcp/asset/6fa3c8d2-c031-4423-9743-c62d1431823d',
  'white-collar': 'https://www.figma.com/api/mcp/asset/497175fa-5bd6-480c-8e7b-df467caeb5e5',
  /** Fallback only — catalogue uses `public/images/catalogue/figma/work-blue-collar.png` on the persona. */
  'blue-collar': 'https://www.figma.com/api/mcp/asset/cdd35c53-619e-49e2-bfaa-4fd784c498e7',
  'grey-collar': 'https://www.figma.com/api/mcp/asset/ed43d555-3f07-4534-a195-bb6ca4edc840',
  military: 'https://www.figma.com/api/mcp/asset/c94fd5c8-50b1-4268-a5c1-31c12044241d',
  'client-heal': 'https://www.figma.com/api/mcp/asset/6f5c93eb-e829-4f47-a042-fade9d2595fe',
  'operator-heal': 'https://www.figma.com/api/mcp/asset/75820c0d-b839-41b4-92ee-28c8b4125858',
  doctor: 'https://www.figma.com/api/mcp/asset/fa72de2e-4491-469e-8ba9-46ecd2bfa696',
  senior: 'https://www.figma.com/api/mcp/asset/60d73aa4-6ed3-4645-9c97-596a29fbba0d',
  patient: 'https://www.figma.com/api/mcp/asset/669a61e6-af12-454a-a1bf-238ee79fa85b',
  nurse: 'https://www.figma.com/api/mcp/asset/57d2ffa0-7cfa-442f-96a6-788bb4c0c405',
  'client-play': 'https://www.figma.com/api/mcp/asset/4e3b8400-eeae-4264-82b1-f771a0405fe6',
  'operator-play': 'https://www.figma.com/api/mcp/asset/23f2ebd9-812c-4aa4-ae9d-0659dad52178',
  'sport-fan': 'https://www.figma.com/api/mcp/asset/98099f4f-a92f-4b98-a7cd-72030553edce',
  'vip-guest': 'https://www.figma.com/api/mcp/asset/f8819839-b1c3-4665-b2ea-f53a76204c96',
  participant: 'https://www.figma.com/api/mcp/asset/6efca8a2-9543-43b4-974b-92dda58fbb47',
  tourist: 'https://www.figma.com/api/mcp/asset/6f2f58c9-c1b9-45b4-b3fb-8245b76ce610',
  'client-learn': 'https://www.figma.com/api/mcp/asset/94c502d9-12e5-4b8d-8d7d-7ef15dcf0f3d',
  'operator-learn': 'https://www.figma.com/api/mcp/asset/4677f3ea-e6f3-4642-91ef-dbab9c20ea74',
  student: 'https://www.figma.com/api/mcp/asset/f0c9ddf1-bde9-4e97-97ea-cbe214c13786',
  schoolchild: 'https://www.figma.com/api/mcp/asset/8e178ffb-498a-4736-b6fa-75c2fdf4b59c',
  /** Figma frames 1635:133465 / 1635:133442 label Parent/Teacher swapped — mapped to catalogue roles. */
  parent: 'https://www.figma.com/api/mcp/asset/baa08142-cf4a-47f7-a254-bb0aad319714',
  teacher: 'https://www.figma.com/api/mcp/asset/5490a5d7-f4b2-450a-8b57-8a476e6185a0',
};
