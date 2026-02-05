import { Property } from '../../common';

export type SubstationCreationDto = {
    type: string;
    equipmentId: string;
    equipmentName: string | null;
    country: string | null;
    properties: Property[] | null;
};
