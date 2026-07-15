import type { UUID } from 'node:crypto';
import { ModificationType } from '../../../../../utils';

export interface FilterInfos {
    id: UUID;
    name: string;
    specificMetadata: {
        type?: string;
    };
}

export interface ReferenceFieldOrValue {
    value: number | null;
    equipmentField: string | null;
}

export interface FormulaInfos {
    id?: UUID;
    fieldOrValue1: ReferenceFieldOrValue;
    fieldOrValue2: ReferenceFieldOrValue;
    filters: FilterInfos[];
    editedField: string;
    operator: string;
}

export interface ModificationByFormulaDto {
    type: ModificationType.BY_FORMULA_MODIFICATION;
    uuid?: UUID;
    identifiableType: string;
    formulaInfosList: FormulaInfos[];
}
