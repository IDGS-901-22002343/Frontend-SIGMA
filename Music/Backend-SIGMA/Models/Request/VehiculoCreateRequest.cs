using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models.Request
{
    public class VehiculoCreateRequest
    {
        [MaxLength(50)]
        public string? NumeroEconomico { get; set; }

        [MaxLength(50)]
        public string? Marca { get; set; }

        [MaxLength(50)]
        public string? Modelo { get; set; }

        public int? Anio { get; set; }

        [MaxLength(20)]
        public string? Placas { get; set; }

        [MaxLength(50)]
        public string? Vin { get; set; }

        public int? KilometrajeActual { get; set; }

        [MaxLength(30)]
        public string? Estatus { get; set; } = "Activo";

        public DateTime? FechaAlta { get; set; } = DateTime.Now;
    }
}