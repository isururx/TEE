import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import {
  getBlockDiseaseSummary,
  getDiseaseDistribution,
  getDiseaseFrequencyByBlock,
  getPlantationBlocks,
} from "./analyticsApi.js";

const originalFetch = globalThis.fetch;
const originalLocalStorage = globalThis.localStorage;

function setToken(token) {
  const values = new Map(token ? [["token", token]] : []);
  globalThis.localStorage = {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
  };
}

function jsonResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return data;
    },
  };
}

beforeEach(() => {
  setToken("test-access-token");
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalLocalStorage === undefined) {
    delete globalThis.localStorage;
  } else {
    globalThis.localStorage = originalLocalStorage;
  }
});

test("frequency request sends bearer token and selected filters", async () => {
  let requestedUrl;
  let requestedOptions;
  globalThis.fetch = async (url, options) => {
    requestedUrl = url;
    requestedOptions = options;
    return jsonResponse({ summary: { total_detections: 12 }, blocks: [] });
  };

  const result = await getDiseaseFrequencyByBlock({
    start_date: "2026-11-01",
    end_date: "2026-11-27",
    block_id: 2,
    disease_id: "",
    ignored: undefined,
  });

  assert.equal(
    requestedUrl,
    "http://127.0.0.1:8000/api/analytics/disease-frequency-by-block?start_date=2026-11-01&end_date=2026-11-27&block_id=2",
  );
  assert.equal(requestedOptions.method, "GET");
  assert.equal(requestedOptions.headers.Authorization, "Bearer test-access-token");
  assert.equal(result.summary.total_detections, 12);
});

test("disease distribution and block summary use their documented endpoints", async () => {
  const requestedUrls = [];
  globalThis.fetch = async (url) => {
    requestedUrls.push(url);
    return jsonResponse({ disease_distribution: [] });
  };

  await getDiseaseDistribution({ block_id: 1 });
  await getBlockDiseaseSummary({ block_id: 1 });

  assert.match(requestedUrls[0], /\/disease-distribution\?block_id=1$/);
  assert.match(requestedUrls[1], /\/block-disease-summary\?block_id=1$/);
});

test("analytics requests fail clearly when no login token exists", async () => {
  setToken(null);
  let fetchCalled = false;
  globalThis.fetch = async () => {
    fetchCalled = true;
    return jsonResponse({});
  };

  await assert.rejects(
    getDiseaseFrequencyByBlock(),
    /login session is missing/i,
  );
  assert.equal(fetchCalled, false);
});

test("403 API response is surfaced as an authorization error", async () => {
  globalThis.fetch = async () => jsonResponse(
    { detail: "You are not authorized to view this block." },
    403,
  );

  await assert.rejects(
    getDiseaseDistribution({ block_id: 99 }),
    /not authorized/i,
  );
});

test("non-JSON API failures return a safe generic error", async () => {
  globalThis.fetch = async () => ({
    ok: false,
    status: 500,
    async json() {
      throw new Error("not JSON");
    },
  });

  await assert.rejects(
    getDiseaseFrequencyByBlock(),
    /Unable to load disease analytics/i,
  );
});

test("block endpoint rejects unsuccessful responses", async () => {
  globalThis.fetch = async () => jsonResponse({}, 500);
  await assert.rejects(getPlantationBlocks(), /Unable to load plantation blocks/i);
});

test("block endpoint returns an empty list for a non-array payload", async () => {
  globalThis.fetch = async () => jsonResponse({ items: [] });
  assert.deepEqual(await getPlantationBlocks(), []);
});
