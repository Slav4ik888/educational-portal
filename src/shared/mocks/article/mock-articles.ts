/* eslint-disable max-len */
import { Article } from 'entities/article';

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Введение в React Hooks',
    description: 'Изучите основные хуки React и их применение в реальных проектах',
    coverImage: 'https://avatars.mds.yandex.net/i?id=aedf45f63fba3aad245b4adf61ce1d86_l-11506583-images-thumbs&n=13',
    duration: 35,
    difficulty: 'beginner',
    tags: ['React', 'Hooks', 'JavaScript'],
    blocks: [
      {
        id: 'b1',
        type: 'theory',
        content: '**Что такое React Hooks?** Hooks — это функции, которые позволяют "подцепиться" к состоянию и методам жизненного цикла React из функциональных компонентов. До появления Hooks в версии 16.8 (февраль 2019) сложная логика состояния требовала использования классовых компонентов, что делало код более громоздким и усложняло повторное использование логики между компонентами. Hooks решают эти проблемы, позволяя писать чистые функции с внутренним состоянием.',
      },
      {
        id: 'b2',
        type: 'test',
        content: 'Проверьте понимание базовой концепции хуков',
        questions: [
          {
            id: 'q1',
            text: 'В какой версии React появились Hooks?',
            options: ['15.0', '16.8', '17.0', '18.0'],
            correctAnswer: 1,
          },
          {
            id: 'q2',
            text: 'Для чего предназначены Hooks?',
            options: [
              'Только для работы с сервером',
              'Для использования состояния и lifecycle в функциональных компонентах',
              'Для замены JSX',
              'Для стилизации компонентов',
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        id: 'b3',
        type: 'theory',
        content: '**useState — первый шаг в мир состояния.** Это самый базовый хук. Он возвращает массив из двух элементов: текущее значение состояния и функцию для его обновления. Пример: `const [count, setCount] = useState(0)`. При вызове `setCount` компонент перерендеривается, а `count` получает новое значение. В отличие от `this.setState` в классах, состояние в хуках не объединяется автоматически, поэтому для объектов используйте оператор spread.',
      },
      {
        id: 'b4',
        type: 'test',
        content: 'Проверьте знание хука useState',
        questions: [
          {
            id: 'q3',
            text: 'Что возвращает вызов useState(initialValue)?',
            options: [
              'Объект с состоянием',
              'Массив [значение, функция для обновления]',
              'Только текущее значение',
              'Промис',
            ],
            correctAnswer: 1,
          },
          {
            id: 'q4',
            text: 'Что произойдет при вызове setCount(newValue)?',
            options: [
              'Мутирует состояние напрямую',
              'Вызовет ошибку',
              'Вызовет перерендер компонента с новым значением',
              'Ничего не произойдет',
            ],
            correctAnswer: 2,
          },
        ],
      },
      {
        id: 'b5',
        type: 'theory',
        content: '**useEffect — работа с побочными эффектами.** Этот хук заменяет методы жизненного цикла: `componentDidMount`, `componentDidUpdate` и `componentWillUnmount`. По умолчанию эффект выполняется после каждого рендера. Чтобы контролировать запуск, передайте массив зависимостей вторым аргументом: `useEffect(() => {...}, [deps])`. Пустой массив `[]` означает, что эффект выполнится только при монтировании. Функция очистки (return) выполняется при размонтировании или перед следующим эффектом.',
      },
      {
        id: 'b6',
        type: 'test',
        content: 'Проверьте понимание useEffect',
        questions: [
          {
            id: 'q5',
            text: 'Как сделать так, чтобы useEffect выполнился только один раз при монтировании?',
            options: [
              'Передать [props]',
              'Передать [state]',
              'Передать [] (пустой массив)',
              'Не передавать второй аргумент',
            ],
            correctAnswer: 2,
          },
          {
            id: 'q6',
            text: 'Где возвращается функция очистки в useEffect?',
            options: [
              'В начале эффекта',
              'В конце эффекта через return',
              'В отдельном блоке catch',
              'Она не нужна',
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        id: 'b7',
        type: 'theory',
        content: '**useContext — глобальное состояние без prop drilling.** Этот хук позволяет читать значение контекста и подписываться на его изменения. Вместо обертки в Consumer, вы просто вызываете `useContext(MyContext)`. Это значительно упрощает передачу данных через глубокие деревья компонентов (например, тема приложения, язык, данные аутентифицированного пользователя). Компонент автоматически перерендерится при изменении значения контекста.',
      },
      {
        id: 'b8',
        type: 'test',
        content: 'Проверьте знание useContext',
        questions: [
          {
            id: 'q7',
            text: 'Какой паттерн заменяет useContext?',
            options: ['Prop drilling', 'HOC', 'Render Props', 'Композиция'],
            correctAnswer: 0,
          },
          {
            id: 'q8',
            text: 'Что нужно импортировать для создания контекста?',
            options: ['useContext', 'createContext', 'useState', 'React.memo'],
            correctAnswer: 1,
          },
        ],
      },
      {
        id: 'b9',
        type: 'theory',
        content: '**Правила хуков и пользовательские хуки.** Есть два железных правила: 1) Вызывайте хуки только на верхнем уровне (не внутри циклов, условий или вложенных функций), чтобы React мог правильно сохранять порядок вызовов между рендерами. 2) Вызывайте хуки только из React-функций (компонентов или кастомных хуков). Кастомные хуки — это функции, имя которых начинается с `use`, и внутри которых используются другие хуки. Они позволяют выносить сложную логику состояния в переиспользуемые модули.',
      },
      {
        id: 'b10',
        type: 'test',
        content: 'Финальный блок по правилам и кастомным хукам',
        questions: [
          {
            id: 'q9',
            text: 'Можно ли вызвать хук внутри условия if?',
            options: ['Да, всегда', 'Нет, это нарушает правила', 'Только в dev-режиме', 'Только для useEffect'],
            correctAnswer: 1,
          },
          {
            id: 'q10',
            text: 'С какого префикса должно начинаться имя кастомного хука?',
            options: ['get', 'with', 'use', 'custom'],
            correctAnswer: 2,
          },
        ],
      },
    ],
    finalTest: [
      {
        id: 'f1',
        text: 'Какой хук используется для управления состоянием в функциональном компоненте?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 1,
      },
      {
        id: 'f2',
        text: 'Какой хук заменяет lifecycle методы componentDidMount, componentDidUpdate и componentWillUnmount?',
        options: ['useState', 'useContext', 'useEffect', 'useReducer'],
        correctAnswer: 2,
      },
      {
        id: 'f3',
        text: 'Что из перечисленного является правилом хуков?',
        options: [
          'Вызывать хуки внутри условий',
          'Вызывать хуки в циклах',
          'Вызывать хуки только на верхнем уровне',
          'Вызывать хуки в любом месте',
        ],
        correctAnswer: 2,
      },
      {
        id: 'f4',
        text: 'Как передать зависимости в useEffect для отслеживания изменений?',
        options: ['В первом аргументе', 'Через второй аргумент (массив)', 'Через третий аргумент', 'Зависимости не нужны'],
        correctAnswer: 1,
      },
      {
        id: 'f5',
        text: 'Что произойдет, если не указать массив зависимостей во втором аргументе useEffect?',
        options: [
          'Эффект не выполнится никогда',
          'Эффект выполнится только один раз',
          'Эффект будет выполняться после каждого рендера',
          'Будет ошибка компиляции',
        ],
        correctAnswer: 2,
      },
      {
        id: 'f6',
        text: 'Как получить доступ к значению контекста в функциональном компоненте?',
        options: ['this.context', 'props.context', 'useContext(MyContext)', 'Consumer component'],
        correctAnswer: 2,
      },
      {
        id: 'f7',
        text: 'Что возвращает useReducer?',
        options: [
          'Только текущее состояние',
          'Массив [state, dispatch]',
          'Объект {state, dispatch}',
          'Промис с состоянием',
        ],
        correctAnswer: 1,
      },
      {
        id: 'f8',
        text: 'Для чего используется хук useMemo?',
        options: [
          'Для мемоизации функций',
          'Для мемоизации вычисляемых значений',
          'Для работы с DOM',
          'Для создания ref',
        ],
        correctAnswer: 1,
      },
      {
        id: 'f9',
        text: 'Какой хук позволяет получить изменяемый объект, который сохраняется между рендерами и не вызывает перерендер при изменении?',
        options: ['useState', 'useEffect', 'useRef', 'useCallback'],
        correctAnswer: 2,
      },
      {
        id: 'f10',
        text: 'Что такое кастомный хук?',
        options: [
          'Встроенный хук React',
          'Функция, начинающаяся с "use", вызывающая другие хуки',
          'Классовый компонент',
          'HOC компонент',
        ],
        correctAnswer: 1,
      },
    ],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'TypeScript для начинающих',
    description: 'Освойте основы статической типизации в JavaScript',
    coverImage: 'https://avatars.mds.yandex.net/i?id=727f4631823b878f8e997d176225b848_l-4855126-images-thumbs&n=13',
    duration: 30,
    difficulty: 'beginner',
    tags: ['TypeScript', 'JavaScript', 'Types'],
    blocks: [
      {
        id: 'b1',
        type: 'theory',
        content: 'TypeScript - это надмножество JavaScript, которое добавляет статическую типизацию...',
      },
    ],
    finalTest: [
      {
        id: 'f1',
        text: 'Какой символ используется для опциональных свойств в TypeScript?',
        options: ['!', '?', ':', ';'],
        correctAnswer: 1,
      },
    ],
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    title: 'Redux Toolkit в действии',
    description: 'Управление состоянием приложения с Redux Toolkit',
    coverImage: 'https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fvgtl8btr702bcx44w3od.jpg',
    duration: 35,
    difficulty: 'intermediate',
    tags: ['Redux', 'State Management', 'React'],
    blocks: [
      {
        id: 'b1',
        type: 'theory',
        content: 'Redux Toolkit упрощает работу с Redux и включает лучшие практики из коробки...',
      },
    ],
    finalTest: [
      {
        id: 'f1',
        text: 'Какой метод Redux Toolkit используется для создания slice?',
        options: ['createSlice', 'createReducer', 'createAction', 'configureStore'],
        correctAnswer: 0,
      },
    ],
    createdAt: '2024-01-25',
  },
];
