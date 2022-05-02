/* eslint-disable import/no-anonymous-default-export */
export default {
  error: "Erro",
  errorSummaryTitle: "Há um problema",
  errors: {
    noDatabase: {
      content: "Esse recurso requer um banco de dados.",
    },
    notFound: {
      content:
        "Se você inseriu um endereço da web, verifique se ele estava correto.",
      title: "Página não encontrada",
    },
  },
  guidance: {
    discovery:
      "Para que %s possa ser descoberto pelos clientes da Micropub e solicitar permissão para postar em seu site, adicione os seguintes valores ao `<head>` do seu site:",
  },
  noValue: "Não definido",
  optionalValue: "(opcional)",
  session: {
    login: {
      description: "Faça login com IndieAuth para verificar se você possui %s",
      error: {
        validateRedirect: "Tentativa de redirecionamento inválido",
        validateState: "Falta de correspondência de `code` ou `state`",
      },
      me: "Endereço Web",
      submit: "Faça login com IndieAuth",
      title: "Fazer login",
    },
    logout: {
      title: "Sair",
    },
  },
  status: {
    application: {
      accessToken: "Token de acesso",
      endpoints: "Pontos de extremidade",
      locale: "Idioma",
      localeNotAvailable: "{{ app }} ainda não foi traduzido para {{ locale }}",
      name: "Nome",
      summaryTitle: "Configurações de aplicação",
      themeColor: "Cor do tema",
      themeColorScheme: "Tema",
      themeColorSchemeValue: {
        automatic: "Automática",
        dark: "Escuro",
        light: "Luz",
      },
    },
    publication: {
      locale: "Idioma",
      me: "Endereço Web",
      mediaEndpoint: "Endpoint de mídia",
      postTypes: "Tipos de postagem",
      preset: "Pré-ajuste",
      store: "Loja de conteúdo",
      summaryTitle: "Configurações de publicação",
      syndicationTargets: "Locais de distribuição",
      timeZone: "Fuso horário",
    },
    title: "Status do servidor",
  },
};
