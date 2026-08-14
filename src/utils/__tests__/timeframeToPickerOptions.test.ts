import { describe, it, expect } from "vitest";
import {
  timeframeToPickerOptions,
  timeframeLabels,
} from "../timeframeToPickerOptions";
import {
  Timeframe,
  TimeframeStatusResponse_Code,
  type TimeframeStatusResponse_Status,
} from "@mydecisiveai/octant-client";
import { ClarityCopy as cc } from "../../copy/clarity/Clarity.copy";

function makeStatus(
  timeframe: Timeframe,
  status: TimeframeStatusResponse_Code,
): TimeframeStatusResponse_Status {
  return { timeframe, status } as TimeframeStatusResponse_Status;
}

describe("timeframeToPickerOptions", () => {
  it("returns an empty array for empty input", () => {
    expect(timeframeToPickerOptions([])).toEqual([]);
  });

  it("filters out TIMEFRAME_UNSPECIFIED entries", () => {
    const statuses = [
      makeStatus(
        Timeframe.TIMEFRAME_UNSPECIFIED,
        TimeframeStatusResponse_Code.OK,
      ),
    ];

    expect(timeframeToPickerOptions(statuses)).toEqual([]);
  });

  it("maps a 24hr timeframe with OK status", () => {
    const statuses = [
      makeStatus(Timeframe.TIMEFRAME_24HR, TimeframeStatusResponse_Code.OK),
    ];

    expect(timeframeToPickerOptions(statuses)).toEqual([
      {
        value: String(Timeframe.TIMEFRAME_24HR),
        label: timeframeLabels[Timeframe.TIMEFRAME_24HR],
        chip: undefined,
        disabled: false,
      },
    ]);
  });

  it("maps an MTD timeframe with OK status", () => {
    const statuses = [
      makeStatus(Timeframe.TIMEFRAME_MTD, TimeframeStatusResponse_Code.OK),
    ];

    expect(timeframeToPickerOptions(statuses)[0]).toMatchObject({
      value: String(Timeframe.TIMEFRAME_MTD),
      label: cc.timerange.timerangeOptions.T30D,
      disabled: false,
    });
  });

  it("maps a last month timeframe with OK status", () => {
    const statuses = [
      makeStatus(Timeframe.TIMEFRAME_LM, TimeframeStatusResponse_Code.OK),
    ];

    expect(timeframeToPickerOptions(statuses)[0]).toMatchObject({
      value: String(Timeframe.TIMEFRAME_LM),
      label: cc.timerange.timerangeOptions.TP30D,
      disabled: false,
    });
  });

  it("leaves chip undefined and marks disabled for UNSPECIFIED status code", () => {
    const statuses = [
      makeStatus(
        Timeframe.TIMEFRAME_24HR,
        TimeframeStatusResponse_Code.UNSPECIFIED,
      ),
    ];

    expect(timeframeToPickerOptions(statuses)[0]).toMatchObject({
      chip: undefined,
      disabled: true,
    });
  });

  it("sets chip with processing label for NO_DATA status and marks disabled", () => {
    const statuses = [
      makeStatus(
        Timeframe.TIMEFRAME_24HR,
        TimeframeStatusResponse_Code.NO_DATA,
      ),
    ];

    expect(timeframeToPickerOptions(statuses)[0]).toMatchObject({
      chip: {
        label: cc.timerange.status.processing,
        color: "default",
        size: "small",
      },
      disabled: true,
    });
  });

  it("sets chip with processing label for NOT_ENOUGH status and marks disabled", () => {
    const statuses = [
      makeStatus(
        Timeframe.TIMEFRAME_24HR,
        TimeframeStatusResponse_Code.NOT_ENOUGH,
      ),
    ];

    expect(timeframeToPickerOptions(statuses)[0]).toMatchObject({
      chip: {
        label: cc.timerange.status.processing,
        color: "default",
        size: "small",
      },
      disabled: true,
    });
  });

  it("marks disabled false only when status is OK", () => {
    const statuses = [
      makeStatus(Timeframe.TIMEFRAME_24HR, TimeframeStatusResponse_Code.OK),
      makeStatus(Timeframe.TIMEFRAME_MTD, TimeframeStatusResponse_Code.NO_DATA),
    ];

    const result = timeframeToPickerOptions(statuses);

    expect(result[0].disabled).toBe(false);
    expect(result[1].disabled).toBe(true);
  });

  it("preserves order and maps multiple valid statuses", () => {
    const statuses = [
      makeStatus(Timeframe.TIMEFRAME_LM, TimeframeStatusResponse_Code.OK),
      makeStatus(Timeframe.TIMEFRAME_24HR, TimeframeStatusResponse_Code.OK),
      makeStatus(Timeframe.TIMEFRAME_MTD, TimeframeStatusResponse_Code.OK),
    ];

    const result = timeframeToPickerOptions(statuses);

    expect(result.map((r) => r.value)).toEqual([
      String(Timeframe.TIMEFRAME_LM),
      String(Timeframe.TIMEFRAME_24HR),
      String(Timeframe.TIMEFRAME_MTD),
    ]);
  });

  it("filters out unspecified entries while keeping valid ones in a mixed list", () => {
    const statuses = [
      makeStatus(
        Timeframe.TIMEFRAME_UNSPECIFIED,
        TimeframeStatusResponse_Code.OK,
      ),
      makeStatus(Timeframe.TIMEFRAME_24HR, TimeframeStatusResponse_Code.OK),
    ];

    const result = timeframeToPickerOptions(statuses);

    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(String(Timeframe.TIMEFRAME_24HR));
  });
});
