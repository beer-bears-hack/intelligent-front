# API Documentation

Base URL: configured via `VITE_API_BASE_URL` environment variable (default: `/api`).

All requests include `X-Session-Id` header automatically when a session exists.

---

## Sessions

### POST /sessions

Create a new session.

- **Source**: `entities/session/model/store.ts` (via Zustand `ensureSession()`)
- **Used by**: App initialization

**Request**: no body

**Response**:

```json
{
  "session_id": "string"
}
```

---

### GET /sessions/{sessionId}

Get session state including cart items.

- **Source**: `entities/session/api/getSession.ts`
- **Used by**: CartPage, AppHeader

**Response**:

```json
{
  "items": [
    {
      "item_id": "string",
      "ste_id": "string | null",
      "name": "string",
      "quantity": 1,
      "unit_price": 100.0,
      "total_price": 100.0,
      "justification_data": {
        "used_contract_ids": [1, 2],
        "manual_prices": [{ "price": 100, "source": "string" }]
      }
    }
  ],
  "total_price": 100.0
}
```

---

### POST /sessions/{sessionId}/items

Add item to cart.

- **Source**: `features/add-to-cart/api/addToCart.ts`
- **Used by**: PriceAnalysisPage

**Request**:

```json
{
  "ste_id": "string | null",
  "name": "string",
  "quantity": 1,
  "unit_price": 100.0,
  "total_price": 100.0,
  "justification_data": {
    "used_contract_ids": [1, 2],
    "manual_prices": [{ "price": 100, "source": "string" }]
  }
}
```

**Response**:

```json
{
  "item_id": "string",
  "cart_total": 200.0
}
```

---

### PUT /sessions/{sessionId}/items/{itemId}

Update a cart item (quantity or price).

- **Source**: `entities/session/api/updateItem.ts`
- **Used by**: CartPage

**Request**:

```json
{
  "quantity": 2,
  "unit_price": 150.0
}
```

**Response**: `204 No Content`

---

### DELETE /sessions/{sessionId}/items/{itemId}

Remove item from cart.

- **Source**: `entities/session/api/deleteItem.ts`
- **Used by**: CartPage

**Response**: `204 No Content`

---

## Search

### POST /search

Search for comparable items (STE).

- **Source**: `entities/ste/api/searchSte.ts`
- **Used by**: SearchPage

**Request**:

```json
{
  "query": "string",
  "region_code": "string (optional)"
}
```

**Response**:

```json
{
  "results": [
    {
      "ste_id": "string",
      "name": "string",
      "characteristics": { "key": "value" },
      "similarity_score": 0.95,
      "category": "string",
      "kpgz_code": "string (optional)",
      "kpgz_name": "string (optional)"
    }
  ]
}
```

---

## Prices

### GET /stes/{steId}/prices

Get price data for a specific STE item.

- **Source**: `entities/price/api/getPrices.ts`
- **Used by**: PriceAnalysisPage

**Query parameters**:
| Parameter | Type | Required | Description |
|-----------|--------|----------|--------------------------------|
| region | string | no | Filter by region |
| period | number | no | Period in months (default: 12) |

**Response**:

```json
{
  "ste_id": "string",
  "prices": [
    {
      "id": 1,
      "price": 1500.0,
      "date": "2026-01-15",
      "source": "string",
      "is_outlier": false,
      "reason": "string (optional, outlier explanation)"
    }
  ]
}
```

---

## Calculation

### POST /calculate/item

Calculate NMCK (initial procurement price) for selected prices.

- **Source**: `entities/calculation/api/calculateItem.ts`
- **Used by**: PriceAnalysisPage

**Request**:

```json
{
  "quantity": 1,
  "selected_price_ids": [1, 2, 3],
  "manual_prices": [{ "price": 100, "source": "string" }],
  "method": "comparable_market_prices"
}
```

`method` values: `comparable_market_prices` | `tariff` | `cost`

**Response**:

```json
{
  "unit_price": 1200.0,
  "total_price": 1200.0,
  "price_range": { "min": 1000.0, "max": 1500.0 },
  "coeff_variation": 0.15,
  "is_homogeneous": true
}
```

---

## Documents

### POST /documents/generate

Generate DOCX justification document.

- **Source**: `entities/document/api/generateDocument.ts`
- **Used by**: DocumentPage

**Request**:

```json
{
  "session_id": "string",
  "settings": {
    "include_cover_page": true,
    "signer_name": "string"
  }
}
```

**Response**:

```json
{
  "file_url": "/documents/download/file.docx",
  "generated_at": "2026-03-13T12:00:00Z"
}
```

---

### GET /documents/download/{filename}

Download generated DOCX file.

- **Source**: `entities/document/api/downloadDocument.ts`
- **Used by**: DocumentPage

**Response**: Binary blob (`application/octet-stream`)
