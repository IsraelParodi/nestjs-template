import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

class DIContainer {
  private static instance: DIContainer;
  private app: INestApplicationContext | null = null;

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  /**
   * Initialize NestJS application context - call this once when Lambda starts
   * Uses warm start optimization - app is created once and reused
   */
  async initialize(): Promise<void> {
    if (this.app) {
      console.log('NestJS app already initialized, reusing existing instance');
      return;
    }

    try {
      console.log('Bootstrapping NestJS application for Lambda...');

      // Create NestJS application context (lightweight, no HTTP server)
      this.app = await NestFactory.createApplicationContext(AppModule, {
        logger: ['error', 'warn'],
      });

      console.log('NestJS application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize NestJS application:', error);
      throw error;
    }
  }

  /**
   * Get a service instance from NestJS DI container
   * Example: diContainer.get<CreateUserUseCase>('CreateUserUseCase')
   */
  get<T>(token: string | any): T {
    if (!this.app) {
      throw new Error(
        'NestJS application not initialized. Call initialize() first.',
      );
    }

    try {
      // Try to resolve by token string first, then by class
      return this.app.get<T>(token);
    } catch (error) {
      throw new Error(
        `Failed to resolve service ${typeof token === 'string' ? token : token?.name}: ${error.message}`,
      );
    }
  }

  /**
   * Get the NestJS application context directly
   */
  getApp(): INestApplicationContext {
    if (!this.app) {
      throw new Error(
        'NestJS application not initialized. Call initialize() first.',
      );
    }
    return this.app;
  }

  /**
   * Close the application (useful for testing)
   */
  async close(): Promise<void> {
    if (this.app) {
      await this.app.close();
      this.app = null;
    }
  }

  /**
   * Check if app is initialized
   */
  isInitialized(): boolean {
    return this.app !== null;
  }
}

// Export singleton instance
export const diContainer = DIContainer.getInstance();
