import { createClient, createRouterTransport } from "@connectrpc/connect";
import type { Log, Overall_Metric, Span } from "@mydecisiveai/octant-client";
import { BudgetService } from "@mydecisiveai/octant-client";
import { transport } from "./transport";

function createMockOverallMetric(
  overrides?: Partial<Overall_Metric>,
): Overall_Metric {
  return {
    received: 120.5,
    sent: 98.3,
    filtered: 22.2,
    costRate: 0.45,
    pct: 62.5,
    cost: 44.24,
    ...overrides,
  } as Overall_Metric;
}

function createMockLogs(count = 50): Log[] {
  return Array.from(
    { length: count },
    (_, i) =>
      ({
        name: `/service-${i + 1}`,
        sent: parseFloat((Math.random() * 100).toFixed(2)),
        pct: parseFloat((Math.random() * 20).toFixed(2)),
        cost: parseFloat((Math.random() * 50).toFixed(2)),
      }) as Log,
  );
}

function createMockSpans(count = 50): Span[] {
  return Array.from(
    { length: count },
    (_, i) =>
      ({
        name: `/trace-root-${i + 1}`,
        breadth: parseFloat((Math.random() * 10).toFixed(2)),
        depth: parseFloat((Math.random() * 8).toFixed(2)),
        invocations: parseFloat((Math.random() * 1000).toFixed(2)),
        cost: parseFloat((Math.random() * 50).toFixed(2)),
      }) as Span,
  );
}

const mockTransport = createRouterTransport(({ service }) => {
  service(BudgetService, {
    overall: (...args) => {
      console.log("BudgetService.overall", args);
      return {
        data: {
          cost: 98.56,
          log: createMockOverallMetric({ pct: 62.5, cost: 44.24 }),
          trace: createMockOverallMetric({ pct: 37.5, cost: 54.32 }),
        },
      };
    },
    log: (...args) => {
      console.log("BudgetService.log", args);
      return {
        data: createMockLogs(10),
        nextPageToken: "",
      };
    },
    trace: (...args) => {
      console.log("BudgetService.trace", args);
      return {
        data: createMockSpans(10),
        nextPageToken: "",
      };
    },
  });
});

export const budgetServiceClient = createClient(
  BudgetService,
  import.meta.env.VITE_USE_MOCKS === "true" ? mockTransport : transport,
);
