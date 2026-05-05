<!-- Пример: спецификация React-компонента
Компонент поиска с автокомплитом: -->

# SearchInput Component

## Цель
Поле поиска с debounce, автокомплитом и клавиатурной навигацией.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | да | - | Текущее значение поля |
| onChange | (value: string) => void | да | - | Вызывается при изменении |
| onSelect | (item: SearchResult) => void | да | - | Вызывается при выборе результата |
| placeholder | string | нет | "Поиск..." | Текст placeholder |
| debounceMs | number | нет | 300 | Задержка debounce в мс |
| minChars | number | нет | 2 | Минимум символов для поиска |
| results | SearchResult[] | нет | [] | Результаты поиска |
| isLoading | boolean | нет | false | Показывать индикатор загрузки |

## Типы

```typescript
interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}
```

## Состояния компонента

1. **Empty** — поле пустое, dropdown закрыт
2. **Typing** — пользователь вводит текст, но < minChars
3. **Searching** — isLoading = true, показан спиннер
4. **Results** — показан dropdown с результатами
5. **NoResults** — поиск завершён, результатов нет
6. **Selected** — элемент выбран, dropdown закрыт

## Клавиатурная навигация

| Клавиша | Действие |
|---------|----------|
| ArrowDown | Следующий результат |
| ArrowUp | Предыдущий результат |
| Enter | Выбрать текущий |
| Escape | Закрыть dropdown |
| Tab | Закрыть dropdown, перейти дальше |

## Edge cases

| Ситуация | Поведение |
|----------|-----------|
| Быстрый ввод | Только последний debounced запрос |
| Результаты пришли после закрытия | Игнорировать |
| isLoading=false, results=[] | Показать "Ничего не найдено" |
| Клик вне компонента | Закрыть dropdown |
| results обновились при открытом dropdown | Обновить список, сбросить выделение |

## Accessibility

- input: role="combobox", aria-expanded, aria-autocomplete="list"
- dropdown: role="listbox"
- каждый результат: role="option", aria-selected
- aria-activedescendant для выбранного элемента

<!-- С такой спецификацией компонент:

Правильно обрабатывает все состояния
Имеет клавиатурную навигацию
Доступен для screen readers
Не ломается на edge cases -->
