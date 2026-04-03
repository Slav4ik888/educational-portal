
export const getName = (data: string, keyword?: string): string => {
  switch (data) {
    case 'label': return 'Заголовок'
    case 'string': return 'текстовым'
    case 'number': return 'числовым'
    case 'email': return 'email'
    case 'password': return 'Пароль'
    case 'confirmPassword': return 'Подтверждение пароля'
    case 'firstName': return 'Имя'
    case 'companyName': return 'Название компании'
    case 'mobileNumber': return 'Номер телефона'

    case 'Owner': return 'Владелец аккаунта'


    case 'payerName': return 'Наименование организации'
    case 'ITN': return 'ИНН'
    case 'addressLegal': return 'Юридический адрес'
    case 'addressMailing': return 'Почтовый адрес'
    case 'leaderTitle': return 'Должность руководителя'
    case 'leaderName': return 'ФИО руководителя'
    case 'bankName': return 'Наименование банка'
    case 'bankBIK': return 'БИК банка'
    case 'bankCorAcc': return 'Корреспондентский счёт'
    case 'bankCheckAcc': return 'Расчётный счёт'

    // err:  {
    //   instancePath: '/bankBIK',
    //   schemaPath: '#/properties/bankBIK/minLength',
    //   keyword: 'minLength',
    //   params: { limit: 9 },
    //   message: 'must NOT have fewer than 9 characters'
    // }

    // case 'value'           : return 'Пункт инфо блока';

    // case 'label'           :
    // case 'title'           : return 'Заголовок';
    // case 'condition'       : return 'Состояние';
    // case 'sectionId'       : return 'Секция';
    // case 'pointsListType'  : return 'Тип стиля пункта';
    // case 'pointType'       : return 'Тип пункта';

    // case 'type':
    //   if (keyword === 'isRuleType')                         return 'Тип правила';
    //   if (keyword === 'isDocumentStructureItemType')        return 'Тип инфо блока';
    //   if (keyword === 'isDocumentStructureItemLabelType')   return 'Тип заголовка';
    //   if (keyword === 'isDocumentStructureItemStyleType')   return 'Тип стиля';
    //   if (keyword === 'isDocumentStructurePointsListType')  return 'Тип стиля пункта';
    //   else return 'Тип';

    default: return data;
  }
};
