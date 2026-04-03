import { FC, memo } from 'react';
import './page-error.scss';



export const PageError: FC = memo(() => {
  const handlerReloadPage = () => {
    location.reload();
  };

  return (
    <div className='rootDir'>
      <p>Произошла непредвиденная ошибка</p>
      <button onClick={handlerReloadPage}>
        Обновить страницу
      </button>
    </div>
  )
});
