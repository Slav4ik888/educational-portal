import Ajv from 'ajv';
import { defsCompany, schemaCompany } from 'entities/company/model/validators/schemas';
import { defsBase } from '../../schemas';
import { defsItemBase, schemaFixDate } from 'entities/base/validators/schemas';
import {
  defsFIO, defsPhone, defsUser, schemaPerson, schemaPhoneNumber, schemaPosition,
  schemaSettings, schemaUser, defsPerson
 } from 'entities/user/model/validators/schemas';
import { schemaAuthByLogin } from 'pages/login/model/validators/schemas';
import { schemaSignupData, schemaSignupDataEnd } from 'pages/signup/model/validators/schemas';
// eslint-disable-next-line max-len
import { schemaRecoveryData } from 'pages/login/ui/recovery-password/model/validators/schemas';



export const addSchemas = (ajv: Ajv) => {
  ajv
    .addSchema([
      defsBase,

      // UI
      schemaFixDate,
      defsItemBase,

      // Auth
      schemaAuthByLogin,
      schemaRecoveryData,
      schemaSignupData,
      schemaSignupDataEnd,

      // User
      defsFIO,
      defsPhone,
      defsUser,
      defsPerson,
      schemaPerson,
      schemaPhoneNumber,
      schemaPosition,
      schemaSettings,
      schemaUser,

      // Company
      defsCompany,
      schemaCompany,
    ])
};
