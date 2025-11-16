import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('states')
export class StateEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'int', name: 'country_id', nullable: false }) // Specify column name
  countryId: number;

  @Column({ type: 'char', length: 2, name: 'country_code', nullable: false }) // Specify column name
  countryCode: string;

  @Column({ type: 'varchar', length: 255, name: 'fips_code', nullable: true })
  fipsCode?: string;

  @Column({ type: 'varchar', length: 255, name: 'iso2', nullable: true })
  iso2?: string;

  @Column({ type: 'varchar', length: 191, name: 'type', nullable: true })
  type?: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 8,
    name: 'latitude',
    nullable: true,
  })
  latitude?: number;

  @Column({
    type: 'numeric',
    precision: 11,
    scale: 8,
    name: 'longitude',
    nullable: true,
  })
  longitude?: number;

  @Column({ type: 'timestamp', name: 'created_at', nullable: true })
  createdAt?: Date;

  @Column({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updatedAt: Date;

  @Column({ type: 'smallint', name: 'flag', default: 1, nullable: false })
  flag: number;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'wikiDataId',
    nullable: true,
  })
  wikiDataId?: string;
}
