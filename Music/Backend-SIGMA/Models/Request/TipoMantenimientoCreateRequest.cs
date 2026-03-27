using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models.Request
{
    public class TipoMantenimientoCreateRequest
    {
        [Required, MaxLength(50)]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? Descripcion { get; set; }
    }
}