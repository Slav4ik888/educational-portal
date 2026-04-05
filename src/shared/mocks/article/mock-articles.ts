/* eslint-disable max-len */
import { Article } from 'entities/article';

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Введение в React Hooks',
    description: 'Изучите основные хуки React и их применение в реальных проектах',
    coverImage: 'https://avatars.mds.yandex.net/i?id=aedf45f63fba3aad245b4adf61ce1d86_l-11506583-images-thumbs&n=13',
    duration: 25,
    difficulty: 'beginner',
    tags: ['React', 'Hooks', 'JavaScript'],
    blocks: [
      {
        id: 'b1',
        type: 'theory',
        content: 'React Hooks появились в версии 16.8 и позволили использовать состояние и другие возможности React без написания классов...',
      },
      {
        id: 'b2',
        type: 'test',
        content: 'Проверьте понимание useState',
        questions: [
          {
            id: 'q1',
            text: 'Какой хук используется для управления состоянием?',
            options: ['useEffect', 'useState', 'useContext', 'useReducer'],
            correctAnswer: 1,
          },
        ],
      },
      {
        id: 'b3',
        type: 'theory',
        content: 'useEffect позволяет выполнять побочные эффекты в функциональных компонентах...',
      },
    ],
    finalTest: [
      {
        id: 'f1',
        text: 'Какой хук заменяет lifecycle методы componentDidMount, componentDidUpdate и componentWillUnmount?',
        options: ['useState', 'useContext', 'useEffect', 'useReducer'],
        correctAnswer: 2,
      },
      {
        id: 'f2',
        text: 'Что из перечисленного является правилом хуков?',
        options: [
          'Вызывать хуки внутри условий',
          'Вызывать хуки в циклах',
          'Вызывать хуки только на верхнем уровне',
          'Вызывать хуки в любом месте',
        ],
        correctAnswer: 2,
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
