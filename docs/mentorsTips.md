# Useful tips from mentor

1. Что касается виджетов: виджеты это не про композицию UI, а про композицию features. Пока у тебя нету features у тебя не будет widgets. А пока нету entities — нету и features.
2. Рекомендую использовать именованные экспорты: [статья](https://medium.com/@ibeanuhillary/default-export-vs-named-export-which-is-better-51faa54a5937). На проекте везде используем именованые импорты.
   Пример структуры компонента

```
  component-name/
    index.tsx
    styles.module.css

  Пример index.tsx:

  import type { FC, ReactNode } from 'react';

  import { cn } from '@/shared/lib/cn';

  import styles from './styles.module.css';

  interface Props {
    className?: string;
    children: ReactNode;
  }

  export const ComponentName: FC<Props> = ({ className }) => {
    return <div className={cn(styles.root, className)}>{children}</div>
  }

```
