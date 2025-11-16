import { CountryEntity } from '@localities/infrastructure/persistance/orm/entities/country.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('sea_ports')
export class SeaPortEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CountryEntity, (country) => country.id, { nullable: false })
  @JoinColumn({ name: 'country_id' })
  country: CountryEntity;

  @Column({ type: 'varchar', length: 2, name: 'iso2_country' })
  iso2Country: string;

  @Column({ type: 'varchar', length: 10 })
  location: string;

  @Column({ type: 'text' })
  name: string;
}
