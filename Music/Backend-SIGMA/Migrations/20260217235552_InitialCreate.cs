using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend_SIGMA.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EstatusSiniestros",
                columns: table => new
                {
                    IdEstatus = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstatusSiniestros", x => x.IdEstatus);
                });

            migrationBuilder.CreateTable(
                name: "Proveedores",
                columns: table => new
                {
                    IdProveedor = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Correo = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Proveedores", x => x.IdProveedor);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    IdRol = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.IdRol);
                });

            migrationBuilder.CreateTable(
                name: "TiposMantenimiento",
                columns: table => new
                {
                    IdTipo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiposMantenimiento", x => x.IdTipo);
                });

            migrationBuilder.CreateTable(
                name: "Vehiculos",
                columns: table => new
                {
                    IdVehiculo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NumeroEconomico = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Marca = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Modelo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Anio = table.Column<int>(type: "int", nullable: true),
                    Placas = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Vin = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    KilometrajeActual = table.Column<int>(type: "int", nullable: true),
                    Estatus = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    FechaAlta = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vehiculos", x => x.IdVehiculo);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    IdUsuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Correo = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Estatus = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    IdRol = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.IdUsuario);
                    table.ForeignKey(
                        name: "FK_Usuarios_Roles_IdRol",
                        column: x => x.IdRol,
                        principalTable: "Roles",
                        principalColumn: "IdRol",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Mantenimientos",
                columns: table => new
                {
                    IdMantenimiento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdVehiculo = table.Column<int>(type: "int", nullable: false),
                    IdTipo = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Kilometraje = table.Column<int>(type: "int", nullable: true),
                    Costo = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: true),
                    IdProveedor = table.Column<int>(type: "int", nullable: true),
                    Observaciones = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RegistradoPor = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mantenimientos", x => x.IdMantenimiento);
                    table.ForeignKey(
                        name: "FK_Mantenimientos_Proveedores_IdProveedor",
                        column: x => x.IdProveedor,
                        principalTable: "Proveedores",
                        principalColumn: "IdProveedor",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Mantenimientos_TiposMantenimiento_IdTipo",
                        column: x => x.IdTipo,
                        principalTable: "TiposMantenimiento",
                        principalColumn: "IdTipo",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Mantenimientos_Usuarios_RegistradoPor",
                        column: x => x.RegistradoPor,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Mantenimientos_Vehiculos_IdVehiculo",
                        column: x => x.IdVehiculo,
                        principalTable: "Vehiculos",
                        principalColumn: "IdVehiculo",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Siniestros",
                columns: table => new
                {
                    IdSiniestro = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdVehiculo = table.Column<int>(type: "int", nullable: false),
                    IdConductor = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ubicacion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdEstatus = table.Column<int>(type: "int", nullable: false),
                    AtendidoPor = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Siniestros", x => x.IdSiniestro);
                    table.ForeignKey(
                        name: "FK_Siniestros_EstatusSiniestros_IdEstatus",
                        column: x => x.IdEstatus,
                        principalTable: "EstatusSiniestros",
                        principalColumn: "IdEstatus",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Siniestros_Usuarios_AtendidoPor",
                        column: x => x.AtendidoPor,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Siniestros_Usuarios_IdConductor",
                        column: x => x.IdConductor,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Siniestros_Vehiculos_IdVehiculo",
                        column: x => x.IdVehiculo,
                        principalTable: "Vehiculos",
                        principalColumn: "IdVehiculo",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VehiculoAsignaciones",
                columns: table => new
                {
                    IdAsignacion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdVehiculo = table.Column<int>(type: "int", nullable: false),
                    IdUsuario = table.Column<int>(type: "int", nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Activo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehiculoAsignaciones", x => x.IdAsignacion);
                    table.ForeignKey(
                        name: "FK_VehiculoAsignaciones_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VehiculoAsignaciones_Vehiculos_IdVehiculo",
                        column: x => x.IdVehiculo,
                        principalTable: "Vehiculos",
                        principalColumn: "IdVehiculo",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SiniestroEvidencias",
                columns: table => new
                {
                    IdEvidencia = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdSiniestro = table.Column<int>(type: "int", nullable: false),
                    Tipo = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false, defaultValue: "FOTO"),
                    ArchivoBase64 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MimeType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    FechaSubida = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiniestroEvidencias", x => x.IdEvidencia);
                    table.ForeignKey(
                        name: "FK_SiniestroEvidencias_Siniestros_IdSiniestro",
                        column: x => x.IdSiniestro,
                        principalTable: "Siniestros",
                        principalColumn: "IdSiniestro",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Mantenimientos_IdProveedor",
                table: "Mantenimientos",
                column: "IdProveedor");

            migrationBuilder.CreateIndex(
                name: "IX_Mantenimientos_IdTipo",
                table: "Mantenimientos",
                column: "IdTipo");

            migrationBuilder.CreateIndex(
                name: "IX_Mantenimientos_IdVehiculo",
                table: "Mantenimientos",
                column: "IdVehiculo");

            migrationBuilder.CreateIndex(
                name: "IX_Mantenimientos_RegistradoPor",
                table: "Mantenimientos",
                column: "RegistradoPor");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Nombre",
                table: "Roles",
                column: "Nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SiniestroEvidencias_IdSiniestro",
                table: "SiniestroEvidencias",
                column: "IdSiniestro");

            migrationBuilder.CreateIndex(
                name: "IX_Siniestros_AtendidoPor",
                table: "Siniestros",
                column: "AtendidoPor");

            migrationBuilder.CreateIndex(
                name: "IX_Siniestros_IdConductor",
                table: "Siniestros",
                column: "IdConductor");

            migrationBuilder.CreateIndex(
                name: "IX_Siniestros_IdEstatus",
                table: "Siniestros",
                column: "IdEstatus");

            migrationBuilder.CreateIndex(
                name: "IX_Siniestros_IdVehiculo",
                table: "Siniestros",
                column: "IdVehiculo");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Correo",
                table: "Usuarios",
                column: "Correo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_IdRol",
                table: "Usuarios",
                column: "IdRol");

            migrationBuilder.CreateIndex(
                name: "IX_VehiculoAsignaciones_IdUsuario",
                table: "VehiculoAsignaciones",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_VehiculoAsignaciones_IdVehiculo",
                table: "VehiculoAsignaciones",
                column: "IdVehiculo");

            migrationBuilder.CreateIndex(
                name: "IX_Vehiculos_NumeroEconomico",
                table: "Vehiculos",
                column: "NumeroEconomico",
                unique: true,
                filter: "[NumeroEconomico] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Vehiculos_Placas",
                table: "Vehiculos",
                column: "Placas",
                unique: true,
                filter: "[Placas] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Vehiculos_Vin",
                table: "Vehiculos",
                column: "Vin",
                unique: true,
                filter: "[Vin] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Mantenimientos");

            migrationBuilder.DropTable(
                name: "SiniestroEvidencias");

            migrationBuilder.DropTable(
                name: "VehiculoAsignaciones");

            migrationBuilder.DropTable(
                name: "Proveedores");

            migrationBuilder.DropTable(
                name: "TiposMantenimiento");

            migrationBuilder.DropTable(
                name: "Siniestros");

            migrationBuilder.DropTable(
                name: "EstatusSiniestros");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Vehiculos");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
