using Microsoft.EntityFrameworkCore;
using Backend_SIGMA.Models;
using Backend_SIGMA.Models.DTO;
using Backend_SIGMA.Models.Request;

namespace Backend_SIGMA.Data
{
    public class MantenimientosData
    {
        private readonly AppDbContext _context;

        public MantenimientosData(AppDbContext context)
        {
            _context = context;
        }

        // ============ MANTENIMIENTOS ============

        public async Task<List<MantenimientoDTO>> GetAllAsync(int? vehiculoId = null)
        {
            var query = _context.Mantenimientos
                .Include(m => m.Vehiculo)
                .Include(m => m.TipoMantenimiento)
                .Include(m => m.Proveedor)
                .Include(m => m.UsuarioRegistro)
                .OrderByDescending(m => m.Fecha)
                .AsQueryable();

            if (vehiculoId.HasValue)
                query = query.Where(m => m.IdVehiculo == vehiculoId.Value);

            return await query.Select(m => new MantenimientoDTO
            {
                IdMantenimiento = m.IdMantenimiento,
                IdVehiculo = m.IdVehiculo,
                VehiculoInfo = m.Vehiculo.Marca + " " + m.Vehiculo.Modelo,
                NumeroEconomico = m.Vehiculo.NumeroEconomico,
                IdTipo = m.IdTipo,
                TipoNombre = m.TipoMantenimiento.Nombre,
                Fecha = m.Fecha,
                Kilometraje = m.Kilometraje,
                Costo = m.Costo,
                IdProveedor = m.IdProveedor,
                ProveedorNombre = m.Proveedor != null ? m.Proveedor.Nombre : null,
                Observaciones = m.Observaciones,
                RegistradoPor = m.RegistradoPor,
                RegistradoPorNombre = m.UsuarioRegistro != null ? m.UsuarioRegistro.Nombre : null
            }).ToListAsync();
        }

        public async Task<MantenimientoDTO?> GetByIdAsync(int id)
        {
            return await _context.Mantenimientos
                .Include(m => m.Vehiculo)
                .Include(m => m.TipoMantenimiento)
                .Include(m => m.Proveedor)
                .Include(m => m.UsuarioRegistro)
                .Where(m => m.IdMantenimiento == id)
                .Select(m => new MantenimientoDTO
                {
                    IdMantenimiento = m.IdMantenimiento,
                    IdVehiculo = m.IdVehiculo,
                    VehiculoInfo = m.Vehiculo.Marca + " " + m.Vehiculo.Modelo,
                    NumeroEconomico = m.Vehiculo.NumeroEconomico,
                    IdTipo = m.IdTipo,
                    TipoNombre = m.TipoMantenimiento.Nombre,
                    Fecha = m.Fecha,
                    Kilometraje = m.Kilometraje,
                    Costo = m.Costo,
                    IdProveedor = m.IdProveedor,
                    ProveedorNombre = m.Proveedor != null ? m.Proveedor.Nombre : null,
                    Observaciones = m.Observaciones,
                    RegistradoPor = m.RegistradoPor,
                    RegistradoPorNombre = m.UsuarioRegistro != null ? m.UsuarioRegistro.Nombre : null
                })
                .FirstOrDefaultAsync();
        }

        public async Task<Mantenimiento> CreateAsync(Mantenimiento mantenimiento)
        {
            _context.Mantenimientos.Add(mantenimiento);
            await _context.SaveChangesAsync();
            return mantenimiento;
        }

        public async Task<Mantenimiento?> UpdateAsync(int id, MantenimientoUpdateRequest request)
        {
            var mantenimiento = await _context.Mantenimientos.FindAsync(id);
            if (mantenimiento == null) return null;

            if (request.IdTipo.HasValue)
                mantenimiento.IdTipo = request.IdTipo.Value;

            if (request.Fecha.HasValue)
                mantenimiento.Fecha = request.Fecha.Value;

            if (request.Kilometraje.HasValue)
                mantenimiento.Kilometraje = request.Kilometraje.Value;

            if (request.Costo.HasValue)
                mantenimiento.Costo = request.Costo.Value;

            if (request.IdProveedor.HasValue)
                mantenimiento.IdProveedor = request.IdProveedor.Value;

            if (!string.IsNullOrWhiteSpace(request.Observaciones))
                mantenimiento.Observaciones = request.Observaciones;

            await _context.SaveChangesAsync();
            return mantenimiento;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var mantenimiento = await _context.Mantenimientos.FindAsync(id);
            if (mantenimiento == null) return false;

            _context.Mantenimientos.Remove(mantenimiento);
            await _context.SaveChangesAsync();
            return true;
        }

        // ============ TIPOS DE MANTENIMIENTO ============

        public async Task<List<TipoMantenimientoDTO>> GetTiposAsync()
        {
            return await _context.TiposMantenimiento
                .OrderBy(t => t.Nombre)
                .Select(t => new TipoMantenimientoDTO
                {
                    IdTipo = t.IdTipo,
                    Nombre = t.Nombre,
                    Descripcion = t.Descripcion,
                    TotalMantenimientos = t.Mantenimientos.Count
                })
                .ToListAsync();
        }

        public async Task<TipoMantenimiento?> GetTipoByIdAsync(int id)
        {
            return await _context.TiposMantenimiento
                .Include(t => t.Mantenimientos)
                .FirstOrDefaultAsync(t => t.IdTipo == id);
        }

        public async Task<TipoMantenimiento> CreateTipoAsync(TipoMantenimiento tipo)
        {
            _context.TiposMantenimiento.Add(tipo);
            await _context.SaveChangesAsync();
            return tipo;
        }

        public async Task<TipoMantenimiento?> UpdateTipoAsync(int id, TipoMantenimientoUpdateRequest request)
        {
            var tipo = await _context.TiposMantenimiento.FindAsync(id);
            if (tipo == null) return null;

            if (!string.IsNullOrWhiteSpace(request.Nombre))
                tipo.Nombre = request.Nombre;

            if (request.Descripcion != null)
                tipo.Descripcion = request.Descripcion;

            await _context.SaveChangesAsync();
            return tipo;
        }

        public async Task<bool> DeleteTipoAsync(int id)
        {
            var tipo = await _context.TiposMantenimiento.FindAsync(id);
            if (tipo == null) return false;

            _context.TiposMantenimiento.Remove(tipo);
            await _context.SaveChangesAsync();
            return true;
        }

        // ============ PROVEEDORES ============

        public async Task<List<ProveedorDTO>> GetProveedoresAsync()
        {
            return await _context.Proveedores
                .OrderBy(p => p.Nombre)
                .Select(p => new ProveedorDTO
                {
                    IdProveedor = p.IdProveedor,
                    Nombre = p.Nombre,
                    Telefono = p.Telefono,
                    Correo = p.Correo,
                    TotalMantenimientos = p.Mantenimientos.Count
                })
                .ToListAsync();
        }

        public async Task<Proveedor?> GetProveedorByIdAsync(int id)
        {
            return await _context.Proveedores
                .Include(p => p.Mantenimientos)
                .FirstOrDefaultAsync(p => p.IdProveedor == id);
        }

        public async Task<Proveedor> CreateProveedorAsync(Proveedor proveedor)
        {
            _context.Proveedores.Add(proveedor);
            await _context.SaveChangesAsync();
            return proveedor;
        }

        public async Task<Proveedor?> UpdateProveedorAsync(int id, ProveedorUpdateRequest request)
        {
            var proveedor = await _context.Proveedores.FindAsync(id);
            if (proveedor == null) return null;

            if (!string.IsNullOrWhiteSpace(request.Nombre))
                proveedor.Nombre = request.Nombre;

            if (request.Telefono != null)
                proveedor.Telefono = request.Telefono;

            if (request.Correo != null)
                proveedor.Correo = request.Correo;

            await _context.SaveChangesAsync();
            return proveedor;
        }

        public async Task<bool> DeleteProveedorAsync(int id)
        {
            var proveedor = await _context.Proveedores.FindAsync(id);
            if (proveedor == null) return false;

            _context.Proveedores.Remove(proveedor);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}