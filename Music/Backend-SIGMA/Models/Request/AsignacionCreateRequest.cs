using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models.Request
{
    public class AsignacionCreateRequest
    {
        [Required]
        public int IdVehiculo { get; set; }

        [Required]
        public int IdUsuario { get; set; }

        public DateTime? FechaInicio { get; set; }
    }
}