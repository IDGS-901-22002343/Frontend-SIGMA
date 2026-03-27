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
    public class MantenimientosController : ControllerBase
    {
        private readonly MantenimientosData _mantenimientosData;

        public MantenimientosController(MantenimientosData mantenimientosData)
        {
            _mantenimientosData = mantenimientosData;
        }

        // ============ MANTENIMIENTOS ============

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? vehiculoId)
        {
            var mantenimientos = await _mantenimientosData.GetAllAsync(vehiculoId);
            return Ok(mantenimientos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var mantenimiento = await _mantenimientosData.GetByIdAsync(id);
            if (mantenimiento == null)
                return NotFound(new { message = "Mantenimiento no encontrado" });

            return Ok(mantenimiento);
        }

        [HttpGet("vehiculo/{vehiculoId}")]
        public async Task<IActionResult> GetByVehiculo(int vehiculoId)
        {
            var mantenimientos = await _mantenimientosData.GetAllAsync(vehiculoId);
            return Ok(mantenimientos);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador,Ejecutivo")]
        public async Task<IActionResult> Create([FromBody] MantenimientoCreateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var mantenimiento = new Mantenimiento
            {
                IdVehiculo = request.IdVehiculo,
                IdTipo = request.IdTipo,
                Fecha = request.Fecha,
                Kilometraje = request.Kilometraje,
                Costo = request.Costo,
                IdProveedor = request.IdProveedor,
                Observaciones = request.Observaciones,
                RegistradoPor = request.RegistradoPor
            };

            var nuevo = await _mantenimientosData.CreateAsync(mantenimiento);
            return Ok(new { 
                message = "Mantenimiento registrado correctamente",
                id = nuevo.IdMantenimiento 
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Update(int id, [FromBody] MantenimientoUpdateRequest request)
        {
            var actualizado = await _mantenimientosData.UpdateAsync(id, request);
            if (actualizado == null)
                return NotFound(new { message = "Mantenimiento no encontrado" });

            return Ok(new { message = "Mantenimiento actualizado correctamente" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _mantenimientosData.DeleteAsync(id);
            if (!result)
                return NotFound(new { message = "Mantenimiento no encontrado" });

            return Ok(new { message = "Mantenimiento eliminado correctamente" });
        }

        // ============ TIPOS DE MANTENIMIENTO ============

        [HttpGet("tipos")]
        public async Task<IActionResult> GetTipos()
        {
            var tipos = await _mantenimientosData.GetTiposAsync();
            return Ok(tipos);
        }

        [HttpGet("tipos/{id}")]
        public async Task<IActionResult> GetTipoById(int id)
        {
            var tipo = await _mantenimientosData.GetTipoByIdAsync(id);
            if (tipo == null)
                return NotFound(new { message = "Tipo de mantenimiento no encontrado" });

            return Ok(tipo);
        }

        [HttpPost("tipos")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> CreateTipo([FromBody] TipoMantenimientoCreateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var tipo = new TipoMantenimiento
            {
                Nombre = request.Nombre,
                Descripcion = request.Descripcion
            };

            var nuevo = await _mantenimientosData.CreateTipoAsync(tipo);
            return Ok(new { 
                message = "Tipo de mantenimiento creado",
                id = nuevo.IdTipo 
            });
        }

        [HttpPut("tipos/{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> UpdateTipo(int id, [FromBody] TipoMantenimientoUpdateRequest request)
        {
            var actualizado = await _mantenimientosData.UpdateTipoAsync(id, request);
            if (actualizado == null)
                return NotFound(new { message = "Tipo de mantenimiento no encontrado" });

            return Ok(new { message = "Tipo de mantenimiento actualizado" });
        }

        [HttpDelete("tipos/{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteTipo(int id)
        {
            var result = await _mantenimientosData.DeleteTipoAsync(id);
            if (!result)
                return NotFound(new { message = "Tipo de mantenimiento no encontrado" });

            return Ok(new { message = "Tipo de mantenimiento eliminado" });
        }

        // ============ PROVEEDORES ============

        [HttpGet("proveedores")]
        public async Task<IActionResult> GetProveedores()
        {
            var proveedores = await _mantenimientosData.GetProveedoresAsync();
            return Ok(proveedores);
        }

        [HttpGet("proveedores/{id}")]
        public async Task<IActionResult> GetProveedorById(int id)
        {
            var proveedor = await _mantenimientosData.GetProveedorByIdAsync(id);
            if (proveedor == null)
                return NotFound(new { message = "Proveedor no encontrado" });

            return Ok(proveedor);
        }

        [HttpPost("proveedores")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> CreateProveedor([FromBody] ProveedorCreateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var proveedor = new Proveedor
            {
                Nombre = request.Nombre,
                Telefono = request.Telefono,
                Correo = request.Correo
            };

            var nuevo = await _mantenimientosData.CreateProveedorAsync(proveedor);
            return Ok(new { 
                message = "Proveedor creado correctamente",
                id = nuevo.IdProveedor 
            });
        }

        [HttpPut("proveedores/{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> UpdateProveedor(int id, [FromBody] ProveedorUpdateRequest request)
        {
            var actualizado = await _mantenimientosData.UpdateProveedorAsync(id, request);
            if (actualizado == null)
                return NotFound(new { message = "Proveedor no encontrado" });

            return Ok(new { message = "Proveedor actualizado correctamente" });
        }

        [HttpDelete("proveedores/{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteProveedor(int id)
        {
            var result = await _mantenimientosData.DeleteProveedorAsync(id);
            if (!result)
                return NotFound(new { message = "Proveedor no encontrado" });

            return Ok(new { message = "Proveedor eliminado correctamente" });
        }
    }
}