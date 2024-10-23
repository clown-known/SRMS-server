import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { SendMailDTO } from './mail.dto';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async emitRegisterEmail(email: string, username: string) {
    const sendMailDto: SendMailDTO = {
      to: email,
      subject: 'Welcome to our website',
      emailTemplate: 'WELCOME',
      context: { username },
    };

    try {
      await this.kafkaClient.emit('auth.registration', sendMailDto);
      console.log('Registration email event emitted:', sendMailDto);
    } catch (error) {
      console.error('Error emitting registration email event:', error);
      throw error;
    }
  }

  async emitAuthenCode(email: string, authCode: string) {
    const sendMailDto: SendMailDTO = {
      to: email,
      subject: 'Your Authentication Code',
      emailTemplate: 'PASSWORD_RESET',
      context: {
        authCode,
      },
    };

    try {
      console.log(`Emitting auth code to Kafka for email: ${email}`);
      await this.kafkaClient.emit('auth.authcode', sendMailDto);
      console.log('Auth code email event emitted:', sendMailDto);
    } catch (error) {
      console.error('Error emitting auth code email event:', error);
      throw error;
    }
  }

  async emitCreateAccount(email: string, username: string) {
    const sendMailDto: SendMailDTO = {
      to: email,
      subject: 'Account Created Successfully',
      emailTemplate: 'CREATE_ACCOUNT',
      context: { username },
    };

    try {
      await this.kafkaClient.emit('account.creation', sendMailDto);
      console.log('Creation email event emitted:', sendMailDto);
    } catch (error) {
      console.error('Error emitting account creation email event:', error);
      throw error;
    }
  }

  async emitResetPasswordEmail(email: string, newPassword: string) {
    const sendMailDto: SendMailDTO = {
      to: email,
      subject: 'Your Password Has Been Reset',
      emailTemplate: 'ADMIN_PASSWORD',
      context: { newPassword },
    };

    try {
      await this.kafkaClient.emit('account.resetpassword', sendMailDto);
      console.log('Password reset email event emitted:', sendMailDto);
    } catch (error) {
      console.error('Error emitting password reset email event:', error);
      throw error;
    }
  }

  async emitResetPasswordSuccess(email: string, username: string) {
    const sendMailDto: SendMailDTO = {
      to: email,
      subject: 'Password Changed Successfully',
      emailTemplate: 'PASSWORD_RESET_SUCCESS',
      context: { username },
    };

    try {
      await this.kafkaClient.emit('account.passwordchangedsuccess', sendMailDto);
      console.log('Creation email event emitted:', sendMailDto);
    } catch (error) {
      console.error('Error emitting reset password success email event:', error);
      throw error;
    }
  }

  async emitAdminUpdated(email: string, username: string) {
    const sendMailDto: SendMailDTO = {
      to: email,
      subject: 'Account Updated By Administrator',
      emailTemplate: 'ADMIN_UPDATED',
      context: { username },
    };

    try {
      await this.kafkaClient.emit('account.adminupdated', sendMailDto);
      console.log('Creation email event emitted:', sendMailDto);
    } catch (error) {
      console.error('Error emitting admin updated user"s profile by admin success email event:', error);
      throw error;
    }
  }

  async emitProfileUpdated(email: string, username: string) {
    const sendMailDto: SendMailDTO = {
      to: email,
      subject: 'Profile Updated Successfully',
      emailTemplate: 'PROFILE_UPDATED',
      context: { username },
    };

    try {
      await this.kafkaClient.emit('account.profileupdated', sendMailDto);
      console.log('Creation email event emitted:', sendMailDto);
    } catch (error) {
      console.error('Error emitting admin updated user"s profile success email event:', error);
      throw error;
    }
  }
}
