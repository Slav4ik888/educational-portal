
export function getSlug(name: string = '') {
  return name
    .toLowerCase()
    .replace(/[^\w]/g, '') // Удаляем спецсимволы
    .trim()
    .replace(/\s+/g, '-');   // Заменяем пробелы на дефисы
}

// generateSlug('ACME Inc.'); // 'acme-inc'
