export enum EmailTemplate {
    // user register successfully ( done )
    WELCOME = 'WELCOME',

    // Send the authen code for reset password ( done )
    PASSWORD_RESET = 'PASSWORD_RESET',

    // admin create an account success and send mail to the user ( done )
    CREATE_ACCOUNT = 'CREATE_ACCOUNT',

    // Admin send a password as a random string for user ( done )
    ADMIN_PASSWORD = 'ADMIN_PASSWORD',

    // user change password successfully ( both forgot password and change password ways ) (done)
    PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS',

    // admin update user's accounts
    ADMIN_UPDATED = 'ADMIN_UPDATED',

    // user updated profile successfully
    PROFILE_UPDATED = 'PROFILE_UPDATED',


}
