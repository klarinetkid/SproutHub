drop table if exists dbo.TblMoistureReadings
drop table if exists dbo.TblPlants

create table TblPlants (
	[Id] int primary key clustered identity(1, 1),
	[DisplayName] varchar(50) null
);
set identity_insert dbo.TblPlants on;

create table TblMoistureReadings (
	[Id] int primary key clustered identity(1, 1),
	[PlantId] int references TblPlants(Id) not null,
	[MoistureReading] decimal(5, 2) not null,
	[Date] datetime not null
)