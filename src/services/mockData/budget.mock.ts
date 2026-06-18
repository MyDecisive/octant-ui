import { createRouterTransport } from "@connectrpc/connect";
import type { Log, Overall_Metric, Span } from "@mydecisiveai/octant-client";
import { BudgetService, Timeframe } from "@mydecisiveai/octant-client";
import { getStringEnv } from "@utils/getStringEnv";

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

const MOCK_LOG_COSTS = [
  11.13, 8.79, 7.24, 6.32, 5.48, 4.52, 3.74, 3.12, 2.35, 1.63,
];
const MOCK_TRACE_COSTS = [
  9.21, 7.14, 5.88, 5.21, 4.37, 3.96, 3.12, 2.55, 1.74, 1.06,
];
const MOCK_RATE = 0.45;
const MOCK_LOG_SAMPLE_RATE = 25;
const MOCK_TRACE_SAMPLE_RATE = 10;
const MOCK_LOG_COST_TOTAL = sumCosts(MOCK_LOG_COSTS);
const MOCK_TRACE_COST_TOTAL = sumCosts(MOCK_TRACE_COSTS);

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}

function sumCosts(costs: number[]) {
  return roundToTwo(costs.reduce((sum, cost) => sum + cost, 0));
}

function shouldShowEmpty24HourMockData(timeframe: Timeframe) {
  return (
    getStringEnv(import.meta.env.VITE_BUDGET_MOCK_EMPTY_24HR) === "true" &&
    timeframe === Timeframe.TIMEFRAME_24HR
  );
}

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
    costRate: MOCK_RATE,
    pct: 44.88,
    cost: MOCK_LOG_COST,
    ...overrides,
  } as Overall_Metric;
}

function createEmptyMockOverallMetric(): Overall_Metric {
  return createMockOverallMetric({
    received: 0,
    sent: 0,
    filtered: 0,
    pct: 0,
    cost: 0,
  });
}

function scaleRowCost(cost: number, multiplier: number) {
  return roundToTwo(cost * multiplier);
}

function costToSent(cost: number) {
  return roundToTwo(cost / MOCK_RATE);
}

function sentToReceived(sent: number, sampleRate: number) {
  return roundToTwo(sent / (sampleRate / 100));
}

function costToPct(cost: number, total: number) {
  return roundToTwo((cost / total) * 100);
}

function createMockLogs(multiplier: number): Log[] {
  const pickRandomishServiceName = makePickRandomishString(
    SERVICE_NAMES_FOR_MOCK,
  );
  const totalCost = scaleRowCost(MOCK_LOG_COST, multiplier);

  return MOCK_LOG_COSTS.map((cost, index) => {
    const scaledCost = scaleRowCost(cost, multiplier);

    return {
      name: pickRandomishServiceName(index),
      sent: costToSent(scaledCost),
      pct: costToPct(scaledCost, totalCost),
      cost: scaledCost,
    } as Log;
  });
}

function createMockSpans(multiplier: number): Span[] {
  const pickRandomishRootSpan = makePickRandomishString(SPAN_NAMES_FOR_MOCK);

  return MOCK_TRACE_COSTS.map((cost, index) => {
    const scaledCost = scaleRowCost(cost, multiplier);
    const invocations = costToSent(scaledCost);

    return {
      name: pickRandomishRootSpan(index),
      breadth: roundToTwo(1.6 + (index % 5) * 0.74),
      depth: roundToTwo(2.1 + (index % 4) * 0.58),
      invocations,
      cost: scaledCost,
    } as Span;
  });
}

export const mockTransport = createRouterTransport(({ service }) => {
  service(BudgetService, {
    overall: (request) => {
      console.log("BudgetService.overall", request);
      const multiplier = request.timeframe === Timeframe.TIMEFRAME_MTD ? 30 : 1;
      const isEmpty = shouldShowEmpty24HourMockData(request.timeframe);
      const logCost = isEmpty ? 0 : scaleRowCost(MOCK_LOG_COST, multiplier);
      const traceCost = isEmpty
        ? 0
        : scaleRowCost(MOCK_TRACE_COST, multiplier);
      const totalCost = roundToTwo(logCost + traceCost);
      const logSent = costToSent(logCost);
      const traceSent = costToSent(traceCost);
      const logReceived = sentToReceived(logSent, MOCK_LOG_SAMPLE_RATE);
      const traceReceived = sentToReceived(traceSent, MOCK_TRACE_SAMPLE_RATE);

      return {
        data: {
          cost: totalCost,
          log: isEmpty
            ? createEmptyMockOverallMetric()
            : createMockOverallMetric({
                received: logReceived,
                sent: logSent,
                filtered: roundToTwo(logReceived - logSent),
                pct: costToPct(logCost, totalCost),
                cost: logCost,
              }),
          trace: isEmpty
            ? createEmptyMockOverallMetric()
            : createMockOverallMetric({
                received: traceReceived,
                sent: traceSent,
                filtered: roundToTwo(traceReceived - traceSent),
                pct: costToPct(traceCost, totalCost),
                cost: traceCost,
              }),
        },
      };
    },
    log: (request) => {
      console.log("BudgetService.log", request);

      if (shouldShowEmpty24HourMockData(request.timeframe)) {
        return {
          data: [],
          nextPageToken: "",
        };
      }

      return {
        data: createMockLogs(
          request.timeframe === Timeframe.TIMEFRAME_MTD ? 30 : 1,
        ),
        nextPageToken: "",
      };
    },
    trace: (request) => {
      console.log("BudgetService.trace", request);

      if (shouldShowEmpty24HourMockData(request.timeframe)) {
        return {
          data: [],
          nextPageToken: "",
        };
      }

      return {
        data: createMockSpans(
          request.timeframe === Timeframe.TIMEFRAME_MTD ? 30 : 1,
        ),
        nextPageToken: "",
      };
    },
  });
});
