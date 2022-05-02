/* eslint-disable import/no-anonymous-default-export */
export default {
  error: "Fout",
  errorSummaryTitle: "Er is een Probleem",
  errors: {
    noDatabase: {
      content: "Voor deze functie is een database vereist.",
    },
    notFound: {
      content:
        "Als je een webadres hebt ingevoerd, controleer dan of het correct was.",
      title: "Pagina niet gevonden",
    },
  },
  guidance: {
    discovery:
      "Om ervoor te zorgen dat %s kan worden ontdekt door Micropub-clients en toestemming kan vragen om op uw website te posten, voegt u de volgende waarden toe aan de `<head>` van uw website:",
  },
  noValue: "Niet ingesteld",
  optionalValue: "(optioneel)",
  session: {
    login: {
      description:
        "Meld u aan met IndieAuth om te controleren of u eigenaar bent van %s",
      error: {
        validateRedirect: "Ongeldige omleiding geprobeerd",
        validateState: "Onjuiste `code` of `state`",
      },
      me: "Webadres",
      submit: "Log in met IndieAuth",
      title: "Inloggen",
    },
    logout: {
      title: "Afmelden",
    },
  },
  status: {
    application: {
      accessToken: "Token voor toegang",
      endpoints: "Eindpunten",
      locale: "Taal",
      localeNotAvailable: "{{ app }} is nog niet vertaald in {{ locale }}",
      name: "Naam",
      summaryTitle: "Applicatie-instellingen",
      themeColor: "Themakleur",
      themeColorScheme: "Thema",
      themeColorSchemeValue: {
        automatic: "Automatisch",
        dark: "Donker",
        light: "Licht",
      },
    },
    publication: {
      locale: "Taal",
      me: "Webadres",
      mediaEndpoint: "Media-endpoint",
      postTypes: "Artikeltype",
      preset: "Vooringestelde",
      store: "Content store",
      summaryTitle: "Publicatie-instellingen",
      syndicationTargets: "Syndicatiedoelen",
      timeZone: "Tijdzone",
    },
    title: "Status server",
  },
};
