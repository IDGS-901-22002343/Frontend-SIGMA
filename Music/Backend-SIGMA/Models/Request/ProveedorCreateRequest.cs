using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models.Request
{
    public class ProveedorCreateRequest
    {
        [Required, MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Telefono { get; set; }

        [MaxLength(120), EmailAddress]
        public string? Correo { get; set; }
    }
}