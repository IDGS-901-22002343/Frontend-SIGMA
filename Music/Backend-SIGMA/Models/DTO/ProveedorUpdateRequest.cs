using System.ComponentModel.DataAnnotations;
namespace Backend_SIGMA.Models.Request
{
    public class ProveedorUpdateRequest
    {
        [MaxLength(100)]
        public string? Nombre { get; set; }

        [MaxLength(20)]
        public string? Telefono { get; set; }

        [MaxLength(120), EmailAddress]
        public string? Correo { get; set; }
    }
}