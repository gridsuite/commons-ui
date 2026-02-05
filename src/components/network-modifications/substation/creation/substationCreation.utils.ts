import { sanitizeString } from '../../../dialogs';
import {
    creationPropertiesSchema,
    getFilledPropertiesFromModification,
    toModificationProperties,
} from '../../common/properties/propertyUtils';
import yup from '../../../../utils/yupConfig';
import { FieldConstants } from '../../../../utils';
import { SubstationCreationDto } from './substationCreation.types';

export const substationCreationFormToDto = (substationForm: SubstationCreationFormData): SubstationCreationDto => {
    return {
        type: 'SUBSTATION_CREATION',
        equipmentId: substationForm[FieldConstants.EQUIPMENT_ID],
        equipmentName: sanitizeString(substationForm[FieldConstants.EQUIPMENT_NAME]),
        country: substationForm[FieldConstants.COUNTRY] ?? null,
        properties: toModificationProperties(substationForm),
    } satisfies SubstationCreationDto;
};

export const substationCreationDtoToForm = (substationDto: SubstationCreationDto): SubstationCreationFormData => {
    return {
        [FieldConstants.EQUIPMENT_ID]: substationDto.equipmentId,
        [FieldConstants.EQUIPMENT_NAME]: substationDto.equipmentName ?? '',
        [FieldConstants.COUNTRY]: substationDto.country,
        [FieldConstants.ADDITIONAL_PROPERTIES]: getFilledPropertiesFromModification(substationDto.properties),
    } satisfies SubstationCreationFormData;
};

export const substationCreationFormSchema = yup
    .object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: yup.string().required(),
        [FieldConstants.EQUIPMENT_NAME]: yup.string().nullable(),
        [FieldConstants.COUNTRY]: yup.string().nullable(),
    })
    .concat(creationPropertiesSchema);

export type SubstationCreationFormData = yup.InferType<typeof substationCreationFormSchema>;

export const substationCreationEmptyFormData: SubstationCreationFormData = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [FieldConstants.COUNTRY]: null,
    [FieldConstants.ADDITIONAL_PROPERTIES]: [],
};
