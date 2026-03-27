using Microsoft.AspNetCore.Mvc;
using Backend_SIGMA.Data;
using Backend_SIGMA.Models;
using Backend_SIGMA.Models.Request;
using Backend_SIGMA.Services;

namespace Backend_SIGMA.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthData _authData;
        private readonly JwtService _jwtService;

        public AuthController(AuthData authData, JwtService jwtService)
        {
            _authData = authData;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Correo) || string.IsNullOrEmpty(request.Password))
                return BadRequest(new { message = "Correo y contraseña son requeridos" });

            var usuario = await _authData.LoginAsync(request.Correo, request.Password);

            if (usuario == null)
                return Unauthorized(new { message = "Credenciales inválidas" });

            var token = _jwtService.GenerarToken(usuario);

            var response = new LoginResponse
            {
                IdUsuario = usuario.IdUsuario,
                Nombre = usuario.Nombre,
                Correo = usuario.Correo,
                Token = token,
                Rol = usuario.Rol?.Nombre ?? "Usuario",
                IdRol = usuario.IdRol
            };

            return Ok(response);
        }

        [HttpPost("registro")]
        public async Task<IActionResult> Registro([FromBody] RegistroRequest request)
        {
            if (request == null)
                return BadRequest(new { message = "Datos incompletos" });

            // Validar si el correo ya existe
            var existe = await _authData.ExisteCorreo(request.Correo);
            if (existe)
                return BadRequest(new { message = "El correo ya está registrado" });

            var usuario = new Usuario
            {
                Nombre = request.Nombre,
                Correo = request.Correo,
                Telefono = request.Telefono,
                IdRol = request.IdRol,
                Estatus = true,
                FechaCreacion = DateTime.Now
            };

            try
            {
                var nuevoUsuario = await _authData.RegistroAsync(usuario, request.Password);
                
                var token = _jwtService.GenerarToken(nuevoUsuario);

                return Ok(new
                {
                    message = "Usuario registrado correctamente",
                    usuario = new
                    {
                        nuevoUsuario.IdUsuario,
                        nuevoUsuario.Nombre,
                        nuevoUsuario.Correo,
                        nuevoUsuario.Telefono,
                        rol = nuevoUsuario.Rol?.Nombre
                    },
                    token
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al registrar usuario", error = ex.Message });
            }
        }
    }
}