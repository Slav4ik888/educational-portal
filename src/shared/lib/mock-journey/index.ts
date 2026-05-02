import { Journey, ActivityAnswers } from 'entities/journey'

export const MOCK_JOURNEY: Journey = {
  id          : 'mock-journey-demo',
  title       : 'Основы HTTP протокола',
  description : 'Познакомьтесь с базовыми концепциями HTTP — протокола, на котором работает весь современный веб.',
  topic       : 'Основы HTTP протокола',
  createdAt   : '2026-01-01T00:00:00.000Z',
  checkpoints : [
    {
      id          : 'mock-cp-1',
      concept     : 'Что такое HTTP',
      order       : 0,
      timeLimit   : 300,
      explanation : `**HTTP (HyperText Transfer Protocol)** — это протокол передачи данных, лежащий в основе World Wide Web. Он определяет, как клиенты (браузеры) запрашивают ресурсы у серверов и как серверы отвечают.

Ключевые характеристики HTTP:
- **Клиент-серверная архитектура**: браузер отправляет запрос, сервер возвращает ответ.
- **Stateless (без состояния)**: каждый запрос независим — сервер не помнит предыдущих запросов.
- **Текстовый протокол**: сообщения передаются в виде текста, их легко читать и отлаживать.
- **Работает поверх TCP/IP**: HTTP использует надёжный транспортный протокол TCP.

Типичный HTTP-запрос выглядит так:
\`\`\`
GET /index.html HTTP/1.1
Host: example.com
\`\`\`

Сервер отвечает заголовками и телом ответа (например, HTML-страницей).`,
      activities  : [
        {
          id             : 'mock-act-mc-1',
          type           : 'multiple-choice',
          text           : 'Что означает аббревиатура HTTP?',
          points         : 10,
          hint           : 'Подумайте, какой тип данных изначально передавался по этому протоколу.',
          options        : [
            'High Transfer Text Protocol',
            'HyperText Transfer Protocol',
            'HyperText Transmission Protocol',
            'Host Text Transfer Protocol',
          ],
          correctAnswers : [1],
          allowMultiple  : false,
          explanation    : 'HTTP расшифровывается как HyperText Transfer Protocol — протокол передачи гипертекста.',
        },
        {
          id            : 'mock-act-tf-1',
          type          : 'true-false',
          text          : 'HTTP является stateless (без состояния) протоколом — сервер не сохраняет информацию между запросами.',
          points        : 10,
          hint          : 'Подумайте, как сайты реализуют корзину в интернет-магазине.',
          correctAnswer : true,
          explanation   : 'Верно. HTTP по своей природе stateless: каждый запрос обрабатывается независимо. Для хранения состояния используются cookies, сессии или токены.',
        },
        {
          id             : 'mock-act-fb-1',
          type           : 'fill-blank',
          text           : 'Заполните пропуски: основные компоненты HTTP',
          points         : 15,
          hint           : 'HTTP — протокол прикладного уровня, расположенный выше транспортного.',
          textWithBlanks : 'HTTP работает поверх протокола [1], который обеспечивает надёжную доставку данных. Каждый HTTP-запрос содержит [2] и необязательное тело.',
          caseSensitive  : false,
          blanks         : [
            { id: 'mock-blank-1-1', correctAnswer: 'TCP', alternatives: ['tcp', 'TCP/IP'] },
            { id: 'mock-blank-1-2', correctAnswer: 'заголовки', alternatives: ['headers', 'header', 'заголовок'] },
          ],
        },
      ],
    },
    {
      id          : 'mock-cp-2',
      concept     : 'HTTP-методы и коды ответов',
      order       : 1,
      timeLimit   : 300,
      explanation : `**HTTP-методы** описывают, что именно клиент хочет сделать с ресурсом:

| Метод   | Назначение                             |
|---------|----------------------------------------|
| GET     | Получить ресурс (только чтение)        |
| POST    | Создать новый ресурс                   |
| PUT     | Полностью заменить ресурс              |
| PATCH   | Частично обновить ресурс               |
| DELETE  | Удалить ресурс                         |

**Коды ответов** сообщают клиенту о результате запроса:
- **2xx** — успех: \`200 OK\`, \`201 Created\`
- **3xx** — перенаправление: \`301 Moved Permanently\`
- **4xx** — ошибка клиента: \`400 Bad Request\`, \`404 Not Found\`, \`401 Unauthorized\`
- **5xx** — ошибка сервера: \`500 Internal Server Error\`

Например, когда браузер запрашивает несуществующую страницу, сервер возвращает **404 Not Found**.`,
      activities  : [
        {
          id             : 'mock-act-mc-2',
          type           : 'multiple-choice',
          text           : 'Какие HTTP-методы принято считать «безопасными» (не изменяют состояние сервера)?',
          points         : 10,
          hint           : 'Безопасные методы только читают данные, ничего не меняя.',
          options        : ['POST', 'GET', 'DELETE', 'HEAD'],
          correctAnswers : [1, 3],
          allowMultiple  : true,
          explanation    : 'GET и HEAD являются безопасными методами: они не изменяют состояние сервера и используются только для получения данных.',
        },
        {
          id             : 'mock-act-fb-2',
          type           : 'fill-blank',
          text           : 'Сопоставьте коды ответов с их значениями',
          points         : 15,
          hint           : 'Вспомните группы кодов: 2xx — успех, 4xx — ошибка клиента.',
          textWithBlanks : 'Код [1] означает успешный ответ сервера. Код [2] — ресурс не найден. Код [3] — ошибка на стороне сервера.',
          caseSensitive  : false,
          blanks         : [
            { id: 'mock-blank-2-1', correctAnswer: '200', alternatives: ['200 ok', '200 OK'] },
            { id: 'mock-blank-2-2', correctAnswer: '404', alternatives: ['404 not found'] },
            { id: 'mock-blank-2-3', correctAnswer: '500', alternatives: ['500 internal server error'] },
          ],
        },
        {
          id                 : 'mock-act-fr-1',
          type               : 'free-response',
          text               : 'Объясните ключевое отличие между методами GET и POST.',
          points             : 20,
          hint               : 'Подумайте о том, где передаются данные и для чего используется каждый метод.',
          evaluationCriteria : 'Ответ должен объяснять: GET используется для получения данных (параметры в URL, нет тела), POST — для отправки данных на сервер (данные в теле запроса). Упоминание идемпотентности или безопасности — плюс.',
          exampleAnswer      : 'GET используется для получения данных с сервера. Параметры передаются в URL. POST используется для отправки данных на сервер (создание ресурса), данные передаются в теле запроса. GET идемпотентен и безопасен, POST — нет.',
        },
      ],
    },
    {
      id          : 'mock-cp-3',
      concept     : 'HTTPS и безопасность',
      order       : 2,
      timeLimit   : 300,
      explanation : `**HTTPS (HTTP Secure)** — это защищённая версия HTTP, использующая шифрование **TLS (Transport Layer Security)**.

Как работает HTTPS:
1. Браузер инициирует соединение с сервером.
2. Сервер предоставляет **SSL/TLS-сертификат** (подтверждает подлинность).
3. Браузер и сервер договариваются о ключах шифрования (**TLS Handshake**).
4. Все данные передаются в зашифрованном виде.

Преимущества HTTPS:
- **Конфиденциальность**: данные нельзя перехватить и прочитать.
- **Целостность**: данные нельзя подменить в процессе передачи.
- **Аутентификация**: клиент знает, что подключён именно к нужному серверу.

HTTP использует порт **80**, HTTPS — порт **443**. Современные браузеры отмечают сайты без HTTPS как «небезопасные».`,
      activities  : [
        {
          id            : 'mock-act-tf-2',
          type          : 'true-false',
          text          : 'HTTPS шифрует все данные между клиентом и сервером с помощью TLS/SSL.',
          points        : 10,
          hint          : 'Вспомните, чем отличается HTTPS от HTTP.',
          correctAnswer : true,
          explanation   : 'Верно. HTTPS использует TLS (ранее SSL) для шифрования трафика, обеспечивая конфиденциальность и целостность данных.',
        },
        {
          id             : 'mock-act-mc-3',
          type           : 'multiple-choice',
          text           : 'Какой порт использует HTTPS по умолчанию?',
          points         : 10,
          hint           : 'HTTP использует порт 80.',
          options        : ['80', '443', '8080', '8443'],
          correctAnswers : [1],
          allowMultiple  : false,
          explanation    : 'HTTPS по умолчанию работает на порту 443. Порт 80 используется обычным HTTP.',
        },
        {
          id                 : 'mock-act-tb-1',
          type               : 'teach-back',
          text               : 'Объясни другу, который ничего не знает о веб-разработке, зачем нужен HTTPS и чем он отличается от HTTP.',
          points             : 25,
          hint               : 'Используй простые аналогии из реальной жизни.',
          evaluationCriteria : 'Объяснение должно быть понятным без технических знаний. Должна быть передана суть: HTTPS шифрует данные (никто не может подслушать), в отличие от HTTP. Желательна аналогия (например, открытка vs. запечатанное письмо).',
          forbiddenTerms     : ['TLS handshake', 'PKI', 'cipher suite'],
        },
      ],
    },
  ],
}

export const MOCK_ANSWERS: ActivityAnswers = {
  'mock-act-mc-1': {
    activityId : 'mock-act-mc-1',
    type       : 'multiple-choice',
    value      : [1],
  },
  'mock-act-tf-1': {
    activityId : 'mock-act-tf-1',
    type       : 'true-false',
    value      : true,
  },
  'mock-act-fb-1': {
    activityId : 'mock-act-fb-1',
    type       : 'fill-blank',
    value      : { 'mock-blank-1-1': 'TCP', 'mock-blank-1-2': 'заголовки' },
  },
  'mock-act-mc-2': {
    activityId : 'mock-act-mc-2',
    type       : 'multiple-choice',
    value      : [1, 3],
  },
  'mock-act-fb-2': {
    activityId : 'mock-act-fb-2',
    type       : 'fill-blank',
    value      : { 'mock-blank-2-1': '200', 'mock-blank-2-2': '404', 'mock-blank-2-3': '500' },
  },
  'mock-act-fr-1': {
    activityId     : 'mock-act-fr-1',
    type           : 'free-response',
    value          : 'GET используется для получения данных с сервера. Параметры передаются в URL, тела запроса нет. POST используется для отправки данных на сервер — например, для создания нового ресурса. Данные передаются в теле запроса. GET является идемпотентным и безопасным методом, POST — нет.',
    aiScore        : 95,
    aiFeedback     : 'Отличный ответ! Вы чётко описали оба метода и их ключевые различия.',
    aiStrengths    : 'Точное объяснение передачи параметров. Корректное упоминание идемпотентности.',
    aiImprovements : 'Можно добавить примеры реальных сценариев использования каждого метода.',
    isEvaluated    : true,
  },
  'mock-act-tf-2': {
    activityId : 'mock-act-tf-2',
    type       : 'true-false',
    value      : true,
  },
  'mock-act-mc-3': {
    activityId : 'mock-act-mc-3',
    type       : 'multiple-choice',
    value      : [1],
  },
  'mock-act-tb-1': {
    activityId     : 'mock-act-tb-1',
    type           : 'teach-back',
    value          : 'Представь, что ты отправляешь открытку по почте — любой почтальон может её прочитать. Это как HTTP: данные между тобой и сайтом передаются открыто, и кто угодно в сети может их перехватить и прочитать. HTTPS — это как отправить то же письмо, но в запечатанном конверте с замком, ключ от которого есть только у тебя и получателя. Все данные зашифрованы, и даже если кто-то перехватит письмо — он увидит только бессмысленный набор символов.',
    aiScore        : 98,
    aiFeedback     : 'Превосходное объяснение! Аналогия с открыткой и запечатанным письмом идеально передаёт суть.',
    aiStrengths    : 'Отличная аналогия, доступная любому человеку. Чётко показана разница между HTTP и HTTPS.',
    aiImprovements : 'Можно упомянуть, что HTTPS также подтверждает подлинность сайта.',
    isEvaluated    : true,
  },
}
