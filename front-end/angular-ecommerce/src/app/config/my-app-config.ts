export default {

    oidc : {
        clientId : '0oae0u0fgmHROPf5G5d7',
        issuer: 'https://dev-71258356.okta.com/oauth2/default',
        redirectUri: 'https://localhost:4200/login/callback', // once the user successfully logsin he is taken to this page
        scopes:['openid', 'profile', 'email']
    }
}
