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
    public class VehiculosController : ControllerBase
    {
        private readonly VehiculosData _vehiculosData;

        public VehiculosController(VehiculosData vehiculosData)
        {
            _vehiculosData = vehiculosData;
        }

        // GET: api/vehiculos
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var vehiculos = await _vehiculosData.GetAllAsync();
            var dto = vehiculos.Select(v => new VehiculoDTO
            {
                IdVehiculo = v.IdVehiculo,
                NumeroEconomico = v.NumeroEconomico,
                Marca = v.Marca,
                Modelo = v.Modelo,
                Placas = v.Placas,
                Estatus = v.Estatus,
                KilometrajeActual = v.KilometrajeActual,
                Vin = v.Vin,
                Anio = v.Anio,
                FechaAlta = v.FechaAlta,
                ConductorAsignado = v.ConductorAsignado,
                TotalAsignaciones = v.TotalAsignaciones,
                TotalMantenimientos = v.TotalMantenimientos,
                TotalSiniestros = v.TotalSiniestros,
                EstaAsignado = v.EstaAsignado
            });
            return Ok(dto);
        }

        // GET: api/vehiculos/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var vehiculo = await _vehiculosData.GetByIdAsync(id);
            if (vehiculo == null)
                return NotFound(new { message = "Vehículo no encontrado" });

            var dto = new VehiculoDTO
            {
                IdVehiculo = vehiculo.IdVehiculo,
                NumeroEconomico = vehiculo.NumeroEconomico,
                Marca = vehiculo.Marca,
                Modelo = vehiculo.Modelo,
                Anio = vehiculo.Anio,
                Placas = vehiculo.Placas,
                Vin = vehiculo.Vin,
                KilometrajeActual = vehiculo.KilometrajeActual,
                Estatus = vehiculo.Estatus,
                FechaAlta = vehiculo.FechaAlta,
                TotalAsignaciones = vehiculo.Asignaciones?.Count ?? 0,
                TotalMantenimientos = vehiculo.Mantenimientos?.Count ?? 0,
                TotalSiniestros = vehiculo.Siniestros?.Count ?? 0,
                EstaAsignado = vehiculo.Asignaciones?.Any(a => a.Activo) ?? false
            };

            return Ok(dto);
        }

        // POST: api/vehiculos
        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Create([FromBody] VehiculoCreateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var vehiculo = new Vehiculo
            {
                NumeroEconomico = request.NumeroEconomico,
                Marca = request.Marca,
                Modelo = request.Modelo,
                Anio = request.Anio,
                Placas = request.Placas,
                Vin = request.Vin,
                KilometrajeActual = request.KilometrajeActual,
                Estatus = request.Estatus,
                FechaAlta = request.FechaAlta ?? DateTime.Now
            };

            var nuevo = await _vehiculosData.CreateAsync(vehiculo);
            return Ok(new { message = "Vehículo creado", id = nuevo.IdVehiculo });
        }

        // PUT: api/vehiculos/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Update(int id, [FromBody] VehiculoUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var vehiculo = new Vehiculo
            {
                NumeroEconomico = request.NumeroEconomico,
                Marca = request.Marca,
                Modelo = request.Modelo,
                Anio = request.Anio,
                Placas = request.Placas,
                Vin = request.Vin,
                KilometrajeActual = request.KilometrajeActual,
                Estatus = request.Estatus
            };

            var actualizado = await _vehiculosData.UpdateAsync(id, vehiculo);
            if (actualizado == null)
                return NotFound(new { message = "Vehículo no encontrado" });

            return Ok(new { message = "Vehículo actualizado" });
        }

        // DELETE: api/vehiculos/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _vehiculosData.DeleteAsync(id);
            if (!result)
                return NotFound(new { message = "Vehículo no encontrado" });

            return Ok(new { message = "Vehículo eliminado (inactivo)" });
        }

        // GET: api/vehiculos/disponibles
        [HttpGet("disponibles")]
        public async Task<IActionResult> GetDisponibles()
        {
            var vehiculos = await _vehiculosData.GetDisponiblesAsync();
            var dto = vehiculos.Select(v => new VehiculoSimpleDTO
            {
                IdVehiculo = v.IdVehiculo,
                NumeroEconomico = v.NumeroEconomico,
                Marca = v.Marca,
                Modelo = v.Modelo,
                Placas = v.Placas,
                Estatus = v.Estatus
            });
            return Ok(dto);
        }

        // PATCH: api/vehiculos/{id}/estatus
        [HttpPatch("{id}/estatus")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> CambiarEstatus(int id, [FromBody] VehiculoCambiarEstatusRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _vehiculosData.CambiarEstatusAsync(id, request.Estatus);
            if (!result)
                return NotFound(new { message = "Vehículo no encontrado" });

            return Ok(new
            {
                message = $"Estatus actualizado a '{request.Estatus}'",
                id = id,
                nuevoEstatus = request.Estatus
            });
        }
    }
}