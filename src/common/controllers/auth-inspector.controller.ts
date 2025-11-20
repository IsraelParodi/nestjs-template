import { Controller, Get } from '@nestjs/common';
import { AuthInspectorService } from '../services/auth-inspector.service';

@Controller('auth-inspector')
export class AuthInspectorController {
  constructor(private readonly authInspectorService: AuthInspectorService) {}

  @Get()
  getAuthMap() {
    return this.authInspectorService.getAuthMetadata();
  }
}
