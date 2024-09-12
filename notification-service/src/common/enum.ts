export enum EmailTemplate {
    WELCOME = 'welcome-template',
    PASSWORD_RESET = 'password-reset-template',
    ACCOUNT_ACTIVATION = 'account-activation-template'
}


export const EmailTemplateSubject: Record<EmailTemplate, string> = {
    [EmailTemplate.WELCOME]: 'Welcome to our systems',
    [EmailTemplate.PASSWORD_RESET]: 'Password Reset',
    [EmailTemplate.ACCOUNT_ACTIVATION]: 'Activate Your Account'
};