import { FC } from 'react';
import { isNotUndefined, isUndefined } from 'shared/lib/validators';
import { Loader } from 'shared/ui/loader';
import './index.scss';



interface Props {
  loading?: boolean
}

export const PageLoader: FC<Props> = ({ loading }) => {
  if (isUndefined(loading) || (isNotUndefined(loading) && loading)) {
    return <div className='page-loader'>
      <div className='loading'>Загрузка...</div>
      <Loader />
    </div>
  }
  else return <></>;
}
