using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models.Request
{
    public class UsuarioCreateRequest
    {
        [Required]
        public string Nombre { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Correo { get; set; } = string.Empty;

        [Required, MinLength(6)]
        public string Password { get; set; } = string.Empty;

        public string? Telefono { get; set; }

        [Required]
        public int IdRol { get; set; }
    }
}