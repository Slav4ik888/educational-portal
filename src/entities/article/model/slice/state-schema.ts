import { Article } from '../../types';
import { Errors } from 'shared/lib/validators';


export interface StateSchemaArticle {
  loading        : boolean
  errors         : Errors
  articles       : Article[]
  currentArticle : Article | null
  isLoading      : boolean
}
