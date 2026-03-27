using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend_SIGMA.Data;
using Backend_SIGMA.Models;
using Backend_SIGMA.Models.Request;
using Backend_SIGMA.Models.DTO;

namespace Backend_SIGMA.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AsignacionesController : ControllerBase
    {
        private readonly AsignacionesData _asignacionesData;

        public AsignacionesController(AsignacionesData asignacionesData)
        {
            _asignacionesData = asignacionesData;
        }

        // GET: api/asignaciones
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var asignaciones = await _asignacionesData.GetAllAsync();
            return Ok(asignaciones);
        }

        // GET: api/asignaciones/activas
        [HttpGet("activas")]
        public async Task<IActionResult> GetActivas()
        {
            var asignaciones = await _asignacionesData.GetActivasAsync();
            return Ok(asignaciones);
        }

        // GET: api/asignaciones/vehiculo/5
        [HttpGet("vehiculo/{vehiculoId}")]
        public async Task<IActionResult> GetByVehiculo(int vehiculoId)
        {
            var asignaciones = await _asignacionesData.GetByVehiculoAsync(vehiculoId);
            return Ok(asignaciones);
        }

        // GET: api/asignaciones/conductor/5
        [HttpGet("conductor/{usuarioId}")]
        public async Task<IActionResult> GetByConductor(int usuarioId)
        {
            var asignaciones = await _asignacionesData.GetByConductorAsync(usuarioId);
            return Ok(asignaciones);
        }

        // GET: api/asignaciones/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var asignacion = await _asignacionesData.GetByIdAsync(id);
            if (asignacion == null)
                return NotFound(new { message = "Asignación no encontrada" });
            return Ok(asignacion);
        }

        // POST: api/asignaciones
        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Create([FromBody] AsignacionCreateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var asignacion = new VehiculoAsignacion
                {
                    IdVehiculo = request.IdVehiculo,
                    IdUsuario = request.IdUsuario,
                    FechaInicio = request.FechaInicio ?? DateTime.Now,
                    Activo = true
                };

                var nueva = await _asignacionesData.CreateAsync(asignacion);
                
                return Ok(new { 
                    message = "Vehículo asignado correctamente",
                    id = nueva.IdAsignacion 
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al crear asignación", error = ex.Message });
            }
        }

        // PUT: api/asignaciones/5/finalizar
        [HttpPut("{id}/finalizar")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Finalizar(int id, [FromBody] AsignacionFinalizarRequest? request)
        {
            var result = await _asignacionesData.FinalizarAsync(id, request?.FechaFin);
            
            if (!result)
                return NotFound(new { message = "Asignación no encontrada o ya finalizada" });

            return Ok(new { message = "Asignación finalizada correctamente" });
        }
    }
}