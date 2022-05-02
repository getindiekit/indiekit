/* eslint-disable import/no-anonymous-default-export */
export default {
  error: "Erreur",
  errorSummaryTitle: "Il y a un problème",
  errors: {
    noDatabase: {
      content: "Cette fonctionnalité nécessite une base de données.",
    },
    notFound: {
      content:
        "Si vous avez saisi une adresse Web, veuillez vérifier qu'elle est correcte.",
      title: "Page introuvable",
    },
  },
  guidance: {
    discovery:
      "Pour que %s puisse être découvert par les clients Micropub et demander l'autorisation de publier sur votre site Web, ajoutez les valeurs suivantes à la valeur `<head>` de votre site Web:",
  },
  noValue: "Non définie",
  optionalValue: "(facultatif)",
  session: {
    login: {
      description:
        "Connectez-vous avec IndieAuth pour vérifier que vous possédez %s",
      error: {
        validateRedirect: "Tentative de redirection non valide",
        validateState: "`code` ou `state` incorrect",
      },
      me: "Adresse Web",
      submit: "Connectez-vous avec IndieAuth",
      title: "Se connecter",
    },
    logout: {
      title: "Déconnexion",
    },
  },
  status: {
    application: {
      accessToken: "Jeton d'accès",
      endpoints: "Points finaux",
      locale: "Langue",
      localeNotAvailable:
        "{{ app }} n’a pas encore été traduit en {{ locale }}",
      name: "Nom",
      summaryTitle: "Paramètres d'application",
      themeColor: "Couleur du Thème",
      themeColorScheme: "Schéma de couleurs du Thème",
      themeColorSchemeValue: {
        automatic: "Automatique",
        dark: "Sombre",
        light: "Lumière",
      },
      installedPlugins: "Plugins installés",
    },
    publication: {
      locale: "Langue",
      me: "Adresse Web",
      mediaEndpoint: "Media endpoint",
      postTypes: "Types de poste",
      preset: "Préréglage",
      store: "Magasin de contenu",
      summaryTitle: "Paramètres de publication",
      syndicationTargets: "Cibles de syndication",
      timeZone: "Fuseau horaire",
    },
    title: "Statut du serveur",
  },
};
