import Ajv from 'ajv';
import { addKeywords, addSchemas, getValidResultByKeywords, isValidSchemaName } from '../utils';
import { SCHEMA_NAME } from '../schemas';
import { Validation } from '../../types';
import addFormats from 'ajv-formats';



const ajv = new Ajv({ allErrors: true, $data: true });

addKeywords(ajv);
addSchemas(ajv);
addFormats(ajv);


export const validate = (
  schemaName : SCHEMA_NAME,
  data       : unknown,
  T?         : string   // Titles // Translate schema  styles.document.structure.dialogTitle
): Validation => {
  const resValidSchema = isValidSchemaName(schemaName, T);
  if (! resValidSchema.valid) return resValidSchema;

  const validate = ajv.getSchema(schemaName);

  if (! validate || ! validate(data)) return getValidResultByKeywords(validate, T)
  return getValidResultByKeywords()
};

//
// Базовую проверку делаем на:
// ---------------------------
//
//  - Тип
//  - Ограничения мин/макс (string / number / array (maxItems))
//  - Отсутствие данных
//  - Присутствие дополнительных данных
//  - If undefined | null | NaN
//  - If empty
//
