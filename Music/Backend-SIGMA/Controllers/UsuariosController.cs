using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend_SIGMA.Data;
using Backend_SIGMA.Models;
using Backend_SIGMA.Models.Request;

namespace Backend_SIGMA.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Requiere token para acceder
    public class UsuariosController : ControllerBase
    {
        private readonly UsuariosData _usuariosData;

        public UsuariosController(UsuariosData usuariosData)
        {
            _usuariosData = usuariosData;
        }

        [HttpGet]
        [Authorize(Roles = "Administrador")] // Solo admins
        public async Task<IActionResult> GetAll()
        {
            var usuarios = await _usuariosData.GetAllAsync();
            return Ok(usuarios.Select(u => new
            {
                u.IdUsuario,
                u.Nombre,
                u.Correo,
                u.Telefono,
                u.Estatus,
                u.FechaCreacion,
                Rol = u.Rol?.Nombre
            }));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var usuario = await _usuariosData.GetByIdAsync(id);
            if (usuario == null)
                return NotFound();

            return Ok(new
            {
                usuario.IdUsuario,
                usuario.Nombre,
                usuario.Correo,
                usuario.Telefono,
                usuario.Estatus,
                usuario.FechaCreacion,
                usuario.IdRol,
                Rol = usuario.Rol?.Nombre
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UsuarioUpdateRequest request)
        {
            var usuario = await _usuariosData.GetByIdAsync(id);
            if (usuario == null)
                return NotFound();

            usuario.Nombre = request.Nombre ?? usuario.Nombre;
            usuario.Telefono = request.Telefono ?? usuario.Telefono;

            // Si quieres actualizar correo, validar que no exista
            if (!string.IsNullOrEmpty(request.Correo) && request.Correo != usuario.Correo)
            {
                // Aquí validar si el correo ya existe
                usuario.Correo = request.Correo;
            }

            var resultado = await _usuariosData.UpdateAsync(usuario);
            return Ok(new { message = "Usuario actualizado correctamente" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _usuariosData.DeleteAsync(id);
            if (!result)
                return NotFound();

            return Ok(new { message = "Usuario desactivado correctamente" });
        }

        [HttpPut("{id}/cambiar-rol")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> CambiarRol(int id, [FromBody] int idRol)
        {
            var result = await _usuariosData.CambiarRolAsync(id, idRol);
            if (!result)
                return NotFound();

            return Ok(new { message = "Rol actualizado correctamente" });
        }

        // GET: api/usuarios/conductores
        [HttpGet("conductores")]
        public async Task<IActionResult> GetConductores()
        {
            var conductores = await _usuariosData.GetConductoresAsync();
            return Ok(conductores.Select(c => new
            {
                c.IdUsuario,
                c.Nombre,
                c.Correo,
                Rol = c.Rol?.Nombre
            }));
        }

        // GET: api/usuarios/por-rol/3
        [HttpGet("por-rol/{rolId}")]
        public async Task<IActionResult> GetByRol(int rolId)
        {
            var usuarios = await _usuariosData.GetByRolAsync(rolId);
            return Ok(usuarios.Select(u => new
            {
                u.IdUsuario,
                u.Nombre,
                u.Correo
            }));
        }
    }
}