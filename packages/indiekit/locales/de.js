/* eslint-disable import/no-anonymous-default-export */
export default {
  error: "Fehler",
  errorSummaryTitle: "Es gibt ein Problem",
  errors: {
    noDatabase: {
      content: "Für diese Funktion ist eine Datenbank erforderlich.",
    },
    notFound: {
      content:
        "Wenn Sie eine Webadresse eingegeben haben, überprüfen Sie bitte, ob sie korrekt war.",
      title: "Seite nicht gefunden",
    },
  },
  guidance: {
    discovery:
      "Fügen Sie dem `<head>` Ihrer Website die folgenden Werte hinzu, damit Micropub-Clients %s erkennen und um Erlaubnis bitten, auf Ihrer Website posten zu dürfen:",
  },
  noValue: "Nicht festgelegt",
  optionalValue: "(fakultativ)",
  session: {
    login: {
      description:
        "Melde dich mit IndieAuth an, um zu verifizieren, dass du %s besitzt",
      error: {
        validateRedirect: "Ungültige Weiterleitung versucht",
        validateState: "Falscher `code` oder `state`",
      },
      me: "Webadresse",
      submit: "Mit IndieAuth anmelden",
      title: "Anmelden",
    },
    logout: {
      title: "Abmelden",
    },
  },
  status: {
    application: {
      accessToken: "Zugangstoken",
      endpoints: "Endpunkte",
      locale: "Sprache",
      localeNotAvailable:
        "{{ app }} wurde noch nicht in {{ locale }} übersetzt",
      name: "Name",
      summaryTitle: "Anwendungseinstellungen",
      themeColor: "Themenfarbe",
      themeColorScheme: "Thema",
      themeColorSchemeValue: {
        automatic: "Automatisch",
        dark: "Dunkel",
        light: "Licht",
      },
      installedPlugins: "Plugins installiert",
    },
    publication: {
      locale: "Sprache",
      me: "Webadresse",
      mediaEndpoint: "Media Endpunkte",
      postTypes: "Beitragsarten",
      preset: "Voreinstellung",
      store: "Inhaltsspeicher",
      summaryTitle: "Veröffentlichungseinstellungen",
      syndicationTargets: "Syndikationsziele",
      timeZone: "Zeitzone",
    },
    title: "Server Status",
  },
};
