import { createClient, createRouterTransport } from "@connectrpc/connect";
import type { Log, Overall_Metric, Span } from "@mydecisiveai/octant-client";
import { BudgetService, Timeframe } from "@mydecisiveai/octant-client";
import { transport } from "./transport";

const SERVICE_NAMES_FOR_MOCK = [
  "catalog-service",
  "product-service",
  "search-service",
  "user-service",
  "auth-service",
  "cart-service",
  "checkout-service",
  "pricing-service",
  "promotion-service",
  "tax-service",
  "inventory-service",
  "shipping-service",
  "payment-service",
  "fraud-service",
  "order-service",
  "notification-service",
  "fulfillment-service",
  "returns-service",
  "refund-service",
  "customer-service",
];

const SPAN_NAMES_FOR_MOCK = [
  "/apiv1/catalog/browse",
  "/apiv1/product/details",
  "/apiv1/product/search",
  "/apiv1/user/profile",
  "/apiv1/user/login",
  "/apiv1/cart/add-item",
  "/apiv1/checkout/start",
  "/apiv1/checkout/pricing",
  "/apiv1/checkout/promo",
  "/apiv1/checkout/tax",
  "/apiv1/product/availability",
  "/apiv1/checkout/shipping",
  "/apiv1/checkout/payment",
  "/apiv1/checkout/fraud-check",
  "/apiv1/order/create",
  "/apiv1/order/confirmation",
  "/apiv1/order/fulfillment",
  "/apiv1/return/request",
  "/apiv1/refund/process",
  "/apiv1/customer/support",
];

function makePickRandomishString(arr: string[]) {
  return function (seed: number) {
    const hash = Math.abs(Math.sin(seed * 9301 + 49297) * 233280);
    return arr[Math.floor(hash % arr.length)];
  };
}

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
  const pickRandomishServiceName = makePickRandomishString(
    SERVICE_NAMES_FOR_MOCK,
  );
  return Array.from(
    { length: count },
    (_, i) =>
      ({
        name: pickRandomishServiceName(i),
        sent: parseFloat((Math.random() * 100).toFixed(2)),
        pct: parseFloat((Math.random() * 20).toFixed(2)),
        cost: parseFloat((Math.random() * 50).toFixed(2)),
      }) as Log,
  );
}

function createMockSpans(count = 50): Span[] {
  const pickRandomishRootSpan = makePickRandomishString(SPAN_NAMES_FOR_MOCK);
  return Array.from(
    { length: count },
    (_, i) =>
      ({
        name: pickRandomishRootSpan(i),
        breadth: parseFloat((Math.random() * 10).toFixed(2)),
        depth: parseFloat((Math.random() * 8).toFixed(2)),
        invocations: parseFloat((Math.random() * 1000).toFixed(2)),
        cost: parseFloat((Math.random() * 50).toFixed(2)),
      }) as Span,
  );
}

const mockTransport = createRouterTransport(({ service }) => {
  service(BudgetService, {
    overall: (request) => {
      console.log("BudgetService.overall", request);
      const multiplier =
        request.timeframe === Timeframe.TIMEFRAME_MTD ? 12 : 1;

      return {
        data: {
          cost: 98.56 * multiplier,
          log: createMockOverallMetric({
            received: 120.5 * multiplier,
            sent: 98.3 * multiplier,
            filtered: 22.2 * multiplier,
            pct: 62.5,
            cost: 44.24 * multiplier,
          }),
          trace: createMockOverallMetric({
            received: 120.5 * multiplier,
            sent: 98.3 * multiplier,
            filtered: 22.2 * multiplier,
            pct: 37.5,
            cost: 54.32 * multiplier,
          }),
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
