using Microsoft.EntityFrameworkCore;
using Backend_SIGMA.Models;
using Backend_SIGMA.Models.DTO;

namespace Backend_SIGMA.Data
{
    public class AsignacionesData
    {
        private readonly AppDbContext _context;

        public AsignacionesData(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL
        public async Task<List<AsignacionDTO>> GetAllAsync()
        {
            return await _context.VehiculoAsignaciones
                .Include(a => a.Vehiculo)
                .Include(a => a.Usuario)
                .OrderByDescending(a => a.FechaInicio)
                .Select(a => new AsignacionDTO
                {
                    IdAsignacion = a.IdAsignacion,
                    IdVehiculo = a.IdVehiculo,
                    VehiculoInfo = a.Vehiculo.Marca + " " + a.Vehiculo.Modelo + " (" + a.Vehiculo.NumeroEconomico + ")",
                    NumeroEconomico = a.Vehiculo.NumeroEconomico,
                    Placas = a.Vehiculo.Placas,
                    IdUsuario = a.IdUsuario,
                    ConductorNombre = a.Usuario.Nombre,
                    ConductorCorreo = a.Usuario.Correo,
                    FechaInicio = a.FechaInicio,
                    FechaFin = a.FechaFin,
                    Activo = a.Activo,
                    DuracionDias = a.FechaFin.HasValue 
                        ? (a.FechaFin.Value - a.FechaInicio).Days 
                        : (DateTime.Now - a.FechaInicio).Days
                })
                .ToListAsync();
        }

        // GET BY ID
        public async Task<AsignacionDTO?> GetByIdAsync(int id)
        {
            return await _context.VehiculoAsignaciones
                .Include(a => a.Vehiculo)
                .Include(a => a.Usuario)
                .Where(a => a.IdAsignacion == id)
                .Select(a => new AsignacionDTO
                {
                    IdAsignacion = a.IdAsignacion,
                    IdVehiculo = a.IdVehiculo,
                    VehiculoInfo = a.Vehiculo.Marca + " " + a.Vehiculo.Modelo + " (" + a.Vehiculo.NumeroEconomico + ")",
                    NumeroEconomico = a.Vehiculo.NumeroEconomico,
                    Placas = a.Vehiculo.Placas,
                    IdUsuario = a.IdUsuario,
                    ConductorNombre = a.Usuario.Nombre,
                    ConductorCorreo = a.Usuario.Correo,
                    FechaInicio = a.FechaInicio,
                    FechaFin = a.FechaFin,
                    Activo = a.Activo,
                    DuracionDias = a.FechaFin.HasValue 
                        ? (a.FechaFin.Value - a.FechaInicio).Days 
                        : (DateTime.Now - a.FechaInicio).Days
                })
                .FirstOrDefaultAsync();
        }

        // GET ACTIVAS
        public async Task<List<AsignacionDTO>> GetActivasAsync()
        {
            return await _context.VehiculoAsignaciones
                .Include(a => a.Vehiculo)
                .Include(a => a.Usuario)
                .Where(a => a.Activo)
                .OrderByDescending(a => a.FechaInicio)
                .Select(a => new AsignacionDTO
                {
                    IdAsignacion = a.IdAsignacion,
                    IdVehiculo = a.IdVehiculo,
                    VehiculoInfo = a.Vehiculo.Marca + " " + a.Vehiculo.Modelo + " (" + a.Vehiculo.NumeroEconomico + ")",
                    NumeroEconomico = a.Vehiculo.NumeroEconomico,
                    Placas = a.Vehiculo.Placas,
                    IdUsuario = a.IdUsuario,
                    ConductorNombre = a.Usuario.Nombre,
                    ConductorCorreo = a.Usuario.Correo,
                    FechaInicio = a.FechaInicio,
                    FechaFin = a.FechaFin,
                    Activo = a.Activo,
                    DuracionDias = (DateTime.Now - a.FechaInicio).Days
                })
                .ToListAsync();
        }

        // GET BY VEHICULO
        public async Task<List<AsignacionDTO>> GetByVehiculoAsync(int vehiculoId)
        {
            return await _context.VehiculoAsignaciones
                .Include(a => a.Vehiculo)
                .Include(a => a.Usuario)
                .Where(a => a.IdVehiculo == vehiculoId)
                .OrderByDescending(a => a.FechaInicio)
                .Select(a => new AsignacionDTO
                {
                    IdAsignacion = a.IdAsignacion,
                    IdVehiculo = a.IdVehiculo,
                    VehiculoInfo = a.Vehiculo.Marca + " " + a.Vehiculo.Modelo + " (" + a.Vehiculo.NumeroEconomico + ")",
                    NumeroEconomico = a.Vehiculo.NumeroEconomico,
                    Placas = a.Vehiculo.Placas,
                    IdUsuario = a.IdUsuario,
                    ConductorNombre = a.Usuario.Nombre,
                    ConductorCorreo = a.Usuario.Correo,
                    FechaInicio = a.FechaInicio,
                    FechaFin = a.FechaFin,
                    Activo = a.Activo,
                    DuracionDias = a.FechaFin.HasValue 
                        ? (a.FechaFin.Value - a.FechaInicio).Days 
                        : (DateTime.Now - a.FechaInicio).Days
                })
                .ToListAsync();
        }

        // GET BY CONDUCTOR
        public async Task<List<AsignacionDTO>> GetByConductorAsync(int usuarioId)
        {
            return await _context.VehiculoAsignaciones
                .Include(a => a.Vehiculo)
                .Include(a => a.Usuario)
                .Where(a => a.IdUsuario == usuarioId)
                .OrderByDescending(a => a.FechaInicio)
                .Select(a => new AsignacionDTO
                {
                    IdAsignacion = a.IdAsignacion,
                    IdVehiculo = a.IdVehiculo,
                    VehiculoInfo = a.Vehiculo.Marca + " " + a.Vehiculo.Modelo + " (" + a.Vehiculo.NumeroEconomico + ")",
                    NumeroEconomico = a.Vehiculo.NumeroEconomico,
                    Placas = a.Vehiculo.Placas,
                    IdUsuario = a.IdUsuario,
                    ConductorNombre = a.Usuario.Nombre,
                    ConductorCorreo = a.Usuario.Correo,
                    FechaInicio = a.FechaInicio,
                    FechaFin = a.FechaFin,
                    Activo = a.Activo,
                    DuracionDias = a.FechaFin.HasValue 
                        ? (a.FechaFin.Value - a.FechaInicio).Days 
                        : (DateTime.Now - a.FechaInicio).Days
                })
                .ToListAsync();
        }

        // CREATE
        public async Task<VehiculoAsignacion> CreateAsync(VehiculoAsignacion asignacion)
        {
            // Verificar que el vehículo no tenga asignación activa
            var activa = await _context.VehiculoAsignaciones
                .AnyAsync(a => a.IdVehiculo == asignacion.IdVehiculo && a.Activo);
            
            if (activa)
                throw new InvalidOperationException("El vehículo ya tiene una asignación activa");

            // Verificar que el conductor no tenga asignación activa
            var conductorActivo = await _context.VehiculoAsignaciones
                .AnyAsync(a => a.IdUsuario == asignacion.IdUsuario && a.Activo);
            
            if (conductorActivo)
                throw new InvalidOperationException("El conductor ya tiene un vehículo asignado");

            asignacion.FechaInicio = asignacion.FechaInicio == DateTime.MinValue 
                ? DateTime.Now 
                : asignacion.FechaInicio;
            asignacion.Activo = true;

            _context.VehiculoAsignaciones.Add(asignacion);
            await _context.SaveChangesAsync();
            return asignacion;
        }

        // FINALIZAR ASIGNACIÓN
        public async Task<bool> FinalizarAsync(int id, DateTime? fechaFin = null)
        {
            var asignacion = await _context.VehiculoAsignaciones
                .FirstOrDefaultAsync(a => a.IdAsignacion == id && a.Activo);
            
            if (asignacion == null)
                return false;

            asignacion.Activo = false;
            asignacion.FechaFin = fechaFin ?? DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}