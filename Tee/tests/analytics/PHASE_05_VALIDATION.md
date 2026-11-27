# Module 04 · Feature 01 · Phase 05 Validation Checklist

This checklist validates the Phase 04 Disease Analytics dashboard against the existing Phase 01–03 backend implementation. Use real API responses; do not seed fake values into the production database.

## Automated checks

### Backend (run from the TEE-Backend repository root)

```cmd
python -m unittest tests.test_disease_analytics_api
python -m unittest tests.test_detection_phase1
```

The API suite covers:
- Multiple diseases in one block.
- One disease detected in multiple blocks.
- No detections in a selected period.
- Healthy detections separated from disease rankings.
- Unassigned detections counted but not assigned to a block.
- Invalid block and disease IDs.
- Inclusive start/end calendar-day boundaries.
- Invalid date ranges.
- Estate-wide, supervisor block-level, worker and inactive-user access rules.
- Missing authentication.

### Frontend (run from the Tee directory)

```cmd
npm test
npm run build
```

The Node test suite covers:
- Authenticated requests and query-filter serialization.
- Disease distribution and block-summary endpoint paths.
- Missing login token handling.
- Authorization and server-error handling.
- Safe handling of non-JSON error responses.
- Plantation block endpoint failure and unexpected response shape.

## Manual UI and live API checks

Use a running backend with test records and log in with the relevant role.

| Scenario | Expected result |
| --- | --- |
| Admin/Manager opens Disease Analytics | KPI cards and charts display values returned by the API |
| Change date range and apply | Both analytics endpoints receive the selected dates and results refresh |
| Select a block | Both analytics endpoints receive the selected block ID |
| Select a disease | Both analytics endpoints receive the selected disease ID |
| Selected period has no detections | Zero/empty states appear; no sample or random values appear |
| Backend returns 401/403/500 or is unavailable | Error message and Retry appear; previous/mock values are not presented as current results |
| Supervisor opens the page | Only authorised blocks are selectable; a block must be selected before analytics are requested |
| Supervisor selects another supervisor's block by editing the request | Backend rejects the request with 403 |
| Worker opens analytics endpoint | Backend rejects access |
| Dataset includes unassigned detections | Summary counts them, but block charts/tables do not attribute them to any block |
| Dataset includes healthy detections | Healthy KPI is separate; healthy records are excluded from disease rankings |

## Validation record

Record the date, tester, role, backend URL, selected filters, observed result, and any defect. Do not mark the feature fully validated until the automated checks and live UI/API scenarios have been executed successfully.
