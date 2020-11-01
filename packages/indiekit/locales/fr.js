export const fr = {
  error: 'Erreur',
  errorSummaryTitle: 'Il y a un problème',
  noValue: 'Pas encore défini',
  optionalValue: '(facultatif)',
  guidance: {
    discovery: 'Alors que {{app}} peut être repéré par les clients Micropub et demander l’autorisation de publier sur votre site, ajoutez les valeurs suivantes à la partie `<head>` de votre site web:'
  },
  session: {
    login: {
      title: 'Se connecter',
      description: 'Connectez-vous avec IndieAuth pour vérifier que %s vous appartient',
      me: 'Adresse web',
      submit: 'Connectez-vous avec IndieAuth',
      error: {
        validateRedirect: 'Tentative de redirection non valide',
        validateState: 'Code manquant ou décalage état'
      }
    },
    logout: {
      title: 'Déconnexion'
    }
  },
  status: {
    title: 'Statut du serveur',
    application: {
      summaryTitle: 'Paramètres de l’application',
      name: 'Nom de l’application',
      locale: 'Langue',
      localeNotAvailable: '{{ app }} n’a pas encore été traduit en {{ locale }}',
      themeColor: 'Couleur de thème',
      themeColorScheme: 'Schéma de couleurs du thème',
      themeColorSchemeValue: {
        automatic: 'Automatique',
        light: 'Lumière',
        dark: 'Sombre'
      },
      endpoints: 'Endpoints'
    },
    publication: {
      summaryTitle: 'Paramètres de Puplication',
      me: 'Adresse web',
      locale: 'Langue',
      timeZone: 'Fuseau horaire',
      store: 'Magasin de contenu',
      preset: 'Préréglage',
      postTypes: 'Types de article',
      syndicationTargets: 'Cibles de syndication',
      mediaEndpoint: 'Media endpoint',
      accessToken: 'Jeton d’accès'
    }
  }
};
