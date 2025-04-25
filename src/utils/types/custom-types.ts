import { UUID } from 'crypto';
import { EquipmentType } from './equipmentType';
import { ComputingType } from '../../components/parameters/common/computing-type';

export enum NotificationType {
    STUDY = 'study',
    COMPUTATION_PARAMETERS_UPDATED = 'computationParametersUpdated',
    NETWORK_VISUALIZATION_PARAMETERS_UPDATED = 'networkVisualizationParametersUpdated',
    LOADFLOW_RESULT = 'loadflowResult',
    ROOT_NETWORKS_DELETION_STARTED = 'rootNetworksDeletionStarted',
    ROOT_NETWORKS_UPDATED = 'rootNetworksUpdated',
    ROOT_NETWORKS_UPDATE_FAILED = 'rootNetworksUpdateFailed',
}

// Payloads
export interface DeletedEquipment {
    equipmentId: string;
    equipmentType: EquipmentType;
}

export interface NetworkImpactsInfos {
    impactedSubstationsIds: UUID[];
    deletedEquipments: DeletedEquipment[];
    impactedElementTypes: string[];
}

// Headers
export interface StudyUpdatedEventDataHeader {
    studyUuid: UUID;
    updateType: string;
    parentNode: UUID;
    rootNetworkUuid: UUID;
    timestamp: number;
    node?: UUID;
    nodes?: UUID[];
    error?: string;
    userId?: string;
    computationType?: ComputingType;
}

export interface RootNetworksDeletionStartedEventDataHeader {
    studyUuid: UUID;
    updateType: string;
    rootNetworksUuids: UUID[];
}

export interface LoadflowResultEventDataHeaders {
    studyUuid: UUID;
    updateType: string;
    rootNetworkUuid: UUID;
}

export interface RootNetworksUpdatedEventDataHeaders {
    studyUuid: UUID;
    updateType: string;
    rootNetworkUuid?: UUID; // all root networks if absent
    error?: string;
}

// EventData
export interface StudyUpdatedEventData {
    headers: StudyUpdatedEventDataHeader;
    payload: NetworkImpactsInfos;
}

export interface StudyUpdatedEventDataUnknown {
    headers: StudyUpdatedEventDataHeader;
    payload: string;
}

export interface LoadflowResultEventData {
    headers: LoadflowResultEventDataHeaders;
    payload: undefined;
}

export interface RootNetworksDeletionStartedEventData {
    headers: RootNetworksDeletionStartedEventDataHeader;
    payload: undefined;
}

export interface RootNetworksUpdatedEventData {
    headers: RootNetworksUpdatedEventDataHeaders;
    payload: undefined;
}

// Notification types
export type StudyUpdatedStudy = {
    type: NotificationType.STUDY;
    eventData: StudyUpdatedEventData;
};
export type StudyUpdatedUndefined = {
    type: undefined;
    eventData: StudyUpdatedEventDataUnknown;
};
export type LoadflowResultNotification = {
    type: NotificationType.LOADFLOW_RESULT;
    eventData: LoadflowResultEventData;
};
export type RootNetworksUpdatedNotification = {
    type: NotificationType.ROOT_NETWORKS_UPDATED;
    eventData: RootNetworksUpdatedEventData;
};
export type RootNetworksUpdateFailedNotification = {
    type: NotificationType.ROOT_NETWORKS_UPDATE_FAILED;
    eventData: RootNetworksUpdatedEventData;
};
export type RootNetworkDeletionStartedNotification = {
    type: NotificationType.ROOT_NETWORKS_DELETION_STARTED;
    eventData: RootNetworksDeletionStartedEventData;
};
export type StudyUpdated = {
    force: number;
} & (
    | StudyUpdatedUndefined
    | StudyUpdatedStudy
    | LoadflowResultNotification
    | RootNetworksUpdatedNotification
    | RootNetworksUpdateFailedNotification
    | RootNetworkDeletionStartedNotification
);
