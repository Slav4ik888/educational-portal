/**
 * Отображает или нет стиль sx на основании value
 * @param sx - стиль
 * @param value - значение на основании чего определяется нужно ли показывать стиль
 * @returns
 */
export function cl<Sx, B>(sx: Sx, value: boolean | B): Sx | Record<string, never> {
  return value ? sx : {};
}
