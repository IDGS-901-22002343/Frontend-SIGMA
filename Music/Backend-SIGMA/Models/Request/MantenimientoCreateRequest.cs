using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models.Request
{
    public class MantenimientoCreateRequest
    {
        [Required]
        public int IdVehiculo { get; set; }

        [Required]
        public int IdTipo { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        public int? Kilometraje { get; set; }

        [Range(0, 9999999.99)]
        public decimal? Costo { get; set; }

        public int? IdProveedor { get; set; }

        public string? Observaciones { get; set; }

        [Required]
        public int RegistradoPor { get; set; }
    }
}