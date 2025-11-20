import { Injectable, RequestMethod } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from '@iam/infrastructure/decorators/auth.decorator';
import { ROLES_KEY } from '@iam/infrastructure/decorators/roles.decorator';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';

@Injectable()
export class AuthInspectorService {
  constructor(
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  getAuthMetadata() {
    const controllers = this.discovery.getControllers();
    const protectedEndpoints = { admin: [], none: [], other: {} };
    const publicEndpoints = { admin: [], none: [], other: {} };

    controllers.forEach((wrapper) => {
      const { instance } = wrapper;
      if (!instance || typeof instance !== 'object') return;

      const controllerName = instance.constructor.name;
      const prototype = Object.getPrototypeOf(instance);
      const controllerPath = this.getControllerPath(instance);
      const classAuthType = this.getClassAuthType(instance);

      const methodNames = this.metadataScanner.getAllMethodNames(prototype);

      methodNames.forEach((methodName) => {
        const method = prototype[methodName];
        if (typeof method !== 'function') return;

        const methodAuthType = this.getMethodAuthType(method, classAuthType);
        const roles = this.reflector.get(ROLES_KEY, method) || [];
        const fullPath = this.getFullPath(method, controllerPath);
        const methodMetadata = this.createMetadata(
          method,
          methodName,
          fullPath,
          methodAuthType,
          roles,
          controllerName,
        );

        this.categorizeEndpoint(
          methodAuthType,
          roles,
          methodMetadata,
          protectedEndpoints,
          publicEndpoints,
        );
      });
    });

    return this.createResult(publicEndpoints, protectedEndpoints);
  }

  private getControllerPath(instance: any): string {
    const controllerPath =
      this.reflector.get('path', instance.constructor) || '';
    return controllerPath === '' || controllerPath === '/'
      ? `/${instance.constructor.name}`
      : controllerPath;
  }

  private getClassAuthType(instance: any): AuthType | undefined {
    const classAuthTypes: AuthType[] =
      this.reflector.get(AUTH_TYPE_KEY, instance.constructor) || [];
    if (classAuthTypes.includes(AuthType.Bearer)) return AuthType.Bearer;
    if (classAuthTypes.includes(AuthType.None)) return AuthType.None;
    return undefined;
  }

  private getMethodAuthType(
    method: Function,
    classAuthType: AuthType | undefined,
  ): AuthType | undefined {
    const methodAuthTypes: AuthType[] =
      this.reflector.get(AUTH_TYPE_KEY, method) || [];
    if (methodAuthTypes.length > 0) {
      if (methodAuthTypes.includes(AuthType.Bearer)) return AuthType.Bearer;
      if (methodAuthTypes.includes(AuthType.None)) return AuthType.None;
    }
    return classAuthType;
  }

  private getFullPath(method: Function, controllerPath: string): string {
    const routePath = this.reflector.get('path', method) || '';
    return routePath === '' || routePath === '/'
      ? `/${controllerPath}`
      : `/${controllerPath}/${routePath}`;
  }

  private createMetadata(
    method: Function,
    methodName: string,
    fullPath: string,
    authType: AuthType,
    roles: string[],
    controllerName: string,
  ) {
    const httpMethod: RequestMethod = this.reflector.get('method', method);
    return {
      controller: controllerName,
      method: methodName,
      httpMethod: this.getHttpMethodName(httpMethod),
      auth: authType === undefined ? 'Unknown' : AuthType[authType],
      roles: roles,
      path: fullPath,
    };
  }

  private categorizeEndpoint(
    authType: AuthType,
    roles: string[],
    metadata: any,
    protectedEndpoints,
    publicEndpoints,
  ) {
    const target =
      authType === AuthType.Bearer ? protectedEndpoints : publicEndpoints;
    if (roles.includes('admin')) {
      target.admin.push(metadata);
    } else if (roles.length === 0) {
      target.none.push(metadata);
    } else {
      roles.forEach((role) => {
        if (!target.other[role]) target.other[role] = [];
        target.other[role].push(metadata);
      });
    }
  }

  private createResult(publicEndpoints: any, protectedEndpoints: any) {
    const result = [];

    const addCategory = (type: string, endpoints: any) => {
      const categories = [
        { role: 'admin', endpoints: endpoints.admin },
        { role: 'none', endpoints: endpoints.none },
        ...Object.keys(endpoints.other).map((role) => ({
          role,
          endpoints: endpoints.other[role],
        })),
      ]
        .filter((category) => category.endpoints.length > 0)
        .map((category) => ({
          ...category,
          count: category.endpoints.length,
        }));

      if (categories.length > 0) {
        result.push({
          type,
          categories,
          totalCount: categories.reduce(
            (sum, category) => sum + category.count,
            0,
          ),
        });
      }
    };

    addCategory('public', publicEndpoints);
    addCategory('protected', protectedEndpoints);

    return result;
  }

  private getHttpMethodName(method: RequestMethod): string {
    const methodMap = {
      [RequestMethod.GET]: 'GET',
      [RequestMethod.POST]: 'POST',
      [RequestMethod.PUT]: 'PUT',
      [RequestMethod.DELETE]: 'DELETE',
      [RequestMethod.PATCH]: 'PATCH',
      [RequestMethod.OPTIONS]: 'OPTIONS',
      [RequestMethod.HEAD]: 'HEAD',
    };
    return methodMap[method] || 'UNKNOWN';
  }
}
