import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAmministratoreAmministratore
  extends Struct.CollectionTypeSchema {
  collectionName: 'amministratori';
  info: {
    description: '';
    displayName: 'amministratore';
    pluralName: 'amministratori';
    singularName: 'amministratore';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::amministratore.amministratore'
    > &
      Schema.Attribute.Private;
    log_attivitas: Schema.Attribute.Relation<
      'oneToMany',
      'api::log-attivita.log-attivita'
    >;
    nome_utente: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    Nome_Utente: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAziendaAzienda extends Struct.CollectionTypeSchema {
  collectionName: 'aziende';
  info: {
    description: '';
    displayName: 'Azienda';
    pluralName: 'aziende';
    singularName: 'azienda';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    Descrizione: Schema.Attribute.Text;
    feedbacks: Schema.Attribute.Relation<'oneToMany', 'api::feedback.feedback'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::azienda.azienda'
    > &
      Schema.Attribute.Private;
    Luogo: Schema.Attribute.String;
    Nome_Azienda: Schema.Attribute.String;
    nome_utente: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    offerta_lavoros: Schema.Attribute.Relation<
      'oneToMany',
      'api::offerta-lavoro.offerta-lavoro'
    >;
    publishedAt: Schema.Attribute.DateTime;
    recruiter: Schema.Attribute.Relation<
      'oneToOne',
      'api::recruiter.recruiter'
    >;
    recruiters: Schema.Attribute.Relation<
      'oneToMany',
      'api::recruiter.recruiter'
    >;
    Settore: Schema.Attribute.Enumeration<
      [
        'Agricoltura',
        'Alimentare',
        'Automotive',
        'Bancario',
        'Commercio',
        'Costruzioni',
        'Design',
        'Energia',
        'Farmaceutico',
        'Finanza',
        'Gestione rifiuti',
        'Hotelleria',
        'ICT',
        'Industria manifatturiera',
        'Logistica',
        'Marketing',
        'Media',
        'Moda',
        'Pubblica amministrazione',
        'Sanit\u00E0',
        'Servizi',
        'Telecomunicazioni',
        'Trasporti',
        'Turismo',
        'Edilizia',
        'Educazione',
      ]
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCandidatoCandidato extends Struct.CollectionTypeSchema {
  collectionName: 'candidati';
  info: {
    description: '';
    displayName: 'Candidato';
    pluralName: 'candidati';
    singularName: 'candidato';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    candidatura: Schema.Attribute.Relation<
      'oneToOne',
      'api::candidatura.candidatura'
    >;
    candidature: Schema.Attribute.Relation<
      'oneToMany',
      'api::candidatura.candidatura'
    >;
    colloqui: Schema.Attribute.Relation<
      'oneToMany',
      'api::colloquio.colloquio'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    CV: Schema.Attribute.Media<'images' | 'files'>;
    feedbacks: Schema.Attribute.Relation<'oneToMany', 'api::feedback.feedback'>;
    ID_Utente: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::candidato.candidato'
    > &
      Schema.Attribute.Private;
    Nome_Utente: Schema.Attribute.String;
    offertePreferite: Schema.Attribute.Relation<
      'manyToMany',
      'api::offerta-lavoro.offerta-lavoro'
    >;
    preferenza: Schema.Attribute.Relation<
      'oneToOne',
      'api::preferenza.preferenza'
    >;
    preferenzas: Schema.Attribute.Relation<
      'oneToMany',
      'api::preferenza.preferenza'
    >;
    Preferenze: Schema.Attribute.Enumeration<
      [
        'Informatica e Software',
        'Ingegneria',
        'Sanit\u00E0',
        'Educazione e Formazione',
        'Marketing e Comunicazione',
        'Vendite e Servizio Clienti',
        'Finanza e Contabilit\u00E0',
        'Risorse Umane',
        'Legale e Giuridico',
        'Amministrazione e Segreteria',
        'Arte e Design',
        'Media e Giornalismo',
        'Costruzioni e Architettura',
        'Scienza e Ricerca',
        'Produzione e Manifattura',
        'Logistica e Trasporti',
        'Turismo e Ospitalit\u00E0',
        'Agricoltura e Ambiente',
        'Servizi Sociali',
        'Sicurezza e Difesa',
        'Sport e Benessere',
        'Pubblica Amministrazione',
        'Imprenditoria',
        'Altro',
      ]
    >;
    ProfiloAttitudinale: Schema.Attribute.Text;
    publishedAt: Schema.Attribute.DateTime;
    Tentativi: Schema.Attribute.Relation<'oneToMany', 'api::test.test'>;
    tests: Schema.Attribute.Relation<'oneToMany', 'api::test.test'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCandidaturaCandidatura extends Struct.CollectionTypeSchema {
  collectionName: 'candidature';
  info: {
    description: '';
    displayName: 'Candidatura';
    pluralName: 'candidature';
    singularName: 'candidatura';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    candidato: Schema.Attribute.Relation<
      'oneToOne',
      'api::candidato.candidato'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    DataCandidatura: Schema.Attribute.Date;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::candidatura.candidatura'
    > &
      Schema.Attribute.Private;
    offerta_lavoro: Schema.Attribute.Relation<
      'oneToOne',
      'api::offerta-lavoro.offerta-lavoro'
    >;
    publishedAt: Schema.Attribute.DateTime;
    recruiter: Schema.Attribute.Relation<
      'oneToOne',
      'api::recruiter.recruiter'
    >;
    Stato: Schema.Attribute.Enumeration<
      ['In attesa', 'Accettata', 'Rifiutata', 'In revisione', 'Scartata']
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiColloquioColloquio extends Struct.CollectionTypeSchema {
  collectionName: 'colloqui';
  info: {
    description: '';
    displayName: 'Colloquio';
    pluralName: 'colloqui';
    singularName: 'colloquio';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    candidato: Schema.Attribute.Relation<
      'manyToOne',
      'api::candidato.candidato'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    Data: Schema.Attribute.Date;
    Esito: Schema.Attribute.Enumeration<
      ['Superato', 'Non superato', 'In attesa', 'Annullato', 'Rinviato']
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::colloquio.colloquio'
    > &
      Schema.Attribute.Private;
    offerta_lavoro: Schema.Attribute.Relation<
      'manyToOne',
      'api::offerta-lavoro.offerta-lavoro'
    >;
    publishedAt: Schema.Attribute.DateTime;
    Tipo: Schema.Attribute.Enumeration<
      [
        'Reale',
        'Simulato',
        'Telefonico',
        'Videochiamata',
        'In presenza',
        'Tecnico',
        'HR (risorse umane)',
        'Panel (colloquio con pi\u00F9 intervistatori)',
      ]
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiDomandaDomanda extends Struct.CollectionTypeSchema {
  collectionName: 'domande';
  info: {
    description: '';
    displayName: 'Domanda';
    pluralName: 'domande';
    singularName: 'domanda';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::domanda.domanda'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    risposta: Schema.Attribute.Relation<'oneToOne', 'api::risposta.risposta'>;
    rispostas: Schema.Attribute.Relation<'oneToMany', 'api::risposta.risposta'>;
    test: Schema.Attribute.Relation<'oneToOne', 'api::test.test'>;
    Testo: Schema.Attribute.String;
    Tipo: Schema.Attribute.Enumeration<['Chiusa', 'Aperta', 'Multipla']>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFeedbackFeedback extends Struct.CollectionTypeSchema {
  collectionName: 'feedbacks';
  info: {
    description: '';
    displayName: 'Feedback';
    pluralName: 'feedbacks';
    singularName: 'feedback';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    Commento: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    destinatario: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::feedback.feedback'
    > &
      Schema.Attribute.Private;
    mittente: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    Valutazione: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
  };
}

export interface ApiLogAttivitaLogAttivita extends Struct.CollectionTypeSchema {
  collectionName: 'log_attivitas';
  info: {
    description: '';
    displayName: 'LogAttivit\u00E0';
    pluralName: 'log-attivitas';
    singularName: 'log-attivita';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    data: Schema.Attribute.Date;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::log-attivita.log-attivita'
    > &
      Schema.Attribute.Private;
    logattivita: Schema.Attribute.Enumeration<
      [
        'Login',
        'Logout',
        'Creazione',
        'Modifica',
        'Cancellazione',
        'Pubblicazione',
        'Approvazione',
        'Rifiuto',
        'Invio Feedback',
        'Visualizzazione',
        'Cambio Ruolo',
        'Assegnazione',
      ]
    >;
    Nome_Utente: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNotificaNotifica extends Struct.CollectionTypeSchema {
  collectionName: 'notifiche';
  info: {
    description: '';
    displayName: 'Notifica';
    pluralName: 'notifiche';
    singularName: 'notifica';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    Data: Schema.Attribute.Date;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::notifica.notifica'
    > &
      Schema.Attribute.Private;
    Messaggio: Schema.Attribute.Text;
    publishedAt: Schema.Attribute.DateTime;
    Stato: Schema.Attribute.Enumeration<['Letta', 'Non letta']>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    Utente: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiOffertaLavoroOffertaLavoro
  extends Struct.CollectionTypeSchema {
  collectionName: 'offerte_lavoro';
  info: {
    description: '';
    displayName: 'OffertaLavoro';
    pluralName: 'offerte-lavoro';
    singularName: 'offerta-lavoro';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    azienda: Schema.Attribute.Relation<'manyToOne', 'api::azienda.azienda'>;
    candidatiChePreferiscono: Schema.Attribute.Relation<
      'manyToMany',
      'api::candidato.candidato'
    > &
      Schema.Attribute.Private;
    candidatura: Schema.Attribute.Relation<
      'oneToOne',
      'api::candidatura.candidatura'
    >;
    candidaturas: Schema.Attribute.Relation<
      'oneToMany',
      'api::candidatura.candidatura'
    >;
    colloqui_associati: Schema.Attribute.Relation<
      'oneToMany',
      'api::colloquio.colloquio'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    DataPubblicazione: Schema.Attribute.Date;
    Descrizione: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::offerta-lavoro.offerta-lavoro'
    > &
      Schema.Attribute.Private;
    modalitaLavoro: Schema.Attribute.Enumeration<
      ['Remoto', 'Ibrido', 'InSede', 'Flessibile']
    >;
    orarioLavoro: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    requisiti: Schema.Attribute.RichText;
    retribuzionePrevista: Schema.Attribute.Text;
    statoOfferta: Schema.Attribute.Enumeration<
      ['attiva', 'chiusa', 'in revisione']
    > &
      Schema.Attribute.DefaultTo<'attiva'>;
    tipoContratto: Schema.Attribute.Enumeration<
      [
        'Full-time',
        'Part-time',
        'Tempo Determinato',
        'Tempo Indeterminato',
        'Stage',
        'Apprendistato',
        'Consulenza/Freelance',
      ]
    >;
    Titolo: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPreferenzaPreferenza extends Struct.CollectionTypeSchema {
  collectionName: 'preferenze';
  info: {
    description: '';
    displayName: 'Preferenza ';
    pluralName: 'preferenze';
    singularName: 'preferenza';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    Area_Interesse: Schema.Attribute.Enumeration<
      [
        '- Amministrazione',
        '- Agricoltura',
        '- Arte e Cultura',
        '- Comunicazione',
        '- Consulenza',
        '- Design',
        '- Educazione e Formazione',
        '- Economia e Finanza',
        '- Edilizia e Costruzioni',
        '- Energia e Ambiente',
        '- Giornalismo',
        '- Informatica e Tecnologia',
        '- Ingegneria Civile',
        '- Ingegneria Elettronica',
        '- Ingegneria Meccanica',
        '- Marketing e Vendite',
        '- Medicina e Sanit\u00E0',
        '- Moda e Abbigliamento',
        '- Produzione e Manifattura',
        '- Ricerca e Sviluppo',
        '- Risorse Umane',
        '- Scienze Naturali',
        '- Servizi alla Persona',
        '- Sicurezza e Vigilanza',
        '- Sport e Tempo Libero',
        '- Telecomunicazioni',
        '- Trasporti e Logistica',
        '- Turismo e Ospitalit\u00E0',
      ]
    >;
    candidato: Schema.Attribute.Relation<
      'oneToOne',
      'api::candidato.candidato'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localita: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::preferenza.preferenza'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    Tipo_Contratto: Schema.Attribute.Enumeration<
      [
        'Tempo Indeterminato',
        'Tempo Determinato',
        'Contratto a Progetto (Co.Co.Pro)',
        'Apprendistato',
        'Part-Time',
        'Full-Time',
        'Stage / Tirocinio',
        'Somministrazione',
        'Collaborazione Occasionale',
        'Contratto Interinale',
        'Contratto di Prestazione Occasionale',
        'Contratto di Lavoro Autonomo',
        'Freelance / Consulenza',
        'Contratto a Chiamata',
        'Contratto di Inserimento',
        'Contratto di Formazione e Lavoro',
      ]
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiRecruiterRecruiter extends Struct.CollectionTypeSchema {
  collectionName: 'recruiters';
  info: {
    description: '';
    displayName: 'Recruiter';
    pluralName: 'recruiters';
    singularName: 'recruiter';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    aziendas: Schema.Attribute.Relation<'oneToOne', 'api::azienda.azienda'>;
    candidatura: Schema.Attribute.Relation<
      'oneToOne',
      'api::candidatura.candidatura'
    >;
    candidaturas: Schema.Attribute.Relation<
      'oneToMany',
      'api::candidatura.candidatura'
    >;
    colloqui: Schema.Attribute.Relation<
      'oneToMany',
      'api::colloquio.colloquio'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    feedbacks: Schema.Attribute.Relation<'oneToMany', 'api::feedback.feedback'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::recruiter.recruiter'
    > &
      Schema.Attribute.Private;
    nome_utente: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiRispostaRisposta extends Struct.CollectionTypeSchema {
  collectionName: 'risposte';
  info: {
    description: '';
    displayName: 'Risposta';
    pluralName: 'risposte';
    singularName: 'risposta';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    Corrretta: Schema.Attribute.Boolean;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    domanda: Schema.Attribute.Relation<'oneToOne', 'api::domanda.domanda'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::risposta.risposta'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    Testo: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiRuoloRuolo extends Struct.CollectionTypeSchema {
  collectionName: 'ruoli';
  info: {
    description: '';
    displayName: 'Ruolo';
    pluralName: 'ruoli';
    singularName: 'ruolo';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    descrizione: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Null'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::ruolo.ruolo'> &
      Schema.Attribute.Private;
    NomeRuolo: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Null'>;
    NomeUtente: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    publishedAt: Schema.Attribute.DateTime;
    TipoUtente: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTestTest extends Struct.CollectionTypeSchema {
  collectionName: 'tests';
  info: {
    description: '';
    displayName: 'Test';
    pluralName: 'tests';
    singularName: 'test';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    candidato: Schema.Attribute.Relation<
      'manyToOne',
      'api::candidato.candidato'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    domanda: Schema.Attribute.Relation<'oneToOne', 'api::domanda.domanda'>;
    domandas: Schema.Attribute.Relation<'oneToMany', 'api::domanda.domanda'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::test.test'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    Titolo: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.String;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amministratore: Schema.Attribute.Relation<
      'oneToOne',
      'api::amministratore.amministratore'
    >;
    azienda: Schema.Attribute.Relation<'oneToOne', 'api::azienda.azienda'>;
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    candidato: Schema.Attribute.Relation<
      'oneToOne',
      'api::candidato.candidato'
    >;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    feedbackinviati: Schema.Attribute.Relation<
      'oneToOne',
      'api::feedback.feedback'
    >;
    feedbackricevutis: Schema.Attribute.Relation<
      'oneToMany',
      'api::feedback.feedback'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    LOG: Schema.Attribute.Relation<
      'oneToMany',
      'api::log-attivita.log-attivita'
    >;
    log_attivita: Schema.Attribute.Relation<
      'oneToOne',
      'api::log-attivita.log-attivita'
    >;
    NOT: Schema.Attribute.Relation<'oneToMany', 'api::notifica.notifica'>;
    notifica: Schema.Attribute.Relation<'oneToOne', 'api::notifica.notifica'>;
    notifiche: Schema.Attribute.Relation<'oneToMany', 'api::notifica.notifica'>;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    recruiter: Schema.Attribute.Relation<
      'oneToOne',
      'api::recruiter.recruiter'
    >;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    ruolo: Schema.Attribute.Relation<'oneToOne', 'api::ruolo.ruolo'>;
    Tipo: Schema.Attribute.Relation<'oneToOne', 'api::ruolo.ruolo'>;
    TipoUtente: Schema.Attribute.Enumeration<
      ['Candidato', 'Azienda', 'Amministratore', 'Recruiter']
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::amministratore.amministratore': ApiAmministratoreAmministratore;
      'api::azienda.azienda': ApiAziendaAzienda;
      'api::candidato.candidato': ApiCandidatoCandidato;
      'api::candidatura.candidatura': ApiCandidaturaCandidatura;
      'api::colloquio.colloquio': ApiColloquioColloquio;
      'api::domanda.domanda': ApiDomandaDomanda;
      'api::feedback.feedback': ApiFeedbackFeedback;
      'api::log-attivita.log-attivita': ApiLogAttivitaLogAttivita;
      'api::notifica.notifica': ApiNotificaNotifica;
      'api::offerta-lavoro.offerta-lavoro': ApiOffertaLavoroOffertaLavoro;
      'api::preferenza.preferenza': ApiPreferenzaPreferenza;
      'api::recruiter.recruiter': ApiRecruiterRecruiter;
      'api::risposta.risposta': ApiRispostaRisposta;
      'api::ruolo.ruolo': ApiRuoloRuolo;
      'api::test.test': ApiTestTest;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
