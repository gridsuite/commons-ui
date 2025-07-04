/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const parametersFr = {
    descLfVoltageInitMode: "Mode d'initialisation du plan de tension",
    descLfUseReactiveLimits: 'Prise en compte des limites de réactif des groupes',
    descLfPhaseShifterRegulationOn: 'Activer les régulations des transformateurs déphaseurs',
    descLfTwtSplitShuntAdmittance:
        'Répartir la susceptance des transformateurs à deux enroulements entre primaire et secondaire',
    descLfShuntCompensatorVoltageControlOn: 'Activer la régulation de tension des bancs de compensation',
    descLfUniformValues: 'Uniforme',
    descLfPreviousValues: 'Précédentes',
    descLfDcValues: 'DC',
    resetToDefault: 'Tout réinitialiser ',
    resetProviderValuesToDefault: 'Réinitialiser les paramètres du simulateur',
    resetParamsConfirmation: 'Souhaitez vous réellement réinitialiser ces paramètres ?',
    showAdvancedParameters: 'Paramètres avancés',
    showSpecificParameters: 'Paramètres spécifiques',
    save: 'Enregistrer',
    saveParameters: 'Enregistrer des paramètres',
    'settings.button.chooseSettings': 'Sélectionner',
    showSelectDirectoryDialog: 'Modifier dossier',
    showSelectDirectoryItemDialog: 'Sélectionner',
    showSelectParameterDialog: 'Choisir paramètres',
    createParameterLabel: 'Créer des nouveaux paramètres',
    updateParameterLabel: 'Remplacer des paramètres existants',
    nameAlreadyUsed: 'Ce nom est déjà utilisé',
    tagAlreadyUsed: 'Cette balise est déjà utilisée',
    studyDirectoryFetchingError: "Une erreur est survenue lors de la lecture du dossier de l'étude",
    AddDescription: 'Ajouter une description (optionnel)',
    descLfReadSlackBus: 'Utiliser le nœud bilan défini dans le réseau',
    descLfWriteSlackBus: 'Écrire le nœud bilan calculé automatiquement dans le réseau',
    descLfDC: 'Lancer le calcul en actif seul',
    descLfConnectedComponentMode: 'Choix de la composante connexe de calcul',
    descLfConnectedComponentModeMain: 'Composante connexe principale',
    descLfConnectedComponentModeAll: 'Toutes les composantes connexes',
    descLfHvdcAcEmulation: "Permettre l'émulation AC des HVDC",
    descLfDistributedSlack: 'Activer la compensation',
    descLfDcUseTransformerRatio:
        "Prise en compte de la valeur des rapports de transformation dans l'équation de transit en actif seul",
    descLfDcPowerFactor: 'Facteur de puissance en actif seul (cos phi)',
    dcPowerFactorGreaterThan0: 'Le facteur de puissance doit être supérieur à 0',
    dcPowerFactorLessOrEqualThan1: 'Le facteur de puissance doit être inférieur ou égal à 1',
    descLfBalanceType: 'Mode de compensation proportionnel à',
    descLfBalanceTypeGenP: 'puissance de consigne des groupes',
    descLfBalanceTypeGenPMax: 'puissance maximale des groupes',
    descLfBalanceTypeLoad: 'consommation',
    descLfBalanceTypeConformLoad: 'part variable de la consommation',
    descLfCountries: 'Pays',
    descLfAllCountries: 'Tous les pays',
    descLfCountriesToBalance: 'Pays participant à la compensation',
    editParameters: 'Éditer les paramètres',
    RealPercentage: 'Cette valeur doit être comprise entre 0 et 1',

    General: 'Général',
    LimitReductions: 'Abattements',
    IST: 'IST',
    LimitDurationInterval: 'Entre {highBound} et {lowBound}',
    LimitDurationAfterIST: 'Au-delà de IT{value}',
    voltageRange: 'Niveau de tension',

    Provider: 'Simulateur',
    LimitReduction: 'Abattement des seuils',
    Default: 'Défaut',
    OpenLoadFlow: 'Open Load Flow',
    Hades2: 'Hades 2',
    DynaFlow: 'Dyna Flow',

    Map: 'Carte',
    SingleLineDiagram: 'Schéma unifilaire',
    NetworkAreaDiagram: 'Image nodale de zone',
    lineFullPath: 'Afficher le chemin complet des lignes',
    lineParallelPath: 'Écarter les lignes superposées',
    LineFlowMode: 'Mode de représentation des flux sur les lignes',
    StaticArrows: 'Flèches statiques',
    AnimatedArrows: 'Flèches animées',
    Feeders: 'Départs',
    MapManualRefresh: "Mise à jour manuelle de l'image réseau géographique",
    MapBaseMap: 'Fond de plan',
    Mapbox: 'Mapbox',
    diagonalLabel: "Afficher les noms d'ouvrages en diagonale",
    centerLabel: "Centrer les noms d'ouvrages",
    SubstationLayout: 'Disposition des images de sites',
    HorizontalSubstationLayout: 'Horizontal',
    VerticalSubstationLayout: 'Vertical',
    ComponentLibrary: 'Sélection de la bibliothèque de composants',
    initNadWithGeoData: 'Initialiser sur base des coordonnées géographiques',
    GridSuiteAndConvergence: 'GridSuite_And_Convergence',
    Convergence: 'Convergence',
    FlatDesign: 'Flat_Design',
    Carto: 'Carto',
    CartoNoLabel: 'Carto sans labels',
    Etalab: 'Etalab',
    getNetworkVisualizationsParametersError:
        'Une erreur est survenue lors de la récupération des paramètres des images réseau',
    updateNetworkVisualizationsParametersError:
        'Une erreur est survenue lors de la mise a jour des paramètres des images réseau',
    paramsChangingError: 'Une erreur est survenue lors de la modification des paramètres',
    paramsChangingDenied: 'Les changements demandés ont été rejetés',
    paramsRetrievingError: 'Une erreur est survenue lors de la récupération des paramètres',
    paramsCreatingError: 'Une erreur est survenue lors de la création des paramètres',
    paramsUpdateError: 'Une erreur est survenue lors de la mise à jour des paramètres {item}',
    paramsCreationMsg: 'Création de paramètres dans {directory}',
    paramsUpdateMsg: 'Mise à jour des paramètres {item}',
    optionalServicesRetrievingError:
        "Une erreur est survenue lors de la récupération de l'état des services optionnels",
    defaultSensiResultsThresholdRetrievingError:
        "Une erreur est survenue lors de la récupération du seuil par défaut des résultats de l'analyse de sensibilité",
    fetchDefaultLimitReductionsError: 'Une erreur est survenue lors de la récupération des abattements par défaut',

    descWithFeederResult: 'Avec apports',
    ShortCircuitPredefinedParameters: 'Paramètres prédéfinis',
    ShortCircuitCharacteristics: 'Caractéristiques prises en compte',
    ShortCircuitVoltageProfileMode: 'Plan de tension initial',
    shortCircuitLoads: 'Charges',
    shortCircuitHvdc: 'HVDC (VSC)',
    shortCircuitShuntCompensators: 'MCS',
    shortCircuitNeutralPosition: 'Prises courantes des régleurs en charge',
    shortCircuitNominalVoltage: 'Tension nominale (kV)',
    shortCircuitInitialVoltage: 'Tension initiale (kV)',
    iccMawWithNominalVoltageMapPredefinedParams: 'ICC max avec plan de tension normalisé',
    iccMaxWithCEIPredefinedParams: 'ICC max avec norme CEI 909',
    iscMinWithNominalVoltageMapPredefinedParams: 'Pcc min à tension normalisée',
    nominalInitialVoltageProfileMode: 'Normalisé',
    cei909InitialVoltageProfileMode: 'CEI 909',
    Or: 'ou',

    updateVoltageInitParametersError:
        "Une erreur est survenue lors de la mise a jour des paramètres de l'initialisation du plan de tension",
    VoltageInitParametersGeneralTabLabel: 'Général',
    VoltageInitParametersGeneralApplyModificationsLabel: 'Appliquer automatiquement la modification du plan de tension',
    VoltageInitParametersGeneralSaveInfo:
        "Cette option ne sera pas enregistrée et sera mise à la valeur par défaut en cas d'insertion de paramètres depuis GridExplore",
    VoltageInitParametersGeneralUpdateBusVoltageLabel: 'Mettre à jour tension des nœuds électriques',
    VoltageInitParametersEquipmentsSelectionAlert:
        'Les consignes des CSPR et des stations VSC sont toujours considérées comme variables',
    VoltageLimits: 'Limites de tension',
    VoltageLevelFilter: 'Filtre poste',
    LowVoltageLimitDefault: 'Valeur par défaut limite basse',
    HighVoltageLimitDefault: 'Valeur par défaut limite haute',
    LowVoltageLimitAdjustment: 'Modification limite basse',
    HighVoltageLimitAdjustment: 'Modification limite haute',
    VoltageLevelFilterTooltip:
        "Les saisies sont appliquées dans l'ordre de la liste (en remplaçant éventuellement des saisies au fur et à mesure si un poste est inclus dans plusieurs filtres)",
    FilterInputMinError: 'Vous devez sélectionner au moins un filtre',
    EquipmentSelection: 'Sélection des ouvrages',
    ReactiveSlacksThreshold: "Seuil d'alerte sur les investissements réactifs",
    ReactiveSlacksThresholdMustBeGreaterOrEqualToZero: 'Le seuil doit être supérieur ou égal à 0',
    ShuntCompensatorActivationThreshold: "Seuil d'alerte sur l'enclenchement des MCS",
    ShuntCompensatorActivationThresholdMustBeGreaterOrEqualToZero: 'Le seuil doit être supérieur ou égal à 0',
    ShuntCompensatorActivationThresholdDescription:
        "Seuil (en MVar) au-dessus duquel on considère qu'il y a un écart significatif (et donc tracé dans les logs fonctionnels) entre valeur arrondie et valeur théorique pour l'enclenchement d'un MCS",
    VoltageInitParametersError: "Erreur lors de la mise à jour des paramètres d'initialisation du plan de tension",
    voltageInitCancelError: "L'initialisation du plan de tension n'a pas pu être annulée",
    AdjustExistingLimits: 'Modifier les limites existantes',
    AdjustExistingLimitsInfo:
        'Merci de saisir une valeur positive pour augmenter une limite existante et une valeur négative pour abaisser une limite existante (nouvelle limite = limite existante + valeur saisie).',
    SetDefaultLimits: 'Valeurs par défaut pour compléter les limites manquantes',
    allExcept: 'Tous sauf',
    noneExcept: 'Aucun sauf',
    FiltersListsSelection: 'Sélection des listes de filtres',
    VariableGenerators: 'Groupes à puissance réactive variable',
    VariableTransformers: 'Transformateurs variables',
    VariableShuntCompensators: 'MCS variables',

    'securityAnalysis.violationsHiding': 'Masquage des contraintes en N-k',
    'securityAnalysis.current': 'Intensité',
    'securityAnalysis.lowVoltage': 'Tension basse',
    'securityAnalysis.highVoltage': 'Tension haute',
    'securityAnalysis.toolTip.violationsHiding':
        "Cette section permet de paramétrer le niveau d'aggravation à partir duquel les contraintes calculées en N réapparaissent en N-k.",
    'securityAnalysis.toolTip.current':
        "L'aggravation de contrainte en intensité est déterminée uniquement en pourcentage de la valeur calculée en N pour les ouvrages en contrainte. Par exemple, si l'aggravation en pourcentage correspond à 10 A alors la contrainte en N réapparaitra en N-k pour une augmentation d'intensité de plus de 10 A par rapport à la valeur calculée en N.",
    'securityAnalysis.toolTip.lowVoltage':
        "L'aggravation de contrainte en tension basse peut être calculée en pourcentage ou en définie en valeur absolue par rapport à la valeur calculée en N. La valeur prise en compte sera la plus conservative des deux. Par exemple, si l'aggravation en pourcentage correspond à 1 kV et celle renseignée en absolu est de 2 kV, alors la contrainte en tension basse réapparaitra en N-k pour une chute de tension de plus de 1 kV par rapport à la valeur calculée en N.",
    'securityAnalysis.toolTip.highVoltage':
        "L'aggravation de contrainte en tension haute peut être calculée en pourcentage ou en définie en valeur absolue par rapport à la valeur calculée en N. La valeur prise en compte sera la plus conservative des deux. Par exemple, si l'aggravation en pourcentage correspond à 1 kV et celle renseignée en absolu est de 2 kV, alors la contrainte en tension haute réapparaitra en N-k pour une élévation de tension de plus de 1 kV par rapport à la valeur calculée en N.",

    SupervisedBranches: 'Quadripôles surveillés',
    flowSensitivityValue: 'Valeur du seuil de sensibilité',
    flowFlowSensitivityValueThreshold: 'ΔMW ou ΔA / MW',
    angleFlowSensitivityValueThreshold: 'ΔMW ou ΔA / Δ°',
    flowVoltageSensitivityValueThreshold: 'ΔkV / kV',

    ContingencyListsSelection: "Sélection des listes d'aléas",
    Execute: 'Exécuter',
    AddContingencyList: 'Ajouter',
    DeleteContingencyList: 'Supprimer',
    getContingencyListError: "Impossible de récupérer les listes d'aléas",
    xContingenciesWillBeSimulated: '{x} aléas seront simulés',

    resultsThreshold: 'Seuil minimal de sensibilité',
    SensitivityBranches: 'Quadripôles',
    SensitivityInjectionsSet: "Par rapport à un ensemble d'injections :",
    SensitivityInjection: 'Par rapport à chaque injection :',
    SensitivityHVDC: 'Par rapport à chaque HVDC :',
    SensitivityPST: 'Par rapport à chaque TD :',
    SensitivityNodes: 'Nœuds',
    SensiInjectionsSet: 'Set injections',
    SensiInjection: 'Injection',
    SensiHVDC: 'Hvdc',
    SensiPST: 'TD',
    Proportional: 'Proportionnel',
    ProportionalMaxP: 'Proportionnel à Pmax',
    Regular: 'Équirépartition',
    Ventilation: 'Ventilation',
    DistributionType: 'Type de répartition',
    SensitivityType: 'Type de sensibilité',
    DeltaMW: '\u0394 MW',
    DeltaA: '\u0394 A',
    ContingencyLists: 'Aléas',
    Injections: 'Injections',
    MonitoredVoltageLevels: 'Postes surveillés',
    EquipmentsInVoltageRegulation: 'Ouvrages en réglage tension',
    PSTS: 'TDs',
    Active: 'Actif',
    'sensitivityAnalysis.simulatedComputations': '{count, plural, =0 {0 calcul} =1 {1 calcul} other {# calculs}}',
    'sensitivityAnalysis.moreThanOneMillionComputations': '999 999+ calculs',
    'sensitivityAnalysis.maximumSimulatedComputations': '500 000 max',
    'sensitivityAnalysis.separator': '  |  ',
    loadingComputing: 'Evaluation en cours...',

    AddRows: 'Ajouter',
    Optional: ' (optionnel)',

    // Computed translations used in the snackbars
    // LoadFlow
    fetchDefaultLoadFlowProviderError:
        'Une erreur est survenue lors de la récupération du fournisseur de calcul de répartition par défaut',
    fetchLoadFlowParametersError:
        'Une erreur est survenue lors de la récupération des paramètres de calcul de répartition',
    fetchLoadFlowProviderError:
        'Une erreur est survenue lors de la récupération du fournisseur de calcul de répartition',
    fetchLoadFlowProvidersError:
        'Une erreur est survenue lors de la récupération des fournisseurs de calcul de répartition',
    fetchLoadFlowSpecificParametersError:
        'Une erreur est survenue lors de la récupération des paramètres spécifiques de calcul de répartition',
    updateLoadFlowParametersError:
        'Une erreur est survenue lors de la mise à jour des paramètres de calcul de répartition',
    updateLoadFlowProviderError:
        'Une erreur est survenue lors de la mise à jour du fournisseur courant de calcul de répartition',
    // SecurityAnalysis
    fetchDefaultSecurityAnalysisProviderError:
        "Une erreur est survenue lors de la récupération du fournisseur d'analyse de sécurité par défaut",
    fetchSecurityAnalysisParametersError:
        "Une erreur est survenue lors de la récupération des paramètres de l'analyse de sécurité",
    fetchSecurityAnalysisProviderError:
        "Une erreur est survenue lors de la récupération du fournisseur courant d'analyse de sécurité",
    fetchSecurityAnalysisProvidersError:
        "Une erreur est survenue lors de la récupération des fournisseurs d'analyse de sécurité",
    updateSecurityAnalysisParametersError:
        "Une erreur est survenue lors de la mise a jour des paramètres de l'analyse de sécurité",
    updateSecurityAnalysisProviderError:
        "Une erreur est survenue lors de la mise a jour du fournisseur courant d'analyse de sécurité",
    // SensitivityAnalysis
    fetchDefaultSensitivityAnalysisProviderError:
        "Une erreur est survenue lors de la récupération du fournisseur d'analyse de sensibilité par défaut",
    fetchSensitivityAnalysisParametersError:
        "Une erreur est survenue lors de la récupération des paramètres de l'analyse de sensibilité",
    fetchSensitivityAnalysisProviderError:
        "Une erreur est survenue lors de la récupération du fournisseur courant d'analyse de sensibilité",
    fetchSensitivityAnalysisProvidersError:
        "Une erreur est survenue lors de la récupération des fournisseurs d'analyse de sensibilité",
    updateSensitivityAnalysisParametersError:
        "Une erreur est survenue lors de la mise a jour des paramètres de l'analyse de sensibilité",
    updateSensitivityAnalysisProviderError:
        "Une erreur est survenue lors de la mise a jour du fournisseur courant d'analyse de sensibilité",
    getSensitivityAnalysisFactorsCountError: "Une erreur est survenue lors de l'estimation du nombre de calculs",
    // Other
    resetLoadFlowParametersWarning:
        'Impossible de récupérer les paramètres de calcul de répartition définis dans le profil utilisateur (les valeurs par défaut sont appliquées)',
};
