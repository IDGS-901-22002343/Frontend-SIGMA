using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models.Request
{
    public class TipoMantenimientoUpdateRequest
    {
        [MaxLength(50)]
        public string? Nombre { get; set; }

        [MaxLength(150)]
        public string? Descripcion { get; set; }
    }
}