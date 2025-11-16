import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { StateEntity } from './states.entity';
import { SeaPortEntity } from '@sea-ports/infrastructure/persistance/orm/entities/sea-port.entity';

@Entity('countries')
export class CountryEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'char', length: 3, nullable: true })
  iso3: string;

  @Column({ type: 'char', length: 3, nullable: true, name: 'numeric_code' })
  numericCode: string;

  @Column({ type: 'char', length: 2, nullable: true })
  iso2: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'phonecode' })
  phoneCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  capital: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  currency: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'currency_name',
  })
  currencyName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'currency_symbol',
  })
  currencySymbol: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tld: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  native: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  region: string;

  @Column({ type: 'int', nullable: true, name: 'region_id' })
  regionId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subregion: string;

  @Column({ type: 'int', nullable: true, name: 'subregion_id' })
  subregionId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nationality: string;

  @Column({ type: 'text', nullable: true })
  timezones: string;

  @Column({ type: 'text', nullable: true })
  translations: string;

  @Column({ type: 'numeric', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'numeric', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'varchar', length: 191, nullable: true })
  emoji: string;

  @Column({ type: 'varchar', length: 191, nullable: true, name: 'emojiU' })
  emojiU: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  updatedAt: Date;

  @Column({ type: 'smallint', default: 1 })
  flag: number;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'wikiDataId' })
  wikiDataId: string;

  // Relationships
  @OneToMany(() => StateEntity, (state) => state.countryId)
  states: StateEntity[];

  @OneToMany(() => SeaPortEntity, (seaport) => seaport.country)
  seaPorts: SeaPortEntity[];
}
