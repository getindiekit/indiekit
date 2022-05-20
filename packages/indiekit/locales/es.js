export default {
  error: "Error",
  errorSummaryTitle: "Hay un problema",
  errors: {
    noDatabase: {
      content: "Esta función requiere una base de datos.",
    },
    notFound: {
      content: "Si ha ingresido una dirección web, compruebe que es correcta.",
      title: "Página no encontrada",
    },
  },
  guidance: {
    discovery:
      "Para que los clientes de Micropub puedan descubrir %s y solicitar permiso para publicar en su sitio web, agregue los siguientes valores a `<head>` de su sitio web:",
  },
  noValue: "No establecido",
  optionalValue: "(opcional)",
  session: {
    login: {
      description:
        "Inicia sesión con IndieAuth para verificar que eres propietario de %s",
      error: {
        validateRedirect: "Intento de redirección inválida",
        validateState: "Código faltante o discrepancia de estado",
      },
      me: "Dirección web",
      submit: "Iniciar sesión con IndieAuth",
      title: "Iniciar sesión",
    },
    logout: {
      title: "Cerrar sesión",
    },
  },
  status: {
    application: {
      accessToken: "Token de acceso",
      endpoints: "Puntos finales",
      installedPlugins: "Plug-ins instalados",
      locale: "Idioma",
      localeNotAvailable: "{{app}} aún no se ha traducido a {{locale}}",
      name: "Nombre",
      scope: "Alcance proporcionado",
      summaryTitle: "Ajustes de la aplicación",
      themeColor: "Color del tema",
      themeColorScheme: "Tema",
      themeColorSchemeValue: {
        automatic: "Automático",
        dark: "Oscuro",
        light: "Claro",
      },
    },
    publication: {
      accessToken: "Token de acceso",
      authorizationEndpoint: "Punto final de autorización",
      locale: "Idioma",
      me: "Dirección web",
      mediaEndpoint: "Punto final de medios",
      micropubEndpoint: "Punto final de Micropub",
      postTypes: "Tipos de publicaciones",
      preset: "Preestablecido",
      store: "Almacén de contenido",
      summaryTitle: "Configuración de publicación",
      syndicationTargets: "Objetivos de sindicación",
      timeZone: "Zona horaria",
      tokenEndpoint: "Punto final de token",
    },
    title: "Estado del servidor",
  },
};
