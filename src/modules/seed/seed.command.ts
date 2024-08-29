// src/modules/seed/seed.command.ts

import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { SeedService } from './seed.service';

@Injectable()
export class SeedCommand {
  constructor(private readonly seedService: SeedService) {}

  @Command({ command: 'seed:admin', describe: 'Seed admin user' })
  async seedAdmin() {
    await this.seedService.seedAdmin();
  }
}
