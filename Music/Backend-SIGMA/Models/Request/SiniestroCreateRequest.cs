using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models.Request
{
    public class SiniestroCreateRequest
    {
        [Required]
        public int IdVehiculo { get; set; }

        [Required]
        public int IdConductor { get; set; }

        [Required]
        public string Descripcion { get; set; } = string.Empty;

        public string? Ubicacion { get; set; }

        [Required]
        public int IdEstatus { get; set; }

        public int? AtendidoPor { get; set; }

        public DateTime? Fecha { get; set; } // Opcional, si no se envía se usa la actual
    }
}