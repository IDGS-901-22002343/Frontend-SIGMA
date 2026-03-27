using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend_SIGMA.Data;
using Backend_SIGMA.Models;
using Backend_SIGMA.Models.Request;

namespace Backend_SIGMA.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SiniestrosController : ControllerBase
    {
        private readonly SiniestrosData _siniestrosData;

        public SiniestrosController(SiniestrosData siniestrosData)
        {
            _siniestrosData = siniestrosData;
        }

        // ============ SINIESTROS ============

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int? vehiculoId,
            [FromQuery] int? conductorId,
            [FromQuery] int? estatusId,
            [FromQuery] DateTime? desde,
            [FromQuery] DateTime? hasta,
            [FromQuery] int? atendidoPor)
        {
            var siniestros = await _siniestrosData.GetAllAsync(
                vehiculoId, conductorId, estatusId, desde, hasta, atendidoPor);
            return Ok(siniestros);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var siniestro = await _siniestrosData.GetByIdAsync(id);
            if (siniestro == null)
                return NotFound(new { message = "Siniestro no encontrado" });

            return Ok(siniestro);
        }

        [HttpGet("vehiculo/{vehiculoId}")]
        public async Task<IActionResult> GetByVehiculo(int vehiculoId)
        {
            var siniestros = await _siniestrosData.GetAllAsync(vehiculoId: vehiculoId);
            return Ok(siniestros);
        }

        [HttpGet("conductor/{conductorId}")]
        public async Task<IActionResult> GetByConductor(int conductorId)
        {
            var siniestros = await _siniestrosData.GetAllAsync(conductorId: conductorId);
            return Ok(siniestros);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador,Ejecutivo,Conductor")]
        public async Task<IActionResult> Create([FromBody] SiniestroCreateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var siniestro = new Siniestro
            {
                IdVehiculo = request.IdVehiculo,
                IdConductor = request.IdConductor,
                Descripcion = request.Descripcion,
                Ubicacion = request.Ubicacion,
                IdEstatus = request.IdEstatus,
                AtendidoPor = request.AtendidoPor,
                Fecha = request.Fecha ?? DateTime.Now
            };

            var nuevo = await _siniestrosData.CreateAsync(siniestro);
            
            return Ok(new
            {
                message = "Siniestro registrado correctamente",
                id = nuevo.IdSiniestro
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador,Ejecutivo")]
        public async Task<IActionResult> Update(int id, [FromBody] SiniestroUpdateRequest request)
        {
            var actualizado = await _siniestrosData.UpdateAsync(id, request);
            if (actualizado == null)
                return NotFound(new { message = "Siniestro no encontrado" });

            return Ok(new { message = "Siniestro actualizado correctamente" });
        }

        [HttpPatch("{id}/estatus")]
        [Authorize(Roles = "Administrador,Ejecutivo")]
        public async Task<IActionResult> CambiarEstatus(int id, [FromBody] SiniestroCambiarEstatusRequest request)
        {
            var result = await _siniestrosData.CambiarEstatusAsync(id, request.IdEstatus);
            if (!result)
                return NotFound(new { message = "Siniestro no encontrado" });

            return Ok(new { message = "Estatus actualizado correctamente" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _siniestrosData.DeleteAsync(id);
            if (!result)
                return NotFound(new { message = "Siniestro no encontrado" });

            return Ok(new { message = "Siniestro eliminado correctamente" });
        }

        // ============ EVIDENCIAS ============

        [HttpGet("{id}/evidencias")]
        public async Task<IActionResult> GetEvidencias(int id)
        {
            var evidencias = await _siniestrosData.GetEvidenciasAsync(id);
            return Ok(evidencias);
        }

        [HttpPost("{id}/evidencias")]
        [Authorize(Roles = "Administrador,Ejecutivo,Conductor")]
        public async Task<IActionResult> AddEvidencia(int id, [FromBody] SiniestroEvidenciaRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var evidencia = await _siniestrosData.AddEvidenciaAsync(id, request);
                return Ok(new
                {
                    message = "Evidencia agregada correctamente",
                    id = evidencia.IdEvidencia
                });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}/evidencias/{evidenciaId}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteEvidencia(int id, int evidenciaId)
        {
            var result = await _siniestrosData.DeleteEvidenciaAsync(id, evidenciaId);
            if (!result)
                return NotFound(new { message = "Evidencia no encontrada" });

            return Ok(new { message = "Evidencia eliminada correctamente" });
        }

        // ============ ESTATUS ============

        [HttpGet("estatus")]
        public async Task<IActionResult> GetEstatus()
        {
            var estatus = await _siniestrosData.GetEstatusAsync();
            return Ok(estatus);
        }

        [HttpGet("estatus/{id}")]
        public async Task<IActionResult> GetEstatusById(int id)
        {
            var estatus = await _siniestrosData.GetEstatusByIdAsync(id);
            if (estatus == null)
                return NotFound(new { message = "Estatus no encontrado" });

            return Ok(estatus);
        }

        [HttpPost("estatus")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> CreateEstatus([FromBody] EstatusSiniestroRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var nuevo = await _siniestrosData.CreateEstatusAsync(request);
            return Ok(new
            {
                message = "Estatus creado correctamente",
                id = nuevo.IdEstatus
            });
        }

        [HttpPut("estatus/{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> UpdateEstatus(int id, [FromBody] EstatusSiniestroRequest request)
        {
            var actualizado = await _siniestrosData.UpdateEstatusAsync(id, request);
            if (actualizado == null)
                return NotFound(new { message = "Estatus no encontrado" });

            return Ok(new { message = "Estatus actualizado correctamente" });
        }

        [HttpDelete("estatus/{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteEstatus(int id)
        {
            var result = await _siniestrosData.DeleteEstatusAsync(id);
            if (!result)
                return NotFound(new { message = "Estatus no encontrado" });

            return Ok(new { message = "Estatus eliminado correctamente" });
        }

        // ============ ESTADÍSTICAS ============

        [HttpGet("estadisticas/general")]
        [Authorize(Roles = "Administrador,Ejecutivo")]
        public async Task<IActionResult> GetEstadisticas()
        {
            var stats = await _siniestrosData.GetEstadisticasAsync();
            return Ok(stats);
        }
    }
}