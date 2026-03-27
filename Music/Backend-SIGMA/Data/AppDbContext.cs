using Microsoft.EntityFrameworkCore;
using Backend_SIGMA.Models;

namespace Backend_SIGMA.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Rol> Roles { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Vehiculo> Vehiculos { get; set; }
        public DbSet<VehiculoAsignacion> VehiculoAsignaciones { get; set; }
        public DbSet<TipoMantenimiento> TiposMantenimiento { get; set; }
        public DbSet<Proveedor> Proveedores { get; set; }
        public DbSet<Mantenimiento> Mantenimientos { get; set; }
        public DbSet<EstatusSiniestro> EstatusSiniestros { get; set; }
        public DbSet<Siniestro> Siniestros { get; set; }
        public DbSet<SiniestroEvidencia> SiniestroEvidencias { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Rol>(entity =>
            {
                entity.HasKey(e => e.IdRol);
                entity.Property(e => e.Nombre).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.Nombre).IsUnique();
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.IdUsuario);
                entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Correo).IsRequired().HasMaxLength(120);
                entity.HasIndex(e => e.Correo).IsUnique();
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.Telefono).HasMaxLength(20);
                entity.Property(e => e.Estatus).HasDefaultValue(true);
                entity.Property(e => e.FechaCreacion).HasDefaultValueSql("GETDATE()");

                entity.HasOne(e => e.Rol)
                    .WithMany(r => r.Usuarios)
                    .HasForeignKey(e => e.IdRol)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Vehiculo>(entity =>
            {
                entity.HasKey(e => e.IdVehiculo);
                entity.Property(e => e.NumeroEconomico).HasMaxLength(50);
                entity.HasIndex(e => e.NumeroEconomico).IsUnique().HasFilter("[NumeroEconomico] IS NOT NULL");
                entity.Property(e => e.Marca).HasMaxLength(50);
                entity.Property(e => e.Modelo).HasMaxLength(50);
                entity.Property(e => e.Placas).HasMaxLength(20);
                entity.HasIndex(e => e.Placas).IsUnique().HasFilter("[Placas] IS NOT NULL");
                entity.Property(e => e.Vin).HasMaxLength(50);
                entity.HasIndex(e => e.Vin).IsUnique().HasFilter("[Vin] IS NOT NULL");
                entity.Property(e => e.Estatus).HasMaxLength(30);
            });

            modelBuilder.Entity<VehiculoAsignacion>(entity =>
            {
                entity.HasKey(e => e.IdAsignacion);
                entity.Property(e => e.FechaInicio).IsRequired();
                entity.Property(e => e.Activo).HasDefaultValue(true);

                entity.HasOne(e => e.Vehiculo)
                    .WithMany(v => v.Asignaciones)
                    .HasForeignKey(e => e.IdVehiculo)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Usuario)
                    .WithMany(u => u.Asignaciones)
                    .HasForeignKey(e => e.IdUsuario)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<TipoMantenimiento>(entity =>
            {
                entity.HasKey(e => e.IdTipo);
                entity.Property(e => e.Nombre).IsRequired().HasMaxLength(50);
            });

            modelBuilder.Entity<Proveedor>(entity =>
            {
                entity.HasKey(e => e.IdProveedor);
                entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Correo).HasMaxLength(120);
                entity.Property(e => e.Telefono).HasMaxLength(20);
            });

            modelBuilder.Entity<Mantenimiento>(entity =>
            {
                entity.HasKey(e => e.IdMantenimiento);
                
                entity.HasOne(e => e.Vehiculo)
                    .WithMany(v => v.Mantenimientos)
                    .HasForeignKey(e => e.IdVehiculo)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.TipoMantenimiento)
                    .WithMany(t => t.Mantenimientos)
                    .HasForeignKey(e => e.IdTipo)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Proveedor)
                    .WithMany(p => p.Mantenimientos)
                    .HasForeignKey(e => e.IdProveedor)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.UsuarioRegistro)
                    .WithMany(u => u.MantenimientosRegistrados)
                    .HasForeignKey(e => e.RegistradoPor)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.Costo).HasPrecision(10, 2);
            });


            modelBuilder.Entity<EstatusSiniestro>(entity =>
            {
                entity.HasKey(e => e.IdEstatus);
                entity.Property(e => e.Nombre).IsRequired().HasMaxLength(50);
            });

            modelBuilder.Entity<Siniestro>(entity =>
            {
                entity.HasKey(e => e.IdSiniestro);
                entity.Property(e => e.Fecha).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.Descripcion).IsRequired();

                entity.HasOne(e => e.Vehiculo)
                    .WithMany(v => v.Siniestros)
                    .HasForeignKey(e => e.IdVehiculo)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Conductor)
                    .WithMany(u => u.SiniestrosComoConductor)
                    .HasForeignKey(e => e.IdConductor)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Estatus)
                    .WithMany(e => e.Siniestros)
                    .HasForeignKey(e => e.IdEstatus)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Atendido)
                    .WithMany(u => u.SiniestrosAtendidos)
                    .HasForeignKey(e => e.AtendidoPor)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<SiniestroEvidencia>(entity =>
            {
                entity.HasKey(e => e.IdEvidencia);
                entity.Property(e => e.Tipo).HasMaxLength(30).HasDefaultValue("FOTO");
                entity.Property(e => e.ArchivoBase64).IsRequired();
                entity.Property(e => e.FechaSubida).HasDefaultValueSql("GETDATE()");

                entity.HasOne(e => e.Siniestro)
                    .WithMany(s => s.Evidencias)
                    .HasForeignKey(e => e.IdSiniestro)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}