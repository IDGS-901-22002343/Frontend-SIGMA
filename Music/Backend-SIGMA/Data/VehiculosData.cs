using Microsoft.EntityFrameworkCore;
using Backend_SIGMA.Models;
using Backend_SIGMA.Models.DTO;

namespace Backend_SIGMA.Data
{
    public class VehiculosData
    {
        private readonly AppDbContext _context;

        public VehiculosData(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL
public async Task<List<VehiculoDTO>> GetAllAsync()
{
    var vehiculos = await _context.Vehiculos
        .Include(v => v.Asignaciones.Where(a => a.Activo))
            .ThenInclude(a => a.Usuario)
        .OrderBy(v => v.NumeroEconomico)
        .ToListAsync();

    return vehiculos.Select(v => new VehiculoDTO
    {
        IdVehiculo = v.IdVehiculo,
        NumeroEconomico = v.NumeroEconomico,
        Marca = v.Marca,
        Modelo = v.Modelo,
        Anio = v.Anio,
        Placas = v.Placas,
        Vin = v.Vin,
        KilometrajeActual = v.KilometrajeActual,
        Estatus = v.Estatus,
        FechaAlta = v.FechaAlta,
        ConductorAsignado = v.Asignaciones?.FirstOrDefault(a => a.Activo)?.Usuario?.Nombre,
        EstaAsignado = v.Asignaciones?.Any(a => a.Activo) ?? false
    }).ToList();
}

        // GET BY ID
        public async Task<Vehiculo?> GetByIdAsync(int id)
        {
            return await _context.Vehiculos
                .Include(v => v.Asignaciones)
                .Include(v => v.Mantenimientos)
                .Include(v => v.Siniestros)
                .FirstOrDefaultAsync(v => v.IdVehiculo == id);
        }

        // CREATE
        public async Task<Vehiculo> CreateAsync(Vehiculo vehiculo)
        {
            _context.Vehiculos.Add(vehiculo);
            await _context.SaveChangesAsync();
            return vehiculo;
        }

        // UPDATE
        public async Task<Vehiculo?> UpdateAsync(int id, Vehiculo vehiculo)
        {
            var existing = await _context.Vehiculos.FindAsync(id);
            if (existing == null) return null;

            existing.NumeroEconomico = vehiculo.NumeroEconomico ?? existing.NumeroEconomico;
            existing.Marca = vehiculo.Marca ?? existing.Marca;
            existing.Modelo = vehiculo.Modelo ?? existing.Modelo;
            existing.Anio = vehiculo.Anio ?? existing.Anio;
            existing.Placas = vehiculo.Placas ?? existing.Placas;
            existing.Vin = vehiculo.Vin ?? existing.Vin;
            existing.KilometrajeActual = vehiculo.KilometrajeActual ?? existing.KilometrajeActual;
            existing.Estatus = vehiculo.Estatus ?? existing.Estatus;

            await _context.SaveChangesAsync();
            return existing;
        }

        // DELETE (SOFT DELETE - cambia estatus a Inactivo)
        public async Task<bool> DeleteAsync(int id)
        {
            var vehiculo = await _context.Vehiculos.FindAsync(id);
            if (vehiculo == null) return false;

            vehiculo.Estatus = "Inactivo";
            await _context.SaveChangesAsync();
            return true;
        }

        // GET DISPONIBLES (sin asignación activa)
        public async Task<List<Vehiculo>> GetDisponiblesAsync()
        {
            var vehiculosAsignados = await _context.VehiculoAsignaciones
                .Where(a => a.Activo)
                .Select(a => a.IdVehiculo)
                .ToListAsync();

            return await _context.Vehiculos
                .Where(v => !vehiculosAsignados.Contains(v.IdVehiculo) && v.Estatus == "Activo")
                .OrderBy(v => v.NumeroEconomico)
                .ToListAsync();
        }

        // CAMBIAR ESTATUS
        public async Task<bool> CambiarEstatusAsync(int id, string nuevoEstatus)
        {
            var vehiculo = await _context.Vehiculos.FindAsync(id);
            if (vehiculo == null) return false;

            vehiculo.Estatus = nuevoEstatus;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}