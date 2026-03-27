using Microsoft.EntityFrameworkCore;
using Backend_SIGMA.Models;
using Backend_SIGMA.Models.DTO;
using Backend_SIGMA.Models.Request;

namespace Backend_SIGMA.Data
{
    public class SiniestrosData
    {
        private readonly AppDbContext _context;

        public SiniestrosData(AppDbContext context)
        {
            _context = context;
        }

        // ============ SINIESTROS ============

        public async Task<List<SiniestroListDTO>> GetAllAsync(
            int? vehiculoId = null,
            int? conductorId = null,
            int? estatusId = null,
            DateTime? desde = null,
            DateTime? hasta = null,
            int? atendidoPor = null)
        {
            var query = _context.Siniestros
                .Include(s => s.Vehiculo)
                .Include(s => s.Conductor)
                .Include(s => s.Estatus)
                .Include(s => s.Atendido)  // 👈 CORREGIDO: antes decía AtendidoPor
                .Include(s => s.Evidencias) // 👈 AGREGADO: necesario para contar evidencias
                .OrderByDescending(s => s.Fecha)
                .AsQueryable();

            if (vehiculoId.HasValue)
                query = query.Where(s => s.IdVehiculo == vehiculoId.Value);

            if (conductorId.HasValue)
                query = query.Where(s => s.IdConductor == conductorId.Value);

            if (estatusId.HasValue)
                query = query.Where(s => s.IdEstatus == estatusId.Value);

            if (desde.HasValue)
                query = query.Where(s => s.Fecha >= desde.Value);

            if (hasta.HasValue)
                query = query.Where(s => s.Fecha <= hasta.Value);

            if (atendidoPor.HasValue)
                query = query.Where(s => s.AtendidoPor == atendidoPor.Value);

            return await query.Select(s => new SiniestroListDTO
            {
                IdSiniestro = s.IdSiniestro,
                IdVehiculo = s.IdVehiculo,
                VehiculoInfo = s.Vehiculo.Marca + " " + s.Vehiculo.Modelo,
                NumeroEconomico = s.Vehiculo.NumeroEconomico,
                Placas = s.Vehiculo.Placas,
                IdConductor = s.IdConductor,
                ConductorNombre = s.Conductor.Nombre,
                Fecha = s.Fecha,
                Descripcion = s.Descripcion,
                Ubicacion = s.Ubicacion,
                IdEstatus = s.IdEstatus,
                EstatusNombre = s.Estatus.Nombre,
                AtendidoPor = s.AtendidoPor,
                AtendidoPorNombre = s.Atendido != null ? s.Atendido.Nombre : null, // 👈 AGREGADO
                TotalEvidencias = s.Evidencias.Count  // 👈 AHORA FUNCIONA
            }).ToListAsync();
        }

        public async Task<SiniestroDTO?> GetByIdAsync(int id)
        {
            return await _context.Siniestros
                .Include(s => s.Vehiculo)
                .Include(s => s.Conductor)
                .Include(s => s.Estatus)
                .Include(s => s.Atendido)  // 👈 CORREGIDO
                .Include(s => s.Evidencias) // 👈 AGREGADO
                .Where(s => s.IdSiniestro == id)
                .Select(s => new SiniestroDTO
                {
                    IdSiniestro = s.IdSiniestro,
                    IdVehiculo = s.IdVehiculo,
                    VehiculoInfo = s.Vehiculo.Marca + " " + s.Vehiculo.Modelo,
                    NumeroEconomico = s.Vehiculo.NumeroEconomico,
                    Marca = s.Vehiculo.Marca,
                    Modelo = s.Vehiculo.Modelo,
                    Placas = s.Vehiculo.Placas,
                    IdConductor = s.IdConductor,
                    ConductorNombre = s.Conductor.Nombre,
                    ConductorCorreo = s.Conductor.Correo,
                    ConductorTelefono = s.Conductor.Telefono,
                    Fecha = s.Fecha,
                    Descripcion = s.Descripcion,
                    Ubicacion = s.Ubicacion,
                    IdEstatus = s.IdEstatus,
                    EstatusNombre = s.Estatus.Nombre,
                    AtendidoPor = s.AtendidoPor,
                    AtendidoPorNombre = s.Atendido != null ? s.Atendido.Nombre : null, // 👈 AGREGADO
                    Evidencias = s.Evidencias.Select(e => new SiniestroEvidenciaDTO
                    {
                        IdEvidencia = e.IdEvidencia,
                        IdSiniestro = e.IdSiniestro,
                        Tipo = e.Tipo,
                        ArchivoBase64 = e.ArchivoBase64,
                        MimeType = e.MimeType,
                        FechaSubida = e.FechaSubida
                    }).ToList()
                })
                .FirstOrDefaultAsync();
        }

        // ... el resto del código igual ...
        
        public async Task<Siniestro> CreateAsync(Siniestro siniestro)
        {
            siniestro.Fecha = siniestro.Fecha == DateTime.MinValue ? DateTime.Now : siniestro.Fecha;
            
            _context.Siniestros.Add(siniestro);
            await _context.SaveChangesAsync();
            return siniestro;
        }

        public async Task<Siniestro?> UpdateAsync(int id, SiniestroUpdateRequest request)
        {
            var siniestro = await _context.Siniestros.FindAsync(id);
            if (siniestro == null) return null;

            if (!string.IsNullOrWhiteSpace(request.Descripcion))
                siniestro.Descripcion = request.Descripcion;

            if (request.Ubicacion != null)
                siniestro.Ubicacion = request.Ubicacion;

            if (request.IdEstatus.HasValue)
                siniestro.IdEstatus = request.IdEstatus.Value;

            if (request.AtendidoPor.HasValue)
                siniestro.AtendidoPor = request.AtendidoPor.Value;

            await _context.SaveChangesAsync();
            return siniestro;
        }

        public async Task<bool> CambiarEstatusAsync(int id, int idEstatus)
        {
            var siniestro = await _context.Siniestros.FindAsync(id);
            if (siniestro == null) return false;

            siniestro.IdEstatus = idEstatus;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var siniestro = await _context.Siniestros
                .Include(s => s.Evidencias)
                .FirstOrDefaultAsync(s => s.IdSiniestro == id);
                
            if (siniestro == null) return false;

            // Eliminar evidencias primero (por la FK)
            _context.SiniestroEvidencias.RemoveRange(siniestro.Evidencias);
            _context.Siniestros.Remove(siniestro);
            
            await _context.SaveChangesAsync();
            return true;
        }

        // ============ EVIDENCIAS ============

        public async Task<List<SiniestroEvidenciaDTO>> GetEvidenciasAsync(int siniestroId)
        {
            return await _context.SiniestroEvidencias
                .Where(e => e.IdSiniestro == siniestroId)
                .OrderByDescending(e => e.FechaSubida)
                .Select(e => new SiniestroEvidenciaDTO
                {
                    IdEvidencia = e.IdEvidencia,
                    IdSiniestro = e.IdSiniestro,
                    Tipo = e.Tipo,
                    ArchivoBase64 = e.ArchivoBase64,
                    MimeType = e.MimeType,
                    FechaSubida = e.FechaSubida
                })
                .ToListAsync();
        }

        public async Task<SiniestroEvidencia> AddEvidenciaAsync(int siniestroId, SiniestroEvidenciaRequest request)
        {
            var siniestro = await _context.Siniestros.FindAsync(siniestroId);
            if (siniestro == null)
                throw new InvalidOperationException("Siniestro no encontrado");

            var evidencia = new SiniestroEvidencia
            {
                IdSiniestro = siniestroId,
                Tipo = request.Tipo ?? "FOTO",
                ArchivoBase64 = request.ArchivoBase64,
                MimeType = request.MimeType,
                FechaSubida = DateTime.Now
            };

            _context.SiniestroEvidencias.Add(evidencia);
            await _context.SaveChangesAsync();
            return evidencia;
        }

        public async Task<bool> DeleteEvidenciaAsync(int siniestroId, int evidenciaId)
        {
            var evidencia = await _context.SiniestroEvidencias
                .FirstOrDefaultAsync(e => e.IdEvidencia == evidenciaId && e.IdSiniestro == siniestroId);
                
            if (evidencia == null) return false;

            _context.SiniestroEvidencias.Remove(evidencia);
            await _context.SaveChangesAsync();
            return true;
        }

        // ============ ESTATUS ============

        public async Task<List<EstatusSiniestroDTO>> GetEstatusAsync()
        {
            return await _context.EstatusSiniestros
                .OrderBy(e => e.Nombre)
                .Select(e => new EstatusSiniestroDTO
                {
                    IdEstatus = e.IdEstatus,
                    Nombre = e.Nombre,
                    TotalSiniestros = _context.Siniestros.Count(s => s.IdEstatus == e.IdEstatus)
                })
                .ToListAsync();
        }

        public async Task<EstatusSiniestro?> GetEstatusByIdAsync(int id)
        {
            return await _context.EstatusSiniestros.FindAsync(id);
        }

        public async Task<EstatusSiniestro> CreateEstatusAsync(EstatusSiniestroRequest request)
        {
            var estatus = new EstatusSiniestro { Nombre = request.Nombre };
            _context.EstatusSiniestros.Add(estatus);
            await _context.SaveChangesAsync();
            return estatus;
        }

        public async Task<EstatusSiniestro?> UpdateEstatusAsync(int id, EstatusSiniestroRequest request)
        {
            var estatus = await _context.EstatusSiniestros.FindAsync(id);
            if (estatus == null) return null;

            estatus.Nombre = request.Nombre;
            await _context.SaveChangesAsync();
            return estatus;
        }

        public async Task<bool> DeleteEstatusAsync(int id)
        {
            var estatus = await _context.EstatusSiniestros.FindAsync(id);
            if (estatus == null) return false;

            _context.EstatusSiniestros.Remove(estatus);
            await _context.SaveChangesAsync();
            return true;
        }

        // ============ ESTADÍSTICAS ============

        public async Task<object> GetEstadisticasAsync()
        {
            var total = await _context.Siniestros.CountAsync();
            var porEstatus = await _context.EstatusSiniestros
                .Select(e => new
                {
                    e.IdEstatus,
                    e.Nombre,
                    Total = _context.Siniestros.Count(s => s.IdEstatus == e.IdEstatus)
                })
                .ToListAsync();

            var porVehiculo = await _context.Siniestros
                .GroupBy(s => s.IdVehiculo)
                .Select(g => new
                {
                    VehiculoId = g.Key,
                    Total = g.Count()
                })
                .OrderByDescending(x => x.Total)
                .Take(5)
                .ToListAsync();

            return new
            {
                TotalSiniestros = total,
                PorEstatus = porEstatus,
                VehiculosConMasSiniestros = porVehiculo
            };
        }
    }
}