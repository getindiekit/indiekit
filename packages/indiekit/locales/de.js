export const de = {
  error: 'Error',
  errorSummaryTitle: 'Es ist ein Fehler aufgetreten',
  noValue: 'Nicht vorgesehen',
  optionalValue: '(optional)',
  guidance: {
    discovery: 'Fügen Sie dem `<head>` Ihrer Website die folgenden Werte hinzu, damit Micropub-Kunden %s erkennen und um Erlaubnis bitten, auf Ihrer Website posten zu dürfen'
  },
  session: {
    login: {
      title: 'Einloggen',
      description: 'Melden Sie sich mit IndieAuth an, um zu überprüfen, ob Sie %s besitzen',
      me: 'Webadresse',
      submit: 'Einloggen mit IndieAuth',
      error: {
        validateRedirect: 'Ungültige Weiterleitung versucht',
        validateState: 'Fehlender Code oder Zustandsinkongruenz'
      }
    },
    logout: {
      title: 'Ausloggen'
    }
  },
  status: {
    title: 'Serverstatus',
    application: {
      summaryTitle: 'Anwendungseinstellungen',
      name: 'Name',
      locale: 'Sprache',
      themeColor: 'Themenfarbe',
      themeColorScheme: 'Thema',
      themeColorSchemeValue: {
        automatic: 'Automatisch',
        light: 'Licht',
        dark: 'Dunkel'
      },
      endpoints: 'Endpunkte'
    },
    publication: {
      summaryTitle: 'Veröffentlichungseinstellungen',
      me: 'Webadresse',
      locale: 'Sprache',
      timeZone: 'Zeitzone',
      store: 'Geschäft',
      preset: 'Voreinstellung',
      postTypes: 'Beitragstypen',
      syndicationTargets: 'Syndikationsziele',
      mediaEndpoint: 'Medienendpunkt',
      accessToken: 'Zugangstoken'
    }
  }
};
