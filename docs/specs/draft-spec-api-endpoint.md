<!-- Пример: спецификация для API endpoint -->

# METHOD /api/path

## Цель
[Что делает эндпоинт]

## Request
```json
{
  "field": "type"
}
```

## Response 200
```json
{
  "field": "type"
}
```

## Ошибки
| Код | Тело | Когда |
|-----|------|-------|
| 400 | {"error": "VALIDATION_ERROR"} | ... |
| 404 | {"error": "NOT_FOUND"} | ... |

## Бизнес-логика
1. Шаг 1
2. Шаг 2

## Ограничения
- Rate limit: X запросов/минуту
- Timeout: X секунд
